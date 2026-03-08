<!--
  Sync Impact Report
  ────────────────────────────────────────────────────
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  
  Modified principles: N/A (first version)
  
  Added sections:
    - Core Principles (10 principles)
    - Fixed Library Stack
    - Development Workflow
    - Governance
  
  Removed sections: N/A (first version)
  
  Templates requiring updates:
    - .specify/templates/plan-template.md       ✅ reviewed — no updates needed
    - .specify/templates/spec-template.md        ✅ reviewed — no updates needed
    - .specify/templates/tasks-template.md       ✅ reviewed — no updates needed
  
  Follow-up TODOs: none
-->

# Portfolio Website Constitution

## Core Principles

### I. Static-First Performance

Every architectural and implementation decision MUST optimize for
static export (`next.config.ts` → `output: 'export'`).

- No server-side rendering. No API routes. No dynamic routes that
  cannot be statically generated at build time.
- The production site MUST achieve **Lighthouse scores of 95+** across
  Performance, Accessibility, Best Practices, and SEO.
- Any feature that would require a server runtime (middleware, server
  actions, ISR) MUST be rejected or re-architected to work at build
  time.

### II. TailwindCSS + shadcn/ui Only

Zero Bootstrap. Zero SCSS files. Zero inline `style` attributes unless
using CSS custom properties via the `style` prop for truly dynamic
values (e.g., animation colors derived from data at runtime).

- All visual styling MUST use Tailwind utility classes.
- shadcn/ui is the component library. Generated components live in
  `src/components/ui/` and MUST never be modified directly.
- Extend or customize shadcn/ui via **wrapper components** placed
  outside `src/components/ui/`.

### III. TypeScript Strict Mode

All source files MUST use `.tsx` or `.ts` extensions. No `.js` or
`.jsx` files are permitted.

- **No `any` types.** Every value MUST have an explicit or inferable
  type.
- All data structures MUST have explicit interfaces or types defined
  in `src/types/` or co-located with their data file in `src/data/`.
- `tsconfig.json` MUST enable `"strict": true`.

### IV. Image Optimization Is Mandatory

Every image rendered in the application MUST use `next/image`. No raw
`<img>` tags.

- All project screenshots and media MUST be in `.webp` format.
- Avatar and hero images MUST set `priority={true}`.
- All other images MUST use lazy loading.
- Where a static import is available, blur placeholders MUST be used.

### V. Component Hierarchy

The component directory structure MUST follow this exact layout:

- `src/components/ui/` → shadcn/ui generated components (never edited
  directly).
- `src/components/shared/` → Reusable primitives: `ScrollReveal`,
  `SectionHeader`, `TechBadge`, `AnimatedCounter`, etc.
- `src/components/layout/` → `Navbar`, `Footer`, `ScrollProgress`,
  `ThemeToggle`.
- `src/components/sections/` → One file per page section: `Hero`,
  `Timeline`, `Projects`, `Skills`, `Testimonials`, `ContactCTA`.
- `src/components/timeline/` → Timeline-specific sub-components.
- `src/components/projects/` → Project-specific sub-components.

No component may exist outside this hierarchy without explicit
justification documented in its file header.

### VI. Animation Philosophy — Subtle Only

Framer Motion is the sole animation library. Permitted use cases:

- Scroll-triggered fade-up reveals.
- Timeline node interactions.
- Skill bar fill animations.
- Page transitions.

Non-negotiable rules:

- Animations MUST NOT play on every render without user interaction.
- All animated components MUST respect `prefers-reduced-motion` via
  Framer Motion's `useReducedMotion()` hook.
- Framer Motion MUST be lazy-loaded via `next/dynamic` to avoid
  blocking the critical rendering path.

### VII. Fixed Library Stack

The technology stack is locked. No additional runtime dependencies may
be added without an amendment to this constitution.

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
| Fonts           | Geist Sans + Geist Mono via `geist` npm package    |
| Hosting         | Netlify (static export, `netlify.toml` required)   |

### VIII. Data-Driven Architecture

All content — timeline events, projects, skills, testimonials — MUST
live in `src/data/` as typed TypeScript files.

- No hardcoded content inside component JSX.
- Components MUST receive data as props or import from data files
  directly.
- Every data file MUST export a typed array or object with an
  accompanying interface in the same file or in `src/types/`.

### IX. Accessibility Baseline

- All interactive elements MUST have an `aria-label` or visible text
  label.
- Color contrast MUST meet WCAG AA (minimum 4.5:1 for normal text,
  3:1 for large text).
- Keyboard navigation MUST work for all interactive components,
  including timeline nodes and project filters.
- Focus indicators MUST be visible on all focusable elements.

### X. No External CDN Dependencies

- No Google Fonts URLs at runtime. Fonts MUST be bundled via the
  `geist` npm package.
- No CDN-hosted CSS or JavaScript files.
- Everything MUST be bundled at build time so the site works fully
  offline after the initial page load.

## Fixed Library Stack

The table in Principle VII is the authoritative dependency list.
Deviations require a constitutional amendment (see Governance below).

**Explicitly banned dependencies** (present in the legacy codebase,
MUST be removed during migration):

- `react-bootstrap` — replaced by shadcn/ui + TailwindCSS.
- `sass` / any `.scss` files — replaced by TailwindCSS v4.
- `@vercel/analytics` / `@vercel/speed-insights` — replaced by GA4
  via `@next/third-parties/google`.
- `typed.js` — replaced by Framer Motion text animations.

**Dev-dependency allowlist**: TypeScript, ESLint, Prettier, PostCSS,
`@types/*` packages. Additions to dev dependencies do not require a
constitutional amendment unless they affect the build output.

## Development Workflow

### Build & Deployment

1. `npm run dev` — local development with hot reload.
2. `npm run build` — MUST produce a static export with zero errors.
3. `npm run lint` — MUST pass with zero warnings before any PR merge.
4. Deployment target is **Netlify**. A `netlify.toml` MUST always
   exist at the repository root.

### Code Quality Gates

- All new components MUST follow the Component Hierarchy (Principle V).
- All data MUST be extracted into `src/data/` (Principle VIII).
- All images MUST use `next/image` with `.webp` format (Principle IV).
- All files MUST be TypeScript with strict mode (Principle III).
- Lighthouse CI SHOULD run on every PR; scores below 95 block merge.

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ScrollReveal.tsx`).
- Data files: `camelCase.ts` (e.g., `timelineEvents.ts`).
- Type files: `camelCase.ts` (e.g., `timeline.ts` in `src/types/`).
- Utility files: `camelCase.ts` (e.g., `formatDate.ts` in
  `src/utils/` or `utils/`).

## Governance

- This constitution supersedes all other project practices,
  conventions, and ad-hoc decisions.
- Any amendment MUST be documented with a version bump, rationale,
  and migration plan (if breaking).
- Version follows semantic versioning:
  - **MAJOR**: Principle removal or redefinition (backward
    incompatible).
  - **MINOR**: New principle or materially expanded guidance.
  - **PATCH**: Clarifications, wording fixes, non-semantic
    refinements.
- All PRs and code reviews MUST verify compliance with these
  principles.
- Complexity or deviation from these principles MUST be justified in
  a Complexity Tracking table (see plan template).

**Version**: 1.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-08
