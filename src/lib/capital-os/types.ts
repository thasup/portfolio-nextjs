/**
 * CapitalOS type re-exports and utility types.
 *
 * Re-exports Prisma enums from the schema and defines additional
 * types used across the CapitalOS prototype.
 */

// ── Enums (re-exported from Prisma schema) ──────────────────────
import {
  CapitalAssetType as _CapitalAssetType,
  CapitalGoalPriority as _CapitalGoalPriority,
  CapitalAccountSource as _CapitalAccountSource,
} from "@prisma/client";

export const CapitalAssetType = _CapitalAssetType;
export type CapitalAssetType = _CapitalAssetType;

export const CapitalGoalPriority = _CapitalGoalPriority;
export type CapitalGoalPriority = _CapitalGoalPriority;

export const CapitalAccountSource = _CapitalAccountSource;
export type CapitalAccountSource = _CapitalAccountSource;

// ScenarioMode is projection-only — not persisted in the database.
export enum CapitalScenarioMode {
  CONSERVATIVE = "CONSERVATIVE",
  BASE = "BASE",
  OPTIMISTIC = "OPTIMISTIC",
}

// ── Record types ────────────────────────────────────────────────

export interface CapitalAccount {
  id: string;
  userId: string;
  name: string;
  /** Balance in satangs (1/100 THB). Divide by 100 for display. */
  balance: number;
  type: CapitalAssetType;
  source: CapitalAccountSource;
  externalId: string | null;
  icon: string | null;
  color: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CapitalLiability {
  id: string;
  userId: string;
  name: string;
  /** Negative balance in satangs. */
  balance: number;
  apr: number | null;
  icon: string | null;
  color: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CapitalGoal {
  id: string;
  userId: string;
  name: string;
  /** Current amount in satangs. */
  current: number;
  /** Target amount in satangs. */
  target: number;
  deadline: string | null;
  priority: CapitalGoalPriority;
  vehicle: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CapitalSnapshot {
  id: string;
  userId: string;
  date: string;
  netWorth: number;
  liquid: number;
  invested: number;
  liabilities: number;
  createdAt: string;
}

// ── Projection types ────────────────────────────────────────────

export interface ProjectionPoint {
  label: string;
  liquid: number;
  portfolio: number;
  netWorth: number;
  income: number;
  burn: number;
  month: number;
}

export interface CashFlowPoint {
  month: string;
  income: number;
  burn: number;
  net: number;
}

export interface ProjectionParams {
  burnRate: number;
  ssoMonths: number;
  investReturn: number;
  missionSuccessMonth: number;
  postSuccessIncome: number;
  scenarioMode: CapitalScenarioMode;
}

// ── Dashboard metric type ───────────────────────────────────────

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: string;
  color: string;
  trend: "up" | "down" | "neutral";
}
