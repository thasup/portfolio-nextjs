"use client";

/**
 * Weekly Financial Digest component.
 *
 * Summarizes key changes from the past week and the top recommendation.
 */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/prototypes/capital-os/ui/Card";
import { SectionLabel } from "@/components/prototypes/capital-os/ui/SectionLabel";
import { Badge } from "@/components/prototypes/capital-os/ui/Badge";
import { Mono } from "@/components/prototypes/capital-os/ui/Mono";
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react";

export interface DigestChange {
  label: string;
  value: string;
  positive: boolean;
}

interface WeeklyDigestProps {
  changes: DigestChange[];
  topAction: string;
  weekRange?: string;
}

export function WeeklyDigest({
  changes,
  topAction,
  weekRange = "Week of Apr 28 – May 2, 2026",
}: WeeklyDigestProps) {
  return (
    <Card accent="var(--cos-accent)">
      <div className="flex items-center gap-3 mb-3">
        <Shield className="h-5 w-5 text-[var(--cos-accent)]" />
        <div>
          <div className="text-sm font-semibold text-[var(--cos-text)]">
            Weekly Financial Digest
          </div>
          <div className="text-[10px] text-[var(--cos-text-2)] font-mono tracking-wide">
            {weekRange}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {changes.map((c, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-1.5 border-b border-[var(--cos-border-subtle)] last:border-0"
          >
            <span className="text-xs text-[var(--cos-text-1)]">{c.label}</span>
            <Mono
              size={12}
              color={c.positive ? "var(--cos-positive)" : "var(--cos-negative)"}
            >
              {c.value}
            </Mono>
          </div>
        ))}
      </div>

      <div
        className="p-3 rounded-lg border"
        style={{
          background: "var(--cos-accent-muted)",
          borderColor: "var(--cos-accent-border)",
        }}
      >
        <div className="text-[9px] text-[var(--cos-accent)] font-mono tracking-widest uppercase mb-1.5">
          Top Recommendation
        </div>
        <div className="text-xs text-[var(--cos-text)] leading-relaxed">
          {topAction}
        </div>
      </div>
    </Card>
  );
}
