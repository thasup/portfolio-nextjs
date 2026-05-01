/**
 * CapitalOS formatting helpers.
 *
 * Centralizes currency, date, and percentage formatting
 * to ensure consistency across the entire dashboard.
 */

// ── Currency ────────────────────────────────────────────────────

const thbFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const thbFormatterDecimals = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as THB currency (no decimals by default).
 * Input should be in whole THB (not satangs).
 */
export function fmtCurrency(value: number, decimals = false): string {
  return decimals ? thbFormatterDecimals.format(value) : thbFormatter.format(value);
}

/**
 * Convert satangs to THB for display.
 */
export function satangsToTHB(satangs: number): number {
  return satangs / 100;
}

/**
 * Format satangs as THB currency.
 */
export function fmtSatangs(satangs: number, decimals = false): string {
  return fmtCurrency(satangsToTHB(satangs), decimals);
}

/**
 * Format a number in compact form (e.g. 1.2M, 450K).
 */
export function fmtCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

// ── Dates (European format per user rule: MMM DD, YYYY) ─────────

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/**
 * Format a date string or Date to European format (e.g. "Oct 15, 2025").
 */
export function fmtDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(d);
}

/**
 * Format relative time (e.g. "2 hours ago", "in 3 days").
 */
export function fmtRelative(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 1) {
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return rtf.format(diffMinutes, "minute");
    }
    return rtf.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  if (Math.abs(diffDays) < 365) return rtf.format(Math.round(diffDays / 30), "month");
  return rtf.format(Math.round(diffDays / 365), "year");
}

// ── Time (24-hour format per user rule) ─────────────────────────

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * Format a date to 24-hour time string (e.g. "13:30").
 */
export function fmtTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return timeFormatter.format(d);
}

// ── Percentages ─────────────────────────────────────────────────

/**
 * Format a decimal (0.0–1.0) or whole number as a percentage.
 */
export function fmtPercent(value: number, decimals = 1): string {
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(decimals)}%`;
}

// ── Chart helpers ───────────────────────────────────────────────

/**
 * Format a large number for chart Y-axis labels (e.g. "450K").
 */
export function fmtAxisValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

// ── Month labels ────────────────────────────────────────────────

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;
