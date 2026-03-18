---
description: "Task list for Tech Stack Representation Strategy and Rebrand"
---

# Tasks: Tech Stack Representation Strategy and Rebrand

**Input**: Design documents from `/specs/009-tech-stack-rebrand/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md
**Branch**: `009-tech-stack-rebrand`

**Tests**: Manual verification only (no automated tests requested in spec)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational types, data structures, and localization strings

- [ ] T001 Create `src/types/tech-capabilities.ts` with `TechTier` interface and `TechTierId` type
- [ ] T002 [P] Add English localization keys to `messages/en.json` under `tech.*` namespace
- [ ] T003 [P] Add Thai localization keys to `messages/th.json` under `tech.*` namespace
- [ ] T004 Create `src/data/tech-capabilities.ts` with `techTiers` array containing all 3 tiers (Core, Architecture, Data)

**Checkpoint**: Type definitions, localization strings, and data structure ready - user story implementation can now begin

---

## Phase 2: User Story 1 - Hiring Manager Evaluation (Priority: P1) 🎯 MVP

**Goal**: Replace the "Skills" section on the homepage with a 3-Tier strategic display showing Core Delivery, Architecture & Quality, and Data & Product Insights tiers with context and proof points.

**Independent Test**: Navigate to the homepage, scroll to the "Tech Stack" section, and verify:
1. Section displays "Technical Capabilities & Governance" title and subtitle
2. Three cards are rendered with correct icons (Zap, Shield, BarChart3)
3. Each card shows the correct tier title, positioning text, tools list, and proof point
4. No "To be learned", "Familiar", or "Used to use" sections exist
5. No standalone grid of disembodied technology logos exists

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create `src/components/sections/TechCapabilities/TechCapabilities.tsx` component that renders the section title and subtitle
- [ ] T006 [P] [US1] Create `src/components/sections/TechCapabilities/TierCard.tsx` component that renders a single tier card with icon, title, subtitle, tools list, and proof point
- [ ] T007 [US1] Integrate `TechCapabilities` component into the homepage layout in `src/app/[locale]/page.tsx` (replace or remove the old Skills section)
- [ ] T008 [US1] Remove or deprecate the old `src/components/sections/Skills/` directory and all related imports
- [ ] T009 [US1] Verify no "To be learned", "Familiar", or "Used to use" text remains in the codebase and UI
- [ ] T010 [US1] Test responsive behavior on mobile, tablet, and desktop viewports to ensure cards stack vertically on smaller screens

**Checkpoint**: User Story 1 complete - homepage displays 3-Tier tech stack with strategic context

---

## Phase 3: User Story 2 - Project Technology Context (Priority: P1)

**Goal**: Display technologies used as badges/tags within Project Modals, connecting tools to specific evidence of work.

**Independent Test**: Open a Project Modal and verify:
1. Tech stack is displayed as Tags/Badges
2. Tags are relevant to that specific project (not a generic list)
3. Empty project stacks are handled gracefully (section hidden if no technologies defined)

### Implementation for User Story 2

- [ ] T011 [P] [US2] Create `src/components/sections/TechCapabilities/TechBadge.tsx` component to render individual technology badges
- [ ] T012 [US2] Update `src/components/modal/content/ProjectModal.tsx` to include a "Tech Stack" section that renders tech badges from `project.techStack`
- [ ] T013 [US2] Add conditional rendering to hide the tech stack section if `project.techStack` is empty or undefined
- [ ] T014 [US2] Verify all projects in `src/data/projects.ts` have properly defined `techStack` arrays
- [ ] T015 [US2] Test tech badges display correctly across all project modals

**Checkpoint**: User Story 2 complete - all Project Modals display technology badges

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories and final validation

- [ ] T016 [P] Remove `src/data/skills.ts` file (replaced by `tech-capabilities.ts`)
- [ ] T017 [P] Remove or update `src/types/skill.ts` file if no longer needed by other features
- [ ] T018 [P] Update any imports referencing old Skills component or skills data throughout the codebase
- [ ] T019 Verify bilingual content displays correctly in both English and Thai locales
- [ ] T020 Run linting and formatting checks to ensure code quality
- [ ] T021 Validate quickstart.md instructions work as documented
- [ ] T022 Perform manual QA across all pages to ensure no broken references to removed Skills section
- [ ] T023 Verify page load performance (LCP) has not degraded and ideally improved from removing icon grids

**Checkpoint**: Feature complete and validated - ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - can proceed in parallel with US2 after Setup
- **User Story 2 (Phase 3)**: Depends on Setup completion - can proceed in parallel with US1 after Setup
- **Polish (Phase 4)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup - No dependencies on US2 (independent)
- **User Story 2 (P1)**: Can start after Setup - No dependencies on US1 (independent)
- Both stories can be worked on in parallel by different team members

### Within Each User Story

- Components before integration
- Core implementation before testing
- Story complete before moving to Polish phase

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Once Setup completes, US1 and US2 can be worked on in parallel
- All component creation tasks marked [P] within a story can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all setup tasks together:
Task: "Add English localization keys to messages/en.json"
Task: "Add Thai localization keys to messages/th.json"
```

---

## Parallel Example: User Story 1

```bash
# Launch all component creation tasks together:
Task: "Create TechCapabilities.tsx component"
Task: "Create TierCard.tsx component"
```

---

## Parallel Example: User Story 2

```bash
# Launch all component creation tasks together:
Task: "Create TechBadge.tsx component"
```

---

## Implementation Strategy

### MVP First (Both User Stories - P1 Priority)

1. Complete Phase 1: Setup (types, data, localization)
2. Complete Phase 2: User Story 1 (homepage tech stack section)
3. Complete Phase 3: User Story 2 (project modal tech badges)
4. **STOP and VALIDATE**: Test both stories independently and together
5. Deploy if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Polish → Final validation → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done:
   - Developer A: User Story 1 (homepage section)
   - Developer B: User Story 2 (project modals)
3. Both stories complete and integrate independently
4. Team completes Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Both P1 stories have equal priority and can be worked on in parallel
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
