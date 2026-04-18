# Implementation Plan: PRAXIS — AI-Generated Personalized Learning Platform

**Branch**: `005-praxis-learning-platform` | **Date**: 2026-04-18 | **Spec**: [`./spec.md`](./spec.md)  
**Input**: Feature specification from `specs/005-praxis-learning-platform/spec.md`

**Note**: This plan covers a new dynamic subsystem grafted onto the otherwise static-first portfolio. PRAXIS introduces server-side AI streaming, generated content, Supabase auth, and per-learner persistence under `/learn/*`. The implementation must preserve constitutional principles for the rest of the portfolio while carving an explicit, documented exception for PRAXIS routes.

## Summary

PRAXIS is a topic-agnostic, invite-only learning platform where an authenticated learner types any topic and receives a reviewable AI-generated curriculum, adaptive onboarding, generated unit content, on-demand personalized templates, and a named AI coach (Nori) that teaches through conversation grounded in the learner's stated context. Phase 1 targets a small invited cohort anchored by Jane (sales rep) with a ten-week timeline. The implementation is a new subsystem under `src/app/[locale]/learn/*`, new API routes under `src/app/api/praxis/*`, a new data layer against Supabase, and a tightly scoped set of new components reusing the existing Liquid Glass design system and `shadcn/ui` primitives.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 19, Next.js 15.2.4 App Router  
**Primary New Dependencies (to add)**: `@supabase/supabase-js`, `@supabase/ssr`, `@anthropic-ai/sdk`, `ai` (Vercel AI SDK for streaming helpers), `docx`, `exceljs` (or `xlsx`), optionally `@react-pdf/renderer` for PDF templates  
**Primary Existing Dependencies (reused)**: `next`, `next-intl`, `resend`, `zod`, `react-hook-form`, `framer-motion`, `lucide-react`, Radix UI primitives, shadcn/ui components, Tailwind v4  
**Storage**: Supabase Postgres for persistent entities; Supabase Auth (magic link) for sessions; Supabase Storage for generated template files if file-caching is used; no learner data in localStorage in Phase 1 beyond ephemeral UI state  
**Testing**: `npm run lint`, `npm run build`, Vitest for unit tests of prompt assemblers and scope guardrails, Playwright for end-to-end invite → generate → converse flows, manual prompt-eval harness with at least ten seed topics  
**Target Platform**: Vercel-hosted hybrid Next.js application (static marketing + serverless API under `/api/praxis/*`)  
**Project Type**: Web application — dynamic subsystem within an existing static-first portfolio  
**Performance Goals**: `/learn/*` shells meet FCP ≤ 1.5s desktop / 2.5s mobile; time-to-first-streamed-token ≤ 3s on 50 Mbps; Lighthouse Performance ≥ 90 mobile, ≥ 95 desktop for authenticated shell routes  
**Constraints**:
- Must not degrade Lighthouse scores of the existing portfolio (hero, timeline, about, projects).
- TypeScript strict mode, no `any`.
- All user-facing strings routed through `messages/en.json` via `next-intl`.
- Every new structured entity is a typed TypeScript interface AND a Supabase table defined via a tracked migration.
- System prompts, persona copy, scope guardrail rules, and onboarding meta-prompt live in a single versioned `src/lib/praxis/prompts/` directory, editable without touching React code.
- Anthropic API spend guarded by a server-side monthly ledger (see FR-030).
- Bilingual architecture (locale-aware) from day 1, even though Phase 1 is EN only.

**Scale/Scope**: A small invited cohort (1–20 learners) during Phase 1. Shared curriculum and unit cache must reduce cost by ≥ 50% on repeated topics (see SC-004). Conversations capped per unit at 20 persisted turns with older turns summarized.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I — Product Impact Over Implementation Folklore**: **Pass with explicit scope boundary.** PRAXIS is not a portfolio section; it is a learning product grafted under `/learn/*`. It does not reshape the first-impression, 60-second-window, or conversion principles that govern the portfolio proper. It adds a distinct product surface behind authentication that is discoverable by invitation only. The portfolio's hero, timeline, projects, about, and contact experiences remain untouched and continue to carry the constitution's first-impression mandate unchanged.

- **Principle II — Fast, Premium, Accessible Delivery**: **Pass with documented exception.** The portfolio itself remains Lighthouse-100-targetable and static-first. `/learn/*` routes are dynamic by design; they are held to a distinct performance target (FCP 1.5s/2.5s, Lighthouse ≥ 90/≥ 95, TTFT ≤ 3s for streamed AI). Liquid Glass aesthetics apply to all UI; accessibility (WCAG 2.1 AA) is non-negotiable across both surfaces. Reduced-motion behavior must apply to generation progress indicators and streaming chat.

- **Principle III — Insight-Dense Storytelling**: **Not applicable to PRAXIS content UX.** PRAXIS is an interactive tool, not an editorial surface. The principle is upheld by: (a) not letting PRAXIS bleed editorial weight into the portfolio, and (b) applying "summary-first, detail on demand" thinking to library and unit surfaces.

- **Principle IV — Bilingual Quality With Audience Fit**: **Pass architecturally, deferred on content.** Phase 1 ships EN only. The data model, route structure, prompt assembly, and `messages/` keys are locale-aware from the first commit, so adding Thai is a content task, not a schema migration.

- **Principle V — Cinematic Narrative, Subordinate to Clarity**: **Not applicable.** PRAXIS has no timeline. Motion in PRAXIS is reserved for streaming indicators, generation progress, and light Liquid buoyancy in chat; it must never block comprehension.

- **Principle VI — Evidence-Led Content System**: **Pass with subtype.** The portfolio's existing content system under `src/data/` and `messages/` is unchanged. PRAXIS introduces a parallel runtime-generated content system for learner-owned content (curricula, units, conversations). This is a separate content class, explicitly not part of the portfolio's evidence canon.

- **Principle VII — Measurement Must Inform Decisions**: **Pass.** One north-star metric (7-day return) drives Phase 1 instrumentation. Secondary metrics exist but do not drive decisions. No vanity tracking. Analytics events for PRAXIS are namespaced under `praxis_*` and documented in `src/lib/analytics/` alongside existing events.

- **Principle VIII — Conversion Paths Must Stay Obvious**: **Not applicable inside PRAXIS.** The portfolio's conversion paths are unchanged. PRAXIS has its own internal conversion: invitation → signed-in learner → completed onboarding → first unit.

- **Principle IX — Attention Retention Without Dead Ends**: **Pass.** PRAXIS surfaces internal next steps (next unit, try Nori full-screen, download a template) at every terminal state. No external redirects are introduced.

- **Principle X — Honest Technical Governance**: **Pass with amendment signal.** The constitution's Technical Delivery Baseline currently states user-facing content SHOULD be "statically sourceable and deterministic at build time." PRAXIS is dynamic by design and necessarily violates this expectation under `/learn/*`. This is not a constitutional conflict because the baseline explicitly permits "limited server capabilities … for contact or other narrowly scoped needs" and PRAXIS is architected as a narrowly scoped, bounded subsystem. A constitutional `PATCH` bump clarifying this (adding "learning subsystems" to the permitted narrowly-scoped-server category) is recommended but not required to start implementation.

**Conclusion**: No blocking violations. One recommended clarifying constitutional amendment logged in `.windsurf/plans/005-praxis-learning-platform.md`.

## Project Structure

### Documentation (this feature)

```text
specs/005-praxis-learning-platform/
├── plan.md                         # this file
├── spec.md                         # product definition
├── research.md                     # Claude streaming, Supabase auth, prompt eval,
│                                   # caching, cost model, scope guardrails
├── data-model.md                   # Supabase schema + TS types
├── contracts/
│   ├── auth.invite.md              # POST /api/praxis/invite (admin)
│   ├── chat.stream.md              # POST /api/praxis/chat (SSE)
│   ├── curriculum.generate.md      # POST /api/praxis/curriculum
│   ├── onboarding.generate.md      # POST /api/praxis/onboarding
│   ├── unit.generate.md            # POST /api/praxis/unit
│   └── template.generate.md        # POST /api/praxis/template
├── quickstart.md                   # dev setup, invite flow, add a topic locally
├── tasks.md                        # ordered weekly task breakdown
└── checklists/
    ├── phase-1-freeze.md           # scope-freeze enforcement checklist
    └── pre-launch.md               # soft-launch readiness checklist
```

### Source Code (repository root) — additions only

```text
src/
├── app/
│   ├── [locale]/
│   │   └── learn/
│   │       ├── layout.tsx                    # auth gate + PraxisProvider
│   │       ├── page.tsx                      # library view ("TA·6")
│   │       ├── not-invited/
│   │       │   └── page.tsx                  # "invitation required" state
│   │       ├── generate/
│   │       │   └── page.tsx                  # outline review ("TA·2")
│   │       └── [topic]/
│   │           ├── layout.tsx                # topic context provider
│   │           ├── page.tsx                  # module overview
│   │           ├── onboarding/page.tsx       # adaptive onboarding flow
│   │           ├── mate/page.tsx             # full-screen Nori
│   │           └── [unit]/page.tsx           # unit + inline chat
│   └── api/
│       └── praxis/
│           ├── invite/route.ts               # admin invite endpoint
│           ├── chat/route.ts                 # SSE streaming chat
│           ├── curriculum/route.ts           # outline + full generation
│           ├── onboarding/route.ts           # topic-adaptive Q generation
│           ├── unit/route.ts                 # unit + block regeneration
│           └── template/route.ts             # DOCX/XLSX/PDF generation
├── components/
│   └── praxis/
│       ├── library/
│       │   ├── LibraryHome.tsx
│       │   ├── TopicEntryCanvas.tsx
│       │   ├── TopicCard.tsx
│       │   └── SuggestionChip.tsx
│       ├── generate/
│       │   ├── OutlinePreview.tsx
│       │   ├── OutlineStepper.tsx
│       │   └── ScopeGuardMessage.tsx
│       ├── onboarding/
│       │   ├── AdaptiveQuestion.tsx
│       │   └── OnboardingProgress.tsx
│       ├── unit/
│       │   ├── UnitRenderer.tsx
│       │   ├── ContentBlock.tsx
│       │   └── BlockRegenerateAction.tsx
│       ├── chat/
│       │   ├── ChatSurface.tsx               # shared between unit + mate
│       │   ├── StreamingMessage.tsx
│       │   ├── MessageInput.tsx
│       │   └── IntentChips.tsx
│       ├── mate/
│       │   ├── MateShell.tsx
│       │   └── ContextRail.tsx
│       └── template/
│           ├── TemplatePreview.tsx
│           └── RegenerateNote.tsx
├── lib/
│   └── praxis/
│       ├── prompts/
│       │   ├── nori.persona.ts               # Nori identity + behavior rules
│       │   ├── curriculum.outline.ts         # outline generator prompt
│       │   ├── curriculum.unit.ts            # unit generator prompt
│       │   ├── onboarding.meta.ts            # topic-adaptive Q meta-prompt
│       │   ├── scope.guardrail.ts            # topic admissibility classifier
│       │   ├── template.generator.ts         # template body generator
│       │   └── index.ts
│       ├── supabase/
│       │   ├── client.ts                     # browser client
│       │   ├── server.ts                     # server client (SSR)
│       │   └── admin.ts                      # service-role client (invites)
│       ├── anthropic/
│       │   ├── client.ts
│       │   ├── stream.ts                     # SSE helper
│       │   └── ledger.ts                     # monthly spend guardrail
│       ├── cache/
│       │   ├── topicFingerprint.ts           # normalize "sales" == "learn sales"
│       │   └── curriculumCache.ts
│       ├── session/
│       │   ├── getLearner.ts
│       │   └── requireInvite.ts
│       └── types.ts
├── types/
│   └── praxis.ts                             # re-exports from lib/praxis/types.ts
└── middleware.ts                             # add /learn/* and /api/praxis/* auth

messages/
└── en.json                                   # new "praxis" namespace

supabase/
└── migrations/
    └── 20260421_praxis_initial.sql           # schema migration

.windsurf/
└── plans/
    └── 005-praxis-learning-platform.md       # living progress tracker
```

**Structure Decision**: A new subsystem under `src/app/[locale]/learn/*` with its own API namespace, component namespace, and library namespace. Prompt assembly, persona configuration, and Supabase/Anthropic clients are centralized under `src/lib/praxis/` to keep component code free of direct SDK or prompt concerns and satisfy NFR-007 (configurability). The subsystem is deliberately self-contained: no existing `src/components/sections/*` or `src/data/*` file is edited except `messages/en.json`, the Next.js `middleware.ts`, and `next.config.ts` for any new environment surface. Supabase schema is tracked via versioned SQL migrations under `supabase/migrations/`.

## Phased Roadmap (condensed)

Full weekly task breakdown lives in `./tasks.md`. The roadmap below anchors phase boundaries and review gates.

| Phase | Window | Exit Criteria |
|---|---|---|
| Week 0 — Prompt foundation | Before code | Nori persona, scope guardrail, curriculum outline, unit, onboarding meta, and template generator prompts drafted and evaluated against at least ten seed topics with rubric scoring. |
| Week 1 — Infra | — | Supabase project provisioned, schema migration applied, auth wired, invite flow live via Resend, `/learn` library shell renders empty state behind auth. |
| Week 2 — Topic entry & outline | — | Blank-canvas entry, scope guardrail, outline generator, outline review UX, outline caching layer live. |
| Week 3 — Adaptive onboarding | — | Topic-aware question generation, onboarding persistence, profile-editing flow. |
| Week 4 — Unit generation | — | Unit generator, unit renderer, block-level regeneration, completion tracking. |
| Week 5 — Nori | — | SSE streaming chat on unit page and full-screen mate, context rail, conversation persistence, pruning/summarization at 8k-token threshold. |
| Week 6 — Templates | — | DOCX and XLSX generators, in-browser preview, regenerate-with-instruction flow, Supabase Storage if file caching warranted. |
| Week 7 — Mobile, cost, instrumentation | — | 375px viewport audit passing, return-rate tracking in analytics, monthly spend ledger + guardrail, cache hit-rate dashboard. |
| Week 8–9 — Quality tuning with Jane | — | Jane (and 2–3 other invitees) actively using the platform; prompt eval results measurably improving; at least three templates downloaded and used in real situations. |
| Week 10 — Observation window | — | Phase 2 backlog defined from observed behavior; no Phase 1 scope items added after the week-2 freeze. |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                                                                                                   | Why Needed                                                                                                                                   | Simpler Alternative Rejected Because                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Introducing Supabase as a new persistence + auth backend                                                    | Phase 1 audience is "invited users with cross-device persistence" (user-locked decision); localStorage-only violates FR-004 and SC-007.      | Keeping localStorage would silently destroy progress on device switches and eliminate the 7-day-return north star.                                    |
| Introducing server-side Anthropic streaming under `/api/praxis/*`                                           | AI-generated curriculum, units, and templates are the product's central differentiator; cannot run client-side without leaking the API key. | Client-side API calls via a proxy expose the key and introduce additional latency; separate deployment defeats the unified-platform goal.              |
| Dynamic content under `/learn/*` in an otherwise static-first portfolio                                     | Agnostic-first generation is a locked product decision; static pre-rendering is impossible for learner-specific content.                     | Pre-authoring modules (as PRD v1 proposed) contradicts the locked "agnostic-first" decision and forces two code paths long-term.                       |
| New namespaces (`components/praxis/*`, `lib/praxis/*`, `app/[locale]/learn/*`, `app/api/praxis/*`)          | Keeps the subsystem auditable, easy to freeze-scope, and easy to remove if the product is ever sunset without scarring the portfolio.       | Mixing PRAXIS files into existing `components/sections/*` or `src/data/*` would erode the static-first portfolio's integrity.                          |
