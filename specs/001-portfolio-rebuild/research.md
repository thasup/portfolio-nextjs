# Research: Portfolio Website Rebuild

**Branch**: `001-portfolio-rebuild`
**Date**: 2026-03-08
**Status**: Complete — all decisions resolved

## R1: Static Export with Dynamic Routes

**Decision**: Use `generateStaticParams()` for `/projects/[slug]` pages.

**Rationale**: Next.js 15 App Router requires `generateStaticParams()` for
dynamic routes when `output: 'export'` is configured. This function returns
all valid slug values at build time, and Next.js pre-renders each page.
Since there are only 6 projects, this is trivial — the function imports
the projects data file and maps to slugs.

**Alternatives considered**:
- Modal overlay for project details (rejected: too much content for a modal,
  poor mobile experience with galleries)
- `getStaticPaths` (Pages Router API — not applicable with App Router)

## R2: Contact Form on Static Export

**Decision**: Use Netlify Forms with the `netlify` HTML attribute.

**Rationale**: Since `output: 'export'` disallows API routes, the contact
form cannot use a Next.js API route with Resend. Netlify Forms automatically
detects HTML forms with the `data-netlify="true"` attribute during deploy
and processes submissions server-side. Submissions are stored in Netlify
dashboard and can trigger email notifications natively. If custom email
formatting is needed later, a Netlify Function webhook can forward submissions
to Resend.

**Alternatives considered**:
- Next.js API route + `@netlify/next` adapter (rejected: constitution
  Principle I forbids server runtime; the adapter adds SSR capabilities
  which conflicts with pure static export)
- Client-side `fetch` to Resend API (rejected: exposes API key in
  client-side code — security risk)
- Formspree/Getform (rejected: adds external dependency outside fixed stack)

**Implementation notes**:
- Form must include `data-netlify="true"` attribute
- A hidden `<input name="form-name" value="contact">` is required
- A hidden `<input name="bot-field">` for honeypot spam protection
- Form action can be the same page — Netlify intercepts the POST
- React Hook Form handles client-side validation; form submits via
  standard HTML POST (not AJAX) for best Netlify compatibility, or
  via `fetch` to `/.netlify/functions/submission-created` for AJAX

## R3: TailwindCSS v4 Configuration

**Decision**: CSS-first configuration using `@theme` directive in
`globals.css`. Minimal `tailwind.config.ts` for `darkMode` and `content`.

**Rationale**: TailwindCSS v4 moves configuration from JavaScript to CSS
via the `@theme` directive. This aligns with the constitution's zero-SCSS
mandate. Design tokens (colors, fonts, spacing) are defined in CSS custom
properties inside `@theme {}`, making them available to both Tailwind
utilities and CSS custom properties simultaneously.

**Alternatives considered**:
- Full JS config (TailwindCSS v3 style): still works but is legacy pattern
- CSS-only (no tailwind.config.ts at all): requires `darkMode` to be set
  via CSS which is less straightforward with `next-themes`

## R4: shadcn/ui with App Router and TailwindCSS v4

**Decision**: Use shadcn/ui with `new-york` style, neutral base color,
CSS variables enabled.

**Rationale**: shadcn/ui 2.x supports Next.js 15 App Router and
TailwindCSS v4. The `new-york` style has a more refined, professional
aesthetic suited for a portfolio. Components are copied into
`src/components/ui/` at install time and never modified directly per
constitution Principle II.

**Required shadcn/ui components**:
- `avatar` — testimonial avatars with initials fallback
- `badge` — technology and domain badges
- `button` — CTAs, form submit, nav actions
- `card` — project cards, value prop cards, intent cards
- `input` — contact form name/email fields
- `label` — form field labels
- `tabs` — project domain filter
- `textarea` — contact form message field
- `separator` — visual dividers

## R5: Framer Motion Dynamic Import Strategy

**Decision**: Create a client-side wrapper component that dynamically
imports Framer Motion. All animated components use this wrapper.

**Rationale**: Constitution Principle VI requires Framer Motion to be
lazy-loaded via `next/dynamic` to avoid blocking the critical rendering
path. Since Framer Motion is ~30kb gzipped, lazy loading prevents it from
appearing in the initial bundle. The wrapper pattern (`ScrollReveal`,
`Hero` entrance) means the animation library loads only when the component
mounts.

**Implementation**:
```typescript
// Components that use Framer Motion are marked 'use client'
// and imported with next/dynamic where they are section-level
// For sub-components within a section, they are already client-side
// when the parent section is dynamically imported
```

## R6: Swiper.js Module Import Strategy

**Decision**: Import only Autoplay, Navigation, Pagination modules.
Dynamic import with `ssr: false`.

**Rationale**: Swiper.js bundles as ~50kb if all modules are imported.
By importing only the required modules (Autoplay for testimonial
auto-scrolling, Navigation for gallery arrows, Pagination for dots),
the bundle is kept under 20kb. Swiper requires browser APIs (DOM
measurement, touch events), so it must be dynamically imported with
`ssr: false`.

**Usage scope**:
- Testimonials section: Autoplay + Pagination
- Project detail screenshots gallery: Navigation + Pagination

## R7: Image Strategy for Static Export

**Decision**: Use `next/image` with `unoptimized: true` in next.config.ts.
All images pre-converted to WebP. Static imports for blur placeholders.

**Rationale**: When `output: 'export'` is set, the Next.js image
optimization API is unavailable (no server). Setting `unoptimized: true`
makes `next/image` render standard `<img>` tags with all the layout
benefits (width/height, lazy loading, srcset) but without server-side
optimization. Since all images are pre-converted to WebP, no runtime
optimization is needed. Static imports (e.g., `import avatar from
'./avatar.webp'`) enable automatic blur placeholder generation at
build time.

## R8: Theme System (Dark/Light Mode)

**Decision**: `next-themes` with `attribute="class"`,
`defaultTheme="system"`, `enableSystem={true}`.

**Rationale**: The `class` strategy adds/removes `dark` class on `<html>`,
which TailwindCSS v4 uses for dark mode variants. `defaultTheme="system"`
respects the visitor's OS preference. The manual toggle persists choice
via localStorage. The `enableSystem` flag allows returning to system-
following mode.

## R9: Google Analytics 4 Integration

**Decision**: `@next/third-parties/google` `GoogleAnalytics` component
in root layout.

**Rationale**: This is the official Next.js integration for GA4. It
loads the gtag script asynchronously with proper performance
optimizations. The GA4 measurement ID is read from
`NEXT_PUBLIC_GA_ID` environment variable.

**Custom events**:
- `cta_click` — { intent: 'hire_ai' | 'hire_po' | 'collaborate' | 'general' }
- `project_filter` — { category: string }
- `timeline_expand` — { event_title: string }
- `resume_download` — {}

## R10: Thai Language Support (Deferred)

**Decision**: Explicitly deferred to Phase 2. Architecture prepared.

**Rationale**: All string content lives in `src/data/` files, not
hardcoded in JSX. This makes future i18n extraction straightforward.
When Thai support is added, the data files can be split into
locale-specific variants (e.g., `timelineEvents.en.ts`,
`timelineEvents.th.ts`) and a locale context can select the
appropriate file. No structural changes to components needed.
