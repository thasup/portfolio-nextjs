# Tasks: Full Portfolio Content Revision

**Input**: Design documents from `/specs/004-portfolio-content-revision/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No dedicated automated test tasks are generated because the specification does not explicitly require TDD or new automated coverage. Validation is performed through `npm run lint`, `npm run build`, and the independent review criteria defined per user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `US1`, `US2`)
- Every task includes the exact file path to change

## Path Conventions

- **Single project**: `src/`, `messages/`, and `specs/` at repository root
- **Web application**: Next.js App Router under `src/app/[locale]/`
- **Structured content**: version-controlled content modules under `src/data/`

---

## Phase 1: Setup (Shared Context Alignment)

**Purpose**: Confirm the current content baseline and align implementation against the approved source brief.

- [x] T001 Audit current portfolio content against `.windsurf/docs/full_portfolio_content_revision.md` and record section-by-section contradictions in `specs/004-portfolio-content-revision/quickstart.md`
- [x] T002 Review the current localized content structure in `messages/en.json` and `messages/th.json` to identify keys that must be updated or added for this feature
- [x] T003 Review the current structured content shape in `src/data/siteConfig.ts`, `src/data/timelineChapters.ts`, `src/data/timelineEvents.ts`, `src/data/projects.ts`, `src/data/testimonials.ts`, `src/data/skills.ts`, `src/data/valuePropositions.ts`, and `src/data/contactIntents.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared content structures and invariants that all user stories depend on.

**⚠️ CRITICAL**: No user story work should begin until these foundations are in place.

- [x] T004 Create or extend shared content types for narrative claims, signals, proof references, testimonial preview fields, project ownership fields, and capability clusters in `src/types/`
- [x] T005 [P] Add or normalize shared signal taxonomy and evidence-link capable data structures in `src/data/`
- [x] T006 [P] Normalize locale-aware content access patterns and fallback assumptions in `messages/en.json`, `messages/th.json`, and `src/i18n/`
- [x] T007 Update shared section-level content contracts and any supporting helpers for cross-section consistency in `src/lib/` and `src/components/shared/`
- [x] T008 Define a manual consistency checklist covering role, company, years of experience, flagship work, naming, and testimonials in `specs/004-portfolio-content-revision/quickstart.md`

**Checkpoint**: Foundation ready — user story work can now proceed in priority order or in parallel where capacity allows.

---

## Phase 3: User Story 1 - Understand credibility fast (Priority: P1) 🎯 MVP

**Goal**: Make the first screen accurately communicate First’s identity, current role, differentiators, and initial trust signals within a short skim.

**Independent Test**: Show the revised hero and opening proof layer to a first-time reviewer and confirm they can accurately restate current role, present direction, and one differentiator within 15 seconds.

### Implementation for User Story 1

- [x] T009 [P] [US1] Update core identity and first-screen trust data in `src/data/siteConfig.ts`
- [x] T010 [P] [US1] Revise hero-related English copy and trust-signal strings in `messages/en.json`
- [x] T011 [P] [US1] Revise hero-related Thai copy and trust-signal strings in `messages/th.json`
- [x] T012 [US1] Implement revised first-screen narrative, CTA hierarchy, and trust-signal presentation in `src/components/sections/Hero.tsx`
- [x] T013 [US1] Align homepage opening section composition and ordering for the revised first-impression flow in `src/app/[locale]/page.tsx`
- [x] T014 [US1] Verify the revised hero preserves equivalent meaning across locales in `src/components/sections/Hero.tsx`, `messages/en.json`, and `messages/th.json`

**Checkpoint**: User Story 1 should be independently functional and reviewable as the MVP.

---

## Phase 4: User Story 2 - Evaluate career arc and evidence (Priority: P1)

**Goal**: Present a truthful, evidence-backed 7+ year career story with stronger flagship proof and real testimonials.

**Independent Test**: Review the timeline, featured projects, and testimonials and confirm a reviewer can explain the engineering-to-software progression, current flagship work, and external validation without outside context.

### Implementation for User Story 2

- [x] T015 [P] [US2] Rewrite career chapter framing and chronology for the full 7+ year arc in `src/data/timelineChapters.ts`
- [x] T016 [P] [US2] Rewrite timeline events to cover pre-software engineering, transition, MAQE, and TeamStack proof in `src/data/timelineEvents.ts`
- [x] T017 [P] [US2] Re-rank featured work and add ownership/strategic contribution fields in `src/data/projects.ts`
- [x] T018 [P] [US2] Replace placeholder social proof with real attributed testimonials and strongest-line preview fields in `src/data/testimonials.ts`
- [x] T019 [US2] Update the timeline section narrative and evidence flow in `src/components/sections/Timeline.tsx`
- [x] T020 [P] [US2] Update timeline event rendering to surface revised summaries, impacts, and signal links in `src/components/timeline/TimelineEventCard.tsx`
- [x] T021 [US2] Update timeline year/chapter presentation for clearer capability progression in `src/components/timeline/TimelineYear.tsx` and `src/components/timeline/TimelineSpine.tsx`
- [x] T022 [US2] Update project listing and flagship ordering presentation in `src/components/sections/Projects.tsx`
- [x] T023 [P] [US2] Update project detail or modal presentation for ownership framing in `src/components/projects/` and `src/components/modals/`
- [x] T024 [US2] Update testimonial preview and full-quote presentation in `src/components/sections/Testimonials.tsx` and `src/components/sections/TestimonialsCarousel.tsx`
- [x] T025 [US2] Align localized project, timeline, and testimonial strings with the revised evidence story in `messages/en.json` and `messages/th.json`

**Checkpoint**: User Story 2 should independently prove the revised career arc, flagship work, and trust-building evidence.

---

## Phase 5: User Story 3 - Assess fit by intent (Priority: P2)

**Goal**: Help AI hiring, product evaluation, and collaboration-oriented visitors quickly identify fit and take the right next step.

**Independent Test**: Review the value proposition, skills framing, about narrative, and contact intent paths for each audience and confirm each path feels tailored and leads to a clear next action.

### Implementation for User Story 3

- [x] T026 [P] [US3] Reframe capability clusters and evidence-backed skills positioning in `src/data/skills.ts`
- [x] T027 [P] [US3] Revise audience-specific value propositions and supporting proof links in `src/data/valuePropositions.ts`
- [x] T028 [P] [US3] Revise contact intent copy for AI hiring, product ownership, collaboration, and general outreach in `src/data/contactIntents.ts`
- [x] T029 [US3] Implement the revised skills framing UI in `src/components/sections/Skills.tsx`
- [x] T030 [US3] Implement revised value proposition and audience-fit messaging in `src/components/sections/ValueProp.tsx` and `src/components/sections/ValueStrip.tsx`
- [x] T031 [US3] Implement tailored contact-intent presentation and prompts in `src/components/sections/Contact.tsx`
- [x] T032 [US3] Revise the about-page narrative to support founder trajectory, systems thinking, and Gaia framing in `src/app/[locale]/about/page.tsx`
- [x] T033 [US3] Align localized audience-fit messaging and CTAs in `messages/en.json` and `messages/th.json`

**Checkpoint**: User Story 3 should independently help different audiences recognize fit and select a clear next action.

---

## Phase 6: User Story 4 - Read a bilingual portfolio without loss of meaning (Priority: P2)

**Goal**: Ensure both English and Thai experiences preserve the same major claims, chronology, trust, and conversion intent with natural wording.

**Independent Test**: Compare hero, timeline, projects, testimonials, about, and contact content across locales and confirm no material loss of meaning, trust, or next-step clarity.

### Implementation for User Story 4

- [x] T034 [P] [US4] Review and reconcile bilingual identity, chronology, and proof claims in `messages/en.json` and `messages/th.json`
- [x] T035 [P] [US4] Add or refine locale-specific content keys needed by revised hero, timeline, projects, testimonials, value proposition, and contact surfaces in `messages/en.json` and `messages/th.json`
- [x] T036 [US4] Validate and adjust locale-aware rendering for revised section content in `src/app/[locale]/layout.tsx` and `src/app/[locale]/page.tsx`
- [x] T037 [US4] Validate and adjust locale-aware rendering for revised about and contact routes in `src/app/[locale]/about/page.tsx` and `src/app/[locale]/contact/page.tsx`
- [x] T038 [US4] Reconcile any remaining Thai/English parity gaps across `src/components/sections/Hero.tsx`, `src/components/sections/Timeline.tsx`, `src/components/sections/Projects.tsx`, `src/components/sections/Testimonials.tsx`, `src/components/sections/Skills.tsx`, `src/components/sections/ValueProp.tsx`, and `src/components/sections/Contact.tsx`

**Checkpoint**: User Story 4 should independently validate bilingual parity across the revised portfolio experience.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish cross-section consistency, quality checks, and final validation across all stories.

- [x] T039 [P] Run final contradiction review across `src/data/`, `messages/`, `src/components/sections/`, and `src/app/[locale]/` using the checklist in `specs/004-portfolio-content-revision/quickstart.md`
- [x] T040 [P] Refine evidence loops and repeated signal presentation across `src/data/projects.ts`, `src/data/testimonials.ts`, `src/data/timelineEvents.ts`, and `src/data/valuePropositions.ts`
- [x] T041 Run `npm run lint` and resolve resulting issues in the touched files across `/Users/first/git/me/portfolio-nextjs`
- [x] T042 Run `npm run build` and resolve resulting issues in the touched files across `/Users/first/git/me/portfolio-nextjs`
- [x] T043 Perform final EN/TH manual review using `specs/004-portfolio-content-revision/quickstart.md` and record any follow-up notes in `specs/004-portfolio-content-revision/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all story work
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; should follow US1 for a coherent MVP sequence but is independently testable once foundations exist
- **User Story 3 (Phase 5)**: Depends on Foundational completion and benefits from US2’s finalized evidence structures
- **User Story 4 (Phase 6)**: Depends on the prior story content revisions being substantially in place
- **Polish (Phase 7)**: Depends on all targeted stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after Foundational
- **US2**: No hard dependency on US1 for implementation, but delivery order should follow US1 because credibility starts at first impression
- **US3**: Depends on shared narrative/evidence structures established in Foundational and is best delivered after US1/US2
- **US4**: Depends on revised content existing across earlier stories so parity can be validated meaningfully

### Within Each User Story

- Update data/content sources before section rendering
- Update localized copy before final parity checks
- Complete story-level manual validation before moving on

### Parallel Opportunities

- T002 and T003 can proceed in parallel after the source brief is confirmed
- T005, T006, T007, and T008 can run in parallel inside Foundational
- In US1, T009, T010, and T011 can run in parallel before T012
- In US2, T015, T016, T017, and T018 can run in parallel before section integration tasks
- In US3, T026, T027, and T028 can run in parallel before section integration tasks
- In US4, T034 and T035 can run in parallel before render reconciliation tasks
- In Polish, T039 and T040 can run in parallel before lint/build validation

---

## Parallel Example: User Story 2

```bash
# Launch structured content updates for the evidence layer together:
Task: "Rewrite career chapter framing and chronology in src/data/timelineChapters.ts"
Task: "Rewrite timeline events in src/data/timelineEvents.ts"
Task: "Re-rank featured work in src/data/projects.ts"
Task: "Replace placeholder testimonials in src/data/testimonials.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **Stop and validate** the first-screen comprehension criteria
5. Demo the revised first impression before expanding the deeper proof layers

### Incremental Delivery

1. Setup + Foundational → shared content structures ready
2. Add US1 → validate first-screen clarity
3. Add US2 → validate career arc, flagship proof, and testimonials
4. Add US3 → validate audience-fit messaging and contact conversion paths
5. Add US4 → validate full bilingual parity
6. Finish with Polish → resolve contradictions, lint/build, and final review

### Parallel Team Strategy

With multiple developers:

1. One developer handles shared content model/foundational normalization
2. One developer drives first-screen and hero implementation
3. One developer drives timeline/projects/testimonials evidence work
4. One developer handles bilingual parity and audience-fit/contact refinement after shared content lands

---

## Notes

- Tasks marked **[P]** are parallelizable because they target different files or isolated modules.
- Story labels map every implementation task back to the specification’s user stories.
- The feature is content-heavy, so manual review quality is part of the execution plan, not an afterthought.
- Keep `.windsurf/docs/full_portfolio_content_revision.md` as the planning authority while shipping content through `src/data/` and `messages/`.
- Avoid introducing contradictory one-off copy directly in JSX when the same claim should live in shared content modules.
