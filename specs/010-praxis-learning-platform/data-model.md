# Data Model: PRAXIS Phase 1

**Feature**: 005-praxis-learning-platform  
**Date**: 2026-04-18  
**Stores**: Supabase Postgres (primary), Supabase Auth (sessions)  
**Migration**: `supabase/migrations/20260421_praxis_initial.sql`

## Entity overview

| Entity | Scope | Storage | Notes |
|---|---|---|---|
| Learner | Per account | Supabase `auth.users` + `praxis_learners` | Extends auth.users with profile fields |
| Invitation | Per invited email | `praxis_invitations` | Curator-owned allowlist |
| Topic | Per learner, per subject | `praxis_topics` | Holds curriculum + progress pointers |
| Curriculum Cache | Shared across learners | `praxis_curriculum_cache` | Keyed by topic fingerprint |
| Unit | Per topic | `praxis_units` | Generated content blocks |
| Unit Cache | Shared across learners | `praxis_unit_cache` | Keyed by (fingerprint, unit_index) |
| Conversation | Per unit or per mate surface | `praxis_conversations` | Separate threads per surface |
| Message | Per conversation | `praxis_messages` | Persisted chat history |
| Onboarding Profile | Per learner, per topic | `praxis_onboarding` | Versioned answers |
| Template | Per learner, per request | `praxis_templates` | JSON spec cache; binary re-rendered per download |
| Spend Ledger | Global | `praxis_spend_ledger` | Monthly budget guardrail |

All tables use `uuid` primary keys (`gen_random_uuid()`), `created_at`, `updated_at`. Row-Level Security is enabled on every table.

## TypeScript types (source of truth)

Defined in `src/lib/praxis/types.ts` and re-exported from `src/types/praxis.ts`. Generated Supabase types live in `src/lib/praxis/supabase/database.types.ts` (produced by `supabase gen types typescript`).

```ts
// src/lib/praxis/types.ts

export type Locale = 'en' | 'th'

export interface Learner {
  id: string              // uuid, matches auth.users.id
  email: string
  displayName: string | null
  defaultLocale: Locale
  createdAt: string       // ISO timestamp
  lastActiveAt: string
}

export interface Invitation {
  id: string
  email: string
  invitedBy: string       // uuid of the curator (auth.users.id)
  invitedAt: string
  revokedAt: string | null
  note: string | null
}

export interface Topic {
  id: string
  learnerId: string
  title: string            // canonical display title
  rawInput: string         // what the learner typed
  fingerprint: string      // normalized SHA-1 of rawInput
  locale: Locale
  status: TopicStatus
  curriculumId: string | null   // points to praxis_curriculum_cache
  lastActiveAt: string
  createdAt: string
}

export enum TopicStatus {
  PENDING_GUARDRAIL = 'pending_guardrail',
  REJECTED = 'rejected',
  OUTLINE_READY = 'outline_ready',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface CurriculumOutline {
  id: string
  fingerprint: string
  locale: Locale
  units: OutlineUnit[]
  modelVersion: string
  hitCount: number
  createdAt: string
}

export interface OutlineUnit {
  index: number
  title: string
  objective: string
  summary: string
}

export interface Unit {
  id: string
  topicId: string
  index: number
  title: string
  objective: string
  status: UnitStatus
  blocks: ContentBlock[]
  cacheId: string | null    // points to praxis_unit_cache
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export enum UnitStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  READY = 'ready',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type ContentBlockKind =
  | 'objectives'
  | 'explainer'
  | 'example'
  | 'diagram_note'
  | 'practice'

export interface ContentBlock {
  id: string                // stable id for block-level regen
  kind: ContentBlockKind
  content: string           // markdown
  regeneratedFrom: string | null  // previous block id if this is a regen
  generatedAt: string
}

export type ConversationSurface = 'unit' | 'mate'

export interface Conversation {
  id: string
  learnerId: string
  topicId: string
  unitId: string | null     // null when surface === 'mate'
  surface: ConversationSurface
  summary: string | null    // rolling summary for pruned turns
  lastMessageAt: string | null
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  tokenCountInput: number | null
  tokenCountOutput: number | null
  createdAt: string
}

export interface OnboardingProfile {
  id: string
  learnerId: string
  topicId: string
  version: number           // incremented on edit
  answers: OnboardingAnswer[]
  createdAt: string
  updatedAt: string
}

export interface OnboardingAnswer {
  questionId: string
  prompt: string            // the generated question text (snapshot)
  answer: string
  helperText: string | null
}

export type TemplateKind = 'docx' | 'xlsx' | 'pdf'

export interface Template {
  id: string
  learnerId: string
  topicId: string
  unitId: string | null     // null for topic-level templates
  kind: TemplateKind
  title: string
  specJson: TemplateSpec    // JSON structure produced by template.generator prompt
  regenerateNote: string | null
  createdAt: string
}

export interface TemplateSpec {
  kind: TemplateKind
  title: string
  sections: TemplateSection[]
}

export interface TemplateSection {
  heading: string
  body: string              // markdown or structured hints per kind
  table?: TemplateTable
}

export interface TemplateTable {
  columns: string[]
  rows: string[][]
}

export interface SpendLedgerEntry {
  id: string
  timestamp: string
  endpoint: PraxisEndpoint
  inputTokens: number
  outputTokens: number
  estimatedCents: number
  model: string
}

export enum PraxisEndpoint {
  CHAT = 'chat',
  CURRICULUM = 'curriculum',
  UNIT = 'unit',
  ONBOARDING = 'onboarding',
  TEMPLATE = 'template',
  GUARDRAIL = 'guardrail',
}
```

## Supabase schema (DDL)

File: `supabase/migrations/20260421_praxis_initial.sql`.

```sql
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Learners (extends auth.users 1:1)
create table praxis_learners (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  default_locale text not null default 'en' check (default_locale in ('en','th')),
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

-- Invitations
create table praxis_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  invited_by uuid not null references auth.users(id),
  invited_at timestamptz not null default now(),
  revoked_at timestamptz,
  note text
);

-- Curriculum cache (shared)
create table praxis_curriculum_cache (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  locale text not null default 'en',
  units jsonb not null,
  model_version text not null,
  hit_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (fingerprint, locale, model_version)
);

-- Unit cache (shared)
create table praxis_unit_cache (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  locale text not null default 'en',
  unit_index integer not null,
  blocks jsonb not null,
  model_version text not null,
  created_at timestamptz not null default now(),
  unique (fingerprint, locale, unit_index, model_version)
);

-- Topics (per learner)
create table praxis_topics (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references praxis_learners(id) on delete cascade,
  title text not null,
  raw_input text not null,
  fingerprint text not null,
  locale text not null default 'en',
  status text not null default 'pending_guardrail',
  curriculum_id uuid references praxis_curriculum_cache(id),
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index on praxis_topics (learner_id, last_active_at desc);

-- Units (per topic)
create table praxis_units (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references praxis_topics(id) on delete cascade,
  index integer not null,
  title text not null,
  objective text not null,
  status text not null default 'pending',
  blocks jsonb not null default '[]'::jsonb,
  cache_id uuid references praxis_unit_cache(id),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, index)
);

-- Conversations
create table praxis_conversations (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references praxis_learners(id) on delete cascade,
  topic_id uuid not null references praxis_topics(id) on delete cascade,
  unit_id uuid references praxis_units(id) on delete cascade,
  surface text not null check (surface in ('unit','mate')),
  summary text,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);
create index on praxis_conversations (learner_id, last_message_at desc);

-- Messages
create table praxis_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references praxis_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  token_count_input integer,
  token_count_output integer,
  created_at timestamptz not null default now()
);
create index on praxis_messages (conversation_id, created_at);

-- Onboarding profiles
create table praxis_onboarding (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references praxis_learners(id) on delete cascade,
  topic_id uuid not null references praxis_topics(id) on delete cascade,
  version integer not null default 1,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_id, topic_id, version)
);

-- Templates
create table praxis_templates (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references praxis_learners(id) on delete cascade,
  topic_id uuid not null references praxis_topics(id) on delete cascade,
  unit_id uuid references praxis_units(id) on delete cascade,
  kind text not null check (kind in ('docx','xlsx','pdf')),
  title text not null,
  spec_json jsonb not null,
  regenerate_note text,
  created_at timestamptz not null default now()
);

-- Spend ledger
create table praxis_spend_ledger (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  endpoint text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  estimated_cents integer not null,
  model text not null
);
create index on praxis_spend_ledger (timestamp desc);

-- Row-Level Security
alter table praxis_learners          enable row level security;
alter table praxis_invitations       enable row level security;
alter table praxis_topics            enable row level security;
alter table praxis_units             enable row level security;
alter table praxis_conversations     enable row level security;
alter table praxis_messages          enable row level security;
alter table praxis_onboarding        enable row level security;
alter table praxis_templates         enable row level security;
-- curriculum_cache, unit_cache, spend_ledger: service-role only, no RLS needed (no anon access)

-- Learner can read/update own row
create policy "learner self read" on praxis_learners
  for select using (auth.uid() = id);
create policy "learner self update" on praxis_learners
  for update using (auth.uid() = id);

-- Topic policies: learner owns their topics
create policy "topic owner select" on praxis_topics
  for select using (auth.uid() = learner_id);
create policy "topic owner insert" on praxis_topics
  for insert with check (auth.uid() = learner_id);
create policy "topic owner update" on praxis_topics
  for update using (auth.uid() = learner_id);
create policy "topic owner delete" on praxis_topics
  for delete using (auth.uid() = learner_id);

-- Identical pattern for units, conversations, messages, onboarding, templates.
-- See migration file for full policy set.
```

## Lifecycle diagrams

### Topic creation

```
Learner submits topic string
  └─▶ scope.guardrail classifier
       ├─▶ rejected  → praxis_topics.status = 'rejected'
       └─▶ admitted
            └─▶ fingerprint(rawInput)
                 ├─▶ cache hit  → link curriculum_id, status = 'outline_ready'
                 └─▶ cache miss → generate outline, insert into cache, link, status = 'outline_ready'
```

### Unit access

```
Learner opens unit N
  ├─▶ praxis_units.status in (ready, completed) → render blocks
  └─▶ status = pending
       └─▶ fingerprint(topic) + unit_index
            ├─▶ unit_cache hit → copy blocks, link cache_id, status = 'ready'
            └─▶ unit_cache miss → generate, insert cache, copy blocks, status = 'ready'
```

### Message send

```
Learner sends message in conversation
  └─▶ load recent messages (last 20) + conversation.summary
       └─▶ if input tokens > 6,500
            └─▶ summarize oldest third, update conversation.summary, drop summarized messages from context
       └─▶ call streamChat with composed system prompt
            └─▶ stream to client
            └─▶ on complete: persist assistant message + ledger entry
```

## Invariants

- A Learner exists iff an Invitation existed for that email at first sign-in.
- `praxis_topics.fingerprint` is deterministic; the same `rawInput` always produces the same fingerprint.
- `praxis_curriculum_cache` and `praxis_unit_cache` are deduplicated by `(fingerprint, locale, model_version)`; bumping a prompt `VERSION` constant invalidates dependent caches.
- A Conversation's `unit_id` is non-null iff `surface = 'unit'`.
- A Message is immutable after write; edits produce new rows (future feature, not Phase 1).
- `praxis_spend_ledger` is append-only.
- Learner data deletion is cascade-deleted via `on delete cascade`; curriculum/unit cache is not learner-scoped and is preserved.

## Indexing strategy

- `praxis_topics (learner_id, last_active_at desc)` — library view ordering.
- `praxis_messages (conversation_id, created_at)` — conversation read.
- `praxis_conversations (learner_id, last_message_at desc)` — full-screen mate recent threads.
- `praxis_spend_ledger (timestamp desc)` — monthly aggregate.

## Future schema changes (Phase 2+)

- `praxis_admin_roles` for multi-curator support.
- Full-text search on generated unit blocks (Phase 3 playbook export).
- `praxis_topic_transfers` linking one learner's topic to another (Phase 3).
