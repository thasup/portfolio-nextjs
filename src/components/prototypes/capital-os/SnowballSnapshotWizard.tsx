"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronRight, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { fmtCurrency } from "@/lib/capital-os/format";

interface WizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SnowballSnapshotWizard({ onClose, onSuccess }: WizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Step 4 is CSV upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingFx, setIsFetchingFx] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    snapshotDate: new Date().toISOString().split("T")[0],
    fxRateUsdThb: 33.47, // Mock fetched rate
    totalValueUsd: "",
    totalProfitUsd: "",
    totalProfitPct: "",
    irrPct: "",
    passiveIncomeUsd: "",
    passiveYieldPct: "",
    cashBalanceUsd: "",

    strategicValueUsd: "",
    strategicProfitPct: "",
    tacticalValueUsd: "",
    tacticalProfitPct: "",
  });

  useEffect(() => {
    let mounted = true;
    async function fetchFx() {
      setIsFetchingFx(true);
      try {
        const res = await fetch("/api/capital-os/fx-rate");
        if (res.ok) {
          const data = await res.json();
          if (data.rate && mounted) {
            setFormData((prev) => ({ ...prev, fxRateUsdThb: data.rate }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch FX rate:", err);
      } finally {
        if (mounted) setIsFetchingFx(false);
      }
    }
    fetchFx();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-computed fields
  const totalValueUsdNum = Number(formData.totalValueUsd) || 0;
  const totalValueThb = totalValueUsdNum * formData.fxRateUsdThb;
  
  const strategicValueUsdNum = Number(formData.strategicValueUsd) || 0;
  const tacticalValueUsdNum = Number(formData.tacticalValueUsd) || 0;
  const computedTotalSub = strategicValueUsdNum + tacticalValueUsdNum;
  
  const strategicAllocPct = computedTotalSub > 0 ? (strategicValueUsdNum / computedTotalSub) * 100 : 0;
  const tacticalAllocPct = computedTotalSub > 0 ? (tacticalValueUsdNum / computedTotalSub) * 100 : 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const parseCsv = (csvText: string) => {
    // Stage 2: Basic Mock CSV Parser for Snowball Analytics Export
    // Expected columns: Holding, Shares, Cost basis, Current value, PE, Payout, Beta, Dividends, Dividend yield, Dividend growth, Rating, Capital gain, Total profit, Daily, IRR
    
    // In a real app, we'd use a CSV library, but for the prototype:
    const lines = csvText.split('\n');
    if (lines.length < 2) return;

    let totalUsd = 0;
    let totalCostUsd = 0;
    let totalDividends = 0;
    
    // Mock parsing some values to auto-fill the form
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',');
      if (cols.length >= 15) {
        // Just mock aggregating some data
        const currentVal = parseFloat(cols[3].replace(/[^0-9.-]+/g,"")) || 0;
        const costBasis = parseFloat(cols[2].replace(/[^0-9.-]+/g,"")) || 0;
        const dividends = parseFloat(cols[7].replace(/[^0-9.-]+/g,"")) || 0;
        totalUsd += currentVal;
        totalCostUsd += costBasis;
        totalDividends += dividends;
      }
    }
    
    if (totalUsd > 0) {
      setFormData(prev => ({
        ...prev,
        totalValueUsd: totalUsd.toFixed(2),
        totalProfitUsd: (totalUsd - totalCostUsd).toFixed(2),
        totalProfitPct: (((totalUsd - totalCostUsd) / totalCostUsd) * 100).toFixed(2),
        passiveIncomeUsd: totalDividends.toFixed(2),
        passiveYieldPct: ((totalDividends / totalUsd) * 100).toFixed(2),
      }));
      setStep(1); // Jump back to step 1 to review
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCsv(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create CapitalSnowballSnapshot in DB
      // Also write back to standard accounts so it shows up in the Accounts page
      const satangs = BigInt(Math.round(totalValueThb * 100));

      await fetch("/api/capital-os/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Snowball Portfolio",
          balance: satangs.toString(),
          type: "INVESTMENT",
          source: "MANUAL",
          externalId: "manual-snowball",
          icon: "📈",
        }),
      });

      // Optionally here: POST to a new endpoint for CapitalSnowballSnapshot to store the rest of the 20 fields.
      // (This fulfills the schema expansion part)
      await fetch("/api/capital-os/snowball", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalValueThb,
          strategicAllocPct,
          tacticalAllocPct
        }),
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save snapshot");
    } finally {
      setIsSubmitting(false);
    }
  };

  // MOCK: last snapshot divergence
  const lastSnapshot = {
    netWorthThb: 572342, // Last THB
    irrPct: 15.74,
    passiveIncomeUsd: 1645.00
  };

  const deltaNetWorth = totalValueThb - lastSnapshot.netWorthThb;
  const deltaNetWorthPct = lastSnapshot.netWorthThb ? (deltaNetWorth / lastSnapshot.netWorthThb) * 100 : 0;
  const deltaIrr = (Number(formData.irrPct) || 0) - lastSnapshot.irrPct;
  const deltaPassive = (Number(formData.passiveIncomeUsd) || 0) - lastSnapshot.passiveIncomeUsd;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border bg-[var(--cos-surface)] shadow-2xl flex flex-col max-h-[90vh]"
        style={{ borderColor: "var(--cos-border-subtle)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--cos-border-subtle)" }}>
          <div>
            <h3 className="text-lg font-bold">Snowball Portfolio Snapshot</h3>
            <p className="text-xs text-[var(--cos-text-2)] font-mono mt-1 uppercase tracking-wider">
              {step === 4 ? "CSV Import Mode" : `Step ${step} of 3`}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/5 text-[var(--cos-text-2)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl border-[var(--cos-accent)] bg-[var(--cos-accent-muted)]">
              <Image
                src="/capital_os/icons/snowball-analytics-icon.webp"
                alt="Snowball Analytics"
                width={48}
                height={48}
                className="h-12 w-12 mb-4 object-contain rounded-lg"
              />
              <p className="text-sm font-medium mb-2 text-white">Upload Snowball Export (CSV)</p>
              <p className="text-xs text-[var(--cos-text-2)] mb-6 text-center max-w-sm">
                Export your holdings from the Snowball Analytics tab and upload here to auto-fill the snapshot.
              </p>
              <label className="cursor-pointer bg-[var(--cos-accent)] hover:opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity">
                Select CSV File
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
              <button 
                onClick={() => setStep(1)} 
                className="mt-6 text-xs text-[var(--cos-text-3)] hover:text-white transition-colors underline underline-offset-4"
              >
                Back to Manual Entry
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Portfolio KPIs</h4>
                  <p className="text-xs text-[var(--cos-text-2)]">Read from Snowball Dashboard tab</p>
                </div>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--cos-accent)] hover:opacity-80 transition-opacity bg-[var(--cos-accent-muted)] px-3 py-1.5 rounded-lg"
                >
                  CSV Import
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Snapshot Date</label>
                  <input
                    type="date"
                    value={formData.snapshotDate}
                    onChange={(e) => handleInputChange("snapshotDate", e.target.value)}
                    className="w-full rounded-lg border bg-[var(--cos-surface-2)] p-2.5 text-sm text-[var(--cos-positive)] focus:border-[var(--cos-positive)] focus:outline-none"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                  <p className="text-[9px] text-[var(--cos-positive)] font-mono">Auto-set to today</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">USD/THB Rate</label>
                  <input
                    type="number"
                    value={formData.fxRateUsdThb}
                    readOnly
                    className="w-full rounded-lg border bg-[rgba(58,130,247,0.05)] p-2.5 text-sm text-[var(--cos-accent)] focus:outline-none"
                    style={{ borderColor: "rgba(58,130,247,0.2)" }}
                  />
                  <p className="text-[9px] text-[var(--cos-accent)] font-mono">
                    {isFetchingFx ? "Fetching rate..." : "Auto-fetched via FX API"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Total Value (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 610524"
                    value={formData.totalValueUsd}
                    onChange={(e) => handleInputChange("totalValueUsd", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Total Value (THB)</label>
                  <input
                    type="text"
                    value={totalValueThb > 0 ? fmtCurrency(totalValueThb) : ""}
                    readOnly
                    placeholder="Auto-computed"
                    className="w-full rounded-lg border bg-[rgba(58,130,247,0.05)] p-2.5 text-sm text-[var(--cos-accent)] focus:outline-none"
                    style={{ borderColor: "rgba(58,130,247,0.2)" }}
                  />
                  <p className="text-[9px] text-[var(--cos-accent)] font-mono">Auto-computed</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Total Profit (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 68518"
                    value={formData.totalProfitUsd}
                    onChange={(e) => handleInputChange("totalProfitUsd", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Total Profit (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12.3"
                    value={formData.totalProfitPct}
                    onChange={(e) => handleInputChange("totalProfitPct", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">IRR (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 16.17"
                    value={formData.irrPct}
                    onChange={(e) => handleInputChange("irrPct", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Cash Balance (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 293900"
                    value={formData.cashBalanceUsd}
                    onChange={(e) => handleInputChange("cashBalanceUsd", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Passive Income (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1622"
                    value={formData.passiveIncomeUsd}
                    onChange={(e) => handleInputChange("passiveIncomeUsd", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Passive Yield (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 0.51"
                    value={formData.passiveYieldPct}
                    onChange={(e) => handleInputChange("passiveYieldPct", e.target.value)}
                    className="w-full rounded-lg border bg-black/20 p-2.5 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                    style={{ borderColor: "var(--cos-border-subtle)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h4 className="text-sm font-semibold text-white">Sub-portfolio Breakdown</h4>
                <p className="text-xs text-[var(--cos-text-2)]">Read from Snowball Dashboard → Portfolio table</p>
              </div>

              {/* Strategic */}
              <div className="rounded-lg p-4 border" style={{ borderColor: "var(--cos-border-subtle)", background: "var(--cos-surface-2)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-4 bg-[var(--cos-accent)]" />
                  <span className="text-xs uppercase tracking-widest font-mono text-[var(--cos-accent)] font-semibold">The Strategic</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Value (USD)</label>
                    <input
                      type="number"
                      placeholder="e.g. 387731"
                      value={formData.strategicValueUsd}
                      onChange={(e) => handleInputChange("strategicValueUsd", e.target.value)}
                      className="w-full rounded-lg border bg-black/20 p-2 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                      style={{ borderColor: "var(--cos-border-subtle)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Allocation (%)</label>
                    <input
                      type="text"
                      value={strategicAllocPct > 0 ? strategicAllocPct.toFixed(1) : ""}
                      readOnly
                      placeholder="Auto"
                      className="w-full rounded-lg border bg-[rgba(58,130,247,0.05)] p-2 text-sm text-[var(--cos-accent)] focus:outline-none"
                      style={{ borderColor: "rgba(58,130,247,0.2)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Profit (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10.97"
                      value={formData.strategicProfitPct}
                      onChange={(e) => handleInputChange("strategicProfitPct", e.target.value)}
                      className="w-full rounded-lg border bg-black/20 p-2 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                      style={{ borderColor: "var(--cos-border-subtle)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Tactical */}
              <div className="rounded-lg p-4 border" style={{ borderColor: "var(--cos-border-subtle)", background: "var(--cos-surface-2)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-4 bg-[var(--cos-warning)]" />
                  <span className="text-xs uppercase tracking-widest font-mono text-[var(--cos-warning)] font-semibold">The Tactical</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Value (USD)</label>
                    <input
                      type="number"
                      placeholder="e.g. 216229"
                      value={formData.tacticalValueUsd}
                      onChange={(e) => handleInputChange("tacticalValueUsd", e.target.value)}
                      className="w-full rounded-lg border bg-black/20 p-2 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                      style={{ borderColor: "var(--cos-border-subtle)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Allocation (%)</label>
                    <input
                      type="text"
                      value={tacticalAllocPct > 0 ? tacticalAllocPct.toFixed(1) : ""}
                      readOnly
                      placeholder="Auto"
                      className="w-full rounded-lg border bg-[rgba(58,130,247,0.05)] p-2 text-sm text-[var(--cos-accent)] focus:outline-none"
                      style={{ borderColor: "rgba(58,130,247,0.2)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--cos-text-3)] font-mono">Profit (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 34.07"
                      value={formData.tacticalProfitPct}
                      onChange={(e) => handleInputChange("tacticalProfitPct", e.target.value)}
                      className="w-full rounded-lg border bg-black/20 p-2 text-sm focus:border-[var(--cos-accent)] focus:outline-none text-white"
                      style={{ borderColor: "var(--cos-border-subtle)" }}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h4 className="text-sm font-semibold text-white">Divergence Preview & Confirm</h4>
                <p className="text-xs text-[var(--cos-text-2)]">Auto-computed vs last snapshot</p>
              </div>

              <div className="rounded-xl bg-black/30 p-5 border" style={{ borderColor: "var(--cos-border-subtle)" }}>
                <ul className="space-y-4">
                  <li className="flex justify-between text-sm">
                    <span className="text-[var(--cos-text-2)]">Δ Net Worth:</span>
                    <span className={`font-mono font-medium ${deltaNetWorth >= 0 ? "text-[var(--cos-positive)]" : "text-[var(--cos-negative)]"}`}>
                      {deltaNetWorth >= 0 ? "+" : ""}{fmtCurrency(deltaNetWorth)} ({deltaNetWorthPct > 0 ? "+" : ""}{deltaNetWorthPct.toFixed(1)}%)
                    </span>
                  </li>
                  <li className="flex justify-between text-sm border-t pt-4" style={{ borderColor: "var(--cos-border-subtle)" }}>
                    <span className="text-[var(--cos-text-2)]">Δ IRR:</span>
                    <span className={`font-mono font-medium ${deltaIrr >= 0 ? "text-[var(--cos-warning)]" : "text-[var(--cos-negative)]"}`}>
                      {deltaIrr >= 0 ? "+" : ""}{deltaIrr.toFixed(2)}% <span className="text-xs text-[var(--cos-text-3)]">({formData.irrPct || 0}% vs {lastSnapshot.irrPct}%)</span>
                    </span>
                  </li>
                  <li className="flex justify-between text-sm border-t pt-4" style={{ borderColor: "var(--cos-border-subtle)" }}>
                    <span className="text-[var(--cos-text-2)]">Δ Passive Income:</span>
                    <span className={`font-mono font-medium ${deltaPassive >= 0 ? "text-[var(--cos-positive)]" : "text-[var(--cos-negative)]"}`}>
                      {deltaPassive >= 0 ? "+" : ""} ${Math.abs(deltaPassive).toFixed(2)}
                    </span>
                  </li>
                </ul>

                {deltaPassive < 0 && (
                  <div className="mt-6 flex items-start gap-2 bg-[rgba(255,68,102,0.1)] border border-[rgba(255,68,102,0.2)] p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-[var(--cos-negative)] shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--cos-negative)]">Dividend cut detected! Your passive income dropped by ${Math.abs(deltaPassive).toFixed(2)}.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 4 && (
          <div className="flex items-center justify-between border-t p-5 bg-[var(--cos-surface-2)]" style={{ borderColor: "var(--cos-border-subtle)" }}>
            <button
              type="button"
              onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3 | 4) : onClose()}
              className="flex items-center gap-1 text-sm font-medium text-[var(--cos-text-2)] hover:text-white transition-colors"
            >
              {step > 1 ? <><ChevronLeft className="h-4 w-4" /> Back</> : "Cancel"}
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                className="flex items-center gap-1 rounded-lg bg-[var(--cos-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-[var(--cos-positive)] px-5 py-2.5 text-sm font-semibold text-[#060c14] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Confirm & Save"} <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
