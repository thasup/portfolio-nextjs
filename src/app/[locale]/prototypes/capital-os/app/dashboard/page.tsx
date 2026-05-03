"use client";

/**
 * CapitalOS Dashboard page.
 *
 * The command center: KPI cards, net worth trajectory chart,
 * asset distribution pie, liabilities panel, and AI insights.
 */
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Wallet,
  Clock,
  Target,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Database,
  Settings2,
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
import { SyncButton } from "@/components/prototypes/capital-os/SyncButton";
import { CapitalScenarioMode, CapitalAssetType, CapitalMappingRole, type CapitalSACategory, type CapitalMappingConfig } from "@/lib/capital-os/types";
import { useCapitalData } from "@/lib/capital-os/hooks";
import { sumByType } from "@/lib/capital-os/mock-data";
import { computeProjection } from "@/lib/capital-os/projection";
import { fmtCurrency, fmtDate, fmtTime } from "@/lib/capital-os/format";
import { RunwaySettingsModal } from "@/components/prototypes/capital-os/RunwaySettingsModal";

export default function DashboardPage() {
  const {
    accounts,
    liabilities,
    goals,
    settings,
    updateSettings,
    snapshots,
    isMockData,
    refresh,
    lastSynced,
  } = useCapitalData();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dual-source state for v4
  const [saTotal, setSaTotal] = useState<number>(0);
  const [mappingConfig, setMappingConfig] = useState<CapitalMappingConfig[]>([]);
  const [dualSourceEnabled, setDualSourceEnabled] = useState(false);

  // Fetch dual-source data
  useEffect(() => {
    Promise.all([
      fetch("/api/capital-os/mapping").then(r => r.json()),
      fetch("/api/capital-os/sa-categories").then(r => r.json()),
    ]).then(([mappingRes, saRes]) => {
      if (mappingRes.data?.length > 0) {
        setMappingConfig(mappingRes.data);
        setDualSourceEnabled(true);
      }
      // Calculate SA total from categories (would come from snapshots in full implementation)
      const categories: CapitalSACategory[] = [...(saRes.strategic || []), ...(saRes.tactical || [])];
      const demoTotal = categories.reduce((sum, cat) => sum + (cat.assets?.reduce((a, asset) => a + (asset.valueThb || 0), 0) || 0), 0);
      setSaTotal(demoTotal || 0);
    }).catch(() => {
      setDualSourceEnabled(false);
    });
  }, []);

  const [params] = useState({
    burnRate: 2500000,
    ssoMonths: 6,
    investReturn: 8,
    missionSuccessMonth: 4,
    postSuccessIncome: 8000000,
    scenarioMode: CapitalScenarioMode.BASE,
  });

  const projection = computeProjection(params, accounts, liabilities, settings);

  const nw = projection.netWorth;
  const liquid = projection.liquid;
  const runway = projection.runwayMonths;

  // Convert satangs to THB for display
  const toTHB = (v: number) => v / 100;

  const totalDebt = liabilities.reduce(
    (sum, l) => sum + Math.abs(Number(l.balance)),
    0,
  );
  const burnRate = settings?.runwayBurnRate
    ? Number(settings.runwayBurnRate)
    : params.burnRate;
  const emergencyFundTarget = burnRate * params.ssoMonths;
  const efPercent =
    liquid > 0 && emergencyFundTarget > 0
      ? Math.min(100, Math.round((liquid / emergencyFundTarget) * 100))
      : 0;

  const metrics: Array<{
    id: string;
    label: string;
    value: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    trend: "up" | "down" | "neutral";
    action?: {
      label: string;
      onClick: () => void;
      icon: React.ElementType;
    };
  }> = [
    {
      id: "metric-net-worth",
      label: "Net Worth",
      value: fmtCurrency(toTHB(nw)),
      description: "Total assets minus debt",
      icon: TrendingUp,
      color: "var(--intent-success)",
      bgColor: "var(--intent-success-muted)",
      trend: "up",
    },
    {
      id: "metric-liquid-capital",
      label: "Liquid Capital",
      value: fmtCurrency(toTHB(liquid)),
      description: "Available for deployment",
      icon: Wallet,
      color: "var(--intent-info)",
      bgColor: "var(--intent-info-muted)",
      trend: "neutral",
    },
    {
      id: "metric-runway",
      label: "Financial Runway",
      value: `${runway} Months`,
      description: `At ${fmtCurrency(toTHB(burnRate))}/mo burn`,
      icon: Clock,
      color: "var(--intent-warning)",
      bgColor: "var(--intent-warning-muted)",
      trend: "neutral",
    },
    {
      id: "metric-ef",
      label: "Emergency Fund",
      value: `${efPercent}%`,
      description: `Of ${params.ssoMonths} month target`,
      icon: Target,
      color: "var(--intent-danger)",
      bgColor: "var(--intent-danger-muted)",
      trend: "neutral",
    },
    {
      id: "metric-debt",
      label: "Total Debt",
      value: fmtCurrency(toTHB(totalDebt)),
      description: "Total active liabilities",
      icon: CreditCard,
      color: "var(--intent-danger)",
      bgColor: "var(--intent-danger-muted)",
      trend: "down",
    },
  ];

  // Asset distribution for pie chart
  const assetPieData = [
    {
      name: "Liquid",
      value: toTHB(sumByType(accounts, CapitalAssetType.LIQUID)),
      color: "var(--cos-chart-1)",
      fill: "#10b981",
    },
    {
      name: "Semi-Liquid",
      value: toTHB(sumByType(accounts, CapitalAssetType.SEMI_LIQUID)),
      color: "var(--cos-chart-3)",
      fill: "#8b5cf6",
    },
    {
      name: "Investment",
      value: toTHB(sumByType(accounts, CapitalAssetType.INVESTMENT)),
      color: "var(--cos-chart-4)",
      fill: "#f59e0b",
    },
    {
      name: "Fixed Assets",
      value: toTHB(sumByType(accounts, CapitalAssetType.FIXED_ASSET)),
      color: "var(--cos-chart-2)",
      fill: "#3b82f6",
    },
    {
      name: "Goal Funds",
      value: toTHB(sumByType(accounts, CapitalAssetType.GOAL_FUND)),
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

  const sourceLabel = isMockData
    ? "Sources: Mock Data"
    : `As of: ${lastSynced ? fmtDate(lastSynced) + " " + fmtTime(lastSynced) : "—"}`;

  return (
    <div className="flex flex-col">
      <CapitalOSHeader
        title="Dashboard"
        subtitle={`${sourceLabel}`}
      />

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* ── Data Source Indicator + Sync ────────────── */}
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
              {isMockData
                ? "Using mock data — sync YNAB to load real data"
                : "Live data from database"}
            </span>
          </div>
          <SyncButton onSyncComplete={refresh} />
        </div>

        {/* ── Dual-Source NW Banner (v4) ─────────────── */}
        {dualSourceEnabled && (
          <div className="rounded-xl border p-4" style={{
            background: "var(--cos-surface)",
            borderColor: "var(--intent-accent)",
          }}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--intent-accent)" }}>
                Dual-Source NW
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                <span className="font-bold" style={{ color: "var(--intent-accent)" }}>
                  {fmtCurrency(toTHB(nw + (saTotal * 100) - (mappingConfig.filter(m => m.role === CapitalMappingRole.SA_COVERED).length > 0 ? 
                    accounts.filter(a => mappingConfig.find(m => m.ynabAccId === a.externalId && m.role === CapitalMappingRole.SA_COVERED)).reduce((s, a) => s + Number(a.balance), 0) : 0)))}
                </span>
                <span style={{ color: "var(--cos-text-3)" }}>=</span>
                <span style={{ color: "var(--intent-accent)" }}>
                  SA {fmtCurrency(toTHB(saTotal * 100))}
                </span>
                <span style={{ color: "var(--cos-text-3)" }}>+</span>
                <span style={{ color: "var(--intent-info)" }}>
                  YNAB {fmtCurrency(toTHB(accounts.filter(a => {
                    const m = mappingConfig.find(mc => mc.ynabAccId === a.externalId);
                    return !m || m.role === CapitalMappingRole.YNAB_ONLY;
                  }).reduce((s, a) => s + Number(a.balance), 0)))}
                </span>
                <span style={{ color: "var(--cos-text-3)" }}>−</span>
                <span style={{ color: "var(--intent-danger)" }}>
                  Debt {fmtCurrency(toTHB(totalDebt))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── KPI Cards ──────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.id}
              id={m.id}
              className="rounded-xl border p-4 transition-all duration-200 hover:translate-y-[-2px]"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-subtle)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
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
              <div className="text-xl font-bold sm:text-2xl" style={{ fontFamily: 'var(--font-mono)' }}>{m.value}</div>
              <p
                className="mt-1 flex items-center gap-1 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {m.trend === "up" && (
                  <ArrowUpRight
                    className="h-3 w-3"
                    style={{ color: "var(--intent-success)" }}
                  />
                )}
                {m.trend === "down" && (
                  <ArrowDownRight
                    className="h-3 w-3"
                    style={{ color: "var(--intent-danger)" }}
                  />
                )}
                {m.description}
              </p>
              {lastSynced && (
                <p
                  className="mt-1 text-[10px]"
                  style={{ color: "var(--text-tertiary)" }}
                  title={`Data synced: ${lastSynced.toLocaleString()}`}
                >
                  Synced: {lastSynced.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                </p>
              )}
              {"action" in m && m.action && (
                <button
                  id={`${m.id}-action`}
                  onClick={m.action.onClick}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white/5 active:scale-95"
                  style={{
                    borderColor: "var(--cos-border-subtle)",
                    color: "var(--cos-text-2)",
                  }}
                >
                  <m.action.icon className="h-3 w-3" />
                  {m.action.label}
                </button>
              )}
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
              <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
                24-month projection based on current parameters
              </p>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              {(
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
                      tickFormatter={(v) => `${Math.round(v / 1000)}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        borderRadius: "8px",
                        color: "#f9fafb",
                        fontSize: "12px",
                      }}
                      formatter={(
                        value:
                          | string
                          | number
                          | readonly (string | number)[]
                          | undefined,
                      ) => [
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
              )}
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
              <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
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
                    formatter={(
                      value:
                        | string
                        | number
                        | readonly (string | number)[]
                        | undefined,
                    ) => [value ? fmtCurrency(Number(value)) : "-", undefined]}
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
              <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
                High-interest tracking and payoff strategy
              </p>
            </div>
            <div className="space-y-3">
              {liabilities.map((l) => (
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
                        style={{ color: "var(--text-tertiary)" }}
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

          {/* Action Required */}
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
                Action Required
              </h2>
              <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>
                Prioritized financial actions based on your data
              </p>
            </div>
            <div className="space-y-4">
              {(() => {
                const actions = [];
                // 1. Credit card debt
                liabilities.forEach((l) => {
                  if (
                    Math.abs(Number(l.balance)) > 0 &&
                    l.apr &&
                    Number(l.apr) > 0
                  ) {
                    actions.push({
                      id: `action-liab-${l.id}`,
                      icon: CreditCard,
                      color: "var(--cos-negative)",
                      bg: "rgba(239, 68, 68, 0.12)",
                      title: `Pay down ${l.name}`,
                      body: `You are carrying ${fmtCurrency(toTHB(Math.abs(Number(l.balance))))} at ${l.apr}% APR. Paying this off immediately improves net worth trajectory.`,
                    });
                  }
                });

                // 2. Underfunded Goals past deadline
                goals.forEach((g) => {
                  if (
                    g.current < g.target &&
                    g.deadline &&
                    new Date(g.deadline) < new Date()
                  ) {
                    actions.push({
                      id: `action-goal-${g.id}`,
                      icon: Target,
                      color: "var(--cos-warning)",
                      bg: "var(--cos-warning-muted)",
                      title: `Goal Deadline Passed: ${g.name}`,
                      body: `This goal is underfunded by ${fmtCurrency(toTHB(Number(g.target) - Number(g.current)))} but the deadline has passed. Please update the deadline or allocate funds.`,
                    });
                  }
                });

                // 3. Low runway
                if (runway < 6) {
                  actions.push({
                    id: `action-runway`,
                    icon: Clock,
                    color: runway < 3 ? "var(--cos-negative)" : "var(--cos-warning)",
                    bg: runway < 3 ? "rgba(239, 68, 68, 0.12)" : "var(--cos-warning-muted)",
                    title: runway < 3 ? `Critical Runway` : `Low Runway`,
                    body: `Your runway is ${runway} months. Aim for at least 6 months of liquid capital coverage.`,
                  });
                }

                // 4. Emergency fund gap
                if (efPercent < 100) {
                  const gap = emergencyFundTarget - liquid;
                  actions.push({
                    id: `action-ef`,
                    icon: Target,
                    color: efPercent < 50 ? "var(--cos-negative)" : "var(--cos-warning)",
                    bg: efPercent < 50 ? "rgba(239, 68, 68, 0.12)" : "var(--cos-warning-muted)",
                    title: `Emergency Fund Gap`,
                    body: `At ${efPercent}% of target. Need ${fmtCurrency(toTHB(gap))} more to reach ${params.ssoMonths}-month runway coverage.`,
                  });
                }

                // 5. Goal velocity warnings (approaching deadline, insufficient velocity)
                goals.forEach((g) => {
                  if (g.deadline && g.current < g.target) {
                    const daysToDeadline = Math.floor(
                      (new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const monthsToDeadline = Math.max(daysToDeadline / 30, 1);
                    const remaining = Number(g.target) - Number(g.current);
                    const monthlyNeeded = remaining / monthsToDeadline;
                    // Simple heuristic: if need > ฿10K/mo and deadline < 6 months, flag it
                    if (daysToDeadline > 0 && daysToDeadline < 180 && monthlyNeeded > 1000000) {
                      actions.push({
                        id: `action-goal-velocity-${g.id}`,
                        icon: TrendingUp,
                        color: "var(--cos-warning)",
                        bg: "var(--cos-warning-muted)",
                        title: `Goal Velocity: ${g.name}`,
                        body: `Need ${fmtCurrency(toTHB(monthlyNeeded))}/mo to hit target by deadline (${Math.ceil(monthsToDeadline)} months left).`,
                      });
                    }
                  }
                });

                // 6. Data staleness (mock data or old sync)
                if (isMockData) {
                  actions.push({
                    id: `action-stale-mock`,
                    icon: Database,
                    color: "var(--cos-warning)",
                    bg: "var(--cos-warning-muted)",
                    title: `Using Mock Data`,
                    body: `Dashboard is showing synthetic data. Connect YNAB to load your real financial data.`,
                  });
                } else if (lastSynced) {
                  const daysSinceSync = Math.floor(
                    (new Date().getTime() - new Date(lastSynced).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  if (daysSinceSync > 7) {
                    actions.push({
                      id: `action-stale-sync`,
                      icon: Database,
                      color: "var(--cos-warning)",
                      bg: "var(--cos-warning-muted)",
                      title: `Data Stale`,
                      body: `Last sync was ${daysSinceSync} days ago. Refresh data for accurate insights.`,
                    });
                  }
                }

                // 7. High APR debt prioritized
                liabilities
                  .filter((l) => l.apr && Number(l.apr) > 15 && Number(l.balance) < 0)
                  .forEach((l) => {
                    actions.push({
                      id: `action-high-apr-${l.id}`,
                      icon: CreditCard,
                      color: "var(--cos-negative)",
                      bg: "rgba(239, 68, 68, 0.12)",
                      title: `High APR Debt: ${l.name}`,
                      body: `${l.apr}% APR is expensive. Pay off ${fmtCurrency(toTHB(Math.abs(Number(l.balance))))} immediately for guaranteed ${l.apr}% return.`,
                    });
                  });

                if (actions.length === 0) {
                  return (
                    <div className="flex h-32 flex-col items-center justify-center text-center">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--cos-positive)" }}
                      >
                        All good!
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        No pending actions required.
                      </p>
                    </div>
                  );
                }

                return actions.slice(0, 4).map((insight) => (
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
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {insight.body}
                      </p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>

      <RunwaySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentBurnRate={settings?.runwayBurnRate ?? params.burnRate}
        currentAccountIds={settings?.runwayAccountIds ?? []}
        accounts={accounts}
        onSave={async (burnRate, accountIds) => {
          await updateSettings({
            runwayBurnRate: burnRate,
            runwayAccountIds: accountIds,
          });
        }}
      />
    </div>
  );
}
