/**
 * CapitalOS projection engine.
 *
 * Computes 24-month wealth trajectory based on configurable parameters.
 * Adapted from the old prototype's useProjection hook but made
 * framework-agnostic (pure functions, no React hooks).
 */
import { CapitalAssetType, CapitalScenarioMode } from "@/lib/capital-os/types";
import type {
  CapitalAccount,
  CapitalLiability,
  ProjectionPoint,
  CashFlowPoint,
  ProjectionParams,
  CapitalSettings,
} from "@/lib/capital-os/types";
import { MONTHS } from "@/lib/capital-os/format";

// ── Scenario multipliers ────────────────────────────────────────

const SCENARIO_MULTIPLIERS: Record<CapitalScenarioMode, number> = {
  [CapitalScenarioMode.CONSERVATIVE]: 0.7,
  [CapitalScenarioMode.BASE]: 1.0,
  [CapitalScenarioMode.OPTIMISTIC]: 1.3,
};

// ── Core projection ─────────────────────────────────────────────

export interface ProjectionResult {
  points: ProjectionPoint[];
  runwayMonths: number;
  cashFlow: CashFlowPoint[];
  netWorth: number;
  liquid: number;
  invested: number;
  totalAssets: number;
  totalLiabilities: number;
}

/**
 * Compute the full projection result.
 *
 * All monetary values should be in satangs (1/100 THB).
 * Output values are also in satangs.
 */
export function computeProjection(
  params: ProjectionParams,
  accounts: CapitalAccount[],
  liabilities: CapitalLiability[],
  settings?: CapitalSettings | null,
): ProjectionResult {
  const activeAccounts = accounts.filter((a) => !a.archivedAt);
  const activeLiabs = liabilities.filter((l) => !l.archivedAt);

  const tAssets = activeAccounts.reduce((s, a) => s + a.balance, 0);
  const tLiabs = activeLiabs.reduce((s, l) => s + Math.abs(l.balance), 0);
  const nw = tAssets - tLiabs;

  const liquidTotal = activeAccounts
    .filter((a) => a.type === CapitalAssetType.LIQUID)
    .reduce((s, a) => s + a.balance, 0);

  const runwayPoolTotal = settings?.runwayAccountIds?.length
    ? activeAccounts
        .filter((a) => settings.runwayAccountIds.includes(a.id))
        .reduce((s, a) => s + a.balance, 0)
    : liquidTotal;

  const runwayBurnRate = settings?.runwayBurnRate ?? params.burnRate;

  const investedTotal = activeAccounts
    .filter(
      (a) =>
        a.type === CapitalAssetType.INVESTMENT ||
        a.type === CapitalAssetType.SEMI_LIQUID,
    )
    .reduce((s, a) => s + a.balance, 0);

  const mult = SCENARIO_MULTIPLIERS[params.scenarioMode];
  const ssoIncome = 900000; // 9,000 THB in satangs

  // ── 24-month trajectory ──
  const points = computeTrajectory(
    params,
    liquidTotal,
    investedTotal,
    mult,
    ssoIncome,
    runwayBurnRate,
  );

  // ── Runway calculation ──
  const runway = computeRunway(runwayPoolTotal, runwayBurnRate);

  // ── 12-month cash flow ──
  const cashFlow = computeCashFlow(params, mult, ssoIncome, runwayBurnRate);

  return {
    points,
    runwayMonths: runway,
    cashFlow,
    netWorth: nw,
    liquid: liquidTotal,
    invested: investedTotal,
    totalAssets: tAssets,
    totalLiabilities: tLiabs,
  };
}

// ── Internal helpers ────────────────────────────────────────────

function computeTrajectory(
  params: ProjectionParams,
  initialLiquid: number,
  initialPortfolio: number,
  mult: number,
  ssoIncome: number,
  burnRate: number,
): ProjectionPoint[] {
  const months = 24;
  const data: ProjectionPoint[] = [];
  let liquid = initialLiquid;
  let portfolio = initialPortfolio;

  const monthlyReturn = Math.pow(1 + params.investReturn / 100, 1 / 12) - 1;

  const now = new Date();
  const startMonth = now.getMonth();

  for (let i = 0; i <= months; i++) {
    const monthIndex = (startMonth + i) % 12;
    const yearOffset = Math.floor((startMonth + i) / 12);
    const yearSuffix = String(now.getFullYear() + yearOffset).slice(-2);
    const label = i === 0 ? "Now" : `${MONTHS[monthIndex]} '${yearSuffix}`;

    const isSSOActive = i <= params.ssoMonths;
    const isMissionActive = i >= params.missionSuccessMonth;

    const income =
      (isSSOActive ? ssoIncome : 0) +
      (isMissionActive ? Math.round(params.postSuccessIncome * mult) : 0);
    const burn = burnRate;
    const netFlow = income - burn;

    liquid = Math.max(0, liquid + netFlow);
    portfolio = Math.round(portfolio * (1 + monthlyReturn));
    const netWorth = liquid + portfolio;

    data.push({
      label,
      liquid: Math.round(liquid),
      portfolio: Math.round(portfolio),
      netWorth: Math.round(netWorth),
      income: Math.round(income),
      burn: Math.round(burn),
      month: i,
    });
  }

  return data;
}

function computeRunway(liquid: number, burnRate: number): number {
  if (burnRate <= 0) return 60;
  let liq = liquid;
  for (let i = 0; i < 60; i++) {
    liq -= burnRate;
    if (liq <= 0) return i + 1;
  }
  return 60;
}

function computeCashFlow(
  params: ProjectionParams,
  mult: number,
  ssoIncome: number,
  burnRate: number,
): CashFlowPoint[] {
  return MONTHS.map((m, i) => {
    const isSSOActive = i < params.ssoMonths;
    const isMissionActive = i >= params.missionSuccessMonth;
    const income =
      (isSSOActive ? ssoIncome : 0) +
      (isMissionActive ? Math.round(params.postSuccessIncome * mult) : 0);
    return {
      month: m,
      income,
      burn: burnRate,
      net: income - burnRate,
    };
  });
}
