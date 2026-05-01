/**
 * Diagnostic: hits every MarketOS query the way Server Components do.
 * Confirms that Phase 2 wiring works end-to-end against the real DB.
 *
 * Run: `npx tsx --env-file=.env.local scripts/check-marketos-queries.ts`.
 */
// Stub `server-only` for the diagnostic; the real package is a no-op
// outside Next.js anyway and only enforces compile-time boundaries.
import { Module } from 'node:module';
const _resolve = (Module as unknown as { _resolveFilename: (req: string, p: NodeJS.Module) => string })._resolveFilename;
(Module as unknown as { _resolveFilename: (req: string, p: NodeJS.Module) => string })._resolveFilename = (req, parent) =>
  req === 'server-only' ? require.resolve('node:os') : _resolve(req, parent);

import { getOrgBySlug, getOrgSettings } from '@/lib/marketos/queries/orgs';
import {
  countActiveMissionCategories,
  countActiveMissions,
  getMissionBySlugOrId,
  listMissions,
} from '@/lib/marketos/queries/missions';
import {
  getBidRate,
  listBidsForMission,
  listMyBids,
} from '@/lib/marketos/queries/bids';
import {
  getMemberMissionHistory,
  getMemberWithStats,
  listLeaderboard,
} from '@/lib/marketos/queries/members';
import {
  getCurrentPool,
  getPoolHistory,
  getUpcomingPayouts,
} from '@/lib/marketos/queries/pool';
import { listNotifications } from '@/lib/marketos/queries/notifications';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';

async function main() {
  console.log('--- ORG ---');
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  console.log(org);
  if (!org) throw new Error('No org found for slug ' + DEMO_ORG_SLUG);

  console.log('\n--- ORG SETTINGS ---');
  console.log(await getOrgSettings(org.id));

  console.log('\n--- POOL ---');
  const pool = await getCurrentPool(org.id);
  console.log(pool);

  console.log('\n--- POOL HISTORY ---');
  const history = await getPoolHistory(org.id);
  console.log(`history rows: ${history.length}`, history[0]);

  console.log('\n--- UPCOMING PAYOUTS ---');
  const payouts = await getUpcomingPayouts(org.id);
  console.log(`payouts: ${payouts.length}`, payouts[0]);

  console.log('\n--- MISSIONS ---');
  const missions = await listMissions(org.id, { limit: 5 });
  console.log(`missions: ${missions.length}`);
  console.log(missions.map((m) => `${m.status}: ${m.title} ($${m.budgetUsd})`));

  console.log('\n--- ACTIVE COUNTS ---');
  console.log({
    active: await countActiveMissions(org.id),
    cats: await countActiveMissionCategories(org.id),
  });

  console.log('\n--- MISSION DETAIL ---');
  const first = missions[0];
  if (first) {
    const detail = await getMissionBySlugOrId(org.id, first.slug);
    console.log(detail?.title, detail?.posterName);
    const bids = await listBidsForMission(first.id);
    console.log(`bids: ${bids.length}`, bids[0]);
  }

  console.log('\n--- LEADERBOARD ---');
  const lb = await listLeaderboard(org.id, { limit: 3 });
  console.log(lb.map((p) => `${p.displayName}: rep=${p.reputation} earned=$${p.totalEarnedUsd}`));

  console.log('\n--- MEMBER STATS (top member) ---');
  const top = lb[0];
  if (top) {
    console.log(await getMemberWithStats(top.id));
    const hist = await getMemberMissionHistory(top.id, { limit: 3 });
    console.log(`history: ${hist.length}`, hist[0]);
    const bids = await listMyBids(top.id);
    console.log(`my bids: ${bids.length}`, bids[0]);
    console.log('bid rate:', await getBidRate(top.id));
  }

  console.log('\n--- NOTIFICATIONS (top member) ---');
  if (top) {
    const notes = await listNotifications(top.id, { limit: 5 });
    console.log(`notifications: ${notes.length}`, notes[0]);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
