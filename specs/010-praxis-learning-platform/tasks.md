# Tasks: PRAXIS Phase 1

**Feature**: 005-praxis-learning-platform  
**Date**: 2026-04-18  
**Horizon**: 10 weeks from start of Week 0

Tasks are grouped by week and numbered `T-XXX`. Each task has an owner (First unless marked), a rough estimate, and pointers to relevant requirements or research sections.

---

## Week 0 — Prompt foundation (prerequisite)

> **Exit bar**: Outline prompt ≥ 2.5/3 rubric, unit prompt ≥ 2.3/3, scope guardrail zero false negatives on adversarial probes. No component code written until this bar is met. See `research.md` §5.

- [ ] **T-001** — Draft `src/lib/praxis/prompts/nori.persona.ts`. Identity, tone, behavioral rules, scope refusals. ≤ 800 static tokens. _NFR-007, NFR-008._
- [ ] **T-002** — Draft `src/lib/praxis/prompts/scope.guardrail.ts`. Classifier returning `{ admitted, category, explanation }`.
- [ ] **T-003** — Draft `src/lib/praxis/prompts/curriculum.outline.ts`. Returns JSON `{ units: [...] }` with strict schema in the prompt.
- [ ] **T-004** — Draft `src/lib/praxis/prompts/curriculum.unit.ts`. Returns JSON `{ blocks: [...] }`.
- [ ] **T-005** — Draft `src/lib/praxis/prompts/onboarding.meta.ts`. Returns JSON `{ questions: [...] }`.
- [ ] **T-006** — Draft `src/lib/praxis/prompts/template.generator.ts`. Returns JSON conforming to `TemplateSpec`.
- [ ] **T-007** — Build `scripts/praxis-eval.ts`. Runs all six prompts against ten seed topics × three personas. Outputs CSV and summary to `.windsurf/docs/praxis-eval/<date>.md`.
- [ ] **T-008** — Probe set: five adversarial topics (medical, legal, financial, explicit, minors). Scope guardrail must reject all five with zero false negatives.
- [ ] **T-009** — Iterate prompts until Week 0 exit bar is met. Log rubric score history in the living plan.
- [ ] **T-010** — Record a chosen model version identifier in each prompt module (`VERSION = 'curriculum.outline@1'`). Commit fixtures.

## Week 1 — Infrastructure

> **Exit bar**: Supabase project provisioned, schema migration applied, invite → magic link → authenticated `/learn` empty state works end-to-end.

- [ ] **T-011** — Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `@anthropic-ai/sdk`, `ai`, `@ai-sdk/anthropic`, `docx`, `exceljs`, `jose` (for JWT). _research §1, §2._
- [ ] **T-012** — Provision Supabase project. Record URL and keys in `.env.local.example`. Apply migration `supabase/migrations/20260421_praxis_initial.sql`. _data-model.md._
- [ ] **T-013** — Generate TypeScript types: `npx supabase gen types typescript > src/lib/praxis/supabase/database.types.ts`.
- [ ] **T-014** — Create `src/lib/praxis/supabase/` clients: `client.ts`, `server.ts`, `admin.ts`. Use `@supabase/ssr` cookie-based session pattern.
- [ ] **T-015** — Create `src/lib/praxis/session/getLearner.ts` and `requireInvite.ts`.
- [ ] **T-016** — Update `src/middleware.ts` to guard `/learn/*` and `/api/praxis/*` and redirect unauthenticated traffic to `/learn/not-invited`.
- [ ] **T-017** — Build `POST /api/praxis/invite` per `contracts/auth.invite.md`. _FR-002, FR-003, FR-005._
- [ ] **T-018** — Build `/learn/callback` route verifying invite JWT, calling Supabase admin `generateLink`, establishing session.
- [ ] **T-019** — Create `/learn/not-invited` page. _FR-001._
- [ ] **T-020** — Create `/learn/page.tsx` library shell (empty state only). _FR-006._
- [ ] **T-021** — Add `scripts/praxis-invite.ts` for local-dev convenience.
- [ ] **T-022** — Add `messages/en.json` "praxis" namespace.

## Week 2 — Topic entry and outline

> **Exit bar**: Learner can type a topic, see the scope guardrail work, see an outline, edit it, and persist an accepted topic.

- [ ] **T-023** — Create `src/lib/praxis/anthropic/{client,stream,ledger}.ts`. _research §1, §9._
- [ ] **T-024** — Create `src/lib/praxis/cache/topicFingerprint.ts`. Unit-tested against diverse topic strings.
- [ ] **T-025** — Build `POST /api/praxis/curriculum` (actions `outline` and `accept`) per `contracts/curriculum.generate.md`. _FR-009, FR-010, FR-011._
- [ ] **T-026** — Build `TopicEntryCanvas.tsx` component: blank-canvas entry + suggestion chips. _FR-007._
- [ ] **T-027** — Build `OutlinePreview.tsx` + `OutlineStepper.tsx` for the review UX.
- [ ] **T-028** — Build `ScopeGuardMessage.tsx` for rejection state. _FR-008._
- [ ] **T-029** — Wire library view to topic list (`praxis_topics` for current learner).
- [ ] **T-030** — Write `LibraryHome.tsx` with `TopicCard.tsx`.
- [ ] **T-031** — Playwright E2E: invite → sign-in → type topic → see outline → accept → land on module overview.

## Week 3 — Adaptive onboarding

> **Exit bar**: Learner completes onboarding for any accepted topic; answers persist; subsequent AI calls receive onboarding context.

- [ ] **T-032** — Build `POST /api/praxis/onboarding` per `contracts/onboarding.generate.md`. _FR-014, FR-015, FR-016._
- [ ] **T-033** — Build `/learn/[topic]/onboarding/page.tsx` with `AdaptiveQuestion.tsx` + `OnboardingProgress.tsx`.
- [ ] **T-034** — Implement profile version bumping on edit.
- [ ] **T-035** — Add "edit onboarding" affordance on module overview.
- [ ] **T-036** — Playwright E2E: accept outline → answer 4 questions → arrive at module overview with status `active`.

## Week 4 — Unit generation

> **Exit bar**: Opening any unit triggers generation (or cache hit), blocks render, completion can be marked, a block can be regenerated.

- [ ] **T-037** — Build `POST /api/praxis/unit` (actions `generate`, `regenerate_block`) per `contracts/unit.generate.md`. _FR-012, FR-013._
- [ ] **T-038** — Build `/learn/[topic]/[unit]/page.tsx` with `UnitRenderer.tsx` and `ContentBlock.tsx`.
- [ ] **T-039** — Add `BlockRegenerateAction.tsx` inline UI.
- [ ] **T-040** — Implement module overview with progress indicator. _FR-026._
- [ ] **T-041** — Implement unit cache lookup and write on miss.
- [ ] **T-042** — Playwright E2E: open unit → see blocks → regenerate one block → mark complete → overview reflects progress.

## Week 5 — Nori conversation (unit + full-screen)

> **Exit bar**: Streaming chat works on unit and full-screen surfaces; context rail shows learner profile; conversations persist across reloads; older turns summarize without losing facts.

- [ ] **T-043** — Build `POST /api/praxis/chat` per `contracts/chat.stream.md`. _FR-017 to FR-022, NFR-001, NFR-008._
- [ ] **T-044** — Build `src/lib/praxis/anthropic/pruning.ts` with summarization at 6,500-token threshold. _research §7._
- [ ] **T-045** — Build `ChatSurface.tsx` (shared component with surface prop).
- [ ] **T-046** — Build `StreamingMessage.tsx` using `useChat` from `ai/react`.
- [ ] **T-047** — Build `MessageInput.tsx` with keyboard-safe sticky positioning. _research §10._
- [ ] **T-048** — Integrate chat into unit page.
- [ ] **T-049** — Build `/learn/[topic]/mate/page.tsx` with `MateShell.tsx` + `ContextRail.tsx` + `IntentChips.tsx`.
- [ ] **T-050** — Implement conversation persistence and restoration.
- [ ] **T-051** — Unit tests: pruning preserves facts across 3 synthetic summarization cycles.
- [ ] **T-052** — Playwright E2E: 12-turn conversation on unit → reload → conversation restored.

## Week 6 — Templates on demand

> **Exit bar**: Learner can request a template, preview it, download it (DOCX/XLSX), and regenerate with an instruction.

- [ ] **T-053** — Build `POST /api/praxis/template` per `contracts/template.generate.md`. _FR-023, FR-024, FR-025._
- [ ] **T-054** — Build `src/lib/praxis/templates/docx.ts` (renders `TemplateSpec` → DOCX via `docx` lib).
- [ ] **T-055** — Build `src/lib/praxis/templates/xlsx.ts` (renders → XLSX via `exceljs`).
- [ ] **T-056** — Build `TemplatePreview.tsx` and `RegenerateNote.tsx` components.
- [ ] **T-057** — Integrate template affordance in unit page.
- [ ] **T-058** — iOS Safari download path: `fetch` → `Blob` → `URL.createObjectURL` → `anchor.click()`. _research §10._
- [ ] **T-059** — Playwright E2E: request template → preview → download → regenerate → new preview differs.

## Week 7 — Mobile, cost, instrumentation

> **Exit bar**: 375px viewport audit passes, monthly spend ledger active, return-rate tracking shipping.

- [ ] **T-060** — Mobile audit across all `/learn/*` routes. Fix layout and touch-target issues. _NFR-004._
- [ ] **T-061** — Add `env(keyboard-inset-height)` support to chat surface; test on iOS Safari.
- [ ] **T-062** — Implement `praxis_spend_ledger` writes across every Anthropic endpoint. _FR-030, SC-009._
- [ ] **T-063** — Add `PRAXIS_MONTHLY_BUDGET_CENTS` env var and BUDGET_EXCEEDED enforcement on generation endpoints.
- [ ] **T-064** — Add analytics events: `praxis_session_start`, `praxis_topic_created`, `praxis_unit_completed`, `praxis_template_downloaded`, `praxis_conversation_turn`. Namespaced under `praxis_*`. _SC-001._
- [ ] **T-065** — Implement 7-day return computation (query against `praxis_learners.last_active_at` + `auth.users` sign-in history).
- [ ] **T-066** — Build cache hit-rate read path for SC-004 tracking.

## Week 8–9 — Quality tuning with Jane

> **Exit bar**: Jane + 2–3 invitees actively using; no P1 bugs; at least three templates used in real situations.

- [ ] **T-067** — Invite Jane (day 1 of Week 8).
- [ ] **T-068** — Observe session (with consent) — document what Nori misses, what Jane repeatedly asks, which templates she downloads.
- [ ] **T-069** — Iterate prompts based on observation. Do not expand scope.
- [ ] **T-070** — Add 2 more invitees mid-Week 8; 2 more at end of Week 8.
- [ ] **T-071** — Weekly scope-freeze checklist review. See `checklists/phase-1-freeze.md`.
- [ ] **T-072** — Collect SC-005 survey (template real-world use) at each invitee's first return visit.

## Week 10 — Observation & Phase 2 backlog

- [ ] **T-073** — Measure SC-001 (7-day return), SC-002 (personalization audit), SC-003 (first-topic completion), SC-004 (cache efficiency), SC-006 (scope safety audit), SC-009 (spend under budget).
- [ ] **T-074** — Draft Phase 2 backlog based on gaps (likely: richer template kinds, cross-topic memory, curator UI).
- [ ] **T-075** — Move Phase 1 spec to `status: Complete` in the living plan.

---

## Task dependency notes

- T-011 (dependency install) blocks Week 1 API work.
- T-012 (Supabase provisioning) blocks T-013–T-020.
- T-009 (prompt exit bar) blocks Week 2; no component code lands until prompts clear.
- T-025 (curriculum endpoint) blocks Week 3 onboarding work.
- T-037 (unit endpoint) blocks Week 5 chat integration (chat needs unit context).
- T-043 (chat endpoint) has no blockers after Week 4 and can run in parallel with T-053 (templates).
- T-067 (invite Jane) is the single gate for Weeks 8–9 feedback loop.

## Definition of done

A task is done when:

1. Code merged to the `005-praxis-learning-platform` branch.
2. Relevant requirements (FR/NFR) are demonstrably exercised.
3. Playwright or Vitest test covers the happy path (where applicable).
4. Living plan is updated with changelog and checkbox progress (per user memory rule).
