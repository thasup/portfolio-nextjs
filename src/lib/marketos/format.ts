/**
 * MarketOS — display formatters.
 *
 * These are the canonical formatters used by every Server and Client
 * Component under `src/components/prototypes/market-os/`. The mock-era
 * `src/lib/prototypes/market-os/format.ts` is being deleted at the end of
 * Phase 2 (T-210); imports should migrate here.
 *
 * All money helpers accept integer **dollars** (`number`). Cents-to-dollars
 * conversion happens in the query layer (`src/lib/marketos/queries/*`).
 */

export function fmtBudget(dollars: number): string {
  return "$" + dollars.toLocaleString();
}

export function fmtBudgetCompact(dollars: number): string {
  if (dollars >= 1_000_000)
    return "$" + (dollars / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (dollars >= 1_000) return "$" + Math.round(dollars / 1_000) + "k";
  return "$" + dollars;
}

export function fmtDate(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtDateLong(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtRelative(iso: string): string {
  const dt = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - dt;
  const min = Math.round(diffMs / 60_000);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return fmtDate(iso);
}

/**
 * Render a "posted N ago" style label given a creation timestamp.
 * Mirrors the human-readable strings the prototype hard-coded
 * (`'Today'`, `'3 days ago'`, etc.) so the UI doesn't change shape.
 */
export function fmtPostedAgo(iso: string): string {
  const dt = new Date(iso).getTime();
  const day = Math.floor((Date.now() - dt) / (24 * 60 * 60 * 1000));
  if (day <= 0) return "Today";
  if (day === 1) return "1 day ago";
  if (day < 7) return `${day} days ago`;
  if (day < 14) return "1 week ago";
  if (day < 30) return `${Math.floor(day / 7)} weeks ago`;
  return fmtDate(iso);
}
