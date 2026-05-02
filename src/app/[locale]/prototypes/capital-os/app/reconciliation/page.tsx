"use client";

/**
 * CapitalOS v4 — Reconciliation Page
 * 
 * Gap analysis between SA live values and YNAB stale values.
 * Displays the "Gap" metric: YNAB Value − SA Value
 * Uses canonical equation: NW = SA(Investments) + YNAB(Stale − Covered + Liabilities)
 */

import { useState, useEffect, useMemo } from "react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import type { CapitalAccount, CapitalSACategory, CapitalSAAsset, CapitalLiability } from "@/lib/capital-os/types";
import { CapitalMappingRole, CapitalPortfolioType } from "@/lib/capital-os/types";
import { 
  AlertTriangle, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Info,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface ReconciliationRow {
  categoryId: string;
  categoryName: string;
  portfolioType: CapitalPortfolioType;
  saValue: number;      // Live value from SA snapshot (satangs)
  ynabValue: number;    // Sum of mapped YNAB accounts (satangs)
  gap: number;          // ynabValue − saValue
  mappedAccounts: { name: string; balance: number }[];
}

export default function ReconciliationPage() {
  const [accounts, setAccounts] = useState<CapitalAccount[]>([]);
  const [saCategories, setSACategories] = useState<CapitalSACategory[]>([]);
  const [mappingConfig, setMappingConfig] = useState<{ ynabAccId: string; saCategory?: string; role: CapitalMappingRole }[]>([]);
  const [liabilities, setLiabilities] = useState<CapitalLiability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/capital-os/accounts").then(r => r.json()),
      fetch("/api/capital-os/sa-categories").then(r => r.json()),
      fetch("/api/capital-os/mapping").then(r => r.json()),
      fetch("/api/capital-os/liabilities").then(r => r.json()),
    ]).then(([accRes, saRes, mapRes, liabRes]) => {
      setAccounts(accRes.accounts || []);
      setSACategories([...(saRes.strategic || []), ...(saRes.tactical || [])]);
      setMappingConfig(mapRes || []);
      setLiabilities(liabRes || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Build reconciliation rows
  const { rows, totals, canonicalNw } = useMemo(() => {
    const saCovered = accounts.filter(a => {
      const m = mappingConfig.find(mc => mc.ynabAccId === a.externalId);
      return m?.role === CapitalMappingRole.SA_COVERED;
    });

    const ynabOnly = accounts.filter(a => {
      const m = mappingConfig.find(mc => mc.ynabAccId === a.externalId);
      return !m || m.role === CapitalMappingRole.YNAB_ONLY;
    });

    // Build rows by SA category
    const rows: ReconciliationRow[] = saCategories.map(cat => {
      const catAccounts = saCovered.filter(a => {
        const m = mappingConfig.find(mc => mc.ynabAccId === a.externalId);
        return m?.saCategory === cat.id;
      });
      
      const ynabValue = catAccounts.reduce((sum, a) => sum + Number(a.balance), 0);
      // Demo SA value - in real implementation would come from latest snapshot
      const saValue = ynabValue + (Math.random() * 100000 - 50000); // Simulated variance
      
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        portfolioType: cat.portfolioType,
        saValue,
        ynabValue,
        gap: ynabValue - saValue,
        mappedAccounts: catAccounts.map(a => ({ name: a.name, balance: Number(a.balance) })),
      };
    });

    const totals = {
      saTotal: rows.reduce((s, r) => s + r.saValue, 0),
      ynabTotal: rows.reduce((s, r) => s + r.ynabValue, 0),
      gapTotal: rows.reduce((s, r) => s + r.gap, 0),
      ynabOnlyTotal: ynabOnly.reduce((s, a) => s + Number(a.balance), 0),
    };

    const totalLiabilities = liabilities.reduce((s, l) => s + Number(l.balance), 0);
    // Canonical NW equation
    const canonicalNw = totals.saTotal + totals.ynabOnlyTotal - totalLiabilities;

    return { rows, totals, canonicalNw, totalLiabilities };
  }, [accounts, saCategories, mappingConfig, liabilities]);

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(n / 100);

  const getGapSeverity = (gap: number, base: number) => {
    if (base === 0) return "neutral";
    const pct = Math.abs(gap) / base;
    if (pct > 0.05) return "high";
    if (pct > 0.02) return "medium";
    return "low";
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <CapitalOSHeader title="Reconciliation" subtitle="SA vs YNAB gap analysis" />
        <div className="p-6">
          <div className="h-32 animate-pulse rounded-xl bg-[var(--cos-surface)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader title="Reconciliation" subtitle="SA vs YNAB gap analysis" />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Canonical Equation Display */}
        <div className="mb-6 rounded-xl border p-6" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--cos-text-3)" }}>
            Canonical Net Worth Equation
          </div>
          <div className="flex flex-wrap items-center gap-2 text-lg font-mono">
            <span className="font-bold" style={{ color: "var(--intent-accent)" }}>{fmt(canonicalNw || 0)}</span>
            <span style={{ color: "var(--cos-text-3)" }}>=</span>
            <span style={{ color: "var(--intent-accent)" }}>SA</span>
            <span style={{ color: "var(--cos-text-3)" }}>+</span>
            <span style={{ color: "var(--intent-warning)" }}>YNAB_Only</span>
            <span style={{ color: "var(--cos-text-3)" }}>−</span>
            <span style={{ color: "var(--intent-danger)" }}>Liabilities</span>
          </div>
          <div className="mt-3 text-sm" style={{ color: "var(--cos-text-2)" }}>
            NW = <strong>฿{((totals.saTotal || 1) / 100).toLocaleString()}</strong> (SA live) 
            + <strong>฿{((totals.ynabOnlyTotal || 0) / 100).toLocaleString()}</strong> (YNAB only) 
            − <strong>฿{((liabilities.reduce((s, l) => s + Number(l.balance), 0) || 0) / 100).toLocaleString()}</strong> (liabilities)
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--cos-text-3)" }}>SA Live Total</div>
            <div className="font-mono text-xl font-bold" style={{ color: "var(--intent-accent)" }}>{fmt(totals.saTotal)}</div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--cos-text-3)" }}>YNAB Stale Total</div>
            <div className="font-mono text-xl font-bold" style={{ color: "var(--cos-text-2)" }}>{fmt(totals.ynabTotal)}</div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--cos-text-3)" }}>Gap (YNAB − SA)</div>
            <div className={`font-mono text-xl font-bold ${totals.gapTotal > 0 ? 'text-[var(--intent-warning)]' : totals.gapTotal < 0 ? 'text-[var(--intent-success)]' : ''}`}>
              {totals.gapTotal > 0 ? "+" : ""}{fmt(totals.gapTotal)}
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--cos-text-3)" }}>Drift %</div>
            <div className={`font-mono text-xl font-bold ${Math.abs(totals.gapTotal / (totals.saTotal || 1)) > 0.05 ? 'text-[var(--intent-danger)]' : 'text-[var(--intent-success)]'}`}>
              {((totals.gapTotal / (totals.saTotal || 1)) * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Gap Table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
          <div className="grid grid-cols-[1fr,120px,120px,120px,100px] gap-4 p-4 text-xs font-semibold uppercase tracking-wider" style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-3)" }}>
            <span>Category</span>
            <span className="text-right">SA Value</span>
            <span className="text-right">YNAB Value</span>
            <span className="text-right">Gap</span>
            <span className="text-center">Status</span>
          </div>

          {rows.map(row => {
            const severity = getGapSeverity(row.gap, row.saValue);
            return (
              <div key={row.categoryId} className="grid grid-cols-[1fr,120px,120px,120px,100px] gap-4 items-center p-4 border-t" style={{ borderColor: "var(--cos-border-subtle)" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: row.portfolioType === "STRATEGIC" ? "var(--intent-accent-muted)" : "var(--intent-warning-muted)", color: row.portfolioType === "STRATEGIC" ? "var(--intent-accent)" : "var(--intent-warning)" }}>
                      {row.portfolioType}
                    </span>
                    <span className="font-medium">{row.categoryName}</span>
                  </div>
                  {row.mappedAccounts.length > 0 && (
                    <div className="text-xs mt-1" style={{ color: "var(--cos-text-3)" }}>
                      {row.mappedAccounts.map(a => a.name).join(", ")}
                    </div>
                  )}
                </div>
                <div className="text-right font-mono text-sm" style={{ color: "var(--intent-accent)" }}>{fmt(row.saValue)}</div>
                <div className="text-right font-mono text-sm">{fmt(row.ynabValue)}</div>
                <div className={`text-right font-mono text-sm font-medium ${row.gap > 0 ? 'text-[var(--intent-warning)]' : row.gap < 0 ? 'text-[var(--intent-success)]' : ''}`}>
                  {row.gap > 0 ? "+" : ""}{fmt(row.gap)}
                </div>
                <div className="flex justify-center">
                  {severity === "high" ? (
                    <AlertTriangle className="h-5 w-5" style={{ color: "var(--intent-danger)" }} />
                  ) : severity === "medium" ? (
                    <AlertCircle className="h-5 w-5" style={{ color: "var(--intent-warning)" }} />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" style={{ color: "var(--intent-success)" }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm" style={{ color: "var(--cos-text-2)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" style={{ color: "var(--intent-success)" }} />
            <span>&lt; 2% drift</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" style={{ color: "var(--intent-warning)" }} />
            <span>2-5% drift</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--intent-danger)" }} />
            <span>&gt; 5% drift (reconcile needed)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
