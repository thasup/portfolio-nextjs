"use client";

/**
 * CapitalOS v5 — YNAB → SA Mapping Page
 *
 * Asset-level many-to-one: multiple SA assets → one YNAB account.
 *
 * Left:  SA Assets (from latest snapshot), grouped by category.
 *        Each asset has a "Held in" dropdown → pick the YNAB account.
 * Right: YNAB Accounts → Role toggle (SA⚡ / ONLY) + assigned SA assets.
 *        Liabilities + Mapping Summary at the bottom.
 *
 * On save: builds saAssetMappings JSON per YNAB account and POSTs to
 * /api/capital-os/mapping.
 */

import { useState, useEffect, useMemo } from "react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import type { CapitalAccount, CapitalLiability } from "@/lib/capital-os/types";
import { CapitalMappingRole } from "@/lib/capital-os/types";
import { ALL_SA_CATEGORIES } from "@/lib/capital-os/categories";
import { fmtSatangs } from "@/lib/capital-os/format";
import { Save } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────

interface SAAssetRef {
  saTicker: string;
}

interface MappingEntry {
  id?: string;
  ynabAccId: string;
  role: CapitalMappingRole;
  saAssetMappings: SAAssetRef[];
  note?: string | null;
}

interface SnapshotAsset {
  ticker: string;
  name: string;
  categoryId: string;
  currentValue?: number | null;
  currency: string;
}

// ── Sub-component: role toggle badge ────────────────────────────

function RoleBadge({ role, onToggle }: { role: CapitalMappingRole; onToggle: () => void }) {
  const isSA = role === CapitalMappingRole.SA_COVERED;
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold transition-colors shrink-0"
      style={{
        background: isSA ? "var(--intent-success-muted)" : "var(--intent-warning-muted)",
        color: isSA ? "var(--intent-success)" : "var(--intent-warning)",
      }}
    >
      {isSA ? "SA ⚡" : "ONLY"}
    </button>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function MappingPage() {
  const [accounts, setAccounts] = useState<CapitalAccount[]>([]);
  const [liabilities, setLiabilities] = useState<CapitalLiability[]>([]);
  const [snapshotAssets, setSnapshotAssets] = useState<SnapshotAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Asset-level state (many-to-many): ticker → array of ynab externalIds
  const [assetToAccounts, setAssetToAccounts] = useState<Record<string, string[]>>({});
  // Account-level state: externalId → role
  const [accountRoles, setAccountRoles] = useState<Record<string, CapitalMappingRole>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/capital-os/accounts").then(r => r.json()),
      fetch("/api/capital-os/mapping").then(r => r.json()),
      fetch("/api/capital-os/liabilities").then(r => r.json()),
      fetch("/api/capital-os/snapshots?limit=90").then(r => r.json()),
    ]).then(([accRes, mapRes, liabRes, snapRes]) => {
      setAccounts(accRes.accounts || []);
      setLiabilities(liabRes.liabilities || []);

      const entries: MappingEntry[] = mapRes || [];
      const roles: Record<string, CapitalMappingRole> = {};
      const a2accs: Record<string, string[]> = {};
      for (const entry of entries) {
        roles[entry.ynabAccId] = entry.role;
        for (const { saTicker } of entry.saAssetMappings ?? []) {
          a2accs[saTicker] = [...(a2accs[saTicker] ?? []), entry.ynabAccId];
        }
      }
      setAccountRoles(roles);
      setAssetToAccounts(a2accs);

      const snaps: any[] = snapRes.snapshots || [];
      const saSnap = [...snaps].reverse().find((s: any) => s.saTotal != null);
      if (saSnap && Array.isArray(saSnap.saAssets)) {
        setSnapshotAssets(saSnap.saAssets);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────

  const getRole = (ynabAccId: string): CapitalMappingRole =>
    accountRoles[ynabAccId] ?? CapitalMappingRole.YNAB_ONLY;

  const toggleRole = (ynabAccId: string) => {
    const current = getRole(ynabAccId);
    setAccountRoles(prev => ({
      ...prev,
      [ynabAccId]: current === CapitalMappingRole.SA_COVERED
        ? CapitalMappingRole.YNAB_ONLY
        : CapitalMappingRole.SA_COVERED,
    }));
    setDirty(true);
  };

  const addAssetToAccount = (ticker: string, ynabAccId: string) => {
    if (!ynabAccId) return;
    setAssetToAccounts(prev => {
      const cur = prev[ticker] ?? [];
      if (cur.includes(ynabAccId)) return prev;
      return { ...prev, [ticker]: [...cur, ynabAccId] };
    });
    if (getRole(ynabAccId) !== CapitalMappingRole.SA_COVERED) {
      setAccountRoles(prev => ({ ...prev, [ynabAccId]: CapitalMappingRole.SA_COVERED }));
    }
    setDirty(true);
  };

  const removeAssetFromAccount = (ticker: string, ynabAccId: string) => {
    setAssetToAccounts(prev => ({
      ...prev,
      [ticker]: (prev[ticker] ?? []).filter(id => id !== ynabAccId),
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    // Build saAssetMappings per YNAB account from assetToAccounts (many-to-many)
    const byAccount: Record<string, SAAssetRef[]> = {};
    for (const [ticker, ynabAccIds] of Object.entries(assetToAccounts)) {
      for (const ynabAccId of ynabAccIds) {
        byAccount[ynabAccId] = [...(byAccount[ynabAccId] ?? []), { saTicker: ticker }];
      }
    }
    const mappings = accounts.map(acc => ({
      ynabAccId: acc.externalId!,
      role: getRole(acc.externalId!),
      saAssetMappings: byAccount[acc.externalId!] ?? [],
    }));
    await fetch("/api/capital-os/mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mappings }),
    });
    setSaving(false);
    setDirty(false);
  };

  // ── Derived ───────────────────────────────────────────────────────

  const saTotal = useMemo(
    () => snapshotAssets.reduce((s, a) => s + (a.currentValue ?? 0), 0),
    [snapshotAssets]
  );

  const ynabOnlyTotal = useMemo(
    () => accounts
      .filter(a => getRole(a.externalId!) === CapitalMappingRole.YNAB_ONLY)
      .reduce((s, a) => s + Number(a.balance), 0),
    [accounts, accountRoles]
  );

  const liabTotal = useMemo(
    () => liabilities.reduce((s, l) => s + Math.abs(Number(l.balance)), 0),
    [liabilities]
  );

  const canonicalNw = saTotal + ynabOnlyTotal - liabTotal;
  const saCoveredCount = accounts.filter(a => getRole(a.externalId!) === CapitalMappingRole.SA_COVERED).length;

  // Assets assigned to each account (for display in right panel)
  const accountAssets = useMemo(() => {
    const map: Record<string, SnapshotAsset[]> = {};
    for (const asset of snapshotAssets) {
      for (const ynabAccId of assetToAccounts[asset.ticker] ?? []) {
        map[ynabAccId] = [...(map[ynabAccId] ?? []), asset];
      }
    }
    return map;
  }, [snapshotAssets, assetToAccounts]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <CapitalOSHeader title="YNAB → SA Mapping" />
        <div className="p-6 space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-xl" style={{ background: "var(--cos-surface)" }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader title="YNAB → SA Mapping" />

      <div className="flex-1 overflow-hidden flex flex-col">

        {/* Explanatory header */}
        <div className="px-6 py-3 border-b text-sm" style={{ borderColor: "var(--cos-border-subtle)", background: "var(--cos-surface)" }}>
          Each SA asset is assigned to one YNAB account that holds it.
          Multiple SA assets can map to the same YNAB account (many-to-one).{" "}
          <strong>Net Worth = SA Total + YNAB-only − Liabilities.</strong>
        </div>

        {/* Two-column body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[55%_45%]">

          {/* ── Left: SA Assets → Held in YNAB Account ─────────── */}
          <div className="overflow-y-auto p-4 space-y-5 border-r" style={{ borderColor: "var(--cos-border-subtle)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--cos-text-3)" }}>
              SA Assets → Held in YNAB Account
            </h2>

            {ALL_SA_CATEGORIES.map((cat, catIdx) => {
              const catAssets = snapshotAssets.filter(a => a.categoryId === cat.id);
              if (catAssets.length === 0) return null;

              const isFirstTactical = catIdx > 0 && cat.portfolioType !== ALL_SA_CATEGORIES[catIdx - 1].portfolioType;
              return (
                <div key={cat.id}>
                  {(catIdx === 0 || isFirstTactical) && (
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--cos-text-2)" }}>
                      {cat.portfolioType === "STRATEGIC" ? "🎯 The Strategic" : "⚡ The Tactical"}
                    </p>
                  )}
                  <div className="rounded-lg border overflow-hidden" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
                    <div className="px-3 py-2 border-b text-xs font-semibold" style={{ background: "var(--cos-surface-2)", borderColor: "var(--cos-border-subtle)", color: "var(--cos-text-2)" }}>
                      {cat.name}
                    </div>
                    {catAssets.map(asset => {
                      const assignedIds = assetToAccounts[asset.ticker] ?? [];
                      const assignedAccounts = assignedIds.map(id => accounts.find(a => a.externalId === id)).filter(Boolean) as typeof accounts;
                      const unassigned = accounts.filter(a => !assignedIds.includes(a.externalId!));
                      return (
                        <div
                          key={asset.ticker}
                          className="flex items-start gap-3 px-3 py-2.5 border-t"
                          style={{ borderColor: "var(--cos-border-subtle)" }}
                        >
                          {/* Ticker + name */}
                          <div className="w-[80px] shrink-0 pt-0.5">
                            <p className="font-mono text-xs font-semibold" style={{ color: "var(--intent-success)" }}>{asset.ticker}</p>
                            <p className="font-mono text-[10px]" style={{ color: "var(--cos-text-3)" }}>
                              {asset.currentValue ? fmtSatangs(asset.currentValue) : "—"}
                            </p>
                          </div>
                          {/* Name */}
                          <p className="text-xs flex-1 truncate pt-0.5" style={{ color: "var(--cos-text-2)" }}>{asset.name}</p>
                          {/* Account chips + add selector */}
                          <div className="flex flex-wrap items-center gap-1 justify-end max-w-[220px]">
                            {assignedAccounts.map(acc => (
                              <span
                                key={acc.id}
                                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium"
                                style={{ background: "var(--intent-success-muted)", color: "var(--intent-success)" }}
                              >
                                {acc.icon ?? ""} {acc.name}
                                <button
                                  onClick={() => removeAssetFromAccount(asset.ticker, acc.externalId!)}
                                  className="ml-0.5 leading-none hover:opacity-70"
                                  style={{ color: "var(--intent-success)" }}
                                >×</button>
                              </span>
                            ))}
                            {unassigned.length > 0 && (
                              <select
                                value=""
                                onChange={e => addAssetToAccount(asset.ticker, e.target.value)}
                                className="rounded border text-[11px] px-1.5 py-0.5"
                                style={{
                                  background: "var(--cos-surface-2)",
                                  borderColor: "var(--cos-border-subtle)",
                                  color: "var(--cos-text-3)",
                                  maxWidth: "140px",
                                }}
                              >
                                <option value="">+ add account</option>
                                {unassigned.map(acc => (
                                  <option key={acc.id} value={acc.externalId!}>
                                    {acc.icon ?? ""} {acc.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: YNAB Accounts → Role + Assigned Assets ───── */}
          <div className="overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--cos-text-3)" }}>
                YNAB Accounts → Role
              </h2>
              {dirty && (
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--intent-success)" }}
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Saving…" : "Save"}
                </button>
              )}
            </div>

            {/* Account list */}
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              {accounts.map(acc => {
                const role = getRole(acc.externalId!);
                const isSA = role === CapitalMappingRole.SA_COVERED;
                const assigned = accountAssets[acc.externalId!] ?? [];
                return (
                  <div key={acc.id} className="flex items-start gap-3 px-3 py-2.5 border-t first:border-t-0" style={{ borderColor: "var(--cos-border-subtle)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{acc.icon ?? "💰"}</span>
                        <span className="font-medium text-sm truncate">{acc.name}</span>
                      </div>
                      {assigned.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assigned.map(a => (
                            <span key={a.ticker} className="font-mono text-[10px] rounded px-1 py-0.5" style={{ background: "var(--cos-surface-2)", color: "var(--intent-success)" }}>
                              {a.ticker}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--cos-text-3)" }}>
                          {isSA ? "no assets assigned yet" : "YNAB-only · not in SA"}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs">{fmtSatangs(Number(acc.balance))}</p>
                      <RoleBadge role={role} onToggle={() => toggleRole(acc.externalId!)} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Liabilities */}
            {liabilities.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--cos-text-3)" }}>
                  Liabilities
                </p>
                <div className="rounded-xl border overflow-hidden" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
                  {liabilities.map(l => (
                    <div key={l.id} className="flex items-center justify-between px-3 py-2 border-t first:border-t-0" style={{ borderColor: "var(--cos-border-subtle)" }}>
                      <div className="flex items-center gap-2">
                        <span>{l.icon ?? "💳"}</span>
                        <div>
                          <p className="text-sm font-medium">{l.name}</p>
                          {l.apr != null && <p className="text-[11px]" style={{ color: "var(--cos-text-3)" }}>{l.apr}% APR</p>}
                        </div>
                      </div>
                      <p className="font-mono text-sm" style={{ color: "var(--intent-danger)" }}>
                        {fmtSatangs(Math.abs(Number(l.balance)))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mapping Summary */}
            <div className="rounded-xl border p-3 space-y-1.5 text-xs" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--cos-text-3)" }}>Summary</p>
              {[
                ["SA-covered accounts", String(saCoveredCount)],
                ["SA total (live)", saTotal > 0 ? fmtSatangs(saTotal) : "—"],
                ["YNAB-only accounts", String(accounts.length - saCoveredCount)],
                ["YNAB-only total", fmtSatangs(ynabOnlyTotal)],
                ["Liabilities", fmtSatangs(liabTotal)],
                ["Canonical NW", canonicalNw > 0 ? fmtSatangs(canonicalNw) : "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: "var(--cos-text-2)" }}>{label}</span>
                  <span className="font-mono font-semibold">{value}</span>
                </div>
              ))}
            </div>

            {/* Save (always at bottom) */}
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
              style={{ background: "var(--intent-success)" }}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : dirty ? "Save Mapping" : "No Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
