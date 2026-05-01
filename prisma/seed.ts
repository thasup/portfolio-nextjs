/**
 * MarketOS demo seed.
 *
 * Idempotent: re-running on a populated DB is safe. Every domain row uses
 * a deterministic UUID derived from a stable string key, so reruns hit
 * `INSERT … ON CONFLICT DO NOTHING` paths instead of duplicating data.
 *
 * What this script produces:
 *   - One MarketOS org: `nexus` (the public demo).
 *   - Its `marketos_org_settings` row.
 *   - 5 `marketos_revenue_periods` (4 closed + 1 current).
 *   - 12 `marketos_members` (each backed by a deterministic auth.users row
 *     created via the Supabase Admin API).
 *   - 16 `marketos_missions` across all five statuses.
 *   - ~50 `marketos_bids`.
 *   - ~10 `marketos_payouts` (one per accepted bid).
 *   - 6 `marketos_reviews` for completed missions.
 *   - 10 `marketos_notifications` for one demo viewer.
 *
 * Run with:    npm run db:seed
 *
 * Required env (loaded by `tsx --env-file=.env.local`):
 *   - DATABASE_URL                          (Prisma)
 *   - DIRECT_URL                            (Prisma migrations only)
 *   - NEXT_PUBLIC_SUPABASE_URL              (Supabase Admin)
 *   - SUPABASE_SERVICE_ROLE_KEY             (Supabase Admin)
 */
import { createHash, randomBytes } from 'node:crypto';
import { PrismaClient, Prisma } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const NS_ORG_SLUG = 'nexus';
const SEED_EMAIL_DOMAIN = 'seed.marketos.demo';

// =============================================================================
// Determinism helpers
// =============================================================================

/** Deterministic UUID v4-shaped string from a seed key. */
function uuid(key: string): string {
  const h = createHash('sha256').update(`marketos-seed:${key}`).digest('hex');
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    '4' + h.slice(13, 16),
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16) + h.slice(18, 20),
    h.slice(20, 32),
  ].join('-');
}

const dollarsToCents = (n: number): bigint => BigInt(Math.round(n * 100));

// =============================================================================
// Seed data
// =============================================================================

interface SeedMember {
  key: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'member';
  title: string;
  bio: string;
  skills: string[];
  baseCompUsd: number;
}

const MEMBERS: SeedMember[] = [
  { key: 'maya',    email: 'maya@'    + SEED_EMAIL_DOMAIN, displayName: 'Maya Patel',     role: 'owner',  title: 'Founder & CEO',          bio: 'Founded Nexus. Believes in transparent compensation.', skills: ['Leadership','Strategy','Design'], baseCompUsd: 6000 },
  { key: 'kenji',   email: 'kenji@'   + SEED_EMAIL_DOMAIN, displayName: 'Kenji Sato',     role: 'admin',  title: 'Head of Engineering',    bio: 'Distributed systems, internal tooling.',               skills: ['Engineering','Architecture','TypeScript'], baseCompUsd: 5500 },
  { key: 'sarah',   email: 'sarah@'   + SEED_EMAIL_DOMAIN, displayName: 'Sarah Lin',      role: 'admin',  title: 'Design Director',        bio: 'Brand systems and product UX.',                        skills: ['Design','Brand','Figma'], baseCompUsd: 5200 },
  { key: 'alex',    email: 'alex@'    + SEED_EMAIL_DOMAIN, displayName: 'Alex Rivera',    role: 'member', title: 'Product Designer',       bio: 'Onboarding flows, design systems.',                    skills: ['Design','Figma','Prototyping','User Research'], baseCompUsd: 4200 },
  { key: 'priya',   email: 'priya@'   + SEED_EMAIL_DOMAIN, displayName: 'Priya Desai',    role: 'member', title: 'Senior Engineer',        bio: 'Backend, infra, CI/CD.',                               skills: ['Engineering','Node.js','Postgres','AWS'], baseCompUsd: 4800 },
  { key: 'jordan',  email: 'jordan@'  + SEED_EMAIL_DOMAIN, displayName: 'Jordan Kim',     role: 'member', title: 'UX Researcher',          bio: 'Qualitative research, interview synthesis.',           skills: ['Research','Interviews','Analysis'], baseCompUsd: 4000 },
  { key: 'taylor',  email: 'taylor@'  + SEED_EMAIL_DOMAIN, displayName: 'Taylor Owens',   role: 'member', title: 'Frontend Engineer',      bio: 'React, animations, perf.',                              skills: ['Engineering','React','TypeScript','CSS'], baseCompUsd: 4400 },
  { key: 'rohan',   email: 'rohan@'   + SEED_EMAIL_DOMAIN, displayName: 'Rohan Mehta',    role: 'member', title: 'Marketing Lead',         bio: 'Growth and content.',                                  skills: ['Marketing','Content','SEO'], baseCompUsd: 4100 },
  { key: 'lila',    email: 'lila@'    + SEED_EMAIL_DOMAIN, displayName: 'Lila Brennan',   role: 'member', title: 'People Operations',      bio: 'Hiring, onboarding, comp design.',                     skills: ['HR','Operations','Hiring'], baseCompUsd: 3900 },
  { key: 'devon',   email: 'devon@'   + SEED_EMAIL_DOMAIN, displayName: 'Devon Park',     role: 'member', title: 'Data Engineer',          bio: 'Analytics, dashboards, dbt.',                           skills: ['Engineering','SQL','dbt','Python'], baseCompUsd: 4500 },
  { key: 'mira',    email: 'mira@'    + SEED_EMAIL_DOMAIN, displayName: 'Mira Cohen',     role: 'member', title: 'Brand Designer',         bio: 'Logos, illustration, motion.',                          skills: ['Design','Illustration','Motion'], baseCompUsd: 4000 },
  { key: 'sam',     email: 'sam@'     + SEED_EMAIL_DOMAIN, displayName: 'Sam Doyle',      role: 'member', title: 'Operations Analyst',     bio: 'Process design and metrics.',                           skills: ['Operations','Process','Analytics'], baseCompUsd: 3800 },
];

interface SeedRevenuePeriod {
  key: string;
  label: string;
  start: string;
  end: string;
  revenueUsd: number;
  isCurrent: boolean;
}

const REVENUE_PERIODS: SeedRevenuePeriod[] = [
  { key: 'q3-2024', label: 'Q3 2024', start: '2024-07-01', end: '2024-09-30', revenueUsd: 420_000, isCurrent: false },
  { key: 'q4-2024', label: 'Q4 2024', start: '2024-10-01', end: '2024-12-31', revenueUsd: 470_000, isCurrent: false },
  { key: 'q1-2025', label: 'Q1 2025', start: '2025-01-01', end: '2025-03-31', revenueUsd: 510_000, isCurrent: false },
  { key: 'q2-2025', label: 'Q2 2025', start: '2025-04-01', end: '2025-06-30', revenueUsd: 560_000, isCurrent: false },
  { key: 'q3-2025', label: 'Q3 2025', start: '2025-07-01', end: '2025-09-30', revenueUsd: 600_000, isCurrent: true  },
];

type Category = 'Design' | 'Engineering' | 'Research' | 'Marketing' | 'HR' | 'Operations';
type MissionStatus = 'open' | 'active' | 'delivered' | 'completed' | 'cancelled';

interface SeedMission {
  key: string;
  posterKey: string;
  title: string;
  description: string;
  category: Category;
  deliverables: string[];
  budgetUsd: number;
  /** Days from "today" (negative = past, positive = future). */
  deadlineOffsetDays: number;
  /** Days since posted. */
  postedDaysAgo: number;
  status: MissionStatus;
  /** key of the accepted bidder, if status >= active */
  acceptedBidderKey?: string;
  /** pool period this mission's payout debits */
  periodKey: string;
}

const MISSIONS: SeedMission[] = [
  // ---------- 6 OPEN ----------
  { key: 'm-onboarding-redesign', posterKey: 'sarah', title: 'Redesign the onboarding flow',
    description: 'New users currently churn at 38% during onboarding. Redesign the 4-step flow with clearer progress, fewer fields, and a celebratory completion state. We have user research to draw from.',
    category: 'Design', deliverables: ['Hi-fi Figma prototype','Updated component library','Accessibility audit'],
    budgetUsd: 6500, deadlineOffsetDays: 21, postedDaysAgo: 3, status: 'open', periodKey: 'q3-2025' },
  { key: 'm-billing-refactor', posterKey: 'kenji', title: 'Refactor the billing service',
    description: 'The legacy billing module is monolithic and hard to test. Extract subscription, invoicing, and dunning into separate services with clear interfaces. Coverage must be ≥85%.',
    category: 'Engineering', deliverables: ['Architecture proposal','Phased migration plan','New service implementations','Test suite'],
    budgetUsd: 12000, deadlineOffsetDays: 35, postedDaysAgo: 2, status: 'open', periodKey: 'q3-2025' },
  { key: 'm-pricing-research', posterKey: 'rohan', title: 'Pricing research for enterprise tier',
    description: '12 customer interviews, segment-level willingness-to-pay analysis, and a recommendation deck for the leadership review.',
    category: 'Research', deliverables: ['Interview synthesis','WTP analysis','Recommendation deck'],
    budgetUsd: 4500, deadlineOffsetDays: 14, postedDaysAgo: 5, status: 'open', periodKey: 'q3-2025' },
  { key: 'm-launch-content', posterKey: 'rohan', title: 'Q4 launch content series',
    description: 'Three long-form posts and 12 social cuts for the November launch. SEO-optimised, brand-voiced.',
    category: 'Marketing', deliverables: ['3 blog posts','12 social posts','SEO audit'],
    budgetUsd: 3800, deadlineOffsetDays: 28, postedDaysAgo: 1, status: 'open', periodKey: 'q3-2025' },
  { key: 'm-hiring-rubrics', posterKey: 'lila', title: 'Engineering interview rubrics',
    description: 'Calibrated scoring rubrics for our four-stage engineering loop. Pilot with 3 candidates and iterate.',
    category: 'HR', deliverables: ['Stage-specific rubrics','Calibration training deck','Pilot results'],
    budgetUsd: 2800, deadlineOffsetDays: 18, postedDaysAgo: 6, status: 'open', periodKey: 'q3-2025' },
  { key: 'm-revops-dashboard', posterKey: 'sam', title: 'RevOps weekly dashboard',
    description: 'A single dashboard with pipeline, ARR, churn, and forecast accuracy — refreshed automatically every Monday.',
    category: 'Operations', deliverables: ['Data model','dbt models','Looker dashboard'],
    budgetUsd: 5200, deadlineOffsetDays: 24, postedDaysAgo: 4, status: 'open', periodKey: 'q3-2025' },

  // ---------- 4 ACTIVE (accepted bid, mid-flight) ----------
  { key: 'm-design-tokens', posterKey: 'sarah', title: 'Migrate to design tokens',
    description: 'Replace ad-hoc design values with a token system. Auto-generated CSS + TS exports.',
    category: 'Design', deliverables: ['Token schema','Build pipeline','Migration of 4 surfaces'],
    budgetUsd: 5500, deadlineOffsetDays: 12, postedDaysAgo: 18, status: 'active', acceptedBidderKey: 'alex', periodKey: 'q3-2025' },
  { key: 'm-perf-budget', posterKey: 'kenji', title: 'Set up performance budgets in CI',
    description: 'Lighthouse + bundle-size gates that fail PRs which regress.',
    category: 'Engineering', deliverables: ['CI workflow','Threshold doc','Sample PR demonstrating block'],
    budgetUsd: 4200, deadlineOffsetDays: 7, postedDaysAgo: 14, status: 'active', acceptedBidderKey: 'taylor', periodKey: 'q3-2025' },
  { key: 'm-customer-jtbd', posterKey: 'maya', title: 'JTBD interviews with churned customers',
    description: '8 interviews + thematic synthesis. We need to know why mid-market churns.',
    category: 'Research', deliverables: ['Interview transcripts','JTBD map','Recommendations'],
    budgetUsd: 3600, deadlineOffsetDays: 10, postedDaysAgo: 11, status: 'active', acceptedBidderKey: 'jordan', periodKey: 'q3-2025' },
  { key: 'm-brand-refresh', posterKey: 'sarah', title: 'Brand refresh: type & motion',
    description: 'Pick a new typeface, define motion principles, ship a brand guidelines doc.',
    category: 'Design', deliverables: ['Type system','Motion principles','Guidelines PDF'],
    budgetUsd: 7000, deadlineOffsetDays: 20, postedDaysAgo: 8, status: 'active', acceptedBidderKey: 'mira', periodKey: 'q3-2025' },

  // ---------- 2 DELIVERED (awaiting completion + review) ----------
  { key: 'm-data-warehouse', posterKey: 'kenji', title: 'Stand up the data warehouse',
    description: 'Snowflake + dbt + dashboards. Migrate from the ad-hoc Postgres replica.',
    category: 'Engineering', deliverables: ['Warehouse setup','dbt models','3 dashboards'],
    budgetUsd: 9000, deadlineOffsetDays: -2, postedDaysAgo: 32, status: 'delivered', acceptedBidderKey: 'devon', periodKey: 'q3-2025' },
  { key: 'm-comp-bands', posterKey: 'maya', title: 'Comp banding refresh for IC4–IC6',
    description: 'Calibrate against latest market data; ensure internal equity.',
    category: 'HR', deliverables: ['Banding doc','Migration plan','FAQ'],
    budgetUsd: 3200, deadlineOffsetDays: -1, postedDaysAgo: 22, status: 'delivered', acceptedBidderKey: 'lila', periodKey: 'q3-2025' },

  // ---------- 4 COMPLETED (with reviews) ----------
  { key: 'm-marketing-site-q2', posterKey: 'rohan', title: 'New marketing site (Q2 2025)',
    description: 'Replaced the legacy marketing site with a modern Next.js build. Conversion lifted 23%.',
    category: 'Marketing', deliverables: ['New site','CMS','Analytics'],
    budgetUsd: 8500, deadlineOffsetDays: -45, postedDaysAgo: 90, status: 'completed', acceptedBidderKey: 'taylor', periodKey: 'q2-2025' },
  { key: 'm-design-system-v1', posterKey: 'sarah', title: 'Design system v1',
    description: 'First release of the shared component library.',
    category: 'Design', deliverables: ['12 base components','Docs site','Storybook'],
    budgetUsd: 7200, deadlineOffsetDays: -60, postedDaysAgo: 110, status: 'completed', acceptedBidderKey: 'alex', periodKey: 'q1-2025' },
  { key: 'm-okr-process', posterKey: 'maya', title: 'Quarterly OKR process design',
    description: 'A simple, low-overhead OKR cadence the whole company actually uses.',
    category: 'Operations', deliverables: ['Process doc','Templates','Pilot results'],
    budgetUsd: 2400, deadlineOffsetDays: -30, postedDaysAgo: 75, status: 'completed', acceptedBidderKey: 'sam', periodKey: 'q2-2025' },
  { key: 'm-hiring-pipeline', posterKey: 'lila', title: 'Hiring pipeline analytics',
    description: 'Dashboard showing pass-through rates per stage; aging inventory; loop calibration.',
    category: 'HR', deliverables: ['Dashboard','Weekly digest','Process tweaks'],
    budgetUsd: 3000, deadlineOffsetDays: -22, postedDaysAgo: 60, status: 'completed', acceptedBidderKey: 'devon', periodKey: 'q2-2025' },
];

interface SeedBidderEntry {
  bidderKey: string;
  amountUsd: number;
  proposal: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'declined' | 'withdrawn';
  daysAgo: number;
}

/** Bids per mission. The accepted one (if any) is filled in automatically. */
const EXTRA_BIDS_BY_MISSION: Record<string, SeedBidderEntry[]> = {
  'm-onboarding-redesign': [
    { bidderKey: 'alex',  amountUsd: 6200, proposal: 'I led the v1 redesign last cycle and have the user research already synthesised.', status: 'shortlisted', daysAgo: 2 },
    { bidderKey: 'mira',  amountUsd: 6800, proposal: 'Visual + motion polish on top of the existing IA.', status: 'pending', daysAgo: 1 },
  ],
  'm-billing-refactor': [
    { bidderKey: 'priya',  amountUsd: 11500, proposal: 'I wrote the original module; well-positioned to deconstruct it cleanly.', status: 'shortlisted', daysAgo: 1 },
    { bidderKey: 'taylor', amountUsd: 12500, proposal: 'Pair-engineer with Priya on the API layer.', status: 'pending', daysAgo: 1 },
  ],
  'm-pricing-research': [
    { bidderKey: 'jordan', amountUsd: 4400, proposal: 'I have the customer panel ready and the WTP framework already templated.', status: 'pending', daysAgo: 4 },
  ],
  'm-launch-content': [
    { bidderKey: 'alex',   amountUsd: 3700, proposal: 'I will own this end-to-end and coordinate the copy, visuals, and launch cadence.', status: 'withdrawn', daysAgo: 1 },
    { bidderKey: 'mira',   amountUsd: 4000, proposal: 'Visual cuts + motion for socials.', status: 'pending', daysAgo: 1 },
  ],
  'm-hiring-rubrics': [
    { bidderKey: 'rohan',  amountUsd: 2700, proposal: 'I will run the calibrations.', status: 'pending', daysAgo: 5 },
  ],
  'm-revops-dashboard': [
    { bidderKey: 'devon',  amountUsd: 5100, proposal: 'I have the dbt models ready.', status: 'shortlisted', daysAgo: 3 },
    { bidderKey: 'jordan', amountUsd: 5400, proposal: 'I can pair with Devon on the dashboard surface.', status: 'pending', daysAgo: 2 },
  ],
};

interface SeedNotification {
  key: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  daysAgo: number;
  hoursAgo?: number;
  read: boolean;
}

const NOTIFICATIONS_FOR_OWNER: SeedNotification[] = [
  { key: 'n-1', type: 'bid_received',     title: 'New bid on "Redesign the onboarding flow"', body: 'Mira Cohen bid $6,800 — proposal: "Visual + motion polish on top of the existing IA."', link: '/prototypes/market-os/app/missions/m-onboarding-redesign', daysAgo: 0, hoursAgo: 4, read: false },
  { key: 'n-2', type: 'bid_received',     title: 'New bid on "Refactor the billing service"', body: 'Taylor Owens bid $12,500.', link: '/prototypes/market-os/app/missions/m-billing-refactor', daysAgo: 1, read: false },
  { key: 'n-3', type: 'mission_delivered',title: 'Mission delivered: "Stand up the data warehouse"', body: 'Devon Park has marked it delivered. Review when you can.', link: '/prototypes/market-os/app/missions/m-data-warehouse', daysAgo: 1, read: false },
  { key: 'n-4', type: 'mission_delivered',title: 'Mission delivered: "Comp banding refresh"', body: 'Lila Brennan has marked it delivered.', link: '/prototypes/market-os/app/missions/m-comp-bands', daysAgo: 2, read: true },
  { key: 'n-5', type: 'mission_completed',title: 'Mission completed: "Hiring pipeline analytics"', body: 'You confirmed completion. $3,000 scheduled to Devon.', daysAgo: 8, read: true },
  { key: 'n-6', type: 'reputation_up',    title: 'Reputation up to 612', body: 'You moved from gold to gold (still). Keep going!', daysAgo: 8, read: true },
  { key: 'n-7', type: 'pool_period_closed', title: 'Q2 2025 closed — Q3 pool live', body: 'The Q3 2025 pool is $270k. Allocations carry forward; unallocated rolled over.', daysAgo: 27, read: true },
  { key: 'n-8', type: 'payout_released',  title: 'Payout released: $2,400', body: 'Q2 OKR process design — paid to Sam Doyle.', daysAgo: 14, read: true },
  { key: 'n-9', type: 'mission_posted',   title: 'New mission in your category: "Pricing research"', body: 'Posted by Rohan — $4,500 budget.', link: '/prototypes/market-os/app/missions/m-pricing-research', daysAgo: 5, read: true },
  { key: 'n-10', type: 'bid_shortlisted', title: 'You were shortlisted', body: 'Sarah Lin shortlisted your bid on "Brand refresh".', daysAgo: 8, read: true },
];

// =============================================================================
// Supabase admin: ensure auth.users for each seed member
// =============================================================================

function createAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('Seed: NEXT_PUBLIC_SUPABASE_URL is required.');
  if (!key) throw new Error('Seed: SUPABASE_SERVICE_ROLE_KEY is required.');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function ensureAuthUsers(admin: SupabaseClient): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  // Fetch existing users to avoid the 422 "already registered" failure path.
  // Supabase paginates at 1000 by default; we have 12 members.
  const { data: existing, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  const byEmail = new Map(existing.users.map((u) => [u.email?.toLowerCase() ?? '', u.id]));

  for (const m of MEMBERS) {
    const found = byEmail.get(m.email.toLowerCase());
    if (found) {
      result.set(m.key, found);
      continue;
    }
    const password = randomBytes(24).toString('hex');
    const { data, error: createErr } = await admin.auth.admin.createUser({
      email: m.email,
      email_confirm: true,
      password,
      user_metadata: { seed: 'marketos', display_name: m.displayName },
    });
    if (createErr || !data.user) {
      throw new Error(`Seed: failed to create ${m.email}: ${createErr?.message ?? 'no user returned'}`);
    }
    result.set(m.key, data.user.id);
    process.stdout.write(`  + auth.users ${m.email}\n`);
  }
  return result;
}

// =============================================================================
// Main seed
// =============================================================================

async function main() {
  console.log('▶ MarketOS seed — starting');
  const admin = createAdmin();

  console.log('· Ensuring auth.users for seed members…');
  const userIdByMember = await ensureAuthUsers(admin);

  // ---------- 1. Org ----------
  const ORG_ID = uuid(`org:${NS_ORG_SLUG}`);
  const owner = MEMBERS.find((m) => m.role === 'owner')!;
  await prisma.marketosOrg.upsert({
    where: { id: ORG_ID },
    update: { name: 'Nexus' },
    create: {
      id: ORG_ID,
      slug: NS_ORG_SLUG,
      name: 'Nexus',
      currency: 'USD',
      createdBy: userIdByMember.get(owner.key),
    },
  });
  console.log('· Upserted org Nexus');

  // ---------- 2. Org settings ----------
  await prisma.marketosOrgSettings.upsert({
    where: { orgId: ORG_ID },
    update: {},
    create: {
      orgId: ORG_ID,
      payrollRatioPct: 45,
      baseSplitPct: 60,
      period: 'quarter',
      accent: 'orange',
      darkMode: false,
    },
  });

  // ---------- 3. Members ----------
  const memberIdByKey = new Map<string, string>();
  for (const m of MEMBERS) {
    const memberId = uuid(`member:${NS_ORG_SLUG}:${m.key}`);
    memberIdByKey.set(m.key, memberId);
    await prisma.marketosMember.upsert({
      where: { id: memberId },
      update: {
        displayName: m.displayName,
        title: m.title,
        bio: m.bio,
        skills: m.skills,
        baseCompCents: dollarsToCents(m.baseCompUsd),
        role: m.role,
      },
      create: {
        id: memberId,
        orgId: ORG_ID,
        userId: userIdByMember.get(m.key)!,
        role: m.role,
        displayName: m.displayName,
        title: m.title,
        bio: m.bio,
        skills: m.skills,
        baseCompCents: dollarsToCents(m.baseCompUsd),
      },
    });
  }
  console.log(`· Upserted ${MEMBERS.length} members`);

  // ---------- 4. Revenue periods ----------
  const periodIdByKey = new Map<string, string>();
  for (const p of REVENUE_PERIODS) {
    const periodId = uuid(`period:${NS_ORG_SLUG}:${p.key}`);
    periodIdByKey.set(p.key, periodId);
    await prisma.marketosRevenuePeriod.upsert({
      where: { id: periodId },
      update: {
        revenueCents: dollarsToCents(p.revenueUsd),
        isCurrent: p.isCurrent,
        closedAt: p.isCurrent ? null : new Date(p.end + 'T23:59:59Z'),
      },
      create: {
        id: periodId,
        orgId: ORG_ID,
        period: 'quarter',
        periodLabel: p.label,
        periodStart: new Date(p.start),
        periodEnd: new Date(p.end),
        revenueCents: dollarsToCents(p.revenueUsd),
        payrollRatioPct: 45,
        baseSplitPct: 60,
        isCurrent: p.isCurrent,
        closedAt: p.isCurrent ? null : new Date(p.end + 'T23:59:59Z'),
      },
    });
  }
  console.log(`· Upserted ${REVENUE_PERIODS.length} revenue periods`);

  // ---------- 5. Missions + bids + payouts + reviews ----------
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const dateOffsetDays = (offsetDays: number) =>
    new Date(now + offsetDays * dayMs);

  for (const m of MISSIONS) {
    const missionId = uuid(`mission:${m.key}`);
    const posterMemberId = memberIdByKey.get(m.posterKey)!;
    const createdAt = dateOffsetDays(-m.postedDaysAgo);
    const deadline = dateOffsetDays(m.deadlineOffsetDays);

    // We create the mission first WITHOUT acceptedBidId; we'll set it later
    // after the accepted bid exists.
    await prisma.marketosMission.upsert({
      where: { id: missionId },
      update: { title: m.title, description: m.description, deliverables: m.deliverables as Prisma.InputJsonValue },
      create: {
        id: missionId,
        orgId: ORG_ID,
        posterId: posterMemberId,
        title: m.title,
        slug: m.key,
        description: m.description,
        category: m.category,
        deliverables: m.deliverables as Prisma.InputJsonValue,
        budgetCents: dollarsToCents(m.budgetUsd),
        deadline,
        status: m.status === 'open' ? 'open' : m.status === 'cancelled' ? 'cancelled' : 'open',
        createdAt,
      },
    });

    // Build the bid set: extras + (if accepted) the winning bid.
    const extras = EXTRA_BIDS_BY_MISSION[m.key] ?? [];
    const allBids: SeedBidderEntry[] = [...extras];
    if (m.acceptedBidderKey) {
      // Winning bid amount = budget minus a small concession (5%).
      const winningAmount = Math.round(m.budgetUsd * 0.95);
      allBids.push({
        bidderKey: m.acceptedBidderKey,
        amountUsd: winningAmount,
        proposal: 'I am the right fit for this — see attached prior work and timeline.',
        status: 'accepted',
        daysAgo: Math.max(1, m.postedDaysAgo - 2),
      });
    }

    // Guard: if the seed declared an accepted bidder who is the poster, the
    // self-bid skip below would silently produce a status='active' mission
    // with no accepted_bid_id, violating
    // marketos_missions_accepted_consistency. Fail fast with a clear message.
    if (m.acceptedBidderKey && m.acceptedBidderKey === m.posterKey) {
      throw new Error(
        `Seed misconfiguration on mission "${m.key}": acceptedBidderKey ` +
          `("${m.acceptedBidderKey}") is the same as posterKey. A member ` +
          `cannot bid on their own mission — pick a different poster or bidder.`,
      );
    }

    let acceptedBidId: string | null = null;
    for (const b of allBids) {
      const bidderMemberId = memberIdByKey.get(b.bidderKey);
      if (!bidderMemberId) continue;
      // Skip self-bids (the trigger would reject them anyway)
      if (bidderMemberId === posterMemberId) continue;

      // Fail-fast guard: double-check we're not about to create a self-bid
      if (b.bidderKey === m.posterKey) {
        throw new Error(
          `Seed misconfiguration: mission "${m.key}" has bidder "${b.bidderKey}" ` +
            `who is the same as the poster. Self-bids are not allowed.`,
        );
      }

      const bidId = uuid(`bid:${m.key}:${b.bidderKey}`);
      const submittedAt = dateOffsetDays(-b.daysAgo);
      const decided = b.status !== 'pending';
      await prisma.marketosBid.upsert({
        where: { id: bidId },
        update: { status: b.status, amountCents: dollarsToCents(b.amountUsd) },
        create: {
          id: bidId,
          missionId,
          bidderId: bidderMemberId,
          amountCents: dollarsToCents(b.amountUsd),
          proposal: b.proposal,
          status: b.status,
          submittedAt,
          decidedAt: decided ? dateOffsetDays(-Math.max(0, b.daysAgo - 1)) : null,
          decidedBy: decided ? posterMemberId : null,
        },
      });
      if (b.status === 'accepted') acceptedBidId = bidId;
    }

    // Now finalise the mission's status + accepted_bid_id + delivery / completion.
    //
    // We use `MarketosMissionUncheckedUpdateInput` (the "unchecked" variant)
    // so we can set the `acceptedBidId` scalar directly. The "checked" input
    // would force us through `acceptedBid: { connect: { id } }`, which Prisma
    // is free to split into a separate UPDATE — and the
    // `marketos_missions_accepted_consistency` check constraint is evaluated
    // *between* those statements, failing because `status` flipped to
    // 'active' while `accepted_bid_id` was still null.
    const updates: Prisma.MarketosMissionUncheckedUpdateInput = {
      status: m.status,
    };
    if (acceptedBidId) updates.acceptedBidId = acceptedBidId;
    if (m.status === 'delivered' || m.status === 'completed') {
      updates.deliveredAt = dateOffsetDays(-Math.max(1, Math.abs(m.deadlineOffsetDays)));
    }
    if (m.status === 'completed') {
      updates.completedAt = dateOffsetDays(-Math.max(0, Math.abs(m.deadlineOffsetDays) - 1));
    }
    if (m.status === 'cancelled') {
      updates.cancelledAt = dateOffsetDays(-Math.max(1, m.postedDaysAgo - 1));
    }
    await prisma.marketosMission.update({ where: { id: missionId }, data: updates });

    // Payout for the accepted bid (active / delivered / completed).
    if (acceptedBidId && (m.status === 'active' || m.status === 'delivered' || m.status === 'completed')) {
      const winningAmount = Math.round(m.budgetUsd * 0.95);
      const payoutId = uuid(`payout:${m.key}`);
      const scheduledFor = dateOffsetDays(m.deadlineOffsetDays + 7);
      const released = m.status === 'completed';
      const recipient = memberIdByKey.get(m.acceptedBidderKey!)!;
      await prisma.marketosPayout.upsert({
        where: { id: payoutId },
        update: { status: released ? 'released' : 'scheduled' },
        create: {
          id: payoutId,
          bidId: acceptedBidId,
          missionId,
          orgId: ORG_ID,
          recipientMemberId: recipient,
          amountCents: dollarsToCents(winningAmount),
          revenuePeriodId: periodIdByKey.get(m.periodKey)!,
          scheduledFor,
          status: released ? 'released' : 'scheduled',
          releasedAt: released ? dateOffsetDays(m.deadlineOffsetDays + 8) : null,
        },
      });

      // Review for completed missions.
      if (m.status === 'completed') {
        const reviewId = uuid(`review:${m.key}`);
        await prisma.marketosReview.upsert({
          where: { id: reviewId },
          update: {},
          create: {
            id: reviewId,
            missionId,
            reviewerId: posterMemberId,
            revieweeId: recipient,
            direction: 'poster_to_contributor',
            rating: 4 + (m.key.length % 2), // 4 or 5
            feedback: 'Delivered on spec, on time. Strong communication throughout.',
            createdAt: dateOffsetDays(m.deadlineOffsetDays + 2),
          },
        });
      }
    }
  }
  console.log(`· Upserted ${MISSIONS.length} missions (+ bids, payouts, reviews)`);

  // ---------- 6. Notifications for the owner (the demo "viewer") ----------
  const ownerMemberId = memberIdByKey.get(owner.key)!;
  for (const n of NOTIFICATIONS_FOR_OWNER) {
    const notifId = uuid(`notif:${n.key}`);
    const createdAt = new Date(now - (n.daysAgo * dayMs + (n.hoursAgo ?? 0) * 60 * 60 * 1000));
    await prisma.marketosNotification.upsert({
      where: { id: notifId },
      update: {},
      create: {
        id: notifId,
        orgId: ORG_ID,
        memberId: ownerMemberId,
        type: n.type,
        title: n.title,
        body: n.body,
        link: n.link,
        readAt: n.read ? createdAt : null,
        createdAt,
      },
    });
  }
  console.log(`· Upserted ${NOTIFICATIONS_FOR_OWNER.length} notifications`);

  console.log('✔ MarketOS seed complete');
}

main()
  .catch((err) => {
    console.error('✖ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
