# Tasks: Curated Testimonials Experience

**Input**: Design documents from `/specs/005-curated-testimonials/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are not explicitly requested in the specification, so this task list focuses on implementation tasks plus required manual validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `messages/` at repository root
- Paths in this file follow the existing Next.js single-project structure from `plan.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature workspace and align implementation against the curated testimonial source of truth.

- [x] T001 Audit the curated source in `.windsurf/docs/curated_testimonials_strategy.md` against `src/data/testimonials.ts` and `src/types/testimonial.ts`
- [x] T002 Review current testimonial rendering contracts in `src/components/sections/Testimonials.tsx`, `src/components/sections/TestimonialsCarousel.tsx`, and `src/components/modal/content/TestimonialModal.tsx`
- [x] T003 [P] Review current testimonial interaction and analytics behavior in `src/components/modal/ModalContext.tsx` and `src/lib/analytics.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared testimonial data model and content contract that all user stories depend on.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete because cards, modal, and polish all depend on the same upgraded content schema.

- [x] T004 Update the testimonial type schema in `src/types/testimonial.ts` to support summary quotes, full quotes, proof themes, and richer speaker context
- [x] T005 Update the structured testimonial dataset in `src/data/testimonials.ts` to encode all 10 curated testimonials with proof themes and summary/full quote separation
- [x] T006 [P] Update localized support copy in `messages/en.json` for any new testimonial-related UI strings
- [x] T007 [P] Update localized support copy in `messages/th.json` for any new testimonial-related UI strings
- [x] T008 [P] Verify that the upgraded testimonial schema maps cleanly to existing locale helpers in `src/components/shared/LocalizedText.tsx` and existing locale helpers in `src/i18n/request.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Scan credibility at a glance (Priority: P1) 🎯 MVP

**Goal**: Make the testimonials section communicate credibility, speaker context, and proof diversity within a few seconds without opening a modal.

**Independent Test**: Open the testimonials section and confirm a reviewer can identify who is speaking, the strongest takeaway, and the diversity of proof themes directly from the visible card state.

### Implementation for User Story 1

- [x] T009 [US1] Refactor section-level testimonial composition in `src/components/sections/Testimonials.tsx` to support the upgraded credibility-at-a-glance hierarchy
- [x] T010 [US1] Redesign overview card content and metadata presentation in `src/components/sections/TestimonialsCarousel.tsx` to surface summary quote, speaker attribution, and proof theme clearly
- [x] T011 [P] [US1] Add or refine shared testimonial card visual primitives in `src/components/ui/` for proof-theme labels, attribution metadata, or supporting chips if needed
- [x] T012 [US1] Align testimonial overview copy and locale-specific scan cues in `messages/en.json`, `messages/th.json`, and `src/components/sections/TestimonialsCarousel.tsx`
- [x] T013 [US1] Manually validate the overview state in `src/components/sections/Testimonials.tsx` and `src/components/sections/TestimonialsCarousel.tsx` for desktop/mobile scan clarity and non-generic proof variety

**Checkpoint**: User Story 1 is fully functional and testable as the MVP without relying on modal improvements.

---

## Phase 4: User Story 2 - Explore the full story behind each endorsement (Priority: P2)

**Goal**: Let visitors open a focused detailed view that reveals the full endorsement with strong context, readability, and continuity back to the overview.

**Independent Test**: Select any testimonial card and confirm the modal presents the full quote, speaker context, proof theme, and comfortable long-form reading while preserving orientation when closing.

### Implementation for User Story 2

- [x] T014 [US2] Redesign the full testimonial reading experience in `src/components/modal/content/TestimonialModal.tsx` to support richer hierarchy, speaker context, and full quote formatting
- [x] T015 [US2] Refine testimonial modal shell sizing and reading container behavior in `src/components/modal/ModalShell.tsx` for long-form testimonial content
- [x] T016 [US2] Update testimonial modal open/close flow in `src/components/modal/ModalContext.tsx` only if needed to preserve overview continuity and selected-testimonial clarity
- [x] T017 [P] [US2] Add or refine localized modal support copy in `messages/en.json` and `messages/th.json` for testimonial detail presentation if needed
- [x] T018 [US2] Manually validate the modal experience in `src/components/modal/content/TestimonialModal.tsx`, `src/components/modal/ModalShell.tsx`, and `src/components/modal/ModalContext.tsx` for multi-paragraph readability, attribution visibility, and return-to-overview continuity

**Checkpoint**: User Stories 1 and 2 both work independently, with overview scanning and modal deep reading now complete.

---

## Phase 5: User Story 3 - Feel impressed by polish and editorial intent (Priority: P3)

**Goal**: Make the testimonials experience feel premium, intentional, and distinct from a generic quote list or default carousel.

**Independent Test**: Review the testimonials section and modal together and confirm the hierarchy, transitions, spacing, and visual treatment feel curated and premium relative to the surrounding portfolio sections.

### Implementation for User Story 3

- [x] T019 [US3] Enhance testimonial card visual polish, spacing rhythm, and editorial emphasis in `src/components/sections/Testimonials.tsx` and `src/components/sections/TestimonialsCarousel.tsx`
- [x] T020 [US3] Enhance modal visual polish, typography treatment, and supporting metadata composition in `src/components/modal/content/TestimonialModal.tsx`
- [x] T021 [P] [US3] Refine supporting iconography, chips, or emphasis treatments in `src/components/ui/` and `src/lib/utils.ts` if needed for a more premium testimonial presentation
- [x] T022 [US3] Review and tune testimonial interaction affordances in `src/components/sections/TestimonialsCarousel.tsx` and `src/components/modal/ModalShell.tsx` so state changes feel smooth and consistent rather than abrupt
- [x] T023 [US3] Manually validate premium feel, motion restraint, and cross-role credibility breadth across `src/components/sections/Testimonials.tsx` and `src/components/modal/content/TestimonialModal.tsx`

**Checkpoint**: All three user stories are independently functional, with the final experience reading as premium, curated, and memorable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final bilingual, accessibility, responsiveness, and build-quality checks across all stories.

- [x] T024 [P] Review testimonial keyboard access and focus visibility in `src/components/sections/TestimonialsCarousel.tsx`, `src/components/modal/ModalShell.tsx`, and `src/components/modal/content/TestimonialModal.tsx`
- [x] T025 [P] Review EN/TH parity and summary/full-quote meaning consistency in `src/data/testimonials.ts`, `messages/en.json`, and `messages/th.json`
- [x] T026 [P] Decide whether testimonial-specific analytics refinement is justified in `src/lib/analytics.ts` and `src/components/modal/ModalContext.tsx`; leave existing events unchanged if no clear question is answered
- [x] T027 Run implementation validation from `specs/005-curated-testimonials/quickstart.md` using `npm run build` and `npm run lint`
- [x] T028 Perform final responsive and experience QA across `src/components/sections/Testimonials.tsx`, `src/components/sections/TestimonialsCarousel.tsx`, and `src/components/modal/content/TestimonialModal.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP
- **User Story 2 (Phase 4)**: Depends on Foundational completion and consumes the upgraded testimonial model; can proceed after US1 is stable or in parallel if carefully staffed
- **User Story 3 (Phase 5)**: Depends on Foundational completion and benefits from US1/US2 structure being in place before polish refinement
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and is independently shippable as the MVP
- **User Story 2 (P2)**: Starts after Phase 2; depends on the same foundational testimonial schema but should remain independently testable from the card redesign
- **User Story 3 (P3)**: Starts after the functional UX structure exists; should refine rather than redefine US1/US2 behavior

### Within Each User Story

- Shared schema before story-specific rendering
- Overview implementation before overview validation
- Modal implementation before modal validation
- Premium polish after the baseline functional experience is working

### Parallel Opportunities

- `T003` can run in parallel with `T001` and `T002`
- `T006` and `T007` can run in parallel once the schema direction in `T004` and `T005` is clear
- `T011` can run in parallel with parts of `T009` and `T010` if shared UI primitives are separated cleanly
- `T017` can run in parallel with `T014` and `T015`
- `T021` can run in parallel with `T019` and `T020`
- `T024`, `T025`, and `T026` can run in parallel during the final polish phase

---

## Parallel Example: User Story 1

```bash
# Parallelizable work after the foundational schema is in place:
Task: "Refactor section-level testimonial composition in src/components/sections/Testimonials.tsx"
Task: "Add or refine shared testimonial card visual primitives in src/components/ui/"

# Parallelizable locale support updates:
Task: "Add or refine testimonial-related localized support copy in messages/en.json"
Task: "Add or refine testimonial-related localized support copy in messages/th.json"
```

---

## Parallel Example: User Story 2

```bash
# Parallelizable modal refinement once the detail model is clear:
Task: "Redesign the full testimonial reading experience in src/components/modal/content/TestimonialModal.tsx"
Task: "Add or refine localized modal support copy in messages/en.json and messages/th.json"
```

---

## Parallel Example: User Story 3

```bash
# Parallelizable polish work after the core UX is stable:
Task: "Enhance testimonial card visual polish in src/components/sections/Testimonials.tsx and src/components/sections/TestimonialsCarousel.tsx"
Task: "Refine supporting iconography, chips, or emphasis treatments in src/components/ui/ and src/lib/utils.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm credibility-at-a-glance scanning works without opening any modal
5. Ship/demo the MVP if the first-impression goal is met

### Incremental Delivery

1. Complete Setup + Foundational → schema and content contract ready
2. Add User Story 1 → validate at-a-glance credibility → MVP ready
3. Add User Story 2 → validate modal deep reading independently
4. Add User Story 3 → validate premium editorial polish independently
5. Finish with cross-cutting accessibility, bilingual, and build validation

### Parallel Team Strategy

With multiple developers:

1. One developer completes schema and content foundation in `src/types/testimonial.ts` and `src/data/testimonials.ts`
2. After Phase 2:
   - Developer A: User Story 1 overview cards
   - Developer B: User Story 2 modal detail experience
   - Developer C: User Story 3 polish and shared UI refinement after baseline structure stabilizes
3. Final polish phase validates accessibility, bilingual parity, and build quality together

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] labels map tasks directly to user stories for traceability
- Each user story remains independently completable and testable through manual review criteria from the spec and quickstart
- This feature does not require test-first automation because the spec did not request TDD; validation is centered on build, lint, accessibility, responsive review, and UX acceptance
- Avoid introducing low-value analytics, hardcoded JSX testimonial strings, or cross-story changes that blur the independent story goals
