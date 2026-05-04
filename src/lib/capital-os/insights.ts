/**
 * CapitalOS Insight Engine
 *
 * Pure computation layer — zero LLM spend.
 * Rule-based intelligence organized by financial domain.
 * Each domain returns an array of CapitalOSInsight objects sorted by severity.
 */

import type {
  CapitalGoal,
  CapitalAccount,
  CapitalLiability,
  CapitalGoalPriority,
} from "@/lib/capital-os/types";
import { CapitalGoalCategory } from "@/lib/capital-os/types";
import { fmtCurrency } from "@/lib/capital-os/format";

// ── Core types ─────────────────────────────────────────────────────

export type InsightLevel = "success" | "warning" | "info" | "critical";

export interface CapitalOSInsight {
  id: string;
  level: InsightLevel;
  title: string;
  body: string;
  metric?: string; // highlighted stat, e.g. "฿120,000" or "24 months"
}

// ── Internal helpers ───────────────────────────────────────────────

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44;
const DAY_MS = 1000 * 60 * 60 * 24;

function monthsUntil(deadline: string): number {
  return (new Date(deadline).getTime() - Date.now()) / MONTH_MS;
}

function daysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / DAY_MS);
}

// Severity rank for sorting (critical > warning > info > success)
const LEVEL_RANK: Record<InsightLevel, number> = {
  critical: 4,
  warning: 3,
  info: 2,
  success: 1,
};

function sortInsights(insights: CapitalOSInsight[]): CapitalOSInsight[] {
  return [...insights].sort(
    (a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level],
  );
}

// ── Goal Domain ────────────────────────────────────────────────────

export interface GoalInsightContext {
  /** Display value (raw / 100) */
  targetNum: number;
  /** Display value (raw / 100) */
  currentNum: number;
  /** Monthly allocation display value (raw / 100) */
  allocationNum: number;
  deadline?: string | null;
  category?: string | null;
  /** Monthly burn rate display value (raw / 100) */
  monthlyBurnRate?: number;
  /** Total liquid balance display value (raw / 100) */
  totalLiquid?: number;
  liquidAccountCount?: number;
}

export function computeGoalInsights(ctx: GoalInsightContext): CapitalOSInsight[] {
  const {
    targetNum,
    currentNum,
    allocationNum,
    deadline,
    category,
    monthlyBurnRate = 0,
    totalLiquid = 0,
    liquidAccountCount = 0,
  } = ctx;

  const insights: CapitalOSInsight[] = [];
  const remaining = Math.max(0, targetNum - currentNum);
  const progress = targetNum > 0 ? (currentNum / targetNum) * 100 : 0;
  const monthsNeeded =
    allocationNum > 0 ? Math.ceil(remaining / allocationNum) : null;

  // ── Progress milestones ──
  if (progress >= 100) {
    return [
      {
        id: "goal-complete",
        level: "success",
        title: "Goal achieved! 🎉",
        body: "You've hit your target. Consider directing surplus allocation toward another goal or increasing your investment base.",
        metric: "100% complete",
      },
    ];
  }

  if (progress >= 75) {
    insights.push({
      id: "goal-75pct",
      level: "success",
      title: "Final stretch — 75% reached",
      body: `Only ${fmtCurrency(remaining)} remaining. Keep consistent allocations and you'll cross the finish line.`,
      metric: `${Math.round(progress)}%`,
    });
  } else if (progress >= 50) {
    insights.push({
      id: "goal-50pct",
      level: "info",
      title: "Halfway milestone",
      body: `${Math.round(progress)}% of the way there — ${fmtCurrency(remaining)} still to go. Momentum is building.`,
      metric: `${Math.round(progress)}%`,
    });
  } else if (progress >= 25) {
    insights.push({
      id: "goal-25pct",
      level: "info",
      title: "Good start — 25% complete",
      body: `You've covered ${Math.round(progress)}% of ${fmtCurrency(targetNum)}. Compounding consistency matters more than size at this stage.`,
      metric: `${Math.round(progress)}%`,
    });
  }

  // ── Deadline × allocation feasibility ──
  if (monthsNeeded !== null && deadline) {
    const monthsAvail = monthsUntil(deadline);
    const daysLeft = daysUntil(deadline);

    if (daysLeft < 0) {
      insights.push({
        id: "goal-overdue",
        level: "critical",
        title: "Deadline has passed",
        body: `This goal is ${Math.abs(Math.round(daysLeft / 30))} month(s) overdue. Extend the deadline or boost your allocation to get back on track.`,
        metric: `${Math.abs(daysLeft)}d overdue`,
      });
    } else if (daysLeft <= 30) {
      insights.push({
        id: "goal-imminent",
        level: "critical",
        title: "Deadline in under a month",
        body: `Only ${daysLeft} days left and ${fmtCurrency(remaining)} still needed. Act immediately to close the gap.`,
        metric: `${daysLeft} days left`,
      });
    } else if (monthsNeeded <= monthsAvail) {
      insights.push({
        id: "goal-on-track",
        level: "success",
        title: "On track to meet deadline",
        body: `At ${fmtCurrency(allocationNum)}/mo you'll reach this in ${monthsNeeded} months — ${Math.floor(monthsAvail - monthsNeeded)} months before the deadline.`,
        metric: `${monthsNeeded} months`,
      });
    } else {
      const requiredMonthly =
        monthsAvail > 0 ? Math.ceil(remaining / monthsAvail) : null;
      insights.push({
        id: "goal-behind",
        level: "warning",
        title: "Behind schedule",
        body: `Current pace reaches this in ${monthsNeeded} months but deadline is in ${Math.floor(monthsAvail)} months.${
          requiredMonthly
            ? ` Increase allocation to ${fmtCurrency(requiredMonthly)}/mo to stay on track.`
            : ""
        }`,
        metric: `${Math.round(monthsNeeded - monthsAvail)}mo behind`,
      });
    }
  } else if (monthsNeeded !== null) {
    // Has allocation, no deadline
    const years = Math.ceil(monthsNeeded / 12);
    insights.push({
      id: "goal-timeline",
      level: "info",
      title: `Reach this in ~${monthsNeeded} months`,
      body: `At ${fmtCurrency(allocationNum)}/mo you'll hit ${fmtCurrency(targetNum)} in approximately ${monthsNeeded} months (~${years} year${years !== 1 ? "s" : ""}).`,
      metric: `${monthsNeeded} months`,
    });
  } else if (deadline && !allocationNum) {
    insights.push({
      id: "goal-no-allocation",
      level: "info",
      title: "Add a monthly allocation",
      body: "Set a monthly allocation amount to unlock timeline projections and deadline feasibility analysis.",
    });
  }

  // ── Category-specific intelligence ──
  if (category === CapitalGoalCategory.EMERGENCY_FUND && monthlyBurnRate > 0) {
    const monthsCovered = currentNum / monthlyBurnRate;
    if (monthsCovered < 3) {
      insights.push({
        id: "emergency-critical",
        level: "critical",
        title: "Emergency fund dangerously low",
        body: `${monthsCovered.toFixed(1)} months of expenses covered — financial advisors recommend 3–6 months minimum. This is your highest-priority financial safety net.`,
        metric: `${monthsCovered.toFixed(1)}× coverage`,
      });
    } else if (monthsCovered < 6) {
      insights.push({
        id: "emergency-ok",
        level: "warning",
        title: "Build toward 6 months coverage",
        body: `${monthsCovered.toFixed(1)} months covered. The 6-month buffer handles extended job loss or medical events without liquidating investments.`,
        metric: `${monthsCovered.toFixed(1)}× coverage`,
      });
    } else {
      insights.push({
        id: "emergency-strong",
        level: "success",
        title: "Emergency fund is solid",
        body: `${monthsCovered.toFixed(1)} months fully covered. You're in the safe zone — redirect surplus toward wealth-building goals.`,
        metric: `${monthsCovered.toFixed(1)}× coverage`,
      });
    }
  }

  if (category === CapitalGoalCategory.RETIREMENT && monthlyBurnRate > 0) {
    const annualExpenses = monthlyBurnRate * 12;
    const fireTarget = annualExpenses * 25; // 4% rule
    const fireProgress = fireTarget > 0 ? (currentNum / fireTarget) * 100 : 0;
    if (fireProgress >= 100) {
      insights.push({
        id: "retirement-fire",
        level: "success",
        title: "FIRE number reached",
        body: `Based on the 4% rule, your current balance can sustain ${fmtCurrency(annualExpenses)}/yr in perpetuity. Financial independence is achievable.`,
        metric: "FIRE ✓",
      });
    } else {
      insights.push({
        id: "retirement-fire-progress",
        level: "info",
        title: `${fireProgress.toFixed(0)}% toward FIRE number`,
        body: `The 4% rule FIRE target is 25× annual expenses = ${fmtCurrency(fireTarget)}. You're ${fireProgress.toFixed(1)}% there. Time in market beats timing the market.`,
        metric: `${fireProgress.toFixed(0)}% of FIRE`,
      });
    }
  }

  if (category === CapitalGoalCategory.DEBT_PAYOFF) {
    insights.push({
      id: "debt-strategy",
      level: "info",
      title: "Debt elimination strategy",
      body: "Avalanche method (highest APR first) minimizes total interest paid. Snowball method (smallest balance first) builds momentum through quick wins. High-interest debt (>15% APR) = guaranteed return equal to the rate.",
    });
  }

  if (category === CapitalGoalCategory.INVESTMENT && totalLiquid > 0 && monthlyBurnRate > 0) {
    const safeBuffer = monthlyBurnRate * 6;
    const deployable = totalLiquid - safeBuffer;
    if (deployable > targetNum * 0.1) {
      insights.push({
        id: "investment-deployable",
        level: "info",
        title: "Investable capital above emergency buffer",
        body: `After a 6-month buffer (${fmtCurrency(safeBuffer)}), you have ~${fmtCurrency(Math.max(0, deployable))} that could be directed here without compromising liquidity.`,
        metric: fmtCurrency(Math.max(0, deployable)),
      });
    }
  }

  if (
    category === CapitalGoalCategory.MAJOR_PURCHASE &&
    totalLiquid > 0 &&
    liquidAccountCount > 0
  ) {
    insights.push({
      id: "purchase-liquidity",
      level: "info",
      title: `${fmtCurrency(totalLiquid)} liquid across ${liquidAccountCount} account${liquidAccountCount > 1 ? "s" : ""}`,
      body: "Ensure your purchase fund is held in a liquid account (not locked FD) so you can access it when needed.",
      metric: fmtCurrency(totalLiquid),
    });
  }

  if (category === CapitalGoalCategory.TRAVEL) {
    insights.push({
      id: "travel-timing",
      level: "info",
      title: "Consider FX timing",
      body: "If your destination uses USD or EUR, booking flights 6–8 weeks ahead and using a no-FX-fee card can save 3–5% versus same-day conversion.",
    });
  }

  if (category === CapitalGoalCategory.BUSINESS) {
    insights.push({
      id: "business-runway",
      level: "info",
      title: "Capital vs. personal runway",
      body: "Keep your business capital separate from your personal emergency fund. Ensure you have 6+ personal months covered before deploying into business operations.",
    });
  }

  return sortInsights(insights);
}

// ── Account Domain ─────────────────────────────────────────────────

export function computeAccountInsights(
  accounts: CapitalAccount[],
  liabilities: CapitalLiability[],
): CapitalOSInsight[] {
  const insights: CapitalOSInsight[] = [];
  const active = accounts.filter((a) => !a.archivedAt);
  if (active.length === 0) return insights;

  const totalBalance = active.reduce((s, a) => s + a.balance, 0) / 100;
  const totalLiabilities =
    liabilities.filter((l) => !l.archivedAt).reduce((s, l) => s + l.balance, 0) / 100;

  const LIQUID_TYPES = new Set(["CASH", "SAVINGS", "CHECKING", "FCD"]);
  const liquidBalance =
    active
      .filter((a) => LIQUID_TYPES.has(a.type))
      .reduce((s, a) => s + a.balance, 0) / 100;

  const cashPct = totalBalance > 0 ? (liquidBalance / totalBalance) * 100 : 0;
  const debtRatio = totalBalance > 0 ? totalLiabilities / totalBalance : 0;
  const netWorth = totalBalance - totalLiabilities;

  // Cash concentration
  if (totalBalance > 100000) {
    if (cashPct > 70) {
      insights.push({
        id: "acc-cash-heavy",
        level: "warning",
        title: `${cashPct.toFixed(0)}% held in cash — inflation risk`,
        body: `Over 70% in liquid cash loses real value to inflation (~3–5%/yr). After maintaining 6 months of expenses as buffer, consider moving excess into index funds or bonds.`,
        metric: `${cashPct.toFixed(0)}% liquid`,
      });
    } else if (cashPct < 10) {
      insights.push({
        id: "acc-cash-low",
        level: "warning",
        title: "Low cash liquidity",
        body: `Only ${cashPct.toFixed(0)}% of assets are liquid. Ensure you have 3–6 months of expenses accessible without liquidating investments in a downturn.`,
        metric: `${cashPct.toFixed(0)}% liquid`,
      });
    } else {
      insights.push({
        id: "acc-cash-balanced",
        level: "success",
        title: "Balanced liquid-to-invested ratio",
        body: `${cashPct.toFixed(0)}% in liquid assets — a healthy balance between accessibility and investment growth.`,
        metric: `${cashPct.toFixed(0)}% liquid`,
      });
    }
  }

  // Debt-to-asset ratio
  if (debtRatio > 0.5) {
    insights.push({
      id: "acc-dta-high",
      level: "warning",
      title: `Liabilities are ${(debtRatio * 100).toFixed(0)}% of assets`,
      body: `Total debt (${fmtCurrency(totalLiabilities)}) represents ${(debtRatio * 100).toFixed(0)}% of your assets. Prioritize debt elimination to improve financial resilience and net worth trajectory.`,
      metric: `${(debtRatio * 100).toFixed(0)}% DTA`,
    });
  } else if (debtRatio < 0.15 && totalLiabilities > 0) {
    insights.push({
      id: "acc-dta-strong",
      level: "success",
      title: "Healthy debt-to-asset ratio",
      body: `Liabilities at ${(debtRatio * 100).toFixed(0)}% of assets — well within safe range. Your balance sheet is strong.`,
      metric: `${(debtRatio * 100).toFixed(0)}% DTA`,
    });
  }

  // Net worth
  if (netWorth < 0) {
    insights.push({
      id: "acc-nw-negative",
      level: "critical",
      title: "Negative net worth",
      body: `Liabilities exceed assets by ${fmtCurrency(Math.abs(netWorth))}. Focus on debt reduction before expanding investment positions.`,
      metric: fmtCurrency(netWorth),
    });
  } else if (netWorth > 0) {
    insights.push({
      id: "acc-nw-positive",
      level: "success",
      title: "Positive net worth",
      body: `Net worth: ${fmtCurrency(netWorth)}. Assets exceed liabilities — a solid foundation for compounding wealth.`,
      metric: fmtCurrency(netWorth),
    });
  }

  // Check for unlinked accounts with large balances
  const unlinkedCount = active.filter((a) => !a.externalId && a.balance > 500000).length;
  if (unlinkedCount > 0) {
    insights.push({
      id: "acc-unlinked",
      level: "info",
      title: `${unlinkedCount} manually-tracked account${unlinkedCount > 1 ? "s" : ""}`,
      body: "Manually-tracked accounts require periodic updates to keep your net worth accurate. Connect them via YNAB or Airtable sync for real-time balances.",
      metric: `${unlinkedCount} manual`,
    });
  }

  return sortInsights(insights);
}

// ── Portfolio / Dashboard Domain ────────────────────────────────────

export interface PortfolioInsightContext {
  accounts: CapitalAccount[];
  liabilities: CapitalLiability[];
  goals: CapitalGoal[];
  /** Monthly burn rate in satangs */
  monthlyBurnRateSatangs: number;
}

export function computePortfolioInsights(
  ctx: PortfolioInsightContext,
): CapitalOSInsight[] {
  const { accounts, liabilities, goals, monthlyBurnRateSatangs } = ctx;
  const insights: CapitalOSInsight[] = [];

  const active = accounts.filter((a) => !a.archivedAt);
  const activeGoals = goals.filter((g) => !g.archivedAt && !g.completedAt);
  const burnDisplay = monthlyBurnRateSatangs / 100;

  const LIQUID_TYPES = new Set(["CASH", "SAVINGS", "CHECKING", "FCD"]);
  const liquidBalance =
    active
      .filter((a) => LIQUID_TYPES.has(a.type))
      .reduce((s, a) => s + a.balance, 0) / 100;

  // Runway analysis
  if (burnDisplay > 0 && liquidBalance > 0) {
    const runwayMonths = liquidBalance / burnDisplay;

    if (runwayMonths < 3) {
      insights.push({
        id: "portfolio-runway-critical",
        level: "critical",
        title: "Critical: less than 3 months runway",
        body: `Liquid assets cover only ${runwayMonths.toFixed(1)} months at ${fmtCurrency(burnDisplay)}/mo. Reduce discretionary spend immediately and prioritize emergency fund contributions.`,
        metric: `${runwayMonths.toFixed(1)} months`,
      });
    } else if (runwayMonths < 6) {
      insights.push({
        id: "portfolio-runway-low",
        level: "warning",
        title: "Runway below 6-month safety threshold",
        body: `${runwayMonths.toFixed(1)} months of coverage. Building to 6 months creates the resilience buffer needed before making career moves or investment risks.`,
        metric: `${runwayMonths.toFixed(1)} months`,
      });
    } else if (runwayMonths >= 24) {
      insights.push({
        id: "portfolio-runway-excellent",
        level: "success",
        title: "Exceptional runway",
        body: `${runwayMonths.toFixed(0)} months of coverage — a level of security that unlocks flexibility for career transitions, business ventures, or strategic investments.`,
        metric: `${runwayMonths.toFixed(0)} months`,
      });
    } else {
      insights.push({
        id: "portfolio-runway-ok",
        level: "info",
        title: `${runwayMonths.toFixed(1)} months runway`,
        body: `Solid coverage at current burn rate. Reaching 12+ months of runway signals strong financial resilience.`,
        metric: `${runwayMonths.toFixed(0)} months`,
      });
    }
  }

  // Overdue goals
  const overdueGoals = activeGoals.filter(
    (g) => g.deadline && daysUntil(g.deadline) < 0,
  );
  if (overdueGoals.length > 0) {
    insights.push({
      id: "portfolio-overdue-goals",
      level: "critical",
      title: `${overdueGoals.length} overdue goal${overdueGoals.length > 1 ? "s" : ""}`,
      body: `${overdueGoals.map((g) => g.name).join(", ")} ${overdueGoals.length === 1 ? "is" : "are"} past deadline. Update dates to keep your financial plan realistic.`,
      metric: `${overdueGoals.length} overdue`,
    });
  }

  // Critical goals without allocation
  const criticalUnallocated = activeGoals.filter(
    (g) =>
      (g.priority as string) === "CRITICAL" &&
      (!g.monthlyAllocation || g.monthlyAllocation <= 0),
  );
  if (criticalUnallocated.length > 0) {
    insights.push({
      id: "portfolio-critical-unallocated",
      level: "warning",
      title: "Critical goals without monthly allocation",
      body: `${criticalUnallocated.map((g) => g.name).join(", ")} — CRITICAL priority but no monthly allocation set. Add allocations to enable timeline projections.`,
      metric: `${criticalUnallocated.length} unplanned`,
    });
  }

  // Imminent deadlines (within 60 days)
  const imminentGoals = activeGoals.filter((g) => {
    const d = g.deadline ? daysUntil(g.deadline) : null;
    return d !== null && d >= 0 && d <= 60;
  });
  if (imminentGoals.length > 0) {
    insights.push({
      id: "portfolio-imminent-goals",
      level: "warning",
      title: `${imminentGoals.length} goal${imminentGoals.length > 1 ? "s" : ""} due within 60 days`,
      body: `Upcoming: ${imminentGoals.map((g) => `${g.name} (${daysUntil(g.deadline!)}d)`).join(", ")}. Review allocations to ensure you can meet these.`,
      metric: "60d window",
    });
  }

  // All goals complete
  const allGoalsComplete =
    activeGoals.length === 0 && goals.filter((g) => g.completedAt).length > 0;
  if (allGoalsComplete) {
    insights.push({
      id: "portfolio-all-complete",
      level: "success",
      title: "All goals completed",
      body: "Every tracked goal has been achieved. Create new goals to keep your capital working with intention.",
    });
  }

  return sortInsights(insights);
}

// ── Liability Domain ────────────────────────────────────────────────

export interface LiabilityInsightContext {
  liabilities: CapitalLiability[];
  totalAssets?: number; // display value
}

export function computeLiabilityInsights(
  ctx: LiabilityInsightContext,
): CapitalOSInsight[] {
  const { liabilities, totalAssets = 0 } = ctx;
  const insights: CapitalOSInsight[] = [];
  const active = liabilities.filter((l) => !l.archivedAt);

  if (active.length === 0) {
    return [
      {
        id: "liab-zero",
        level: "success",
        title: "Completely debt-free",
        body: "Zero outstanding liabilities. All income and returns can flow directly into wealth accumulation — a powerful compounding position.",
        metric: "฿0",
      },
    ];
  }

  const totalBalance =
    active.reduce((s, l) => s + l.balance, 0) / 100;

  // High-interest debt heuristic (name-based)
  const HIGH_INTEREST_KEYWORDS = [
    "credit",
    "card",
    "personal loan",
    "payday",
    "overdraft",
  ];
  const highInterest = active.filter((l) =>
    HIGH_INTEREST_KEYWORDS.some((kw) =>
      l.name.toLowerCase().includes(kw),
    ),
  );

  if (highInterest.length > 0) {
    const hiTotal =
      highInterest.reduce((s, l) => s + l.balance, 0) / 100;
    insights.push({
      id: "liab-high-interest",
      level: "critical",
      title: "High-interest debt — pay this first",
      body: `${fmtCurrency(hiTotal)} across ${highInterest.length} high-interest account${highInterest.length > 1 ? "s" : ""}. At 15–25% APR, every baht paid off is a guaranteed risk-free return. Avalanche method recommended.`,
      metric: fmtCurrency(hiTotal),
    });
  }

  // Debt-to-asset ratio
  if (totalAssets > 0) {
    const dta = totalBalance / totalAssets;
    if (dta > 0.5) {
      insights.push({
        id: "liab-dta-high",
        level: "warning",
        title: `Total debt = ${(dta * 100).toFixed(0)}% of assets`,
        body: `${fmtCurrency(totalBalance)} in liabilities vs. ${fmtCurrency(totalAssets)} in assets. A DTA above 50% limits financial flexibility and increases risk in economic downturns.`,
        metric: `${(dta * 100).toFixed(0)}% DTA`,
      });
    } else if (dta < 0.2) {
      insights.push({
        id: "liab-dta-healthy",
        level: "success",
        title: "Low debt-to-asset ratio",
        body: `Liabilities are only ${(dta * 100).toFixed(0)}% of assets (${fmtCurrency(totalBalance)} vs. ${fmtCurrency(totalAssets)}). Your balance sheet is in strong shape.`,
        metric: `${(dta * 100).toFixed(0)}% DTA`,
      });
    }
  }

  // Strategy guidance
  if (active.length >= 2 && highInterest.length === 0) {
    insights.push({
      id: "liab-strategy",
      level: "info",
      title: "Debt strategy: avalanche vs. snowball",
      body: "With multiple liabilities, the avalanche method (highest rate first) saves the most money. The snowball method (smallest balance first) provides psychological wins if motivation is the challenge.",
    });
  }

  return sortInsights(insights);
}

// ── Scenario Domain ─────────────────────────────────────────────────

export interface ScenarioInsightContext {
  /** Display values */
  burnRate: number;
  liquidBalance: number;
  ssoMonths: number;
  postSuccessIncome: number;
  missionSuccessMonth: number;
}

export function computeScenarioInsights(
  ctx: ScenarioInsightContext,
): CapitalOSInsight[] {
  const { burnRate, liquidBalance, ssoMonths, postSuccessIncome, missionSuccessMonth } = ctx;
  const insights: CapitalOSInsight[] = [];

  if (burnRate <= 0 || liquidBalance <= 0) return insights;

  const runwayMonths = liquidBalance / burnRate;

  // Pre-mission viability
  if (runwayMonths < missionSuccessMonth) {
    const shortfall = (missionSuccessMonth - runwayMonths) * burnRate;
    insights.push({
      id: "scenario-runway-short",
      level: "critical",
      title: "Runway may not reach mission success",
      body: `${runwayMonths.toFixed(0)} months of coverage vs. target month ${missionSuccessMonth}. Shortfall: ~${fmtCurrency(shortfall)}. Reduce burn rate or increase liquid reserves.`,
      metric: `${runwayMonths.toFixed(0)} / ${missionSuccessMonth} months`,
    });
  } else {
    const buffer = runwayMonths - missionSuccessMonth;
    insights.push({
      id: "scenario-runway-clears",
      level: "success",
      title: "Runway clears mission success",
      body: `Liquid assets cover ${runwayMonths.toFixed(0)} months — ${buffer.toFixed(0)} months of buffer beyond mission month ${missionSuccessMonth}. Strong execution window.`,
      metric: `+${buffer.toFixed(0)} month buffer`,
    });
  }

  // SSO income impact
  if (ssoMonths > 0) {
    insights.push({
      id: "scenario-sso-bridge",
      level: "info",
      title: `${ssoMonths} months of SSO income`,
      body: `SSO payments bridge the gap before mission success income kicks in. Ensure SSO is factored into your runway calculation — liquid capital + SSO stream together determine true runway.`,
      metric: `${ssoMonths} months`,
    });
  }

  // Post-mission income sufficiency
  if (postSuccessIncome > 0) {
    const coverageRatio = postSuccessIncome / burnRate;
    if (coverageRatio >= 1.5) {
      insights.push({
        id: "scenario-post-income-strong",
        level: "success",
        title: "Post-mission income exceeds burn",
        body: `${fmtCurrency(postSuccessIncome)}/mo income covers ${(coverageRatio).toFixed(1)}× your ${fmtCurrency(burnRate)}/mo burn. Mission success puts you in accumulation mode.`,
        metric: `${coverageRatio.toFixed(1)}× coverage`,
      });
    } else if (coverageRatio < 1) {
      insights.push({
        id: "scenario-post-income-low",
        level: "warning",
        title: "Post-mission income below burn rate",
        body: `${fmtCurrency(postSuccessIncome)}/mo covers only ${(coverageRatio * 100).toFixed(0)}% of ${fmtCurrency(burnRate)}/mo burn. Capital reserves will continue depleting after mission success.`,
        metric: `${(coverageRatio * 100).toFixed(0)}% covered`,
      });
    }
  }

  // Optimistic runway deployment
  if (runwayMonths > 48) {
    const surplusAbove36 = (runwayMonths - 36) * burnRate;
    insights.push({
      id: "scenario-deploy-surplus",
      level: "info",
      title: "Surplus capital beyond 36-month buffer",
      body: `With ${runwayMonths.toFixed(0)} months of runway, ~${fmtCurrency(surplusAbove36)} sits above a 36-month safety buffer. Consider deploying this into income-generating assets.`,
      metric: fmtCurrency(surplusAbove36),
    });
  }

  return sortInsights(insights);
}
