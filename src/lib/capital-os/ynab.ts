/**
 * CapitalOS — YNAB API client (server-only).
 *
 * Fetches account data from YNAB's REST API using the server-side
 * access token. Never exposes the token to the client.
 */
import "server-only";

const YNAB_BASE_URL = "https://api.ynab.com/v1";

// ── YNAB API types ──────────────────────────────────────────────

export interface YNABAccount {
  id: string;
  name: string;
  type: string;
  on_budget: boolean;
  closed: boolean;
  /** Balance in YNAB milliunits (divide by 1000 for currency). */
  balance: number;
  cleared_balance: number;
  uncleared_balance: number;
  deleted: boolean;
  note: string | null;
}

export interface YNABBudget {
  id: string;
  name: string;
  last_modified_on: string;
}

export interface YNABTransaction {
  id: string;
  date: string;
  amount: number;
  memo: string | null;
  payee_name: string | null;
  category_name: string | null;
  approved: boolean;
  deleted: boolean;
}

// ── Service ─────────────────────────────────────────────────────

function getToken(): string {
  const token = process.env.YNAB_ACCESS_TOKEN;
  if (!token) throw new Error("YNAB_ACCESS_TOKEN is not configured");
  return token;
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
}

async function ynabFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${YNAB_BASE_URL}${path}`, {
    headers: headers(),
    next: { revalidate: 300 }, // cache for 5 minutes
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`YNAB API error ${res.status}: ${body}`);
  }
  const json = await res.json();
  return json.data;
}

/** List all budgets. */
export async function getBudgets(): Promise<YNABBudget[]> {
  const data = await ynabFetch<{ budgets: YNABBudget[] }>("/budgets");
  return data.budgets;
}

/** List accounts for a budget (default = "last-used"). */
export async function getAccounts(
  budgetId = "last-used",
): Promise<YNABAccount[]> {
  const data = await ynabFetch<{ accounts: YNABAccount[] }>(
    `/budgets/${budgetId}/accounts`,
  );
  return data.accounts.filter((a) => !a.deleted && !a.closed);
}

/** Get recent transactions for a budget. */
export async function getTransactions(
  budgetId = "last-used",
  sinceDate?: string,
): Promise<YNABTransaction[]> {
  const qs = sinceDate ? `?since_date=${sinceDate}` : "";
  const data = await ynabFetch<{ transactions: YNABTransaction[] }>(
    `/budgets/${budgetId}/transactions${qs}`,
  );
  return data.transactions.filter((t) => !t.deleted);
}

/**
 * Convert YNAB milliunits to satangs (1/100 THB).
 * YNAB: 1 THB = 1000 milliunits
 * Satangs: 1 THB = 100 satangs
 * So: milliunits ÷ 10 = satangs
 */
export function milliunitsToSatangs(milliunits: number): number {
  return Math.round(milliunits / 10);
}
