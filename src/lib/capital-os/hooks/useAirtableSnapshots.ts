"use client";

/**
 * React hook for fetching and managing Airtable snapshots.
 */

import { useState, useEffect, useCallback } from "react";
import type { CapitalAirtableEntityType } from "@prisma/client";

export interface SyncRunInfo {
  syncRunId: string;
  createdAt: string;
  configId: string;
  baseId: string;
  baseName: string;
  entityTypes: CapitalAirtableEntityType[];
  recordCount: number;
  processedCount: number;
  errorCount: number;
}

export interface AirtableSnapshot {
  id: string;
  configId: string;
  userId: string;
  syncRunId: string;
  entityType: CapitalAirtableEntityType;
  recordId: string;
  rawData: Record<string, unknown>;
  processed: boolean;
  capitalEntityId: string | null;
  errorMessage: string | null;
  createdAt: string;
  config: {
    baseId: string;
    name: string;
  };
}

interface UseAirtableSnapshotsResult {
  syncRuns: SyncRunInfo[];
  snapshots: AirtableSnapshot[];
  loading: boolean;
  error: string | null;
  total: number;
  limit: number;
  offset: number;
  refetch: () => Promise<void>;
}

export function useAirtableSnapshots(
  options?: {
    entityType?: CapitalAirtableEntityType;
    configId?: string;
    limit?: number;
    offset?: number;
  },
): UseAirtableSnapshotsResult {
  const [syncRuns, setSyncRuns] = useState<SyncRunInfo[]>([]);
  const [snapshots, setSnapshots] = useState<AirtableSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;

  const fetchSnapshots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.entityType) params.set("entityType", options.entityType);
      if (options?.configId) params.set("configId", options.configId);
      params.set("limit", String(limit));
      params.set("offset", String(offset));

      const response = await fetch(
        `/api/capital-os/airtable/snapshots?${params.toString()}`,
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch snapshots");
      }

      setSyncRuns(result.syncRuns ?? []);
      setSnapshots(result.snapshots ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [options?.entityType, options?.configId, limit, offset]);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  return {
    syncRuns,
    snapshots,
    loading,
    error,
    total,
    limit,
    offset,
    refetch: fetchSnapshots,
  };
}
