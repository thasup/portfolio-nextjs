/**
 * MarketOS landing sections — server-rendered visual port of the
 * standalone HTML mockup. Each named export is one stacked section so
 * the landing page (`page.tsx`) can compose the full surface.
 *
 * The original mockup keeps everything in one file; here we keep it
 * grouped because every section reads the same palette and would split
 * into eight tiny files otherwise. Splits are by "screen role", not
 * file size.
 */
import Link from 'next/link';
import { MkLogo } from '@/components/prototypes/market-os/primitives/MkLogo';
import { Eyebrow, H2 } from '@/components/prototypes/market-os/primitives/Eyebrow';
import { MiniPreview } from '@/components/prototypes/market-os/landing/MiniPreview';

const C = {
  cream: '#f9f7f6',
  dark: '#1e3a2f',
  orange: '#f2a84b',
  blue: '#b9d9e0',
  peach: '#f6d9a3',
  muted: '#7a7f79',
};

const APP_URL = '/prototypes/market-os/app/dashboard';

/* ─── Hero ───────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section
      style={{
        paddingTop: 148,
        paddingBottom: 60,
        textAlign: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Toggle pill decoration */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '16%',
          top: 228,
          width: 116,
          height: 58,
          borderRadius: 29,
          background:
            'linear-gradient(180deg,rgba(97,186,212,0.42) 0%,#49b8da 100%)',
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.13)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 7,
            top: 7,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(180deg,#fff 0%,#e6e6e6 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}
        />
      </div>

      {/* Chat bubbles */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '13%',
          top: 196,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        {[88, 66, 78].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 13,
              borderRadius: 7,
              background: i === 0 ? 'white' : 'rgba(255,255,255,0.55)',
              boxShadow: '0 2px 10px rgba(30,58,47,0.07)',
            }}
          />
        ))}
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          fontWeight: 800,
          fontSize: 90,
          lineHeight: 1.0,
          letterSpacing: '-0.055em',
          color: C.dark,
          margin: 0,
          position: 'relative',
          display: 'inline-block',
        }}
      >
        Work as a{' '}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          market.
          <svg
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: -8,
              width: '108%',
              overflow: 'visible',
            }}
            height="16"
            viewBox="0 0 360 16"
            fill="none"
          >
            <ellipse cx="180" cy="10" rx="175" ry="8.5" fill={C.orange} opacity="0.8" />
          </svg>
        </span>
        <br />
        Performance as a contract.
      </h1>

      {/* Handwriting note top-right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '7%',
          top: 280,
          transform: 'rotate(5deg)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-permanent-marker), cursive',
            fontSize: 20,
            color: C.dark,
            lineHeight: 1.25,
            display: 'block',
          }}
        >
          You set the value,
          <br />
          the market agrees.
        </span>
        <svg
          width="130"
          height="12"
          viewBox="0 0 130 12"
          fill="none"
          style={{ marginTop: 3, opacity: 0.75 }}
        >
          <path
            d="M2 8Q22 2 42 8Q62 14 82 8Q102 2 122 8"
            stroke={C.orange}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontWeight: 500,
          fontSize: 19,
          lineHeight: 1.55,
          color: 'rgba(30,58,47,0.72)',
          maxWidth: 540,
          margin: '28px auto 36px',
        }}
      >
        An operating model that turns company performance into everyone&apos;s
        business — replacing org charts with an internal market for work.
      </p>

      {/* CTAs */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginBottom: 68,
        }}
      >
        <Link
          className="l-btn-primary"
          href={APP_URL}
          style={{ height: 52, padding: '0 34px', fontSize: 15.5 }}
        >
          Request Access
        </Link>
        <a className="l-btn-ghost" href="#how" style={{ height: 52, padding: '0 34px', fontSize: 15.5 }}>
          Learn more
        </a>
      </div>

      {/* Handwriting note bottom-left */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '6%',
          bottom: 160,
          transform: 'rotate(-3.5deg)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-permanent-marker), cursive',
            fontSize: 19,
            color: C.dark,
            lineHeight: 1.25,
            display: 'block',
            textAlign: 'center',
          }}
        >
          built to make
          <br />
          economics visible.
        </span>
        <svg width="172" height="16" viewBox="0 0 172 16" style={{ marginTop: 2, opacity: 0.7 }}>
          <ellipse cx="86" cy="10" rx="82" ry="7" stroke={C.orange} strokeWidth="2.5" fill="none" />
        </svg>
      </div>

      {/* Browser mockup */}
      <Link
        href={APP_URL}
        className="l-mockup"
        style={{
          maxWidth: 880,
          margin: '0 auto',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow:
            '0 40px 80px -20px rgba(30,58,47,0.22),0 0 0 1px rgba(30,58,47,0.08)',
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div
          style={{
            background: '#ede9e5',
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(30,58,47,0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f57', '#ffbd2e', '#28ca41'].map((c) => (
              <div
                key={c}
                style={{ width: 11, height: 11, borderRadius: '50%', background: c }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: 340,
              margin: '0 auto',
              height: 26,
              background: 'white',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11.5,
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: C.muted,
            }}
          >
            app.marketos.io/missions
          </div>
        </div>
        <MiniPreview />
      </Link>
    </section>
  );
}

/* ─── Why ────────────────────────────────────────────────────── */

export function WhySection() {
  const items = [
    {
      icon: '🔒',
      title: 'Closed-door negotiations',
      desc: 'Managers argue about comp in private. Individual contribution to company results is invisible.',
    },
    {
      icon: '📋',
      title: 'Work gets assigned',
      desc: 'Work is handed down from above rather than chosen. Initiative has no direct economic payoff.',
    },
    {
      icon: '🌫️',
      title: 'No clear connection',
      desc: 'Between company results and individual reward. The link between performance and pay is vague.',
    },
  ];
  return (
    <section style={{ padding: '100px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <Eyebrow>Why We Built It</Eyebrow>
      <H2 style={{ maxWidth: 640, fontSize: 50, letterSpacing: '-0.04em' }}>
        Most companies treat performance and compensation as separate, opaque
        systems.
      </H2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 22,
          marginTop: 48,
        }}
      >
        {items.map((item) => (
          <div key={item.title} className="l-feature-card">
            <div style={{ fontSize: 26, marginBottom: 14 }}>{item.icon}</div>
            <h3
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 700,
                fontSize: 19,
                color: C.dark,
                margin: '0 0 10px',
                letterSpacing: '-0.02em',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 15,
                color: 'rgba(30,58,47,0.68)',
                lineHeight: 1.62,
                margin: 0,
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── The Loop ───────────────────────────────────────────────── */

export function LoopSection() {
  const steps = [
    { n: '01', label: 'Revenue pool', desc: 'A defined % of revenue is set aside each period for payroll.' },
    { n: '02', label: 'Mission board', desc: 'Work is broken into discrete, valued missions posted for anyone to see.' },
    { n: '03', label: 'Bid & agree', desc: 'Anyone — internal or external — can bid. An agreed mission is a clear contract.' },
    { n: '04', label: 'Deliver', desc: 'The mission is completed on a defined timeline and to a defined standard.' },
    { n: '05', label: 'Reputation', desc: 'Delivery builds a track record that shapes what you can earn next.' },
  ];
  return (
    <section
      id="how"
      style={{
        background: C.dark,
        padding: '100px 80px',
        position: 'relative',
        overflow: 'hidden',
        scrollMarginTop: 80,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <Eyebrow light>How It Works</Eyebrow>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 64,
          }}
        >
          <H2 light style={{ maxWidth: 400, margin: 0, fontSize: 50 }}>
            A single operating loop
          </H2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 16,
              color: 'rgba(249,247,246,0.58)',
              maxWidth: 310,
              margin: 0,
              lineHeight: 1.65,
            }}
          >
            The company sets a payroll ratio. Missions are posted with a budget.
            Delivery builds the track record that shapes future earnings.
          </p>
        </div>
        <div style={{ display: 'flex', position: 'relative' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 32,
              left: '10%',
              right: '10%',
              height: 1,
              background: 'rgba(249,247,246,0.08)',
            }}
          />
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="l-loop-step"
              style={{ flex: 1, padding: '0 14px', textAlign: 'center' }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: i === 0 ? C.orange : 'rgba(249,247,246,0.07)',
                  border: i === 0 ? 'none' : '1px solid rgba(249,247,246,0.13)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: i === 0 ? 'white' : 'rgba(249,247,246,0.45)',
                  }}
                >
                  {step.n}
                </span>
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-bricolage), sans-serif',
                  fontWeight: 700,
                  fontSize: 17,
                  color: C.cream,
                  margin: '0 0 9px',
                  letterSpacing: '-0.02em',
                }}
              >
                {step.label}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 13,
                  color: 'rgba(249,247,246,0.5)',
                  lineHeight: 1.62,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What Changes ───────────────────────────────────────────── */

export function WhatChangesSection() {
  const items = [
    {
      title: 'No cost centers',
      desc: "Every function — including HR, finance, ops — competes for internal buy-in. If no one funds a service, that's information.",
    },
    {
      title: 'No comp negotiation',
      desc: 'Compensation follows mission delivery. Managers focus on helping people succeed rather than arguing about raises.',
    },
    {
      title: 'No assignment',
      desc: 'People choose which missions to pursue. Initiative has a direct economic payoff, not just a cultural one.',
    },
    {
      title: 'No mystery',
      desc: "If the company doesn't grow, the pool doesn't grow. The relationship between results and reward is explicit.",
    },
  ];
  return (
    <section id="what" style={{ padding: '100px 80px', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Eyebrow>What Changes</Eyebrow>
          <H2 center style={{ fontSize: 50, letterSpacing: '-0.04em', maxWidth: 680, margin: '0 auto' }}>
            Four things most companies accept.
            <br />
            You don&apos;t have to.
          </H2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          {items.map((item) => (
            <div key={item.title} className="l-feature-card" style={{ padding: 40 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 13px',
                  borderRadius: 20,
                  background: 'rgba(242,168,75,0.11)',
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.orange,
                  }}
                >
                  {item.title}
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 16,
                  color: 'rgba(30,58,47,0.7)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Who It's For ───────────────────────────────────────────── */

export function WhoSection() {
  return (
    <section id="who" style={{ padding: '0 80px 100px', scrollMarginTop: 80 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          background: 'white',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 30px 60px -30px rgba(30,58,47,0.18)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div
          style={{
            background: `linear-gradient(140deg,${C.dark} 0%,#274839 100%)`,
            padding: '60px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: -50,
              top: -50,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'rgba(242,168,75,0.1)',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: 50,
              bottom: 40,
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'rgba(185,217,224,0.12)',
            }}
          />
          <Eyebrow light>Who It&apos;s For</Eyebrow>
          <H2 light style={{ maxWidth: 340, margin: '10px 0 18px', fontSize: 38 }}>
            Built for founders committed to autonomy.
          </H2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 15,
              color: 'rgba(249,247,246,0.62)',
              lineHeight: 1.65,
              margin: '0 0 40px',
            }}
          >
            Companies between 50 and 200 people that have outgrown trust-based
            management but won&apos;t accept bureaucracy.
          </p>
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              ['50–200', 'ideal company size'],
              ['$2M+', 'annual revenue'],
              ['< 6mo', 'to full adoption'],
            ].map(([val, label]) => (
              <div key={val}>
                <div
                  style={{
                    fontFamily: 'var(--font-bricolage), sans-serif',
                    fontWeight: 800,
                    fontSize: 22,
                    color: C.orange,
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 11,
                    color: 'rgba(249,247,246,0.45)',
                    marginTop: 2,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '60px 56px' }}>
          <div style={{ marginBottom: 32 }}>
            <h3
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 800,
                fontSize: 26,
                color: C.dark,
                margin: '0 0 16px',
                letterSpacing: '-0.025em',
                borderBottom: `3px solid ${C.orange}`,
                display: 'inline-block',
                paddingBottom: 2,
              }}
            >
              Suitable for
            </h3>
            {[
              'Founders ideologically committed to autonomy',
              'Companies 50–200 people outgrowing informal management',
              'Operators who want economics of work to be visible',
              'Teams running project-based or mission-based work',
            ].map((item) => (
              <div
                key={item}
                style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(242,168,75,0.14)',
                    flexShrink: 0,
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="8" height="6" viewBox="0 0 8 6" aria-hidden>
                    <path
                      d="M1 3L3 5L7 1"
                      stroke={C.orange}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 15,
                    color: 'rgba(30,58,47,0.72)',
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-bricolage), sans-serif',
                fontWeight: 800,
                fontSize: 26,
                color: C.dark,
                margin: '0 0 16px',
                letterSpacing: '-0.025em',
              }}
            >
              Not suitable for
            </h3>
            {[
              'HR teams at large enterprises',
              'Annual review-only performance cultures',
              'Companies requiring standardized comp structures',
            ].map((item) => (
              <div
                key={item}
                style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(196,85,77,0.09)',
                    flexShrink: 0,
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                    <path
                      d="M2 2L6 6M6 2L2 6"
                      stroke="#c4554d"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 15,
                    color: 'rgba(30,58,47,0.58)',
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */

export function TestimonialsSection() {
  const cards = [
    {
      quote:
        "We don't run the same performance cycle for everyone. With MarketOS I can set a 3-month mission cycle for one person and a 12-month for another. That flexibility makes it work.",
      name: 'Espen Anderson',
      role: 'HR Director, Captico Ltd.',
      bg: C.orange,
      qbg: 'rgba(255,255,255,0.15)',
      qc: 'rgba(255,255,255,0.92)',
      nc: 'white',
      rc: 'rgba(255,255,255,0.65)',
    },
    {
      quote:
        "What changed wasn't just the process — it was the transparency. Our team finally understands what they're working toward and what it pays. That clarity changed everything.",
      name: 'Madi Klingenberg',
      role: 'COO, Vox & Tech',
      bg: 'white',
      qbg: 'rgba(30,58,47,0.04)',
      qc: 'rgba(30,58,47,0.72)',
      nc: C.dark,
      rc: 'rgba(30,58,47,0.48)',
    },
    {
      quote:
        "We went from opaque comp negotiations to a visible market. Everyone can see what's available and what it's worth. Retention went up. Complaints went down.",
      name: 'Lyn Hyun',
      role: 'Head of Talent, Fil Pioneers',
      bg: 'white',
      qbg: 'rgba(30,58,47,0.04)',
      qc: 'rgba(30,58,47,0.72)',
      nc: C.dark,
      rc: 'rgba(30,58,47,0.48)',
    },
  ];
  return (
    <section style={{ padding: '0 80px 100px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow>Kind Words</Eyebrow>
          <H2 center style={{ fontSize: 50, letterSpacing: '-0.04em' }}>
            What people say about us
          </H2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {cards.map((t) => (
            <div
              key={t.name}
              className="l-tcard"
              style={{
                background: t.bg,
                borderRadius: 24,
                padding: 36,
                boxShadow: t.bg === 'white' ? '0 1px 4px rgba(30,58,47,0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background:
                      t.bg === C.orange ? 'rgba(255,255,255,0.25)' : 'rgba(30,58,47,0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-bricolage), sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    color: t.nc,
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: t.nc,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: 12,
                      color: t.rc,
                      marginTop: 1,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
              <div style={{ background: t.qbg, borderRadius: 12, padding: '18px 18px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: 14.5,
                    color: t.qc,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {t.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MissionOS Teaser ──────────────────────────────────────── */

export function MissionOSTeaser() {
  return (
    <section style={{ padding: '0 80px 100px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          background: C.dark,
          borderRadius: 28,
          padding: '64px 72px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          aria-hidden
          style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.05 }}
          width="280"
          height="280"
          viewBox="0 0 280 280"
          fill="none"
        >
          <circle cx="280" cy="280" r="190" stroke="white" strokeWidth="55" />
        </svg>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '4px 13px',
              borderRadius: 20,
              background: 'rgba(242,168,75,0.15)',
              marginBottom: 16,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange }} />
            <span
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 11,
                fontWeight: 700,
                color: C.orange,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              Where We&apos;re Going
            </span>
          </div>
          <H2 light style={{ margin: '0 0 18px', fontSize: 42 }}>
            Air is part of something bigger
          </H2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 16,
              color: 'rgba(249,247,246,0.6)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Air is the first module of MarketOS. We&apos;re building the full
            performance platform — reputation systems, mission analytics, and
            org-wide economic visibility.
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 15,
              color: 'rgba(249,247,246,0.48)',
              margin: '0 0 14px',
            }}
          >
            Sign up to get updates on the system as it evolves.
          </p>
          <form style={{ display: 'flex' }}>
            <input
              placeholder="you@company.com"
              style={{
                flex: 1,
                height: 52,
                background: 'rgba(249,247,246,0.08)',
                border: '1px solid rgba(249,247,246,0.14)',
                borderRadius: '12px 0 0 12px',
                padding: '0 18px',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 15,
                color: C.cream,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                height: 52,
                padding: '0 22px',
                background: C.orange,
                color: 'white',
                border: 'none',
                borderRadius: '0 12px 12px 0',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Join waitlist
            </button>
          </form>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 12,
              color: 'rgba(249,247,246,0.28)',
              marginTop: 9,
            }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Footer + Footer ───────────────────────────────────── */

export function CTAFooter() {
  return (
    <section style={{ padding: '0 80px 80px', textAlign: 'center', position: 'relative' }}>
      <svg
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 60,
          zIndex: 0,
          opacity: 0.45,
        }}
        width="780"
        height="110"
        viewBox="0 0 780 110"
      >
        <ellipse cx="390" cy="78" rx="375" ry="65" fill={C.orange} />
      </svg>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
            color: 'rgba(30,58,47,0.38)',
            margin: '0 0 14px',
          }}
        >
          Get Started — it&apos;s Free
        </p>
        <H2 center style={{ fontSize: 70, lineHeight: 0.95, letterSpacing: '-0.048em', maxWidth: 'none', margin: '0 0 18px' }}>
          Elevate your team —
          <br />
          it pays off.
        </H2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 18,
            color: 'rgba(30,58,47,0.58)',
            maxWidth: 460,
            margin: '0 auto 36px',
            lineHeight: 1.55,
          }}
        >
          You need a system that keeps up. That&apos;s why we built MarketOS —
          where compensation follows contribution, transparently.
        </p>
        <Link
          className="l-btn-primary"
          href={APP_URL}
          style={{ height: 56, padding: '0 42px', fontSize: 17 }}
        >
          Start Free
        </Link>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer
      style={{
        padding: '28px 80px',
        borderTop: '1px solid rgba(30,58,47,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MkLogo size={20} />
        <span
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 14,
            color: C.muted,
          }}
        >
          © MarketOS 2026
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 14,
          color: C.muted,
        }}
      >
        Prototype · part of the Nexus portfolio
      </span>
    </footer>
  );
}
