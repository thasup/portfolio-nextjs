<!--
  Sync Impact Report
  ────────────────────────────────────────────────────
  Version change: 2.0.0 → 2.1.0 (60-Second Impact Enhancement)
  
  Modified principles:
    - XVI. Analytics Event Tracking → Enhanced with granular tracking requirements
    - XVII. First Impression Standards → Expanded with 60-second browsing focus and Apple-quality benchmarks
    - XIII. Timeline Is A Vertical Scroll Narrative → Clarified Apple-quality expectations
    - XIV. Centralized Modal System → Strengthened zero-redirect policy
  
  Enhanced focus areas:
    - 60-second maximum value delivery window
    - Apple product website quality benchmark
    - Comprehensive analytics for every interaction
    - Bilingual excellence for Thai and international audiences
    - Attention capture and retention strategies
  
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

| Concern         | Library / Tool                                                |
|-----------------|---------------------------------------------------------------|
| Framework       | Next.js 15, App Router                                        |
| Styling         | TailwindCSS v4 + shadcn/ui                                    |
| Animation       | Framer Motion (lazy-loaded via dynamic import)                |
| Carousel        | Swiper.js (only required modules imported)                    |
| Forms           | React Hook Form + Zod + Resend                                |
| Analytics       | Google Analytics 4 via `@next/third-parties/google`          |
| Theme           | next-themes                                                   |
| Icons           | lucide-react only (no heroicons, no react-icons)              |
| Fonts           | Geist Sans/Mono (`geist`), Noto Sans Thai/Sarabun (`next/font/google`) |
| i18n            | next-intl                                                     |
| Hosting         | Vercel (hybrid static rendering, `vercel.json`)               |

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

### XII. Bilingual Content Architecture (TH/EN) — Excellence for Both Audiences

The portfolio MUST provide **world-class experiences in both Thai and English** to serve Thai and international audiences equally well.

**Language support requirements**:

- **English is the default language** (`lang="en"` on root HTML element) for international reach.
- **URL structure**: `/en/...` and `/th/...` with automatic redirect from `/` to `/en/`.
- **100% translation coverage**: All user-facing strings, navigation, content, CTAs, and microcopy must have both EN and TH translations.
- **Content files**: `src/messages/en.json` and `src/messages/th.json` for i18n strings.
- **Content parity**: Thai and English versions must deliver equivalent value — not just literal translations, but culturally adapted messaging that resonates with each audience.

**Typography for Thai script**:

- **Font**: Thai script requires Noto Sans Thai or Sarabun from Google Fonts — self-host via `next/font/google` with `subsets: ['thai', 'latin']`.
- **Line-height**: Minimum 1.8 when `lang="th"` is active (Thai script requires more vertical spacing).
- **Font fallback chain**: Ensure graceful degradation if web fonts fail to load.

**Localization quality standards**:

- **EN copy**: Direct, confident, international professional tone. Optimized for global tech recruiters and international companies.
- **TH copy**: Professional yet approachable (ภาษาทางการที่ฟังดูเป็นธรรมชาติ). Optimized for Thai companies and Thai nationals working abroad.
- **Cultural adaptation**: Adjust examples, references, and social proof based on audience (e.g., TOEIC score more relevant to Thai audience, GitHub contributions more relevant to international audience).

**Language toggle UX**:

- Prominent language switcher in navigation (flags or TH/EN labels).
- Language preference persists in localStorage.
- Analytics tracking on language toggle to understand audience split.

### XIII. Timeline Is A Vertical Scroll Narrative — Apple-Quality Standard

The timeline IS the centerpiece of the portfolio — a full-screen, cinematic vertical scroll experience that rivals Apple product marketing pages.

- **Each timeline event is a "scene"** — minimum 80vh tall on desktop, full-width, with carefully choreographed scroll-triggered animations.
- **Apple-quality parallax**: Use Framer Motion `useScroll` + `useTransform` for smooth parallax depth, reveal effects, and progressive content disclosure as user scrolls.
- **Visual storytelling hierarchy**: Text, images, and achievements reveal in coordinated sequences that guide the eye and maintain engagement.
- **Persistent vertical progress spine** runs down the left side with animated fill as user progresses through timeline.
- **Year markers** float sticky on the right side, updating contextually based on scroll position.
- **Performance constraint**: Despite rich animations, entire timeline section MUST be server-side rendered for SEO, with Framer Motion progressively enhancing the static content without blocking initial paint.
- **60-second constraint**: First 3-5 timeline scenes must communicate core career progression and unique value within 20 seconds of scrolling.

### XIV. Centralized Modal System — Zero-Redirect Philosophy

**No external navigation.** Zero redirects out. Every piece of supplementary information MUST render within the site to maximize attention retention.

- **All supplementary content** (project details, timeline deep-dives, certificates, case studies, testimonials) renders inside a centralized Modal component.
- **Full-screen immersive overlay** — minimum 80vw × 80vh on desktop, 100vw × 100vh on mobile.
- **Rich content support**: The Modal must elegantly display text, images, videos, code snippets, metrics, galleries — whatever tells the story best.
- Built on shadcn Dialog with custom full-screen variant.
- Supported content types: `'project'`, `'timeline-event'`, `'certificate'`, `'testimonial'`, `'case-study'`, `'skill-detail'`.
- **URL hash integration**: Modal state is reflected in URL hash (e.g., `#project-ai-event-platform`) for shareability and browser history.
- **Attention retention strategy**: Keep visitors engaged within the portfolio ecosystem rather than losing them to external links.
- Exception: Social media icons and resume download are permitted external actions, but must fire analytics events.

### XV. Ultra-Fast Performance

Targets are non-negotiable:

- Lighthouse Performance: 100 desktop, 95+ mobile.
- LCP: < 1.2s (desktop), < 2.0s (mobile).
- CLS: 0.00 (reserve all image space with aspect-ratio).
- INP: < 100ms.
- TTFB: < 200ms (Vercel Edge Network CDN).
- Bundle: < 120kb initial JS (gzipped), heavy sections lazy-loaded.

### XVI. Analytics Event Tracking — Comprehensive Granular Insights

**Every interaction, every scroll, every hesitation must be tracked.** The portfolio is a data-driven product.

All analytics events MUST be typed GA4 custom events defined in `src/lib/analytics.ts` with consistent naming and parameter schemas.

**Required tracking events** (non-exhaustive):

- **Navigation**: `PAGE_VIEW`, `NAV_LINK_CLICK`, `LANGUAGE_TOGGLE`, `THEME_TOGGLE`, `SCROLL_TO_SECTION`
- **Hero interactions**: `HERO_CTA_CLICK`, `HERO_SOCIAL_CLICK`, `HERO_ANIMATION_COMPLETE`
- **Timeline engagement**: `TIMELINE_SCENE_ENTER`, `TIMELINE_SCENE_EXIT`, `TIMELINE_PROGRESS_25`, `TIMELINE_PROGRESS_50`, `TIMELINE_PROGRESS_75`, `TIMELINE_PROGRESS_100`, `TIMELINE_SCENE_DWELL_TIME`
- **Project exploration**: `PROJECT_FILTER_CHANGE`, `PROJECT_CARD_HOVER`, `PROJECT_CARD_CLICK`, `PROJECT_GALLERY_NAVIGATE`
- **Modal interactions**: `MODAL_OPEN`, `MODAL_CLOSE`, `MODAL_CONTENT_SCROLL`, `MODAL_CTA_CLICK`, `MODAL_DWELL_TIME`
- **Conversion signals**: `RESUME_DOWNLOAD`, `CONTACT_FORM_OPEN`, `CONTACT_FORM_SUBMIT`, `CONTACT_FORM_SUCCESS`, `CONTACT_FORM_ERROR`
- **Engagement depth**: `SCROLL_DEPTH_25`, `SCROLL_DEPTH_50`, `SCROLL_DEPTH_75`, `SCROLL_DEPTH_100`, `TIME_ON_PAGE_10S`, `TIME_ON_PAGE_30S`, `TIME_ON_PAGE_60S`, `RETURN_VISITOR`
- **Exit intent**: `SCROLL_UP_FAST`, `MOUSE_LEAVE_VIEWPORT`, `TAB_BLUR`

**Event naming**: All event names are `SCREAMING_SNAKE_CASE` string constants.

**Event parameters**: Every event must include contextual metadata (e.g., `section_id`, `project_slug`, `language`, `scroll_position`, `time_elapsed`).

**GA4 dashboard goal**: Raw analytics data must enable answering: "Where do visitors spend time?", "What content drives engagement?", "Where do they drop off?", "Which CTAs convert?", "Do TH vs EN visitors behave differently?"

### XVII. First Impression Standards — The 60-Second Impact Rule

**The entire portfolio MUST deliver maximum value and create lasting impact within 60 seconds of browsing.** This is the critical window for mass audiences.

**Above-the-fold requirements** (first 5 seconds):

- **Immediately communicate WHO, WHAT, and WHY** — visitor must instantly understand: "This is [Name], a [Role] who solves [Problem] with [Unique Approach]."
- **Single dominant visual hierarchy** — one primary message, supported by secondary elements, never competing.
- **Maximum 2 CTAs** above fold — one primary (e.g., "View Work"), one secondary (e.g., "Contact").
- **Hero animations complete in < 1.2s total** — fast enough to delight, not annoy.
- **Social proof signal** above fold — credibility markers (e.g., TOEIC 915, AWS Certified, Years of Experience, Notable Companies).

**60-second browsing path** (15-60 seconds):

- **Within 15 seconds**: Visitor should grasp core expertise and unique value proposition.
- **Within 30 seconds**: Visitor should see compelling project examples or timeline highlights that demonstrate capability.
- **Within 45 seconds**: Visitor should discover proof points (achievements, metrics, testimonials) that build trust.
- **Within 60 seconds**: Visitor should either (a) take conversion action (contact, download resume), (b) decide to explore deeper (scroll timeline, open project modal), or (c) leave with positive memorable impression.

**Attention retention strategies**:

- **Progressive disclosure**: Don't overwhelm — reveal information in digestible chunks as user scrolls.
- **Visual magnetism**: High-quality imagery, smooth animations, and professional polish on par with Apple product pages.
- **Curiosity hooks**: Each section should tease the next (e.g., "Scroll to see how I built X").
- **Micro-interactions**: Subtle hover effects, scroll-triggered reveals, and responsive feedback that reward exploration.

**Apple-quality benchmark**: Every aspect of the portfolio should feel as polished, intentional, and performant as Apple product marketing pages. This means:

- Deliberate use of whitespace.
- Typography hierarchy that guides the eye.
- Animations that enhance (never distract from) the narrative.
- Performance so smooth it feels native.
- Attention to every pixel, every transition, every detail.

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

**Version**: 2.1.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-09
