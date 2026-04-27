-- =============================================================================
-- Baseline migration — Praxis schema as it existed before MarketOS.
--
-- This file is a faithful concatenation of:
--   supabase/migrations/20260421000000_praxis_initial.sql
--   supabase/migrations/20260424000000_add_learner_generation_flag.sql
--   supabase/migrations/20260424000000_add_model_preferences.sql
--   supabase/migrations/20260424000001_fix_learner_flag_trigger.sql
--
-- IMPORTANT: For environments where the supabase migrations have already been
-- applied (the dev + prod Supabase project), DO NOT run this migration. Instead
-- mark it as applied with:
--
--   npx prisma migrate resolve --applied 20260427000000_init_praxis_baseline
--
-- For a fresh database (e.g. a local Postgres instance for E2E), `prisma
-- migrate deploy` will execute this file. Every statement uses `IF NOT EXISTS`
-- / `OR REPLACE` so a partial-application is safe to re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

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

create table if not exists praxis_learners (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text not null unique,
  display_name         text,
  default_locale       text not null default 'en' check (default_locale in ('en','th')),
  can_generate_topics  boolean not null default false,
  model_preferences    jsonb null check (jsonb_typeof(model_preferences) = 'object' or model_preferences is null),
  created_at           timestamptz not null default now(),
  last_active_at       timestamptz not null default now()
);
comment on column praxis_learners.can_generate_topics is
  'Feature flag: allows this learner to generate new topics via LLM. Default false to control token costs.';
comment on column praxis_learners.model_preferences is
  'Per-task model overrides: {guardrail?: string, curriculum?: string, unit?: string, onboarding?: string, judge?: string}';

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

create table if not exists praxis_curriculum_cache (
  id               uuid primary key default gen_random_uuid(),
  fingerprint      text not null,
  locale           text not null default 'en' check (locale in ('en','th')),
  units            jsonb not null,
  model_version    text not null,
  hit_count        integer not null default 0,
  created_at       timestamptz not null default now(),
  unique (fingerprint, locale, model_version)
);

create table if not exists praxis_unit_cache (
  id               uuid primary key default gen_random_uuid(),
  fingerprint      text not null,
  locale           text not null default 'en' check (locale in ('en','th')),
  unit_index       integer not null check (unit_index >= 1),
  blocks           jsonb not null,
  model_version    text not null,
  created_at       timestamptz not null default now(),
  unique (fingerprint, locale, unit_index, model_version)
);

create table if not exists praxis_topics (
  id               uuid primary key default gen_random_uuid(),
  learner_id       uuid not null references praxis_learners(id) on delete cascade,
  title            text not null,
  raw_input        text not null,
  fingerprint      text not null,
  locale           text not null default 'en' check (locale in ('en','th')),
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

create table if not exists praxis_conversations (
  id               uuid primary key default gen_random_uuid(),
  learner_id       uuid not null references praxis_learners(id) on delete cascade,
  topic_id         uuid not null references praxis_topics(id) on delete cascade,
  unit_id          uuid references praxis_units(id) on delete cascade,
  surface          text not null check (surface in ('unit','mate')),
  summary          text,
  last_message_at  timestamptz,
  created_at       timestamptz not null default now(),
  constraint praxis_conversations_surface_unit_check
    check ((surface = 'unit' and unit_id is not null)
        or (surface = 'mate' and unit_id is null))
);
create index if not exists praxis_conversations_learner_recent_idx
  on praxis_conversations (learner_id, last_message_at desc nulls last);
create index if not exists praxis_conversations_topic_idx
  on praxis_conversations (topic_id);

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

drop policy if exists "learner self read"        on praxis_learners;
drop policy if exists "learner self update"      on praxis_learners;
drop policy if exists "learner self update prefs" on praxis_learners;
create policy "learner self read"   on praxis_learners for select using (auth.uid() = id);
create policy "learner self update" on praxis_learners for update using (auth.uid() = id);
create policy "learner self update prefs" on praxis_learners
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "topic owner select" on praxis_topics;
drop policy if exists "topic owner insert" on praxis_topics;
drop policy if exists "topic owner update" on praxis_topics;
drop policy if exists "topic owner delete" on praxis_topics;
create policy "topic owner select" on praxis_topics for select using (auth.uid() = learner_id);
create policy "topic owner insert" on praxis_topics for insert with check (auth.uid() = learner_id);
create policy "topic owner update" on praxis_topics for update using (auth.uid() = learner_id);
create policy "topic owner delete" on praxis_topics for delete using (auth.uid() = learner_id);

drop policy if exists "unit via topic select" on praxis_units;
drop policy if exists "unit via topic insert" on praxis_units;
drop policy if exists "unit via topic update" on praxis_units;
drop policy if exists "unit via topic delete" on praxis_units;
create policy "unit via topic select" on praxis_units
  for select using (exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid()));
create policy "unit via topic insert" on praxis_units
  for insert with check (exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid()));
create policy "unit via topic update" on praxis_units
  for update using (exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid()));
create policy "unit via topic delete" on praxis_units
  for delete using (exists (select 1 from praxis_topics t where t.id = topic_id and t.learner_id = auth.uid()));

drop policy if exists "conversation owner select" on praxis_conversations;
drop policy if exists "conversation owner insert" on praxis_conversations;
drop policy if exists "conversation owner update" on praxis_conversations;
drop policy if exists "conversation owner delete" on praxis_conversations;
create policy "conversation owner select" on praxis_conversations for select using (auth.uid() = learner_id);
create policy "conversation owner insert" on praxis_conversations for insert with check (auth.uid() = learner_id);
create policy "conversation owner update" on praxis_conversations for update using (auth.uid() = learner_id);
create policy "conversation owner delete" on praxis_conversations for delete using (auth.uid() = learner_id);

drop policy if exists "message via conversation select" on praxis_messages;
drop policy if exists "message via conversation insert" on praxis_messages;
create policy "message via conversation select" on praxis_messages
  for select using (exists (select 1 from praxis_conversations c where c.id = conversation_id and c.learner_id = auth.uid()));
create policy "message via conversation insert" on praxis_messages
  for insert with check (exists (select 1 from praxis_conversations c where c.id = conversation_id and c.learner_id = auth.uid()));

drop policy if exists "onboarding owner select" on praxis_onboarding;
drop policy if exists "onboarding owner insert" on praxis_onboarding;
drop policy if exists "onboarding owner update" on praxis_onboarding;
drop policy if exists "onboarding owner delete" on praxis_onboarding;
create policy "onboarding owner select" on praxis_onboarding for select using (auth.uid() = learner_id);
create policy "onboarding owner insert" on praxis_onboarding for insert with check (auth.uid() = learner_id);
create policy "onboarding owner update" on praxis_onboarding for update using (auth.uid() = learner_id);
create policy "onboarding owner delete" on praxis_onboarding for delete using (auth.uid() = learner_id);

drop policy if exists "template owner select" on praxis_templates;
drop policy if exists "template owner insert" on praxis_templates;
drop policy if exists "template owner delete" on praxis_templates;
create policy "template owner select" on praxis_templates for select using (auth.uid() = learner_id);
create policy "template owner insert" on praxis_templates for insert with check (auth.uid() = learner_id);
create policy "template owner delete" on praxis_templates for delete using (auth.uid() = learner_id);

-- =============================================================================
-- Trigger: prevent learners from self-updating can_generate_topics
-- (admin / service-role can still modify it)
-- =============================================================================
create or replace function praxis_prevent_self_update_can_generate_topics()
returns trigger
language plpgsql
as $$
declare
  is_privileged boolean;
begin
  is_privileged := (
    current_user = 'postgres'
    or current_user like 'supabase_%admin'
    or pg_has_role(current_user, 'service_role', 'MEMBER')
    or (select rolbypassrls from pg_roles where rolname = current_user)
  );

  if not is_privileged and OLD.can_generate_topics is distinct from NEW.can_generate_topics then
    raise exception 'Learners cannot modify can_generate_topics. Contact admin.'
      using errcode = 'insufficient_privilege';
  end if;
  return NEW;
end;
$$;

drop trigger if exists praxis_learners_protect_can_generate_topics on praxis_learners;
create trigger praxis_learners_protect_can_generate_topics
  before update on praxis_learners
  for each row execute function praxis_prevent_self_update_can_generate_topics();

-- =============================================================================
-- Grants
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

revoke update, delete on praxis_messages from authenticated;

grant all on praxis_learners to service_role;
