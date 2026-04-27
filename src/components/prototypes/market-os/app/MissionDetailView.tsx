'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { CatChip, StatusChip } from '@/components/prototypes/market-os/primitives/Chips';
import { type Bid, type Mission } from '@/lib/prototypes/market-os/types';
import { fmtBudget, fmtDate } from '@/lib/prototypes/market-os/format';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

export function MissionDetailView({
  mission,
  existingBids,
}: {
  mission: Mission;
  existingBids: Bid[];
}) {
  const [bid, setBid] = useState('');
  const [proposal, setProposal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bid && proposal) setSubmitted(true);
  };

  return (
    <AppPage>
      <Link href="/prototypes/market-os/app/missions" className="a-back-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Back to missions
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, marginTop: 20 }}>
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <CatChip cat={mission.cat} />
            <StatusChip status={mission.status} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 800,
              fontSize: 32,
              color: AC.dark,
              margin: '0 0 12px',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
            }}
          >
            {mission.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 15,
              color: 'rgba(30,58,47,0.6)',
              margin: '0 0 4px',
            }}
          >
            Posted by <strong style={{ color: AC.dark }}>{mission.poster}</strong> ·{' '}
            {mission.posted}
          </p>

          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '28px 32px',
              margin: '24px 0',
              boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: AC.dark,
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              Description
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 15,
                color: 'rgba(30,58,47,0.72)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {mission.desc}
            </p>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '28px 32px',
              boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: AC.dark,
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
              }}
            >
              Deliverables
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mission.deliverables.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(242,168,75,0.13)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: 11,
                        fontWeight: 700,
                        color: AC.orange,
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 15,
                      color: 'rgba(30,58,47,0.75)',
                      lineHeight: 1.5,
                    }}
                  >
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {existingBids.length > 0 && (
            <div style={{ marginTop: 24 }}>
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
                {existingBids.length} Bid{existingBids.length !== 1 ? 's' : ''} so far
              </h2>
              <div
                style={{
                  background: 'white',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(30,58,47,0.06)',
                }}
              >
                {existingBids.map((b, i) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom:
                        i < existingBids.length - 1 ? `1px solid ${AC.border}` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'rgba(30,58,47,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-bricolage), sans-serif',
                          fontWeight: 700,
                          fontSize: 14,
                          color: AC.dark,
                        }}
                      >
                        {b.bidderName[0]}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-dm-sans), sans-serif',
                            fontWeight: 600,
                            fontSize: 14,
                            color: AC.dark,
                          }}
                        >
                          {b.bidderName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: AC.muted,
                            fontFamily: 'var(--font-dm-sans), sans-serif',
                          }}
                        >
                          Reputation: <strong style={{ color: AC.dark }}>{b.reputation}</strong>{' '}
                          · {b.daysAgo}d ago
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-bricolage), sans-serif',
                        fontWeight: 800,
                        fontSize: 18,
                        color: AC.dark,
                      }}
                    >
                      {fmtBudget(b.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '28px',
              boxShadow: '0 8px 30px -10px rgba(30,58,47,0.14)',
              position: 'sticky',
              top: 24,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 24,
                padding: '16px 18px',
                background: AC.cream,
                borderRadius: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 11,
                    color: AC.muted,
                    marginBottom: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Budget
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-bricolage), sans-serif',
                    fontWeight: 800,
                    fontSize: 24,
                    color: AC.dark,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {fmtBudget(mission.budget)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 11,
                    color: AC.muted,
                    marginBottom: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Deadline
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-bricolage), sans-serif',
                    fontWeight: 800,
                    fontSize: 24,
                    color: AC.dark,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {fmtDate(mission.deadline)}
                </div>
              </div>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(165,214,167,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12L10 17L19 7"
                      stroke="#4caf50"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-bricolage), sans-serif',
                    fontWeight: 700,
                    fontSize: 17,
                    color: AC.dark,
                    marginBottom: 6,
                  }}
                >
                  Bid submitted!
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 14,
                    color: 'rgba(30,58,47,0.6)',
                    lineHeight: 1.55,
                  }}
                >
                  You&apos;ll be notified when the mission poster responds.
                </div>
                <button
                  className="a-btn a-btn-ghost"
                  type="button"
                  onClick={() => {
                    setBid('');
                    setProposal('');
                    setSubmitted(false);
                  }}
                  style={{ marginTop: 18, height: 38, padding: '0 18px', fontSize: 13 }}
                >
                  Edit bid
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  style={{
                    fontFamily: 'var(--font-bricolage), sans-serif',
                    fontWeight: 700,
                    fontSize: 17,
                    color: AC.dark,
                    margin: '0 0 18px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Place Your Bid
                </h3>
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'rgba(30,58,47,0.8)',
                      display: 'block',
                      marginBottom: 6,
                    }}
                  >
                    Your bid amount
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 13,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: 15,
                        color: AC.muted,
                      }}
                    >
                      $
                    </span>
                    <input
                      className="a-input"
                      type="number"
                      placeholder="e.g. 7500"
                      value={bid}
                      onChange={(e) => setBid(e.target.value)}
                      style={{ paddingLeft: 24 }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'rgba(30,58,47,0.8)',
                      display: 'block',
                      marginBottom: 6,
                    }}
                  >
                    Why you&apos;re the right fit
                  </label>
                  <textarea
                    className="a-textarea"
                    rows={4}
                    placeholder="Briefly describe your experience and approach for this mission…"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="a-btn a-btn-primary"
                  style={{ width: '100%', height: 48, fontSize: 15 }}
                >
                  Submit Bid
                </button>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 12,
                    color: 'rgba(30,58,47,0.4)',
                    textAlign: 'center',
                    margin: '10px 0 0',
                  }}
                >
                  Submitting creates a binding offer if accepted
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppPage>
  );
}
