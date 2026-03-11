# Implementation Plan: Bilingual Portfolio

**Branch**: `002-bilingual-portfolio` | **Date**: 2026-03-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-bilingual-portfolio/spec.md`

## Summary

Implementing a premium bilingual (EN/TH) personal portfolio website engineered specifically for high conversion as a job-hunting asset. The architecture is driven by Vercel's hybrid static rendering and `next-intl` App Router support, delivering full static pre-rendered pages except for a centralized Resend API route (`/api/contact`). The primary experiences—the vertical intersection-driven Timeline and the hash-based Centralized Modal—are backed by performance-conscious implementation decisions (Framer Motion dynamic loading, `<1.2s` LCP target, strict GA4 typed tracking).

## Technical Context

**Language/Version**: TypeScript 5.x, Node >= 18
**Primary Dependencies**: Next.js 15 (App Router), TailwindCSS v4 + shadcn/ui, Framer Motion (lazy-loaded), Swiper.js, React Hook Form + Zod, Resend, `next-intl`, `@next/third-parties/google`
**Storage**: N/A (Version-controlled static TypeScript data files)
**Testing**: Playwright (if applicable), Vitest, Lighthouse CI
**Target Platform**: Vercel (Hybrid Static Rendering + Edge Network)
**Project Type**: Personal Portfolio Web Application
**Performance Goals**: Lighthouse 100 Desktop / 95+ Mobile, LCP < 1.2s, INP < 100ms, TTFB < 200ms
**Constraints**: CLS MUST be 0.00 at all times (fixed aspect-ratios), initial bundle JS < 120kb gzipped
**Scale/Scope**: Portfolio scale. 5-7 pages, 6 distinct project modals. Handled via static CDN globally.

## Constitution Check

*GATE: Must pass before Phase 1 design.*

- **Hybrid Static Rendering (Vercel)**: COMPLIANT (`output: 'export'` omitted from `next.config.ts`; `/api/contact` provided as serverless, pages compiled to static HTML).
- **TailwindCSS + shadcn/ui Only**: COMPLIANT (no custom SCSS).
- **TypeScript Strict Mode**: COMPLIANT (Types defined locally and enforced across data files).
- **Image Optimization**: COMPLIANT (`next/image` handles WebP/AVIF via Vercel).
- **Component Hierarchy**: COMPLIANT (Matches `ui/`, `shared/`, `sections/`, `timeline/`, `projects/`, `modal/`).
- **Animation Philosophy**: COMPLIANT (Framer Motion is restricted primarily to timeline progress spine and modal popovers; relies on CSS Intersection Observers for basic reveals).
- **Fixed Library Stack**: COMPLIANT (Only specifically authorized libraries added - viz `next-intl` for i18n).
- **Centralized Modal**: COMPLIANT (Zero external exits, Modal component controlled via URL hash manipulation `#project-[slug]`).

## Project Structure

### Documentation (this feature)

```text
specs/002-bilingual-portfolio/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           
│   └── components.md    # Phase 1 output (API schemas & interface contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command output)
```

### Source Code (repository root)

```text
thanachon-portfolio/
├── messages/
│   ├── en.json
│   └── th.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/contact/route.ts
│   │   ├── layout.tsx
│   │   └── middleware.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── modal/
│   │   ├── projects/
│   │   ├── sections/
│   │   ├── shared/
│   │   ├── timeline/
│   │   └── ui/
│   ├── data/
│   │   ├── contactIntents.ts
│   │   ├── navigation.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── testimonials.ts
│   │   ├── timelineChapters.ts
│   │   ├── timelineEvents.ts
│   │   └── valuePropositions.ts
│   ├── hooks/
│   ├── lib/
│   └── types/
└── public/
```

**Structure Decision**: A Next.js App Router Web Application mapping localized pages iteratively, isolating shared presentation layers and distinct section controllers as defined in the architectural layout from the user requirements.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None*    | *N/A*      | *N/A*                               |
