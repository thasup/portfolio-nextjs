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
  Shield,
  Rocket,
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
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-(--cos-surface-2) transition-colors"
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

// Types for SA Snapshot with asset details
interface SnapshotAsset {
  ticker: string;
  name: string;
  categoryId: string;
  investedValue?: number | null;
  currentValue?: number | null;
  currency: string;
  shares?: string | null;
}

interface SASnapshot {
  id: string;
  date: string;
  saTotal: number;
  saPortfolios?: {
    strategic?: { total: number };
    tactical?: { total: number };
  };
  saAssets?: SnapshotAsset[];
  fxRateUsdThb?: number;
}

function SASnapshotCard({
  snapshot,
  expanded = false,
  onToggle,
}: {
  snapshot: SASnapshot;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const [showRaw, setShowRaw] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const formatNumber = (value: string | number | undefined | null) => {
    if (!value) return "—";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "—";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const calculatePL = (invested: number | null | undefined, current: number | null | undefined) => {
    if (invested == null || current == null) return null;
    if (invested === 0) return null;
    return ((current - invested) / invested) * 100;
  };

  // Group assets by strategic/tactical based on categoryId prefix
  const strategicAssets = snapshot.saAssets?.filter(a => a.categoryId?.startsWith("strat_")) || [];
  const tacticalAssets = snapshot.saAssets?.filter(a => a.categoryId?.startsWith("tact_")) || [];

  const strategicTotal = snapshot.saPortfolios?.strategic?.total || 0;
  const tacticalTotal = snapshot.saPortfolios?.tactical?.total || 0;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{
        background: "var(--cos-surface)",
        borderColor: "var(--cos-border-subtle)",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-(--cos-surface-2) transition-colors text-left"
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
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
              {new Date(snapshot.date).toLocaleDateString("th-TH")}
            </span>
            {snapshot.fxRateUsdThb && (
              <span className="font-mono text-xs">
                1 USD = {snapshot.fxRateUsdThb} THB
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono font-bold text-lg" style={{ color: "var(--intent-accent)" }}>
            {formatCurrency(snapshot.saTotal)}
          </div>
          <div className="text-xs" style={{ color: "var(--cos-text-3)" }}>
            Total Value
          </div>
        </div>
        {onToggle && (
          <ChevronRight
            className={`h-5 w-5 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
            style={{ color: "var(--cos-text-3)" }}
          />
        )}
      </button>

      {/* Expanded Asset Details */}
      {expanded && snapshot.saAssets && snapshot.saAssets.length > 0 && (
        <div className="border-t" style={{ borderColor: "var(--cos-border-subtle)" }}>
          <div className="px-4 pt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowRaw((v) => !v);
              }}
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-(--cos-surface-2)"
              style={{ border: "1px solid var(--cos-border-subtle)", color: "var(--cos-text-2)" }}
            >
              <FileJson className="h-3.5 w-3.5" />
              {showRaw ? "Hide raw" : "Show raw"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showRaw ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showRaw && (
            <div className="px-4 pt-3">
              <pre
                className="text-xs p-3 rounded-lg overflow-x-auto"
                style={{
                  background: "var(--cos-surface-2)",
                  color: "var(--cos-text-2)",
                  border: "1px solid var(--cos-border-subtle)",
                }}
              >
                {JSON.stringify(
                  {
                    id: snapshot.id,
                    date: snapshot.date,
                    saTotal: snapshot.saTotal,
                    fxRateUsdThb: snapshot.fxRateUsdThb,
                    saPortfolios: snapshot.saPortfolios,
                    saAssets: snapshot.saAssets,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* Strategic Section */}
          {strategicAssets.length > 0 && (
            <div className="p-4 border-b" style={{ borderColor: "var(--cos-border-subtle)" }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: "var(--intent-success)" }} />
                  Strategic
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full"
                    style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-3)" }}>
                    {strategicAssets.length} assets
                  </span>
                </h4>
                <span className="font-mono text-sm font-medium">
                  {formatCurrency(strategicTotal)}
                </span>
              </div>
              <AssetTable assets={strategicAssets} formatCurrency={formatCurrency} formatNumber={formatNumber} calculatePL={calculatePL} />
            </div>
          )}

          {/* Tactical Section */}
          {tacticalAssets.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Rocket className="h-4 w-4" style={{ color: "var(--intent-accent)" }} />
                  Tactical
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full"
                    style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-3)" }}>
                    {tacticalAssets.length} assets
                  </span>
                </h4>
                <span className="font-mono text-sm font-medium">
                  {formatCurrency(tacticalTotal)}
                </span>
              </div>
              <AssetTable assets={tacticalAssets} formatCurrency={formatCurrency} formatNumber={formatNumber} calculatePL={calculatePL} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssetTable({
  assets,
  formatCurrency,
  formatNumber,
  calculatePL,
}: {
  assets: SnapshotAsset[];
  formatCurrency: (amount: number) => string;
  formatNumber: (value: string | number | undefined | null) => string;
  calculatePL: (invested: number | null | undefined, current: number | null | undefined) => number | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs" style={{ color: "var(--cos-text-3)" }}>
            <th className="text-left py-2 font-medium">Asset</th>
            <th className="text-right py-2 font-medium">Shares</th>
            <th className="text-right py-2 font-medium">Invested</th>
            <th className="text-right py-2 font-medium">Current</th>
            <th className="text-right py-2 font-medium">P/L %</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, idx) => {
            const pl = calculatePL(asset.investedValue, asset.currentValue);
            const currentVal = asset.currentValue ?? 0;
            const investedVal = asset.investedValue ?? 0;

            return (
              <tr
                key={idx}
                className="border-t"
                style={{ borderColor: "var(--cos-border-subtle)" }}
              >
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "var(--cos-surface-2)" }}>
                      {asset.currency}
                    </span>
                    <div>
                      <div className="font-medium">{asset.ticker}</div>
                      <div className="text-xs truncate max-w-[200px]" style={{ color: "var(--cos-text-3)" }}>
                        {asset.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-right py-2 font-mono text-xs">
                  {formatNumber(asset.shares)}
                </td>
                <td className="text-right py-2 font-mono text-xs">
                  {investedVal > 0 ? formatCurrency(investedVal) : "—"}
                </td>
                <td className="text-right py-2 font-mono">
                  {currentVal > 0 ? formatCurrency(currentVal) : "—"}
                </td>
                <td className="text-right py-2">
                  {pl !== null ? (
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: pl >= 0 ? "var(--intent-success-muted)" : "var(--intent-danger-muted)",
                        color: pl >= 0 ? "var(--intent-success)" : "var(--intent-danger)",
                      }}
                    >
                      {pl >= 0 ? "+" : ""}{pl.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--cos-text-3)" }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function SnapshotsPage() {
  const { syncRuns, loading, error, refetch } = useAirtableSnapshots({ limit: 50 });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [saCategories, setSACategories] = useState(DEFAULT_CATEGORIES);
  const [saSnapshots, setSASnapshots] = useState<SASnapshot[]>([]);
  const [saSnapshotsLoading, setSASnapshotsLoading] = useState(false);
  const [saSnapshotsError, setSASnapshotsError] = useState<string | null>(null);
  const [expandedSnapshotId, setExpandedSnapshotId] = useState<string | null>(null);

  const fetchSASnapshots = async () => {
    setSASnapshotsLoading(true);
    setSASnapshotsError(null);
    try {
      const res = await fetch("/api/capital-os/snapshots?limit=90");
      if (!res.ok) {
        throw new Error(`Failed to fetch SA snapshots (${res.status})`);
      }
      const data = await res.json();
      const snaps = Array.isArray(data?.snapshots) ? (data.snapshots as Array<Record<string, unknown>>) : [];

      // Only keep snapshots that actually have SA data
      const normalized: SASnapshot[] = snaps
        .filter((s) => s.saTotal != null)
        .map((s) => ({
          id: String(s.id),
          date: String(s.date),
          saTotal: Number(s.saTotal ?? 0),
          saPortfolios: (s.saPortfolios ?? undefined) as SASnapshot["saPortfolios"],
          saAssets: (Array.isArray(s.saAssets) ? s.saAssets : []) as SnapshotAsset[],
          fxRateUsdThb: typeof s.fxRateUsdThb === "number" ? s.fxRateUsdThb : undefined,
        }));

      // newest first for display
      normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSASnapshots(normalized);
    } catch (e) {
      setSASnapshotsError(e instanceof Error ? e.message : "Failed to fetch SA snapshots");
    } finally {
      setSASnapshotsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchSASnapshots();
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-(--cos-surface-2) disabled:opacity-50"
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
            {saSnapshotsError && (
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: "var(--cos-error-bg, rgba(239, 68, 68, 0.1))",
                  color: "var(--cos-error, #ef4444)",
                }}
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{saSnapshotsError}</p>
              </div>
            )}

            {saSnapshotsLoading && saSnapshots.length === 0 && (
              <div
                className="rounded-xl h-24 animate-pulse"
                style={{ background: "var(--cos-surface)" }}
              />
            )}

            {saSnapshots.map((s) => (
              <SASnapshotCard
                key={s.id}
                snapshot={s}
                expanded={expandedSnapshotId === s.id}
                onToggle={() => setExpandedSnapshotId((prev) => (prev === s.id ? null : s.id))}
              />
            ))}

            {!saSnapshotsLoading && saSnapshots.length === 0 && !saSnapshotsError && (
              <div
                className="rounded-xl border border-dashed p-6 text-center"
                style={{
                  background: "var(--cos-surface)",
                  borderColor: "var(--cos-border-subtle)",
                }}
              >
                <TrendingUp className="h-8 w-8 mx-auto mb-3" style={{ color: "var(--cos-text-3)" }} />
                <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
                  No SA snapshots yet. Use the wizard to capture your portfolio values.
                </p>
              </div>
            )}
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
            fetchSASnapshots();
          }}
        />
      </div>
    </div>
  );
}
