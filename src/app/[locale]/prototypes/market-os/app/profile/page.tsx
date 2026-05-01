import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { CatChip, TierChip } from '@/components/prototypes/market-os/primitives/Chips';
import { getOrgBySlug } from '@/lib/marketos/queries/orgs';
import {
  getMemberMissionHistory,
  getMemberWithStats,
} from '@/lib/marketos/queries/members';
import { getCurrentMember } from '@/lib/marketos/auth';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';
import { fmtBudget, fmtDateLong } from '@/lib/marketos/format';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

/**
 * Profile — spec §8.7. Shows the *current viewer's* profile. Anonymous
 * visitors get a "sign in to see your profile" empty state — a future
 * `/app/people/[memberId]` route will reuse the same view for other
 * members.
 */
export default async function ProfilePage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org) return <AppPage>{empty('Demo org not seeded.')}</AppPage>;

  const member = await getCurrentMember(org.slug);
  if (!member) return <AppPage>{empty('Sign in to see your profile.')}</AppPage>;

  const [stats, history] = await Promise.all([
    getMemberWithStats(member.id),
    getMemberMissionHistory(member.id, { limit: 20 }),
  ]);
  if (!stats) return <AppPage>{empty('No profile stats found.')}</AppPage>;

  const initials = stats.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <AppPage>
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '36px 40px',
          marginBottom: 24,
          boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: 28,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${AC.orange}, #e89a35)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-bricolage), sans-serif',
            fontWeight: 800,
            fontSize: 26,
            color: 'white',
          }}
        >
          {initials.toUpperCase()}
        </div>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 800,
              fontSize: 24,
              color: AC.dark,
              margin: '0 0 4px',
              letterSpacing: '-0.03em',
            }}
          >
            {stats.displayName}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 15,
              color: 'rgba(30,58,47,0.55)',
              margin: '0 0 12px',
            }}
          >
            {stats.title ?? stats.role}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {stats.skills.map((s) => (
              <span
                key={s}
                style={{
                  padding: '3px 10px',
                  borderRadius: 8,
                  background: 'rgba(30,58,47,0.06)',
                  fontSize: 12,
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  color: 'rgba(30,58,47,0.7)',
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '16px 32px',
            background: AC.cream,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 800,
              fontSize: 42,
              color: AC.dark,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            {stats.reputation}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 13,
              color: AC.muted,
              marginTop: 2,
            }}
          >
            Reputation
          </div>
          <div style={{ marginTop: 6 }}>
            <TierChip tier={stats.tier} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {(
          [
            ['Missions Completed', String(stats.completed), 'total deliveries'],
            [
              'On-time Rate',
              stats.onTimePct == null ? '—' : `${stats.onTimePct}%`,
              'of missions on schedule',
            ],
            [
              'Peer Rating',
              stats.avgRating == null ? '—' : `${stats.avgRating.toFixed(1)}/5`,
              `average across ${stats.reviewCount} review${stats.reviewCount === 1 ? '' : 's'}`,
            ],
            [
              'Total Earned',
              `$${stats.totalEarnedUsd.toLocaleString()}`,
              'across all missions',
            ],
          ] as const
        ).map(([label, val, sub]) => (
          <div key={label} className="a-stat-card">
            <div
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 800,
                fontSize: 26,
                color: AC.dark,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontWeight: 600,
                fontSize: 13,
                color: AC.dark,
                marginBottom: 3,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 12,
                color: 'rgba(30,58,47,0.45)',
              }}
            >
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
        }}
      >
        <div style={{ padding: '20px 28px', borderBottom: `1px solid ${AC.border}` }}>
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
            Mission History
          </h2>
        </div>
        {history.length === 0 && (
          <div
            style={{
              padding: 32,
              textAlign: 'center',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: AC.muted,
              fontSize: 13,
            }}
          >
            No completed missions yet.
          </div>
        )}
        {history.map((h, i) => (
          <div
            key={h.missionId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 28px',
              borderBottom: i < history.length - 1 ? `1px solid ${AC.border}` : 'none',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: AC.dark,
                }}
              >
                {h.title}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                <CatChip cat={h.category} />
                <span
                  style={{
                    fontSize: 12,
                    color: AC.muted,
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                  }}
                >
                  {fmtDateLong(h.completedAt)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: 'var(--font-bricolage), sans-serif',
                  fontWeight: 800,
                  fontSize: 16,
                  color: AC.dark,
                }}
              >
                {fmtBudget(h.earnedUsd)}
              </div>
              {h.rating != null && (
                <div
                  style={{
                    fontSize: 12,
                    color: AC.muted,
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                  }}
                >
                  ★ {h.rating.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppPage>
  );
}

function empty(message: string) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: 60,
        textAlign: 'center',
        boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        color: AC.muted,
        fontSize: 14,
      }}
    >
      {message}
    </div>
  );
}
