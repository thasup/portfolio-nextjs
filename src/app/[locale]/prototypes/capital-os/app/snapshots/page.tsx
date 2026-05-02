"use client";

/**
 * Snapshots Page - Display Airtable snapshots and SA portfolio snapshots.
 *
 * Shows both:
 * 1. Raw Airtable data captured during sync operations
 * 2. SA (Snowball Analytics) portfolio snapshots entered via wizard
 */

import { useState, useEffect } from "react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { SnapshotWizard } from "@/components/prototypes/capital-os/SnapshotWizard";
import {
  useAirtableSnapshots,
  type SyncRunInfo,
  type AirtableSnapshot,
} from "@/lib/capital-os/hooks/useAirtableSnapshots";
import type { CapitalSACategory, CapitalSAAsset } from "@/lib/capital-os/types";
import { CapitalPortfolioType } from "@/lib/capital-os/types";
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
  Plus,
  TrendingUp,
  Calendar,
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

// Default SA category structure for new users
const DEFAULT_CATEGORIES: { strategic: CapitalSACategory[]; tactical: CapitalSACategory[] } = {
  strategic: [
    {
      id: "bonds",
      userId: "",
      portfolioType: CapitalPortfolioType.STRATEGIC,
      name: "Bonds",
      targetPct: 29.41,
      sortOrder: 0,
      createdAt: "",
      updatedAt: "",
      assets: [
        { id: "", categoryId: "bonds", ticker: "KXF", name: "GB Thai ESG Fund", valueThb: null, shares: null, targetPct: 100, sortOrder: 0, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "bonds", ticker: "PVF", name: "PVF/BCAP Fund", valueThb: null, shares: null, targetPct: null, sortOrder: 1, createdAt: "", updatedAt: "" },
      ],
    },
    {
      id: "real_assets",
      userId: "",
      portfolioType: CapitalPortfolioType.STRATEGIC,
      name: "Real Assets",
      targetPct: 29.41,
      sortOrder: 1,
      createdAt: "",
      updatedAt: "",
      assets: [
        { id: "", categoryId: "real_assets", ticker: "GC", name: "GC Gold", valueThb: null, shares: null, targetPct: 80, sortOrder: 0, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "real_assets", ticker: "VCI", name: "VICI Properties", valueThb: null, shares: null, targetPct: 20, sortOrder: 1, createdAt: "", updatedAt: "" },
      ],
    },
    {
      id: "cash_strat",
      userId: "",
      portfolioType: CapitalPortfolioType.STRATEGIC,
      name: "Cash",
      targetPct: 23.54,
      sortOrder: 2,
      createdAt: "",
      updatedAt: "",
      assets: [
        { id: "", categoryId: "cash_strat", ticker: "THB", name: "THB Thai Baht", valueThb: null, shares: null, targetPct: 50, sortOrder: 0, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "cash_strat", ticker: "USD", name: "USD US Dollar", valueThb: null, shares: null, targetPct: 50, sortOrder: 1, createdAt: "", updatedAt: "" },
      ],
    },
  ],
  tactical: [
    {
      id: "us_equity",
      userId: "",
      portfolioType: CapitalPortfolioType.TACTICAL,
      name: "US Equity",
      targetPct: 42.86,
      sortOrder: 0,
      createdAt: "",
      updatedAt: "",
      assets: [
        { id: "", categoryId: "us_equity", ticker: "VUAA", name: "Vanguard S&P 500", valueThb: null, shares: null, targetPct: 66.67, sortOrder: 0, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "us_equity", ticker: "FTECH", name: "Fidelity Global Tech", valueThb: null, shares: null, targetPct: 33.33, sortOrder: 1, createdAt: "", updatedAt: "" },
      ],
    },
    {
      id: "tech",
      userId: "",
      portfolioType: CapitalPortfolioType.TACTICAL,
      name: "Information Technology",
      targetPct: 24.49,
      sortOrder: 1,
      createdAt: "",
      updatedAt: "",
      assets: [
        { id: "", categoryId: "tech", ticker: "AAPL", name: "Apple Inc", valueThb: null, shares: null, targetPct: 23.53, sortOrder: 0, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "tech", ticker: "GOOGL", name: "Alphabet Inc", valueThb: null, shares: null, targetPct: 23.53, sortOrder: 1, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "tech", ticker: "MSFT", name: "Microsoft", valueThb: null, shares: null, targetPct: 23.53, sortOrder: 2, createdAt: "", updatedAt: "" },
        { id: "", categoryId: "tech", ticker: "TSM", name: "Taiwan Semi", valueThb: null, shares: null, targetPct: 17.65, sortOrder: 3, createdAt: "", updatedAt: "" },
      ],
    },
  ],
};

function SASnapshotCard({ 
  date, 
  total, 
  fxRate 
}: { 
  date: string; 
  total: number; 
  fxRate?: number;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount / 100); // Convert satangs to THB
  };

  return (
    <div 
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--cos-surface)",
        borderColor: "var(--cos-border-subtle)",
      }}
    >
      <div className="flex items-center gap-4 p-4">
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "var(--intent-accent-muted)" }}
        >
          <TrendingUp className="h-5 w-5" style={{ color: "var(--intent-accent)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-medium">SA Portfolio Snapshot</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--cos-surface-2)", color: "var(--intent-accent)" }}
            >
              Manual Entry
            </span>
          </div>
          <div
            className="flex items-center gap-4 mt-1 text-sm"
            style={{ color: "var(--cos-text-2)" }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(date).toLocaleDateString()}
            </span>
            {fxRate && (
              <span className="font-mono">1 USD = {fxRate} THB</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono font-bold text-lg" style={{ color: "var(--intent-accent)" }}>
            {formatCurrency(total)}
          </div>
          <div className="text-xs" style={{ color: "var(--cos-text-3)" }}>
            Total Value
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SnapshotsPage() {
  const { syncRuns, loading, error, refetch } = useAirtableSnapshots({ limit: 50 });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [saCategories, setSACategories] = useState(DEFAULT_CATEGORIES);

  // Fetch SA categories on mount
  useEffect(() => {
    fetch("/api/capital-os/sa-categories")
      .then(res => res.json())
      .then(data => {
        if (data.strategic?.length > 0 || data.tactical?.length > 0) {
          setSACategories(data);
        }
      })
      .catch(() => {
        // Use default categories if fetch fails
      });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader
        title="Portfolio Snapshots"
        subtitle="SA and Airtable snapshots for net worth reconciliation"
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
              style={{
                background: "var(--intent-accent)",
                color: "white",
              }}
            >
              <Plus className="h-4 w-4" />
              New SA Snapshot
            </button>

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

        {/* SA Snapshots Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--cos-text-2)" }}>
            SA Portfolio Snapshots
          </h3>
          <div className="space-y-3">
            {/* Demo snapshot card */}
            <SASnapshotCard
              date={new Date().toISOString()}
              total={61052400} // ฿610,524 in satangs
              fxRate={33.47}
            />
            <div
              className="rounded-xl border border-dashed p-6 text-center"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--cos-text-3)" }} />
              <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
                No additional SA snapshots yet. Use the wizard to capture your portfolio values.
              </p>
            </div>
          </div>
        </div>

        {/* Airtable Snapshots Section */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--cos-text-2)" }}>
            Airtable Sync History
          </h3>
          <div className="space-y-4">
            {syncRuns.map((run) => (
              <SyncRunCard key={run.syncRunId} run={run} />
            ))}
          </div>
        </div>

        {/* Snapshot Wizard Modal */}
        <SnapshotWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onComplete={() => {
            setIsWizardOpen(false);
            // Could refetch SA snapshot history here
          }}
          categories={saCategories}
        />
      </div>
    </div>
  );
}
