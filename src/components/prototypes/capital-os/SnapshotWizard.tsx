"use client";

/**
 * CapitalOS SA Snapshot Wizard v4
 *
 * Flexible asset entry with pre-defined categories:
 * - Strategic: Bonds, Real Assets, Cash, Healthcare, Consumer Staples
 * - Tactical: US equities, IT, Regional Tilts, Financials, Consumer Discretionary,
 *   Thematics, Dividends
 *
 * Features:
 * - Auto-fetches FX rate from CurrencyFreaks API
 * - Add/remove asset rows freely within each category
 * - Currency selector per asset (THB / USD with auto-conversion)
 */

import { useState, useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  RefreshCw,
  Shield,
  Rocket,
} from "lucide-react";
import { CapitalPortfolioType } from "@/lib/capital-os/types";

/* ── Pre-defined category structure ─────────────────────────── */

interface PredefinedCategory {
  id: string;
  portfolioType: CapitalPortfolioType;
  name: string;
}

const PREDEFINED_CATEGORIES: PredefinedCategory[] = [
  // 🛡️ The Strategic
  { id: "strat_bonds", portfolioType: CapitalPortfolioType.STRATEGIC, name: "Bonds" },
  { id: "strat_real", portfolioType: CapitalPortfolioType.STRATEGIC, name: "Real Assets" },
  { id: "strat_cash", portfolioType: CapitalPortfolioType.STRATEGIC, name: "Cash" },
  { id: "strat_health", portfolioType: CapitalPortfolioType.STRATEGIC, name: "Healthcare" },
  { id: "strat_staples", portfolioType: CapitalPortfolioType.STRATEGIC, name: "Consumer Staples" },
  // 🚀 The Tactical
  { id: "tact_us", portfolioType: CapitalPortfolioType.TACTICAL, name: "US equities" },
  { id: "tact_tech", portfolioType: CapitalPortfolioType.TACTICAL, name: "Information Technology" },
  { id: "tact_regional", portfolioType: CapitalPortfolioType.TACTICAL, name: "Regional Tilts" },
  { id: "tact_fin", portfolioType: CapitalPortfolioType.TACTICAL, name: "Financials" },
  { id: "tact_disc", portfolioType: CapitalPortfolioType.TACTICAL, name: "Consumer Discretionary" },
  { id: "tact_theme", portfolioType: CapitalPortfolioType.TACTICAL, name: "Thematics" },
  { id: "tact_div", portfolioType: CapitalPortfolioType.TACTICAL, name: "Dividends" },
];

/* ── Asset row (client-side only) ─────────────────────────────── */

interface AssetRow {
  tempId: string;
  ticker: string;
  name: string;
  investedValue: string;   // cost basis (what you paid)
  currentValue: string;      // market value (what it's worth now)
  currency: "THB" | "USD";
  shares: string;          // optional
}

interface CategoryState {
  categoryId: string;
  assets: AssetRow[];
}

/* ── Wizard props ─────────────────────────────────────────────── */

interface SnapshotWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

let _idCounter = 0;
function uid() {
  return `asset_${++_idCounter}_${Date.now().toString(36)}`;
}

/* ── Component ────────────────────────────────────────────────── */

export function SnapshotWizard({ isOpen, onClose, onComplete }: SnapshotWizardProps) {
  const [step, setStep] = useState(0); // 0=intro, 1=fx, 2=entry, 3=confirm
  const [fxRate, setFxRate] = useState<string>("");
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category states — one per pre-defined category, initially empty
  const [categoryStates, setCategoryStates] = useState<Record<string, CategoryState>>(() => {
    const map: Record<string, CategoryState> = {};
    for (const cat of PREDEFINED_CATEGORIES) {
      map[cat.id] = { categoryId: cat.id, assets: [] };
    }
    return map;
  });

  /* ── FX Rate: auto-fetch on mount ───────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    fetchFxRate();
  }, [isOpen]);

  const fetchFxRate = async () => {
    setFxLoading(true);
    setFxError(null);
    try {
      const res = await fetch("/api/capital-os/fx-rate");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (typeof data.rate === "number") {
        setFxRate(data.rate.toFixed(4));
      }
    } catch {
      setFxError("Could not fetch live rate. Enter manually.");
    } finally {
      setFxLoading(false);
    }
  };

  /* ── Asset helpers ───────────────────────────────────────────── */
  const addAsset = (categoryId: string) => {
    setCategoryStates((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        assets: [
          ...prev[categoryId].assets,
          { tempId: uid(), ticker: "", name: "", investedValue: "", currentValue: "", currency: "THB", shares: "" },
        ],
      },
    }));
  };

  const removeAsset = (categoryId: string, tempId: string) => {
    setCategoryStates((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        assets: prev[categoryId].assets.filter((a) => a.tempId !== tempId),
      },
    }));
  };

  const updateAsset = (categoryId: string, tempId: string, field: keyof AssetRow, value: string) => {
    setCategoryStates((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        assets: prev[categoryId].assets.map((a) => (a.tempId === tempId ? { ...a, [field]: value } : a)),
      },
    }));
  };

  /* ── Computed values ─────────────────────────────────────────── */
  const rateNum = parseFloat(fxRate) || 0;

  const valueInThb = (rawValue: string): number => {
    const val = parseFloat(rawValue) || 0;
    return val;
  };

  const convertToThb = (value: number, currency: "THB" | "USD"): number => {
    if (currency === "USD" && rateNum > 0) {
      return value * rateNum;
    }
    return value;
  };

  const computeProfitPct = (invested: number, current: number): number => {
    if (invested <= 0) return 0;
    return ((current - invested) / invested) * 100;
  };

  const categoryTotal = (catId: string): number => {
    return categoryStates[catId]?.assets.reduce((sum, a) => sum + convertToThb(valueInThb(a.currentValue), a.currency), 0) || 0;
  };

  const strategicTotal = PREDEFINED_CATEGORIES.filter((c) => c.portfolioType === CapitalPortfolioType.STRATEGIC)
    .reduce((sum, c) => sum + categoryTotal(c.id), 0);

  const tacticalTotal = PREDEFINED_CATEGORIES.filter((c) => c.portfolioType === CapitalPortfolioType.TACTICAL)
    .reduce((sum, c) => sum + categoryTotal(c.id), 0);

  const grandTotal = strategicTotal + tacticalTotal;

  const hasAnyValue = grandTotal > 0;

  /* ── Format helpers ──────────────────────────────────────────── */
  const fmtCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const allAssets: {
        ticker: string;
        name: string;
        valueThb: number;
        shares: number | null;
        categoryId: string;
      }[] = [];

      for (const cat of PREDEFINED_CATEGORIES) {
        const state = categoryStates[cat.id];
        for (const asset of state.assets) {
          const currentThb = convertToThb(valueInThb(asset.currentValue), asset.currency);
          if (currentThb > 0) {
            allAssets.push({
              ticker: asset.ticker || "UNKNOWN",
              name: asset.name || asset.ticker || "Unnamed Asset",
              valueThb: Math.round(currentThb * 100), // satangs
              shares: asset.shares ? parseFloat(asset.shares) : null,
              categoryId: cat.id,
            });
          }
        }
      }

      const response = await fetch("/api/capital-os/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fxRateUsdThb: rateNum,
          saTotal: Math.round(grandTotal * 100),
          saPortfolios: {
            strategic: { total: Math.round(strategicTotal * 100) },
            tactical: { total: Math.round(tacticalTotal * 100) },
          },
          assets: allAssets,
        }),
      });

      if (response.ok) {
        onComplete();
        onClose();
        setStep(0);
        // Reset all category states
        const resetMap: Record<string, CategoryState> = {};
        for (const cat of PREDEFINED_CATEGORIES) {
          resetMap[cat.id] = { categoryId: cat.id, assets: [] };
        }
        setCategoryStates(resetMap);
        setFxRate("");
      } else {
        console.error("Failed to save snapshot");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Reset on close ──────────────────────────────────────────── */
  const handleClose = () => {
    onClose();
    setStep(0);
  };

  if (!isOpen) return null;

  /* ── Render helpers ──────────────────────────────────────────── */
  const strategicCats = PREDEFINED_CATEGORIES.filter((c) => c.portfolioType === CapitalPortfolioType.STRATEGIC);
  const tacticalCats = PREDEFINED_CATEGORIES.filter((c) => c.portfolioType === CapitalPortfolioType.TACTICAL);

  const renderCategorySection = (cat: PredefinedCategory) => {
    const state = categoryStates[cat.id];
    const total = categoryTotal(cat.id);
    const typeIcon = cat.portfolioType === CapitalPortfolioType.STRATEGIC ? Shield : Rocket;
    const typeColor = cat.portfolioType === CapitalPortfolioType.STRATEGIC ? "var(--intent-success)" : "var(--intent-accent)";
    const typeBg = cat.portfolioType === CapitalPortfolioType.STRATEGIC ? "var(--intent-success-muted)" : "var(--intent-accent-muted)";

    return (
      <div
        key={cat.id}
        className="rounded-xl border p-4"
        style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
      >
        {/* Category header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: typeBg }}
            >
              <typeIcon className="h-4 w-4" style={{ color: typeColor }} />
            </div>
            <span className="text-sm font-semibold">{cat.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: typeBg, color: typeColor }}
            >
              {cat.portfolioType}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {total > 0 && (
              <span className="font-mono text-sm" style={{ color: typeColor }}>
                {fmtCurrency(total)}
              </span>
            )}
            <button
              onClick={() => addAsset(cat.id)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:opacity-80"
              style={{ background: typeBg, color: typeColor }}
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
        </div>

        {/* Asset rows */}
        <div className="space-y-2">
          {state.assets.length === 0 ? (
            <div
              className="rounded-lg border border-dashed p-3 text-center text-xs"
              style={{ borderColor: "var(--cos-border-subtle)", color: "var(--cos-text-3)" }}
            >
              No assets. Click "Add" to add your first asset.
            </div>
          ) : (
            state.assets.map((asset) => {
              const invested = valueInThb(asset.investedValue);
              const current = valueInThb(asset.currentValue);
              const profitPct = computeProfitPct(invested, current);
              const investedThb = convertToThb(invested, asset.currency);
              const currentThb = convertToThb(current, asset.currency);

              return (
                <div
                  key={asset.tempId}
                  className="rounded-lg border p-3 space-y-3"
                  style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border-subtle)" }}
                >
                  {/* Row 1: Identity */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ticker"
                      value={asset.ticker}
                      onChange={(e) => updateAsset(cat.id, asset.tempId, "ticker", e.target.value)}
                      className="w-24 rounded border px-2 py-1.5 text-xs font-mono"
                      style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
                    />
                    <input
                      type="text"
                      placeholder="Asset name"
                      value={asset.name}
                      onChange={(e) => updateAsset(cat.id, asset.tempId, "name", e.target.value)}
                      className="flex-1 min-w-0 rounded border px-2 py-1.5 text-xs"
                      style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
                    />
                    <button
                      onClick={() => removeAsset(cat.id, asset.tempId)}
                      className="p-1.5 rounded transition-colors hover:bg-red-500/10"
                      style={{ color: "var(--intent-danger)" }}
                      title="Remove asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Row 2: Values */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Shares */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase" style={{ color: "var(--cos-text-3)" }}>Shares</span>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="0"
                        value={asset.shares}
                        onChange={(e) => updateAsset(cat.id, asset.tempId, "shares", e.target.value)}
                        className="w-20 rounded border px-2 py-1.5 text-xs font-mono text-right"
                        style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
                      />
                    </div>

                    {/* Currency */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase" style={{ color: "var(--cos-text-3)" }}>Currency</span>
                      <select
                        value={asset.currency}
                        onChange={(e) => updateAsset(cat.id, asset.tempId, "currency", e.target.value)}
                        className="w-16 rounded border px-1 py-1.5 text-xs font-mono"
                        style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
                      >
                        <option value="THB">THB</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    {/* Invested Value */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase" style={{ color: "var(--cos-text-3)" }}>Invested</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={asset.investedValue}
                        onChange={(e) => updateAsset(cat.id, asset.tempId, "investedValue", e.target.value)}
                        className="w-24 rounded border px-2 py-1.5 text-xs font-mono text-right"
                        style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
                      />
                    </div>

                    {/* Current Value */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase" style={{ color: "var(--cos-text-3)" }}>Current</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={asset.currentValue}
                        onChange={(e) => updateAsset(cat.id, asset.tempId, "currentValue", e.target.value)}
                        className="w-24 rounded border px-2 py-1.5 text-xs font-mono text-right"
                        style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
                      />
                    </div>

                    {/* Profit % - Computed */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase" style={{ color: "var(--cos-text-3)" }}>P/L %</span>
                      <div
                        className="w-20 rounded border px-2 py-1.5 text-xs font-mono text-right font-medium"
                        style={{
                          background: profitPct >= 0 ? "var(--intent-success-muted)" : "var(--intent-danger-muted)",
                          borderColor: profitPct >= 0 ? "var(--intent-success)" : "var(--intent-danger)",
                          color: profitPct >= 0 ? "var(--intent-success)" : "var(--intent-danger)",
                        }}
                      >
                        {invested > 0 ? `${profitPct >= 0 ? "+" : ""}${profitPct.toFixed(1)}%` : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Computed THB values */}
                  {(investedThb > 0 || currentThb > 0) && (
                    <div className="flex items-center gap-4 text-xs" style={{ color: "var(--cos-text-3)" }}>
                      <span>Invested: {fmtCurrency(investedThb)}</span>
                      <span>Current: {fmtCurrency(currentThb)}</span>
                      <span
                        className="font-medium"
                        style={{ color: currentThb >= investedThb ? "var(--intent-success)" : "var(--intent-danger)" }}
                      >
                        Δ {fmtCurrency(currentThb - investedThb)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border shadow-2xl flex flex-col"
        style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {step === 0 && "SA Portfolio Snapshot"}
              {step === 1 && "Exchange Rate"}
              {step === 2 && "Portfolio Entry"}
              {step === 3 && "Review & Confirm"}
            </h2>
            <span className="text-xs" style={{ color: "var(--cos-text-3)" }}>
              Step {step + 1} of 4
            </span>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--cos-surface-2)]"
          >
            <X className="h-5 w-5" style={{ color: "var(--cos-text-2)" }} />
          </button>
        </div>

        {/* ── Progress bar ────────────────────────────────────────── */}
        <div className="px-6 py-3">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{
                  background: i <= step ? "var(--intent-success)" : "var(--cos-surface-2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 0: Intro */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--intent-success-muted)" }}
              >
                <TrendingUp className="h-8 w-8" style={{ color: "var(--intent-success)" }} />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Capture SA Portfolio Values</h3>
                <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
                  Enter your Snowball Analytics portfolio values to reconcile with YNAB.
                  Add any number of assets per category — completely flexible.
                </p>
              </div>
              <div
                className="grid grid-cols-2 gap-4 rounded-xl border p-4"
                style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border-subtle)" }}
              >
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-xs" style={{ color: "var(--cos-text-3)" }}>
                    <Shield className="h-3 w-3" /> Strategic
                  </div>
                  <div className="font-mono text-lg font-bold" style={{ color: "var(--intent-success)" }}>
                    {strategicCats.length}
                  </div>
                  <div className="text-xs" style={{ color: "var(--cos-text-3)" }}>categories</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1 text-xs" style={{ color: "var(--cos-text-3)" }}>
                    <Rocket className="h-3 w-3" /> Tactical
                  </div>
                  <div className="font-mono text-lg font-bold" style={{ color: "var(--intent-accent)" }}>
                    {tacticalCats.length}
                  </div>
                  <div className="text-xs" style={{ color: "var(--cos-text-3)" }}>categories</div>
                </div>
              </div>
              <div className="text-xs" style={{ color: "var(--cos-text-3)" }}>
                FX rate will be fetched automatically from CurrencyFreaks.
              </div>
            </div>
          )}

          {/* Step 1: FX Rate */}
          {step === 1 && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center">
                <DollarSign className="mx-auto h-12 w-12" style={{ color: "var(--intent-accent)" }} />
                <h3 className="mt-4 text-lg font-semibold">Exchange Rate</h3>
                <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
                  USD/THB rate is fetched live from CurrencyFreaks. Edit if needed.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">USD/THB Rate</label>
                  <button
                    onClick={fetchFxRate}
                    disabled={fxLoading}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
                    style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-2)" }}
                  >
                    <RefreshCw className={`h-3 w-3 ${fxLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    value={fxRate}
                    onChange={(e) => setFxRate(e.target.value)}
                    placeholder="33.47"
                    className="w-full rounded-lg border px-4 py-3 font-mono text-center text-xl"
                    style={{
                      background: "var(--cos-bg)",
                      borderColor: fxError ? "var(--intent-danger)" : "var(--cos-border-subtle)",
                    }}
                  />
                  {fxRate && (
                    <div className="mt-1 text-center text-xs" style={{ color: "var(--cos-text-3)" }}>
                      1 USD = {fxRate} THB
                    </div>
                  )}
                </div>
                {fxError && (
                  <div className="text-xs" style={{ color: "var(--intent-danger)" }}>
                    {fxError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Portfolio Entry */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Strategic section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4" style={{ color: "var(--intent-success)" }} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--intent-success)" }}>
                    The Strategic
                  </h3>
                  {strategicTotal > 0 && (
                    <span className="ml-auto font-mono text-sm" style={{ color: "var(--intent-success)" }}>
                      {fmtCurrency(strategicTotal)}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {strategicCats.map(renderCategorySection)}
                </div>
              </div>

              {/* Tactical section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="h-4 w-4" style={{ color: "var(--intent-accent)" }} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--intent-accent)" }}>
                    The Tactical
                  </h3>
                  {tacticalTotal > 0 && (
                    <span className="ml-auto font-mono text-sm" style={{ color: "var(--intent-accent)" }}>
                      {fmtCurrency(tacticalTotal)}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {tacticalCats.map(renderCategorySection)}
                </div>
              </div>

              {/* Grand total */}
              <div
                className="flex items-center justify-between rounded-xl border p-4"
                style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border-subtle)" }}
              >
                <span className="text-sm font-semibold">Grand Total</span>
                <span className="font-mono text-lg font-bold" style={{ color: "var(--intent-accent)" }}>
                  {fmtCurrency(grandTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12" style={{ color: "var(--intent-success)" }} />
                <h3 className="mt-4 text-lg font-semibold">Review & Save</h3>
                <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
                  Verify the totals before saving to your net worth calculation.
                </p>
              </div>

              <div
                className="rounded-xl border p-4 font-mono text-sm space-y-3"
                style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border-subtle)" }}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--intent-accent)" }}>
                  Snapshot Summary
                </div>

                {/* Per-category breakdown */}
                {PREDEFINED_CATEGORIES.map((cat) => {
                  const total = categoryTotal(cat.id);
                  if (total === 0) return null;
                  return (
                    <div key={cat.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {cat.portfolioType === CapitalPortfolioType.STRATEGIC ? (
                          <Shield className="h-3 w-3" style={{ color: "var(--intent-success)" }} />
                        ) : (
                          <Rocket className="h-3 w-3" style={{ color: "var(--intent-accent)" }} />
                        )}
                        <span style={{ color: "var(--cos-text-2)" }}>{cat.name}</span>
                        <span className="text-xs" style={{ color: "var(--cos-text-3)" }}>
                          ({categoryStates[cat.id].assets.filter((a) => valueInThb(a.currentValue) > 0).length} assets)
                        </span>
                      </div>
                      <span>{fmtCurrency(total)}</span>
                    </div>
                  );
                })}

                <div
                  className="border-t pt-2 flex justify-between font-bold"
                  style={{ borderColor: "var(--cos-border-subtle)" }}
                >
                  <span style={{ color: "var(--cos-text-2)" }}>SA Total</span>
                  <span style={{ color: "var(--intent-accent)" }}>{fmtCurrency(grandTotal)}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--cos-text-3)" }}>Strategic</span>
                  <span>{fmtCurrency(strategicTotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--cos-text-3)" }}>Tactical</span>
                  <span>{fmtCurrency(tacticalTotal)}</span>
                </div>

                <div
                  className="border-t pt-2 flex justify-between text-xs"
                  style={{ borderColor: "var(--cos-border-subtle)" }}
                >
                  <span style={{ color: "var(--cos-text-3)" }}>FX Rate</span>
                  <span>1 USD = {fxRate || "—"} THB</span>
                </div>
              </div>

              <div
                className="rounded-xl border p-4 text-sm"
                style={{
                  background: "var(--intent-success-muted)",
                  borderColor: "var(--intent-success)",
                  color: "var(--intent-success)",
                }}
              >
                After saving, the canonical net worth will be updated with live SA values.
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between border-t px-6 py-4"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
            style={{ color: "var(--cos-text-2)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step === 3 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !hasAnyValue}
              className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: "var(--intent-success)" }}
            >
              {isSubmitting ? "Saving..." : "Save Snapshot"}
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !rateNum}
              className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: "var(--intent-accent)" }}
            >
              {step === 0 ? "Start" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
