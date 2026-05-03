/**
 * MarketOS — TypeScript mirror of `marketos_member_stats` (SQL view).
 *
 * The SQL view in `prisma/migrations/20260427000002_marketos_views_and_rls/`
 * is the single source of truth. This file mirrors that math so the UI can
 * preview reputation changes client-side and so unit tests can verify the
 * SQL output against the same fixtures.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §6.6, §6.2, §6.5.
 *
 * If you change a formula here, change the SQL view in the same commit.
 */
import { Tier } from "@/lib/marketos/types";

// ---------- Reputation & tier --------------------------------------------

export interface ReputationInputs {
  /** Number of completed missions where this member won the bid. */
  completed: number;
  /** Number of those completed missions delivered on or before the deadline. */
  onTime: number;
  /** Average peer rating (1–5). null = no reviews yet. */
  avgRating: number | null;
}

export interface ReputationResult {
  reputation: number; // clamped 0–1000
  onTimePct: number | null; // null when completed === 0
  tier: Tier;
}

export function computeOnTimePct(
  completed: number,
  onTime: number,
): number | null {
  if (completed <= 0) return null;
  return Math.round((100 * onTime) / completed);
}

export function computeReputation(inputs: ReputationInputs): ReputationResult {
  const { completed, onTime, avgRating } = inputs;
  const onTimePct = computeOnTimePct(completed, onTime);

  // SQL: (completed * 30) + (on_time_pct * 2) + (avg_rating * 40)
  const fromCompleted = completed * 30;
  const fromOnTime = onTimePct == null ? 0 : onTimePct * 2;
  const fromRating = avgRating == null ? 0 : Math.round(avgRating * 40);

  const raw = fromCompleted + fromOnTime + fromRating;
  const reputation = Math.max(0, Math.min(1000, raw));

  return { reputation, onTimePct, tier: tierFromReputation(reputation) };
}

export function tierFromReputation(reputation: number): Tier {
  if (reputation < 200) return Tier.Bronze;
  if (reputation < 500) return Tier.Silver;
  if (reputation < 800) return Tier.Gold;
  if (reputation < 1000) return Tier.Platinum;
  return Tier.Diamond;
}

// ---------- Pool composition (spec §6.2) ---------------------------------

export interface PoolInputs {
  revenueCents: bigint | number;
  payrollRatioPct: number; // 0–100
  baseSplitPct: number; // 0–100
  /** Sum of `marketos_payouts.amount_cents` for the period where status='scheduled'. */
  missionsLockedCents: bigint | number;
}

export interface PoolComposition {
  totalCents: number;
  baseCents: number;
  missionBudgetCents: number;
  missionsLockedCents: number;
  unallocatedCents: number;
}

export function computePool(inputs: PoolInputs): PoolComposition {
  const revenue = Number(inputs.revenueCents);
  const ratio = inputs.payrollRatioPct;
  const baseSplit = inputs.baseSplitPct;

  const totalCents = Math.floor((revenue * ratio) / 100);
  const baseCents = Math.floor((totalCents * baseSplit) / 100);
  const missionBudgetCents = totalCents - baseCents;
  const missionsLockedCents = Number(inputs.missionsLockedCents);
  const unallocatedCents = Math.max(
    0,
    missionBudgetCents - missionsLockedCents,
  );

  return {
    totalCents,
    baseCents,
    missionBudgetCents,
    missionsLockedCents,
    unallocatedCents,
  };
}

// ---------- Bid rate (spec §6.5) -----------------------------------------

export function computeBidRatePct(
  totalDecided: number,
  accepted: number,
): number | null {
  if (totalDecided <= 0) return null;
  return Math.round((100 * accepted) / totalDecided);
}

// ---------- Money helpers ------------------------------------------------

/** Convert a `bigint` cents value to integer dollars (rounded down). */
export function centsToDollars(cents: bigint | number): number {
  return Math.floor(Number(cents) / 100);
}

/** Convert integer dollars to `bigint` cents. */
export function dollarsToCents(dollars: number): bigint {
  return BigInt(Math.round(dollars * 100));
}
