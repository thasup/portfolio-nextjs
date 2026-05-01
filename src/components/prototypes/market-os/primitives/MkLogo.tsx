/**
 * MarketOS wordmark — the orange-on-dark "M" peak motif used in the
 * landing nav, sidebar, and app header. Variants:
 *   - landing  : dark badge, orange strokes (default).
 *   - app      : orange badge, white strokes (used inside the app shell).
 */
type Variant = 'landing' | 'app';

export function MkLogo({
  size = 26,
  variant = 'landing',
}: {
  size?: number;
  variant?: Variant;
}) {
  const bg = variant === 'app' ? '#f2a84b' : '#1e3a2f';
  const stroke = variant === 'app' ? '#ffffff' : '#f2a84b';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill={bg} />
      <path
        d="M8 20L14 8L20 20"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16H18"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
