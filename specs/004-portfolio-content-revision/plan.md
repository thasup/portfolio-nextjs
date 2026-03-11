# Implementation Plan: Full Portfolio Content Revision

**Branch**: `004-portfolio-content-revision` | **Date**: 2026-03-11 | **Spec**: [`/Users/first/git/me/portfolio-nextjs/specs/004-portfolio-content-revision/spec.md`](/Users/first/git/me/portfolio-nextjs/specs/004-portfolio-content-revision/spec.md)
**Input**: Feature specification from `/specs/004-portfolio-content-revision/spec.md`

**Note**: This plan covers a content-heavy product revision on an existing Next.js portfolio. The implementation focus is to update structured content, section presentation, and cross-section evidence flow without introducing constitutional drift or weakening performance and accessibility standards.

## Summary

Revise the portfolio’s core narrative and proof surfaces so the site presents First as a systems-thinking senior software engineer currently building AI-first products at TeamStack, with a truthful 7+ year arc, stronger current flagship emphasis, real testimonials, clearer audience-fit messaging, and tighter bilingual evidence loops. The implementation will primarily update structured content sources under `src/data/` and `messages/`, then align the relevant homepage, about, projects, timeline, testimonials, skills, and contact components so the new story is visible, skim-friendly, and conversion-oriented.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 15 App Router  
**Primary Dependencies**: `next`, `react`, `next-intl`, `framer-motion`, `lucide-react`, `@radix-ui/*`, `tailwindcss`, `shadcn/ui`-style component primitives  
**Storage**: Version-controlled structured content in `src/data/` and localized copy in `messages/`; no new database storage  
**Testing**: `npm run lint`, `npm run build`, manual bilingual UX review, manual content consistency review  
**Target Platform**: Vercel-hosted Next.js web application for desktop and mobile browsers  
**Project Type**: Web application  
**Performance Goals**: Preserve constitution targets for first-impression delivery; maintain fast above-the-fold comprehension, stable layout, and no material regression to Lighthouse or interaction smoothness  
**Constraints**: Must preserve bilingual parity, accessible semantic structure, reduced-motion compatibility where timeline/testimonial interactions are involved, deterministic content sourcing, and consistency across all surfaced claims  
**Scale/Scope**: Update the core landing experience plus related about/contact/project views; expected touch points include multiple `src/data/*` modules, homepage sections, timeline components, testimonial surfaces, and localized copy resources

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Product impact**: Pass. This feature directly improves first-impression clarity, attention retention, insight density, and conversion quality by correcting the career narrative, foregrounding stronger current proof, and making audience-specific next steps more obvious.
- **Performance + accessibility**: Pass with care. Most work is structured content and presentational refinement. Interactive additions such as stronger testimonial previews, signal chips, or deeper cross-links must not add avoidable motion, layout shift, or inaccessible semantics.
- **Evidence-led content**: Pass. The revision depends on source-of-truth materials captured in `.windsurf/docs/full_portfolio_content_revision.md`, existing repository content modules, real testimonials, certifications, and documented career chronology. All major claims should map to projects, timeline events, testimonials, or credentials.
- **Bilingual fit**: Pass. EN and TH experiences are both in scope. Hero, timeline, projects, testimonials, about story, signals, and contact intents must preserve equivalent meaning while allowing audience-appropriate phrasing.
- **Measurement**: Pass. Existing analytics should only be extended if necessary to answer meaningful questions such as whether visitors engage more deeply with revised flagship proof, testimonial previews, or intent-specific contact paths. No vanity instrumentation should be added by default.
- **Appropriate level of detail**: Pass. Product requirements stay in the spec and plan. Implementation specifics remain in design artifacts and code updates rather than being promoted into constitutional doctrine.

## Project Structure

### Documentation (this feature)

```text
specs/004-portfolio-content-revision/
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
│   │   ├── about/
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── sections/
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── Timeline.tsx
│   │   ├── ValueProp.tsx
│   │   └── ValueStrip.tsx
│   ├── timeline/
│   │   ├── TimelineEventCard.tsx
│   │   ├── TimelineSpine.tsx
│   │   ├── TimelineYear.tsx
│   │   ├── YearBackground.tsx
│   │   └── index.ts
│   ├── projects/
│   ├── modal/
│   ├── modals/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── data/
│   ├── contactIntents.ts
│   ├── navigation.ts
│   ├── projects.ts
│   ├── siteConfig.ts
│   ├── skills.ts
│   ├── testimonials.ts
│   ├── timelineChapters.ts
│   ├── timelineEvents.ts
│   └── valuePropositions.ts
├── i18n/
├── lib/
├── styles/
├── types/
└── middleware.ts

messages/
├── en.json
└── th.json
```

**Structure Decision**: Use the existing single Next.js app structure. Implement the revision through structured content modules in `src/data/`, localized strings in `messages/`, and the existing homepage/about/contact section components rather than introducing new subsystems. This keeps the change evidence-led, deterministic, and aligned with the current architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed          | Simpler Alternative Rejected Because |
| -------------------------- | ------------------- | ------------------------------------ |
| [e.g., 4th project]        | [current need]      | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem]  | [why direct DB access insufficient]  |
