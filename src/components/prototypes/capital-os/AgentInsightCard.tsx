"use client";

/**
 * CapitalOS v4 — Agent Insight Card
 * 
 * Displays insights from the 4 AI personas:
 * - Analyst (data patterns)
 * - Advisor (action recommendations)
 * - Accountant (reconciliation warnings)
 * - Strategist (long-term projections)
 */

import { useState } from "react";
import type { AgentInsight, CapitalInsightSeverity } from "@/lib/capital-os/types";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Calculator, 
  Target,
  ChevronRight,
  X,
  Lightbulb
} from "lucide-react";

const AGENT_CONFIG: Record<AgentInsight["agent"], { 
  icon: typeof Brain; 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  Analyst: { icon: TrendingUp, color: "var(--intent-info)", bgColor: "var(--intent-info-muted)", label: "Data Analyst" },
  Advisor: { icon: Lightbulb, color: "var(--intent-accent)", bgColor: "var(--intent-accent-muted)", label: "Advisor" },
  Accountant: { icon: Calculator, color: "var(--intent-warning)", bgColor: "var(--intent-warning-muted)", label: "Accountant" },
  Strategist: { icon: Target, color: "var(--intent-success)", bgColor: "var(--intent-success-muted)", label: "Strategist" },
};

const SEVERITY_CONFIG: Record<CapitalInsightSeverity, { 
  borderColor: string; 
  icon: typeof AlertTriangle;
}> = {
  CRITICAL: { borderColor: "var(--intent-danger)", icon: AlertTriangle },
  HIGH: { borderColor: "var(--intent-warning)", icon: AlertTriangle },
  MEDIUM: { borderColor: "var(--intent-accent)", icon: Lightbulb },
  INFO: { borderColor: "var(--cos-border-subtle)", icon: Lightbulb },
};

interface AgentInsightCardProps {
  insight: AgentInsight;
  onDismiss?: () => void;
}

export function AgentInsightCard({ insight, onDismiss }: AgentInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const agentConfig = AGENT_CONFIG[insight.agent];
  const severityConfig = SEVERITY_CONFIG[insight.severity];
  const AgentIcon = agentConfig.icon;

  return (
    <div 
      className="rounded-xl border p-4 transition-all duration-200"
      style={{
        background: "var(--cos-surface)",
        borderColor: insight.severity === "INFO" ? "var(--cos-border-subtle)" : severityConfig.borderColor,
        borderLeftWidth: insight.severity !== "INFO" ? "4px" : "1px",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Agent Avatar */}
        <div 
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: agentConfig.bgColor }}
        >
          <AgentIcon className="h-5 w-5" style={{ color: agentConfig.color }} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: agentConfig.color }}>
              {agentConfig.label}
            </span>
            {insight.severity !== "INFO" && (
              <span 
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ 
                  background: severityConfig.borderColor, 
                  color: "white",
                }}
              >
                {insight.severity}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-medium mt-1">{insight.title}</h4>

          {/* Body */}
          <p className="text-sm mt-1" style={{ color: "var(--cos-text-2)" }}>
            {isExpanded ? insight.body : insight.body.slice(0, 120)}{insight.body.length > 120 && !isExpanded ? "..." : ""}
          </p>

          {/* Action */}
          {insight.action && (
            <div className="mt-3 flex items-center gap-3">
              <a
                href={insight.actionHref || "#"}
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                style={{ color: agentConfig.color }}
              >
                {insight.action}
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Expand/Collapse */}
          {insight.body.length > 120 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs hover:underline"
              style={{ color: "var(--cos-text-3)" }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-[var(--cos-surface-2)] transition-colors"
            style={{ color: "var(--cos-text-3)" }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface AgentInsightsPanelProps {
  insights: AgentInsight[];
}

export function AgentInsightsPanel({ insights }: AgentInsightsPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [filterAgent, setFilterAgent] = useState<AgentInsight["agent"] | "ALL">("ALL");

  const visibleInsights = insights
    .filter(i => !dismissedIds.includes(i.id))
    .filter(i => filterAgent === "ALL" || i.agent === filterAgent);

  const dismiss = (id: string) => setDismissedIds(prev => [...prev, id]);

  const agents: AgentInsight["agent"][] = ["Analyst", "Advisor", "Accountant", "Strategist"];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterAgent("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterAgent === "ALL" ? "" : "hover:bg-[var(--cos-surface-2)]"
          }`}
          style={{
            background: filterAgent === "ALL" ? "var(--cos-accent-muted)" : undefined,
            color: filterAgent === "ALL" ? "var(--cos-accent)" : "var(--cos-text-2)",
          }}
        >
          All ({insights.filter(i => !dismissedIds.includes(i.id)).length})
        </button>
        {agents.map(agent => {
          const count = insights.filter(i => i.agent === agent && !dismissedIds.includes(i.id)).length;
          const config = AGENT_CONFIG[agent];
          return (
            <button
              key={agent}
              onClick={() => setFilterAgent(agent)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterAgent === agent ? "" : "hover:bg-[var(--cos-surface-2)]"
              }`}
              style={{
                background: filterAgent === agent ? config.bgColor : undefined,
                color: filterAgent === agent ? config.color : "var(--cos-text-2)",
              }}
            >
              <config.icon className="h-3.5 w-3.5" />
              {agent} ({count})
            </button>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {visibleInsights.length === 0 ? (
          <div 
            className="rounded-xl border p-6 text-center"
            style={{ background: "var(--cos-surface)", borderColor: "var(--cos-border-subtle)" }}
          >
            <Brain className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--cos-text-3)" }} />
            <p className="text-sm" style={{ color: "var(--cos-text-2)" }}>
              No active insights. Check back later for AI-generated analysis.
            </p>
          </div>
        ) : (
          visibleInsights.map(insight => (
            <AgentInsightCard 
              key={insight.id} 
              insight={insight} 
              onDismiss={() => dismiss(insight.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
