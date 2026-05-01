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
} from "lucide-react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import {
  MOCK_ACCOUNTS,
  totalAssets,
  sumByType,
} from "@/lib/capital-os/mock-data";
import { CapitalAssetType } from "@/lib/capital-os/types";
import { fmtCurrency } from "@/lib/capital-os/format";

export default function AccountsPage() {
  const toTHB = (v: number) => v / 100;
  const total = totalAssets(MOCK_ACCOUNTS);
  const liquidSum = sumByType(MOCK_ACCOUNTS, CapitalAssetType.LIQUID);
  const investSum = sumByType(MOCK_ACCOUNTS, CapitalAssetType.INVESTMENT);
  const otherSum =
    sumByType(MOCK_ACCOUNTS, CapitalAssetType.FIXED_ASSET) +
    sumByType(MOCK_ACCOUNTS, CapitalAssetType.SEMI_LIQUID) +
    sumByType(MOCK_ACCOUNTS, CapitalAssetType.GOAL_FUND);

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
        {/* ── Summary Cards ──────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.id}
              id={card.id}
              className="rounded-xl border p-4"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--cos-text-2)" }}
              >
                {card.label}
              </p>
              <p className="mt-1 text-xl font-bold sm:text-2xl">
                {card.value}
              </p>
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
          <div className="flex items-center justify-between border-b p-4 sm:p-6" style={{ borderColor: "var(--cos-border-subtle)" }}>
            <div>
              <h2 className="text-base font-semibold sm:text-lg">
                Asset Inventory
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--cos-text-2)" }}
              >
                All tracked accounts and assets
              </p>
            </div>
            <button
              id="btn-add-account"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                background: "var(--cos-accent)",
                color: "#fff",
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Account</span>
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
                  <th className="hidden px-4 py-3 md:table-cell">
                    Allocation
                  </th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="w-[50px] px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ACCOUNTS.map((acc) => {
                  const pct = Math.round((acc.balance / total) * 100);
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
                            style={{ color: "var(--cos-text-3)" }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold">
                        {fmtCurrency(toTHB(acc.balance))}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--cos-surface-2)]"
                          style={{ color: "var(--cos-text-3)" }}
                          aria-label="Account actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
