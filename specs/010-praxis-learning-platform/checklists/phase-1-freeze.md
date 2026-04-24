# Checklist: Phase 1 Scope Freeze

**Feature**: 005-praxis-learning-platform  
**Cadence**: Reviewed at the start of every week from Week 2 onward.

The single biggest risk to Phase 1 is scope creep. This checklist is the veto mechanism. Any proposed change that is not already in scope requires either rejection, deferral to Phase 2, or an explicit, written scope-change note added to the living plan.

## The frozen scope

Phase 1 delivers exactly the following and nothing else:

- Invite-only Supabase auth via magic link (Resend).
- Library view listing the authenticated learner's topics.
- Blank-canvas topic entry with scope guardrail.
- AI-generated curriculum outline with reviewable edit step.
- Topic-adaptive onboarding (3–5 questions).
- AI-generated unit content with block-level regeneration.
- Named AI persona (Nori) with streaming chat on unit and full-screen surfaces.
- On-demand DOCX and XLSX template generation with preview and regeneration.
- Per-unit progress tracking.
- Cross-device persistence.
- EN-only content with locale-aware architecture.
- Monthly Anthropic spend guardrail.
- Analytics for 7-day return rate and supporting secondary metrics.

## The frozen out-of-scope

See `spec.md` Out of Scope section. The list is reproduced here for scanning:

- [ ] Public signup confirmed **out of scope**.
- [ ] Video or audio content confirmed **out of scope**.
- [ ] Community / peer features confirmed **out of scope**.
- [ ] Gamification confirmed **out of scope**.
- [ ] Team or organization accounts confirmed **out of scope**.
- [ ] Third-party module marketplace confirmed **out of scope**.
- [ ] Native mobile app confirmed **out of scope**.
- [ ] LMS integrations confirmed **out of scope**.
- [ ] Paid tiers / payments confirmed **out of scope**.
- [ ] Autonomous web research during generation confirmed **out of scope**.
- [ ] Real-time collaboration / live tutoring confirmed **out of scope**.
- [ ] Thai-language content confirmed **out of scope** (architecture-only is in scope).
- [ ] PDF templates confirmed **out of scope** (Phase 3).
- [ ] Playbook PDF export confirmed **out of scope** (Phase 3).
- [ ] Cross-topic memory in a single conversation confirmed **out of scope** (Phase 3).

## Weekly review procedure

At the start of each week from Week 2 onward, answer these questions in the living plan's changelog entry for that week:

- [ ] Has any new feature been proposed since last review?
- [ ] Is that feature in the frozen-scope list above?
  - If yes: proceed.
  - If no: default to deferring to Phase 2. If genuinely urgent, document a formal scope change and update `spec.md` and `plan.md`.
- [ ] Are any in-scope items being silently cut? (Equivalent to adding scope — the total volume must stay constant.)
- [ ] Is Week N still the realistic finish line for the current phase?

## Scope-change escalation path

A scope change is permitted but requires:

1. A one-paragraph justification in `.windsurf/plans/005-praxis-learning-platform.md` changelog.
2. An updated `spec.md` requirement (new FR or modified FR) with the correct phase tag.
3. An updated `tasks.md` with the added or removed tasks.
4. A timeline re-estimate; the default answer is "this pushes a downstream week by ≥ 3 days".
5. A written check that the change does not silently drop a frozen out-of-scope item into Phase 1 by aliasing.

## Red flags (stop and review immediately)

- [ ] A new dependency added that was not in `plan.md` Technical Context.
- [ ] A new API route under `/api/praxis/*` not documented in `contracts/`.
- [ ] A new Supabase table not in `data-model.md`.
- [ ] Any user-facing string bypassing `messages/en.json`.
- [ ] Any direct Anthropic SDK call outside `src/lib/praxis/anthropic/`.
- [ ] Any component outside `src/components/praxis/` that imports from `src/lib/praxis/`.
- [ ] Any change to `next.config.ts`, `src/middleware.ts`, or `.env.local.example` without a living-plan note.
