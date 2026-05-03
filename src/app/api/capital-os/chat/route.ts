/**
 * CapitalOS — AI Chat API
 * POST /api/capital-os/chat  → streaming AI financial analysis
 *
 * Uses OpenRouter via the Vercel AI SDK's OpenAI-compatible provider.
 * Injects the user's financial context as a system message so the LLM
 * can reason about actual portfolio data.
 */
import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { CapitalAssetType } from "@prisma/client";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

/** Format satangs to THB currency string. */
const toTHB = (satangs: bigint | number) =>
  (Number(satangs) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  });

/** Format a number as compact THB (e.g., "฿350K"). */
const toTHBCompact = (satangs: bigint | number): string => {
  const thb = Number(satangs) / 100;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  if (thb >= 1_000) return `฿${Math.round(thb / 1_000)}K`;
  return `฿${thb.toFixed(0)}`;
};

/** Build a financial context string for the LLM. */
async function buildFinancialContext(userId: string): Promise<string> {
  const [accounts, liabilities, goals, settings, snapshots, syncLogs] =
    await Promise.all([
      prisma.capitalAccount.findMany({
        where: { userId, archivedAt: null },
      }),
      prisma.capitalLiability.findMany({
        where: { userId, archivedAt: null },
      }),
      prisma.capitalGoal.findMany({
        where: { userId, archivedAt: null },
      }),
      prisma.capitalSettings.findUnique({
        where: { userId },
      }),
      prisma.capitalSnapshot.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 3,
      }),
      prisma.capitalSyncLog.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 5,
      }),
    ]);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // ── Core Calculations ──────────────────────────────────────────
  const totalAssets = accounts.reduce((s, a) => s + a.balance, BigInt(0));
  const totalLiab = liabilities.reduce(
    (s, l) => s + (l.balance < BigInt(0) ? -l.balance : l.balance),
    BigInt(0),
  );
  const netWorth = totalAssets - totalLiab;

  const liquidTotal = accounts
    .filter((a) => a.type === CapitalAssetType.LIQUID)
    .reduce((s, a) => s + a.balance, BigInt(0));

  // Burn rate from settings or default to ฿25,000/mo
  const burnRateMonthly = settings?.runwayBurnRate ?? BigInt(2_500_000);
  const burnRateDisplay = toTHBCompact(burnRateMonthly) + "/mo";

  // Runway calculation (months of liquid capital at burn rate)
  const runwayMonths =
    burnRateMonthly > 0
      ? Number(liquidTotal) / Number(burnRateMonthly)
      : 0;
  const runwayDisplay =
    runwayMonths >= 12
      ? `${(runwayMonths / 12).toFixed(1)} years`
      : `${runwayMonths.toFixed(1)} months`;

  // ── Credit Card Debt (high APR liabilities) ──────────────────────
  const creditCards = liabilities.filter(
    (l) => l.apr && Number(l.apr) > 10 && l.balance < 0,
  );
  const creditCardDebt = creditCards.reduce(
    (s, l) => s + (l.balance < BigInt(0) ? -l.balance : l.balance),
    BigInt(0),
  );

  // ── Sync Status ─────────────────────────────────────────────────
  const lastSyncBySource = new Map<string, Date>();
  for (const log of syncLogs) {
    if (!lastSyncBySource.has(log.source)) {
      lastSyncBySource.set(log.source, log.timestamp);
    }
  }

  const daysSince = (date?: Date) =>
    date ? Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const ynabDays = daysSince(lastSyncBySource.get("YNAB"));
  const airtableDays = daysSince(lastSyncBySource.get("AIRTABLE"));

  // ── Snapshot Trend ───────────────────────────────────────────────
  let netWorthChange = 0;
  if (snapshots.length >= 2) {
    const latest = Number(snapshots[0].netWorth);
    const previous = Number(snapshots[snapshots.length - 1].netWorth);
    netWorthChange = latest - previous;
  }

  // ── Build Structured Context ─────────────────────────────────────
  let ctx = `## FINANCIAL STATE SNAPSHOT (${todayStr})\n\n`;

  // Zone 1: Status
  ctx += `NET WORTH: ${toTHB(netWorth)} | LIQUID: ${toTHB(liquidTotal)}\n`;
  ctx += `BURN RATE: ${burnRateDisplay} | RUNWAY: ${runwayDisplay}\n`;

  // Credit Card Debt
  if (creditCardDebt > 0) {
    ctx += `CREDIT CARD DEBT: ${toTHB(creditCardDebt)}`;
    if (creditCards.length > 1) {
      const breakdown = creditCards
        .map((c) => `${c.name} ${toTHBCompact(c.balance < 0 ? -c.balance : c.balance)}`)
        .join(" · ");
      ctx += ` (${breakdown})`;
    }
    ctx += "\n";
  }

  // Sync Status
  ctx += `LAST SYNC: `;
  const syncParts: string[] = [];
  if (ynabDays !== null) {
    syncParts.push(
      ynabDays === 0
        ? "YNAB today"
        : ynabDays === 1
          ? "YNAB 1 day ago"
          : `YNAB ${ynabDays} days ago`,
    );
  }
  if (airtableDays !== null) {
    syncParts.push(
      airtableDays > 30
        ? `Airtable ${airtableDays} days ago (STALE)`
        : airtableDays === 0
          ? "Airtable today"
          : `Airtable ${airtableDays} days ago`,
    );
  }
  ctx += syncParts.join(" | ") || "No recent syncs recorded";
  ctx += "\n\n";

  // Zone 2: Goals (with velocity/urgency)
  if (goals.length > 0) {
    ctx += `## GOALS (${goals.length})\n`;
    for (const g of goals) {
      const pct = Math.round((Number(g.current) / Number(g.target)) * 100);
      const status = pct >= 100 ? "COMPLETE" : pct < 20 ? "CRITICAL" : "IN PROGRESS";

      let line = `- ${g.name}: ${toTHB(g.current)} / ${toTHB(g.target)} (${pct}%)`;

      if (g.deadline) {
        const daysToDeadline = Math.floor(
          (g.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        const monthsToDeadline = daysToDeadline / 30;

        if (daysToDeadline < 0) {
          line += ` — OVERDUE by ${Math.abs(daysToDeadline)} days`;
        } else if (daysToDeadline < 90) {
          // Calculate required monthly contribution
          const remaining = Number(g.target) - Number(g.current);
          const requiredMonthly = remaining / Math.max(monthsToDeadline, 1);
          line += ` — ${Math.ceil(monthsToDeadline)} months remaining, need ${toTHBCompact(requiredMonthly)}/mo`;
        } else {
          line += ` — deadline: ${g.deadline.toISOString().slice(0, 10)}`;
        }
      }

      if (status === "CRITICAL" && g.priority === "CRITICAL") {
        line += " [PRIORITY+CRITICAL]";
      }

      ctx += line + "\n";
    }
    ctx += "\n";
  }

  // Zone 3: Accounts
  ctx += `## ACCOUNTS (${accounts.length})\n`;
  const byType = Object.groupBy(accounts, (a) => a.type);
  for (const [type, accs] of Object.entries(byType)) {
    if (!accs) continue;
    const sum = accs.reduce((s, a) => s + a.balance, BigInt(0));
    ctx += `- ${type}: ${accs.length} accounts, total ${toTHB(sum)}\n`;
    for (const a of accs.slice(0, 5)) {
      ctx += `  • ${a.name}: ${toTHB(a.balance)}\n`;
    }
    if (accs.length > 5) {
      ctx += `  ... and ${accs.length - 5} more\n`;
    }
  }

  // Zone 4: Liabilities with APR
  if (liabilities.length > 0) {
    ctx += `\n## LIABILITIES (${liabilities.length})\n`;
    for (const l of liabilities) {
      const bal = l.balance < 0 ? -l.balance : l.balance;
      ctx += `- ${l.name}: ${toTHB(bal)}`;
      if (l.apr) ctx += ` @ ${l.apr}% APR`;
      if (l.apr && Number(l.apr) > 15) ctx += " [HIGH APR]";
      ctx += "\n";
    }
  }

  // Trend
  if (netWorthChange !== 0) {
    ctx += `\n## TREND\n`;
    ctx += `- Net worth changed ${netWorthChange > 0 ? "+" : ""}${toTHBCompact(netWorthChange)} since ${snapshots[snapshots.length - 1]?.date.toISOString().slice(0, 10) ?? "last snapshot"}\n`;
  }

  return ctx;
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const { messages } = await req.json();
  const financialContext = await buildFinancialContext(auth.session.userId);

  const result = streamText({
    model: openrouter("google/gemini-2.5-flash-lite"),
    system: `You are CapitalOS Intelligence — a sharp, professional financial analyst embedded in a personal wealth dashboard.

Your role:
- Analyze the user's financial data with precision
- Spot patterns, correlations, and anomalies
- Provide actionable insights and strategic recommendations
- Use data-driven reasoning, always referencing specific numbers
- Be concise but thorough — use bullet points and structured responses
- Format currencies as THB (Thai Baht)
- Format dates in European format (e.g. Oct 15, 2025)
- Use 24-hour time format (e.g. 13:30)

The user's current financial context:

${financialContext}

Guidelines:
- Always ground your analysis in the actual data provided above
- When making projections, state your assumptions clearly
- Highlight both risks and opportunities
- If you don't have enough data for a confident analysis, say so
- Never hallucinate financial figures — only use the data provided`,
    messages,
    maxOutputTokens: 2048,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
