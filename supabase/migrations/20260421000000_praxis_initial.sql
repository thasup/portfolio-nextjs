-- =============================================================================
-- PRAXIS Phase 1 — initial schema.
--
-- Applies the data model specified in
-- `specs/010-praxis-learning-platform/data-model.md`.
--
-- Migration policy:
--   * Every table with learner data has RLS enabled.
--   * Shared caches (curriculum, unit) and the spend ledger are service-role
--     only — no RLS, since no anon/authenticated role should access them
--     directly. Clients go through server routes that use the service-role
--     client.
--   * `updated_at` columns are kept fresh via a single `set_updated_at()`
--     trigger applied to the three tables that have one.
--
-- Safe to apply idempotently: every object uses `if not exists` / `or replace`
-- where Postgres supports it. Policies are dropped-and-recreated because
-- `create policy if not exists` is unavailable before PG 15.4.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Enum-like CHECK domains
-- Kept as text + check rather than real enums so adding a value later doesn't
-- require an ALTER TYPE and a deployment dance.
-- -----------------------------------------------------------------------------
-- praxis_topics.status      : pending_guardrail | rejected | outline_ready | active | archived
-- praxis_units.status       : pending | ready | completed
-- praxis_conversations.surface : unit | mate
-- praxis_messages.role      : user | assistant
-- praxis_templates.kind     : docx | xlsx | pdf
-- praxis_learners.default_locale : en | th

-- -----------------------------------------------------------------------------
-- Utility: updated_at trigger function
-- -----------------------------------------------------------------------------
create or replace function praxis_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- Tables
-- =============================================================================

-- Learners (1:1 extension of auth.users) -------------------------------------
create table if not exists praxis_learners (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null unique,
  display_name      text,
  default_locale    text not null default 'en'
                    check (default_locale in ('en','th')),
  created_at        timestamptz not null default now(),
  last_active_at    timestamptz not null default now()
);

-- Invitations ---------------------------------------------------------------
create table if not exists praxis_invitations (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  invited_by   uuid not null references auth.users(id),
  invited_at   timestamptz not null default now(),
  revoked_at   timestamptz,
  note         text
);
create index if not exists praxis_invitations_email_idx
  on praxis_invitations (email)
  where revoked_at is null;

-- Curriculum cache (shared) -------------------------------------------------
create table if not exists praxis_curriculum_cache (
  id               uuid primary key default gen_random_uuid(),
  fingerprint      text not null,
  locale           text not null default 'en'
                   check (locale in ('en','th')),
  units            jsonb not null,
  model_version    text not null,
  hit_count        integer not null default 0,
  created_at       timestamptz not null default now(),
  unique (fingerprint, locale, model_version)
);

-- Unit cache (shared) --------------------------------------------------------
create table if not exists praxis_unit_cache (
  id               uuid primary key default gen_random_uuid(),
  fingerprint      text not null,
  locale           text not null default 'en'
                   check (locale in ('en','th')),
  unit_index       integer not null check (unit_index >= 1),
  blocks           jsonb not null,
  model_version    text not null,
  created_at       timestamptz not null default now(),
  unique (fingerprint, locale, unit_index, model_version)
);

-- Topics (per learner) ------------------------------------------------------
create table if not exists praxis_topics (
  id               uuid primary key default gen_random_uuid(),
  learner_id       uuid not null references praxis_learners(id) on delete cascade,
  title            text not null,
  raw_input        text not null,
  fingerprint      text not null,
  locale           text not null default 'en'
                   check (locale in ('en','th')),
  status           text not null default 'pending_guardrail'
                   check (status in ('pending_guardrail','rejected','outline_ready','active','archived')),
  curriculum_id    uuid references praxis_curriculum_cache(id),
  last_active_at   timestamptz not null default now(),
  created_at       timestamptz not null default now()
);
create index if not exists praxis_topics_learner_active_idx
  on praxis_topics (learner_id, last_active_at desc);
create index if not exists praxis_topics_fingerprint_idx
  on praxis_topics (fingerprint, locale);

-- Units (per topic) ---------------------------------------------------------
create table if not exists praxis_units (
  id               uuid primary key default gen_random_uuid(),
  topic_id         uuid not null references praxis_topics(id) on delete cascade,
  index            integer not null check (index >= 1),
  title            text not null,
  objective        text not null,
  status           text not null default 'pending'
                   check (status in ('pending','ready','completed')),
  blocks           jsonb not null default '[]'::jsonb,
  cache_id         uuid references praxis_unit_cache(id),
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (topic_id, index)
);
drop trigger if exists praxis_units_set_updated_at on praxis_units;
create trigger praxis_units_set_updated_at
  before update on praxis_units
  for each row execute function praxis_set_updated_at();

-- Conversations -------------------------------------------------------------
create table if not exists praxis_conversations (
  id               uuid primary key default gen_random_uuid(),
  learner_id       uuid not null references praxis_learners(id) on delete cascade,
  topic_id         uuid not null references praxis_topics(id) on delete cascade,
  unit_id          uuid references praxis_units(id) on delete cascade,
  surface          text not null check (surface in ('unit','mate')),
  summary          text,
  last_message_at  timestamptz,
  created_at       timestamptz not null default now(),
  -- Invariant: unit_id is non-null iff surface = 'unit'.
  constraint praxis_conversations_surface_unit_check
    check ((surface = 'unit' and unit_id is not null)
        or (surface = 'mate' and unit_id is null))
);
create index if not exists praxis_conversations_learner_recent_idx
  on praxis_conversations (learner_id, last_message_at desc nulls last);
create index if not exists praxis_conversations_topic_idx
  on praxis_conversations (topic_id);

-- Messages ------------------------------------------------------------------
create table if not exists praxis_messages (
  id                  uuid primary key default gen_random_uuid(),
  conversation_id     uuid not null references praxis_conversations(id) on delete cascade,
  role                text not null check (role in ('user','assistant')),
  content             text not null,
  token_count_input   integer,
  token_count_output  integer,
  created_at          timestamptz not null default now()
);
create index if not exists praxis_messages_conversation_idx
  on praxis_messages (conversation_id, created_at);

-- Onboarding profiles -------------------------------------------------------
create table if not exists praxis_onboarding (
  id            uuid primary key default gen_random_uuid(),
  learner_id    uuid not null references praxis_learners(id) on delete cascade,
  topic_id      uuid not null references praxis_topics(id) on delete cascade,
  version       integer not null default 1 check (version >= 1),
  answers       jsonb not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (learner_id, topic_id, version)
);
drop trigger if exists praxis_onboarding_set_updated_at on praxis_onboarding;
create trigger praxis_onboarding_set_updated_at
  before update on praxis_onboarding
  for each row execute function praxis_set_updated_at();

-- Templates -----------------------------------------------------------------
create table if not exists praxis_templates (
  id               uuid primary key default gen_random_uuid(),
  learner_id       uuid not null references praxis_learners(id) on delete cascade,
  topic_id         uuid not null references praxis_topics(id) on delete cascade,
  unit_id          uuid references praxis_units(id) on delete cascade,
  kind             text not null check (kind in ('docx','xlsx','pdf')),
  title            text not null,
  spec_json        jsonb not null,
  regenerate_note  text,
  created_at       timestamptz not null default now()
);
create index if not exists praxis_templates_learner_idx
  on praxis_templates (learner_id, created_at desc);

-- Spend ledger (service-role only) ------------------------------------------
create table if not exists praxis_spend_ledger (
  id               uuid primary key default gen_random_uuid(),
  timestamp        timestamptz not null default now(),
  endpoint         text not null
                   check (endpoint in ('chat','curriculum','unit','onboarding','template','guardrail')),
  input_tokens     integer not null check (input_tokens >= 0),
  output_tokens    integer not null check (output_tokens >= 0),
  estimated_cents  integer not null check (estimated_cents >= 0),
  model            text not null
);
create index if not exists praxis_spend_ledger_timestamp_idx
  on praxis_spend_ledger (timestamp desc);

-- =============================================================================
-- Row-Level Security
-- =============================================================================

alter table praxis_learners      enable row level security;
alter table praxis_invitations   enable row level security;
alter table praxis_topics        enable row level security;
alter table praxis_units         enable row level security;
alter table praxis_conversations enable row level security;
alter table praxis_messages      enable row level security;
alter table praxis_onboarding    enable row level security;
alter table praxis_templates     enable row level security;
-- curriculum_cache, unit_cache, spend_ledger intentionally left RLS-disabled.
-- They are only accessed via the service-role client from server routes.

-- ----- praxis_learners -----------------------------------------------------
drop policy if exists "learner self read"   on praxis_learners;
drop policy if exists "learner self update" on praxis_learners;
create policy "learner self read" on praxis_learners
  for select using (auth.uid() = id);
create policy "learner self update" on praxis_learners
  for update using (auth.uid() = id);

-- ----- praxis_invitations --------------------------------------------------
-- Invitations are administered exclusively via the service-role client.
-- No authenticated policies are granted. The table simply sits behind RLS
-- with no permissive policies, which denies all non-service access.

-- ----- praxis_topics -------------------------------------------------------
drop policy if exists "topic owner select" on praxis_topics;
drop policy if exists "topic owner insert" on praxis_topics;
drop policy if exists "topic owner update" on praxis_topics;
drop policy if exists "topic owner delete" on praxis_topics;
create policy "topic owner select" on praxis_topics
  for select using (auth.uid() = learner_id);
create policy "topic owner insert" on praxis_topics
  for insert with check (auth.uid() = learner_id);
create policy "topic owner update" on praxis_topics
  for update using (auth.uid() = learner_id);
create policy "topic owner delete" on praxis_topics
  for delete using (auth.uid() = learner_id);

-- ----- praxis_units --------------------------------------------------------
-- Units are scoped transitively via their parent topic.
drop policy if exists "unit via topic select" on praxis_units;
drop policy if exists "unit via topic insert" on praxis_units;
drop policy if exists "unit via topic update" on praxis_units;
drop policy if exists "unit via topic delete" on praxis_units;
create policy "unit via topic select" on praxis_units
  for select using (
    exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid())
  );
create policy "unit via topic insert" on praxis_units
  for insert with check (
    exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid())
  );
create policy "unit via topic update" on praxis_units
  for update using (
    exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid())
  );
create policy "unit via topic delete" on praxis_units
  for delete using (
    exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid())
  );

-- ----- praxis_conversations ------------------------------------------------
drop policy if exists "conversation owner select" on praxis_conversations;
drop policy if exists "conversation owner insert" on praxis_conversations;
drop policy if exists "conversation owner update" on praxis_conversations;
drop policy if exists "conversation owner delete" on praxis_conversations;
create policy "conversation owner select" on praxis_conversations
  for select using (auth.uid() = learner_id);
create policy "conversation owner insert" on praxis_conversations
  for insert with check (auth.uid() = learner_id);
create policy "conversation owner update" on praxis_conversations
  for update using (auth.uid() = learner_id);
create policy "conversation owner delete" on praxis_conversations
  for delete using (auth.uid() = learner_id);

-- ----- praxis_messages -----------------------------------------------------
drop policy if exists "message via conversation select" on praxis_messages;
drop policy if exists "message via conversation insert" on praxis_messages;
-- Messages are immutable after write (no update/delete policies).
create policy "message via conversation select" on praxis_messages
  for select using (
    exists (select 1 from praxis_conversations c where c.id = conversation_id and c.learner_id = auth.uid())
  );
create policy "message via conversation insert" on praxis_messages
  for insert with check (
    exists (select 1 from praxis_conversations c where c.id = conversation_id and c.learner_id = auth.uid())
  );

-- ----- praxis_onboarding ---------------------------------------------------
drop policy if exists "onboarding owner select" on praxis_onboarding;
drop policy if exists "onboarding owner insert" on praxis_onboarding;
drop policy if exists "onboarding owner update" on praxis_onboarding;
drop policy if exists "onboarding owner delete" on praxis_onboarding;
create policy "onboarding owner select" on praxis_onboarding
  for select using (auth.uid() = learner_id);
create policy "onboarding owner insert" on praxis_onboarding
  for insert with check (auth.uid() = learner_id);
create policy "onboarding owner update" on praxis_onboarding
  for update using (auth.uid() = learner_id);
create policy "onboarding owner delete" on praxis_onboarding
  for delete using (auth.uid() = learner_id);

-- ----- praxis_templates ----------------------------------------------------
drop policy if exists "template owner select" on praxis_templates;
drop policy if exists "template owner insert" on praxis_templates;
drop policy if exists "template owner delete" on praxis_templates;
-- Templates are immutable after write (regeneration creates a new row), so
-- no update policy is granted.
create policy "template owner select" on praxis_templates
  for select using (auth.uid() = learner_id);
create policy "template owner insert" on praxis_templates
  for insert with check (auth.uid() = learner_id);
create policy "template owner delete" on praxis_templates
  for delete using (auth.uid() = learner_id);

-- =============================================================================
-- Grants
-- Supabase's default role model grants the `authenticated` role USAGE on the
-- public schema by default. We narrow it here: learners can only see the
-- tables behind RLS. Service role bypasses everything by design.
-- =============================================================================
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on
  praxis_learners,
  praxis_topics,
  praxis_units,
  praxis_conversations,
  praxis_messages,
  praxis_onboarding,
  praxis_templates
to authenticated;

-- Messages are append-only in the application; we still grant insert+select
-- because RLS policies gate the rows. Update/delete are omitted deliberately.
revoke update, delete on praxis_messages from authenticated;

-- anon role has no direct table access; every public touchpoint goes through
-- a server route or the service-role client.
