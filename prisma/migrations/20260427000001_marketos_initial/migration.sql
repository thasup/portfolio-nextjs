-- =============================================================================
-- MarketOS — Initial schema.
--
-- Implements `.windsurf/contexts/marketos-data-flow.md` §3:
--   marketos_orgs, marketos_members, marketos_invitations,
--   marketos_org_settings, marketos_revenue_periods, marketos_missions,
--   marketos_bids, marketos_payouts, marketos_reviews, marketos_notifications.
--
-- Pattern conventions copied from praxis_*:
--   - Money in `bigint` cents.
--   - Status / role as `text` + check (no native PG enums).
--   - `uuid` PKs, `gen_random_uuid()` for new rows.
--   - `set_updated_at()` trigger function on tables with `updated_at`.
--   - RLS enabled here, policies authored in the next migration.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Trigger function: marketos_set_updated_at
-- (separate from praxis_set_updated_at so the two subsystems can evolve
-- independently if either ever needs additional logic in their trigger)
-- -----------------------------------------------------------------------------
create or replace function marketos_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 1. marketos_orgs — the tenant
-- =============================================================================
create table if not exists marketos_orgs (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  currency     text not null default 'USD' check (currency in ('USD')),
  created_by   uuid references auth.users(id),
  archived_at  timestamptz,
  created_at   timestamptz not null default now(),
  constraint marketos_orgs_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$')
);
comment on table marketos_orgs is
  'MarketOS tenants. Each org runs its own internal market.';

-- =============================================================================
-- 2. marketos_members — membership of users in orgs
-- =============================================================================
create table if not exists marketos_members (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references marketos_orgs(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  role             text not null check (role in ('owner','admin','member')),
  display_name     text not null,
  title            text,
  bio              text,
  skills           text[] not null default '{}'::text[],
  base_comp_cents  bigint not null default 0 check (base_comp_cents >= 0),
  joined_at        timestamptz not null default now(),
  removed_at       timestamptz,
  unique (org_id, user_id)
);
create index if not exists marketos_members_org_active_idx
  on marketos_members (org_id, removed_at);
comment on table marketos_members is
  'A user can join multiple orgs; one row per (org, user). Removed members soft-delete via removed_at.';

-- =============================================================================
-- 3. marketos_invitations — per-org invitation allowlist
-- =============================================================================
create table if not exists marketos_invitations (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references marketos_orgs(id) on delete cascade,
  email        text not null,
  invited_by   uuid not null references auth.users(id),
  role         text not null check (role in ('admin','member')),
  invited_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  revoked_at   timestamptz,
  note         text,
  unique (org_id, email)
);

-- =============================================================================
-- 4. marketos_org_settings — 1:1 with org, holds Settings page levers
-- =============================================================================
create table if not exists marketos_org_settings (
  org_id              uuid primary key references marketos_orgs(id) on delete cascade,
  payroll_ratio_pct   integer not null check (payroll_ratio_pct between 0 and 100),
  base_split_pct      integer not null check (base_split_pct between 0 and 100),
  period              text not null check (period in ('month','quarter','half')),
  accent              text not null default 'orange' check (accent in ('orange','blue','green')),
  dark_mode           boolean not null default false,
  updated_at          timestamptz not null default now(),
  updated_by          uuid references auth.users(id)
);
drop trigger if exists marketos_org_settings_set_updated_at on marketos_org_settings;
create trigger marketos_org_settings_set_updated_at
  before update on marketos_org_settings
  for each row execute function marketos_set_updated_at();

-- =============================================================================
-- 5. marketos_revenue_periods — closed + current revenue snapshots
-- =============================================================================
create table if not exists marketos_revenue_periods (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references marketos_orgs(id) on delete cascade,
  period              text not null check (period in ('month','quarter','half')),
  period_label        text not null,
  period_start        date not null,
  period_end          date not null,
  revenue_cents       bigint not null check (revenue_cents >= 0),
  payroll_ratio_pct   integer not null check (payroll_ratio_pct between 0 and 100),
  base_split_pct      integer not null check (base_split_pct between 0 and 100),
  is_current          boolean not null default false,
  closed_at           timestamptz,
  created_at          timestamptz not null default now(),
  unique (org_id, period_label),
  constraint marketos_revenue_periods_dates_check check (period_end >= period_start),
  constraint marketos_revenue_periods_closed_consistency
    check ((is_current = true and closed_at is null) or (is_current = false))
);

-- Exactly one current period per org. Partial unique index implements this.
create unique index if not exists marketos_revenue_periods_one_current_per_org
  on marketos_revenue_periods (org_id) where (is_current = true);

create index if not exists marketos_revenue_periods_history_idx
  on marketos_revenue_periods (org_id, period_start desc);

-- =============================================================================
-- 6. marketos_missions — discrete pieces of valued work
-- =============================================================================
create table if not exists marketos_missions (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references marketos_orgs(id) on delete cascade,
  poster_id        uuid not null references marketos_members(id) on delete cascade,
  title            text not null check (length(title) between 5 and 120),
  slug             text not null,
  description      text not null check (length(description) between 20 and 4000),
  category         text not null check (category in ('Design','Engineering','Research','Marketing','HR','Operations')),
  -- jsonb array of strings; contents validated at the app layer (length 1–10)
  deliverables     jsonb not null default '[]'::jsonb check (jsonb_typeof(deliverables) = 'array'),
  budget_cents     bigint not null check (budget_cents > 0),
  deadline         date not null,
  status           text not null default 'open'
                   check (status in ('open','active','delivered','completed','cancelled')),
  -- accepted_bid_id FK declared after marketos_bids exists (see below)
  accepted_bid_id  uuid,
  delivered_at     timestamptz,
  completed_at     timestamptz,
  cancelled_at     timestamptz,
  archived_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (org_id, slug),
  -- Lifecycle invariants from spec §5.1
  constraint marketos_missions_accepted_consistency check (
    (accepted_bid_id is null and status in ('open','cancelled'))
    or (accepted_bid_id is not null and status in ('active','delivered','completed','cancelled'))
  ),
  constraint marketos_missions_delivered_consistency check (
    (status in ('delivered','completed') and delivered_at is not null)
    or (status not in ('delivered','completed'))
  ),
  constraint marketos_missions_completed_consistency check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  ),
  constraint marketos_missions_cancelled_consistency check (
    (status = 'cancelled' and cancelled_at is not null)
    or (status <> 'cancelled' and cancelled_at is null)
  )
);
create index if not exists marketos_missions_board_idx
  on marketos_missions (org_id, status, created_at desc);
create index if not exists marketos_missions_poster_idx
  on marketos_missions (poster_id);

drop trigger if exists marketos_missions_set_updated_at on marketos_missions;
create trigger marketos_missions_set_updated_at
  before update on marketos_missions
  for each row execute function marketos_set_updated_at();

-- =============================================================================
-- 7. marketos_bids — offers on missions
-- =============================================================================
create table if not exists marketos_bids (
  id            uuid primary key default gen_random_uuid(),
  mission_id    uuid not null references marketos_missions(id) on delete cascade,
  bidder_id     uuid not null references marketos_members(id) on delete cascade,
  amount_cents  bigint not null check (amount_cents > 0),
  proposal      text not null check (length(proposal) between 20 and 2000),
  status        text not null default 'pending'
                check (status in ('pending','shortlisted','accepted','declined','withdrawn')),
  submitted_at  timestamptz not null default now(),
  decided_at    timestamptz,
  decided_by    uuid references marketos_members(id) on delete set null,
  unique (mission_id, bidder_id)
);
create index if not exists marketos_bids_my_idx
  on marketos_bids (bidder_id, submitted_at desc);
-- At most one accepted bid per mission. Enforced at DB level.
create unique index if not exists marketos_bids_one_accepted_per_mission
  on marketos_bids (mission_id) where (status = 'accepted');

-- Now wire the FK from marketos_missions.accepted_bid_id back to marketos_bids.
-- Done after-the-fact because the two tables have a circular dependency.
alter table marketos_missions
  drop constraint if exists marketos_missions_accepted_bid_fk;
alter table marketos_missions
  add constraint marketos_missions_accepted_bid_fk
  foreign key (accepted_bid_id) references marketos_bids(id) on delete set null;

-- Self-bid prevention: a member can't bid on a mission they posted.
create or replace function marketos_bids_prevent_self_bid()
returns trigger
language plpgsql
as $$
declare
  poster uuid;
begin
  select poster_id into poster from marketos_missions where id = NEW.mission_id;
  if poster = NEW.bidder_id then
    raise exception 'A member cannot bid on their own mission'
      using errcode = 'check_violation';
  end if;
  return NEW;
end;
$$;
drop trigger if exists marketos_bids_no_self_bid on marketos_bids;
create trigger marketos_bids_no_self_bid
  before insert or update of bidder_id, mission_id on marketos_bids
  for each row execute function marketos_bids_prevent_self_bid();

-- =============================================================================
-- 8. marketos_payouts — scheduled disbursements (one per accepted bid)
-- =============================================================================
create table if not exists marketos_payouts (
  id                    uuid primary key default gen_random_uuid(),
  bid_id                uuid not null unique references marketos_bids(id) on delete cascade,
  -- Denormalised for fast queries / pool widgets.
  mission_id            uuid not null references marketos_missions(id) on delete cascade,
  org_id                uuid not null references marketos_orgs(id) on delete cascade,
  recipient_member_id   uuid not null references marketos_members(id) on delete cascade,
  amount_cents          bigint not null check (amount_cents > 0),
  revenue_period_id     uuid not null references marketos_revenue_periods(id),
  scheduled_for         date not null,
  status                text not null default 'scheduled'
                        check (status in ('scheduled','released','voided')),
  released_at           timestamptz,
  voided_at             timestamptz,
  constraint marketos_payouts_status_consistency check (
    (status = 'released' and released_at is not null and voided_at is null)
    or (status = 'voided' and voided_at is not null)
    or (status = 'scheduled' and released_at is null and voided_at is null)
  )
);
create index if not exists marketos_payouts_org_due_idx
  on marketos_payouts (org_id, scheduled_for);
create index if not exists marketos_payouts_recipient_status_idx
  on marketos_payouts (recipient_member_id, status);

-- =============================================================================
-- 9. marketos_reviews — peer ratings post-delivery
-- =============================================================================
create table if not exists marketos_reviews (
  id           uuid primary key default gen_random_uuid(),
  mission_id   uuid not null references marketos_missions(id) on delete cascade,
  reviewer_id  uuid not null references marketos_members(id) on delete cascade,
  reviewee_id  uuid not null references marketos_members(id) on delete cascade,
  direction    text not null check (direction in ('poster_to_contributor','contributor_to_poster')),
  rating       integer not null check (rating between 1 and 5),
  feedback     text,
  created_at   timestamptz not null default now(),
  unique (mission_id, direction)
);
create index if not exists marketos_reviews_reviewee_idx
  on marketos_reviews (reviewee_id, created_at desc);

-- =============================================================================
-- 10. marketos_notifications — per-member inbox
-- =============================================================================
create table if not exists marketos_notifications (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references marketos_orgs(id) on delete cascade,
  member_id   uuid not null references marketos_members(id) on delete cascade,
  type        text not null check (type in (
                'bid_received','bid_shortlisted','bid_accepted','bid_declined',
                'mission_posted','mission_delivered','mission_completed','mission_cancelled',
                'reputation_up','pool_period_closed','payout_released'
              )),
  title       text not null check (length(title) between 1 and 120),
  body        text not null check (length(body) between 1 and 500),
  link        text,
  payload     jsonb,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists marketos_notifications_inbox_idx
  on marketos_notifications (member_id, read_at, created_at desc);
