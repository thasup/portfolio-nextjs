import Airtable from "airtable";
import type { CapitalAssetType, CapitalGoalPriority } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

/**
 * CapitalOS — Airtable Integration Client
 *
 * This client provides read/write access to the user's Airtable base.
 * Supports per-user configurations stored in the database.
 *
 * @deprecated Legacy env var approach - Use getAirtableClient() instead
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";

/**
 * Airtable client configuration
 */
export interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

/**
 * Error thrown when Airtable is not configured
 */
export class AirtableNotConfiguredError extends Error {
  constructor(message = "Airtable is not configured for this user") {
    super(message);
    this.name = "AirtableNotConfiguredError";
  }
}

/**
 * Get active Airtable configuration for a user
 * @returns Config or null if not configured
 */
export async function getUserAirtableConfig(
  userId: string
): Promise<AirtableConfig | null> {
  const config = await prisma.capitalAirtableConfig.findFirst({
    where: {
      userId,
      isActive: true,
    },
    select: {
      baseId: true,
    },
  });

  if (!config || !AIRTABLE_API_KEY) {
    return null;
  }

  return {
    apiKey: AIRTABLE_API_KEY,
    baseId: config.baseId,
  };
}

/**
 * Get an Airtable client instance for a specific user
 * @throws {AirtableNotConfiguredError} If Airtable is not configured
 */
export async function getAirtableClient(
  userId: string
): Promise<Airtable.Base> {
  const config = await getUserAirtableConfig(userId);

  if (!config) {
    throw new AirtableNotConfiguredError();
  }

  return new Airtable({ apiKey: config.apiKey }).base(config.baseId);
}

/**
 * Validates that Airtable API key is configured (global check)
 * @deprecated Use getUserAirtableConfig() instead
 */
export function isAirtableConfigured(): boolean {
  return Boolean(AIRTABLE_API_KEY);
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
 * Fetch all active accounts from Airtable for a user.
 * @param userId - The user ID to fetch accounts for
 * @param tableName - Optional custom table name (defaults to "CapitalAccounts")
 * @returns Array of account records or empty array if not configured
 */
export async function getAirtableAccounts(
  userId: string,
  tableName = "CapitalAccounts"
): Promise<AirtableAccountRecord[]> {
  try {
    const base = await getAirtableClient(userId);

    const records = await base(tableName)
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
    if (error instanceof AirtableNotConfiguredError) {
      console.warn(`[CapitalOS] Airtable not configured for user ${userId}`);
      return [];
    }

    console.error("[CapitalOS] Failed to fetch Airtable accounts:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Fetch all active liabilities from Airtable for a user.
 * @param userId - The user ID to fetch liabilities for
 * @param tableName - Optional custom table name (defaults to "CapitalLiabilities")
 * @returns Array of liability records or empty array if not configured
 */
export async function getAirtableLiabilities(
  userId: string,
  tableName = "CapitalLiabilities"
): Promise<AirtableLiabilityRecord[]> {
  try {
    const base = await getAirtableClient(userId);

    const records = await base(tableName)
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
    if (error instanceof AirtableNotConfiguredError) {
      console.warn(`[CapitalOS] Airtable not configured for user ${userId}`);
      return [];
    }

    console.error("[CapitalOS] Failed to fetch Airtable liabilities:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Fetch all active goals from Airtable for a user.
 * @param userId - The user ID to fetch goals for
 * @param tableName - Optional custom table name (defaults to "CapitalGoals")
 * @returns Array of goal records or empty array if not configured
 */
export async function getAirtableGoals(
  userId: string,
  tableName = "CapitalGoals"
): Promise<AirtableGoalRecord[]> {
  try {
    const base = await getAirtableClient(userId);

    const records = await base(tableName)
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
    if (error instanceof AirtableNotConfiguredError) {
      console.warn(`[CapitalOS] Airtable not configured for user ${userId}`);
      return [];
    }

    console.error("[CapitalOS] Failed to fetch Airtable goals:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
