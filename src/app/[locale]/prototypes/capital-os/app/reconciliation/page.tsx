"use client";

/**
 * CapitalOS v5 — Reconciliation Page
 *
 * SA live values (from latest snapshot) vs YNAB stale reference values.
 * Gap = YNAB − SA per category.
 * Canonical NW = SA Total + YNAB-only − Liabilities
 */

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import type { CapitalAccount, CapitalLiability } from "@/lib/capital-os/types";
import { CapitalMappingRole, CapitalPortfolioType } from "@/lib/capital-os/types";
import { ALL_SA_CATEGORIES } from "@/lib/capital-os/categories";
import { fmtSatangs } from "@/lib/capital-os/format";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

// ── Local types ──────────────────────────────────────────────────

interface MappingEntry {
  ynabAccId: string;
  saCategory?: string | null;
  role: CapitalMappingRole;
  saAssetMappings?: Array<{ saTicker: string }>;
}

interface SnapshotAsset {
  ticker: string;
  name: string;
  categoryId: string;
  currentValue?: number | null;
  currency: string;
  shares?: string | null;
}

interface LatestSnapshot {
  id: string;
  date: string;
  saTotal: number;
  saAssets: SnapshotAsset[];
}

interface ReconRow {
  categoryId: string;
  categoryName: string;
  portfolioType: CapitalPortfolioType;
  saValue: number;
  ynabValue: number;
  gap: number;
  hasMapping: boolean;
  mappedAccounts: { name: string; icon: string; balance: number }[];
  saAssets: SnapshotAsset[];
}

// ── Sub-components ───────────────────────────────────────────────

function GapChip({ gap }: { gap: number }) {
  if (gap === 0) {
    return <span className="text-xs font-mono" style={{ color: "var(--cos-text-3)" }}>in sync</span>;
  }
  const over = gap > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold font-mono"
      style={{
        background: over ? "var(--intent-warning-muted)" : "var(--intent-info-muted)",
        color: over ? "var(--intent-warning)" : "var(--intent-info)",
      }}
    >
      {over
        ? <ArrowUpRight className="h-3 w-3" />
        : <ArrowDownRight className="h-3 w-3" />}
      {fmtSatangs(Math.abs(gap))}
    </span>
  );
}

function PortfolioLabel({ type }: { type: CapitalPortfolioType }) {
  const isStrategic = type === CapitalPortfolioType.STRATEGIC;
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider shrink-0"
      style={{
        background: isStrategic ? "var(--intent-success-muted)" : "var(--intent-warning-muted)",
        color: isStrategic ? "var(--intent-success)" : "var(--intent-warning)",
      }}
    >
      {isStrategic ? "Strategic" : "Tactical"}
    </span>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; fill: string; value: number }>;
  label?: string;
}
function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: "var(--cos-surface-2)", borderColor: "var(--cos-border-subtle)" }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mt-0.5">
          <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: p.fill }} />
          <span style={{ color: "var(--cos-text-2)" }}>{p.name}:</span>
          <span className="font-mono">{p.value > 0 ? fmtSatangs(p.value) : "—"}</span>
        </div>
      ))}
    </div>
  );
}

export default function ReconciliationPage() {
  const [accounts, setAccounts] = useState<CapitalAccount[]>([]);
  const [mappingConfig, setMappingConfig] = useState<MappingEntry[]>([]);
  const [liabilities, setLiabilities] = useState<CapitalLiability[]>([]);
  const [latestSnapshot, setLatestSnapshot] = useState<LatestSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/capital-os/accounts").then(r => r.json()),
      fetch("/api/capital-os/mapping").then(r => r.json()),
      fetch("/api/capital-os/liabilities").then(r => r.json()),
      fetch("/api/capital-os/snapshots?limit=90").then(r => r.json()),
    ]).then(([accRes, mapRes, liabRes, snapRes]) => {
      setAccounts(accRes.data?.accounts || []);
      setMappingConfig(mapRes.data || []);
      setLiabilities(liabRes.data?.liabilities || []);
      type RawSnap = { id?: unknown; date?: unknown; saTotal?: number | null; saAssets?: unknown[] };
      const snaps: RawSnap[] = snapRes.data?.snapshots || [];
      const saSnap = [...snaps].reverse().find((s) => s.saTotal != null);
      if (saSnap) {
        setLatestSnapshot({
          id: String(saSnap.id),
          date: String(saSnap.date),
          saTotal: Number(saSnap.saTotal),
          saAssets: Array.isArray(saSnap.saAssets) ? (saSnap.saAssets as SnapshotAsset[]) : [],
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Derived data ─────────────────────────────────────────────────
  const { rows, ynabOnlyAccounts, saTotal, ynabSaCoveredTotal, ynabOnlyTotal, liabTotal, canonicalNw, snapshotDate } = useMemo(() => {
    const snapshotAssets: SnapshotAsset[] = latestSnapshot?.saAssets ?? [];
    const snapshotDate = latestSnapshot?.date ?? null;
    const assetByTicker = Object.fromEntries(snapshotAssets.map(a => [a.ticker, a]));

    // One row per SA_COVERED YNAB account (asset-level: saAssetMappings)
    const rows: ReconRow[] = mappingConfig
      .filter(m => m.role === CapitalMappingRole.SA_COVERED)
      .map(m => {
        const acc = accounts.find(a => a.externalId === m.ynabAccId);
        if (!acc) return null;

        const ynabValue = Number(acc.balance);
        const assetRefs: string[] = m.saAssetMappings?.map((r) => r.saTicker) ?? [];
        const saAssets = assetRefs.map(t => assetByTicker[t]).filter(Boolean) as SnapshotAsset[];
        const saValue = saAssets.reduce((s, a) => s + (a.currentValue ?? 0), 0);

        // Derive portfolio type from the first assigned asset's category
        const firstCat = saAssets[0]
          ? ALL_SA_CATEGORIES.find(c => c.id === saAssets[0].categoryId)
          : undefined;

        return {
          categoryId: acc.externalId!,
          categoryName: acc.name,
          portfolioType: firstCat?.portfolioType ?? CapitalPortfolioType.STRATEGIC,
          saValue,
          ynabValue,
          gap: ynabValue - saValue,
          hasMapping: assetRefs.length > 0,
          mappedAccounts: [{ name: acc.name, icon: acc.icon ?? "💰", balance: ynabValue }],
          saAssets,
        };
      })
      .filter((r): r is ReconRow => r !== null);

    const ynabOnlyAccounts = accounts.filter(a => {
      const m = mappingConfig.find(mc => mc.ynabAccId === a.externalId);
      return !m || m.role === CapitalMappingRole.YNAB_ONLY;
    });

    const saTotal = latestSnapshot?.saTotal ?? rows.reduce((s, r) => s + r.saValue, 0);
    const ynabSaCoveredTotal = rows.reduce((s, r) => s + r.ynabValue, 0);
    const ynabOnlyTotal = ynabOnlyAccounts.reduce((s, a) => s + Number(a.balance), 0);
    const liabTotal = liabilities.reduce((s, l) => s + Math.abs(Number(l.balance)), 0);
    const canonicalNw = saTotal + ynabOnlyTotal - liabTotal;

    return { rows, ynabOnlyAccounts, saTotal, ynabSaCoveredTotal, ynabOnlyTotal, liabTotal, canonicalNw, snapshotDate };
  }, [accounts, mappingConfig, liabilities, latestSnapshot]);

  const chartData = rows
    .filter(r => r.saValue > 0 || r.ynabValue > 0)
    .map(r => ({
      name: r.categoryName.length > 10 ? r.categoryName.slice(0, 9) + "…" : r.categoryName,
      "SA (live)": r.saValue,
      "YNAB (stale)": r.ynabValue,
    }));

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <CapitalOSHeader title="Reconciliation" />
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-xl" style={{ background: "var(--cos-surface)" }} />
          ))}
        </div>
      </div>
    );
  }

  const snapshotLabel = snapshotDate
    ? new Date(snapshotDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader title="Reconciliation" />

      <div className="flex-1 p-6 overflow-y-auto space-y-6">

        {/* ── 3 Hero Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* SA Total */}
          <div
            className="rounded-xl p-5 border-l-2"
            style={{ background: "var(--cos-surface)", borderColor: "var(--intent-success)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--cos-text-3)" }}>
              SA TOTAL (LIVE · AUTHORITATIVE)
            </p>
            <p className="font-mono text-2xl font-bold" style={{ color: "var(--cos-text)" }}>
              {fmtSatangs(saTotal)}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--cos-text-3)" }}>
              Source of truth for financial assets
            </p>
          </div>

          {/* YNAB SA-covered */}
          <div
            className="rounded-xl p-5 border-l-2"
            style={{ background: "var(--cos-surface)", borderColor: "var(--intent-warning)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--cos-text-3)" }}>
              YNAB SA-COVERED (STALE)
            </p>
            <p className="font-mono text-2xl font-bold" style={{ color: "var(--cos-text)" }}>
              {fmtSatangs(ynabSaCoveredTotal)}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--intent-warning)" }}>
              {ynabSaCoveredTotal > saTotal
                ? `+${fmtSatangs(ynabSaCoveredTotal - saTotal)} vs SA (stale markup)`
                : ynabSaCoveredTotal < saTotal
                ? `−${fmtSatangs(saTotal - ynabSaCoveredTotal)} vs SA (under-tracked)`
                : "In sync with SA"}
            </p>
          </div>

          {/* Canonical NW */}
          <div
            className="rounded-xl p-5 border-l-2"
            style={{ background: "var(--cos-surface)", borderColor: "var(--intent-accent, var(--intent-success))" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--cos-text-3)" }}>
              CANONICAL NET WORTH
            </p>
            <p className="font-mono text-2xl font-bold" style={{ color: "var(--intent-success)" }}>
              {fmtSatangs(canonicalNw)}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--cos-text-3)" }}>
              SA + PPE − Liabilities
            </p>
          </div>
        </div>

        {/* ── Bar Chart ─────────────────────────────────────────────── */}
        {chartData.length > 0 && (
          <div className="rounded-xl border p-5" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--cos-text-3)" }}>
              SA Category vs YNAB Mapped · Pricing Gap per Category
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 40 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "var(--cos-text-3)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={v => `฿${Math.round(v / 100000)}K`}
                  tick={{ fontSize: 10, fill: "var(--cos-text-3)" }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="SA (live)" fill="var(--intent-warning)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                <Bar dataKey="YNAB (stale)" fill="var(--intent-warning-muted)" radius={[3, 3, 0, 0]} maxBarSize={28}>
                  {chartData.map((_: unknown, i: number) => (
                    <Cell key={i} fill="rgba(245,158,11,0.35)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2" style={{ color: "var(--cos-text-3)" }}>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-block h-2 w-4 rounded-sm" style={{ background: "var(--intent-warning)" }} />
                SA (live · authoritative)
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-block h-2 w-4 rounded-sm" style={{ background: "rgba(245,158,11,0.35)" }} />
                YNAB (stale · reference only)
              </div>
            </div>
          </div>
        )}

        {/* ── Per-Category Table ────────────────────────────────────── */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
          <div
            className="grid gap-4 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              gridTemplateColumns: "130px 1fr 110px 110px 130px",
              background: "var(--cos-surface-2)",
              color: "var(--cos-text-3)",
            }}
          >
            <span>YNAB Account</span>
            <span>SA Assets Held</span>
            <span className="text-right">SA (live)</span>
            <span className="text-right">YNAB (stale)</span>
            <span className="text-right">Gap</span>
          </div>

          {rows.map(row => (
            <div
              key={row.categoryId}
              className="grid gap-4 px-4 py-3 border-t items-start"
              style={{
                gridTemplateColumns: "130px 1fr 110px 110px 130px",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <div className="pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span>{row.mappedAccounts[0]?.icon ?? "💰"}</span>
                  <span className="font-medium text-sm truncate">{row.categoryName}</span>
                </div>
                <PortfolioLabel type={row.portfolioType} />
              </div>

              <div>
                {row.saAssets.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {row.saAssets.map(a => (
                      <span
                        key={a.ticker}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]"
                        style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-2)" }}
                        title={`${a.name} · ${fmtSatangs(a.currentValue ?? 0)}`}
                      >
                        <span className="font-mono font-semibold" style={{ color: "var(--intent-success)" }}>{a.ticker}</span>
                        <span style={{ color: "var(--cos-text-3)" }}>{fmtSatangs(a.currentValue ?? 0)}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "var(--cos-text-3)" }}>No assets assigned — go to Mapping</p>
                )}
              </div>

              <div className="text-right font-mono text-sm pt-0.5">
                {row.saValue > 0 ? (
                  <span style={{ color: "var(--cos-text)" }}>{fmtSatangs(row.saValue)}</span>
                ) : (
                  <span style={{ color: "var(--cos-text-3)" }}>—</span>
                )}
              </div>

              <div className="text-right font-mono text-sm pt-0.5">
                {row.ynabValue > 0 ? (
                  <span style={{ color: "var(--cos-text-2)" }}>{fmtSatangs(row.ynabValue)}</span>
                ) : (
                  <span style={{ color: "var(--cos-text-3)" }}>—</span>
                )}
              </div>

              <div className="text-right pt-0.5">
                {row.saValue === 0 && row.ynabValue === 0 ? (
                  <span style={{ color: "var(--cos-text-3)" }}>—</span>
                ) : (
                  <GapChip gap={row.gap} />
                )}
              </div>
            </div>
          ))}

          {/* YNAB-only accounts row */}
          {ynabOnlyAccounts.length > 0 && (
            <div
              className="grid gap-4 px-4 py-3 border-t items-start"
              style={{
                gridTemplateColumns: "130px 1fr 110px 110px 130px",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <div className="pt-0.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ background: "var(--intent-info-muted)", color: "var(--intent-info)" }}>
                  YNAB-only
                </span>
              </div>
              <div>
                <div className="flex flex-wrap gap-1">
                  {ynabOnlyAccounts.map(a => (
                    <span key={a.id} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]" style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-2)" }}>
                      {a.icon ?? "📦"} {a.name}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] mt-1" style={{ color: "var(--cos-text-3)" }}>Not in SA · adds to net worth independently</p>
              </div>
              <div className="text-right font-mono text-sm pt-0.5" style={{ color: "var(--cos-text-3)" }}>—</div>
              <div className="text-right font-mono text-sm pt-0.5" style={{ color: "var(--cos-text-2)" }}>{fmtSatangs(ynabOnlyTotal)}</div>
              <div className="text-right pt-0.5">
                <span className="text-xs font-mono" style={{ color: "var(--cos-text-3)" }}>no gap</span>
              </div>
            </div>
          )}

          {/* Canonical NW footer */}
          <div
            className="grid gap-4 px-4 py-3 border-t items-center"
            style={{
              gridTemplateColumns: "130px 1fr 110px 110px 130px",
              borderColor: "var(--cos-border-subtle)",
              background: "var(--intent-success-muted)",
            }}
          >
            <div />
            <span className="font-semibold text-sm" style={{ color: "var(--intent-success)" }}>Canonical Net Worth</span>
            <div className="text-right font-mono font-bold text-sm col-span-2" style={{ color: "var(--intent-success)" }}>
              {fmtSatangs(canonicalNw)}
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold" style={{ color: "var(--intent-success)" }}>authoritative</span>
            </div>
          </div>
        </div>

        {/* Equation note */}
        <div className="flex items-start gap-2 rounded-lg p-3" style={{ background: "var(--cos-surface-2)" }}>
          <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--cos-text-3)" }} />
          <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
            <strong>Canonical Net Worth = SA Total + YNAB-only − Liabilities.</strong>{" "}
            SA values are live market prices from{snapshotLabel ? ` the ${snapshotLabel} snapshot` : " the latest snapshot"}.{" "}
            YNAB values are stale reference only — gaps are expected and do not indicate errors.
          </p>
        </div>

      </div>
    </div>
  );
}
