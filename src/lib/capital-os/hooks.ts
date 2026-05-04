/**
 * CapitalOS — Client-side data hooks.
 *
 * Fetches financial data from the CapitalOS API, falling back to
 * mock data when the API returns no results (e.g., before first sync).
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  CapitalAccount,
  CapitalLiability,
  CapitalGoal,
  CapitalSettings,
  CapitalScenario,
} from "@/lib/capital-os/types";
import {
  MOCK_ACCOUNTS,
  MOCK_LIABILITIES,
  MOCK_GOALS,
} from "@/lib/capital-os/mock-data";

// ── Types ───────────────────────────────────────────────────────

interface UseCapitalDataResult {
  accounts: CapitalAccount[];
  deletedAccounts: CapitalAccount[];
  liabilities: CapitalLiability[];
  goals: CapitalGoal[];
  settings: CapitalSettings | null;
  snapshots: Record<string, unknown>[];
  scenarios: CapitalScenario[];
  isLoading: boolean;
  isMockData: boolean;
  error: string | null;
  lastSynced: Date | null;
  refresh: () => Promise<void>;
  updateSettings: (data: Partial<CapitalSettings>) => Promise<void>;
}

interface SyncResult {
  syncing: boolean;
  error: string | null;
  result: { synced: number; syncedLiabilities: number; total: number } | null;
  triggerSync: () => Promise<void>;
}

// ── Main hook ───────────────────────────────────────────────────

export function useCapitalData(): UseCapitalDataResult {
  const [accounts, setAccounts] = useState<CapitalAccount[]>(MOCK_ACCOUNTS);
  const [deletedAccounts, setDeletedAccounts] = useState<CapitalAccount[]>([]);
  const [liabilities, setLiabilities] =
    useState<CapitalLiability[]>(MOCK_LIABILITIES);
  const [goals, setGoals] = useState<CapitalGoal[]>(MOCK_GOALS);
  const [settings, setSettings] = useState<CapitalSettings | null>(null);
  const [snapshots, setSnapshots] = useState<Record<string, unknown>[]>([]);
  const [scenarios, setScenarios] = useState<CapitalScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [accRes, liabRes, goalRes, setRes, snapRes, scenRes] =
        await Promise.all([
          fetch("/api/capital-os/accounts"),
          fetch("/api/capital-os/liabilities"),
          fetch("/api/capital-os/goals"),
          fetch("/api/capital-os/settings"),
          fetch("/api/capital-os/snapshots"),
          fetch("/api/capital-os/scenarios"),
        ]);

      // If any endpoint returns non-OK (e.g., 401), fall back to mock
      if (!accRes.ok || !liabRes.ok || !goalRes.ok) {
        setIsMockData(true);
        return;
      }

      const accData = await accRes.json();
      const liabData = await liabRes.json();
      const goalData = await goalRes.json();
      const setData = setRes.ok ? await setRes.json() : { data: null };
      const snapData = snapRes.ok ? await snapRes.json() : { data: { snapshots: [] } };
      const scenData = scenRes.ok ? await scenRes.json() : { data: { scenarios: [] } };

      const hasData =
        accData.data?.accounts?.length > 0 ||
        liabData.data?.liabilities?.length > 0 ||
        goalData.data?.goals?.length > 0;

      if (hasData) {
        setAccounts(accData.data?.accounts ?? []);
        setDeletedAccounts(accData.data?.deletedAccounts ?? []);
        setLiabilities(liabData.data?.liabilities ?? []);
        setGoals(goalData.data?.goals ?? []);
        setSettings(setData.data);
        setSnapshots(snapData.data?.snapshots ?? []);
        setScenarios(scenData.data?.scenarios ?? []);
        setIsMockData(false);
        setLastSynced(new Date());
      } else {
        // No data yet — keep mock data
        setIsMockData(true);
      }
    } catch (err) {
      console.warn("[CapitalOS] API fetch failed, using mock data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      setIsMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: Partial<CapitalSettings>) => {
    try {
      const res = await fetch("/api/capital-os/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      const result = await res.json();
      setSettings(result.data);
    } catch (err) {
      console.error("[CapitalOS] Failed to update settings:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    accounts,
    deletedAccounts,
    liabilities,
    goals,
    settings,
    snapshots,
    scenarios,
    isLoading,
    isMockData,
    error,
    lastSynced,
    refresh: fetchData,
    updateSettings,
  };
}

// ── Sync hook ───────────────────────────────────────────────────

export function useYNABSync(): SyncResult {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SyncResult["result"]>(null);

  const triggerSync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/capital-os/sync/ynab", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Sync failed: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }, []);

  return { syncing, error, result, triggerSync };
}

export function useAirtableSync(): SyncResult {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SyncResult["result"]>(null);

  const triggerSync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/capital-os/sync/airtable", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Sync failed: ${res.status}`);
      }

      const data = await res.json();
      setResult({
        synced: data.syncedAccounts,
        syncedLiabilities: data.syncedLiabilities,
        total: data.syncedAccounts + data.syncedLiabilities + data.syncedGoals,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }, []);

  return { syncing, error, result, triggerSync };
}
