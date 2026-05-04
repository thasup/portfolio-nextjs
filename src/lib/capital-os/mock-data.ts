/**
 * CapitalOS mock data.
 *
 * Seeded values for Phase 1 (before YNAB/Airtable integration).
 * Inspired by the old prototype data but restructured for the new type system.
 * All balances are in whole THB (not satangs) for mock convenience.
 */
import {
  CapitalAssetType,
  CapitalAccountSource,
  CapitalGoalPriority,
  CapitalGoalCategory,
} from "@/lib/capital-os/types";
import type {
  CapitalAccount,
  CapitalLiability,
  CapitalGoal,
} from "@/lib/capital-os/types";

export const MOCK_ACCOUNTS: CapitalAccount[] = [
  {
    id: "acc-001",
    userId: "mock",
    name: "KBank (Cash)",
    balance: 41170000,
    type: CapitalAssetType.LIQUID,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "🏦",
    color: "#10b981",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-002",
    userId: "mock",
    name: "Digital Savings",
    balance: 1550000,
    type: CapitalAssetType.LIQUID,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "💳",
    color: "#34d399",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-003",
    userId: "mock",
    name: "Finnomena",
    balance: 11576400,
    type: CapitalAssetType.SEMI_LIQUID,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "📊",
    color: "#6366f1",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-004",
    userId: "mock",
    name: "Stocks (Thai)",
    balance: 10534900,
    type: CapitalAssetType.INVESTMENT,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "📈",
    color: "#f59e0b",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-005",
    userId: "mock",
    name: "Gold",
    balance: 4711200,
    type: CapitalAssetType.INVESTMENT,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "🥇",
    color: "#fbbf24",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-006",
    userId: "mock",
    name: "DIME FCD (USD)",
    balance: 3400000,
    type: CapitalAssetType.SEMI_LIQUID,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "💵",
    color: "#8b5cf6",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-007",
    userId: "mock",
    name: "SCBAM Funds",
    balance: 600000,
    type: CapitalAssetType.INVESTMENT,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "🏛️",
    color: "#a78bfa",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-008",
    userId: "mock",
    name: "DIME ETFs",
    balance: 300000,
    type: CapitalAssetType.INVESTMENT,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "🌐",
    color: "#c4b5fd",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-009",
    userId: "mock",
    name: "Wedding Fund",
    balance: 300000,
    type: CapitalAssetType.GOAL_FUND,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "💍",
    color: "#f43f5e",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "acc-010",
    userId: "mock",
    name: "PPE (Hardware)",
    balance: 9020000,
    type: CapitalAssetType.FIXED_ASSET,
    source: CapitalAccountSource.MANUAL,
    externalId: null,
    icon: "💻",
    color: "#64748b",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
];

export const MOCK_LIABILITIES: CapitalLiability[] = [
  {
    id: "liab-001",
    userId: "mock",
    name: "TTB Credit Card",
    balance: -4091800,
    apr: 18,
    icon: "💳",
    color: "#ef4444",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "liab-002",
    userId: "mock",
    name: "Shopee Credit",
    balance: -436300,
    apr: 15,
    icon: "🛒",
    color: "#f97316",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "liab-003",
    userId: "mock",
    name: "Owed to Praew",
    balance: -200000,
    apr: 0,
    icon: "🤝",
    color: "#fb923c",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
];

export const MOCK_GOALS: CapitalGoal[] = [
  {
    id: "goal-001",
    userId: "mock",
    name: "Emergency Fund 🚨",
    current: 5868800,
    target: 10000000,
    deadline: null,
    priority: CapitalGoalPriority.CRITICAL,
    category: CapitalGoalCategory.EMERGENCY_FUND,
    description: "6-month safety buffer held in USD FCD for FX-hedged liquidity.",
    monthlyAllocation: 150000,
    linkedAccountId: "acc-006",
    completedAt: null,
    vehicle: "USD FCD 4.5%",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "goal-002",
    userId: "mock",
    name: "Business Venture 📊",
    current: 9299400,
    target: 18000000,
    deadline: "2029-05-01",
    priority: CapitalGoalPriority.HIGH,
    category: CapitalGoalCategory.BUSINESS,
    description: "Capital reserve to self-fund a bootstrapped product business.",
    monthlyAllocation: 250000,
    linkedAccountId: null,
    completedAt: null,
    vehicle: "High-yield savings",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "goal-003",
    userId: "mock",
    name: "Wedding Fund 💍",
    current: 300000,
    target: 15000000,
    deadline: "2027-12-01",
    priority: CapitalGoalPriority.HIGH,
    category: CapitalGoalCategory.WEDDING,
    description: "All-in wedding budget including ceremony, reception, and honeymoon.",
    monthlyAllocation: 500000,
    linkedAccountId: "acc-009",
    completedAt: null,
    vehicle: "Money Market",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "goal-004",
    userId: "mock",
    name: "Lifestyle Fund ⛱️",
    current: 1550000,
    target: 4000000,
    deadline: "2027-09-01",
    priority: CapitalGoalPriority.MEDIUM,
    category: CapitalGoalCategory.TRAVEL,
    description: "Asia travel & lifestyle experiences fund for 2027 sabbatical.",
    monthlyAllocation: 100000,
    linkedAccountId: "acc-002",
    completedAt: null,
    vehicle: "Short-term FI",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "goal-005",
    userId: "mock",
    name: "Retirement 🌱",
    current: 13255700,
    target: 1090717700,
    deadline: "2046-01-01",
    priority: CapitalGoalPriority.LOW,
    category: CapitalGoalCategory.RETIREMENT,
    description: "Long-horizon FIRE target; 25x annual expenses at ฿43K/mo burn rate.",
    monthlyAllocation: 500000,
    linkedAccountId: "acc-003",
    completedAt: null,
    vehicle: "Equity / ETF",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "goal-006",
    userId: "mock",
    name: "Praew Education 🎓",
    current: 750000,
    target: 10800000,
    deadline: "2044-01-01",
    priority: CapitalGoalPriority.LOW,
    category: CapitalGoalCategory.EDUCATION,
    description: "University fund for a child's full 4-year degree program.",
    monthlyAllocation: 50000,
    linkedAccountId: null,
    completedAt: null,
    vehicle: "Fixed income",
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
];

// ── Helpers ─────────────────────────────────────────────────────

/** Sum account balances in satangs, grouped by type. */
export function sumByType(
  accounts: CapitalAccount[],
  type: CapitalAssetType,
): number {
  return accounts
    .filter((a) => a.type === type && !a.archivedAt)
    .reduce((sum, a) => sum + a.balance, 0);
}

/** Total of all non-archived account balances (satangs). */
export function totalAssets(accounts: CapitalAccount[]): number {
  return accounts
    .filter((a) => !a.archivedAt)
    .reduce((sum, a) => sum + a.balance, 0);
}

/** Total of all non-archived liability balances (satangs, negative). */
export function totalLiabilities(liabilities: CapitalLiability[]): number {
  return liabilities
    .filter((l) => !l.archivedAt)
    .reduce((sum, l) => sum + Math.abs(l.balance), 0);
}

/** Net worth = assets - liabilities (satangs). */
export function netWorth(
  accounts: CapitalAccount[],
  liabilities: CapitalLiability[],
): number {
  return totalAssets(accounts) - totalLiabilities(liabilities);
}
