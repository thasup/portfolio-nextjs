"use client";

/**
 * CapitalOS — Airtable Sync Hook
 *
 * Triggers Airtable sync with preview and error handling.
 */

import { useState, useCallback } from "react";

export interface AirtableSyncResult {
  success: boolean;
  syncedAccounts: number;
  syncedLiabilities: number;
  syncedGoals: number;
  snapshotCount: number;
  errors?: string[];
  message: string;
}

export interface AirtablePreviewData {
  [entityType: string]: Array<{ id: string; fields: Record<string, unknown> }>;
}

interface UseAirtableSyncReturn {
  syncing: boolean;
  previewing: boolean;
  error: string | null;
  result: AirtableSyncResult | null;
  preview: AirtablePreviewData | null;
  triggerSync: () => Promise<void>;
  triggerPreview: () => Promise<void>;
  clearResult: () => void;
}

export function useAirtableSync(): UseAirtableSyncReturn {
  const [syncing, setSyncing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AirtableSyncResult | null>(null);
  const [preview, setPreview] = useState<AirtablePreviewData | null>(null);

  const triggerSync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setResult(null);
    setPreview(null);

    try {
      const response = await fetch("/api/capital-os/sync/airtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview: false }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Sync failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSyncing(false);
    }
  }, []);

  const triggerPreview = useCallback(async () => {
    setPreviewing(true);
    setError(null);
    setResult(null);
    setPreview(null);

    try {
      const response = await fetch("/api/capital-os/sync/airtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Preview failed");
      }

      setPreview(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setPreviewing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setPreview(null);
  }, []);

  return {
    syncing,
    previewing,
    error,
    result,
    preview,
    triggerSync,
    triggerPreview,
    clearResult,
  };
}
