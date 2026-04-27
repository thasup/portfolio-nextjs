'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

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
        <path d="M2 5h12v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" stroke="currentColor" strokeWidth="1.5" />
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
        <path d="M2 9V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5" stroke="currentColor" strokeWidth="1.5" />
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
 * Active-link highlighter for the MarketOS sidebar. Kept as a thin
 * client component so the parent `Sidebar` can stay a server component
 * and fetch pool data without dragging the whole sidebar tree to the
 * client bundle.
 */
export function SidebarNav() {
  const pathname = usePathname() ?? '';
  return (
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
  );
}
