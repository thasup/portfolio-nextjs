"use client";

/**
 * CapitalOS header bar.
 *
 * Shows page title breadcrumb, sync status indicator,
 * and last-updated timestamp.
 */
import { Wifi } from "lucide-react";
import { fmtDate, fmtTime } from "@/lib/capital-os/format";

interface StatusBadge {
  label: string;
  variant?: "success" | "warning" | "info" | "neutral";
}

interface CapitalOSHeaderProps {
  title: string;
  subtitle?: string;
  badges?: StatusBadge[];
}

const BADGE_STYLES: Record<NonNullable<StatusBadge["variant"]>, { bg: string; color: string }> = {
  success: { bg: "var(--intent-success-muted)", color: "var(--intent-success)" },
  warning: { bg: "var(--intent-warning-muted)", color: "var(--intent-warning)" },
  info:    { bg: "var(--intent-info-muted)",    color: "var(--intent-info)" },
  neutral: { bg: "var(--cos-surface-2)",         color: "var(--cos-text-2)" },
};

export function CapitalOSHeader({ title, subtitle, badges }: CapitalOSHeaderProps) {
  const now = new Date();

  return (
    <header
      id="capital-os-header"
      className="flex items-center justify-between border-b px-6 py-4"
      style={{
        borderColor: "var(--cos-border-subtle)",
        background: "var(--cos-surface)",
      }}
    >
      <div className="flex flex-col gap-0.5">
        <h1
          id="capital-os-page-title"
          className="text-xl font-bold tracking-tight sm:text-2xl"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--cos-text-2)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Optional status badges */}
        {badges?.map((badge, i) => {
          const style = BADGE_STYLES[badge.variant ?? "neutral"];
          return (
            <span
              key={i}
              className="hidden sm:inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold"
              style={{ background: style.bg, color: style.color }}
            >
              {badge.label}
            </span>
          );
        })}

        {/* Sync status */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
          style={{
            background: "var(--cos-accent-muted)",
            color: "var(--cos-accent)",
          }}
        >
          <Wifi className="h-3 w-3" />
          <span className="hidden sm:inline">Connected</span>
        </div>

        {/* Timestamp */}
        <span
          className="hidden text-xs md:inline"
          style={{ color: "var(--cos-text-3)" }}
        >
          Updated: {fmtDate(now)} · {fmtTime(now)}
        </span>
      </div>
    </header>
  );
}
