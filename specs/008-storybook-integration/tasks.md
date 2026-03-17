# Tasks: Storybook Integration

**Feature**: 008-storybook-integration
**Status**: In Progress

## Phase 1: Setup

*Goal: Initialize Storybook and configure environment*

- [x] T001 Install Storybook 7+ with Next.js preset (`npx storybook@latest init`)
- [x] T002 Install required addons (`@storybook/addon-a11y`) if not included
- [x] T003 Configure `.storybook/main.ts` for Next.js, Tailwind, and path aliases
- [x] T004 Configure `.storybook/preview.tsx` with global styles (import `globals.css`)
- [x] T005 Update `.gitignore` to include `storybook-static/`
- [x] T006 Add `storybook` and `build-storybook` scripts to `package.json`

## Phase 2: Core Infrastructure

*Goal: Create decorators for providing app context (Theme, i18n, Router)*

- [x] T007 Create `src/.storybook-decorators/ThemeDecorator.tsx` to wrap stories in `ThemeProvider`
- [x] T008 Create `src/.storybook-decorators/NextIntlDecorator.tsx` to wrap stories in `NextIntlClientProvider`
- [x] T009 Create `src/.storybook-decorators/NextRouterDecorator.tsx` to mock `next/navigation` hooks
- [x] T010 Register all decorators in `.storybook/preview.tsx`
- [x] T011 Configure `globalTypes` in `.storybook/preview.tsx` for Theme and Locale toolbars

## Phase 3: Glass Component Stories

*Goal: Document the Liquid Glass system (US1, US2)*

- [x] T012 [US1] Create `src/components/glass/GlassCard.stories.tsx` covering all elevations, hover, and distortion states
- [x] T013 [US1] Create `src/components/glass/GlassPanel.stories.tsx` covering elevations and specular highlights
- [x] T014 [US1] Create `src/components/glass/GlassButton.stories.tsx` covering variants, disabled state, and interactions
- [x] T015 [US1] Create `src/components/glass/GlassModal.stories.tsx` demonstrating overlay and content (using a mock state)
- [x] T016 [US2] Verify Controls addon allows toggling `distortion`, `shine`, and `elevation` props dynamically

## Phase 4: UI & Layout Stories

*Goal: Document remaining core UI components (US1, US2)*

- [x] T017 [US1] [P] Create stories for `src/components/layout/Navbar.tsx` (Navbar)
- [x] T018 [US1] [P] Create stories for `src/components/layout/Footer.tsx` (Footer)
- [x] T019 [US1] [P] Create stories for shared UI components (if any exist in `src/components/ui`)
- [x] T020 [US1] [P] Create stories for `src/components/sections/ValueProp.tsx` (ValueProp)
- [x] T021 [US1] [P] Create stories for `src/components/sections/Contact.tsx` (Contact)

## Phase 5: Testing & Documentation

*Goal: Validate accessibility and theming (US3, US4, US5)*

- [ ] T022 [US4] Run Storybook a11y audit on all Glass components and fix violations
- [ ] T023 [US5] Verify light/dark mode switching works across all stories via toolbar
- [ ] T024 [US5] Verify English/Thai locale switching updates text content
- [x] T025 Add `README.md` to `.storybook/` documenting how to add new stories and use controls

## Dependencies

- Phase 1 must be complete before any stories can be written
- Phase 2 must be complete for components using Theme/i18n to render correctly
- Phase 3, 4, 5 can overlap significantly

## Implementation Strategy

- **MVP**: Get Storybook running with `GlassCard` rendering correctly with styles.
- **Iterative**: Add Decorators one by one as components break (e.g. add i18n when a component needs translations).
- **Scale**: Batch create stories for remaining components once patterns are established.
