/**
 * MarketOS app shell — sidebar + scrollable main column.
 *
 * Hosts every authenticated-style screen under
 * `/prototypes/market-os/app/*`. The sidebar is sticky and full
 * viewport-height; the main column owns its own scroll.
 */
import type { ReactNode } from 'react';
import { Sidebar } from '@/components/prototypes/market-os/app/Sidebar';

export default function MarketOSAppLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--mk-cream)',
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
