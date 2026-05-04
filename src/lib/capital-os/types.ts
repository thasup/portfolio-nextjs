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
  CapitalMappingRole as _CapitalMappingRole,
  CapitalPortfolioType as _CapitalPortfolioType,
  CapitalInsightSeverity as _CapitalInsightSeverity,
} from "@prisma/client";

export const CapitalAssetType = _CapitalAssetType;
export type CapitalAssetType = _CapitalAssetType;

export const CapitalGoalPriority = _CapitalGoalPriority;
export type CapitalGoalPriority = _CapitalGoalPriority;

export const CapitalAccountSource = _CapitalAccountSource;
export type CapitalAccountSource = _CapitalAccountSource;

// CapitalOS v4 Dual-Source Enums
export const CapitalMappingRole = _CapitalMappingRole;
export type CapitalMappingRole = _CapitalMappingRole;

export const CapitalPortfolioType = _CapitalPortfolioType;
export type CapitalPortfolioType = _CapitalPortfolioType;

export const CapitalInsightSeverity = _CapitalInsightSeverity;
export type CapitalInsightSeverity = _CapitalInsightSeverity;

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

export interface CapitalSettings {
  userId: string;
  runwayBurnRate: number; // Stored as satangs, but handled as number in JS
  runwayAccountIds: string[];
  updatedAt: string;
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

export interface CapitalScenario {
  id: string;
  name: string;
  burnRate: number;
  ssoMonths: number;
  investReturn: number;
  missionSuccessMonth: number;
  postSuccessIncome: number;
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

// ── SA Portfolio types (CapitalOS v4) ─────────────────────────

export interface CapitalSACategory {
  id: string;
  userId: string;
  portfolioType: CapitalPortfolioType;
  name: string;
  targetPct: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  assets?: CapitalSAAsset[];
}

export interface CapitalSAAsset {
  id: string;
  categoryId: string;
  ticker: string;
  name: string;
  valueThb: number | null;
  shares: number | null;
  targetPct: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CapitalMappingConfig {
  id: string;
  userId: string;
  ynabAccId: string;
  saCategory: string | null;
  role: CapitalMappingRole;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Reconciliation types ───────────────────────────────────────

export interface ReconciliationRow {
  category: string;
  portfolioType: CapitalPortfolioType;
  saValue: number;    // Live value from SA snapshot (satangs)
  ynabValue: number;  // Sum of mapped YNAB accounts (satangs)
  gap: number;        // ynabValue - saValue
  mappedAccounts: string[]; // YNAB account names
}

// ── Agent Insight types ────────────────────────────────────────

export type AgentInsightAgent = "Analyst" | "Advisor" | "Accountant" | "Strategist";

export interface AgentInsight {
  id: string;
  agent: AgentInsightAgent;
  icon: string;  // emoji
  severity: CapitalInsightSeverity;
  title: string;
  body: string;
  action?: string;
  actionHref?: string;
}
