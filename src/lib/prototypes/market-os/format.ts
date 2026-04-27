/**
 * MarketOS prototype — display formatters.
 */

export function fmtBudget(n: number): string {
  return '$' + n.toLocaleString();
}

export function fmtBudgetCompact(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'k';
  return '$' + n;
}

export function fmtDate(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtDateLong(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function fmtRelative(iso: string): string {
  const dt = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - dt;
  const min = Math.round(diffMs / 60_000);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return fmtDate(iso);
}
