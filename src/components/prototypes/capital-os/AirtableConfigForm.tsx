"use client";

/**
 * CapitalOS — Airtable Configuration Form (Multi-Base Discovery Flow)
 *
 * Step 1: Enter base ID
 * Step 2: API loads tables
 * Step 3: Select tables to sync
 * Step 4: Customize each table (title, description, type)
 * Step 5: Confirm & save
 * Step 6: Sync (via AirtableSyncButton)
 */

import { useState, useCallback } from "react";
import {
  Database,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Search,
  Table2,
} from "lucide-react";
import type { CapitalAirtableEntityType } from "@prisma/client";
import {
  useAirtableConfig,
  type AirtableTableMapping,
  type SavedBaseConfig,
} from "@/lib/capital-os/hooks/useAirtableConfig";

const ENTITY_TYPES: { value: CapitalAirtableEntityType; label: string }[] = [
  { value: "ACCOUNTS", label: "Accounts" },
  { value: "LIABILITIES", label: "Liabilities" },
  { value: "GOALS", label: "Goals" },
  { value: "SNAPSHOTS", label: "Snapshots" },
  { value: "HOLDINGS", label: "Holdings" },
];

// ── Main Component ──────────────────────────────────────────────

export function AirtableConfigForm() {
  const {
    configs,
    configsLoading,
    configsError,
    discovered,
    discovering,
    discoverError,
    saving,
    saveError,
    discoverTables,
    saveBaseConfig,
    deleteConfig,
    resetDiscovery,
  } = useAirtableConfig();

  // Step 1: "list" | "add-base-id" | "discover" | "select" | "customize" | "confirm"
  const [step, setStep] = useState<"list" | "add-base-id" | "select" | "customize" | "confirm">(
    "list"
  );

  // Form state
  const [baseId, setBaseId] = useState("");
  const [baseName, setBaseName] = useState("");
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [tableMappings, setTableMappings] = useState<AirtableTableMapping[]>([]);

  // ── Step 1: Enter Base ID ─────────────────────────────────────
  const handleDiscover = async () => {
    if (!baseId.trim()) return;
    const success = await discoverTables(baseId.trim());
    if (success && discovered) {
      setBaseName(discovered.baseName);
      setStep("select");
    }
  };

  // ── Step 2: Select Tables ──────────────────────────────────────
  const toggleTableSelection = (tableId: string) => {
    setSelectedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
  };

  const goToCustomize = () => {
    if (!discovered) return;
    const mappings: AirtableTableMapping[] = discovered.tables
      .filter((t) => selectedTables.has(t.id))
      .map((t) => ({
        tableId: t.id,
        tableName: t.name,
        customTitle: t.name,
        customDescription: t.description || "",
        entityType: null,
        isEnabled: true,
      }));
    setTableMappings(mappings);
    setStep("customize");
  };

  // ── Step 3: Customize Tables ───────────────────────────────────
  const updateMapping = (index: number, updates: Partial<AirtableTableMapping>) => {
    setTableMappings((prev) => prev.map((m, i) => (i === index ? { ...m, ...updates } : m)));
  };

  const removeMapping = (index: number) => {
    setTableMappings((prev) => prev.filter((_, i) => i !== index));
  };

  const goToConfirm = () => {
    const valid = tableMappings.every((m) => m.entityType !== null);
    if (!valid) {
      alert("Please select an entity type for each table");
      return;
    }
    setStep("confirm");
  };

  // ── Step 4: Confirm & Save ────────────────────────────────────
  const handleSave = async () => {
    const success = await saveBaseConfig({
      baseId,
      name: baseName || baseId,
      tables: tableMappings,
    });
    if (success) {
      setStep("list");
      resetForm();
    }
  };

  const resetForm = () => {
    setBaseId("");
    setBaseName("");
    setSelectedTables(new Set());
    setTableMappings([]);
    resetDiscovery();
  };

  // ── Delete Base ────────────────────────────────────────────────
  const handleDeleteBase = async (config: SavedBaseConfig) => {
    if (!confirm(`Remove "${config.name}" configuration?`)) return;
    await deleteConfig(config.id);
  };

  // ── Render: List View ─────────────────────────────────────────
  if (step === "list") {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium" style={{ color: "var(--cos-text-2)" }}>
            Connected Bases ({configs.length})
          </h4>
          <button
            onClick={() => setStep("add-base-id")}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium"
            style={{ background: "var(--cos-accent)", color: "white" }}
          >
            <Plus className="h-3 w-3" />
            Add Base
          </button>
        </div>

        {/* Error */}
        {configsError && (
          <div
            className="flex items-center gap-2 rounded-lg border p-3 text-sm"
            style={{ borderColor: "var(--cos-negative)", color: "var(--cos-negative)" }}
          >
            <AlertCircle className="h-4 w-4" />
            {configsError}
          </div>
        )}

        {/* Loading */}
        {configsLoading && (
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--cos-border)" }}>
            <div className="flex items-center gap-2" style={{ color: "var(--cos-text-3)" }}>
              <Database className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Loading configurations...</span>
            </div>
          </div>
        )}

        {/* Bases List */}
        {!configsLoading &&
          configs.map((config) => (
            <div
              key={config.id}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--cos-border)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium" style={{ color: "var(--cos-text-1)" }}>
                    {config.name}
                  </h5>
                  <p className="text-xs font-mono" style={{ color: "var(--cos-text-3)" }}>
                    {config.baseId}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--cos-text-2)" }}>
                    {config.tables.length} table{config.tables.length !== 1 ? "s" : ""} configured
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteBase(config)}
                  className="rounded p-1.5 text-red-500 hover:bg-red-50"
                  title="Remove base"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {config.tables.map((t) => (
                  <span
                    key={t.id}
                    className="rounded px-2 py-1 text-xs"
                    style={{ background: "var(--cos-surface-2)", color: "var(--cos-text-2)" }}
                  >
                    {t.customTitle || t.tableName}
                  </span>
                ))}
              </div>
            </div>
          ))}

        {/* Empty state */}
        {!configsLoading && configs.length === 0 && (
          <div
            className="rounded-lg border border-dashed p-6 text-center"
            style={{ borderColor: "var(--cos-border)", color: "var(--cos-text-3)" }}
          >
            <Database className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No Airtable bases configured yet.</p>
            <p className="mt-1 text-xs">Click &quot;Add Base&quot; to connect your first base.</p>
          </div>
        )}
      </div>
    );
  }

  // ── Render: Add Base ID Step ──────────────────────────────────
  if (step === "add-base-id") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--cos-text-3)" }}>
          <button onClick={() => setStep("list")} className="hover:underline">
            Bases
          </button>
          <ChevronRight className="h-3 w-3" />
          <span>Add Base</span>
        </div>

        <div className="rounded-lg border p-4" style={{ borderColor: "var(--cos-border)" }}>
          <h5 className="mb-4 font-medium" style={{ color: "var(--cos-text-1)" }}>
            Step 1: Enter Base ID
          </h5>

          <div className="space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                Airtable Base ID
                <a
                  href="https://airtable.com/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-xs"
                  style={{ color: "var(--cos-accent)" }}
                >
                  Find yours
                  <ExternalLink className="h-3 w-3" />
                </a>
              </label>
              <input
                type="text"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                placeholder="appXXXXXXXXXXXXXX"
                className="w-full rounded border px-3 py-2 text-sm font-mono"
                style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
              />
              <p className="mt-1 text-xs" style={{ color: "var(--cos-text-3)" }}>
                Starts with &quot;app&quot;. Found in Airtable API documentation.
              </p>
            </div>

            {discoverError && (
              <div
                className="flex items-center gap-2 rounded-lg border p-3 text-sm"
                style={{ borderColor: "var(--cos-negative)", color: "var(--cos-negative)" }}
              >
                <AlertCircle className="h-4 w-4" />
                {discoverError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("list")}
                className="flex items-center gap-1 text-sm"
                style={{ color: "var(--cos-text-3)" }}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleDiscover}
                disabled={discovering || !baseId.trim()}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
                style={{ background: "var(--cos-accent)", color: "white" }}
              >
                {discovering ? (
                  <>
                    <Search className="h-4 w-4 animate-spin" />
                    Discovering...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Discover Tables
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Select Tables Step ────────────────────────────────
  if (step === "select" && discovered) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--cos-text-3)" }}>
          <button onClick={() => setStep("list")} className="hover:underline">
            Bases
          </button>
          <ChevronRight className="h-3 w-3" />
          <span>Select Tables</span>
        </div>

        <div className="rounded-lg border p-4" style={{ borderColor: "var(--cos-border)" }}>
          <div className="mb-4">
            <h5 className="font-medium" style={{ color: "var(--cos-text-1)" }}>
              Step 2: Select Tables to Sync
            </h5>
            <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
              Found {discovered.tables.length} tables in "{discovered.baseName}"
            </p>
          </div>

          <div className="space-y-2">
            {discovered.tables.map((table) => (
              <label
                key={table.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:opacity-80"
                style={{
                  borderColor: selectedTables.has(table.id)
                    ? "var(--cos-accent)"
                    : "var(--cos-border)",
                  background: selectedTables.has(table.id) ? "var(--cos-accent-bg)" : "var(--cos-surface)",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTables.has(table.id)}
                  onChange={() => toggleTableSelection(table.id)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Table2 className="h-4 w-4" style={{ color: "var(--cos-text-3)" }} />
                    <span className="font-medium" style={{ color: "var(--cos-text-1)" }}>
                      {table.name}
                    </span>
                  </div>
                  {table.description && (
                    <p className="mt-0.5 text-xs" style={{ color: "var(--cos-text-3)" }}>
                      {table.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs" style={{ color: "var(--cos-text-3)" }}>
                    {table.fieldCount} fields
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setStep("add-base-id")}
              className="flex items-center gap-1 text-sm"
              style={{ color: "var(--cos-text-3)" }}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={goToCustomize}
              disabled={selectedTables.size === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--cos-accent)", color: "white" }}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Customize Tables Step ───────────────────────────────
  if (step === "customize") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--cos-text-3)" }}>
          <button onClick={() => setStep("list")} className="hover:underline">
            Bases
          </button>
          <ChevronRight className="h-3 w-3" />
          <span>Customize Tables</span>
        </div>

        <div className="rounded-lg border p-4" style={{ borderColor: "var(--cos-border)" }}>
          <div className="mb-4">
            <h5 className="font-medium" style={{ color: "var(--cos-text-1)" }}>
              Step 3: Customize Tables
            </h5>
            <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
              Set title, description, and entity type for each table
            </p>
          </div>

          <div className="space-y-3">
            {tableMappings.map((mapping, index) => (
              <div
                key={mapping.tableId}
                className="rounded-lg border p-3"
                style={{ borderColor: "var(--cos-border)" }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-mono" style={{ color: "var(--cos-text-3)" }}>
                    {mapping.tableName}
                  </span>
                  <button
                    onClick={() => removeMapping(index)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={mapping.customTitle}
                    onChange={(e) => updateMapping(index, { customTitle: e.target.value })}
                    placeholder="Custom title"
                    className="w-full rounded border px-2 py-1.5 text-sm"
                    style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
                  />
                  <input
                    type="text"
                    value={mapping.customDescription}
                    onChange={(e) => updateMapping(index, { customDescription: e.target.value })}
                    placeholder="Description (optional)"
                    className="w-full rounded border px-2 py-1.5 text-sm"
                    style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
                  />
                  <select
                    value={mapping.entityType || ""}
                    onChange={(e) =>
                      updateMapping(index, {
                        entityType: e.target.value as CapitalAirtableEntityType,
                      })
                    }
                    className="w-full rounded border px-2 py-1.5 text-sm"
                    style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
                  >
                    <option value="">Select entity type...</option>
                    {ENTITY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-1 text-sm"
              style={{ color: "var(--cos-text-3)" }}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={goToConfirm}
              disabled={tableMappings.length === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--cos-accent)", color: "white" }}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Confirm Step ──────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--cos-text-3)" }}>
          <button onClick={() => setStep("list")} className="hover:underline">
            Bases
          </button>
          <ChevronRight className="h-3 w-3" />
          <span>Confirm</span>
        </div>

        <div className="rounded-lg border p-4" style={{ borderColor: "var(--cos-border)" }}>
          <div className="mb-4">
            <h5 className="font-medium" style={{ color: "var(--cos-text-1)" }}>
              Step 4: Confirm Configuration
            </h5>
            <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
              Review before saving
            </p>
          </div>

          {/* Base Name Input */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Base Name</label>
            <input
              type="text"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              placeholder="My Airtable Base"
              className="w-full rounded border px-3 py-2 text-sm"
              style={{ borderColor: "var(--cos-border)", background: "var(--cos-surface)" }}
            />
          </div>

          {/* Summary */}
          <div className="mb-4 space-y-2">
            {tableMappings.map((m) => {
              const entityLabel = ENTITY_TYPES.find((e) => e.value === m.entityType)?.label;
              return (
                <div
                  key={m.tableId}
                  className="flex items-center justify-between rounded border p-2 text-sm"
                  style={{ borderColor: "var(--cos-border)" }}
                >
                  <span>
                    <span className="font-medium">{m.customTitle}</span>
                    {m.customDescription && (
                      <span className="ml-2 text-xs" style={{ color: "var(--cos-text-3)" }}>
                        — {m.customDescription}
                      </span>
                    )}
                  </span>
                  <span
                    className="rounded px-2 py-0.5 text-xs"
                    style={{ background: "var(--cos-accent-bg)", color: "var(--cos-accent)" }}
                  >
                    {entityLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {saveError && (
            <div
              className="mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm"
              style={{ borderColor: "var(--cos-negative)", color: "var(--cos-negative)" }}
            >
              <AlertCircle className="h-4 w-4" />
              {saveError}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep("customize")}
              className="flex items-center gap-1 text-sm"
              style={{ color: "var(--cos-text-3)" }}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--cos-accent)", color: "white" }}
            >
              {saving ? (
                <>
                  <Database className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}