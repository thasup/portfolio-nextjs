"use client";

/**
 * CapitalOS — YNAB Sync Button.
 *
 * Triggers a manual sync from YNAB. Shows spinner while syncing,
 * success count after, and errors inline.
 */
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useYNABSync } from "@/lib/capital-os/hooks";

interface SyncButtonProps {
  /** Called after a successful sync to refresh page data. */
  onSyncComplete?: () => void;
}

export function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const { syncing, error, result, triggerSync } = useYNABSync();

  const handleSync = async () => {
    await triggerSync();
    onSyncComplete?.();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        id="btn-ynab-sync"
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:translate-y-[-1px] disabled:opacity-50"
        style={{
          borderColor: "var(--cos-border)",
          background: "var(--cos-surface)",
          color: "var(--cos-text-2)",
        }}
      >
        <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "Syncing..." : "Sync YNAB"}
      </button>

      {result && !error && (
        <span
          className="flex items-center gap-1 text-[11px]"
          style={{ color: "var(--cos-positive)" }}
        >
          <CheckCircle2 className="h-3 w-3" />
          {result.synced + result.syncedLiabilities} synced
        </span>
      )}

      {error && (
        <span
          className="flex items-center gap-1 text-[11px]"
          style={{ color: "var(--cos-negative)" }}
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </div>
  );
}
