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

/** Build a financial context string for the LLM. */
async function buildFinancialContext(userId: string): Promise<string> {
  const [accounts, liabilities, goals] = await Promise.all([
    prisma.capitalAccount.findMany({
      where: { userId, archivedAt: null },
    }),
    prisma.capitalLiability.findMany({
      where: { userId, archivedAt: null },
    }),
    prisma.capitalGoal.findMany({
      where: { userId, archivedAt: null },
    }),
  ]);

  const toTHB = (satangs: bigint) =>
    (Number(satangs) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    });

  const totalAssets = accounts.reduce((s, a) => s + a.balance, BigInt(0));
  const totalLiab = liabilities.reduce(
    (s, l) => s + (l.balance < BigInt(0) ? -l.balance : l.balance),
    BigInt(0),
  );
  const netWorth = totalAssets - totalLiab;

  const liquidTotal = accounts
    .filter((a) => a.type === CapitalAssetType.LIQUID)
    .reduce((s, a) => s + a.balance, BigInt(0));

  let ctx = `## User's Financial Snapshot (as of ${new Date().toISOString().slice(0, 10)})\n\n`;
  ctx += `- **Net Worth:** ${toTHB(netWorth)}\n`;
  ctx += `- **Total Assets:** ${toTHB(totalAssets)}\n`;
  ctx += `- **Total Liabilities:** ${toTHB(totalLiab)}\n`;
  ctx += `- **Liquid Capital:** ${toTHB(liquidTotal)}\n\n`;

  ctx += `### Accounts (${accounts.length})\n`;
  for (const a of accounts) {
    ctx += `- ${a.name} (${a.type}): ${toTHB(a.balance)}\n`;
  }

  if (liabilities.length > 0) {
    ctx += `\n### Liabilities (${liabilities.length})\n`;
    for (const l of liabilities) {
      ctx += `- ${l.name}: ${toTHB(l.balance)}${l.apr ? ` @ ${l.apr}% APR` : ""}\n`;
    }
  }

  if (goals.length > 0) {
    ctx += `\n### Financial Goals (${goals.length})\n`;
    for (const g of goals) {
      const pct = Math.round((Number(g.current) / Number(g.target)) * 100);
      ctx += `- ${g.name} (${g.priority}): ${toTHB(g.current)} / ${toTHB(g.target)} (${pct}%)`;
      if (g.deadline)
        ctx += ` — deadline: ${g.deadline.toISOString().slice(0, 10)}`;
      ctx += "\n";
    }
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
