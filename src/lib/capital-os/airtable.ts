import Airtable from "airtable";
import type { CapitalAssetType, CapitalGoalPriority } from "@prisma/client";

/**
 * CapitalOS — Airtable Integration Client
 *
 * This client provides read/write access to the user's Airtable base,
 * which acts as a secondary data source alongside YNAB.
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

// Configure the Airtable SDK (will silently fail if keys are missing, handled at runtime)
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/**
 * Validates that Airtable is properly configured.
 */
export function isAirtableConfigured(): boolean {
  return Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

// ── Raw Table Interfaces ────────────────────────────────────────

export interface AirtableAccountRecord {
  id: string;
  name: string;
  balance: number; // in THB
  type: CapitalAssetType;
  icon?: string;
  archived?: boolean;
}

export interface AirtableLiabilityRecord {
  id: string;
  name: string;
  balance: number; // in THB (negative)
  apr?: number;
  icon?: string;
  archived?: boolean;
}

export interface AirtableGoalRecord {
  id: string;
  name: string;
  current: number; // in THB
  target: number; // in THB
  priority: CapitalGoalPriority;
  deadline?: string; // ISO date
  vehicle?: string;
  archived?: boolean;
}

// ── Fetch Methods ───────────────────────────────────────────────

/**
 * Fetch all active accounts from Airtable.
 */
export async function getAirtableAccounts(): Promise<AirtableAccountRecord[]> {
  if (!isAirtableConfigured()) return [];

  try {
    const records = await base("CapitalAccounts")
      .select({ filterByFormula: "NOT({archived} = TRUE())" })
      .all();

    return records.map((record) => ({
      id: record.id,
      name: record.get("name") as string,
      balance: (record.get("balance") as number) ?? 0,
      type: (record.get("type") as CapitalAssetType) ?? "LIQUID",
      icon: record.get("icon") as string | undefined,
      archived: Boolean(record.get("archived")),
    }));
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch Airtable accounts:", error);
    return [];
  }
}

/**
 * Fetch all active liabilities from Airtable.
 */
export async function getAirtableLiabilities(): Promise<
  AirtableLiabilityRecord[]
> {
  if (!isAirtableConfigured()) return [];

  try {
    const records = await base("CapitalLiabilities")
      .select({ filterByFormula: "NOT({archived} = TRUE())" })
      .all();

    return records.map((record) => ({
      id: record.id,
      name: record.get("name") as string,
      balance: (record.get("balance") as number) ?? 0,
      apr: record.get("apr") as number | undefined,
      icon: record.get("icon") as string | undefined,
      archived: Boolean(record.get("archived")),
    }));
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch Airtable liabilities:", error);
    return [];
  }
}

/**
 * Fetch all active goals from Airtable.
 */
export async function getAirtableGoals(): Promise<AirtableGoalRecord[]> {
  if (!isAirtableConfigured()) return [];

  try {
    const records = await base("CapitalGoals")
      .select({ filterByFormula: "NOT({archived} = TRUE())" })
      .all();

    return records.map((record) => ({
      id: record.id,
      name: record.get("name") as string,
      current: (record.get("current") as number) ?? 0,
      target: (record.get("target") as number) ?? 0,
      priority: (record.get("priority") as CapitalGoalPriority) ?? "MEDIUM",
      deadline: record.get("deadline") as string | undefined,
      vehicle: record.get("vehicle") as string | undefined,
      archived: Boolean(record.get("archived")),
    }));
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch Airtable goals:", error);
    return [];
  }
}
