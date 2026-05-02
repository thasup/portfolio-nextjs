"use client";

/**
 * CapitalOS Intelligence page (Redesigned).
 *
 * Weekly Financial Digest + Agent Insights layout.
 * 2-column design: Sidebar (Weekly Digest + Insight List) + Detail Panel.
 */
import { useState, useMemo } from "react";
import { CapitalOSHeader } from "@/components/prototypes/capital-os/layout/CapitalOSHeader";
import {
  WeeklyDigest,
  InsightList,
  InsightDetail,
  type Insight,
  type DigestChange,
} from "@/components/prototypes/capital-os/intelligence";
import { useCapitalData } from "@/lib/capital-os/hooks";
import { CapitalScenarioMode } from "@/lib/capital-os/types";

// Demo insights matching the vision design
const DEMO_INSIGHTS: Insight[] = [
  {
    id: 1,
    agent: "ACCOUNTANT",
    severity: "CRITICAL",
    icon: "🔢",
    title: "Airtable is 217 days stale — ฿395K gap",
    body: "Your Airtable net worth field shows ฿276K. Reality: ฿667K. The April severance was never entered. Every goal progress % in Gaia is computed against a phantom baseline.",
    action: "Update Airtable net worth",
    actionType: "task",
  },
  {
    id: 2,
    agent: "ANALYST",
    severity: "HIGH",
    icon: "📡",
    title: "Credit card debt costs ฿567/month at current APR",
    body: "TTB (฿40,918 × 18% APR) + Shopee (฿4,363 × 15% APR) = ฿567/month in interest. You hold ฿411K liquid. Paying today eliminates this cost permanently. After payoff, liquid drops to ฿366K — still 14.7 months runway.",
    action: "Pay ฿45,281 from KBank",
    actionType: "capital",
  },
  {
    id: 3,
    agent: "ADVISOR",
    severity: "HIGH",
    icon: "🧭",
    title: "Emergency Fund is 7 months overdue at 58.7%",
    body: "Target was Sep 2025. Current: ฿58,688 of ฿100,000. Gap: ฿41,312. At ฿0/month allocated, this never closes. After credit card payoff, allocate ฿8K/month — funded in 5 months.",
    action: "Allocate ฿8K/month to FCD",
    actionType: "plan",
  },
  {
    id: 4,
    agent: "ANALYST",
    severity: "MEDIUM",
    icon: "📡",
    title: "Wedding Fund at 2% with 18-month horizon",
    body: "฿3,000 of ฿150,000. Needs ฿8,167/month to hit target by Dec 2027. Currently receiving ฿0/month. First decision point: is the ฿150K target correct, or is ฿45K (Strategy doc) the real number? Resolve this before allocating.",
    action: "Decide wedding budget",
    actionType: "decision",
  },
  {
    id: 5,
    agent: "STRATEGIST",
    severity: "INFO",
    icon: "🔭",
    title: "SSO income ends in 4 months — plan the transition",
    body: "฿9,000/month × 4 remaining = ฿36,000 additional income. After month 4, burn rate hits ฿25,000 with zero income unless MissionOS revenue starts. Gate 2 (first paying customer) is in 37 days.",
    action: "Review Gate 2 sales plan",
    actionType: "review",
  },
];

export default function IntelligencePage() {
  const { accounts, liabilities, goals, snapshots, lastSynced } = useCapitalData();
  const [activeInsightId, setActiveInsightId] = useState<number | null>(1);
  const [scenarioMode, setScenarioMode] = useState<CapitalScenarioMode>(CapitalScenarioMode.BASE);

  // Compute weekly digest data
  const digestData = useMemo(() => {
    const changes: DigestChange[] = [
      { label: "Net worth change", value: "+฿94,558 (+16.6%)", positive: true },
      { label: "Liquid capital", value: "฿411,700 available", positive: true },
      { label: "Debt status", value: "฿45,281 outstanding", positive: false },
      { label: "Airtable staleness", value: "217 days — CRITICAL", positive: false },
    ];

    return {
      changes,
      topAction:
        "Pay ฿45,281 in credit cards immediately. You save ฿567/month. Runway remains 14.6 months. This is risk-free at your current liquid position.",
    };
  }, []);

  // SA Growth Model projections
  const saGrowthModel = useMemo(() => {
    const baseReturn = 8; // 8% base return
    const conservativeReturn = 5; // 5% conservative
    const optimisticReturn = 12; // 12% optimistic
    const currentSaValue = 610524; // ฿610,524 demo value
    const years = 10;

    const calculateGrowth = (rate: number) => {
      return Array.from({ length: years + 1 }, (_, i) => ({
        year: i,
        value: Math.round(currentSaValue * Math.pow(1 + rate / 100, i)),
      }));
    };

    return {
      conservative: calculateGrowth(conservativeReturn),
      base: calculateGrowth(baseReturn),
      optimistic: calculateGrowth(optimisticReturn),
    };
  }, []);

  const activeInsight =
    DEMO_INSIGHTS.find((i) => i.id === activeInsightId) || null;

  const criticalCount = DEMO_INSIGHTS.filter((i) =>
    ["CRITICAL", "HIGH"].includes(i.severity)
  ).length;

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <CapitalOSHeader
        title="Intelligence"
        subtitle={`${criticalCount} critical insights · ${DEMO_INSIGHTS.length} total · ${scenarioMode} scenario`}
      />

      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="grid gap-4 h-full lg:grid-cols-[340px_1fr_280px]">
          {/* Left sidebar */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            <WeeklyDigest
              changes={digestData.changes}
              topAction={digestData.topAction}
            />
            <InsightList
              insights={DEMO_INSIGHTS}
              activeInsightId={activeInsightId}
              onSelect={setActiveInsightId}
            />
          </div>

          {/* Center detail panel */}
          <div className="overflow-hidden">
            <InsightDetail insight={activeInsight} />
          </div>

          {/* Right panel: SA Growth Model + Scenario */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            {/* Scenario Mode Selector */}
            <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--cos-text-3)" }}>
                Scenario Mode
              </h3>
              <div className="space-y-2">
                {[
                  { mode: CapitalScenarioMode.CONSERVATIVE, label: "Conservative", return: "5%", color: "var(--intent-success)" },
                  { mode: CapitalScenarioMode.BASE, label: "Base Case", return: "8%", color: "var(--intent-info)" },
                  { mode: CapitalScenarioMode.OPTIMISTIC, label: "Optimistic", return: "12%", color: "var(--intent-accent)" },
                ].map(({ mode, label, return: r, color }) => (
                  <button
                    key={mode}
                    onClick={() => setScenarioMode(mode)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                      scenarioMode === mode ? "" : "hover:bg-[var(--cos-surface-2)]"
                    }`}
                    style={{
                      background: scenarioMode === mode ? "var(--cos-surface-2)" : undefined,
                      borderLeft: scenarioMode === mode ? `3px solid ${color}` : "3px solid transparent",
                    }}
                  >
                    <span className={scenarioMode === mode ? "font-medium" : ""} style={{ color: scenarioMode === mode ? color : "var(--cos-text)" }}>
                      {label}
                    </span>
                    <span className="text-xs" style={{ color: "var(--cos-text-3)" }}>{r}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SA Growth Model */}
            <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--cos-text-3)" }}>
                SA Portfolio Growth (10Y)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--cos-text-2)" }}>Conservative</span>
                  <span className="font-mono text-sm" style={{ color: "var(--intent-success)" }}>
                    {fmt(saGrowthModel.conservative[10].value)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--cos-text-2)" }}>Base Case</span>
                  <span className="font-mono text-sm" style={{ color: "var(--intent-info)" }}>
                    {fmt(saGrowthModel.base[10].value)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--cos-text-2)" }}>Optimistic</span>
                  <span className="font-mono text-sm" style={{ color: "var(--intent-accent)" }}>
                    {fmt(saGrowthModel.optimistic[10].value)}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t text-xs" style={{ borderColor: "var(--cos-border-subtle)", color: "var(--cos-text-3)" }}>
                Projected value at Year 10 based on compound growth assumptions.
              </div>
            </div>

            {/* MissionOS Gate Status */}
            <div className="rounded-xl border p-4" style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--cos-text-3)" }}>
                MissionOS Gates
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--intent-success)" }} />
                  <span className="text-sm">Gate 1: Product Launch</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--intent-success)" }}>✓ Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--intent-warning)" }} />
                  <span className="text-sm">Gate 2: First Customer</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--intent-warning)" }}>37 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--cos-border-subtle)" }} />
                  <span className="text-sm" style={{ color: "var(--cos-text-2)" }}>Gate 3: ฿100K MRR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
