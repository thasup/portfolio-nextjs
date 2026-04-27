import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { POOL } from '@/lib/prototypes/market-os/data';
import { fmtBudget, fmtDate } from '@/lib/prototypes/market-os/format';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  blue: '#b9d9e0',
  peach: '#f6d9a3',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

export default function PoolPage() {
  // Approximate this period's "company revenue" from pool/ratio for
  // illustrative purposes only. ratio is a percent, so revenue =
  // total / (ratio / 100).
  const revenue = Math.round(POOL.total / (POOL.ratio / 100));
  const maxHistory = Math.max(...POOL.history.map((h) => h.total));

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 28,
        }}
      >
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
            Revenue → Pool ({POOL.period})
          </h2>
          {(
            [
              ['Company revenue', revenue, 'rgba(30,58,47,0.18)'],
              [`Pool (${POOL.ratio}% of revenue)`, POOL.total, AC.orange],
              ['Missions', POOL.missions, AC.peach],
              ['Base comp', POOL.base, AC.blue],
              ['Unallocated', POOL.unallocated, '#c8e6c9'],
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
                    width: `${(val / revenue) * 100}%`,
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
            {POOL.history.map((h) => {
              const pct = (h.total / maxHistory) * 100;
              const isCurrent = h.period === POOL.period;
              return (
                <div
                  key={h.period}
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
                      color: isCurrent ? AC.dark : AC.muted,
                      fontWeight: isCurrent ? 700 : 500,
                    }}
                  >
                    ${Math.round(h.total / 1000)}k
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: `${pct}%`,
                      background: isCurrent
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
                    {h.period.replace(' ', '\n')}
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
            {POOL.payouts.length} scheduled · total{' '}
            {fmtBudget(POOL.payouts.reduce((s, p) => s + p.amount, 0))}
          </span>
        </div>
        {POOL.payouts.map((p, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 130px 110px',
              gap: 16,
              alignItems: 'center',
              padding: '14px 28px',
              borderBottom: i < POOL.payouts.length - 1 ? `1px solid ${AC.border}` : 'none',
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
              {p.person}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                color: 'rgba(30,58,47,0.62)',
              }}
            >
              {p.mission}
            </div>
            <div
              style={{
                textAlign: 'right',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                color: AC.muted,
              }}
            >
              {fmtDate(p.releaseDate)}
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
              {fmtBudget(p.amount)}
            </div>
          </div>
        ))}
      </div>
    </AppPage>
  );
}
