'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { type Notification, NotificationType } from '@/lib/prototypes/market-os/types';
import { fmtRelative } from '@/lib/prototypes/market-os/format';

const AC = {
  dark: '#1e3a2f',
  orange: '#f2a84b',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

const TYPE_DOT: Record<NotificationType, string> = {
  bid_received: '#f2a84b',
  bid_accepted: '#a5d6a7',
  bid_declined: '#c4554d',
  bid_shortlisted: '#b9d9e0',
  mission_posted: '#f6d9a3',
  mission_completed: '#a5d6a7',
  reputation_up: '#f2a84b',
  pool_update: '#b9d9e0',
};

export function InboxView({ initial }: { initial: Notification[] }) {
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  const visible = tab === 'unread' ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

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
            Inbox
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 14,
              color: 'rgba(30,58,47,0.5)',
              margin: 0,
            }}
          >
            {unreadCount} unread · {items.length} total
          </p>
        </div>
        <button
          type="button"
          className="a-btn a-btn-ghost"
          onClick={markAll}
          disabled={unreadCount === 0}
          style={{
            height: 38,
            padding: '0 16px',
            fontSize: 13,
            opacity: unreadCount === 0 ? 0.4 : 1,
            cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Mark all read
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'unread'] as const).map((t) => (
          <div
            key={t}
            className={`a-pill-filter${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
        }}
      >
        {visible.length === 0 && (
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: AC.muted,
            }}
          >
            Nothing to read.
          </div>
        )}
        {visible.map((n, i) => {
          const rowStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            padding: '16px 20px',
            borderBottom: i < visible.length - 1 ? `1px solid ${AC.border}` : 'none',
            background: n.read ? 'transparent' : 'rgba(242,168,75,0.05)',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          };
          const onClick = () => {
            if (!n.read) toggleRead(n.id);
          };
          const inner = (
            <>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: TYPE_DOT[n.type] ?? AC.orange,
                  marginTop: 6,
                  flexShrink: 0,
                  opacity: n.read ? 0.4 : 1,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontWeight: n.read ? 500 : 700,
                      fontSize: 14,
                      color: AC.dark,
                    }}
                  >
                    {n.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 12,
                      color: AC.muted,
                      flexShrink: 0,
                    }}
                  >
                    {fmtRelative(n.ts)}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 13.5,
                    color: 'rgba(30,58,47,0.62)',
                    margin: '4px 0 0',
                    lineHeight: 1.55,
                  }}
                >
                  {n.body}
                </p>
              </div>
            </>
          );
          return n.link ? (
            <Link key={n.id} href={n.link} onClick={onClick} style={rowStyle}>
              {inner}
            </Link>
          ) : (
            <div key={n.id} onClick={onClick} style={rowStyle}>
              {inner}
            </div>
          );
        })}
      </div>
    </AppPage>
  );
}
