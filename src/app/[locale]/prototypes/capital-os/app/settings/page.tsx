"use client";

import { useState } from "react";
import {
  Settings,
  Database,
  RefreshCw,
  Key,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { useYNABSync, useAirtableSync } from "@/lib/capital-os/hooks";

export default function SettingsPage() {
  const {
    syncing: ynabSyncing,
    error: ynabError,
    result: ynabResult,
    triggerSync: triggerYnabSync,
  } = useYNABSync();
  const {
    syncing: airtableSyncing,
    error: airtableError,
    result: airtableResult,
    triggerSync: triggerAirtableSync,
  } = useAirtableSync();
  const [activeTab, setActiveTab] = useState<"connections" | "preferences">(
    "connections",
  );

  return (
    <div className="flex flex-col h-full">
      <CapitalOSHeader
        title="Settings"
        subtitle="Manage integrations, data sync, and platform preferences"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Navigation Tabs */}
        <div
          className="flex gap-4 border-b"
          style={{ borderColor: "var(--cos-border-subtle)" }}
        >
          <button
            onClick={() => setActiveTab("connections")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "connections" ? "border-[var(--cos-accent)] text-[var(--cos-text)]" : "border-transparent text-[var(--cos-text-2)] hover:text-[var(--cos-text)]"}`}
          >
            Data Connections
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "preferences" ? "border-[var(--cos-accent)] text-[var(--cos-text)]" : "border-transparent text-[var(--cos-text-2)] hover:text-[var(--cos-text)]"}`}
          >
            Preferences
          </button>
        </div>

        {activeTab === "connections" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Data Integrations</h2>
            <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
              Connect CapitalOS to your external data sources for automated
              syncing.
            </p>

            {/* YNAB Connection Card */}
            <div
              className="rounded-xl border p-6"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      YNAB (You Need A Budget)
                    </h3>
                    <p
                      className="text-sm mt-1 mb-4"
                      style={{ color: "var(--cos-text-2)" }}
                    >
                      Primary source for liquid accounts and credit cards.
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                      <ShieldCheck
                        className="h-4 w-4"
                        style={{ color: "var(--cos-positive)" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--cos-positive)" }}
                      >
                        Connected via Environment Variables
                      </span>
                    </div>

                    <button
                      onClick={triggerYnabSync}
                      disabled={ynabSyncing}
                      className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:translate-y-[-1px] disabled:opacity-50"
                      style={{
                        borderColor: "var(--cos-border)",
                        background: "var(--cos-surface-2)",
                        color: "var(--cos-text)",
                      }}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${ynabSyncing ? "animate-spin" : ""}`}
                      />
                      {ynabSyncing ? "Syncing..." : "Sync Now"}
                    </button>

                    {ynabResult && !ynabError && (
                      <p
                        className="mt-3 text-xs flex items-center gap-1"
                        style={{ color: "var(--cos-positive)" }}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Successfully synced{" "}
                        {ynabResult.synced + ynabResult.syncedLiabilities}{" "}
                        items.
                      </p>
                    )}
                    {ynabError && (
                      <p
                        className="mt-3 text-xs flex items-center gap-1"
                        style={{ color: "var(--cos-negative)" }}
                      >
                        <AlertCircle className="h-3 w-3" /> {ynabError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Airtable Connection Card */}
            <div
              className="rounded-xl border p-6"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Airtable</h3>
                    <p
                      className="text-sm mt-1 mb-4"
                      style={{ color: "var(--cos-text-2)" }}
                    >
                      Secondary source for custom assets, goals, and fixed
                      investments.
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                      <ShieldCheck
                        className="h-4 w-4"
                        style={{ color: "var(--cos-positive)" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--cos-positive)" }}
                      >
                        Connected via Environment Variables
                      </span>
                    </div>

                    <button
                      onClick={triggerAirtableSync}
                      disabled={airtableSyncing}
                      className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:translate-y-[-1px] disabled:opacity-50"
                      style={{
                        borderColor: "var(--cos-border)",
                        background: "var(--cos-surface-2)",
                        color: "var(--cos-text)",
                      }}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${airtableSyncing ? "animate-spin" : ""}`}
                      />
                      {airtableSyncing ? "Syncing..." : "Sync Now"}
                    </button>

                    {airtableResult && !airtableError && (
                      <p
                        className="mt-3 text-xs flex items-center gap-1"
                        style={{ color: "var(--cos-positive)" }}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Successfully synced{" "}
                        {airtableResult.total} items.
                      </p>
                    )}
                    {airtableError && (
                      <p
                        className="mt-3 text-xs flex items-center gap-1"
                        style={{ color: "var(--cos-negative)" }}
                      >
                        <AlertCircle className="h-3 w-3" /> {airtableError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">General Preferences</h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--cos-text-2)" }}
              >
                Customize your CapitalOS experience.
              </p>
            </div>

            <div
              className="rounded-xl border p-6"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--cos-text-3)" }}>
                No preferences available to configure yet. Future updates will
                include display currency options, default scenario parameters,
                and custom AI prompt configurations.
              </p>
            </div>

            <div className="pt-6">
              <h2 className="text-lg font-bold">Data Management</h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--cos-text-2)" }}
              >
                Export or backup your CapitalOS data.
              </p>
            </div>

            <div
              className="rounded-xl border p-6"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-base">
                    Export Financial Data
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--cos-text-2)" }}
                  >
                    Download a comprehensive JSON snapshot of your accounts,
                    liabilities, and goals.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const [acc, liab, goals] = await Promise.all([
                        fetch("/api/capital-os/accounts").then((res) =>
                          res.json(),
                        ),
                        fetch("/api/capital-os/liabilities").then((res) =>
                          res.json(),
                        ),
                        fetch("/api/capital-os/goals").then((res) =>
                          res.json(),
                        ),
                      ]);
                      const data = {
                        exportDate: new Date().toISOString(),
                        accounts: acc.accounts,
                        liabilities: liab.liabilities,
                        goals: goals.goals,
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `capitalos_export_${new Date().toISOString().split("T")[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } catch (e) {
                      alert(
                        "Export failed: " +
                          (e instanceof Error ? e.message : String(e)),
                      );
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:translate-y-[-1px]"
                  style={{
                    borderColor: "var(--cos-border)",
                    background: "var(--cos-surface-2)",
                    color: "var(--cos-text)",
                  }}
                >
                  <Database className="h-4 w-4" />
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
