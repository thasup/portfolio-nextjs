# Implementation Plan: Liquid Distortion Enhancement

**Branch**: `007-liquid-distortion-enhancement` | **Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-liquid-distortion-enhancement/spec.md`

## Summary

This feature enhances the existing Liquid Glass system (006) with SVG filter-based distortion effects to create realistic "liquid glass" appearance. The implementation adds optional turbulence distortion, layered DOM architecture (effect/tint/shine/content), and configurable intensity presets while maintaining backward compatibility and performance targets.

**Primary Requirement**: Add SVG-based liquid distortion to glass components  
**Technical Approach**: Layer feTurbulence + feDisplacementMap filters over backdrop-filter blur, with performance tier detection for graceful degradation

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, React 18, Next.js 15  
**Primary Dependencies**: Framer Motion 11, existing Liquid Glass system (006)  
**Storage**: N/A (UI-only feature)  
**Testing**: Manual visual QA, Storybook interactive testing (feature 008)  
**Target Platform**: Modern browsers (Chrome 20+, Firefox 35+, Safari 9+, Edge 79+)  
**Project Type**: Next.js web application (portfolio)  
**Performance Goals**: 60fps rendering, <16ms frame time, Lighthouse 95+ mobile  
**Constraints**: WCAG 2.1 AA compliance, prefers-reduced-motion support, <5MB heap increase  
**Scale/Scope**: 4 glass components (Card/Panel/Button/Modal), 3 distortion intensity presets

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Product impact**: This feature directly supports Constitution Principle II ("Fast, Premium, Accessible Delivery") and Principle V ("Liquid interactive polish with organic buoyancy"). The liquid distortion effect elevates the portfolio's premium feel, creating a memorable first impression (Principle I: "Product Impact Over Implementation Folklore"). The effect strengthens the "Age of AI" aesthetic mentioned in the constitution, making the portfolio stand out in the first 5-15 second window (Experience Standards: 60-Second Impact Window).

- **Performance + accessibility**:
  - **Performance**: Leverages existing performance tier detection (usePerformanceTier) to enable distortion only on Tier 1 devices. SVG filters are GPU-accelerated on modern browsers. Graceful degradation maintains Lighthouse 95+ mobile target.
  - **Accessibility**: Distortion applies only to background layers, not content. Text readability remains WCAG 2.1 AA compliant (4.5:1 contrast). Respects prefers-reduced-motion by disabling any animated distortion.
  - **Loading**: No impact on initial page load (SVG filter is inline, no external assets). First Contentful Paint unaffected.
  - **Keyboard/Semantic**: No changes to interactive behavior or semantic structure.

- **Evidence-led content**: No new content claims introduced. This is a visual polish enhancement to existing components. Does not affect portfolio narrative, project descriptions, or credibility evidence.

- **Bilingual fit**: No impact on EN/TH content, routing, or messaging. Visual effect is language-agnostic.

- **Measurement**:
  - Success signals: Subjective "premium feel" feedback from stakeholders, zero performance regression (Lighthouse scores), zero accessibility violations.
  - Analytics: No new tracking needed. Existing performance monitoring covers frame rates and Core Web Vitals.
  - Worth instrumenting: Optional performance profiling during development to validate <16ms frame budget.

- **Appropriate level of detail**: Implementation details (SVG filter parameters, z-index layering, CSS classes) belong in this plan and component code, not in the constitution. The constitution correctly captures the "Liquid Glass" aesthetic requirement without specifying implementation.

**GATE STATUS**: ✅ **PASS** - Feature aligns with constitutional principles, maintains performance/accessibility baselines, and delivers on "premium polish" mandate.

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
├── components/
│   └── glass/
│       ├── GlassCard.tsx           # MODIFIED: Add distortion support, layered DOM
│       ├── GlassPanel.tsx          # MODIFIED: Add distortion support
│       ├── GlassButton.tsx         # MODIFIED: Add distortion support
│       ├── GlassModal.tsx          # MODIFIED: Add distortion support (if applicable)
│       ├── GlassSVGFilters.tsx     # NEW: SVG filter definitions component
│       ├── glass-types.ts          # MODIFIED: Add DistortionConfig, intensity types
│       └── README.md               # MODIFIED: Document distortion props and usage
│
├── lib/
│   └── glass-distortion.ts         # NEW: Distortion configuration presets, helpers
│
└── styles/
    └── globals.css                 # MODIFIED: Add .liquidGlass-* layer classes if needed

tests/ (future - Storybook provides interactive testing for now)
```

**Structure Decision**: Extend existing `src/components/glass/` directory with new SVG filter component and helper utilities. Maintain co-location of glass-related code. No new top-level directories needed since this builds on the existing Liquid Glass system (006).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitutional violations. Feature aligns with established principles.
