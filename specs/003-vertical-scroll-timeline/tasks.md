# Tasks: Vertical Scroll Timeline — Design System & Implementation

**Input**: Design documents from `/specs/003-vertical-scroll-timeline/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification. Manual QA + Lighthouse CI per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Next.js App Router structure at repository root:

- Components: `src/components/`
- Data: `src/data/`
- Types: `src/types/`
- Lib: `src/lib/`
- Styles: `src/styles/`
- Messages: `src/messages/`

---

## Phase 1: Setup (Data Model & i18n)

**Purpose**: Prepare data structures and translations before component implementation

- [x] T001 [P] Enhance TimelineEvent interface in src/types/timeline.ts (add descriptionEn/Th, featured, mediaLinks?)
- [x] T002 [P] Add MediaLink interface to src/types/timeline.ts
- [x] T003 Update all timeline events in src/data/timelineEvents.ts (add descriptionEn, descriptionTh='', featured=false)
- [x] T004 [P] Export YEAR_THEMES constant in src/data/timelineChapters.ts (4 year themes: 2022-2025)
- [x] T005 [P] Add YearKey type export in src/data/timelineChapters.ts (2022 | 2023 | 2024 | 2025)
- [x] T006 [P] Add timeline i18n keys to src/messages/en.json (label, title, subtitle)
- [x] T007 [P] Add timeline i18n keys to src/messages/th.json (Thai translations)

**Checkpoint**: TypeScript compiles successfully, all data files validate against enhanced interfaces

---

## Phase 2: Foundational (Analytics & Shared Components)

**Purpose**: Core infrastructure that MUST be complete before timeline components

**⚠️ CRITICAL**: No timeline component work can begin until this phase is complete

- [x] T008 [P] Add TIMELINE_PROGRESS event constant to src/lib/analytics.ts
- [x] T009 [P] Add TIMELINE_DEEPDIVE_OPEN event constant to src/lib/analytics.ts
- [x] T010 [P] Add TimelineProgressEvent interface to src/lib/analytics.ts (percent: 25|50|75|100)
- [x] T011 [P] Add TimelineDeepDiveEvent interface to src/lib/analytics.ts (event_id, event_title, year, event_type)
- [x] T012 [P] Add timeline utility classes to src/styles/globals.css (timeline-card-hover, year-numeral)
- [x] T013 [P] Create src/components/timeline/ directory structure

**Checkpoint**: Foundation ready - timeline component implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browsing Personal Experience (Priority: P1) 🎯 MVP

**Goal**: Display professional journey in cinematic vertical scroll format with year grouping, ambient backgrounds, event cards with tech badges, and animated spine

**Independent Test**: Scroll through the timeline to verify all years and events render in chronological order with appropriate visual grouping (backgrounds transition, spine fills, tech badges display)

**Note**: This phase delivers the complete viewing experience, which also satisfies User Story 3 (tech badges) and User Story 4 (spine animation) acceptance criteria.

### Implementation for User Story 1

**Background & Year Sections**:

- [x] T014 [P] [US1] Create YearBackground component in src/components/timeline/YearBackground.tsx (4 year gradients, opacity crossfade)
- [x] T015 [P] [US1] Create TimelineYear component in src/components/timeline/TimelineYear.tsx (year header, events stack, IntersectionObserver callback)

**Spine Component**:

- [x] T016 [US1] Create TimelineSpine component in src/components/timeline/TimelineSpine.tsx (track, fill with scaleY, traveling dot hidden <768px, year markers, sticky positioning top: 6rem)

**Event Cards**:

- [x] T017 [US1] Create CATEGORY_CONFIG constant in src/components/timeline/TimelineEventCard.tsx (5 event types with icons and bilingual labels)
- [x] T018 [US1] Create TimelineEventCard component in src/components/timeline/TimelineEventCard.tsx (category badge, title/summary/impact, tech badges max 5 with overflow counter, Deep Dive button placeholder, featured styling with ring and top strip, scroll reveal animation)

**Main Timeline Section**:

- [x] T019 [US1] Create Timeline section orchestrator in src/components/sections/Timeline.tsx (useScroll hook, useMotionValueEvent for spine progress, IntersectionObserver for active year, analytics milestones 25/50/75/100%, layout: spine left + content right, SectionHeader integration)
- [x] T020 [P] [US1] Create barrel exports in src/components/timeline/index.ts (export all timeline components)

**Integration**:

- [x] T021 [US1] Add Timeline section import to src/app/[locale]/page.tsx (insert between existing sections per design)
- [x] T022 [US1] Add Vision CTA component to Timeline section in src/components/sections/Timeline.tsx (What's Next footer at end of timeline)

**Checkpoint**: At this point, User Story 1 (core viewing), User Story 3 (tech badges), and User Story 4 (spine animation) should all be fully functional and testable independently. Scroll through timeline, verify backgrounds transition, spine fills, tech badges display correctly.

---

## Phase 4: User Story 2 - Deep Diving into Specific Events (Priority: P2)

**Goal**: Enable visitors to explore detailed event information via modal when clicking Deep Dive buttons

**Independent Test**: Click the Deep Dive button on any event card to verify modal opens with full description, expanded impact, complete skills list, and optional media

### Implementation for User Story 2

**Modal Component**:

- [x] T023 [P] [US2] Create TimelineEventModal component in src/components/modals/TimelineEventModal.tsx (display descriptionEn/Th, impactEn/Th, all skills with TechBadge, optional mediaLinks, bilingual content with fallback)

**Modal Integration**:

- [x] T024 [US2] Extend useModal hook in src/hooks/useModal.ts (add 'timeline-event' to ModalType union)
- [x] T025 [US2] Add TimelineEventModalData interface to src/hooks/useModal.ts (type: 'timeline-event', id: string)
- [x] T026 [US2] Integrate TimelineEventModal into modal router (wherever modal content is determined based on type)

**Event Card Connection**:

- [x] T027 [US2] Implement Deep Dive button handler in src/components/timeline/TimelineEventCard.tsx (call useModal open with event.id, fire TIMELINE_DEEPDIVE_OPEN analytics with event_id, event_title, year, event_type)
- [x] T028 [US2] Update button to show URL hash pattern #timeline-event-{id} on hover for UX clarity

**Checkpoint**: At this point, User Story 2 should be fully functional. Click Deep Dive buttons, verify modals open with complete event details, URL hash updates, analytics fires, ESC closes modal.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Refinements and optimizations that enhance the overall experience

- [x] T029 [P] Verify featured event styling (1px ring 30% opacity, 2px top gradient strip) on 2-3 flagship events
- [x] T030 [P] Add bilingual Thai translations for events marked with empty descriptionTh fields in src/data/timelineEvents.ts
- [ ] T031 [P] Performance audit: Chrome DevTools Performance tab during scroll (verify 60fps, no layout thrashing, GPU-accelerated animations only) - MANUAL TESTING REQUIRED
- [ ] T032 [P] Lighthouse audit: Performance 100 desktop / 95+ mobile, Accessibility 100, verify LCP <1.2s desktop / <2.0s mobile - MANUAL TESTING REQUIRED
- [ ] T033 Mobile device testing: Verify traveling dot hidden <768px, scroll smooth on iPhone SE / Pixel 5, backgrounds transition <1.5s - MANUAL TESTING REQUIRED
- [ ] T034 [P] Accessibility audit: ARIA labels on Deep Dive buttons, keyboard navigation, focus indicators, screen reader testing - MANUAL TESTING REQUIRED
- [ ] T035 [P] Color contrast verification: All 4 year theme colors meet WCAG 2.1 AA (4.5:1 normal text, 3:1 large text) - MANUAL TESTING REQUIRED
- [x] T036 Run quickstart.md validation steps (build verification, local dev test, bilingual toggle test)
- [ ] T037 [P] Add optional media assets to 2-3 featured events (screenshots/videos in mediaLinks array) if available - OPTIONAL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Depends on User Story 1 completion (needs event cards with Deep Dive buttons)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - INDEPENDENT - Delivers MVP viewing experience
- **User Story 2 (P2)**: Depends on User Story 1 - Needs event cards to exist before adding modal functionality
- **User Story 3 (P2)**: Satisfied by User Story 1 implementation (tech badges built into cards)
- **User Story 4 (P3)**: Satisfied by User Story 1 implementation (spine built into Timeline section)

### Within User Story 1

- Background & Year Section components [P] can be built in parallel
- Spine component requires understanding of scroll tracking (build after background components for reference)
- Event Card depends on CATEGORY_CONFIG constant
- Timeline section orchestrator depends on all child components (YearBackground, TimelineYear, TimelineEventCard, TimelineSpine)
- Integration depends on Timeline section being complete

### Within User Story 2

- Modal component [P] can be built independently
- useModal hook extension [P] can be done in parallel with modal component
- Modal router integration depends on modal component and hook extension
- Event card handler depends on useModal hook extension

### Parallel Opportunities

- **Phase 1**: Tasks T001, T002, T004, T005, T006, T007 can all run in parallel
- **Phase 2**: Tasks T008, T009, T010, T011, T012, T013 can all run in parallel
- **Phase 3 (US1)**: Tasks T014, T015 can run in parallel (different components)
- **Phase 3 (US1)**: Task T020 can run in parallel with T021
- **Phase 4 (US2)**: Tasks T023, T024, T025 can run in parallel
- **Phase 5**: Tasks T029, T030, T031, T032, T034, T035, T037 can all run in parallel

---

## Parallel Example: User Story 1 Core Components

```bash
# Launch background and year components together:
Task T014: "Create YearBackground component in src/components/timeline/YearBackground.tsx"
Task T015: "Create TimelineYear component in src/components/timeline/TimelineYear.tsx"

# After spine is built, launch integration tasks together:
Task T020: "Create barrel exports in src/components/timeline/index.ts"
Task T021: "Add Timeline section import to src/app/[locale]/page.tsx"
```

## Parallel Example: User Story 2 Modal System

```bash
# Launch modal and hook extension together:
Task T023: "Create TimelineEventModal component in src/components/modals/TimelineEventModal.tsx"
Task T024: "Extend useModal hook in src/hooks/useModal.ts"
Task T025: "Add TimelineEventModalData interface to src/hooks/useModal.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (data model enhancements, i18n)
2. Complete Phase 2: Foundational (analytics events, CSS utilities)
3. Complete Phase 3: User Story 1 (complete viewing experience)
4. **STOP and VALIDATE**: Test scrolling, backgrounds, spine, tech badges independently
5. Deploy/demo MVP if ready

**Estimated Time**: ~5 hours (per quickstart.md)

### Incremental Delivery

1. Setup + Foundational → Foundation ready (~1 hour)
2. User Story 1 → Test independently → Deploy/Demo (MVP! ~3 hours)
3. User Story 2 → Test independently → Deploy/Demo (Deep Dive modals ~30 min)
4. Polish → Final optimization and testing (~30 min)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: YearBackground + TimelineYear (T014, T015)
   - Developer B: TimelineSpine (T016)
   - Developer C: TimelineEventCard (T017, T018)
3. Developer A: Timeline orchestrator (T019) after all components ready
4. Developer B: Modal component (T023) while A finishes orchestrator
5. Stories integrate and test independently

---

## Task Summary

- **Total Tasks**: 37
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 6 tasks
- **User Story 1 (P1)**: 9 tasks (MVP - delivers viewing experience, tech badges, spine animation)
- **User Story 2 (P2)**: 6 tasks (Deep Dive modals)
- **Polish Phase**: 9 tasks
- **Parallel Opportunities**: 20 tasks can run in parallel (marked [P])
- **Independent Tests**:
  - US1: Scroll through timeline, verify years/events/backgrounds/spine/tech badges
  - US2: Click Deep Dive, verify modal opens with complete details
  - US3: Satisfied by US1 tech badges display
  - US4: Satisfied by US1 spine animation

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- User Story 1 is the MVP and delivers the core viewing experience
- User Stories 3 and 4 are validation-focused and satisfied by US1 implementation
- User Story 2 adds modal depth functionality on top of US1
- No explicit tests requested - using manual QA + Lighthouse CI per spec
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Mobile optimization (traveling dot hidden <768px) built into T016
- Bilingual fallback strategy (empty string → English) built into all components
