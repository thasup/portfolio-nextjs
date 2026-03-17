# Implementation Plan: Liquid Glass Global Design System

**Branch**: `006-liquid-glass-system` | **Date**: 2026-03-16 | **Spec**: [/specs/006-liquid-glass-system/spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-liquid-glass-system/spec.md`

**Note**: This plan follows the `/speckit.plan` workflow and halts after Phase 2 planning per template instructions.

## Summary

Introduce a reusable "Liquid Glass" design system that defines CSS token primitives, elevation-aware glass components, and shared Framer Motion spring configs. Refactor every hero, navbar, timeline, projects, skills, testimonials, value prop, and contact section to use the new primitives while enforcing performance guardrails (≤4 active blur layers, Lighthouse 95+, runtime tier detection) and accessibility (WCAG AA, reduced-motion fallbacks). Deliverables include tokenized globals, glass component primitives (card, panel, button, modal, navbar), specular highlight system, and monitoring hooks.

## Technical Context

**Language/Version**: TypeScript 5.7 + Next.js 15.2 (App Router) with React 19  
**Primary Dependencies**: TailwindCSS 4 (utility tokens), shadcn/ui, Framer Motion 11, next-themes, next-intl, Radix UI primitives  
**Storage**: Static content via `src/data` and `messages/*` JSON (no runtime DB)  
**Testing**: `next lint`, Lighthouse CI (3 runs, ≥95) plus Storybook Chromatic + Playwright interaction snapshots covering motion/specular states  
**Target Platform**: Web (desktop + mobile) with SSR/ISR via Vercel preview + production  
**Project Type**: Marketing/portfolio web application refactor (design system)  
**Performance Goals**: Lighthouse ≥95 (mobile) / ≥100 (desktop), 60fps interactions, bundle impact <10kb (min+gz) for glass system  
**Constraints**: Max 4 overlapping backdrop-filter layers, no animating blur radius, reduced-motion + Tier 2 fallbacks enforced via `usePerformanceTier()` heuristics + CSS tokens  
**Scale/Scope**: Full refactor of all core UI sections plus shared components + hooks within the existing single Next.js app

## Constitution Check

- **Product impact**: Elevates first impression and attention retention by unifying the premium Liquid Glass aesthetic, adds tactile motion to improve comprehension of hierarchy, and ties every surface to clear elevation cues (Principles I, II, V).
- **Performance + accessibility**: Token system keeps CSS-only theming, tier detection prevents GPU overload on low-end devices, fallback surfaces ensure WCAG AA contrast, reduced-motion disables buoyant springs, and Lighthouse CI guards 95+ targets.
- **Evidence-led content**: Refactor keeps data under `src/data` + `messages`; visuals amplify existing evidence cards without inventing new copy, preserving Principle VI alignment.
- **Bilingual fit**: Components remain locale-agnostic, so EN/TH content continues to flow through next-intl without divergent templates; typography tokens must respect Thai rhythm when applied.
- **Measurement**: Build-time Lighthouse CI plus optional analytics events on glass interactions (hover/intent) inform success; no extra analytics unless tied to conversion/drop-off questions.
- **Appropriate level of detail**: Implementation-specific rules (tier heuristics, component APIs) stay inside spec/plan/docs, leaving the constitution focused on enduring principles.

## Project Structure

### Documentation (this feature)

```text
specs/006-liquid-glass-system/
├── plan.md          # /speckit.plan output (this file)
├── research.md      # Phase 0 decisions + unknown resolutions
├── data-model.md    # Phase 1 entities (tokens, components, hooks)
├── quickstart.md    # Phase 1 integration + testing guide
├── contracts/       # Phase 1 component + hook contracts
└── tasks.md         # Phase 2 (/speckit.tasks) – not covered here
```

### Source Code (repository root)

```text
src/
├── app/                     # Next.js App Router routes/layouts
├── components/
│   ├── layout/
│   ├── modal/
│   ├── projects/
│   ├── sections/            # Hero, Timeline, Skills, etc.
│   ├── shared/
│   ├── timeline/
│   └── ui/
├── hooks/
│   ├── useIntersectionObserver.ts # existing utilities
│   └── ...
├── lib/
│   ├── analytics.ts
│   ├── content.ts
│   ├── featureFlags.ts
│   ├── fonts.ts
│   ├── github.ts
│   └── utils.ts
├── styles/
│   └── globals.css          # will host Liquid Glass tokens
└── data/ + messages/        # structured copy sources

public/
├── media assets (svgs, images)
└── favicon + logos

specs/
└── 006-liquid-glass-system/ (docs described above)
```

**Structure Decision**: Single Next.js app with shared component + hook directories. New glass primitives live under `src/components/glass/`, shared springs in `src/lib/springs.ts`, and runtime heuristics in `src/lib/performance.ts`. Tokens expand `src/styles/globals.css`. Existing sections inside `src/components/sections/*` will be refactored to import the new primitives.

## Complexity Tracking

No constitution violations identified; table intentionally left empty.

## Constitution Check (Post-Design)

- **Product impact**: Research + data model confirm every section migrates to elevation-aware glass surfaces, tightening first-impression storytelling and preserving narrative focus.
- **Performance + accessibility**: `usePerformanceTier` heuristics, Chromatic regressions, and Lighthouse CI enforce GPU + motion guardrails; reduced-motion and Tier 2 tokens defined in docs ensure AA contrast.
- **Evidence-led content**: Contracts keep content slots (children) dynamic so bilingual data sources remain authoritative; no inline copy introduced.
- **Bilingual fit**: Quickstart notes require next-intl extraction; components accept children and respect typography tokens for Thai/English parity.
- **Measurement**: Analytics limited to existing `trackEvent` pathways (e.g., GlassButton intent) plus Lighthouse CI metrics; no vanity data.
- **Appropriate detail**: Operational rules (heuristics, contracts, testing) live in plan/research/quickstart, keeping constitution untouched.
