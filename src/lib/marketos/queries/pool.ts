import "server-only";
import { prisma } from "@/lib/db/prisma";
import { computePool, centsToDollars } from "@/lib/marketos/calc";
import {
  type PoolCompositionDTO,
  type PoolHistoryEntryDTO,
  type UpcomingPayoutDTO,
} from "@/lib/marketos/types";

/**
 * MarketOS — pool & payout reads.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §6.2, §6.3, §6.4, §8.9.
 *
 * The "pool composition" widget on the Sidebar and the Dashboard share
 * the same query. The Pool page additionally renders a history bar
 * chart and an upcoming-payouts table.
 */

/**
 * Spec §6.2 — pool composition for the **current** revenue period.
 * Returns `null` if the org has no current period (a fresh org or
 * misconfigured seed). Callers should render an empty-state in that
 * case rather than guessing values.
 */
export async function getCurrentPool(
  orgId: string,
): Promise<PoolCompositionDTO | null> {
  const current = await prisma.marketosRevenuePeriod.findFirst({
    where: { orgId, isCurrent: true },
  });
  if (!current) return null;

  // Sum scheduled payouts against this period to compute "missions locked".
  const lockedAgg = await prisma.marketosPayout.aggregate({
    where: {
      orgId,
      revenuePeriodId: current.id,
      status: "scheduled",
    },
    _sum: { amountCents: true },
  });
  const missionsLockedCents = lockedAgg._sum.amountCents ?? BigInt(0);

  const composition = computePool({
    revenueCents: current.revenueCents,
    payrollRatioPct: current.payrollRatioPct,
    baseSplitPct: current.baseSplitPct,
    missionsLockedCents,
  });

  return {
    periodLabel: current.periodLabel,
    ratio: current.payrollRatioPct,
    baseSplit: current.baseSplitPct,
    revenueUsd: centsToDollars(current.revenueCents),
    totalUsd: centsToDollars(composition.totalCents),
    baseUsd: centsToDollars(composition.baseCents),
    missionsLockedUsd: centsToDollars(composition.missionsLockedCents),
    unallocatedUsd: centsToDollars(composition.unallocatedCents),
    isCurrent: true,
  };
}

/**
 * Spec §6.3 — pool history for the bar chart on `/app/pool`.
 * Sorted oldest → newest. The current period is included with
 * `isCurrent=true` so the UI can highlight it.
 */
export async function getPoolHistory(
  orgId: string,
): Promise<PoolHistoryEntryDTO[]> {
  const periods = await prisma.marketosRevenuePeriod.findMany({
    where: { orgId },
    orderBy: { periodStart: "asc" },
    select: {
      periodLabel: true,
      revenueCents: true,
      payrollRatioPct: true,
      isCurrent: true,
    },
  });
  return periods.map((p) => {
    const totalCents = Math.floor(
      (Number(p.revenueCents) * p.payrollRatioPct) / 100,
    );
    return {
      periodLabel: p.periodLabel,
      totalUsd: centsToDollars(totalCents),
      isCurrent: p.isCurrent,
    };
  });
}

/**
 * Spec §6.4 — upcoming payouts table on `/app/pool`.
 * Returns scheduled payouts in chronological order.
 */
export async function getUpcomingPayouts(
  orgId: string,
  options: { limit?: number } = {},
): Promise<UpcomingPayoutDTO[]> {
  const rows = await prisma.marketosPayout.findMany({
    where: { orgId, status: "scheduled" },
    orderBy: { scheduledFor: "asc" },
    take: options.limit,
    select: {
      id: true,
      scheduledFor: true,
      amountCents: true,
      mission: { select: { title: true } },
      recipient: { select: { displayName: true } },
    },
  });
  return rows.map((r) => ({
    payoutId: r.id,
    scheduledFor: r.scheduledFor.toISOString(),
    amountUsd: centsToDollars(r.amountCents),
    missionTitle: r.mission.title,
    recipientName: r.recipient.displayName,
  }));
}
