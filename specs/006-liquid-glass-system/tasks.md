# Tasks: Liquid Glass Global Design System

**Input**: Design documents from `/specs/006-liquid-glass-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Only included where the specification explicitly demands validation (performance, accessibility, reduced motion, etc.).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure local environment and baseline tooling are ready before touching feature code.

- [ ] T001 Document `.env.local` expectations for Liquid Glass work in `README.md#environment` and confirm `.env.local` matches `.env.local.example`
- [ ] T002 Install/update dependencies via `npm install` and verify Tailwind v4 + Framer Motion 11 versions match plan requirements
- [ ] T003 [P] Run `npm run lint` and `npm run build` on branch `006-liquid-glass-system` to ensure clean baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [ ] T004 Expand `src/styles/globals.css` with the full Liquid Glass token system (primitive + semantic + dark overrides + `[data-tier="2"]` fallbacks + `[data-glass]` rules + `.glass-surface` + `.glass-specular` + `@supports` fallback)
- [ ] T005 [P] Scaffold `src/components/glass/` directory and `index.ts` barrel with placeholder exports for GlassCard/Panel/Button/Modal/Navbar
- [ ] T006 [P] Implement `src/lib/springs.ts` exporting `SPRING_GENTLE`, `SPRING_BUOYANT`, `SPRING_SNAPPY`, `SpringConfig` type, and `CSS_SPRING_DURATION` map with JSDoc usage notes
- [ ] T007 [P] Implement `src/lib/performance.ts` with `usePerformanceTier()` hook + `PerformanceTier` type and invoke it inside `src/app/[locale]/layout.tsx` via client-only wrapper component
- [ ] T008 [P] Add `.lighthouserc.json` (root) with placeholder preview URL, Lighthouse assertions (Perf ≥0.90, CLS ≤0.01, FCP ≤1500ms), and comment explaining CI URL configuration
- [ ] T009 [P] Extract reusable pointer/specular controller helper (e.g., `src/components/glass/specular.ts`) to manage `--specular-x/y` updates with rAF throttling, reduced-motion, and Tier 2 guards
- [ ] T010 Ensure Tailwind v4 configuration (e.g., `tailwind.config.ts` / CSS `@theme`) exposes Liquid Glass tokens so utility classes can consume them without duplicating values

**Checkpoint**: Foundation ready — user story work can start in parallel.

---

## Phase 3: User Story 1 – “The Surface is Alive” (Priority: P1) 🎯 MVP

**Goal**: Deliver reusable Liquid Glass surfaces with elevation-aware blur, border, and specular highlight behavior.

**Independent Test**: Place GlassCard elevations 1–5 over a multicolor background page; verify blur/color bleed, desktop specular tracking, static highlight on mobile/Tier 2, and fallback styling when `backdrop-filter` unsupported.

### Implementation for User Story 1

- [ ] T011 [US1] Implement `src/components/glass/GlassCard.tsx` per contract (props, `data-glass`, `.glass-surface`, `.glass-specular`, dynamic Framer Motion import, pointer tracking)
- [ ] T012 [P] [US1] Implement `src/components/glass/GlassPanel.tsx` extending GlassCard with section-friendly props (`fullBleed`, limited elevations, buoyant entrance via `useInView`, no specular)
- [ ] T013 [P] [US1] Finalize `.glass-specular::before` CSS in `src/styles/globals.css` using runtime `--specular-x/y` vars with Tier 2/reduced-motion fallbacks
- [ ] T014 [P] [US1] Build dev-only styleguide page `src/app/[locale]/design-system/page.tsx` showcasing all glass elevations, specular highlight demos, and theme toggles
- [ ] T015 [US1] Refactor hero trust badges / ambient chips to use GlassCard/GlassPanel per elevation map, ensuring tokens apply correctly

**Checkpoint**: Glass surfaces render correctly with blur, borders, and highlight behaviors across desktop/mobile + Tier 2 fallbacks.

---

## Phase 4: User Story 2 – “Every Interaction has Weight” (Priority: P1)

**Goal**: Deliver tactile interaction physics for interactive glass elements using shared springs.

**Independent Test**: Hover/press each interactive glass element and confirm buoyant or snappy spring response; release events bounce back without jank; reduced-motion disables springs.

### Implementation for User Story 2

- [ ] T016 [US2] Implement `src/components/glass/GlassButton.tsx` (variants, sizes, icon slots, loading state, focus-visible ring) and replace glass-context shadcn buttons throughout `src/components/sections/*`
- [ ] T017 [P] [US2] Update GlassCard hover behavior to detect pointer type (via `matchMedia('(pointer:fine)')`) and skip hover springs on touch devices
- [ ] T018 [P] [US2] Refactor ProjectCard and other clickable cards (`src/components/projects/ProjectCard.tsx`, `sections/*`) to rely on GlassCard motion props + springs instead of bespoke easing
- [ ] T019 [P] [US2] Implement `src/components/glass/GlassNavbar.tsx` with scroll-reactive glass layering (opacity transitions, no blur-radius animation) and integrate into `src/components/layout/Navbar.tsx`
- [ ] T020 [US2] Hook `trackEvent` analytics into GlassButton primary CTAs (e.g., `src/components/sections/Hero.tsx`) documenting payload schema in `src/lib/analytics.ts`

**Checkpoint**: Interactions feel springy/premium and respect reduced-motion + analytics requirements.

---

## Phase 5: User Story 3 – “It Works Everywhere” (Priority: P1)

**Goal**: Guarantee graceful degradation on low-tier hardware or browsers lacking `backdrop-filter`, plus Lighthouse ≥95 and bundle constraints.

**Independent Test**: Disable `backdrop-filter`, toggle `[data-tier="2"]`, and run Lighthouse 3-pass suite; Glass components remain legible and performance budgets satisfied.

### Implementation for User Story 3

- [ ] T021 [US3] Build a lightweight `PerformanceTierProvider` (e.g., `src/components/glass/PerformanceTierProvider.tsx`) that runs `usePerformanceTier()` once on mount and applies `dataset.tier`
- [ ] T022 [P] [US3] Add Tier 2 toggle controls to `src/app/[locale]/design-system/page.tsx` to preview blur-less fallbacks during QA
- [ ] T023 [P] [US3] Verify Firefox/Safari fallback via BrowserStack and capture screenshots, documenting results in `specs/006-liquid-glass-system/checklists/fallback.md`
- [ ] T024 [P] [US3] Wire `.lighthouserc.json` into CI workflow (e.g., `.github/workflows/lighthouse.yml`) so preview deployments fail under target scores; update README with instructions
- [ ] T025 [US3] Run bundle analysis (`npx @next/bundle-analyzer`) ensuring glass CSS <5kb + JS additions <5kb; document deltas + remediation steps in `specs/006-liquid-glass-system/checklists/perf.md`

**Checkpoint**: Tier 2 fallbacks, unsupported-browser fallbacks, and Lighthouse monitoring all verified.

---

## Phase 6: User Story 4 – “Light and Dark are Both Premium” (Priority: P1)

**Goal**: Harmonize glass visuals across themes without flicker or mismatched tokens.

**Independent Test**: Rapidly toggle theme; ensure glass elements in both modes remain premium with no flash of incorrect tokens.

### Implementation for User Story 4

- [ ] T026 [US4] Tune dark-mode overrides inside `src/styles/globals.css` (shadows, specular intensity, fill opacity) to match “darker than surroundings” directive
- [ ] T027 [P] [US4] Ensure `ThemeProvider` (`src/components/layout/ThemeProvider.tsx`) applies `attribute="class"`, `suppressHydrationWarning`, and defers theme rendering until mounted to avoid flicker
- [ ] T028 [P] [US4] Update typography utilities (e.g., `src/styles/typography.css` or theme tokens) so text maintains correct luminance atop translucent backgrounds in both modes
- [ ] T029 [US4] Add Storybook/Chromatic stories covering light/dark + Tier 1/2 + reduced-motion states for GlassCard/GlassButton/GlassPanel; document location in `/stories/glass/*.stories.tsx`

**Checkpoint**: Light and dark modes both feel premium with no perceptible flicker.

---

## Phase 7: User Story 5 – “The Hierarchy is Instantly Readable” (Priority: P2)

**Goal**: Apply the glass elevation map across all major sections to communicate depth hierarchy clearly.

**Independent Test**: Review stacked components (modals over cards, featured vs standard cards) and confirm higher-elevation elements show stronger blur/border/shadow cues while respecting ≤4-layer rule.

### Implementation for User Story 5

- [ ] T030 [US5] Refactor timeline components (`src/components/sections/timeline/*`) to apply specified GlassCard/GlassPanel elevations, ensuring Year background sits behind cards and layer cap enforced
- [ ] T031 [P] [US5] Update hero trust badges, CTA strips, and counters to use correct GlassCard elevations (1–2) with documentation comments referencing elevation rationale
- [ ] T032 [P] [US5] Refactor Projects, Skills, Testimonials, Value Prop, and Contact sections per contracts table (featured cards e3, standard e2, chips/panels e1) with Tailwind token overrides as needed
- [ ] T033 [P] [US5] Replace existing modal shells in `src/components/modal/*` with `GlassModal` (e4 content + e5 backdrop) and ensure nested cards obey elevation hierarchy
- [ ] T034 [US5] Create layered-surface audit checklist (`specs/006-liquid-glass-system/checklists/layers.md`) and capture screenshots verifying ≤4 simultaneous blur layers on key pages

**Checkpoint**: Depth hierarchy is legible across all sections without exceeding performance limits.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Consolidate documentation, QA, and final merge readiness.

- [ ] T035 Document glass system usage in `src/components/glass/README.md` (elevation guide, token reference, springs, Tier 2 testing, “do not” list)
- [ ] T036 [P] Record manual QA results (specular desktop, Tier 2 fallback, theme toggles, reduced motion) in `specs/006-liquid-glass-system/checklists/final-review.md`
- [ ] T037 [P] Run `npm run build`, `npx tsc --noEmit`, Lighthouse (desktop/mobile), Tier 2 toggle, prefers-reduced-motion audit, and WCAG AA contrast verification; attach results/screenshots to PR
- [ ] T038 Final merge readiness: rebase `feature/006-liquid-glass-system`, prepare PR with screenshots/GIFs (light/dark, Tier 1/2), reference spec/plan, and ensure all checklists linked

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 → prerequisite for Phase 2
- Phase 2 → blocks all user stories (US1–US5)
- Phase 3 (US1) → must finish before US2–US5
- Phases 4–7 → rely on previous phases but allow internal parallelism where files are independent
- Phase 8 → final polish after stories complete

### User Story Dependencies

1. **US1** provides primitives for all other stories
2. **US2** (motion) depends on US1 components/springs
3. **US3** (fallbacks) depends on US1/US2 to monitor finished components
4. **US4** (themes) depends on US1 tokens for adjustments
5. **US5** (hierarchy) depends on US1–US4 to apply surfaces across sections

### Parallel Execution Opportunities

- Within Phase 2: T005–T010 touch separate files and can proceed once T004 lands
- US1: GlassPanel (T012) + specular CSS (T013) can run after GlassCard API defined
- US2–US5: Section refactors (Projects vs Timeline vs Skills, etc.) can run concurrently once shared primitives are stable

---

## Independent Test Criteria Summary

- **US1**: Multicolor background test verifying blur + specular highlight across desktop/mobile/Tier 2
- **US2**: Interaction physics validated via hover/press tests, reduced-motion preference, analytics events
- **US3**: Tier 2 toggle, unsupported-browser fallback, Lighthouse CI, bundle analyzer results
- **US4**: Rapid theme toggles + Chromatic snapshots for light/dark/Tier combinations
- **US5**: Layer audit ensuring ≤4 blur layers and clear elevation hierarchy

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phases 1–2
2. Ship Phase 3 (US1) primitives + specular logic
3. Validate via design-system playground before expanding scope

### Incremental Delivery

1. Layer US2 (motion + Navbar/Button) after US1
2. Add US3 fallbacks + monitoring, US4 theming, then US5 hierarchy
3. After each story, run its independent tests to catch regressions early

### Parallel Team Strategy

1. Assign engineers to tokens/GlassCard, performance hook/monitoring, and section refactors respectively
2. Use design-system playground + Chromatic for async reviews
3. Merge frequently after each story to keep branch healthy
