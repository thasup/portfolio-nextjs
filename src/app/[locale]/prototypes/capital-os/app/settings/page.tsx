"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Settings,
  Database,
  RefreshCw,
  Key,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  CalendarDays,
  Save,
} from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { useYNABSync, useCapitalData } from "@/lib/capital-os/hooks";
import { AirtableConfigForm } from "@/components/prototypes/capital-os/AirtableConfigForm";
import { AirtableSyncButton } from "@/components/prototypes/capital-os/AirtableSyncButton";
import { useAirtableConfig } from "@/lib/capital-os/hooks/useAirtableConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DateFormatString } from "@/lib/capital-os/formatters";

const DATE_FORMAT_OPTIONS: { value: DateFormatString; label: string; example: string }[] = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY", example: "31/12/2025" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY", example: "12/31/2025" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD", example: "2025-12-31" },
  { value: "DD.MM.YYYY", label: "DD.MM.YYYY", example: "31.12.2025" },
];

export default function SettingsPage() {
  const {
    syncing: ynabSyncing,
    error: ynabError,
    result: ynabResult,
    triggerSync: triggerYnabSync,
  } = useYNABSync();
  const { configs: airtableConfigs, configsLoading: airtableConfigLoading } = useAirtableConfig();
  const { settings, updateSettings } = useCapitalData();
  const [activeTab, setActiveTab] = useState<"connections" | "preferences">(
    "connections",
  );
  const [dateFormat, setDateFormat] = useState<DateFormatString>(
    (settings?.dateFormat as DateFormatString) ?? "DD/MM/YYYY",
  );
  const [isSavingPref, setIsSavingPref] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);

  const handleSavePreferences = async () => {
    setIsSavingPref(true);
    setPrefSaved(false);
    try {
      await updateSettings({ dateFormat });
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 3000);
    } finally {
      setIsSavingPref(false);
    }
  };

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
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "connections" ? "border-(--cos-accent) text-(--cos-text)" : "border-transparent text-(--cos-text-2) hover:text-(--cos-text)"}`}
          >
            Data Connections
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "preferences" ? "border-(--cos-accent) text-(--cos-text)" : "border-transparent text-(--cos-text-2) hover:text-(--cos-text)"}`}
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 overflow-hidden">
                    <Image
                      src="/capital_os/icons/ynab-icon.png"
                      alt="YNAB"
                      width={48}
                      height={48}
                      className="h-10 w-10 object-contain"
                    />
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
                      className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-px disabled:opacity-50"
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
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 overflow-hidden">
                  <Image
                    src="/capital_os/icons/airtable-icon.png"
                    alt="Airtable"
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Airtable</h3>
                  <p
                    className="text-sm mt-1 mb-4"
                    style={{ color: "var(--cos-text-2)" }}
                  >
                    Secondary source for custom assets, goals, and fixed
                    investments. Configure your base and tables below.
                  </p>

                  {/* Configuration Form */}
                  <AirtableConfigForm />

                  {/* Sync Button */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--cos-border-subtle)" }}>
                    <AirtableSyncButton hasConfig={airtableConfigs.length > 0 && !airtableConfigLoading} />
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
              className="rounded-xl border p-6 space-y-6"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              {/* Date Format */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "var(--cos-accent)" }} />
                  <div>
                    <h3 className="font-semibold text-sm">Date Format</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--cos-text-2)" }}>
                      Applied throughout goals, deadlines, and all date displays.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:shrink-0">
                  <Select
                    value={dateFormat}
                    onValueChange={(v) => setDateFormat(v as DateFormatString)}
                  >
                    <SelectTrigger
                      className="w-44 rounded-xl border text-sm h-auto py-2"
                      style={{ borderColor: "var(--cos-border-subtle)", background: "var(--cos-surface-2)" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMAT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="font-medium">{opt.label}</span>
                          <span className="ml-2 text-xs opacity-50">{opt.example}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save bar */}
              <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--cos-border-subtle)" }}>
                {prefSaved ? (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--cos-positive)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Preferences saved
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--cos-text-3)" }}>
                    Changes apply immediately to all pages.
                  </span>
                )}
                <button
                  onClick={handleSavePreferences}
                  disabled={isSavingPref}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: "var(--cos-accent)" }}
                >
                  <Save className="h-3.5 w-3.5" />
                  {isSavingPref ? "Saving…" : "Save Preferences"}
                </button>
              </div>
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
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-px"
                  style={{
                    borderColor: "var(--cos-border)",
                    background: "var(--cos-surface-2)",
                    color: "var(--cos-text)",
                  }}
                >
                  <Download className="h-4 w-4" />
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
