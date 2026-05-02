/**
 * CapitalOS — Configurable Airtable Sync Engine
 *
 * This engine performs sync operations using user-configurable Airtable
 * bases and tables, storing raw snapshots for audit purposes.
 */

import { prisma } from "@/lib/db/prisma";
import { CapitalAccountSource, CapitalAssetType } from "@prisma/client";
import {
  getAirtableConfig,
  getAirtableClient,
  fetchAirtableRecords,
  storeAirtableSnapshots,
  markSnapshotProcessed,
  generateSyncRunId,
  type AirtableTableMapping,
  type CapitalAirtableEntityType,
} from "@/lib/capital-os/airtable-config";

interface SyncResult {
  syncedAccounts: number;
  syncedLiabilities: number;
  syncedGoals: number;
  errors: string[];
  snapshotCount: number;
}

interface SnapshotRecord {
  id: string;
  fields: Record<string, unknown>;
}

/**
 * Execute Airtable sync using user-configurable base and tables.
 * Stores raw snapshots before processing into CapitalOS entities.
 */
export async function executeAirtableSync(userId: string): Promise<SyncResult> {
  const result: SyncResult = {
    syncedAccounts: 0,
    syncedLiabilities: 0,
    syncedGoals: 0,
    errors: [],
    snapshotCount: 0,
  };

  // 1. Get user's Airtable configuration
  const config = await getAirtableConfig(userId);
  if (!config) {
    throw new Error(
      "No Airtable configuration found. Please configure your Airtable base and tables in Settings.",
    );
  }

  // 2. Validate API key is available
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Airtable API key not configured. Please set AIRTABLE_API_KEY environment variable.",
    );
  }

  // 3. Initialize Airtable client with user's base
  const base = getAirtableClient(apiKey, config.baseId);
  const syncRunId = generateSyncRunId();

  try {
    // 4. Process each configured table
    for (const tableMapping of config.tables) {
      if (!tableMapping.isEnabled) continue;

      try {
        // 4a. Fetch records from Airtable
        const records = await fetchAirtableRecords(base, tableMapping, {
          maxRecords: 1000,
        });

        // 4b. Store raw snapshots first (for audit/history)
        const snapshotCount = await storeAirtableSnapshots(
          config.id,
          userId,
          syncRunId,
          tableMapping.entityType,
          records,
        );
        result.snapshotCount += snapshotCount;

        // 4c. Process records into CapitalOS entities based on entity type
        switch (tableMapping.entityType) {
          case "ACCOUNTS":
            result.syncedAccounts += await processAccountSnapshots(
              userId,
              config.id,
              records,
              tableMapping.fieldMap,
            );
            break;
          case "LIABILITIES":
            result.syncedLiabilities += await processLiabilitySnapshots(
              userId,
              config.id,
              records,
              tableMapping.fieldMap,
            );
            break;
          case "GOALS":
            result.syncedGoals += await processGoalSnapshots(
              userId,
              config.id,
              records,
              tableMapping.fieldMap,
            );
            break;
          default:
            // SNAPSHOTS and HOLDINGS are handled separately (investment data)
            console.log(`[CapitalOS] Skipping ${tableMapping.entityType} - not implemented for standard sync`);
        }
      } catch (error) {
        const errorMsg = `Failed to sync ${tableMapping.entityType} from ${tableMapping.tableName}: ${error instanceof Error ? error.message : "Unknown error"}`;
        console.error(`[CapitalOS] ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    // 5. Update config with success timestamp
    await prisma.capitalAirtableConfig.update({
      where: { id: config.id },
      data: {
        lastSyncAt: new Date(),
        lastError: null,
      },
    });

    return result;
  } catch (error) {
    // Update config with error
    await prisma.capitalAirtableConfig.update({
      where: { id: config.id },
      data: {
        lastError: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error;
  }
}

/**
 * Process account records from snapshots into CapitalOS accounts.
 */
async function processAccountSnapshots(
  userId: string,
  configId: string,
  records: SnapshotRecord[],
  fieldMap: Record<string, string>,
): Promise<number> {
  const nameField = fieldMap.name || "name";
  const balanceField = fieldMap.balance || "balance";
  const typeField = fieldMap.type || "type";
  const iconField = fieldMap.icon || "icon";
  const archivedField = fieldMap.archived || "archived";

  let processed = 0;

  for (const record of records) {
    const fields = record.fields;
    const name = String(fields[nameField] ?? "");
    const balance = Number(fields[balanceField] ?? 0);
    const type = String(fields[typeField] ?? "LIQUID");
    const icon = fields[iconField] ? String(fields[iconField]) : "📊";
    const archived = Boolean(fields[archivedField]);

    if (!name) continue;

    const satangs = BigInt(Math.round(balance * 100));

    try {
      // Upsert account with Airtable source
      const account = await prisma.capitalAccount.upsert({
        where: {
          userId_externalId: { userId, externalId: record.id },
        },
        create: {
          userId,
          name,
          balance: satangs,
          type: type as CapitalAssetType,
          source: CapitalAccountSource.AIRTABLE,
          externalId: record.id,
          icon,
          archivedAt: archived ? new Date() : null,
        },
        update: {
          name,
          balance: satangs,
          type: type as CapitalAssetType,
          icon,
          archivedAt: archived ? new Date() : null,
        },
      });

      // Mark snapshot as processed
      await markSnapshotProcessed(record.id, account.id);
      processed++;
    } catch (error) {
      console.error(`[CapitalOS] Failed to process account ${record.id}:`, error);
      await markSnapshotProcessed(record.id, undefined, error instanceof Error ? error.message : "Processing failed");
    }
  }

  return processed;
}

/**
 * Process liability records from snapshots into CapitalOS liabilities.
 */
async function processLiabilitySnapshots(
  userId: string,
  configId: string,
  records: SnapshotRecord[],
  fieldMap: Record<string, string>,
): Promise<number> {
  const nameField = fieldMap.name || "name";
  const balanceField = fieldMap.balance || "balance";
  const aprField = fieldMap.apr || "apr";
  const iconField = fieldMap.icon || "icon";
  const archivedField = fieldMap.archived || "archived";

  let processed = 0;

  for (const record of records) {
    const fields = record.fields;
    const name = String(fields[nameField] ?? "");
    const balance = Number(fields[balanceField] ?? 0);
    const apr = fields[aprField] ? Number(fields[aprField]) : null;
    const icon = fields[iconField] ? String(fields[iconField]) : "💳";
    const archived = Boolean(fields[archivedField]);

    if (!name) continue;

    const satangs = BigInt(Math.round(balance * 100));

    try {
      // Find existing liability by name (Airtable doesn't give us stable IDs for liabilities)
      const existing = await prisma.capitalLiability.findFirst({
        where: { userId, name },
        select: { id: true },
      });

      if (existing) {
        await prisma.capitalLiability.update({
          where: { id: existing.id },
          data: {
            balance: satangs,
            apr: apr ? { set: apr } : undefined,
            icon,
            archivedAt: archived ? new Date() : null,
          },
        });
        await markSnapshotProcessed(record.id, existing.id);
      } else {
        const liability = await prisma.capitalLiability.create({
          data: {
            userId,
            name,
            balance: satangs,
            apr: apr ?? undefined,
            icon,
          },
        });
        await markSnapshotProcessed(record.id, liability.id);
      }
      processed++;
    } catch (error) {
      console.error(`[CapitalOS] Failed to process liability ${record.id}:`, error);
      await markSnapshotProcessed(record.id, undefined, error instanceof Error ? error.message : "Processing failed");
    }
  }

  return processed;
}

/**
 * Process goal records from snapshots into CapitalOS goals.
 */
async function processGoalSnapshots(
  userId: string,
  configId: string,
  records: SnapshotRecord[],
  fieldMap: Record<string, string>,
): Promise<number> {
  const nameField = fieldMap.name || "name";
  const currentField = fieldMap.current || "current";
  const targetField = fieldMap.target || "target";
  const priorityField = fieldMap.priority || "priority";
  const deadlineField = fieldMap.deadline || "deadline";
  const vehicleField = fieldMap.vehicle || "vehicle";
  const archivedField = fieldMap.archived || "archived";

  let processed = 0;

  for (const record of records) {
    const fields = record.fields;
    const name = String(fields[nameField] ?? "");
    const current = Number(fields[currentField] ?? 0);
    const target = Number(fields[targetField] ?? 0);
    const priority = String(fields[priorityField] ?? "MEDIUM");
    const deadline = fields[deadlineField]
      ? new Date(String(fields[deadlineField]))
      : null;
    const vehicle = fields[vehicleField]
      ? String(fields[vehicleField])
      : null;
    const archived = Boolean(fields[archivedField]);

    if (!name) continue;

    const currentSatangs = BigInt(Math.round(current * 100));
    const targetSatangs = BigInt(Math.round(target * 100));

    try {
      // Find existing goal by name
      const existing = await prisma.capitalGoal.findFirst({
        where: { userId, name },
        select: { id: true },
      });

      if (existing) {
        await prisma.capitalGoal.update({
          where: { id: existing.id },
          data: {
            current: currentSatangs,
            target: targetSatangs,
            priority: priority as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
            deadline,
            vehicle: vehicle ?? undefined,
            archivedAt: archived ? new Date() : null,
          },
        });
        await markSnapshotProcessed(record.id, existing.id);
      } else {
        const goal = await prisma.capitalGoal.create({
          data: {
            userId,
            name,
            current: currentSatangs,
            target: targetSatangs,
            priority: priority as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
            deadline,
            vehicle: vehicle ?? undefined,
          },
        });
        await markSnapshotProcessed(record.id, goal.id);
      }
      processed++;
    } catch (error) {
      console.error(`[CapitalOS] Failed to process goal ${record.id}:`, error);
      await markSnapshotProcessed(record.id, undefined, error instanceof Error ? error.message : "Processing failed");
    }
  }

  return processed;
}

/**
 * Get sync history for a user.
 */
export async function getSyncHistory(userId: string, limit: number = 10) {
  // Get unique sync runs with their snapshot counts
  const snapshots = await prisma.capitalAirtableSnapshot.groupBy({
    by: ["syncRunId"],
    where: { userId },
    _count: { id: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
    take: limit,
  });

  return snapshots.map((s) => ({
    syncRunId: s.syncRunId,
    timestamp: s._max.createdAt,
    recordCount: s._count.id,
  }));
}

/**
 * Preview what would be synced without actually syncing.
 * Returns the raw records that would be processed.
 */
export async function previewAirtableSync(userId: string) {
  const config = await getAirtableConfig(userId);
  if (!config) {
    throw new Error("No Airtable configuration found.");
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    throw new Error("Airtable API key not configured.");
  }

  const base = getAirtableClient(apiKey, config.baseId);
  const preview: Record<string, SnapshotRecord[]> = {};

  for (const tableMapping of config.tables) {
    if (!tableMapping.isEnabled) continue;

    try {
      const records = await fetchAirtableRecords(base, tableMapping, {
        maxRecords: 10, // Preview only first 10
      });
      preview[tableMapping.entityType] = records;
    } catch (error) {
      preview[tableMapping.entityType] = [];
      console.error(`[CapitalOS] Preview failed for ${tableMapping.tableName}:`, error);
    }
  }

  return preview;
}
