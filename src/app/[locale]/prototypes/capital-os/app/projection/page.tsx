"use client";

import { useState } from "react";
import { Settings2, TrendingUp, AlertCircle, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import { CapitalScenarioMode } from "@/lib/capital-os/types";
import { MOCK_ACCOUNTS, MOCK_LIABILITIES } from "@/lib/capital-os/mock-data";
import { computeProjection } from "@/lib/capital-os/projection";
import { fmtCurrency } from "@/lib/capital-os/format";

export default function ProjectionPage() {
  const [params, setParams] = useState({
    burnRate: 2500000,
    ssoMonths: 6,
    investReturn: 8,
    missionSuccessMonth: 4,
    postSuccessIncome: 8000000,
    scenarioMode: CapitalScenarioMode.BASE,
  });

  const projection = computeProjection(params, MOCK_ACCOUNTS, MOCK_LIABILITIES);
  const toTHB = (v: number) => v / 100;

  const chartData = projection.points.map((p) => ({
    ...p,
    netWorth: toTHB(p.netWorth),
    liquid: toTHB(p.liquid),
    portfolio: toTHB(p.portfolio),
  }));

  const scenarios: { mode: CapitalScenarioMode; label: string }[] = [
    { mode: CapitalScenarioMode.CONSERVATIVE, label: "Low" },
    { mode: CapitalScenarioMode.BASE, label: "Base" },
    { mode: CapitalScenarioMode.OPTIMISTIC, label: "High" },
  ];

  const sliders = [
    { id: "slider-burn-rate", label: "Monthly Burn Rate", value: params.burnRate, display: fmtCurrency(toTHB(params.burnRate)), min: 1500000, max: 6000000, step: 100000, key: "burnRate" as const },
    { id: "slider-invest-return", label: "Investment Return", value: params.investReturn, display: `${params.investReturn}%`, min: 2, max: 25, step: 0.5, key: "investReturn" as const },
    { id: "slider-mission-month", label: "Mission Success Month", value: params.missionSuccessMonth, display: `Month ${params.missionSuccessMonth}`, min: 1, max: 12, step: 1, key: "missionSuccessMonth" as const },
    { id: "slider-post-income", label: "Post-Success Income", value: params.postSuccessIncome, display: fmtCurrency(toTHB(params.postSuccessIncome)), min: 3000000, max: 30000000, step: 500000, key: "postSuccessIncome" as const },
  ];

  const tooltipStyle = { backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "8px", color: "#f9fafb", fontSize: "12px" };

  return (
    <div className="flex flex-col">
      <CapitalOSHeader title="Growth Projection" subtitle="Model your future wealth based on different scenarios and milestones" />
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Chart Area */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div id="chart-projection" className="rounded-xl border p-4 sm:p-6" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              <div className="mb-4">
                <h2 className="text-base font-semibold sm:text-lg">Wealth Trajectory</h2>
                <p className="text-xs" style={{ color: "var(--cos-text-2)" }}>24-month net worth and liquidity projection</p>
              </div>
              <div className="h-[350px] w-full sm:h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="projGradNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="projGradLiq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="label" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                    
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: string | number | readonly (string | number)[] | undefined) => [
                        typeof value === "number" ? fmtCurrency(value) : String(value || ""),
                        "",
                      ]}
                    />
                    <ReferenceLine x={chartData[params.missionSuccessMonth]?.label} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Mission Success", position: "top", fill: "#ef4444", fontSize: 10, fontWeight: "bold" }} />
                    <Area type="monotone" dataKey="netWorth" name="Net Worth" stroke="#10b981" fill="url(#projGradNet)" strokeWidth={2} />
                    <Area type="monotone" dataKey="liquid" name="Liquid Capital" stroke="#3b82f6" fill="url(#projGradLiq)" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div id="projection-2yr-value" className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)", borderLeft: "4px solid var(--cos-accent)" }}>
                <div className="mb-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" style={{ color: "var(--cos-accent)" }} />
                  <span className="text-xs" style={{ color: "var(--cos-text-2)" }}>Projected 2-Year Value</span>
                </div>
                <p className="text-xl font-bold sm:text-2xl">{fmtCurrency(toTHB(projection.points[projection.points.length - 1].netWorth))}</p>
              </div>
              <div id="projection-min-liquid" className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)", borderLeft: "4px solid var(--cos-negative)" }}>
                <div className="mb-1 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" style={{ color: "var(--cos-negative)" }} />
                  <span className="text-xs" style={{ color: "var(--cos-text-2)" }}>Minimum Liquid Reserve</span>
                </div>
                <p className="text-xl font-bold sm:text-2xl" style={{ color: "var(--cos-negative)" }}>{fmtCurrency(toTHB(Math.min(...projection.points.map((p) => p.liquid))))}</p>
              </div>
            </div>
          </div>
          {/* Sidebar Controls */}
          <div className="lg:col-span-4">
            <div id="panel-controls" className="sticky top-6 rounded-xl border p-4 sm:p-6" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              <div className="mb-6 flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                <h2 className="text-base font-semibold">Simulator Controls</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scenario Mode</label>
                  <div className="grid grid-cols-3 gap-1 rounded-lg p-1" style={{ background: "var(--cos-bg)" }}>
                    {scenarios.map((s) => (
                      <button key={s.mode} id={`scenario-${s.mode.toLowerCase()}`} onClick={() => setParams({ ...params, scenarioMode: s.mode })} className="rounded-md px-3 py-1.5 text-xs font-medium transition-all" style={{ background: params.scenarioMode === s.mode ? "var(--cos-accent)" : "transparent", color: params.scenarioMode === s.mode ? "#fff" : "var(--cos-text-2)" }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {sliders.map((s) => (
                  <div key={s.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{s.label}</label>
                      <span className="text-sm font-bold" style={{ color: "var(--cos-accent)" }}>{s.display}</span>
                    </div>
                    <input id={s.id} type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => setParams({ ...params, [s.key]: Number(e.target.value) })} className="w-full accent-[#10b981]" />
                  </div>
                ))}
                <div className="rounded-lg border p-4" style={{ background: "var(--cos-accent-muted)", borderColor: "rgba(16, 185, 129, 0.2)" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 shrink-0" style={{ color: "var(--cos-accent)" }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--cos-accent)" }}>Strategy Insight</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--cos-text-2)" }}>
                    Moving mission success from Month {params.missionSuccessMonth} to Month {Math.max(1, params.missionSuccessMonth - 1)} could increase your 2-year net worth by approximately {fmtCurrency(toTHB(params.postSuccessIncome))}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
