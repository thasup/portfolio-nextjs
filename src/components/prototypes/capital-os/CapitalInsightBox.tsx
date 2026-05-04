"use client";

/**
 * CapitalOS Insight Box
 *
 * Inline contextual insight display — used throughout all CapitalOS pages.
 * Driven by the pure-computation insight engine in @/lib/capital-os/insights.ts.
 */

import { Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CapitalOSInsight, InsightLevel } from "@/lib/capital-os/insights";

// ── Level config ─────────────────────────────────────────────────

interface LevelConfig {
  bg: string;
  borderColor: string;
  textColor: string;
  metricColor: string;
  Icon: typeof Info;
}

const LEVEL_CONFIG: Record<InsightLevel, LevelConfig> = {
  success: {
    bg: "bg-[var(--cos-positive-muted,rgba(34,197,94,0.08))]",
    borderColor: "var(--cos-positive)",
    textColor: "var(--cos-positive)",
    metricColor: "var(--cos-positive)",
    Icon: CheckCircle2,
  },
  warning: {
    bg: "bg-[var(--cos-warning-muted,rgba(234,179,8,0.08))]",
    borderColor: "var(--cos-warning)",
    textColor: "var(--cos-warning)",
    metricColor: "var(--cos-warning)",
    Icon: AlertTriangle,
  },
  info: {
    bg: "bg-[var(--cos-info-muted,rgba(99,102,241,0.08))]",
    borderColor: "var(--cos-info)",
    textColor: "var(--cos-info)",
    metricColor: "var(--cos-info)",
    Icon: Info,
  },
  critical: {
    bg: "bg-red-500/10",
    borderColor: "rgb(239 68 68 / 0.4)",
    textColor: "rgb(248 113 113)",
    metricColor: "rgb(248 113 113)",
    Icon: AlertCircle,
  },
};

// ── Single insight box ────────────────────────────────────────────

interface CapitalInsightBoxProps {
  insight: CapitalOSInsight;
  /** Hides the body text — shows only title + metric */
  compact?: boolean;
  className?: string;
}

export function CapitalInsightBox({
  insight,
  compact = false,
  className,
}: CapitalInsightBoxProps) {
  const cfg = LEVEL_CONFIG[insight.level];

  return (
    <div
      className={cn("rounded-xl border p-4 space-y-1.5", cfg.bg, className)}
      style={{ borderColor: cfg.borderColor + (insight.level === "success" ? "4d" : "66") }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 shrink-0" style={{ color: cfg.textColor }} />
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: cfg.textColor, opacity: 0.7 }}
          >
            CapitalOS Insight
          </span>
        </div>
        {insight.metric && (
          <span
            className="text-xs font-bold tabular-nums shrink-0"
            style={{ color: cfg.metricColor }}
          >
            {insight.metric}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold" style={{ color: cfg.textColor }}>
        {insight.title}
      </p>

      {/* Body (hidden in compact mode) */}
      {!compact && (
        <p className="text-xs leading-relaxed" style={{ color: cfg.textColor, opacity: 0.75 }}>
          {insight.body}
        </p>
      )}
    </div>
  );
}

// ── Multi-insight list ────────────────────────────────────────────

interface CapitalInsightListProps {
  insights: CapitalOSInsight[];
  /** Cap visible items; shows "+N more" when exceeded */
  maxShow?: number;
  compact?: boolean;
  className?: string;
}

export function CapitalInsightList({
  insights,
  maxShow,
  compact = false,
  className,
}: CapitalInsightListProps) {
  if (insights.length === 0) return null;

  const shown = maxShow ? insights.slice(0, maxShow) : insights;
  const remaining = insights.length - shown.length;

  return (
    <div className={cn("space-y-3", className)}>
      {shown.map((insight) => (
        <CapitalInsightBox
          key={insight.id}
          insight={insight}
          compact={compact}
        />
      ))}
      {remaining > 0 && (
        <p
          className="text-xs text-center"
          style={{ color: "var(--cos-text-3)" }}
        >
          +{remaining} more insight{remaining > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
