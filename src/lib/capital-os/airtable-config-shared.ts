/**
 * CapitalOS — Airtable Configuration (Client-Safe Shared Exports)
 *
 * Types and constants safe for both client and server components.
 */

import type {
  CapitalAirtableEntityType,
  CapitalAirtableConfig,
  CapitalAirtableTableMapping,
  CapitalAirtableSnapshot,
} from "@prisma/client";

export type { CapitalAirtableEntityType };

// Extended types with relations
export type CapitalAirtableConfigWithTables = CapitalAirtableConfig & {
  tables: CapitalAirtableTableMapping[];
};

// Default field mappings for standard CapitalOS entities
export const DEFAULT_FIELD_MAPPINGS: Record<
  CapitalAirtableEntityType,
  Record<string, string>
> = {
  ACCOUNTS: {
    name: "name",
    balance: "balance",
    type: "type",
    icon: "icon",
    archived: "archived",
  },
  LIABILITIES: {
    name: "name",
    balance: "balance",
    apr: "apr",
    icon: "icon",
    archived: "archived",
  },
  GOALS: {
    name: "name",
    current: "current",
    target: "target",
    deadline: "deadline",
    icon: "icon",
    priority: "priority",
  },
  SNAPSHOTS: {
    date: "date",
    netWorth: "net_worth",
    liquid: "liquid",
    invested: "invested",
    liabilities: "liabilities",
    notes: "notes",
  },
  HOLDINGS: {
    symbol: "symbol",
    quantity: "quantity",
    current_price: "current_price",
    portfolio: "portfolio",
  },
};

// Default table names
export const DEFAULT_TABLE_NAMES: Record<CapitalAirtableEntityType, string> = {
  ACCOUNTS: "CapitalAccounts",
  LIABILITIES: "CapitalLiabilities",
  GOALS: "CapitalGoals",
  SNAPSHOTS: "CapitalSnapshots",
  HOLDINGS: "CapitalHoldings",
};
