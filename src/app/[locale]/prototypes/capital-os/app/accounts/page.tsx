"use client";

/**
 * CapitalOS Accounts & Assets page.
 *
 * Data table showing all financial accounts with type badges,
 * allocation bars, and CRUD actions.
 */
import {
  Coins,
  Landmark,
  Gem,
  Building2,
  PieChart as ChartIcon,
  Plus,
  MoreVertical,
  Heart,
  Database,
  Trash2,
  Undo2,
} from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { ConfirmationModal } from "@/components/prototypes/capital-os/ConfirmationModal";
import { SyncButton } from "@/components/prototypes/capital-os/SyncButton";
import { useCapitalData } from "@/lib/capital-os/hooks";
import { sumByType, totalAssets } from "@/lib/capital-os/mock-data";
import { CapitalAssetType } from "@/lib/capital-os/types";
import { fmtCurrency } from "@/lib/capital-os/format";
import { SnowballSnapshotWizard } from "@/components/prototypes/capital-os/SnowballSnapshotWizard";

import { useState } from "react";

export default function AccountsPage() {
  const { accounts, deletedAccounts, isMockData, refresh } = useCapitalData();
  const [isSnowballOpen, setIsSnowballOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/capital-os/accounts/${itemToDelete.id}`, {
        method: "DELETE",
      });
      await refresh();
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleUndo = async (id: string) => {
    await fetch(`/api/capital-os/accounts/${id}?undo=true`, {
      method: "DELETE",
    });
    await refresh();
  };

  const toTHB = (v: number) => v / 100;
  const total = totalAssets(accounts);
  const liquidSum = sumByType(accounts, CapitalAssetType.LIQUID);
  const investSum = sumByType(accounts, CapitalAssetType.INVESTMENT);
  const otherSum =
    sumByType(accounts, CapitalAssetType.FIXED_ASSET) +
    sumByType(accounts, CapitalAssetType.SEMI_LIQUID) +
    sumByType(accounts, CapitalAssetType.GOAL_FUND);

  const getIcon = (type: CapitalAssetType) => {
    switch (type) {
      case CapitalAssetType.LIQUID:
        return <Coins className="h-4 w-4" />;
      case CapitalAssetType.INVESTMENT:
        return <Landmark className="h-4 w-4" />;
      case CapitalAssetType.SEMI_LIQUID:
        return <Gem className="h-4 w-4" />;
      case CapitalAssetType.FIXED_ASSET:
        return <Building2 className="h-4 w-4" />;
      case CapitalAssetType.GOAL_FUND:
        return <Heart className="h-4 w-4" />;
      default:
        return <ChartIcon className="h-4 w-4" />;
    }
  };

  const summaryCards = [
    {
      id: "summary-total-assets",
      label: "Total Assets",
      value: fmtCurrency(toTHB(total)),
    },
    {
      id: "summary-liquid-cash",
      label: "Liquid Cash",
      value: fmtCurrency(toTHB(liquidSum)),
    },
    {
      id: "summary-investments",
      label: "Investments",
      value: fmtCurrency(toTHB(investSum)),
    },
    {
      id: "summary-other",
      label: "Other Assets",
      value: fmtCurrency(toTHB(otherSum)),
    },
  ];

  return (
    <div className="flex flex-col">
      <CapitalOSHeader
        title="Accounts & Assets"
        subtitle="Detailed breakdown of your financial holdings across all platforms"
      />

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* ── Data Source + Sync ──────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database
              className="h-3.5 w-3.5"
              style={{
                color: isMockData
                  ? "var(--intent-warning)"
                  : "var(--intent-success)",
              }}
            />
            <span
              className="text-xs font-medium"
              style={{
                color: isMockData
                  ? "var(--intent-warning)"
                  : "var(--intent-success)",
              }}
            >
              {isMockData ? "Mock data" : "Live data"}
            </span>
          </div>
          <SyncButton onSyncComplete={refresh} />
        </div>

        {/* ── Summary Cards ──────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.id}
              id={card.id}
              className="rounded-xl border p-4"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {card.label}
              </p>
              <p className="mt-1 text-xl font-bold sm:text-2xl" style={{ fontFamily: 'var(--font-mono)' }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* ── Asset Table ────────────────────────────── */}
        <div
          id="table-accounts"
          className="overflow-hidden rounded-xl border"
          style={{
            background: "var(--cos-surface)",
            borderColor: "var(--cos-border-subtle)",
          }}
        >
          <div
            className="flex items-center justify-between border-b p-4 sm:p-6"
            style={{ borderColor: "var(--cos-border-subtle)" }}
          >
            <div>
              <h2 className="text-base font-semibold sm:text-lg">
                Asset Inventory
              </h2>
              <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
                {accounts.length} tracked accounts and assets
              </p>
            </div>
            <button
              id="btn-add-account"
              onClick={() => setIsSnowballOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
              style={{
                background: "var(--cos-accent)",
                color: "#fff",
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Snowball Snapshot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b text-left text-xs font-medium"
                  style={{
                    borderColor: "var(--cos-border-subtle)",
                    color: "var(--cos-text-3)",
                  }}
                >
                  <th className="px-4 py-3 sm:px-6">Account Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="hidden px-4 py-3 md:table-cell">Allocation</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="w-[50px] px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => {
                  const pct =
                    total > 0 ? Math.round((acc.balance / total) * 100) : 0;
                  return (
                    <tr
                      key={acc.id}
                      className="border-b transition-colors hover:bg-[var(--cos-surface-2)]"
                      style={{ borderColor: "var(--cos-border-subtle)" }}
                    >
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full"
                            style={{
                              background: "var(--cos-accent-muted)",
                              color: "var(--cos-accent)",
                            }}
                          >
                            {getIcon(acc.type)}
                          </div>
                          <span className="text-sm font-medium">
                            {acc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
                          style={{
                            background: "var(--cos-surface-2)",
                            color: "var(--cos-text-2)",
                          }}
                        >
                          {acc.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 w-24 overflow-hidden rounded-full"
                            style={{ background: "var(--cos-surface-3)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: "var(--cos-accent)",
                              }}
                            />
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-right text-sm font-bold"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {fmtCurrency(toTHB(acc.balance))}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setItemToDelete(acc)}
                          className="rounded-lg p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-500"
                          style={{ color: "var(--text-tertiary)" }}
                          aria-label="Delete account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {deletedAccounts.length > 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--cos-warning)] bg-[rgba(245,158,11,0.05)] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold sm:text-lg text-[var(--cos-warning)]">
                  Recently Deleted
                </h2>
                <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
                  Items deleted within the last 24 hours can be restored.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {deletedAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between rounded-lg bg-[var(--cos-surface)] p-3 border border-[var(--cos-border-subtle)]"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-4 w-4 text-[var(--cos-text-3)]" />
                    <span className="text-sm font-medium line-through text-[var(--cos-text-2)]">
                      {acc.name}
                    </span>
                    <span className="text-xs text-[var(--cos-text-3)]">
                      ({fmtCurrency(toTHB(acc.balance))})
                    </span>
                  </div>
                  <button
                    onClick={() => handleUndo(acc.id)}
                    className="flex items-center gap-1.5 rounded bg-[var(--cos-surface-2)] px-3 py-1 text-xs font-medium text-[var(--cos-text-1)] hover:bg-[var(--cos-surface-3)] transition-colors"
                  >
                    <Undo2 className="h-3 w-3" /> Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!itemToDelete}
        title="Confirm Deletion"
        beforeData={itemToDelete}
        afterData={null}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Snowball Modal */}
      {isSnowballOpen && (
        <SnowballSnapshotWizard 
          onClose={() => setIsSnowballOpen(false)} 
          onSuccess={() => {
            setIsSnowballOpen(false);
            refresh();
          }} 
        />
      )}
    </div>
  );
}
