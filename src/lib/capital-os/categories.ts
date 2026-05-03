/**
 * CapitalOS — Canonical SA Category Definitions
 *
 * These IDs are the authoritative category keys used in:
 *  - SnapshotWizard: saAssets[].categoryId
 *  - MappingConfig:  saCategory field
 *  - Reconciliation: per-category gap analysis
 *
 * Do NOT change IDs without also migrating existing mapping records.
 */

import { CapitalPortfolioType } from "@/lib/capital-os/types";

export interface SACategory {
  id: string;
  name: string;
  portfolioType: CapitalPortfolioType;
  sortOrder: number;
}

export const STRATEGIC_CATEGORIES: SACategory[] = [
  { id: "strat_bonds",   name: "Bonds",               portfolioType: CapitalPortfolioType.STRATEGIC, sortOrder: 0 },
  { id: "strat_real",    name: "Real Assets",          portfolioType: CapitalPortfolioType.STRATEGIC, sortOrder: 1 },
  { id: "strat_cash",    name: "Cash",                 portfolioType: CapitalPortfolioType.STRATEGIC, sortOrder: 2 },
  { id: "strat_health",  name: "Healthcare",           portfolioType: CapitalPortfolioType.STRATEGIC, sortOrder: 3 },
  { id: "strat_staples", name: "Consumer Staples",     portfolioType: CapitalPortfolioType.STRATEGIC, sortOrder: 4 },
];

export const TACTICAL_CATEGORIES: SACategory[] = [
  { id: "tact_us",       name: "US Equities",          portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 0 },
  { id: "tact_tech",     name: "Info Technology",      portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 1 },
  { id: "tact_regional", name: "Regional Tilts",       portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 2 },
  { id: "tact_fin",      name: "Financials",           portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 3 },
  { id: "tact_disc",     name: "Consumer Discretionary", portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 4 },
  { id: "tact_theme",    name: "Thematics",            portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 5 },
  { id: "tact_div",      name: "Dividends",            portfolioType: CapitalPortfolioType.TACTICAL, sortOrder: 6 },
];

export const ALL_SA_CATEGORIES: SACategory[] = [
  ...STRATEGIC_CATEGORIES,
  ...TACTICAL_CATEGORIES,
];

export const SA_CATEGORY_MAP: Record<string, SACategory> = Object.fromEntries(
  ALL_SA_CATEGORIES.map((c) => [c.id, c])
);
