"use client";

/**
 * Insight Detail component.
 *
 * Shows selected insight with agent badge, body,
 * contextual visualization, reasoning chain, and action button.
 */
import { Card } from "@/components/prototypes/capital-os/ui/Card";
import { Badge } from "@/components/prototypes/capital-os/ui/Badge";
import { ReasoningChain } from "./ReasoningChain";
import { Insight, InsightSeverity, InsightAgent } from "./InsightList";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, ReferenceLine } from "recharts";

const SEV_COLOR: Record<InsightSeverity, string> = {
  CRITICAL: "var(--cos-negative)",
  HIGH: "var(--cos-warning)",
  MEDIUM: "var(--cos-info)",
  INFO: "var(--cos-positive)",
  LOW: "var(--cos-text-3)",
};

const SEV_BG: Record<InsightSeverity, string> = {
  CRITICAL: "var(--cos-negative-muted)",
  HIGH: "var(--cos-warning-muted)",
  MEDIUM: "var(--cos-info-muted)",
  INFO: "var(--cos-positive-muted)",
  LOW: "rgba(255,255,255,0.03)",
};

// Demo data for contextual visualizations
const interestData = [
  { month: "Month 1", with: 567, without: 0 },
  { month: "Month 6", with: 3402, without: 0 },
  { month: "Month 12", with: 6804, without: 0 },
];

const efScenarioData = [
  { label: "Now", "฿5K/mo": 58688, "฿8K/mo": 58688, "฿10K/mo": 58688 },
  { label: "3 mo", "฿5K/mo": 73688, "฿8K/mo": 82688, "฿10K/mo": 88688 },
  { label: "6 mo", "฿5K/mo": 88688, "฿8K/mo": 106688, "฿10K/mo": 118688 },
];

interface InsightDetailProps {
  insight: Insight | null;
}

export function InsightDetail({ insight }: InsightDetailProps) {
  if (!insight) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[400px]">
        <div className="text-center text-[var(--cos-text-2)]">
          <div className="text-2xl mb-2">✦</div>
          <div className="text-sm">Select an insight to view details</div>
        </div>
      </Card>
    );
  }

  const color = SEV_COLOR[insight.severity];
  const bg = SEV_BG[insight.severity];

  // Determine which contextual visualization to show based on insight ID
  const showInterestChart = insight.id === 2; // Credit card insight
  const showEFScenarioChart = insight.id === 3; // Emergency fund insight

  const tooltipStyle = {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderRadius: "6px",
    color: "#f9fafb",
    fontSize: "11px",
  };

  return (
    <Card className="h-full overflow-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xl">{insight.icon}</span>
          <Badge
            label={`${insight.agent} Agent`}
            color={color}
            bg={bg}
            border={`${color}40`}
          />
          <Badge
            label={insight.severity}
            color={color}
            bg={bg}
            border={`${color}40`}
          />
        </div>
        <h2 className="text-base font-semibold text-[var(--cos-text)] mb-2.5 leading-snug">
          {insight.title}
        </h2>
        <p className="text-sm text-[var(--cos-text-1)] leading-relaxed">
          {insight.body}
        </p>
      </div>

      {/* Contextual Visualization */}
      {showInterestChart && (
        <div className="mb-5">
          <div className="text-[10px] text-[var(--cos-text-2)] font-mono tracking-widest uppercase mb-2">
            Interest Cost Visualization
          </div>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interestData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 9 }}
                  tickFormatter={(v) => "฿" + v}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="with"
                  name="Cumulative interest if not paid"
                  fill="var(--cos-negative)"
                  radius={[4, 4, 0, 0]}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showEFScenarioChart && (
        <div className="mb-5">
          <div className="text-[10px] text-[var(--cos-text-2)] font-mono tracking-widest uppercase mb-2">
            Emergency Fund Funding Scenarios
          </div>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efScenarioData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6b7280", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 9 }}
                  tickFormatter={(v) => "฿" + (v / 1000).toFixed(0) + "K"}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <ReferenceLine
                  y={100000}
                  stroke="var(--cos-warning)"
                  strokeDasharray="4 2"
                  label={{ value: "Target", fill: "var(--cos-warning)", fontSize: 9 }}
                />
                <Line
                  type="monotone"
                  dataKey="฿5K/mo"
                  stroke="var(--cos-text-3)"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="฿8K/mo"
                  stroke="var(--cos-warning)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="฿10K/mo"
                  stroke="var(--cos-positive)"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Reasoning Chain */}
      <div className="mb-5">
        <ReasoningChain />
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all"
          style={{
            background: `${color}18`,
            color: color,
            border: `0.5px solid ${color}40`,
          }}
        >
          {insight.action} →
        </button>
      </div>
    </Card>
  );
}
