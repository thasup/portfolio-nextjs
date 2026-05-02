/**
 * CapitalOS Sync Status Utilities
 *
 * Functions for tracking and displaying data freshness,
 * last sync timestamps, and sync source attribution.
 */

import { prisma } from "@/lib/db/prisma";

export interface SyncStatus {
  source: string;
  timestamp: Date;
  isStale: boolean;
  daysSince: number;
}

/** Get the most recent sync status for a user. */
export async function getLastSyncStatus(
  userId: string,
): Promise<SyncStatus | null> {
  const lastSync = await prisma.capitalSyncLog.findFirst({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });

  if (!lastSync) return null;

  const now = new Date();
  const daysSince = Math.floor(
    (now.getTime() - lastSync.timestamp.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    source: lastSync.source,
    timestamp: lastSync.timestamp,
    isStale: daysSince > 7,
    daysSince,
  };
}

/** Get sync status formatted for display next to monetary figures. */
export async function getSyncTimestampForDisplay(
  userId: string,
): Promise<string> {
  const status = await getLastSyncStatus(userId);

  if (!status) return "Not synced";

  const timeStr = status.timestamp.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateStr = status.timestamp.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (status.daysSince === 0) {
    return `${status.source} · Today, ${timeStr}`;
  } else if (status.daysSince === 1) {
    return `${status.source} · Yesterday, ${timeStr}`;
  } else if (status.daysSince < 7) {
    return `${status.source} · ${status.daysSince} days ago`;
  } else {
    return `${status.source} · ${dateStr} (stale)`;
  }
}

/** Format a sync status as a tooltip string for monetary values. */
export function formatSyncTooltip(status: SyncStatus | null): string {
  if (!status) return "Data source not synced";

  const freshness = status.isStale ? "stale" : "fresh";
  return `Last synced from ${status.source} · ${status.daysSince} days ago (${freshness})`;
}
