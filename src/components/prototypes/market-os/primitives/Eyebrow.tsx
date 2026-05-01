import type { CSSProperties, ReactNode } from 'react';

/**
 * The "ALL CAPS micro-label" used above every section heading on the
 * landing surface. Set `light` for use over the dark green sections.
 */
export function Eyebrow({
  children,
  light = false,
  style,
}: {
  children: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        color: light ? 'rgba(249,247,246,0.45)' : 'rgba(30,58,47,0.45)',
        margin: '0 0 12px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function H2({
  children,
  light = false,
  center = false,
  style,
}: {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
  style?: CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-bricolage), sans-serif',
        fontWeight: 800,
        fontSize: 48,
        lineHeight: 1.05,
        letterSpacing: '-0.035em',
        color: light ? '#f9f7f6' : '#1e3a2f',
        margin: '0 0 24px',
        textAlign: center ? 'center' : 'left',
        ...style,
      }}
    >
      {children}
    </h2>
  );
}
