"use client";

/**
 * CapitalOS SA Snapshot Wizard
 * Multi-step form to capture SA portfolio values
 * Steps: Intro → FX Rate → Strategic Categories → Tactical Categories → Confirm
 */

import { useState, useMemo } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp,
  DollarSign
} from "lucide-react";
import { CapitalSACategory, CapitalSAAsset, CapitalPortfolioType } from "@/lib/capital-os/types";

interface SnapshotWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  categories: {
    strategic: CapitalSACategory[];
    tactical: CapitalSACategory[];
  };
}

interface AssetInput {
  ticker: string;
  name: string;
  valueThb: string;
  shares: string;
  targetPct: string;
}

export function SnapshotWizard({ isOpen, onClose, onComplete, categories }: SnapshotWizardProps) {
  const [step, setStep] = useState(0); // 0=intro, 1=fx, 2+ = categories, last=confirm
  const [fxRate, setFxRate] = useState("33.47");
  const [assetInputs, setAssetInputs] = useState<Record<string, AssetInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten all categories
  const allCategories = useMemo(() => {
    return [...categories.strategic, ...categories.tactical];
  }, [categories]);

  // Calculate total steps: intro + fx + categories + confirm
  const totalSteps = 2 + allCategories.length + 1;
  const categoryStep = step - 2;
  const currentCategory = categoryStep >= 0 && categoryStep < allCategories.length 
    ? allCategories[categoryStep] 
    : null;
  const isConfirm = step === totalSteps - 1;

  const updateAssetValue = (ticker: string, field: keyof AssetInput, value: string) => {
    setAssetInputs(prev => ({
      ...prev,
      [ticker]: {
        ...prev[ticker],
        ticker,
        [field]: value,
      }
    }));
  };

  const getCategoryTotal = (category: CapitalSACategory): number => {
    return category.assets?.reduce((sum, asset) => {
      const input = assetInputs[asset.ticker];
      const valueThb = input?.valueThb ? parseFloat(input.valueThb) : 0;
      return sum + (valueThb || 0);
    }, 0) || 0;
  };

  const getGrandTotal = (): number => {
    return allCategories.reduce((sum, cat) => sum + getCategoryTotal(cat), 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Collect all asset data
      const assets = Object.values(assetInputs).filter(a => a.valueThb && parseFloat(a.valueThb) > 0);
      
      const response = await fetch("/api/capital-os/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fxRateUsdThb: parseFloat(fxRate),
          saTotal: getGrandTotal() * 100, // Convert to satangs
          saPortfolios: {
            strategic: {
              total: categories.strategic.reduce((sum, cat) => sum + getCategoryTotal(cat), 0) * 100,
            },
            tactical: {
              total: categories.tactical.reduce((sum, cat) => sum + getCategoryTotal(cat), 0) * 100,
            },
          },
          assets: assets.map(a => ({
            ticker: a.ticker,
            valueThb: parseFloat(a.valueThb) * 100, // Convert to satangs
            shares: a.shares ? parseFloat(a.shares) : null,
          })),
        }),
      });

      if (response.ok) {
        onComplete();
        onClose();
        setStep(0);
        setAssetInputs({});
      } else {
        console.error("Failed to save snapshot");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border bg-[var(--surface-elevated)] border-[var(--border-subtle)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
          <h2 className="text-lg font-semibold">
            {step === 0 && "SA Portfolio Snapshot"}
            {step === 1 && "Exchange Rate"}
            {currentCategory && currentCategory.name}
            {isConfirm && "Review & Confirm"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 border-b border-[var(--border-subtle)]">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-[var(--intent-success)]" : "bg-[var(--surface-3)]"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-[var(--text-tertiary)]">
            Step {step + 1} of {totalSteps}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Intro */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--intent-success-muted)]">
                <TrendingUp className="h-8 w-8 text-[var(--intent-success)]" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Capture SA Portfolio Values</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Enter your Snowball Analytics portfolio values to reconcile with YNAB.
                  This takes about 3 minutes.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                <div className="text-center">
                  <div className="mb-1 text-xs text-[var(--text-tertiary)]">Categories</div>
                  <div className="font-mono text-sm font-bold text-[var(--intent-accent)]">{allCategories.length}</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-xs text-[var(--text-tertiary)]">Strategic</div>
                  <div className="font-mono text-sm font-bold">{categories.strategic.length}</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-xs text-[var(--text-tertiary)]">Tactical</div>
                  <div className="font-mono text-sm font-bold">{categories.tactical.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: FX Rate */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <DollarSign className="mx-auto h-12 w-12 text-[var(--intent-accent)]" />
                <h3 className="mt-4 text-lg font-semibold">Exchange Rate</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Enter the current USD/THB exchange rate for accurate conversion.
                </p>
              </div>
              <div className="mx-auto max-w-xs">
                <label className="mb-2 block text-sm font-medium">USD/THB Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={fxRate}
                    onChange={(e) => setFxRate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 font-mono text-center text-xl"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-[var(--text-tertiary)]">
                  1 USD = {fxRate} THB
                </p>
              </div>
            </div>
          )}

          {/* Category steps */}
          {currentCategory && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-[var(--intent-accent-muted)] px-3 py-1 text-xs font-medium text-[var(--intent-accent)]">
                  {currentCategory.portfolioType}
                </span>
                {currentCategory.targetPct && (
                  <span className="text-xs text-[var(--text-tertiary)]">
                    Target: {currentCategory.targetPct}%
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {currentCategory.assets?.map((asset) => {
                  const input = assetInputs[asset.ticker] || {};
                  return (
                    <div
                      key={asset.ticker}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="rounded bg-[var(--intent-accent-muted)] px-2 py-0.5 text-xs font-mono font-medium text-[var(--intent-accent)]">
                            {asset.ticker}
                          </span>
                          <span className="text-sm font-medium">{asset.name}</span>
                        </div>
                        {asset.targetPct && (
                          <span className="text-xs text-[var(--text-tertiary)]">
                            Target: {asset.targetPct}%
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="mb-1 block text-xs text-[var(--text-tertiary)]">
                            Value (THB)
                          </label>
                          <input
                            type="number"
                            value={input.valueThb || ""}
                            onChange={(e) => updateAssetValue(asset.ticker, "valueThb", e.target.value)}
                            placeholder="฿0"
                            className="w-full rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-[var(--text-tertiary)]">
                            Shares
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={input.shares || ""}
                            onChange={(e) => updateAssetValue(asset.ticker, "shares", e.target.value)}
                            placeholder="Optional"
                            className="w-full rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-[var(--text-tertiary)]">
                            Current %
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={input.targetPct || ""}
                            onChange={(e) => updateAssetValue(asset.ticker, "targetPct", e.target.value)}
                            placeholder="Auto"
                            className="w-full rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category subtotal */}
              <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <span className="text-sm text-[var(--text-secondary)]">
                  {currentCategory.name} Subtotal
                </span>
                <span className="font-mono font-medium text-[var(--intent-accent)]">
                  {formatCurrency(getCategoryTotal(currentCategory))}
                </span>
              </div>
            </div>
          )}

          {/* Confirm step */}
          {isConfirm && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--intent-success)]" />
                <h3 className="mt-4 text-lg font-semibold">Review & Save</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Verify the totals before saving to your net worth calculation.
                </p>
              </div>

              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 font-mono text-sm">
                <div className="mb-3 text-xs uppercase tracking-wider text-[var(--intent-accent)]">
                  Snapshot Summary
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">SA Total</span>
                    <span className="text-[var(--intent-accent)]">
                      {formatCurrency(getGrandTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Strategic</span>
                    <span>
                      {formatCurrency(categories.strategic.reduce((s, c) => s + getCategoryTotal(c), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Tactical</span>
                    <span>
                      {formatCurrency(categories.tactical.reduce((s, c) => s + getCategoryTotal(c), 0))}
                    </span>
                  </div>
                  <div className="border-t border-[var(--border-subtle)] pt-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">FX Rate</span>
                      <span>1 USD = {fxRate} THB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--intent-success-muted)] bg-[var(--intent-success-muted)]/30 p-4 text-sm text-[var(--intent-success)]">
                After saving, the canonical net worth will be updated with live SA values.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-6 py-4">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {isConfirm ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || getGrandTotal() === 0}
              className="flex items-center gap-2 rounded-lg bg-[var(--intent-success)] px-6 py-2 text-sm font-semibold text-[var(--bg)] transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Snapshot"}
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 rounded-lg bg-[var(--intent-accent)] px-6 py-2 text-sm font-semibold text-[var(--bg)] transition-colors hover:opacity-90"
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
