"use client";

/**
 * CapitalOS Dashboard page.
 *
 * The command center: KPI cards, net worth trajectory chart,
 * asset distribution pie, liabilities panel, and AI insights.
 */
import { useState } from "react";
import {
  TrendingUp,
  Wallet,
  Clock,
  Target,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { CapitalScenarioMode, CapitalAssetType } from "@/lib/capital-os/types";
import {
  MOCK_ACCOUNTS,
  MOCK_LIABILITIES,
  MOCK_GOALS,
  sumByType,
} from "@/lib/capital-os/mock-data";
import { computeProjection } from "@/lib/capital-os/projection";
import { fmtCurrency, fmtDate } from "@/lib/capital-os/format";

export default function DashboardPage() {
  const [params] = useState({
    burnRate: 2500000,
    ssoMonths: 6,
    investReturn: 8,
    missionSuccessMonth: 4,
    postSuccessIncome: 8000000,
    scenarioMode: CapitalScenarioMode.BASE,
  });

  const projection = computeProjection(
    params,
    MOCK_ACCOUNTS,
    MOCK_LIABILITIES,
  );

  const nw = projection.netWorth;
  const liquid = projection.liquid;
  const runway = projection.runwayMonths;

  // Convert satangs to THB for display
  const toTHB = (v: number) => v / 100;

  const metrics: Array<{
    id: string;
    label: string;
    value: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    trend: "up" | "down" | "neutral";
  }> = [
    {
      id: "metric-net-worth",
      label: "Net Worth",
      value: fmtCurrency(toTHB(nw)),
      description: "↑ 12% from last month",
      icon: TrendingUp,
      color: "var(--cos-accent)",
      bgColor: "var(--cos-accent-muted)",
      trend: "up",
    },
    {
      id: "metric-liquid-capital",
      label: "Liquid Capital",
      value: fmtCurrency(toTHB(liquid)),
      description: "Available for deployment",
      icon: Wallet,
      color: "var(--cos-accent-2)",
      bgColor: "var(--cos-accent-2-muted)",
      trend: "neutral",
    },
    {
      id: "metric-runway",
      label: "Financial Runway",
      value: `${runway} Months`,
      description: `At ${fmtCurrency(toTHB(params.burnRate))}/mo burn`,
      icon: Clock,
      color: "var(--cos-warning)",
      bgColor: "var(--cos-warning-muted)",
      trend: "neutral",
    },
    {
      id: "metric-goals",
      label: "Active Goals",
      value: `${MOCK_GOALS.length}`,
      description: `${MOCK_GOALS.filter((g) => g.current >= g.target).length} completed`,
      icon: Target,
      color: "#ec4899",
      bgColor: "rgba(236, 72, 153, 0.12)",
      trend: "up",
    },
  ];

  // Asset distribution for pie chart
  const assetPieData = [
    {
      name: "Liquid",
      value: toTHB(sumByType(MOCK_ACCOUNTS, CapitalAssetType.LIQUID)),
      color: "var(--cos-chart-1)",
      fill: "#10b981",
    },
    {
      name: "Semi-Liquid",
      value: toTHB(sumByType(MOCK_ACCOUNTS, CapitalAssetType.SEMI_LIQUID)),
      color: "var(--cos-chart-3)",
      fill: "#8b5cf6",
    },
    {
      name: "Investment",
      value: toTHB(sumByType(MOCK_ACCOUNTS, CapitalAssetType.INVESTMENT)),
      color: "var(--cos-chart-4)",
      fill: "#f59e0b",
    },
    {
      name: "Fixed Assets",
      value: toTHB(sumByType(MOCK_ACCOUNTS, CapitalAssetType.FIXED_ASSET)),
      color: "var(--cos-chart-2)",
      fill: "#3b82f6",
    },
    {
      name: "Goal Funds",
      value: toTHB(sumByType(MOCK_ACCOUNTS, CapitalAssetType.GOAL_FUND)),
      color: "var(--cos-chart-5)",
      fill: "#ec4899",
    },
  ];

  // Projection chart data (convert satangs to THB)
  const chartData = projection.points
    .filter((_, i) => i % 2 === 0)
    .map((p) => ({
      ...p,
      netWorth: toTHB(p.netWorth),
      liquid: toTHB(p.liquid),
      portfolio: toTHB(p.portfolio),
    }));

  return (
    <div className="flex flex-col">
      <CapitalOSHeader
        title="Capital Intelligence"
        subtitle={`Last Updated: ${fmtDate(new Date())} · Sources: Mock Data`}
      />

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* ── KPI Cards ──────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.id}
              id={m.id}
              className="rounded-xl border p-4 transition-all duration-200 hover:translate-y-[-2px]"
              style={{
                background: "var(--cos-surface)",
                borderColor: "var(--cos-border-subtle)",
                boxShadow: "var(--cos-shadow-sm)",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--cos-text-2)" }}
                >
                  {m.label}
                </span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: m.bgColor, color: m.color }}
                >
                  <m.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold sm:text-2xl">{m.value}</div>
              <p
                className="mt-1 flex items-center gap-1 text-xs"
                style={{ color: "var(--cos-text-3)" }}
              >
                {m.trend === "up" && (
                  <ArrowUpRight
                    className="h-3 w-3"
                    style={{ color: "var(--cos-positive)" }}
                  />
                )}
                {m.trend === "down" && (
                  <ArrowDownRight
                    className="h-3 w-3"
                    style={{ color: "var(--cos-negative)" }}
                  />
                )}
                {m.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Charts Row ─────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Net Worth Trajectory */}
          <div
            id="chart-net-worth"
            className="rounded-xl border p-4 sm:p-6 lg:col-span-4"
            style={{
              background: "var(--cos-surface)",
              borderColor: "var(--cos-border-subtle)",
            }}
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold sm:text-lg">
                Net Worth Trajectory
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--cos-text-2)" }}
              >
                24-month projection based on current parameters
              </p>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="gradNetWorth"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradLiquid"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      `${Math.round(v / 1000)}K`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                      fontSize: "12px",
                    }}
                    
                    formatter={(value: string | number | readonly (string | number)[] | undefined) => [
                      value ? fmtCurrency(Number(value)) : "-",
                      undefined,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
                    name="Net Worth"
                    stroke="#10b981"
                    fill="url(#gradNetWorth)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="liquid"
                    name="Liquid"
                    stroke="#3b82f6"
                    fill="url(#gradLiquid)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Distribution */}
          <div
            id="chart-asset-distribution"
            className="rounded-xl border p-4 sm:p-6 lg:col-span-3"
            style={{
              background: "var(--cos-surface)",
              borderColor: "var(--cos-border-subtle)",
            }}
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold sm:text-lg">
                Asset Distribution
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--cos-text-2)" }}
              >
                Current allocation across asset classes
              </p>
            </div>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {assetPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                      fontSize: "12px",
                    }}
                    
                    formatter={(value: string | number | readonly (string | number)[] | undefined) => [
                      value ? fmtCurrency(Number(value)) : "-",
                      undefined,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span style={{ color: "#9ca3af", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Bottom Row ─────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Liabilities */}
          <div
            id="panel-liabilities"
            className="rounded-xl border p-4 sm:p-6 lg:col-span-3"
            style={{
              background: "var(--cos-surface)",
              borderColor: "var(--cos-border-subtle)",
            }}
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold sm:text-lg">
                Liabilities & Debt
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--cos-text-2)" }}
              >
                High-interest tracking and payoff strategy
              </p>
            </div>
            <div className="space-y-3">
              {MOCK_LIABILITIES.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                  style={{
                    background: "var(--cos-bg)",
                    borderColor: "var(--cos-border-subtle)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                      style={{
                        background: "var(--cos-negative-muted)",
                        color: "var(--cos-negative)",
                      }}
                    >
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{l.name}</p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--cos-text-3)" }}
                      >
                        {l.apr ? `${l.apr}% APR` : "0% Interest"}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--cos-negative)" }}
                  >
                    {fmtCurrency(Math.abs(toTHB(l.balance)))}
                  </p>
                </div>
              ))}

              {/* Strategy tip */}
              <div
                className="rounded-lg border p-3"
                style={{
                  background: "var(--cos-negative-muted)",
                  borderColor: "rgba(239, 68, 68, 0.2)",
                }}
              >
                <p className="text-xs leading-relaxed">
                  <span
                    className="mr-1 font-bold uppercase"
                    style={{ color: "var(--cos-negative)" }}
                  >
                    Strategy Tip:
                  </span>
                  <span style={{ color: "var(--cos-text-2)" }}>
                    Paying off high-interest debt from your{" "}
                    {fmtCurrency(toTHB(liquid))} liquid capital yields a
                    guaranteed 18% return.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div
            id="panel-insights"
            className="rounded-xl border p-4 sm:p-6 lg:col-span-4"
            style={{
              background: "var(--cos-surface)",
              borderColor: "var(--cos-border-subtle)",
            }}
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold sm:text-lg">
                Intelligence Insights
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--cos-text-2)" }}
              >
                AI-generated financial health summary
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: "insight-trend",
                  icon: TrendingUp,
                  color: "var(--cos-accent)",
                  bg: "var(--cos-accent-muted)",
                  title: "Positive Net Worth Trend",
                  body: `Your net worth is projected to increase by 24% over the next 12 months if current income targets are met.`,
                },
                {
                  id: "insight-liquidity",
                  icon: Wallet,
                  color: "var(--cos-warning)",
                  bg: "var(--cos-warning-muted)",
                  title: "Liquidity Buffer",
                  body: `You have ${runway} months of runway. Consider moving 20% of your liquid capital to high-yield savings.`,
                },
                {
                  id: "insight-diversification",
                  icon: BarChart3,
                  color: "var(--cos-accent-2)",
                  bg: "var(--cos-accent-2-muted)",
                  title: "Income Diversification",
                  body: "Your SSO income covers 36% of your monthly burn. Post-success income target is essential for long-term sustainability.",
                },
              ].map((insight) => (
                <div
                  key={insight.id}
                  id={insight.id}
                  className="flex items-start gap-3"
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: insight.bg,
                      color: insight.color,
                    }}
                  >
                    <insight.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p
                      className="mt-0.5 text-xs leading-relaxed"
                      style={{ color: "var(--cos-text-2)" }}
                    >
                      {insight.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
