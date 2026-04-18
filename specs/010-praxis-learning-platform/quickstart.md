# Quickstart: PRAXIS developer guide

**Feature**: 005-praxis-learning-platform  
**Audience**: First, and any future contributor

## Prerequisites

- Node 22 (see `.nvmrc`).
- A Supabase project (free tier is fine for Phase 1). Get URL + anon + service-role keys.
- Anthropic API key with access to Claude Sonnet 4.
- Resend API key (already used by the portfolio).

## One-time setup

```bash
# Install new dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

Fill in `.env.local`:

```bash
# Existing
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_xxx

# New for PRAXIS
ANTHROPIC_API_KEY=sk-ant-xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
PRAXIS_INVITE_SECRET=<32+ char random>
PRAXIS_ADMIN_TOKEN=<32+ char random>
PRAXIS_MONTHLY_BUDGET_CENTS=5000
```

Apply the database migration:

```bash
# From project root, using the Supabase CLI
supabase link --project-ref <your-ref>
supabase db push
# or copy supabase/migrations/20260421_praxis_initial.sql into the SQL editor
```

Generate TypeScript types:

```bash
npx supabase gen types typescript --linked > src/lib/praxis/supabase/database.types.ts
```

## Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000/en/learn` — you should see the "invitation required" state.

## Invite yourself as a learner (local)

```bash
npm run praxis:invite -- your@email.com
```

You should receive a Resend email with a link to `/learn/callback?token=...`. Click it, land on `/learn`, see your empty library.

If Resend is not configured locally, the invite script will print the signed-link URL to the console — click that to sign in.

## Create your first topic

1. From `/learn`, type `"sales"` (or any topic) and submit.
2. Scope guardrail classifies. Admitted topics show a generated outline within ~20s.
3. Edit units if desired, then click Accept.
4. You land on the module overview with 5 units, all pending.
5. Complete adaptive onboarding (`/learn/sales/onboarding`) with 3–5 topic-specific questions.
6. Open Unit 1. Full unit content generates on first access. Blocks render.
7. Chat with Nori in the sidebar or open the full-screen mate at `/learn/sales/mate`.

## Run the prompt eval harness

```bash
npx tsx scripts/praxis-eval.ts
```

Outputs a CSV and a markdown summary to `.windsurf/docs/praxis-eval/<YYYY-MM-DD>.md`. The Week 0 exit bar is enforced by a Vitest assertion in `tests/praxis/prompts/`.

## Common developer workflows

### Add a new prompt module

1. Create `src/lib/praxis/prompts/<name>.ts` exporting `VERSION`, `build(input)`, and `fixtures`.
2. Add Vitest tests in `src/lib/praxis/prompts/__tests__/<name>.test.ts`.
3. Register in `scripts/praxis-eval.ts` if it participates in the rubric.

### Add a new API route

1. Create `src/app/api/praxis/<name>/route.ts`.
2. Import `getLearner` and `requireInvite` for auth.
3. Validate the body with Zod.
4. Use `streamChat` or `streamStructured` from `src/lib/praxis/anthropic/stream.ts`.
5. Record spend via `ledger.record({ endpoint, inputTokens, outputTokens, model })` inside a `finally`.
6. Document under `specs/005-praxis-learning-platform/contracts/<name>.md`.

### Invalidate a prompt cache

Bump the `VERSION` constant in the affected prompt module. Cache keys include `model_version`, so bumping it invalidates all dependent rows.

### Run a Jane-ish local session

```bash
# In one terminal
npm run dev

# In another
npm run praxis:invite -- jane@example.com
# Copy the printed signed-link URL, open in a private-mode browser
```

Persona fixtures used by `scripts/praxis-eval.ts` are good examples of realistic onboarding answers.

## Troubleshooting

- **"Invitation required" even after clicking the link** — token expired (15 minute TTL). Request a new invite.
- **Streaming chat stalls on mobile Safari** — check that the route is running on Node runtime (`export const runtime = 'nodejs'`), not Edge.
- **DOCX download fails on iOS Safari** — verify the client is using the `Blob → URL.createObjectURL → anchor.click()` pattern, not `window.location.href`.
- **`BUDGET_EXCEEDED` in local dev** — you have likely been iterating prompts. Check the ledger: `select sum(estimated_cents) from praxis_spend_ledger where timestamp > now() - interval '30 days';`. Raise `PRAXIS_MONTHLY_BUDGET_CENTS` locally if needed.
- **Cache never hits** — check your topic fingerprint is deterministic by running `topicFingerprint('sales') === topicFingerprint('learn sales')`. If not, the normalizer needs work.

## Running tests

```bash
npm run lint                    # linter
npm run build                   # typecheck + build
npx vitest run                  # unit tests (prompt assemblers, pruning, fingerprint)
npx playwright test             # E2E
```

## Resetting local state

```sql
-- In the Supabase SQL editor or psql
truncate praxis_messages, praxis_conversations, praxis_templates,
         praxis_onboarding, praxis_units, praxis_topics,
         praxis_curriculum_cache, praxis_unit_cache, praxis_spend_ledger
         restart identity cascade;
```

Auth users and invitations are preserved. To wipe everything, delete the Supabase auth user in the dashboard.
