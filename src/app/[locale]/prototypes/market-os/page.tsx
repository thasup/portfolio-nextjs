/**
 * MarketOS landing page.
 *
 * Faithful port of the standalone HTML mockup (.windsurf/contents/
 * market_os/Landing.jsx) into App Router React Server Components.
 * Interactive scroll-state lives only in `LandingNav`.
 */
import { LandingNav } from '@/components/prototypes/market-os/landing/LandingNav';
import {
  Hero,
  WhySection,
  LoopSection,
  WhatChangesSection,
  WhoSection,
  TestimonialsSection,
  MissionOSTeaser,
  CTAFooter,
  LandingFooter,
} from '@/components/prototypes/market-os/landing/LandingSections';

export default function MarketOSLandingPage() {
  return (
    <div style={{ background: 'var(--mk-cream)', minHeight: '100vh' }}>
      <LandingNav />
      <Hero />
      <WhySection />
      <LoopSection />
      <WhatChangesSection />
      <WhoSection />
      <TestimonialsSection />
      <MissionOSTeaser />
      <CTAFooter />
      <LandingFooter />
    </div>
  );
}
