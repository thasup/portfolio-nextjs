"use client";

/**
 * Insight List sidebar component.
 *
 * Shows all active insights with severity badges.
 * Click to view detail.
 */
import { Card } from "@/components/prototypes/capital-os/ui/Card";
import { SectionLabel } from "@/components/prototypes/capital-os/ui/SectionLabel";
import { Badge } from "@/components/prototypes/capital-os/ui/Badge";

export type InsightSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO" | "LOW";
export type InsightAgent = "ACCOUNTANT" | "ANALYST" | "ADVISOR" | "STRATEGIST";

export interface Insight {
  id: number;
  agent: InsightAgent;
  severity: InsightSeverity;
  icon: string;
  title: string;
  body: string;
  action: string;
  actionType: "task" | "capital" | "plan" | "decision" | "review";
}

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

interface InsightListProps {
  insights: Insight[];
  activeInsightId: number | null;
  onSelect: (id: number) => void;
}

export function InsightList({
  insights,
  activeInsightId,
  onSelect,
}: InsightListProps) {
  const criticalCount = insights.filter((i) =>
    ["CRITICAL", "HIGH"].includes(i.severity)
  ).length;

  return (
    <Card>
      <SectionLabel>
        All Insights · {insights.length} active
        {criticalCount > 0 && (
          <span className="ml-2 text-[var(--cos-negative)]">
            ({criticalCount} critical)
          </span>
        )}
      </SectionLabel>

      <div className="flex flex-col gap-1.5">
        {insights.map((insight) => {
          const isActive = activeInsightId === insight.id;
          const color = SEV_COLOR[insight.severity];
          const bg = SEV_BG[insight.severity];

          return (
            <button
              key={insight.id}
              onClick={() => onSelect(insight.id)}
              className="flex gap-2 items-start p-2.5 rounded-lg text-left transition-all border"
              style={{
                background: isActive ? bg : "transparent",
                borderColor: isActive
                  ? `${color}40`
                  : "var(--cos-border-subtle)",
                borderLeftWidth: 2,
                borderLeftColor: color,
              }}
            >
              <span className="text-base shrink-0">{insight.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[var(--cos-text)] truncate">
                  {insight.title}
                </div>
                <div className="flex gap-1.5 mt-1">
                  <Badge
                    label={insight.severity}
                    color={color}
                    bg={bg}
                    border={`${color}40`}
                  />
                  <Badge label={insight.agent} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
