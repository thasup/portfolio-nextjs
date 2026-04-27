import Link from 'next/link';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { CatChip, StatusChip } from '@/components/prototypes/market-os/primitives/Chips';
import {
  CURRENT_USER,
  MISSIONS,
  POOL,
  getMyBids,
  getMission,
} from '@/lib/prototypes/market-os/data';
import { fmtBudget } from '@/lib/prototypes/market-os/format';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  blue: '#b9d9e0',
  peach: '#f6d9a3',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

export default function DashboardPage() {
  const stats = [
    {
      label: 'Active Missions',
      value: String(MISSIONS.filter((m) => m.status === 'active').length),
      sub: 'across 3 categories',
      color: AC.orange,
    },
    {
      label: 'Pool Remaining',
      value: '$' + Math.round(POOL.unallocated / 1000) + 'k',
      sub: 'unallocated this quarter',
      color: AC.blue,
    },
    {
      label: 'My Bid Rate',
      value: '92%',
      sub: 'acceptance over 90 days',
      color: '#a5d6a7',
    },
    {
      label: 'Reputation Score',
      value: String(CURRENT_USER.reputation),
      sub: 'top 12% of contributors',
      color: AC.peach,
    },
  ];
  const recentMissions = MISSIONS.slice(0, 4);
  const myBids = getMyBids().slice(0, 3);

  return (
    <AppPage>
      <div style={{ marginBottom: 32 }}>
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
          Good morning, {CURRENT_USER.name.split(' ')[0]} 👋
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 15,
            color: 'rgba(30,58,47,0.55)',
            margin: 0,
          }}
        >
          {POOL.period} · {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} className="a-stat-card">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${s.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: s.color }} />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 800,
                fontSize: 28,
                color: AC.dark,
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontWeight: 600,
                fontSize: 13,
                color: AC.dark,
                margin: '6px 0 3px',
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 12,
                color: 'rgba(30,58,47,0.45)',
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent missions */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: AC.dark,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Recent Missions
            </h2>
            <Link
              href="/prototypes/market-os/app/missions"
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                color: AC.orange,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View all →
            </Link>
          </div>
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
            }}
          >
            {recentMissions.map((m, i) => (
              <Link
                key={m.id}
                href={`/prototypes/market-os/app/missions/${m.id}`}
                className="a-row"
                style={{
                  borderBottom: i < recentMissions.length - 1 ? `1px solid ${AC.border}` : 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontWeight: 600,
                      fontSize: 14,
                      color: AC.dark,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.title}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    <CatChip cat={m.cat} />
                    <span
                      style={{
                        fontSize: 12,
                        color: AC.muted,
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                      }}
                    >
                      {m.posted}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-bricolage), sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: AC.dark,
                    }}
                  >
                    {fmtBudget(m.budget)}
                  </div>
                  <StatusChip status={m.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: AC.dark,
                margin: '0 0 14px',
                letterSpacing: '-0.02em',
              }}
            >
              My Active Bids
            </h2>
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
              }}
            >
              {myBids.length === 0 && (
                <div
                  style={{
                    padding: 24,
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 13,
                    color: AC.muted,
                    textAlign: 'center',
                  }}
                >
                  You haven&apos;t bid on anything yet.
                </div>
              )}
              {myBids.map((b, i) => {
                const m = getMission(b.missionId);
                return (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderBottom:
                        i < myBids.length - 1 ? `1px solid ${AC.border}` : 'none',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontWeight: 600,
                          fontSize: 13,
                          color: AC.dark,
                        }}
                      >
                        {m?.title ?? 'Mission'}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontSize: 12,
                          color: AC.muted,
                          marginTop: 2,
                        }}
                      >
                        Submitted {b.daysAgo}d ago
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-bricolage), sans-serif',
                          fontWeight: 700,
                          fontSize: 15,
                          color: AC.dark,
                        }}
                      >
                        {fmtBudget(b.amount)}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 8,
                          background:
                            b.status === 'shortlisted'
                              ? 'rgba(165,214,167,0.5)'
                              : 'rgba(246,217,163,0.6)',
                          color: AC.dark,
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: '22px 24px',
              boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 15,
                color: AC.dark,
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
              }}
            >
              Revenue Pool — {POOL.period}
            </h3>
            {(
              [
                ['Missions', POOL.missions, AC.orange],
                ['Base Comp', POOL.base, 'rgba(185,217,224,0.8)'],
                ['Unallocated', POOL.unallocated, 'rgba(200,230,201,0.8)'],
              ] as const
            ).map(([label, val, color]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 13,
                      color: 'rgba(30,58,47,0.7)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      color: AC.dark,
                    }}
                  >
                    {fmtBudget(val)}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'rgba(30,58,47,0.06)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round((val / POOL.total) * 100)}%`,
                      background: color,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: `1px solid ${AC.border}`,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: AC.dark,
                }}
              >
                Total Pool
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-bricolage), sans-serif',
                  fontSize: 16,
                  fontWeight: 800,
                  color: AC.dark,
                }}
              >
                {fmtBudget(POOL.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppPage>
  );
}

