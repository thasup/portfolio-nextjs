# Implementation Plan: Curated Testimonials Experience

**Branch**: `005-curated-testimonials` | **Date**: 2026-03-11 | **Spec**: [`/Users/first/git/me/portfolio-nextjs/specs/005-curated-testimonials/spec.md`](/Users/first/git/me/portfolio-nextjs/specs/005-curated-testimonials/spec.md)
**Input**: Feature specification from `/specs/005-curated-testimonials/spec.md`

**Note**: This plan covers a trust-building redesign of the testimonials section within an existing bilingual Next.js portfolio. The implementation focus is to enrich structured testimonial content, strengthen first-glance proof density, and redesign the card + modal experience without regressing accessibility, performance, or content authenticity.

## Summary

Redesign the testimonials section so it communicates credibility within seconds and rewards deeper reading with an editorial, high-trust modal experience. The implementation will update the structured testimonial model in `src/data/testimonials.ts` and `src/types/testimonial.ts`, then revise the testimonials section, carousel/card presentation, modal content, and supporting analytics hooks so visitors can quickly recognize proof themes, speaker context, and trust signals across both English and Thai experiences.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 15 App Router  
**Primary Dependencies**: `next`, `react`, `next-intl`, `swiper`, `lucide-react`, `@radix-ui/react-dialog`, `tailwindcss`, shared shadcn/ui-style components, existing modal/analytics utilities  
**Storage**: Version-controlled structured content in `src/data/` and localized UI copy in `messages/`; no database storage  
**Testing**: `npm run lint`, `npm run build`, manual modal accessibility review, manual EN/TH content review, manual responsive UX review  
**Target Platform**: Vercel-hosted Next.js web application for desktop and mobile browsers  
**Project Type**: Web application  
**Performance Goals**: Preserve fast first-impression rendering, avoid testimonial interaction jank, maintain stable modal open/close behavior, and avoid regressions to Lighthouse/accessibility baselines  
**Constraints**: Must preserve authenticity of curated quotes, support bilingual parity, respect keyboard navigation and reduced-motion expectations, reuse the current modal architecture, and keep content deterministic from repository data sources  
**Scale/Scope**: Focused redesign touching testimonial data, testimonial types, section-level UI, modal rendering, and possibly localized supporting copy; no new backend or external API integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Product impact**: Pass. This feature directly improves first impression, attention retention, and insight density by making third-party proof more legible, specific, and visually premium within the 5-to-45-second trust window.
- **Performance + accessibility**: Pass with care. The work stays inside an existing client-side carousel/modal pattern. Changes must preserve keyboard access, readable modal structure, visible focus states, and stable performance on mobile and desktop.
- **Evidence-led content**: Pass. The feature depends on the curated testimonial source in `.windsurf/docs/curated_testimonials_strategy.md` and existing repository testimonial data structures. All presented claims remain attributable to real named speakers and role context.
- **Bilingual fit**: Pass. The implementation affects both English and Thai surfaces. The content model and rendered UI must preserve equivalent value across locales even if the exact wording or preview length differs.
- **Measurement**: Pass. Existing modal open/close analytics already exist. Additional instrumentation should only be added if it answers high-value questions such as whether visitors open multiple testimonials or which proof themes attract interaction.
- **Appropriate level of detail**: Pass. Product requirements remain in the spec. This plan documents implementation structure and UI/content contracts without promoting incidental technical choices into constitutional rules.

## Project Structure

### Documentation (this feature)

```text
specs/005-curated-testimonials/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── [locale]/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── modal/
│   │   ├── content/
│   │   │   └── TestimonialModal.tsx
│   │   ├── ModalContext.tsx
│   │   └── ModalShell.tsx
│   ├── sections/
│   │   ├── Testimonials.tsx
│   │   └── TestimonialsCarousel.tsx
│   ├── shared/
│   │   └── LocalizedText.tsx
│   └── ui/
├── data/
│   └── testimonials.ts
├── hooks/
│   └── useModal.ts
├── i18n/
│   └── request.ts
├── lib/
│   ├── analytics.ts
│   └── utils.ts
└── types/
    └── testimonial.ts

messages/
├── en.json
└── th.json
```

**Structure Decision**: Use the existing single Next.js application structure and current modal architecture. Implement the feature through structured testimonial data enhancements plus focused UI changes in the testimonials section and modal components, rather than introducing new routes, services, or runtime systems.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed          | Simpler Alternative Rejected Because |
| -------------------------- | ------------------- | ------------------------------------ |
| [e.g., 4th project]        | [current need]      | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem]  | [why direct DB access insufficient]  |
