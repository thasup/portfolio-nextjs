"use client";

/**
 * CapitalOS — Airtable Configuration Hook (Multi-Base, Discovery Flow)
 *
 * Manages fetching, discovering, and saving Airtable configurations.
 * Supports multiple bases per user.
 */

import { useState, useCallback, useEffect } from "react";
import type { CapitalAirtableEntityType } from "@prisma/client";

// ── Types ───────────────────────────────────────────────────────

export interface DiscoveredTable {
  id: string;
  name: string;
  description: string | null;
  fieldCount: number;
  fields: Array<{ id: string; name: string; type: string }>;
}

export interface DiscoveredBase {
  baseId: string;
  baseName: string;
  tables: DiscoveredTable[];
}

export interface AirtableTableMapping {
  tableId: string;
  tableName: string;
  customTitle?: string;
  customDescription?: string;
  entityType: CapitalAirtableEntityType | null;
  isEnabled: boolean;
}

export interface SavedBaseConfig {
  id: string;
  baseId: string;
  name: string;
  isActive: boolean;
  tables: Array<{
    id: string;
    entityType: CapitalAirtableEntityType;
    tableName: string;
    customTitle?: string | null;
    customDescription?: string | null;
    isEnabled: boolean;
  }>;
}

// ── Hook ────────────────────────────────────────────────────────

export function useAirtableConfig() {
  // Saved configs (multiple bases)
  const [configs, setConfigs] = useState<SavedBaseConfig[]>([]);
  const [configsLoading, setConfigsLoading] = useState(false);
  const [configsError, setConfigsError] = useState<string | null>(null);

  // Discovery state
  const [discovering, setDiscovering] = useState(false);
  const [discovered, setDiscovered] = useState<DiscoveredBase | null>(null);
  const [discoverError, setDiscoverError] = useState<string | null>(null);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Fetch saved configs ─────────────────────────────────────
  const fetchConfigs = useCallback(async () => {
    setConfigsLoading(true);
    setConfigsError(null);

    try {
      const response = await fetch("/api/capital-os/airtable/config");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch configurations");
      }

      if (data.configured && data.config) {
        setConfigs([data.config]);
      } else {
        setConfigs([]);
      }
    } catch (err) {
      setConfigsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setConfigsLoading(false);
    }
  }, []);

  // ── Discover tables from a base ─────────────────────────────
  const discoverTables = useCallback(async (baseId: string): Promise<boolean> => {
    setDiscovering(true);
    setDiscoverError(null);
    setDiscovered(null);

    try {
      const response = await fetch(
        `/api/capital-os/airtable/discover?baseId=${encodeURIComponent(baseId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to discover tables");
      }

      setDiscovered(data);
      return true;
    } catch (err) {
      setDiscoverError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setDiscovering(false);
    }
  }, []);

  // ── Save base configuration ─────────────────────────────────
  const saveBaseConfig = useCallback(
    async (data: {
      baseId: string;
      name: string;
      tables: AirtableTableMapping[];
    }): Promise<boolean> => {
      setSaving(true);
      setSaveError(null);

      try {
        const response = await fetch("/api/capital-os/airtable/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to save configuration");
        }

        setConfigs((prev) => {
          const filtered = prev.filter((c) => c.baseId !== result.config.baseId);
          return [...filtered, result.config];
        });
        setDiscovered(null);
        return true;
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // ── Delete a base config ────────────────────────────────────
  const deleteConfig = useCallback(
    async (configId: string): Promise<boolean> => {
      setSaving(true);
      setSaveError(null);

      try {
        const response = await fetch("/api/capital-os/airtable/config", {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to delete configuration");
        }

        setConfigs((prev) => prev.filter((c) => c.id !== configId));
        return true;
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // ── Reset discovery ──────────────────────────────────────────
  const resetDiscovery = useCallback(() => {
    setDiscovered(null);
    setDiscoverError(null);
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return {
    // Saved configs
    configs,
    configsLoading,
    configsError,
    fetchConfigs,

    // Discovery
    discovered,
    discovering,
    discoverError,
    discoverTables,
    resetDiscovery,

    // Saving
    saving,
    saveError,
    saveBaseConfig,
    deleteConfig,
  };
}
