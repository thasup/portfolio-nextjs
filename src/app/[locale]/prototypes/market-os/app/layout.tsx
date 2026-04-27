/**
 * MarketOS app shell — sidebar + scrollable main column.
 *
 * Hosts every authenticated-style screen under
 * `/prototypes/market-os/app/*`. The sidebar is sticky and full
 * viewport-height; the main column owns its own scroll.
 *
 * The shell is a Server Component: it resolves the demo org and the
 * current pool composition once per request, then passes them into
 * the sidebar (which renders the pool widget) and exposes the org id
 * to nested pages via React's `cache()`-friendly query helpers.
 */
import type { ReactNode } from 'react';
import { Sidebar } from '@/components/prototypes/market-os/app/Sidebar';
import { getOrgBySlug } from '@/lib/marketos/queries/orgs';
import { getCurrentPool } from '@/lib/marketos/queries/pool';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';

export default async function MarketOSAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  const pool = org ? await getCurrentPool(org.id) : null;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--mk-cream)',
      }}
    >
      <Sidebar pool={pool} />
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
