# Living Plan: PRAXIS — 010-praxis-learning-platform

**Feature**: 010-praxis-learning-platform  
**Spec folder**: [`specs/010-praxis-learning-platform/`](../../specs/010-praxis-learning-platform/)  
**Status**: Week 0 in progress — prompt drafts landed, eval harness pending  
**Created**: 2026-04-18

This document is the single source of truth for day-to-day progress on PRAXIS. It mirrors the spec folder's plan at a higher level and is updated continuously. The spec folder is edited only when a decision or requirement formally changes.

## Locked decisions (freeze)

| # | Decision | Choice | Date |
|---|---|---|---|
| D1 | Topic model | Agnostic-first; all topics AI-generated | 2026-04-18 |
| D2 | Persona | Named: **Nori** | 2026-04-18 |
| D3 | Audience | Invite-only with Supabase auth | 2026-04-18 |
| D4 | Locale | EN only, locale-aware architecture | 2026-04-18 |
| D5 | North-star metric | 7-day return rate | 2026-04-18 |
| D6 | Deployment | Hybrid (no static export to remove) | 2026-04-18 |
| D7 | Sales topic | Pure generation, no special-case path | 2026-04-18 |

## Progress overview

### Planning phase

- [x] Spec document `spec.md`
- [x] Implementation plan `plan.md`
- [x] Research document `research.md`
- [x] Data model `data-model.md`
- [x] Six API contracts
- [x] Tasks breakdown `tasks.md`
- [x] Quickstart guide `quickstart.md`
- [x] Phase 1 scope-freeze checklist
- [x] Pre-launch checklist

### Week 0 — Prompt foundation

- [x] T-001 Nori persona prompt
- [x] T-002 Scope guardrail prompt
- [x] T-003 Curriculum outline prompt
- [x] T-004 Curriculum unit prompt
- [x] T-005 Onboarding meta prompt
- [x] T-006 Template generator prompt
- [x] T-007 Eval harness (`scripts/praxis-eval.ts` + `src/lib/praxis/eval/*` + OpenRouter client; run via `npm run praxis:eval`)
- [x] T-008 Adversarial probe set (5 refuse + 4 admit fixtures in `scope.guardrail.ts`; binary runner enforces pass rate ≥ 1.0)
- [ ] T-009 Week 0 exit bar met (awaiting first live run with `OPENROUTER_API_KEY`)
- [x] T-010 Prompt VERSION constants locked (see `src/lib/praxis/prompts/index.ts`)

### Week 1 — Infrastructure

- [~] T-011 Dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `jose`, `resend`, `tsx`, `zod`, `vitest` installed; `docx`, `exceljs` deferred to Week 6 template renderers. Anthropic SDK dropped (replaced by OpenRouter).
- [x] T-012 Migration pushed to remote Supabase (`imrbhronujwhbjcslgym`); `supabase/config.toml` updated to `major_version = 17`
- [x] T-013 Live-generated types at `src/lib/praxis/supabase/database.types.ts` (UTF-8); alias module at `src/lib/praxis/supabase/tables.ts`
- [x] T-014 Supabase clients wired (`src/utils/supabase/{client,server,middleware}.ts` for browser/SSR; `src/lib/praxis/supabase/admin.ts` for service-role)
- [x] T-015 Session helpers: `src/lib/praxis/session/{updateSession,getLearner,requireInvite}.ts`
- [x] T-016 Middleware auth gate (`src/middleware.ts` composes next-intl + Supabase refresh + redirect or 401 for unauth `/learn/*` and `/api/praxis/*`)
- [x] T-017 Invite endpoint (`src/app/api/praxis/invite/route.ts` — admin-token gate, zod body, Resend dispatch, contract-accurate error envelope)
- [x] T-018 Callback route (`src/app/[locale]/learn/callback/page.tsx` — JWT verify + invite re-check + Supabase `generateLink` → redirect)
- [x] T-019 `/learn/not-invited` page (`src/app/[locale]/learn/not-invited/page.tsx` — static, honest, no request-access form)
- [x] T-020 Library shell (`src/app/[locale]/learn/page.tsx` — empty state + topic list, uses `requireLearner()`)
- [x] T-021 `scripts/praxis-invite.ts` CLI (+ `scripts/praxis-secret.ts` Windows-friendly secret generator)
- [x] T-022 Praxis namespace added to `messages/en.json` and `messages/th.json`

### Week 2 — Topic entry & outline

- [x] T-023 OpenRouter ledger + pricing + factory (`src/lib/praxis/openrouter/{ledger,pricing,factory}.ts`). `LedgerEndpoint` enum, `assertBudget()`, `BudgetExceededError`.
- [x] T-024 Topic fingerprint (`src/lib/praxis/cache/topicFingerprint.ts`) — 15 unit tests passing via `npm test`.
- [x] T-025 Curriculum endpoint (`src/app/api/praxis/curriculum/route.ts` + `src/lib/praxis/curriculum/service.ts`). Scope guardrail + cache-aware outline + accept with material-edit detection.
- [x] T-026 `TopicEntryCanvas.tsx` with suggestion chips.
- [x] T-027 `OutlinePreview.tsx` + `OutlineStepper.tsx`; orchestrator `NewTopicFlow.tsx`.
- [x] T-028 `ScopeRejectionCard.tsx` (category-aware rejection UI).
- [x] T-029 Library queries wired through `/learn/page.tsx`.
- [x] T-030 `LibraryHome.tsx` + `TopicCard.tsx` extracted from the page.
- [ ] T-031 Playwright E2E (deferred; requires live dev server + env)
- [ ] T-030 Library components
- [ ] T-031 E2E: topic acceptance

### Week 3 — Adaptive onboarding

- [ ] T-032 Onboarding endpoint
- [ ] T-033 Onboarding UI
- [ ] T-034 Version bumping
- [ ] T-035 Edit affordance
- [ ] T-036 E2E: onboarding to active

### Week 4 — Unit generation

- [ ] T-037 Unit endpoint
- [ ] T-038 Unit renderer
- [ ] T-039 Block regeneration UI
- [ ] T-040 Progress tracking
- [ ] T-041 Cache integration
- [ ] T-042 E2E: unit + regen

### Week 5 — Nori conversation

- [ ] T-043 Chat endpoint (SSE)
- [ ] T-044 Summarization pruning
- [ ] T-045 ChatSurface component
- [ ] T-046 StreamingMessage
- [ ] T-047 Keyboard-safe input
- [ ] T-048 Unit chat integration
- [ ] T-049 Full-screen mate
- [ ] T-050 Conversation persistence
- [ ] T-051 Pruning unit tests
- [ ] T-052 E2E: 12-turn + reload

### Week 6 — Templates

- [ ] T-053 Template endpoint
- [ ] T-054 DOCX renderer
- [ ] T-055 XLSX renderer
- [ ] T-056 Preview + regenerate UI
- [ ] T-057 Unit integration
- [ ] T-058 iOS Safari download path
- [ ] T-059 E2E: template flow

### Week 7 — Mobile, cost, instrumentation

- [ ] T-060 Mobile audit
- [ ] T-061 Keyboard inset height
- [ ] T-062 Spend ledger live
- [ ] T-063 Budget enforcement
- [ ] T-064 Analytics events
- [ ] T-065 Return-rate query
- [ ] T-066 Cache hit-rate dashboard

### Week 8–9 — Quality tuning

- [ ] T-067 Jane invited
- [ ] T-068 Observation notes
- [ ] T-069 Prompt iteration
- [ ] T-070 Remaining invitees onboarded
- [ ] T-071 Weekly scope-freeze review
- [ ] T-072 SC-005 survey collection

### Week 10 — Observation

- [ ] T-073 All SCs measured
- [ ] T-074 Phase 2 backlog
- [ ] T-075 Status → Complete

## Open items

### Constitutional amendment (recommended, non-blocking)

A `PATCH` bump of `.specify/memory/constitution.md` (3.1.0 → 3.1.1) is recommended to clarify that Principle X's "narrowly scoped server capabilities" category explicitly includes learning subsystems like PRAXIS under `/learn/*`. Not a blocker — the current wording permits it by analogy with "contact or other narrowly scoped needs." Action owner: First, to decide before or during Week 1.

### Pending questions for Week 0

- **Anthropic model**: Sonnet 4 is the default. Compare Sonnet vs. Haiku latency and quality on the eval harness in Week 0; switch if the data supports it.
- **Soft-launch cadence**: Day-by-day invitee plan for Week 8 is draft (Jane day 1, two day 3, two day 5–6). Revise based on Jane's observed bug rate.

## Changelog

### 2026-04-24 (night)

- **Week 2** closed at the code level (T-023 → T-030; T-031 Playwright deferred).
- New: `src/lib/praxis/openrouter/pricing.ts` — static per-model cents/Mtok table with conservative fallback.
- New: `src/lib/praxis/openrouter/ledger.ts` — append-only ledger writer + `assertBudget()` with `PRAXIS_MONTHLY_BUDGET_CENTS` guard.
- New: `src/lib/praxis/openrouter/factory.ts` — memoised `getClient()` + `defaultModel()`.
- New: `src/lib/praxis/cache/topicFingerprint.ts` — normalise → sort tokens → SHA-1, with 15-case Vitest suite (`npm test` green).
- New: `src/lib/praxis/curriculum/service.ts` — `runScopeGuardrail()`, `getOrGenerateOutline()` (cache-aware, one-retry on bad JSON), `persistAcceptedOutline()` (material-edit detection via Levenshtein ratio).
- New: `src/app/api/praxis/curriculum/route.ts` — `POST` with `action: outline | accept`, zod discriminated-union schema, contract-accurate error envelope (400 / 401 / 409 / 502 / 503).
- New client components: `NewTopicFlow.tsx` (state machine), `TopicEntryCanvas.tsx`, `OutlinePreview.tsx`, `OutlineStepper.tsx`, `ScopeRejectionCard.tsx`, `LibraryHome.tsx`, `TopicCard.tsx`.
- New page: `/learn/new` at `src/app/[locale]/learn/new/page.tsx`.
- i18n: `praxis.newTopic`, `praxis.outline`, `praxis.scope`, `praxis.library.statuses` added to en + th.
- Vitest split into two configs: `vitest.config.ts` (existing Storybook browser suite) and `vitest.unit.config.ts` (PRAXIS node suite); new `npm test` script.
- Next action: Week 3 adaptive onboarding (T-032 endpoint, T-033 UI, T-034 version bumping).

### 2026-04-24 (late)

- **Week 1** closed at the code level (T-017 through T-022).
- New: `src/lib/praxis/invite/token.ts` — `mintInviteToken` / `verifyInviteToken` using `jose` (HS256, 15-min expiry, `PRAXIS_INVITE_SECRET`), with `InviteTokenError` enum + typed error class.
- New: `src/lib/praxis/email/resend.ts` — `sendInvitationEmail` using the existing `resend` dep; minimal HTML + text bodies; overrideable sender via `PRAXIS_EMAIL_FROM` / `PRAXIS_EMAIL_FROM_NAME`.
- New: `src/app/api/praxis/invite/route.ts` — `POST` handler strictly following `contracts/auth.invite.md`. Handles fresh invites, resurrects revoked rows, returns 201 with `deliveryStatus`. `PRAXIS_INVITER_USER_ID` now required (seed via Supabase Studio).
- New: `src/app/[locale]/learn/callback/page.tsx` — server component that does JWT verify → `requireInvite()` → Supabase admin `generateLink({ type: 'magiclink' })` → `redirect()` to the action URL. Localised error screens for six failure kinds.
- New: `src/app/[locale]/learn/not-invited/page.tsx` and `src/app/[locale]/learn/page.tsx` (library shell).
- New scripts: `npm run praxis:invite`, `npm run praxis:secret` (Windows-compatible since `openssl` isn't on PowerShell by default).
- i18n: `praxis.notInvited` + `praxis.library` + `praxis.callback` namespaces added to both `en.json` and `th.json`.
- Theme fix: initial page drafts used invented `--pf-*` tokens; swapped to the actual Tailwind v4 theme (`text-foreground`, `bg-card`, `text-primary`, etc.) from `src/styles/globals.css`.
- `typecheck` clean.
- Week 1 exit bar is achievable now. Manual smoke test required: (a) set `PRAXIS_INVITE_SECRET`, `PRAXIS_ADMIN_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `PRAXIS_INVITER_USER_ID`; (b) `npm run dev`; (c) `npm run praxis:invite -- --email=your@email`; (d) click link, expect `/learn` empty state.
- Next action: **T-009** (Week 0 eval exit bar) runnable any time with an `OPENROUTER_API_KEY`; Week 2 starts at T-023 (OpenRouter chat client + ledger) and T-024 (blank-canvas entry UI).

### 2026-04-24 (evening)

- **Week 1** auth gate landed end-to-end (T-012 → T-016).
- Supabase remote (`imrbhronujwhbjcslgym`) linked, migration pushed cleanly, types regenerated with UTF-8 redirect (`Out-File -Encoding utf8`) after PowerShell's default UTF-16 corrupted the first run.
- `supabase/config.toml` bumped to `major_version = 17` to match remote.
- New: `src/lib/praxis/supabase/tables.ts` — Row/Insert/Update aliases over the generated `Database` so callers avoid deep index chains.
- New: `src/lib/praxis/session/updateSession.ts` — Supabase session refresh + unauth branch (redirect for pages, JSON 401 for `/api/praxis/*`). Locale-aware.
- New: `src/lib/praxis/session/getLearner.ts` — `getLearner()` + `requireLearner()` for server components and route handlers.
- New: `src/lib/praxis/session/requireInvite.ts` — `InviteRejectionError` + reason enum for the upcoming `/learn/callback` handshake.
- Updated: `src/middleware.ts` — composes next-intl with the PRAXIS auth gate; matcher widened to include `/api/praxis/*`; cookie-merge helper carries refreshed tokens across intl rewrites.
- Updated: `.env.local.example` gains `PRAXIS_ADMIN_TOKEN` (per `contracts/auth.invite.md`).
- `typecheck` clean across workspace.
- Next action: T-017 (`POST /api/praxis/invite`), T-018 (`/learn/callback`), T-019 (`/learn/not-invited`), T-020 (`/learn` library shell). All four are independent and can land in any order.

### 2026-04-24 (afternoon)

- **Week 1** schema landed at the file level (T-012 authored, T-013 stubbed, T-014 admin client added).
- New: `supabase/migrations/20260421000000_praxis_initial.sql` with full DDL + RLS policies for every learner-scoped table + service-role-only caches/ledger + immutable-message grants.
- New: `supabase/config.toml` with `enable_signup = false` and Supabase email disabled (FR-003: Resend-only).
- New: `src/lib/praxis/supabase/admin.ts` — memoised service-role client typed with `Database`.
- New: `src/lib/praxis/supabase/database.types.ts` — stub hand-typed to match the migration; will be replaced by `supabase gen types typescript --linked` (T-013) once the remote project is provisioned.
- `typecheck` clean across the entire workspace.
- Next action: provision the remote Supabase project, `supabase link --project-ref <ref>`, `supabase db push`, then regenerate types.

### 2026-04-24 (morning)

- **Week 0** eval harness landed (T-007, T-008).
- New: `src/lib/praxis/openrouter/client.ts` (provider-agnostic REST wrapper with retry + JSON extraction), `src/lib/praxis/eval/{types,judge,runners,report}.ts`, `scripts/praxis-eval.ts`.
- Rubric criteria split into outline (4) and unit (5) per `research.md` §5. Scope is binary (fixture name prefix encodes expected verdict). Onboarding + template use heuristic checks (count, role/goal keywords, personalisation reference count, XLSX table presence).
- Harness writes timestamped CSV + Markdown reports to `.windsurf/docs/praxis-eval/<ts>.{csv,md}` and exits non-zero on any failure so it can gate CI later.
- New npm script: `npm run praxis:eval -- [--module=<name>] [--model=<slug>] [--judge=<slug>]`.
- `.env.local.example` updated with `OPENROUTER_API_KEY`, `PRAXIS_EVAL_MODEL`, and placeholders for Supabase service role + invite secret.
- Blocked on: first live run requires `OPENROUTER_API_KEY` in `.env.local`. Once run, iterate T-009 until exit bar met.
- Next action: Provision OpenRouter key, run `npm run praxis:eval`, iterate prompts until exit bar (outline ≥ 2.5, unit ≥ 2.3, scope pass=1.0) clears.

### 2026-04-19

- **Week 0** prompt foundation drafted end-to-end.
- Tasks completed: T-001 through T-006, T-010.
- New: `src/lib/praxis/prompts/` now holds six pure prompt modules plus shared types (`types.ts`), shared fragments (`_shared.ts`), and a barrel exporting `PROMPT_VERSIONS`.
- Provider direction change captured in every module: prompts are provider-agnostic so OpenRouter can dispatch to Claude/GPT/Llama without re-tuning.
- Next action: Build `scripts/praxis-eval.ts` (T-007) to run fixtures against OpenRouter and score with the Week 0 rubric.

### 2026-04-18

- Initial planning complete.
- Seven guiding decisions (D1–D7) locked with First.
- Scope reshape from the PRD v1 baseline: agnostic-first replaces curated modules; Supabase auth replaces localStorage; 7-day return replaces open-ended metric list.
- Discovery: portfolio's `next.config.ts` already hybrid — no static-export removal needed (resolves OQ-04 from PRD).
- Timeline revised from PRD's 6 weeks to realistic 10 weeks.
- Spec folder `specs/005-praxis-learning-platform/` created with `spec.md`, `plan.md`, `research.md`, `data-model.md`, six contracts, `tasks.md`, `quickstart.md`, and two checklists.
- Next action: Begin Week 0 prompt foundation (T-001 through T-010). No component code until the prompt exit bar is met.

## Changelog entry template

```md
### YYYY-MM-DD

- **Week N** progress summary.
- Tasks completed: T-XXX, T-YYY.
- Decisions made or changed: (if any)
- Scope changes: (none | link to scope-change note)
- Metrics snapshot: (if relevant)
- Next action: ...
```
