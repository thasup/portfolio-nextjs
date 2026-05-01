'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { CatChip, StatusChip } from '@/components/prototypes/market-os/primitives/Chips';
import {
  type Category,
  type MissionDTO,
  type MissionStatus,
} from '@/lib/marketos/types';
import { fmtBudget, fmtDate, fmtPostedAgo } from '@/lib/marketos/format';

const AC = {
  dark: '#1e3a2f',
  orange: '#f2a84b',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

type StatusFilter = 'all' | MissionStatus;

export function MissionsView({ missions }: { missions: MissionDTO[] }) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [catFilter, setCatFilter] = useState<'All' | Category>('All');
  const [search, setSearch] = useState('');

  const statusFilters: StatusFilter[] = ['all', 'open', 'active', 'delivered', 'completed'];
  const catFilters: Array<'All' | Category> = [
    'All',
    'Design',
    'Engineering',
    'Research',
    'Marketing',
    'HR',
    'Operations',
  ];

  const filtered = useMemo(
    () =>
      missions.filter((m) => {
        if (filter !== 'all' && m.status !== filter) return false;
        if (catFilter !== 'All' && m.category !== catFilter) return false;
        if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [missions, filter, catFilter, search],
  );

  const openCount = missions.filter((m) => m.status === 'open').length;
  const activeCount = missions.filter(
    (m) => m.status === 'active' || m.status === 'delivered',
  ).length;

  return (
    <AppPage>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 800,
              fontSize: 28,
              color: AC.dark,
              margin: '0 0 4px',
              letterSpacing: '-0.03em',
            }}
          >
            Mission Board
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 14,
              color: 'rgba(30,58,47,0.5)',
              margin: 0,
            }}
          >
            {openCount} open · {activeCount} in progress
          </p>
        </div>
        <Link
          className="a-btn a-btn-primary"
          href="/prototypes/market-os/app/missions/new"
          style={{ height: 42, padding: '0 20px', fontSize: 14 }}
        >
          + Post Mission
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {statusFilters.map((f) => (
          <div
            key={f}
            className={`a-pill-filter${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
            style={{ textTransform: 'capitalize' }}
          >
            {f === 'all' ? 'All status' : f}
          </div>
        ))}
        <div style={{ width: 1, background: AC.border, margin: '0 4px', alignSelf: 'stretch' }} />
        {catFilters.map((f) => (
          <div
            key={f}
            className={`a-pill-filter${catFilter === f ? ' active' : ''}`}
            onClick={() => setCatFilter(f)}
          >
            {f}
          </div>
        ))}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <svg
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <circle cx="6" cy="6" r="4.5" stroke={AC.muted} strokeWidth="1.5" />
              <path d="M10 10L13 13" stroke={AC.muted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="a-search"
              placeholder="Search missions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {filtered.map((m) => (
          <Link
            key={m.id}
            href={`/prototypes/market-os/app/missions/${m.slug}`}
            className="a-mission-card"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <CatChip cat={m.category} />
                <StatusChip status={m.status} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 12,
                  color: AC.muted,
                }}
              >
                {fmtPostedAgo(m.postedAt)}
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: AC.dark,
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {m.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13.5,
                color: 'rgba(30,58,47,0.6)',
                lineHeight: 1.55,
                margin: '0 0 16px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {m.description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: `1px solid ${AC.border}`,
              }}
            >
              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 11,
                      color: AC.muted,
                      marginBottom: 1,
                    }}
                  >
                    Budget
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-bricolage), sans-serif',
                      fontWeight: 800,
                      fontSize: 18,
                      color: AC.dark,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {fmtBudget(m.budgetUsd)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 11,
                      color: AC.muted,
                      marginBottom: 1,
                    }}
                  >
                    Deadline
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontWeight: 600,
                      fontSize: 14,
                      color: AC.dark,
                    }}
                  >
                    {fmtDate(m.deadline)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(30,58,47,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: AC.dark,
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                  }}
                >
                  {m.bidCount}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 12,
                    color: AC.muted,
                  }}
                >
                  bid{m.bidCount !== 1 ? 's' : ''}
                </span>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    background: 'rgba(242,168,75,0.12)',
                    color: AC.orange,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    marginLeft: 4,
                  }}
                >
                  Bid →
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: 60,
              textAlign: 'center',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: AC.muted,
            }}
          >
            No missions match these filters.
          </div>
        )}
      </div>
    </AppPage>
  );
}
