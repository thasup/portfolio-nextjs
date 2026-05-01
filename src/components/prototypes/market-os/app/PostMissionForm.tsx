'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppPage } from '@/components/prototypes/market-os/app/AppPage';
import { Category } from '@/lib/marketos/types';
import { fmtBudget } from '@/lib/marketos/format';

const AC = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  muted: '#7a7f79',
  border: 'rgba(30,58,47,0.1)',
};

const CATEGORIES = Object.values(Category);

/**
 * Post Mission form — the producer side of the loop. The mockup only
 * showed the "+ Post Mission" CTA; this is the screen behind it.
 *
 * Mock-only: submission shows a confirmation panel and resets state on
 * "Post another". No persistence, no API.
 */
export function PostMissionForm() {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<Category>(Category.Design);
  const [desc, setDesc] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateDeliverable = (i: number, value: string) => {
    setDeliverables((prev) => prev.map((d, idx) => (idx === i ? value : d)));
  };
  const addDeliverable = () => setDeliverables((prev) => [...prev, '']);
  const removeDeliverable = (i: number) =>
    setDeliverables((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));

  const reset = () => {
    setTitle('');
    setCat(Category.Design);
    setDesc('');
    setDeliverables(['']);
    setBudget('');
    setDeadline('');
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !budget || !deadline) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppPage>
        <Link href="/prototypes/market-os/app/missions" className="a-back-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back to missions
        </Link>
        <div
          style={{
            background: 'white',
            borderRadius: 24,
            padding: '56px 48px',
            marginTop: 24,
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(165,214,167,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12L10 17L19 7"
                stroke="#4caf50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-bricolage), sans-serif',
              fontWeight: 800,
              fontSize: 26,
              color: AC.dark,
              margin: '0 0 8px',
              letterSpacing: '-0.03em',
            }}
          >
            Mission posted!
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 15,
              color: 'rgba(30,58,47,0.6)',
              maxWidth: 460,
              margin: '0 auto 8px',
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: AC.dark }}>{title}</strong> is live for{' '}
            <strong style={{ color: AC.dark }}>{fmtBudget(Number(budget) || 0)}</strong>. The
            board will notify you as bids come in.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 12,
              color: AC.muted,
              margin: '0 0 28px',
            }}
          >
            (Prototype — the mission is not actually persisted.)
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              type="button"
              className="a-btn a-btn-ghost"
              onClick={reset}
              style={{ height: 42, padding: '0 18px', fontSize: 14 }}
            >
              Post another
            </button>
            <Link
              className="a-btn a-btn-primary"
              href="/prototypes/market-os/app/missions"
              style={{ height: 42, padding: '0 20px', fontSize: 14 }}
            >
              View board
            </Link>
          </div>
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <Link href="/prototypes/market-os/app/missions" className="a-back-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Back to missions
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          fontWeight: 800,
          fontSize: 28,
          color: AC.dark,
          margin: '20px 0 4px',
          letterSpacing: '-0.03em',
        }}
      >
        Post a mission
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
        Define a discrete, valued piece of work. Anyone in the org — and approved external
        contributors — can bid. The first agreed offer becomes a binding contract.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: 20,
          padding: '32px 36px',
          boxShadow: '0 1px 4px rgba(30,58,47,0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <Field label="Title">
          <input
            className="a-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 onboarding redesign"
            required
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="Category">
            <select
              className="a-input"
              value={cat}
              onChange={(e) => setCat(e.target.value as Category)}
              style={{ appearance: 'none' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Deadline">
            <input
              className="a-input"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="Budget">
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
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 6000"
              style={{ paddingLeft: 24 }}
              required
            />
          </div>
        </Field>

        <Field label="Description">
          <textarea
            className="a-textarea"
            rows={5}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What needs to get done, why it matters, and what success looks like."
            required
          />
        </Field>

        <Field label="Deliverables">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deliverables.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="a-input"
                  value={d}
                  onChange={(e) => updateDeliverable(i, e.target.value)}
                  placeholder={`Deliverable ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeDeliverable(i)}
                  disabled={deliverables.length === 1}
                  style={{
                    height: 42,
                    width: 42,
                    border: `1.5px solid ${AC.border}`,
                    background: 'white',
                    borderRadius: 10,
                    cursor: deliverables.length === 1 ? 'not-allowed' : 'pointer',
                    color: AC.muted,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                  aria-label="Remove deliverable"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDeliverable}
              style={{
                alignSelf: 'flex-start',
                background: 'transparent',
                border: 'none',
                color: AC.orange,
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              + Add deliverable
            </button>
          </div>
        </Field>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTop: `1px solid ${AC.border}`,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 12,
              color: AC.muted,
              margin: 0,
              maxWidth: 380,
              lineHeight: 1.55,
            }}
          >
            Posting deducts the budget from the unallocated pool. If no one bids, the budget
            returns at period end.
          </p>
          <button
            type="submit"
            className="a-btn a-btn-primary"
            style={{ height: 44, padding: '0 22px', fontSize: 14 }}
          >
            Post mission →
          </button>
        </div>
      </form>
    </AppPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(30,58,47,0.78)',
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
