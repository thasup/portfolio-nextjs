/**
 * MarketOS prototype root layout.
 *
 * Wraps every `/prototypes/market-os/*` page in a `[data-marketos]`
 * scope so the palette in `src/styles/palettes/marketos.css` activates
 * cleanly without leaking tokens to the rest of the Nexus portfolio.
 *
 * The Nexus global Navbar and Footer are suppressed for any
 * `/prototypes/*` route — see the early-return in
 * `src/components/layout/Navbar.tsx` and `Footer.tsx`. The prototype
 * supplies its own chrome (landing nav, app sidebar).
 *
 * Fonts are loaded via `next/font` inside this subtree only.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  bricolage,
  dmSans,
  permanentMarker,
} from '@/lib/prototypes/market-os/fonts';

export const metadata: Metadata = {
  title: 'MarketOS — Work as a market',
  description:
    'A prototype of an internal market for work. Posts revenue-funded missions, lets people bid, and replaces opaque comp negotiations with a visible track record.',
};

export default function MarketOSLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-marketos
      className={`${bricolage.variable} ${dmSans.variable} ${permanentMarker.variable}`}
      style={{
        minHeight: '100vh',
        // expose font variables to inline-styled descendants
        fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
