import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { getOrgBySlug } from '@/lib/marketos/queries/orgs';
import {
  getCurrentPool,
  getPoolHistory,
  getUpcomingPayouts,
} from '@/lib/marketos/queries/pool';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';
import { fmtBudget, fmtDate } from '@/lib/marketos/format';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  blue: '#b9d9e0',
  peach: '#f6d9a3',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

/**
 * Pool — spec §8.9. Three sections:
 * 1. Revenue → Pool waterfall (current period only).
 * 2. Pool growth bar chart over all closed periods + current.
 * 3. Upcoming payouts table (scheduled, asc by date).
 */
export default async function PoolPage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org)
    return (
      <AppPage>
        <p style={{ color: AC.muted, fontFamily: 'var(--font-dm-sans), sans-serif' }}>
          Demo org not seeded.
        </p>
      </AppPage>
    );

  const [pool, history, payouts] = await Promise.all([
    getCurrentPool(org.id),
    getPoolHistory(org.id),
    getUpcomingPayouts(org.id),
  ]);

  if (!pool) {
    return (
      <AppPage>
        <h1
          style={{
            fontFamily: 'var(--font-bricolage), sans-serif',
            fontWeight: 800,
            fontSize: 28,
            color: AC.dark,
            margin: '0 0 12px',
            letterSpacing: '-0.03em',
          }}
        >
          Revenue Pool
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            color: AC.muted,
            fontSize: 14,
          }}
        >
          No current revenue period configured.
        </p>
      </AppPage>
    );
  }

  const revenue = pool.revenueUsd;
  const maxHistory = Math.max(...history.map((h) => h.totalUsd), 1);

  return (
    <AppPage>
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
        Revenue Pool
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 14,
          color: 'rgba(30,58,47,0.55)',
          margin: '0 0 28px',
          maxWidth: 640,
        }}
      >
        Every period, a fixed share of revenue flows into the pool. The pool funds missions, base
        comp, and a small unallocated buffer. If revenue stalls, so does the pool.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Waterfall */}
        <div className="a-stat-card" style={{ padding: 28 }}>
          <h2
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 700,
              fontSize: 15,
              color: AC.dark,
              margin: '0 0 18px',
              letterSpacing: '-0.02em',
            }}
          >
            Revenue → Pool ({pool.periodLabel})
          </h2>
          {(
            [
              ['Company revenue', revenue, 'rgba(30,58,47,0.18)'],
              [`Pool (${pool.ratio}% of revenue)`, pool.totalUsd, AC.orange],
              ['Missions', pool.missionsLockedUsd, AC.peach],
              ['Base comp', pool.baseUsd, AC.blue],
              ['Unallocated', pool.unallocatedUsd, '#c8e6c9'],
            ] as const
          ).map(([label, val, color]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'rgba(30,58,47,0.7)' }}>{label}</span>
                <span style={{ color: AC.dark, fontWeight: 700 }}>{fmtBudget(val)}</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'rgba(30,58,47,0.06)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${revenue > 0 ? (val / revenue) * 100 : 0}%`,
                    background: color,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="a-stat-card" style={{ padding: 28 }}>
          <h2
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 700,
              fontSize: 15,
              color: AC.dark,
              margin: '0 0 18px',
              letterSpacing: '-0.02em',
            }}
          >
            Pool growth over time
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 180,
              gap: 12,
              padding: '0 4px',
            }}
          >
            {history.map((h) => {
              const pct = (h.totalUsd / maxHistory) * 100;
              return (
                <div
                  key={h.periodLabel}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 11,
                      color: h.isCurrent ? AC.dark : AC.muted,
                      fontWeight: h.isCurrent ? 700 : 500,
                    }}
                  >
                    ${Math.round(h.totalUsd / 1000)}k
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: `${pct}%`,
                      background: h.isCurrent
                        ? `linear-gradient(180deg, ${AC.orange}, #e89a35)`
                        : 'rgba(30,58,47,0.18)',
                      borderRadius: '6px 6px 0 0',
                      minHeight: 6,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 11,
                      color: AC.muted,
                    }}
                  >
                    {h.periodLabel.replace(' ', '\n')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
        }}
      >
        <div
          style={{
            padding: '20px 28px',
            borderBottom: `1px solid ${AC.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            Upcoming payouts
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 13,
              color: AC.muted,
            }}
          >
            {payouts.length} scheduled · total{' '}
            {fmtBudget(payouts.reduce((s, p) => s + p.amountUsd, 0))}
          </span>
        </div>
        {payouts.length === 0 && (
          <div
            style={{
              padding: 32,
              textAlign: 'center',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: AC.muted,
              fontSize: 13,
            }}
          >
            No payouts scheduled.
          </div>
        )}
        {payouts.map((p, i) => (
          <div
            key={p.payoutId}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 130px 110px',
              gap: 16,
              alignItems: 'center',
              padding: '14px 28px',
              borderBottom: i < payouts.length - 1 ? `1px solid ${AC.border}` : 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontWeight: 600,
                fontSize: 14,
                color: AC.dark,
              }}
            >
              {p.recipientName}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                color: 'rgba(30,58,47,0.62)',
              }}
            >
              {p.missionTitle}
            </div>
            <div
              style={{
                textAlign: 'right',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                color: AC.muted,
              }}
            >
              {fmtDate(p.scheduledFor)}
            </div>
            <div
              style={{
                textAlign: 'right',
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 800,
                fontSize: 16,
                color: AC.dark,
              }}
            >
              {fmtBudget(p.amountUsd)}
            </div>
          </div>
        ))}
      </div>
    </AppPage>
  );
}
