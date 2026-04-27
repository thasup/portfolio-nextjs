/**
 * Status + category chips used across the app surface.
 *
 * Status colours match the pre-React mockup spec:
 *   open      → blue tile
 *   active    → peach tile
 *   completed → soft green
 *   draft     → neutral
 *
 * Category colours follow the same low-saturation tile scheme.
 */
import { type Category, type MissionStatus } from '@/lib/marketos/types';

const STATUS: Record<
  MissionStatus,
  { bg: string; label: string }
> = {
  open: { bg: '#b9d9e0', label: 'Open' },
  active: { bg: '#f6d9a3', label: 'Active' },
  delivered: { bg: '#d1c4e9', label: 'Delivered' },
  completed: { bg: '#c8e6c9', label: 'Completed' },
  cancelled: { bg: 'rgba(30,58,47,0.08)', label: 'Cancelled' },
};

export function StatusChip({ status }: { status: MissionStatus }) {
  const s = STATUS[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 12,
        background: s.bg,
        fontSize: 12,
        fontWeight: 600,
        color: '#1e3a2f',
        fontFamily: 'var(--font-dm-sans), sans-serif',
      }}
    >
      {s.label}
    </span>
  );
}

const CAT_COLOR: Record<Category, string> = {
  Design: 'rgba(185,217,224,0.5)',
  Research: 'rgba(246,217,163,0.6)',
  Engineering: 'rgba(200,230,201,0.6)',
  Marketing: 'rgba(242,168,75,0.18)',
  HR: 'rgba(196,85,77,0.12)',
  Operations: 'rgba(122,127,121,0.18)',
};

export function CatChip({ cat }: { cat: Category }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 9px',
        borderRadius: 6,
        background: CAT_COLOR[cat],
        fontSize: 12,
        fontWeight: 500,
        color: '#1e3a2f',
        fontFamily: 'var(--font-dm-sans), sans-serif',
      }}
    >
      {cat}
    </span>
  );
}

const TIER_COLOR: Record<string, string> = {
  bronze: 'rgba(180,123,69,0.18)',
  silver: 'rgba(122,127,121,0.18)',
  gold: 'rgba(242,168,75,0.2)',
  platinum: 'rgba(73,184,218,0.22)',
  diamond: 'rgba(170,200,255,0.32)',
};

export function TierChip({ tier }: { tier: string }) {
  const key = tier.toLowerCase();
  const label = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 10,
        background: TIER_COLOR[key] ?? 'rgba(30,58,47,0.06)',
        fontSize: 12,
        fontWeight: 700,
        color: '#1e3a2f',
        fontFamily: 'var(--font-dm-sans), sans-serif',
      }}
    >
      {label}
    </span>
  );
}
