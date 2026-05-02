"use client";

/**
 * Snapshots Page - Display Airtable snapshots grouped by sync run.
 *
 * Shows raw Airtable data captured during sync operations.
 */

import { useState } from "react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import {
  useAirtableSnapshots,
  type SyncRunInfo,
  type AirtableSnapshot,
} from "@/lib/capital-os/hooks/useAirtableSnapshots";
import Link from "next/link";
import {
  Database,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Table2,
  FileJson,
  ExternalLink,
} from "lucide-react";
import type { CapitalAirtableEntityType } from "@prisma/client";

const ENTITY_TYPE_LABELS: Record<CapitalAirtableEntityType, string> = {
  ACCOUNTS: "Accounts",
  LIABILITIES: "Liabilities",
  GOALS: "Goals",
  SNAPSHOTS: "Snapshots",
  HOLDINGS: "Holdings",
};

const ENTITY_TYPE_COLORS: Record<CapitalAirtableEntityType, string> = {
  ACCOUNTS: "bg-blue-500/10 text-blue-600",
  LIABILITIES: "bg-red-500/10 text-red-600",
  GOALS: "bg-green-500/10 text-green-600",
  SNAPSHOTS: "bg-purple-500/10 text-purple-600",
  HOLDINGS: "bg-orange-500/10 text-orange-600",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function SyncRunCard({ run }: { run: SyncRunInfo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--cos-surface)",
        borderColor: "var(--cos-border-subtle)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--cos-surface-2)] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-5 w-5 shrink-0" style={{ color: "var(--cos-text-3)" }} />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0" style={{ color: "var(--cos-text-3)" }} />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-medium truncate">{run.baseName}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-3)" }}
            >
              {run.baseId}
            </span>
          </div>
          <div
            className="flex items-center gap-4 mt-1 text-sm"
            style={{ color: "var(--cos-text-2)" }}
          >
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(run.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Table2 className="h-3.5 w-3.5" />
              {run.recordCount} records
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm">{run.processedCount}</span>
          </div>
          {run.errorCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">{run.errorCount}</span>
            </div>
          )}
          <div className="flex gap-1">
            {run.entityTypes.map((type) => (
              <span
                key={type}
                className={`text-xs px-2 py-0.5 rounded-full ${ENTITY_TYPE_COLORS[type]}`}
              >
                {ENTITY_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && <SyncRunDetails syncRunId={run.syncRunId} />}
    </div>
  );
}

function SyncRunDetails({ syncRunId }: { syncRunId: string }) {
  const { snapshots, loading } = useAirtableSnapshots({ limit: 100 });
  const runSnapshots = snapshots.filter((s) => s.syncRunId === syncRunId);

  if (loading) {
    return (
      <div className="p-4 border-t" style={{ borderColor: "var(--cos-border-subtle)" }}>
        <div className="flex items-center gap-2" style={{ color: "var(--cos-text-3)" }}>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading records...
        </div>
      </div>
    );
  }

  return (
    <div className="border-t" style={{ borderColor: "var(--cos-border-subtle)" }}>
      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
        {runSnapshots.map((snapshot) => (
          <SnapshotRow key={snapshot.id} snapshot={snapshot} />
        ))}
      </div>
    </div>
  );
}

function SnapshotRow({ snapshot }: { snapshot: AirtableSnapshot }) {
  const [showRawData, setShowRawData] = useState(false);

  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{ background: "var(--cos-surface-2)" }}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="mt-0.5">
          {snapshot.processed ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : snapshot.errorMessage ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <Clock className="h-4 w-4 text-yellow-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{snapshot.recordId}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${ENTITY_TYPE_COLORS[snapshot.entityType]}`}
            >
              {ENTITY_TYPE_LABELS[snapshot.entityType]}
            </span>
          </div>

          {snapshot.errorMessage && (
            <p className="text-red-500 text-xs mt-1">{snapshot.errorMessage}</p>
          )}

          {snapshot.capitalEntityId && (
            <p
              className="text-xs mt-1"
              style={{ color: "var(--cos-text-3)" }}
            >
              Mapped to: {snapshot.capitalEntityId}
            </p>
          )}

          {/* Raw Data Toggle */}
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center gap-1 mt-2 text-xs hover:underline"
            style={{ color: "var(--cos-accent)" }}
          >
            <FileJson className="h-3 w-3" />
            {showRawData ? "Hide raw data" : "View raw data"}
          </button>

          {showRawData && (
            <pre
              className="mt-2 p-2 rounded text-xs overflow-x-auto"
              style={{
                background: "var(--cos-bg)",
                color: "var(--cos-text-2)",
              }}
            >
              {JSON.stringify(snapshot.rawData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SnapshotsPage() {
  const { syncRuns, loading, error, refetch } = useAirtableSnapshots({ limit: 50 });

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader
        title="Airtable Snapshots"
        subtitle="View raw data captured from Airtable sync operations"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2" style={{ color: "var(--cos-text-2)" }}>
            <Database className="h-4 w-4" />
            <span className="text-sm">
              {syncRuns.length} sync run{syncRuns.length !== 1 ? "s" : ""} found
            </span>
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--cos-surface-2)] disabled:opacity-50"
            style={{
              background: "var(--cos-surface)",
              border: "1px solid var(--cos-border-subtle)",
              color: "var(--cos-text)",
            }}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div
            className="rounded-xl p-4 mb-6 flex items-center gap-3"
            style={{
              background: "var(--cos-error-bg, rgba(239, 68, 68, 0.1))",
              color: "var(--cos-error, #ef4444)",
            }}
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && syncRuns.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl h-24 animate-pulse"
                style={{ background: "var(--cos-surface)" }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && syncRuns.length === 0 && !error && (
          <div
            className="rounded-xl border p-8 text-center"
            style={{
              background: "var(--cos-surface)",
              borderColor: "var(--cos-border-subtle)",
            }}
          >
            <Database className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--cos-text-3)" }} />
            <h3 className="font-medium text-lg mb-2">No snapshots yet</h3>
            <p className="text-sm mb-4" style={{ color: "var(--cos-text-2)" }}>
              Sync your Airtable data to see captured snapshots here.
            </p>
            <Link
              href="settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: "var(--cos-accent)",
                color: "white",
              }}
            >
              Go to Settings
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Sync Runs List */}
        <div className="space-y-4">
          {syncRuns.map((run) => (
            <SyncRunCard key={run.syncRunId} run={run} />
          ))}
        </div>
      </div>
    </div>
  );
}
