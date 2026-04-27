-- =============================================================================
-- MarketOS — Member stats view + RLS policies + grants.
--
-- Implements:
--   - The `marketos_member_stats` view that powers reputation, on-time-rate,
--     specialty, total-earned, completed-count, tier (spec §6.6, §6.9).
--   - RLS enabled on every marketos_* table with policies that mirror the
--     application-layer rules (spec §7.3). Defense-in-depth: app code is
--     the primary boundary, but if anyone ever uses Supabase JS directly
--     against these tables, RLS prevents cross-tenant leakage.
--   - Grants: `authenticated` and `anon` get the minimum surface they need.
--
-- The Prisma client connects with elevated privileges and bypasses RLS by
-- design (per spec A5). This migration ensures the schema is *also* safe in
-- the absence of that contract.
-- =============================================================================

-- =============================================================================
-- 1. marketos_member_stats — the reputation engine
--
-- Read-only view; recomputes on every SELECT. For 50–500 member orgs this is
-- fast enough; if the leaderboard ever exceeds 10k members we can swap to a
-- materialized view + refresh trigger (see plan §3 T-406).
--
-- Reputation formula (spec §6.6):
--   completed * 30                            (cap 600 implicit at ~20 missions)
-- + on_time_pct * 2                           (cap 200 at 100% on-time)
-- + avg_rating * 40                           (cap 200 at 5.0)
-- = clamp [0, 1000]
--
-- Tier mapping (spec §6.6):
--   < 200      → bronze
--   < 500      → silver
--   < 800      → gold
--   < 1000     → platinum
--   >= 1000    → diamond
-- =============================================================================
drop view if exists marketos_member_stats;
create view marketos_member_stats as
with completed_missions as (
  select
    b.bidder_id                                 as member_id,
    m.id                                        as mission_id,
    m.category,
    m.deadline,
    m.completed_at,
    coalesce(p.amount_cents, 0)                 as earned_cents
  from marketos_bids b
  join marketos_missions m on m.id = b.mission_id
  left join marketos_payouts p on p.bid_id = b.id and p.status = 'released'
  where b.status = 'accepted' and m.status = 'completed'
),
per_member as (
  select
    member_id,
    count(*)::int                                                       as completed,
    sum(case when completed_at::date <= deadline then 1 else 0 end)::int as on_time,
    sum(earned_cents)::bigint                                            as total_earned_cents
  from completed_missions
  group by member_id
),
ratings as (
  select
    reviewee_id   as member_id,
    avg(rating)::numeric(4,2) as avg_rating,
    count(*)::int             as review_count
  from marketos_reviews
  where direction = 'poster_to_contributor'
  group by reviewee_id
),
specialty as (
  select distinct on (member_id)
    member_id,
    category as specialty
  from completed_missions
  where category is not null
  group by member_id, category
  order by member_id, count(*) desc, category asc
)
select
  mb.id                                                       as member_id,
  mb.org_id                                                   as org_id,
  coalesce(pm.completed, 0)                                   as completed,
  case
    when coalesce(pm.completed, 0) = 0 then null
    else round((100.0 * pm.on_time / pm.completed))::int
  end                                                         as on_time_pct,
  coalesce(pm.total_earned_cents, 0)::bigint                  as total_earned_cents,
  r.avg_rating,
  coalesce(r.review_count, 0)                                 as review_count,
  s.specialty,
  -- Reputation: clamp [0, 1000].
  least(
    1000,
    greatest(
      0,
      (coalesce(pm.completed, 0) * 30)
      + (case
          when pm.completed is null or pm.completed = 0 then 0
          else (100.0 * pm.on_time / pm.completed)::int * 2
        end)
      + coalesce((r.avg_rating * 40)::int, 0)
    )
  )::int                                                       as reputation,
  -- Tier mapping mirrors the formula's clamp.
  case
    when least(
      1000,
      greatest(
        0,
        (coalesce(pm.completed, 0) * 30)
        + (case
            when pm.completed is null or pm.completed = 0 then 0
            else (100.0 * pm.on_time / pm.completed)::int * 2
          end)
        + coalesce((r.avg_rating * 40)::int, 0)
      )
    )::int < 200 then 'bronze'
    when least(
      1000,
      greatest(
        0,
        (coalesce(pm.completed, 0) * 30)
        + (case
            when pm.completed is null or pm.completed = 0 then 0
            else (100.0 * pm.on_time / pm.completed)::int * 2
          end)
        + coalesce((r.avg_rating * 40)::int, 0)
      )
    )::int < 500 then 'silver'
    when least(
      1000,
      greatest(
        0,
        (coalesce(pm.completed, 0) * 30)
        + (case
            when pm.completed is null or pm.completed = 0 then 0
            else (100.0 * pm.on_time / pm.completed)::int * 2
          end)
        + coalesce((r.avg_rating * 40)::int, 0)
      )
    )::int < 800 then 'gold'
    when least(
      1000,
      greatest(
        0,
        (coalesce(pm.completed, 0) * 30)
        + (case
            when pm.completed is null or pm.completed = 0 then 0
            else (100.0 * pm.on_time / pm.completed)::int * 2
          end)
        + coalesce((r.avg_rating * 40)::int, 0)
      )
    )::int < 1000 then 'platinum'
    else 'diamond'
  end                                                          as tier
from marketos_members mb
left join per_member pm on pm.member_id = mb.id
left join ratings r    on r.member_id  = mb.id
left join specialty s  on s.member_id  = mb.id
where mb.removed_at is null;

comment on view marketos_member_stats is
  'Computed reputation / tier / on-time / earnings per active member. Reads from missions + bids + payouts + reviews. Single source of truth for spec §6.6 + §6.9.';

-- =============================================================================
-- 2. Row-Level Security
-- =============================================================================
alter table marketos_orgs              enable row level security;
alter table marketos_members           enable row level security;
alter table marketos_invitations       enable row level security;
alter table marketos_org_settings      enable row level security;
alter table marketos_revenue_periods   enable row level security;
alter table marketos_missions          enable row level security;
alter table marketos_bids              enable row level security;
alter table marketos_payouts           enable row level security;
alter table marketos_reviews           enable row level security;
alter table marketos_notifications     enable row level security;

-- Reusable predicate: caller is an active member of the given org.
create or replace function marketos_is_member(p_org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from marketos_members
    where org_id = p_org_id
      and user_id = auth.uid()
      and removed_at is null
  );
$$;

create or replace function marketos_is_owner(p_org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from marketos_members
    where org_id = p_org_id
      and user_id = auth.uid()
      and removed_at is null
      and role = 'owner'
  );
$$;

-- ----- marketos_orgs -------------------------------------------------------
-- Public can list orgs (low-cardinality table; no leak risk for the demo).
drop policy if exists "org public read" on marketos_orgs;
create policy "org public read" on marketos_orgs for select using (true);

-- ----- marketos_members ----------------------------------------------------
drop policy if exists "members public read"   on marketos_members;
drop policy if exists "member self update"    on marketos_members;
create policy "members public read" on marketos_members
  for select using (removed_at is null);
create policy "member self update" on marketos_members
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----- marketos_invitations -----------------------------------------------
-- Service-role only. RLS enabled with no permissive policies = total denial
-- for anon + authenticated. Server actions use the privileged Prisma client.

-- ----- marketos_org_settings ----------------------------------------------
drop policy if exists "settings public read"  on marketos_org_settings;
drop policy if exists "settings owner update" on marketos_org_settings;
create policy "settings public read"  on marketos_org_settings for select using (true);
create policy "settings owner update" on marketos_org_settings
  for update using (marketos_is_owner(org_id));

-- ----- marketos_revenue_periods -------------------------------------------
drop policy if exists "revenue public read" on marketos_revenue_periods;
create policy "revenue public read" on marketos_revenue_periods for select using (true);
-- Inserts / updates done via service-role only (closePeriod server action).

-- ----- marketos_missions --------------------------------------------------
drop policy if exists "missions public read"   on marketos_missions;
drop policy if exists "missions member insert" on marketos_missions;
drop policy if exists "missions poster update" on marketos_missions;
create policy "missions public read" on marketos_missions
  for select using (archived_at is null);
create policy "missions member insert" on marketos_missions
  for insert with check (
    marketos_is_member(org_id)
    and exists (select 1 from marketos_members m where m.id = poster_id and m.user_id = auth.uid())
  );
create policy "missions poster update" on marketos_missions
  for update using (
    exists (select 1 from marketos_members m where m.id = poster_id and m.user_id = auth.uid())
    or marketos_is_owner(org_id)
  );

-- ----- marketos_bids ------------------------------------------------------
drop policy if exists "bids public read"   on marketos_bids;
drop policy if exists "bids member insert" on marketos_bids;
drop policy if exists "bids actor update"  on marketos_bids;
create policy "bids public read" on marketos_bids for select using (true);
create policy "bids member insert" on marketos_bids
  for insert with check (
    exists (
      select 1 from marketos_members me
      where me.id = bidder_id and me.user_id = auth.uid() and me.removed_at is null
    )
  );
-- Bidder may withdraw; poster may shortlist/accept/decline. Both paths covered.
create policy "bids actor update" on marketos_bids
  for update using (
    -- bidder withdrawing themselves
    exists (
      select 1 from marketos_members me
      where me.id = bidder_id and me.user_id = auth.uid()
    )
    -- poster making a decision on a bid against their mission
    -- (qualify with the full table name; "bids" is not a valid alias inside
    --  a USING clause — Postgres requires the policy's target table name).
    or exists (
      select 1
      from marketos_missions m
      join marketos_members pm on pm.id = m.poster_id
      where m.id = marketos_bids.mission_id and pm.user_id = auth.uid()
    )
  );

-- ----- marketos_payouts ---------------------------------------------------
drop policy if exists "payouts public read" on marketos_payouts;
create policy "payouts public read" on marketos_payouts for select using (true);
-- Inserts / updates only via service-role (acceptBid, releasePayout server actions).

-- ----- marketos_reviews ---------------------------------------------------
drop policy if exists "reviews public read"   on marketos_reviews;
drop policy if exists "reviews actor insert"  on marketos_reviews;
create policy "reviews public read" on marketos_reviews for select using (true);
create policy "reviews actor insert" on marketos_reviews
  for insert with check (
    exists (
      select 1 from marketos_members me
      where me.id = reviewer_id and me.user_id = auth.uid() and me.removed_at is null
    )
  );

-- ----- marketos_notifications ---------------------------------------------
drop policy if exists "notif self read"   on marketos_notifications;
drop policy if exists "notif self update" on marketos_notifications;
create policy "notif self read" on marketos_notifications
  for select using (
    exists (
      select 1 from marketos_members m
      where m.id = member_id and m.user_id = auth.uid()
    )
  );
create policy "notif self update" on marketos_notifications
  for update using (
    exists (
      select 1 from marketos_members m
      where m.id = member_id and m.user_id = auth.uid()
    )
  );
-- Inserts only via service-role (notification fan-out).

-- =============================================================================
-- 3. Grants
-- =============================================================================
grant usage on schema public to anon, authenticated;

-- Public reads of low-risk tables (the seeded demo org is meant to be browsable).
grant select on
  marketos_orgs,
  marketos_members,
  marketos_org_settings,
  marketos_revenue_periods,
  marketos_missions,
  marketos_bids,
  marketos_payouts,
  marketos_reviews
to anon, authenticated;

grant select, update on marketos_notifications to authenticated;
grant select on marketos_member_stats to anon, authenticated;

-- Authenticated members can write where RLS allows.
grant insert, update on marketos_missions to authenticated;
grant insert, update on marketos_bids     to authenticated;
grant insert         on marketos_reviews  to authenticated;
grant update         on marketos_org_settings to authenticated;
grant update         on marketos_members   to authenticated;

-- Service role bypasses everything by design.
grant all on
  marketos_orgs,
  marketos_members,
  marketos_invitations,
  marketos_org_settings,
  marketos_revenue_periods,
  marketos_missions,
  marketos_bids,
  marketos_payouts,
  marketos_reviews,
  marketos_notifications
to service_role;
