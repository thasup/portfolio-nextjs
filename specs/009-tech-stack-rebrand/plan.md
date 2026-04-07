# Implementation Plan: Tech Stack Representation Strategy and Rebrand

**Branch**: `009-tech-stack-rebrand` | **Date**: 2026-03-17 | **Spec**: [specs/009-tech-stack-rebrand/spec.md](./spec.md)
**Input**: Feature specification from `specs/009-tech-stack-rebrand/spec.md`

## Summary

Refactor the "Skills" and "Tech Stack" representation across the portfolio to align with the "Salesmanship vs. Reality" framework. This involves replacing the "Icon Grid" and proficiency levels with a 3-Tier strategic display (Core Delivery, Architecture & Quality, Data & Product Insights) on the homepage, and adding contextual Tech Stack tags to Project Modals.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js (via Next.js)
**Primary Dependencies**: Next.js App Router, TailwindCSS, shadcn/ui, Lucide React, Framer Motion
**Storage**: Static Data (`src/data/*.ts`) and Localization Files (`messages/*.json`)
**Testing**: Manual verification, existing linting
**Target Platform**: Vercel (Web)
**Project Type**: Portfolio / Web Application
**Performance Goals**: Maintain or improve LCP by reducing DOM complexity (removing massive icon grids).
**Constraints**: Must support bilingual (EN/TH) content.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Product impact**: Directly addresses Principle I (Impact Over Folklore) and III (Insight-Dense Storytelling) by replacing "logo soup" with strategic context and proof points.
- **Performance + accessibility**: Removing the large grid of interactive/floating icons should reduce main thread work and DOM size. Text-based cards are more accessible than icon-only grids.
- **Evidence-led content**: Connects tools directly to projects (Principle VI) via Project Modal badges.
- **Bilingual fit**: Content will be added to `messages/en.json` and `messages/th.json` ensuring full support (Principle IV).
- **Measurement**: Interaction events should be added for clicking/expanding Tech Stack cards (Principle VII).
- **Appropriate level of detail**: Specific copy and icon choices are in the Spec, implementation details in Data Model.

## Project Structure

### Documentation (this feature)

```text
specs/009-tech-stack-rebrand/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── sections/
│   │   └── Skills/      # Refactor to TechCapabilities section
│   ├── glass/
│   │   └── GlassCard.tsx # Reuse for Tier cards
│   └── modal/
│       └── content/
│           └── ProjectModal.tsx # Update to include Tech Badges
├── data/
│   ├── skills.ts        # REPLACE with tech-stack.ts or refactor heavily
│   └── projects.ts      # Update to ensure techStack strings map correctly
└── types/
    └── skill.ts         # Update interfaces
messages/
├── en.json              # Add new strings
└── th.json              # Add new strings
```

**Structure Decision**: Refactor existing `Skills` section and `skills.ts` data to match new 3-Tier structure. Rename/Alias components as needed to reflect "Technical Capabilities" branding.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       |            |                                      |
