# Tasks: Liquid Distortion Enhancement

**Feature**: 007-liquid-distortion-enhancement
**Status**: In Progress

## Phase 1: Setup
- [ ] T001 Create `src/lib/glass-distortion.ts` for distortion utilities
- [ ] T002 Create `src/components/glass/GlassSVGFilters.tsx` for global SVG filter definitions
- [ ] T003 Update `src/components/glass/glass-types.ts` (or create if missing) to include `DistortionConfig` and `DistortionIntensity` type definitions

## Phase 2: Foundational Infrastructure
- [ ] T004 Implement `DISTORTION_PRESETS` and configuration types in `src/lib/glass-distortion.ts`
- [ ] T005 Implement `getDistortionConfig` and `getFilterId` helpers in `src/lib/glass-distortion.ts`
- [ ] T006 Implement `shouldEnableDistortion` using `usePerformanceTier` logic in `src/lib/glass-distortion.ts`
- [ ] T007 Implement `GlassSVGFilters` component with `feTurbulence` and `feDisplacementMap` primitives in `src/components/glass/GlassSVGFilters.tsx`
- [ ] T008 [P] Define `glass-distortion-low`, `glass-distortion-medium`, and `glass-distortion-high` filter IDs in `GlassSVGFilters.tsx`
- [ ] T009 Integrate `<GlassSVGFilters />` into the root layout at `src/app/[locale]/layout.tsx`

## Phase 3: User Story 1 & 2 - Core Distortion & Layering
*Goal: Enable liquid distortion on GlassCard using 4-layer architecture*
- [ ] T010 [US1] Update `GlassCard` props interface to include `distortion`, `distortionIntensity`, `shine`, and `customDistortionConfig` in `src/components/glass/GlassCard.tsx`
- [ ] T011 [US2] Refactor `GlassCard` render logic to support conditional 4-layer structure (`wrapper`, `effect`, `tint`, `shine`, `content`) in `src/components/glass/GlassCard.tsx`
- [ ] T012 [US1] Apply CSS filters (`url(#id)`) and backdrop-filter to the `.liquidGlass-effect` layer in `src/components/glass/GlassCard.tsx`
- [ ] T013 [US1] Ensure `GlassCard` falls back to simple structure when `distortion={false}` or performance tier is low
- [ ] T014 [US1] Verify `GlassCard` text readability by ensuring content is in the z-indexed content layer

## Phase 4: Component Rollout
*Goal: extend distortion support to all glass components*
- [ ] T015 [US3] [P] Update `GlassPanel` with distortion props and layered rendering in `src/components/glass/GlassPanel.tsx`
- [ ] T016 [US3] [P] Update `GlassButton` with distortion props and layered rendering in `src/components/glass/GlassButton.tsx`
- [ ] T017 [US3] [P] Update `GlassModal` (if exists) or equivalent overlay components with distortion support
- [ ] T018 [US3] Verify `distortionIntensity` prop correctly maps to different filter IDs across all components

## Phase 5: User Story 4 - Shine & Polish
*Goal: Add specular edge highlights and final polish*
- [ ] T019 [US4] Implement `.liquidGlass-shine` layer styles with inset box-shadows in `src/styles/globals.css` (or inline styles)
- [ ] T020 [US4] Ensure shine layer adapts to light/dark mode (adjust shadow opacity/color)
- [ ] T021 [US4] Verify `shine` prop toggles the highlight layer correctly in `GlassCard`, `GlassPanel`, and `GlassButton`
- [ ] T022 Document usage of new distortion props in `src/components/glass/README.md`
- [ ] T023 Verify `prefers-reduced-motion` behavior (ensure no animated turbulence if added, though 007 is static)

## Dependencies

- Phase 1 & 2 must be completed before Phase 3
- Phase 3 (GlassCard) must be completed before Phase 4 (Other components) to validate the pattern
- Phase 5 can be done in parallel with Phase 4

## Implementation Strategy
- **MVP**: Get `GlassSVGFilters` rendering and one component (`GlassCard`) distorting.
- **Incremental**: Add `shine` and other components after the core effect is verified.
- **Safety**: Ensure `shouldEnableDistortion` check prevents regression on low-end devices.
