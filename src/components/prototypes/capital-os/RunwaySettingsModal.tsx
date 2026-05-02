"use client";

import { useState, useEffect } from "react";
import { X, Save, Wallet, Settings2, Info } from "lucide-react";
import { CapitalAccount } from "@/lib/capital-os/types";
import { fmtCurrency } from "@/lib/capital-os/format";

interface RunwaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBurnRate: number;
  currentAccountIds: string[];
  accounts: CapitalAccount[];
  onSave: (burnRate: number, accountIds: string[]) => Promise<void>;
}

export function RunwaySettingsModal({
  isOpen,
  onClose,
  currentBurnRate,
  currentAccountIds,
  accounts,
  onSave,
}: RunwaySettingsModalProps) {
  const [burnRate, setBurnRate] = useState(currentBurnRate / 100);
  const [selectedAccountIds, setSelectedAccountIds] =
    useState<string[]>(currentAccountIds);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBurnRate(currentBurnRate / 100);
      setSelectedAccountIds(currentAccountIds);
    }
  }, [isOpen, currentBurnRate, currentAccountIds]);

  if (!isOpen) return null;

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(burnRate * 100, selectedAccountIds);
      onClose();
    } catch (error) {
      console.error("Failed to save runway settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const liquidAccounts = accounts.filter((a) => !a.archivedAt);
  const poolTotal = liquidAccounts
    .filter((a) => selectedAccountIds.includes(a.id))
    .reduce((s, a) => s + a.balance, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{
          background: "var(--cos-surface)",
          borderColor: "var(--cos-border-subtle)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-[var(--cos-accent)]" />
            <h2 className="text-lg font-bold">Customize Runway</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Burn Rate Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--cos-text-2)] flex items-center gap-2">
              Monthly Burn Rate (THB)
              <Info className="h-3.5 w-3.5 opacity-50" />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cos-text-3)] font-medium">
                ฿
              </span>
              <input
                id="runway-burn-rate-input"
                type="number"
                value={burnRate}
                onChange={(e) => setBurnRate(Number(e.target.value))}
                className="w-full rounded-xl border bg-black/20 py-3 pl-8 pr-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--cos-accent)]"
                style={{ borderColor: "var(--cos-border-subtle)" }}
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-[var(--cos-text-3)]">
              This fixed rate will be used to calculate how many months your
              pool will last.
            </p>
          </div>

          {/* Account Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--cos-text-2)]">
                Runway Pool Accounts
              </label>
              <span className="text-xs font-medium text-[var(--cos-accent)]">
                Total: {fmtCurrency(poolTotal / 100)}
              </span>
            </div>
            <div className="space-y-2">
              {liquidAccounts.map((account) => (
                <div
                  key={account.id}
                  id={`runway-account-${account.id}`}
                  onClick={() => toggleAccount(account.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                    selectedAccountIds.includes(account.id)
                      ? "border-[var(--cos-accent)] bg-[var(--cos-accent-muted)]"
                      : "border-[var(--cos-border-subtle)] bg-black/10 hover:bg-black/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        selectedAccountIds.includes(account.id)
                          ? "bg-[var(--cos-accent)] text-white"
                          : "bg-white/10 text-[var(--cos-text-3)]"
                      }`}
                    >
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{account.name}</p>
                      <p className="text-xs opacity-60">
                        {account.type} • {account.source}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {fmtCurrency(account.balance / 100)}
                    </p>
                    <div
                      className={`mt-1 h-4 w-4 rounded border flex items-center justify-center ${
                        selectedAccountIds.includes(account.id)
                          ? "bg-[var(--cos-accent)] border-[var(--cos-accent)]"
                          : "border-white/20"
                      }`}
                    >
                      {selectedAccountIds.includes(account.id) && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {liquidAccounts.length === 0 && (
                <p className="text-center py-4 text-xs text-[var(--cos-text-3)]">
                  No accounts found. Sync with YNAB to load your accounts.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t p-6"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            id="save-runway-settings"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[var(--cos-accent)] px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
