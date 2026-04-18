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
- [ ] T-007 Eval harness
- [ ] T-008 Adversarial probe set (fixtures landed with T-002; eval run pending)
- [ ] T-009 Week 0 exit bar met
- [x] T-010 Prompt VERSION constants locked (see `src/lib/praxis/prompts/index.ts`)

### Week 1 — Infrastructure

- [~] T-011 Dependencies installed (`@supabase/supabase-js`, `@supabase/ssr` done; `ai`, `@ai-sdk/*`, `docx`, `exceljs`, `jose` pending — Anthropic SDK dropped in favour of OpenRouter)
- [ ] T-012 Supabase provisioned + migration applied
- [ ] T-013 TS types generated
- [x] T-014 Supabase clients wired (`src/utils/supabase/{client,server,middleware}.ts`)
- [ ] T-015 Session helpers
- [ ] T-016 Middleware auth gate
- [ ] T-017 Invite endpoint
- [ ] T-018 Callback route
- [ ] T-019 `/learn/not-invited` page
- [ ] T-020 Library shell
- [ ] T-021 `praxis-invite` script
- [ ] T-022 `messages/en.json` namespace

### Week 2 — Topic entry & outline

- [ ] T-023 Anthropic client + ledger
- [ ] T-024 Topic fingerprint
- [ ] T-025 Curriculum endpoint
- [ ] T-026 `TopicEntryCanvas`
- [ ] T-027 Outline review UX
- [ ] T-028 Scope guard message
- [ ] T-029 Library topic list
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
