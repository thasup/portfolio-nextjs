"use client";

/**
 * CapitalOS — Airtable Sync Button.
 *
 * Triggers sync from configured Airtable base. Supports preview mode.
 * Shows spinner while syncing, results after, and errors inline.
 */
import { RefreshCw, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { useAirtableSync } from "@/lib/capital-os/hooks/useAirtableSync";

interface AirtableSyncButtonProps {
  /** Called after a successful sync to refresh page data. */
  onSyncComplete?: () => void;
  hasConfig?: boolean;
}

export function AirtableSyncButton({ onSyncComplete, hasConfig }: AirtableSyncButtonProps) {
  const { syncing, previewing, error, result, preview, triggerSync, triggerPreview, clearResult } =
    useAirtableSync();

  const handleSync = async () => {
    clearResult();
    await triggerSync();
    onSyncComplete?.();
  };

  const handlePreview = async () => {
    clearResult();
    await triggerPreview();
  };

  const isLoading = syncing || previewing;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          id="btn-airtable-sync"
          onClick={handleSync}
          disabled={isLoading || !hasConfig}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-px disabled:opacity-50"
          style={{
            borderColor: "var(--cos-border)",
            background: "var(--cos-surface)",
            color: "var(--cos-text-2)",
          }}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Airtable"}
        </button>

        {hasConfig && (
          <button
            onClick={handlePreview}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-px disabled:opacity-50"
            style={{
              borderColor: "var(--cos-border)",
              background: "var(--cos-surface)",
              color: "var(--cos-text-2)",
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            {previewing ? "Previewing..." : "Preview"}
          </button>
        )}

        {result && !error && (
          <span
            className="flex items-center gap-1 text-[11px]"
            style={{ color: "var(--cos-positive)" }}
          >
            <CheckCircle2 className="h-3 w-3" />
            {result.syncedAccounts + result.syncedLiabilities + result.syncedGoals} synced
            {result.snapshotCount > 0 && ` · ${result.snapshotCount} snapshots`}
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

      {/* Preview results */}
      {preview && (
        <div
          className="rounded-lg border p-3 text-xs"
          style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
        >
          <h4 className="mb-2 font-medium" style={{ color: "var(--cos-text-2)" }}>
            Preview Results
          </h4>
          <div className="space-y-2">
            {Object.entries(preview).map(([entityType, records]) => (
              <div key={entityType} className="flex justify-between">
                <span style={{ color: "var(--cos-text-2)" }}>{entityType}</span>
                <span style={{ color: "var(--cos-text-3)" }}>{records.length} records found</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed result */}
      {result && !error && (
        <div
          className="rounded-lg border p-3 text-xs"
          style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
        >
          <div className="space-y-1">
            {result.syncedAccounts > 0 && (
              <div className="flex justify-between">
                <span>Accounts synced</span>
                <span>{result.syncedAccounts}</span>
              </div>
            )}
            {result.syncedLiabilities > 0 && (
              <div className="flex justify-between">
                <span>Liabilities synced</span>
                <span>{result.syncedLiabilities}</span>
              </div>
            )}
            {result.syncedGoals > 0 && (
              <div className="flex justify-between">
                <span>Goals synced</span>
                <span>{result.syncedGoals}</span>
              </div>
            )}
            {result.snapshotCount > 0 && (
              <div className="flex justify-between">
                <span>Raw snapshots stored</span>
                <span>{result.snapshotCount}</span>
              </div>
            )}
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.errors.map((err, i) => (
                <p key={i} style={{ color: "var(--cos-negative)" }}>
                  Warning: {err}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
