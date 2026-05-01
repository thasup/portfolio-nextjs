"use client";

/**
 * CapitalOS header bar.
 *
 * Shows page title breadcrumb, sync status indicator,
 * and last-updated timestamp.
 */
import { Wifi } from "lucide-react";
import { fmtDate, fmtTime } from "@/lib/capital-os/format";

interface CapitalOSHeaderProps {
  title: string;
  subtitle?: string;
}

export function CapitalOSHeader({ title, subtitle }: CapitalOSHeaderProps) {
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

      <div className="flex items-center gap-4">
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
