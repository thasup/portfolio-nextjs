<!--
  Sync Impact Report
  ────────────────────────────────────────────────────
  Version change: 1.0.0 → 2.0.0 (Cycle 2 Finalization)
  
  Modified principles:
    - I. Static-First Performance → I. Hybrid Static Rendering (Vercel)
    - VII. Fixed Library Stack (Netlify replaced by Vercel, next-intl added)
  
  Added sections:
    - XI. Content Authority Hierarchy
    - XII. Bilingual Content Architecture (TH/EN)
    - XIII. Timeline Is A Vertical Scroll Narrative
    - XIV. Centralized Modal System
    - XV. Ultra-Fast Performance
    - XVI. Analytics Event Tracking
    - XVII. First Impression Standards
    - XVIII. Content Quality Standards
    - XIX. Modal-First Navigation
    - XX. Accessibility Commitments
  
  Templates requiring updates:
    - .specify/templates/plan-template.md       ✅ reviewed — no updates needed
    - .specify/templates/spec-template.md       ✅ reviewed — no updates needed
    - .specify/templates/tasks-template.md      ✅ reviewed — no updates needed
  
  Follow-up TODOs: none
-->

# Portfolio Website Constitution

## Core Principles

### I. Hybrid Static Rendering (Vercel)

Every architectural and implementation decision MUST optimize for Vercel's hybrid static rendering.
The `output: 'export'` setting in `next.config.ts` is explicitly FORBIDDEN so that Serverless API routes can function.

- No dynamic data fetching on page load. All pages MUST be statically generated at build time.
- The only permitted server runtime is the `/api/contact` API route deployed as a Vercel Serverless Function.
- The production site MUST achieve **Lighthouse scores of 100 on Desktop and 95+ on Mobile** across Performance, Accessibility, Best Practices, and SEO.

### II. TailwindCSS + shadcn/ui Only

Zero Bootstrap. Zero SCSS files. Zero inline `style` attributes unless using CSS custom properties via the `style` prop for truly dynamic values (e.g., animation colors derived from data at runtime).

- All visual styling MUST use Tailwind utility classes.
- shadcn/ui is the component library. Generated components live in `src/components/ui/` and MUST never be modified directly.
- Extend or customize shadcn/ui via **wrapper components** placed outside `src/components/ui/`.

### III. TypeScript Strict Mode

All source files MUST use `.tsx` or `.ts` extensions. No `.js` or `.jsx` files are permitted.

- **No `any` types.** Every value MUST have an explicit or inferable type.
- All data structures MUST have explicit interfaces or types defined in `src/types/` or co-located with their data file in `src/data/`.
- `tsconfig.json` MUST enable `"strict": true`.

### IV. Image Optimization Is Mandatory

Every image rendered in the application MUST use `next/image` to leverage Vercel's built-in image optimization pipeline. Zero `<img>` tags anywhere in codebase.

- All project screenshots and media MUST be in `.webp` or `.avif` format.
- Avatar and hero images MUST set `priority={true}`.
- All other images MUST use lazy loading.
- Where a static import is available, blur placeholders MUST be used.

### V. Component Hierarchy

The component directory structure MUST follow this exact layout:

- `src/components/ui/` → shadcn/ui generated components (never edited directly).
- `src/components/shared/` → Reusable primitives: `ScrollReveal`, `SectionHeader`, `TechBadge`, `AnimatedCounter`, etc.
- `src/components/layout/` → `Navbar`, `Footer`, `ScrollProgress`, `ThemeToggle`.
- `src/components/sections/` → One file per page section: `Hero`, `Timeline`, `Projects`, `Skills`, `Testimonials`, `ContactCTA`.
- `src/components/timeline/` → Timeline-specific sub-components.
- `src/components/projects/` → Project-specific sub-components.

No component may exist outside this hierarchy without explicit justification documented in its file header.

### VI. Animation Philosophy — Subtle Only

Framer Motion is the sole animation library. Permitted use cases:

- Scroll-triggered fade-up reveals.
- Timeline node interactions.
- Skill bar fill animations.
- Page transitions.
- Interactive modal reveals.

Non-negotiable rules:

- Animations MUST NOT play on every render without user interaction.
- All animated components MUST respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion()` hook — not just CSS media queries.
- Framer Motion MUST be dynamically imported (`next/dynamic`), never in the initial bundle.

### VII. Fixed Library Stack

The technology stack is locked. No additional runtime dependencies may be added without an amendment to this constitution.

| Concern         | Library / Tool                                     |
|-----------------|----------------------------------------------------|
| Framework       | Next.js 15, App Router                             |
| Styling         | TailwindCSS v4 + shadcn/ui                         |
| Animation       | Framer Motion (lazy-loaded via dynamic import)     |
| Carousel        | Swiper.js (only required modules imported)         |
| Forms           | React Hook Form + Zod + Resend                     |
| Analytics       | Google Analytics 4 via `@next/third-parties/google`|
| Theme           | next-themes                                        |
| Icons           | lucide-react only (no heroicons, no react-icons)   |
| Fonts           | Geist Sans + Geist Mono via `geist`, Noto Sans Thai / Sarabun via `next/font/google` |
| i18n            | next-intl                                          |
| Hosting         | Vercel (hybrid static rendering, `vercel.json`)    |

### VIII. Data-Driven Architecture

All content — timeline events, projects, skills, testimonials — MUST live in `src/data/` as typed TypeScript files.

- No hardcoded content inside component JSX.
- Components MUST receive data as props or import from data files directly.
- Every data file MUST export a typed array or object with an accompanying interface in the same file or in `src/types/`.

### IX. Accessibility Baseline

- All interactive elements MUST have an `aria-label` or visible text label.
- Color contrast MUST meet WCAG 2.1 AA (minimum 4.5:1 for normal text, 3:1 for large text).
- Keyboard navigation MUST work for all interactive components, including timeline nodes and project filters.
- Focus indicators MUST be visible on all focusable elements.

### X. No External CDN Dependencies

- No Google Fonts URLs at runtime. Fonts MUST be self-hosted via `next/font/google`.
- No CDN-hosted CSS or JavaScript files.
- Everything MUST be bundled at build time so the site works fully offline after the initial page load.

### XI. Content Authority Hierarchy

All content must be sourced in this priority order:
1. Airtable Gaia Project → authoritative source for personal beliefs, values, reflections, projects, achievements.
2. CV/Resume → authoritative for work history and tech stack.
3. LinkedIn → authoritative for professional framing.
4. GitHub → authoritative for technical evidence.
5. This specification → fills gaps where above sources are silent.

### XII. Bilingual Content Architecture (TH/EN)

The site MUST support both Thai (th) and English (en) languages.
- English is the default language (`lang="en"` on root HTML element).
- URL structure: `/en/...` and `/th/...` with automatic redirect from `/` to `/en/`.
- All user-facing strings must have both EN and TH translations.
- Content files: `src/messages/en.json` and `src/messages/th.json`.
- Font: Thai script requires Noto Sans Thai or Sarabun from Google Fonts — self-host via `next/font/google` with `subsets: ['thai', 'latin']`. Keep line-height: 1.8 minimum when `lang="th"` is active.

### XIII. Timeline Is A Vertical Scroll Narrative

The timeline IS a full-screen, section-by-section vertical scroll experience.
- Each timeline event is a full-width "scene" — minimum 80vh tall on desktop.
- Framer Motion `useScroll` + `useTransform` for parallax and reveal effects.
- A persistent vertical progress spine runs down the left side.
- Year markers float sticky on the right side.
- Entire timeline section is rendered server-side for SEO, with Framer Motion enhancing the static content.

### XIV. Centralized Modal System

Zero external navigation from project cards, timeline events, or skill items.
- All supplementary content renders inside a centralized Modal component.
- The Modal is a full-screen overlay (minimum 80vw × 80vh on desktop).
- Built on shadcn Dialog with custom full-screen variant.
- Supports content types: 'project', 'timeline-event', 'certificate', 'testimonial'.
- Modal state is reflected in URL hash (e.g., `#project-ai-event-platform`).

### XV. Ultra-Fast Performance

Targets are non-negotiable:
- Lighthouse Performance: 100 desktop, 95+ mobile.
- LCP: < 1.2s (desktop), < 2.0s (mobile).
- CLS: 0.00 (reserve all image space with aspect-ratio).
- INP: < 100ms.
- TTFB: < 200ms (Vercel Edge Network CDN).
- Bundle: < 120kb initial JS (gzipped), heavy sections lazy-loaded.

### XVI. Analytics Event Tracking

Every meaningful user interaction must fire a typed GA4 custom event defined in `src/lib/analytics.ts`.
- Events required: PAGE_VIEW, NAV_LINK_CLICK, LANGUAGE_TOGGLE, THEME_TOGGLE, RESUME_DOWNLOAD, HERO_CTA_CLICK, HERO_SOCIAL_CLICK, TIMELINE_SCENE_ENTER, TIMELINE_PROGRESS, PROJECT_FILTER_CHANGE, PROJECT_CARD_CLICK, MODAL_OPEN, MODAL_CLOSE, SCROLL_DEPTH, etc.
- All event names are SCREAMING_SNAKE_CASE string constants.

### XVII. First Impression Standards

- Above-the-fold content must communicate WHO, WHAT, and WHY in under 5 seconds.
- Single dominant visual hierarchy.
- Maximum 2 CTAs above fold.
- Hero animations complete in < 1.2s total.
- Social proof signal above fold (e.g., TOEIC 915, AWS Certified).

### XVIII. Content Quality Standards

- No passive voice where active voice is possible.
- No generic phrases: "passionate about", "team player". Every claim must be backed by a specific example.
- EN copy: clear, direct, confident.
- TH copy: professional but warm (ภาษาทางการที่ฟังดูเป็นธรรมชาติ).
- Every project description answers: what problem, how solved, what resulted.

### XIX. Modal-First Navigation

All content that would traditionally be a separate page must open in the centralized Modal.
- The only separate pages are: `/` (home), `/about`, `/contact`, `/projects`.
- Project detail pages (`/projects/[slug]`) STILL EXIST as static pages for SEO and direct linking.
- The ProjectDetailContent component renders in both Modal and page.

### XX. Accessibility Commitments

- WCAG 2.1 AA minimum across the entire site.
- Modal: focus trap, Escape closes, return focus to trigger on close.
- Timeline: all scroll-triggered content is readable without JS.
- Language toggle: announced to screen readers.
- Skip-to-main-content link: first focusable element on every page.

## Fixed Library Stack

The table in Principle VII is the authoritative dependency list.
Deviations require a constitutional amendment (see Governance below).

**Explicitly banned dependencies** (present in the legacy codebase, MUST be removed during migration):

- `react-bootstrap` — replaced by shadcn/ui + TailwindCSS.
- `sass` / any `.scss` files — replaced by TailwindCSS v4.
- `@vercel/analytics` / `@vercel/speed-insights` — replaced by GA4 via `@next/third-parties/google`.
- `typed.js` — replaced by Framer Motion text animations.

**Dev-dependency allowlist**: TypeScript, ESLint, Prettier, PostCSS, `@types/*` packages. Additions to dev dependencies do not require a constitutional amendment unless they affect the build output.

## Development Workflow

### Build & Deployment

1. `npm run dev` — local development with hot reload.
2. `npm run build` — MUST produce a hybrid static output with zero errors.
3. `npm run lint` — MUST pass with zero warnings before any PR merge.
4. Deployment target is **Vercel**. A `vercel.json` optionally exists at the repository root for configuration.

### Code Quality Gates

- All new components MUST follow the Component Hierarchy (Principle V).
- All data MUST be extracted into `src/data/` (Principle VIII).
- All images MUST use `next/image` with `.webp`/`.avif` format (Principle IV).
- All files MUST be TypeScript with strict mode (Principle III).
- Lighthouse CI SHOULD run on every PR; scores below 95 block merge.

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ScrollReveal.tsx`).
- Data files: `camelCase.ts` (e.g., `timelineEvents.ts`).
- Type files: `camelCase.ts` (e.g., `timeline.ts` in `src/types/`).
- Utility files: `camelCase.ts` (e.g., `formatDate.ts` in `src/utils/` or `utils/`).

## Governance

- This constitution supersedes all other project practices, conventions, and ad-hoc decisions.
- Any amendment MUST be documented with a version bump, rationale, and migration plan (if breaking).
- Version follows semantic versioning:
  - **MAJOR**: Principle removal or redefinition (backward incompatible).
  - **MINOR**: New principle or materially expanded guidance.
  - **PATCH**: Clarifications, wording fixes, non-semantic refinements.
- All PRs and code reviews MUST verify compliance with these principles.
- Complexity or deviation from these principles MUST be justified in a Complexity Tracking table (see plan template).

**Version**: 2.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-08
