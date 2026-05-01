import Link from 'next/link';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { getOrgBySlug } from '@/lib/marketos/queries/orgs';
import { listMyBids } from '@/lib/marketos/queries/bids';
import { listMissions } from '@/lib/marketos/queries/missions';
import { getCurrentMember } from '@/lib/marketos/auth';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';
import { fmtBudget, fmtDate, fmtPostedAgo } from '@/lib/marketos/format';
import type { MissionDTO } from '@/lib/marketos/types';

const AC = {
  dark: '#1e3a2f',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

const STATUS_BG: Record<string, string> = {
  pending: 'rgba(246,217,163,0.6)',
  shortlisted: 'rgba(165,214,167,0.45)',
  accepted: '#c8e6c9',
  declined: 'rgba(196,85,77,0.18)',
  withdrawn: 'rgba(30,58,47,0.08)',
};

/**
 * "My Bids" — spec §8.6.
 *
 * Anonymous visitors get a "sign in to see your bids" empty state.
 * Members see their bid list, joined to mission for budget/deadline.
 */
export default async function MyBidsPage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org) return <AppPage>{anonShell('Demo org not seeded.')}</AppPage>;

  const member = await getCurrentMember(org.slug);
  if (!member) return <AppPage>{anonShell('Sign in to see your bids.')}</AppPage>;

  const [bids, missions] = await Promise.all([
    listMyBids(member.id),
    listMissions(org.id, { limit: 200 }),
  ]);
  const missionById = new Map<string, MissionDTO>(missions.map((m) => [m.id, m]));

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
        My Bids
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 14,
          color: 'rgba(30,58,47,0.5)',
          margin: '0 0 28px',
        }}
      >
        {bids.length} bid{bids.length !== 1 ? 's' : ''} across active and shortlisted missions
      </p>

      {bids.length === 0 && (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 60,
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 14,
              color: AC.muted,
              margin: '0 0 16px',
            }}
          >
            You haven&apos;t bid on any missions yet.
          </p>
          <Link
            className="a-btn a-btn-primary"
            href="/prototypes/market-os/app/missions"
            style={{ height: 40, padding: '0 18px', fontSize: 14 }}
          >
            Browse missions
          </Link>
        </div>
      )}

      {bids.map((b) => {
        const m = missionById.get(b.missionId);
        if (!m) return null;
        return (
          <Link
            key={b.id}
            href={`/prototypes/market-os/app/missions/${m.slug}`}
            style={{
              background: 'white',
              borderRadius: 16,
              padding: '24px 28px',
              marginBottom: 16,
              boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.15s, transform 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-bricolage), sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  color: AC.dark,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {m.title}
              </h3>
              <span
                style={{
                  fontSize: 12,
                  padding: '3px 10px',
                  borderRadius: 8,
                  background: STATUS_BG[b.status] ?? 'rgba(30,58,47,0.06)',
                  color: AC.dark,
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {b.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 28, marginTop: 14 }}>
              {(
                [
                  ['Your bid', fmtBudget(b.amountUsd)],
                  ['Mission budget', fmtBudget(m.budgetUsd)],
                  ['Submitted', fmtPostedAgo(b.submittedAt)],
                  ['Deadline', fmtDate(m.deadline)],
                ] as const
              ).map(([l, v]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 11,
                      color: AC.muted,
                      marginBottom: 2,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-bricolage), sans-serif',
                      fontWeight: 700,
                      fontSize: 16,
                      color: AC.dark,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                color: 'rgba(30,58,47,0.62)',
                margin: '14px 0 0',
                paddingTop: 14,
                borderTop: `1px solid ${AC.border}`,
                lineHeight: 1.55,
                fontStyle: 'italic',
              }}
            >
              “{b.proposal}”
            </p>
          </Link>
        );
      })}
    </AppPage>
  );
}

function anonShell(message: string) {
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
