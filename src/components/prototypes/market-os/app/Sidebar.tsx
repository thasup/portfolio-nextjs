'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { MkLogo } from '@/components/prototypes/market-os/primitives/MkLogo';
import { POOL } from '@/lib/prototypes/market-os/data';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
};

const APP_BASE = '/prototypes/market-os/app';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  match: (path: string) => boolean;
}

const NAV: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: `${APP_BASE}/dashboard`,
    match: (p) => p.endsWith('/dashboard'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="2" fill="currentColor" opacity=".9" />
        <rect x="9" y="1" width="6" height="6" rx="2" fill="currentColor" opacity=".5" />
        <rect x="1" y="9" width="6" height="6" rx="2" fill="currentColor" opacity=".5" />
        <rect x="9" y="9" width="6" height="6" rx="2" fill="currentColor" opacity=".9" />
      </svg>
    ),
  },
  {
    id: 'missions',
    label: 'Missions',
    href: `${APP_BASE}/missions`,
    match: (p) => /\/missions(\/|$)/.test(p),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'bids',
    label: 'My Bids',
    href: `${APP_BASE}/bids`,
    match: (p) => p.endsWith('/bids'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12L6 4L10 9L13 6L15 12H2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'people',
    label: 'People',
    href: `${APP_BASE}/people`,
    match: (p) => p.endsWith('/people'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
        <path
          d="M1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'pool',
    label: 'Pool',
    href: `${APP_BASE}/pool`,
    match: (p) => p.endsWith('/pool'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 5h12v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M2 5l6-3 6 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'inbox',
    label: 'Inbox',
    href: `${APP_BASE}/inbox`,
    match: (p) => p.endsWith('/inbox'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 9V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M2 9h3l1 2h4l1-2h3v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    href: `${APP_BASE}/profile`,
    match: (p) => p.endsWith('/profile'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    href: `${APP_BASE}/settings`,
    match: (p) => p.endsWith('/settings'),
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 1v2M8 13v2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M1 8h2M13 8h2M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

/**
 * Persistent left sidebar for `/prototypes/market-os/app/*`. Highlights
 * the current route via `usePathname()`. The "Back to landing" affordance
 * mirrors the original mockup's `onBack` button.
 */
export function Sidebar() {
  const pathname = usePathname() ?? '';

  const allocatedPct = Math.round((POOL.missions / POOL.total) * 100);

  return (
    <aside
      style={{
        width: 220,
        background: AC.dark,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px',
        flexShrink: 0,
        height: '100vh',
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        style={{
          padding: '20px 12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          borderBottom: '1px solid rgba(249,247,246,0.07)',
          marginBottom: 8,
        }}
      >
        <MkLogo size={28} variant="app" />
        <span
          style={{
            fontFamily: 'var(--font-bricolage), sans-serif',
            fontWeight: 700,
            fontSize: 17,
            color: 'white',
            letterSpacing: '-0.03em',
          }}
        >
          MarketOS
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`a-sidebar-item${active ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          margin: 'auto 0 12px',
          padding: '16px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 14,
          border: '1px solid rgba(249,247,246,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: 'rgba(249,247,246,0.42)',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              {POOL.period} Pool
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: 'white',
                fontFamily: 'var(--font-bricolage), sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              ${(POOL.total / 1000).toFixed(0)}k
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: AC.orange,
              fontFamily: 'var(--font-dm-sans), sans-serif',
              background: 'rgba(242,168,75,0.15)',
              padding: '3px 8px',
              borderRadius: 8,
            }}
          >
            {POOL.ratio}% rev
          </div>
        </div>
        <div
          style={{
            height: 5,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 3,
            overflow: 'hidden',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${allocatedPct}%`,
              background: `linear-gradient(90deg, ${AC.orange}, #e89a35)`,
              borderRadius: 3,
            }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {([
            ['Missions', `$${(POOL.missions / 1000).toFixed(0)}k`, AC.orange],
            ['Base', `$${(POOL.base / 1000).toFixed(0)}k`, 'rgba(249,247,246,0.45)'],
            ['Free', `$${(POOL.unallocated / 1000).toFixed(0)}k`, 'rgba(185,217,224,0.8)'],
          ] as const).map(([l, v, c]) => (
            <div
              key={l}
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-dm-sans), sans-serif',
                color: 'rgba(249,247,246,0.38)',
              }}
            >
              <span style={{ color: c, fontWeight: 700 }}>{v}</span> {l}
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/prototypes/market-os"
        style={{
          background: 'transparent',
          border: '1px solid rgba(249,247,246,0.1)',
          borderRadius: 8,
          padding: '8px 12px',
          color: 'rgba(249,247,246,0.55)',
          fontSize: 12,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          marginBottom: 16,
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          textDecoration: 'none',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M8 10L4 6L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Back to landing
      </Link>
    </aside>
  );
}
