# Implementation Plan: Vertical Scroll Timeline — Design System & Implementation

**Branch**: `003-vertical-scroll-timeline` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-vertical-scroll-timeline/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a cinematic, vertical scroll timeline section that displays career events grouped by year with ambient backgrounds, an animated spine, and Deep Dive modals. The timeline transforms a chronological list into a compelling narrative using Framer Motion scroll animations, year-themed gradients, and performance-optimized interactions. All content is bilingual (EN/TH) and sourced from static TypeScript data files.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.2 (App Router)
**Primary Dependencies**: Framer Motion 11.18, next-intl 4.8, lucide-react 0.469, shadcn/ui (Radix UI primitives)
**Storage**: Static TypeScript data files in `src/data/`, no database
**Testing**: Manual QA + Lighthouse CI (Performance 100 desktop, 95+ mobile)
**Target Platform**: Web (modern browsers: Chrome, Firefox, Safari, Edge — latest 2 versions), deployed to Vercel Edge Network
**Project Type**: Web application — single-page portfolio with scroll-based narrative sections
**Performance Goals**: 60fps scroll performance, <1.2s LCP desktop, <2.0s LCP mobile, CLS 0.00, INP <100ms
**Constraints**: <120kb initial JS bundle (gzipped), all animations GPU-accelerated (CSS transforms only), mobile viewport <768px hides traveling dot for performance
**Scale/Scope**: ~20-30 timeline events across 4 years (2022-2025), 5 event types, 4 year themes, bilingual content (EN/TH)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Hybrid Static Rendering (Vercel) ✅

- Timeline section renders as static HTML at build time
- Framer Motion enhances static content client-side
- No dynamic data fetching on page load
- All timeline data sourced from `src/data/timelineEvents.ts`

### Gate 2: TailwindCSS + shadcn/ui Only ✅

- All styling via Tailwind utility classes
- Year theme colors defined as CSS custom properties or inline via `style` prop (dynamic runtime values)
- Modal uses shadcn Dialog component
- No external CSS frameworks

### Gate 3: TypeScript Strict Mode ✅

- All components `.tsx`, all data files `.ts`
- Explicit types for TimelineEvent, YearTheme entities
- No `any` types

### Gate 4: Image Optimization ✅

- N/A — timeline uses gradients, icons (Lucide), and tech badges (existing component)
- Future: If event media added, MUST use `next/image`

### Gate 5: Component Hierarchy ✅

- `src/components/sections/Timeline.tsx` — orchestrator
- `src/components/timeline/TimelineSpine.tsx` — spine component
- `src/components/timeline/TimelineYear.tsx` — year section
- `src/components/timeline/TimelineEventCard.tsx` — event card
- `src/components/timeline/YearBackground.tsx` — ambient background
- `src/components/shared/TechBadge.tsx` — reused from existing

### Gate 6: Animation Philosophy ✅

- Framer Motion lazy-loaded via `next/dynamic`
- `useReducedMotion()` respected in all animated components
- Scroll-triggered reveals via `useInView`
- GPU-accelerated: `scaleY` for spine fill, `opacity` for backgrounds, `transform` for cards

### Gate 7: Fixed Library Stack ✅

- No new runtime dependencies required
- Uses existing: Framer Motion, next-intl, lucide-react, shadcn/ui

### Gate 8: Data-Driven Architecture ✅

- Timeline events in `src/data/timelineEvents.ts` (already exists)
- Year themes in `src/data/timelineChapters.ts` (already exists, may need enhancement)
- Types in `src/types/timeline.ts`
- Zero hardcoded content in JSX

### Gate 9: Accessibility Baseline ✅

- Modal: focus trap via shadcn Dialog, Escape closes, returns focus
- Timeline: semantic HTML, keyboard-navigable
- ARIA labels on "Deep Dive" buttons
- Color contrast verified for all year themes

### Gate 10: Bilingual Content Architecture ✅

- All timeline events have `titleEn/Th`, `summaryEn/Th`, `impactEn/Th`, `descriptionEn/Th`
- Category labels bilingual via next-intl
- Year theme labels have `label` and `labelTh`

### Gate 11: Analytics Event Tracking ✅

- TIMELINE_PROGRESS (percent: 25/50/75/100)
- TIMELINE_DEEPDIVE_OPEN (event_id, event_title, year, event_type)
- Uses existing `src/lib/analytics.ts` pattern

### Gate 12: Ultra-Fast Performance ✅

- Target: 60fps scroll (verified via Chrome DevTools Performance)
- Traveling dot hidden <768px (performance optimization)
- Background transitions use opacity only (compositor)
- Spine fill uses scaleY (GPU transform)

**Result**: All gates PASSED. No constitutional violations. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/                           # Next.js App Router
│   └── [locale]/                  # Bilingual routing (en/th)
│       └── page.tsx               # Home page (imports Timeline section)
│
├── components/
│   ├── sections/
│   │   └── Timeline.tsx           # ✨ NEW: Main orchestrator component
│   │
│   ├── timeline/                  # ✨ NEW: Timeline-specific components
│   │   ├── TimelineSpine.tsx      # Vertical spine with fill + traveling dot
│   │   ├── TimelineYear.tsx       # Year section with header + events
│   │   ├── TimelineEventCard.tsx  # Individual event card
│   │   ├── YearBackground.tsx     # Ambient gradient backgrounds
│   │   └── index.ts               # Barrel exports
│   │
│   ├── shared/
│   │   ├── SectionHeader.tsx      # Existing: Reused for timeline header
│   │   ├── ScrollReveal.tsx       # Existing: Reused for reveal animations
│   │   └── TechBadge.tsx          # Existing: Reused for skills display
│   │
│   └── ui/                        # shadcn/ui (Dialog for modals)
│
├── data/
│   ├── timelineEvents.ts          # ✅ EXISTS: Enhanced with new fields
│   └── timelineChapters.ts        # ✅ EXISTS: Enhanced with YEAR_THEMES
│
├── types/
│   └── timeline.ts                # ✅ EXISTS: Enhanced with new attributes
│
├── lib/
│   ├── analytics.ts               # ✅ EXISTS: Add TIMELINE_* events
│   └── utils.ts                   # Existing utilities
│
├── hooks/
│   └── useModal.ts                # ✅ EXISTS: Modal management hook
│
├── styles/
│   └── globals.css                # Add timeline-specific utility classes
│
└── messages/                      # i18n translations
    ├── en.json                    # Add timeline.* keys
    └── th.json                    # Add timeline.* keys (Thai)
```

**Structure Decision**: Next.js App Router single-project structure. The timeline feature is implemented as a new section component (`Timeline.tsx`) with dedicated sub-components in `src/components/timeline/`. It reuses existing shared components (`SectionHeader`, `ScrollReveal`, `TechBadge`) and enhances existing data files (`timelineEvents.ts`, `timelineChapters.ts`) with new attributes required for the design system (descriptionEn/Th, featured flag, YEAR_THEMES constants).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
