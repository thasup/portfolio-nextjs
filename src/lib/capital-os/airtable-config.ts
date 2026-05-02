/**
 * CapitalOS — Configurable Airtable Integration (Server-Side)
 *
 * This module provides server-side Airtable client and database operations.
 * For client-safe exports (types/constants), use @/lib/capital-os/airtable-config-shared
 */

import Airtable from "airtable";
import { prisma } from "@/lib/db/prisma";
import type {
  CapitalAirtableEntityType,
  CapitalAirtableConfig,
  CapitalAirtableTableMapping,
  CapitalAirtableSnapshot,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";

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
    priority: "priority",
    deadline: "deadline",
    vehicle: "vehicle",
    archived: "archived",
  },
  SNAPSHOTS: {
    date: "date",
    net_worth: "net_worth",
    liquid: "liquid",
    invested: "invested",
    liabilities: "liabilities",
  },
  HOLDINGS: {
    ticker: "ticker",
    shares: "shares",
    cost_basis: "cost_basis",
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

export interface AirtableConfigWithTables {
  id: string;
  userId: string;
  baseId: string;
  name: string;
  isActive: boolean;
  apiKey?: string; // Loaded from env if not provided
  tables: AirtableTableMapping[];
}

export interface AirtableTableMapping {
  id: string;
  entityType: CapitalAirtableEntityType;
  tableName: string;
  isEnabled: boolean;
  fieldMap: Record<string, string>;
  filterFormula?: string | null;
}

/**
 * Get active Airtable configuration for a user with all table mappings.
 */
export async function getAirtableConfig(
  userId: string,
): Promise<AirtableConfigWithTables | null> {
  const config = await prisma.capitalAirtableConfig.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      tables: {
        where: { isEnabled: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!config) return null;

  return {
    id: config.id,
    userId: config.userId,
    baseId: config.baseId,
    name: config.name,
    isActive: config.isActive,
    apiKey: process.env.AIRTABLE_API_KEY,
    tables: config.tables.map((t) => ({
      id: t.id,
      entityType: t.entityType,
      tableName: t.tableName,
      isEnabled: t.isEnabled,
      fieldMap: (t.fieldMap as Record<string, string>) || {},
      filterFormula: t.filterFormula,
    })),
  };
}

/**
 * Check if user has Airtable configuration set up.
 */
export async function hasAirtableConfig(userId: string): Promise<boolean> {
  const count = await prisma.capitalAirtableConfig.count({
    where: { userId, isActive: true },
  });
  return count > 0;
}

/**
 * Create or update Airtable configuration for a user.
 */
export async function upsertAirtableConfig(
  userId: string,
  data: {
    baseId: string;
    name?: string;
    isActive?: boolean;
    tables: Array<{
      entityType: CapitalAirtableEntityType;
      tableName: string;
      customTitle?: string | null;
      customDescription?: string | null;
      isEnabled?: boolean;
      fieldMap?: Record<string, string>;
      filterFormula?: string;
    }>;
  },
) {
  // Deactivate other configs if this one is active
  if (data.isActive !== false) {
    await prisma.capitalAirtableConfig.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  // Create the config
  const config = await prisma.capitalAirtableConfig.create({
    data: {
      userId,
      baseId: data.baseId,
      name: data.name || "My Airtable Base",
      isActive: data.isActive ?? true,
      tables: {
        create: data.tables.map((t: { entityType: CapitalAirtableEntityType; tableName: string; customTitle?: string | null; customDescription?: string | null; isEnabled?: boolean; fieldMap?: Record<string, string>; filterFormula?: string }) => ({
          entityType: t.entityType,
          tableName: t.tableName,
          customTitle: t.customTitle,
          customDescription: t.customDescription,
          isEnabled: t.isEnabled ?? true,
          fieldMap: t.fieldMap || DEFAULT_FIELD_MAPPINGS[t.entityType as keyof typeof DEFAULT_FIELD_MAPPINGS],
          filterFormula: t.filterFormula,
        })),
      },
    },
    include: { tables: true },
  });

  return config;
}

/**
 * Get an Airtable client configured for a specific base.
 */
export function getAirtableClient(apiKey: string, baseId: string) {
  const airtable = new Airtable({ apiKey });
  return airtable.base(baseId);
}

/**
 * Fetch records from a specific table with field mapping.
 */
export async function fetchAirtableRecords(
  base: Airtable.Base,
  tableMapping: AirtableTableMapping,
  options?: {
    maxRecords?: number;
    pageSize?: number;
  },
): Promise<Array<{ id: string; fields: Record<string, unknown> }>> {
  const { tableName, fieldMap, filterFormula } = tableMapping;
  const { maxRecords = 1000, pageSize = 100 } = options || {};

  try {
    const selectOptions: Airtable.SelectOptions<unknown> = {
      maxRecords,
      pageSize,
    };

    // Add filter formula if provided
    if (filterFormula) {
      selectOptions.filterByFormula = filterFormula;
    }

    const records = await base(tableName).select(selectOptions).all();

    return records.map((record) => ({
      id: record.id,
      fields: record.fields as Record<string, unknown>,
    }));
  } catch (error) {
    console.error(`[CapitalOS] Failed to fetch from ${tableName}:`, error);
    throw new Error(
      `Failed to fetch from Airtable table "${tableName}": ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Store raw Airtable records as snapshots in the database.
 */
export async function storeAirtableSnapshots(
  configId: string,
  userId: string,
  syncRunId: string,
  entityType: CapitalAirtableEntityType,
  records: Array<{ id: string; fields: Record<string, unknown> }>,
): Promise<number> {
  const snapshots = records.map((record) => ({
    configId,
    userId,
    syncRunId,
    entityType,
    recordId: record.id,
    rawData: record.fields as unknown as Prisma.InputJsonValue,
    processed: false,
  }));

  // Batch insert snapshots
  const result = await prisma.capitalAirtableSnapshot.createMany({
    data: snapshots,
    skipDuplicates: true,
  });

  return result.count;
}

/**
 * Get the most recent snapshots for a specific entity type.
 */
export async function getLatestSnapshots(
  configId: string,
  entityType: CapitalAirtableEntityType,
  limit: number = 100,
) {
  // Get the most recent sync run for this config and entity type
  const latestRun = await prisma.capitalAirtableSnapshot.findFirst({
    where: { configId, entityType },
    orderBy: { createdAt: "desc" },
    select: { syncRunId: true },
  });

  if (!latestRun) return [];

  return prisma.capitalAirtableSnapshot.findMany({
    where: {
      configId,
      entityType,
      syncRunId: latestRun.syncRunId,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Update snapshot after processing to link to CapitalOS entity.
 */
export async function markSnapshotProcessed(
  snapshotId: string,
  capitalEntityId?: string,
  errorMessage?: string,
) {
  return prisma.capitalAirtableSnapshot.update({
    where: { id: snapshotId },
    data: {
      processed: true,
      capitalEntityId,
      errorMessage,
    },
  });
}

/**
 * Generate a new sync run ID.
 */
export function generateSyncRunId(): string {
  return crypto.randomUUID();
}

/**
 * Get all snapshots for a user, grouped by sync run.
 */
export async function getSnapshotsByUser(
  userId: string,
  options?: {
    entityType?: CapitalAirtableEntityType;
    configId?: string;
    limit?: number;
    offset?: number;
  },
) {
  const where: Prisma.CapitalAirtableSnapshotWhereInput = { userId };

  if (options?.entityType) {
    where.entityType = options.entityType;
  }

  if (options?.configId) {
    where.configId = options.configId;
  }

  const [snapshots, total] = await Promise.all([
    prisma.capitalAirtableSnapshot.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 100,
      skip: options?.offset ?? 0,
      include: {
        config: {
          select: {
            baseId: true,
            name: true,
          },
        },
      },
    }),
    prisma.capitalAirtableSnapshot.count({ where }),
  ]);

  // Group snapshots by sync run
  const syncRuns = new Map<string, typeof snapshots>();
  for (const snapshot of snapshots) {
    const runId = snapshot.syncRunId;
    if (!syncRuns.has(runId)) {
      syncRuns.set(runId, []);
    }
    syncRuns.get(runId)!.push(snapshot);
  }

  return {
    snapshots,
    syncRuns: Array.from(syncRuns.entries()).map(([syncRunId, items]) => ({
      syncRunId,
      createdAt: items[0]?.createdAt,
      configId: items[0]?.configId,
      baseId: items[0]?.config.baseId,
      baseName: items[0]?.config.name,
      entityTypes: [...new Set(items.map((i) => i.entityType))],
      recordCount: items.length,
      processedCount: items.filter((i) => i.processed).length,
      errorCount: items.filter((i) => i.errorMessage).length,
    })),
    total,
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
  };
}
