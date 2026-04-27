'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MkLogo } from '@/components/prototypes/market-os/primitives/MkLogo';

const APP_URL = '/prototypes/market-os/app/dashboard';

/**
 * Sticky landing nav that fades in a glass background after the user
 * scrolls past the hero. Faithful port of the original prototype's
 * `Nav` component, retargeted to Next.js routes.
 */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 56px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(249,247,246,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(30,58,47,0.07)' : 'none',
        transition: 'all 0.25s',
      }}
    >
      <Link
        href="/prototypes/market-os"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <MkLogo size={28} />
        <span
          style={{
            fontFamily: 'var(--font-bricolage), sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--mk-dark)',
            letterSpacing: '-0.03em',
          }}
        >
          MarketOS
        </span>
      </Link>

      <div style={{ display: 'flex', gap: 32 }}>
        {[
          { label: 'How it works', href: '#how' },
          { label: 'Features', href: '#what' },
          { label: 'Who', href: '#who' },
        ].map((l) => (
          <a key={l.label} className="l-nav-link" href={l.href}>
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link
          className="l-btn-ghost"
          href={APP_URL}
          style={{ height: 40, padding: '0 20px', fontSize: 14 }}
        >
          Log in
        </Link>
        <Link
          className="l-btn-primary"
          href={APP_URL}
          style={{ height: 40, padding: '0 22px', fontSize: 14 }}
        >
          Request Access
        </Link>
      </div>
    </nav>
  );
}
