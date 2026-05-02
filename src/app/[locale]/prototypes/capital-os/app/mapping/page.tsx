"use client";

/**
 * CapitalOS v4 — Mapping Configuration Page
 * Allows users to configure which YNAB accounts map to SA categories.
 */

import { useState, useEffect } from "react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import type { CapitalAccount, CapitalSACategory, CapitalMappingConfig } from "@/lib/capital-os/types";
import { CapitalMappingRole } from "@/lib/capital-os/types";
import { Save, Info, ArrowRightLeft } from "lucide-react";

interface YNABAccountWithMapping extends CapitalAccount {
  mappingRole?: CapitalMappingRole;
  saCategoryName?: string | null;
}

export default function MappingPage() {
  const [accounts, setAccounts] = useState<YNABAccountWithMapping[]>([]);
  const [saCategories, setSACategories] = useState<CapitalSACategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/capital-os/accounts").then(r => r.json()),
      fetch("/api/capital-os/sa-categories").then(r => r.json()),
      fetch("/api/capital-os/mapping").then(r => r.json()),
    ]).then(([accountsRes, saRes, mappingRes]) => {
      const categories = [...(saRes.strategic || []), ...(saRes.tactical || [])];
      setSACategories(categories);
      
      const config: CapitalMappingConfig[] = mappingRes || [];
      const accountsList: CapitalAccount[] = accountsRes.accounts || [];
      const enriched = accountsList.map((acc: CapitalAccount) => {
        const m = config.find((c: CapitalMappingConfig) => c.ynabAccId === acc.externalId);
        return { ...acc, mappingRole: m?.role || CapitalMappingRole.YNAB_ONLY, saCategoryName: m?.saCategory || null };
      });
      setAccounts(enriched);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateRole = (externalId: string, role: CapitalMappingRole) => {
    setAccounts(prev => prev.map(acc => acc.externalId === externalId ? { ...acc, mappingRole: role } : acc));
  };

  const updateCategory = (externalId: string, categoryId: string) => {
    setAccounts(prev => prev.map(acc => acc.externalId === externalId ? { ...acc, saCategoryName: categoryId } : acc));
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/capital-os/mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mappings: accounts.map(acc => ({
          ynabAccId: acc.externalId,
          role: acc.mappingRole || CapitalMappingRole.YNAB_ONLY,
          saCategory: acc.saCategoryName || undefined,
        })),
      }),
    });
    setSaving(false);
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(n / 100);

  const saCovered = accounts.filter(a => a.mappingRole === CapitalMappingRole.SA_COVERED);
  const ynabOnly = accounts.filter(a => a.mappingRole === CapitalMappingRole.YNAB_ONLY);

  if (loading) return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader title="Account Mapping" subtitle="Configure YNAB to SA mapping" />
      <div className="p-6"><div className="h-24 animate-pulse rounded-xl bg-[var(--cos-surface)]" /></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader title="Account Mapping" subtitle="Configure YNAB to SA mapping" />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-mono text-[var(--intent-accent)]">{saCovered.length}</span> accounts mapped to SA
            </div>
            <ArrowRightLeft className="h-4 w-4 text-[var(--cos-text-3)]" />
            <div className="text-sm">
              <span className="font-mono text-[var(--intent-warning)]">{ynabOnly.length}</span> YNAB-only accounts
            </div>
          </div>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[var(--intent-success)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Mapping"}
          </button>
        </div>

        {/* YNAB Accounts Table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
          <div className="grid grid-cols-[1fr,140px,200px,140px] gap-4 p-3 text-xs font-semibold uppercase tracking-wider" style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-3)" }}>
            <span>YNAB Account</span>
            <span className="text-right">Balance</span>
            <span className="text-center">Role</span>
            <span className="text-center">SA Category</span>
          </div>

          {accounts.map(acc => (
            <div key={acc.id} className="grid grid-cols-[1fr,140px,200px,140px] gap-4 items-center p-3 border-t" style={{ borderColor: "var(--cos-border-subtle)" }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{acc.icon || "💰"}</span>
                <div>
                  <div className="font-medium text-sm">{acc.name}</div>
                  <div className="text-xs" style={{ color: "var(--cos-text-3)" }}>{acc.source}</div>
                </div>
              </div>
              <div className="text-right font-mono text-sm">{fmt(Number(acc.balance))}</div>
              <div className="flex justify-center">
                <select 
                  value={acc.mappingRole || CapitalMappingRole.YNAB_ONLY}
                  onChange={e => updateRole(acc.externalId!, e.target.value as CapitalMappingRole)}
                  className="rounded border px-3 py-1.5 text-sm w-full max-w-[180px]"
                  style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border-subtle)" }}
                >
                  <option value={CapitalMappingRole.SA_COVERED}>SA Covered</option>
                  <option value={CapitalMappingRole.YNAB_ONLY}>YNAB Only</option>
                </select>
              </div>
              <div className="flex justify-center">
                <select
                  value={acc.saCategoryName || ""}
                  onChange={e => updateCategory(acc.externalId!, e.target.value)}
                  disabled={acc.mappingRole !== CapitalMappingRole.SA_COVERED}
                  className="rounded border px-3 py-1.5 text-sm w-full max-w-[180px] disabled:opacity-40"
                  style={{ background: "var(--cos-bg)", borderColor: "var(--cos-border-subtle)" }}
                >
                  <option value="">— Select —</option>
                  {saCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Help */}
        <div className="mt-6 flex items-start gap-3 rounded-lg border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
          <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--cos-accent)" }} />
          <div className="text-sm" style={{ color: "var(--cos-text-2)" }}>
            <strong>SA Covered</strong> = SA has the authoritative live value; YNAB is just a reference.
            <strong> YNAB Only</strong> = This account is not tracked in SA (e.g., physical assets/PPE).
          </div>
        </div>
      </div>
    </div>
  );
}
