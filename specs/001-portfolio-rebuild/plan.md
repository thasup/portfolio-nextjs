# Implementation Plan: Portfolio Website Rebuild

**Branch**: `001-portfolio-rebuild` | **Date**: 2026-03-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-portfolio-rebuild/spec.md`

## Summary

Rebuild Thanachon Suppasatian's personal portfolio as a statically-exported
Next.js 15 App Router site deployed to Netlify. The site consists of a
single-page scrolling experience at `/` with dedicated static pages for
project case studies (`/projects/[slug]`), an about page (`/about`), and
a contact page (`/contact`). All content is data-driven via typed
TypeScript files in `src/data/`. Styling uses TailwindCSS v4 + shadcn/ui.
Animations use Framer Motion (dynamically imported) for interactive
elements and CSS transitions for micro-interactions. Contact form
submissions use Netlify Forms (no API routes required).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 19, Node 20+
**Primary Dependencies**: Next.js 15 (App Router), TailwindCSS v4,
shadcn/ui (new-york variant), Framer Motion, Swiper.js, React Hook Form,
Zod, next-themes, lucide-react, geist (fonts),
@next/third-parties (GA4)
**Storage**: N/A — static site, no database. Contact form via Netlify
Forms (server-side form processing managed by Netlify, not the app).
**Testing**: Manual Lighthouse CI audits (95+ all categories).
Keyboard navigation manual testing. Responsive viewport testing
(320px–2560px).
**Target Platform**: Static HTML/CSS/JS exported to Netlify CDN.
Modern evergreen browsers: Chrome, Firefox, Safari, Edge (latest 2).
**Project Type**: Static web application (portfolio/personal site)
**Performance Goals**: Lighthouse 95+ (all 4 categories), LCP < 2.5s
on 4G, FID < 100ms, CLS < 0.1.
**Constraints**: Static export only (`output: 'export'`). No server
runtime. No API routes. No middleware. No ISR. No server actions. All
routes must be statically generatable via `generateStaticParams()`.
**Scale/Scope**: 1 primary page, 3 secondary pages, ~6 project detail
pages, ~15 timeline events, ~6 skill clusters, ~5 testimonials. Single
author, no CMS.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Static-First Performance | ✅ PASS | `output: 'export'` in next.config.ts. No API routes. Contact form uses Netlify Forms. All project pages use `generateStaticParams()`. |
| II | TailwindCSS + shadcn/ui Only | ✅ PASS | TailwindCSS v4 CSS-first config. shadcn/ui new-york variant. All legacy deps (react-bootstrap, sass) removed. No inline styles except CSS vars for animation. |
| III | TypeScript Strict Mode | ✅ PASS | All files `.tsx`/`.ts`. `strict: true` in tsconfig. All data types defined in `src/types/`. No `any`. |
| IV | Image Optimization | ✅ PASS | All images use `next/image`. WebP format. Hero avatar uses `priority={true}`. Static imports for blur placeholders. |
| V | Component Hierarchy | ✅ PASS | Follows exact layout: `ui/`, `shared/`, `layout/`, `sections/`, `timeline/`, `projects/`. |
| VI | Animation Philosophy | ✅ PASS | Framer Motion lazy-loaded. Used for: hero entrance, timeline expand, skill fill, project stagger. CSS for: scroll progress, pulse, hover. `useReducedMotion()` on all animated components. |
| VII | Fixed Library Stack | ✅ PASS | All deps from constitution table. No unauthorized additions. Swiper used for project screenshots + testimonials carousel only. |
| VIII | Data-Driven Architecture | ✅ PASS | All content in `src/data/` as typed TS files. Components import from data files or receive props. |
| IX | Accessibility Baseline | ✅ PASS | ARIA labels on all interactive elements. WCAG AA contrast. Keyboard navigation. Focus indicators. |
| X | No External CDN | ✅ PASS | Geist fonts via npm. No Google Fonts URLs. No CDN CSS/JS. Fully offline-capable after load. |

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-rebuild/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── components.md    # Component interface contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, theme, GA4, metadata
│   ├── page.tsx                # Home: composes all sections
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── contact/
│   │   └── page.tsx            # Dedicated contact page
│   └── projects/
│       └── [slug]/
│           └── page.tsx        # Project case study (generateStaticParams)
│
├── components/
│   ├── ui/                     # shadcn/ui generated (never edit)
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── separator.tsx
│   │
│   ├── shared/                 # Reusable primitives
│   │   ├── ScrollReveal.tsx    # Framer Motion scroll-triggered reveal wrapper
│   │   ├── SectionHeader.tsx   # Section title + subtitle + optional label
│   │   ├── TechBadge.tsx       # Technology tag pill
│   │   ├── AnimatedCounter.tsx # Number count-up animation
│   │   ├── SkillBar.tsx        # Proficiency bar with fill animation
│   │   └── DomainBadge.tsx     # Project domain indicator badge
│   │
│   ├── layout/                 # Layout components
│   │   ├── Navbar.tsx          # Sticky nav, section links, theme toggle
│   │   ├── MobileMenu.tsx      # Hamburger menu drawer
│   │   ├── Footer.tsx          # Site footer with social links
│   │   ├── ScrollProgress.tsx  # CSS-based scroll progress bar
│   │   └── ThemeToggle.tsx     # Dark/light mode toggle button
│   │
│   ├── sections/               # Page sections (home page composition)
│   │   ├── Hero.tsx            # Hero section with avatar + CTA
│   │   ├── ValueStrip.tsx      # Quick credibility metrics bar
│   │   ├── Timeline.tsx        # Timeline section wrapper
│   │   ├── Projects.tsx        # Projects grid with filters
│   │   ├── Skills.tsx          # Skills clusters section
│   │   ├── Testimonials.tsx    # Testimonials carousel section
│   │   ├── ValueProp.tsx       # Five value proposition cards
│   │   └── ContactCTA.tsx      # Contact section with form
│   │
│   ├── timeline/               # Timeline sub-components
│   │   ├── TimelineTrack.tsx   # Desktop: horizontal scrollable track
│   │   ├── TimelineNode.tsx    # Individual node on the track
│   │   ├── TimelineDetail.tsx  # Expanded panel below track
│   │   └── TimelineAccordion.tsx # Mobile: vertical accordion
│   │
│   └── projects/               # Project sub-components
│       ├── ProjectCard.tsx     # Grid card for project listing
│       ├── ProjectFilter.tsx   # Domain filter tabs (shadcn Tabs)
│       ├── ProjectGallery.tsx  # Swiper screenshot gallery (detail page)
│       └── ProjectMeta.tsx     # Tech stack + links bar (detail page)
│
├── data/                       # All content data (typed TS)
│   ├── timelineEvents.ts       # Career timeline events
│   ├── projects.ts             # Project portfolio data
│   ├── skills.ts               # Skill clusters and individual skills
│   ├── testimonials.ts         # Testimonial quotes
│   ├── valuePropositions.ts    # Five value statements
│   ├── contactIntents.ts       # Contact intent options
│   ├── navigation.ts           # Nav links configuration
│   └── siteConfig.ts           # Site-wide config (name, title, social)
│
├── hooks/                      # Custom React hooks
│   ├── useScrollSpy.ts         # Active section detection for navbar
│   ├── useInView.ts            # Intersection Observer wrapper
│   └── useReducedMotion.ts     # Re-export/wrapper for Framer Motion
│
├── lib/                        # Utility libraries
│   ├── utils.ts                # shadcn cn() utility
│   └── analytics.ts            # GA4 event helpers
│
├── styles/                     # Global styles
│   └── globals.css             # TailwindCSS v4 imports + design tokens
│
└── types/                      # Type definitions
    ├── timeline.ts             # TimelineEvent, TimelineEventType
    ├── project.ts              # Project, ProjectDomain
    ├── skill.ts                # SkillCluster, Skill
    ├── testimonial.ts          # Testimonial
    ├── valueProposition.ts     # ValueProposition
    └── contact.ts              # ContactIntent, ContactFormData

# Root config files
├── next.config.ts              # output: 'export', image config
├── tailwind.config.ts          # TailwindCSS v4 config (minimal — CSS-first)
├── tsconfig.json               # strict: true, path aliases
├── postcss.config.mjs          # PostCSS with tailwindcss
├── components.json             # shadcn/ui configuration
├── netlify.toml                # Build + publish config
├── .env.local                  # NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_SITE_URL
└── package.json                # All dependencies
```

**Structure Decision**: Next.js App Router with `src/` directory.
Single `src/` tree containing all application code. No backend directory
(static site). The `src/app/` directory uses file-system routing with
the App Router convention. Project detail pages at
`src/app/projects/[slug]/page.tsx` use `generateStaticParams()` for
build-time generation of all six project slugs.

## Design Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | indigo-600 `#4F46E5` | indigo-400 `#818CF8` | CTAs, links, active states |
| `--accent` | amber-500 `#F59E0B` | amber-400 `#FBBF24` | Featured badges, highlights |
| `--background` | white `#FFFFFF` | slate-950 `#0F172A` | Page background |
| `--foreground` | slate-900 `#0F172A` | slate-50 `#F8FAFC` | Primary text |
| `--muted` | slate-100 `#F1F5F9` | slate-800 `#1E293B` | Card backgrounds, borders |
| `--muted-foreground` | slate-500 `#64748B` | slate-400 `#94A3B8` | Secondary text |

## Component Interfaces

### Layout Components

**Navbar**
- Props: none (reads navigation data from `src/data/navigation.ts`)
- State: active section (from `useScrollSpy`), mobile menu open/close
- Behavior: sticky top, transparent → solid on scroll, active section highlight, smooth scroll to anchor sections, full href for /about, /contact pages
- Children: NavLinks, ThemeToggle, MobileMenu

**ScrollProgress**
- Props: none
- State: scroll percentage (CSS scaleX, no JS except initial binding)
- Behavior: fixed top bar, fills left-to-right as user scrolls

**ThemeToggle**
- Props: none
- State: current theme from next-themes `useTheme()`
- Behavior: toggles between light/dark, persists via localStorage

**Footer**
- Props: none (reads from `src/data/siteConfig.ts`)
- Behavior: social links (LinkedIn, GitHub, Email), copyright

### Shared Components

**ScrollReveal**
- Props: `children: ReactNode`, `delay?: number`, `direction?: 'up' | 'left' | 'right'`
- Behavior: Framer Motion wrapper, fades in on scroll enter, respects `useReducedMotion()`

**SectionHeader**
- Props: `title: string`, `subtitle?: string`, `label?: string`, `align?: 'left' | 'center'`
- Behavior: renders h2 + optional subtitle with consistent spacing

**TechBadge**
- Props: `name: string`, `variant?: 'default' | 'outline'`
- Behavior: renders shadcn Badge with technology name

**SkillBar**
- Props: `name: string`, `level: number` (0–100), `icon?: string`
- Behavior: animated fill bar triggered by `useInView`, respects reduced motion

**DomainBadge**
- Props: `domain: ProjectDomain`
- Behavior: color-coded badge per domain (AI=indigo, Web3=purple, E-commerce=emerald, Frontend=sky)

### Section Components

**Hero**
- Props: none (reads from `src/data/siteConfig.ts`)
- Behavior: name + title + tagline, avatar with `priority={true}`, two CTAs ("View My Work" → #projects, "Get In Touch" → /contact), Framer Motion entrance animation

**ValueStrip**
- Props: none
- Behavior: horizontal bar of quick stats (4+ years, 6 projects shipped, 3 domains). AnimatedCounter for numbers.

**Timeline**
- Props: none (reads from `src/data/timelineEvents.ts`)
- Behavior:
  - Desktop (≥768px): `TimelineTrack` — horizontal scrollable track. Click node → single expanded `TimelineDetail` panel below track. Single active state.
  - Mobile (<768px): `TimelineAccordion` — vertical, single-open accordion. Each item expands below its header.
  - Framer Motion for expand/collapse animations.

**Projects**
- Props: none (reads from `src/data/projects.ts`)
- Behavior: `ProjectFilter` (shadcn Tabs, single-select, default "All") + grid of `ProjectCard`. Cards link to `/projects/[slug]`. Featured projects (AI Event Platform, Tangier DAO) have visual emphasis. Framer Motion `AnimatePresence` + `layout` for filter transitions.

**Skills**
- Props: none (reads from `src/data/skills.ts`)
- Behavior: grid of skill clusters. Each cluster: title, narrative, list of `SkillBar`. AI & LLM cluster first + visually emphasized. Fill animations on scroll.

**Testimonials**
- Props: none (reads from `src/data/testimonials.ts`)
- Behavior: Swiper carousel with Autoplay + Pagination modules. `ssr: false` dynamic import. shadcn Avatar with AvatarFallback (initials) for missing images.

**ValueProp**
- Props: none (reads from `src/data/valuePropositions.ts`)
- Behavior: 5 value cards, each with lucide icon + title + description + optional cross-ref anchor link. ScrollReveal stagger.

**ContactCTA**
- Props: none (reads from `src/data/contactIntents.ts`)
- Behavior: 4 intent option cards (shadcn Card), selecting one reveals the form with tailored heading/placeholder. Form uses React Hook Form + Zod validation. Submits via Netlify Forms (`netlify` attribute, hidden `form-name` input). Social links row.

### Project Detail Page Components

**ProjectGallery**
- Props: `images: string[]` (WebP paths)
- Behavior: Swiper carousel with Navigation + Pagination modules. `ssr: false`.

**ProjectMeta**
- Props: `techStack: string[]`, `liveUrl?: string`, `sourceUrl?: string`
- Behavior: tech badges row + external link buttons

## Animation Budget

| Element | Engine | Trigger | Reduced Motion |
|---------|--------|---------|----------------|
| Hero entrance | Framer Motion (dynamic) | Page load (once) | Instant render |
| Timeline node expand/collapse | Framer Motion | Click | Instant expand |
| Skill bar fill | Framer Motion | Scroll enter (once) | Instant fill |
| Project card stagger | Framer Motion | Filter change / scroll | Instant show/hide |
| Project filter transitions | Framer Motion `AnimatePresence` | Filter click | Instant swap |
| ScrollReveal (all sections) | Framer Motion | Scroll enter (once) | Instant render |
| Scroll progress bar | CSS `scaleX` | Scroll event (CSS) | Still visible |
| Badge pulse dot | CSS `animate-pulse` | Always (CSS) | No animation |
| Button hover/active | CSS `transition` | Hover/active | No animation |
| Shimmer loading | CSS `@keyframes` | Loading state | No animation |

## Build Configuration Files

### next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Netlify-friendly URLs
}

export default nextConfig
```

### tailwind.config.ts

Minimal — TailwindCSS v4 uses CSS-first configuration.
Only needed if extending theme beyond what CSS `@theme` supports.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
  ],
}

export default config
```

### src/styles/globals.css

```css
@import 'tailwindcss';

@theme {
  --color-primary: #4F46E5;
  --color-primary-foreground: #FFFFFF;
  --color-accent: #F59E0B;
  --color-background: #FFFFFF;
  --color-foreground: #0F172A;
  --color-muted: #F1F5F9;
  --color-muted-foreground: #64748B;
  --color-card: #FFFFFF;
  --color-card-foreground: #0F172A;
  --color-border: #E2E8F0;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

.dark {
  --color-primary: #818CF8;
  --color-primary-foreground: #FFFFFF;
  --color-accent: #FBBF24;
  --color-background: #0F172A;
  --color-foreground: #F8FAFC;
  --color-muted: #1E293B;
  --color-muted-foreground: #94A3B8;
  --color-card: #1E293B;
  --color-card-foreground: #F8FAFC;
  --color-border: #334155;
}
```

### components.json (shadcn/ui)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Environment Variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_GA_ID` | Yes | `G-XXXXXXXXXX` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://thanachon.me` | OG meta, canonical URLs |
| `RESEND_API_KEY` | Optional | `re_xxxxx` | Only if using Netlify Function for custom email formatting |

## Dependencies (package.json)

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | `^15.x` | Framework |
| `react` | `^19.x` | UI library |
| `react-dom` | `^19.x` | DOM renderer |
| `framer-motion` | `^11.x` | Animations (dynamically imported) |
| `swiper` | `^11.x` | Carousel (project gallery, testimonials) |
| `react-hook-form` | `^7.x` | Form state management |
| `@hookform/resolvers` | `^3.x` | RHF Zod resolver |
| `zod` | `^3.x` | Form schema validation |
| `next-themes` | `^0.4.x` | Dark/light mode |
| `lucide-react` | `^0.4x` | Icons |
| `geist` | `^1.x` | Geist Sans + Mono fonts |
| `@next/third-parties` | `^15.x` | GA4 integration |

### Dev

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `^5.x` | Type checking |
| `@types/node` | `^20+` | Node type defs |
| `@types/react` | `^19.x` | React type defs |
| `@types/react-dom` | `^19.x` | ReactDOM type defs |
| `tailwindcss` | `^4.x` | CSS framework |
| `@tailwindcss/postcss` | `^4.x` | PostCSS plugin for TW4 |
| `eslint` | `^9.x` | Linting |
| `eslint-config-next` | `^15.x` | Next.js ESLint config |

### Removed (legacy)

| Package | Replacement |
|---------|-------------|
| `react-bootstrap` | shadcn/ui |
| `sass` | TailwindCSS v4 |
| `@vercel/analytics` | @next/third-parties GA4 |
| `@vercel/speed-insights` | Lighthouse CI |
| `typed.js` | Framer Motion |
| `autoprefixer` | TailwindCSS v4 (built-in) |

## Complexity Tracking

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Horizontal timeline on desktop + accordion on mobile | Spec requires the timeline to feel "alive, not a static list." A horizontal track communicates progression and allows visual scanning of the full career at a glance. | A simple vertical list would work but would not meet the "interactive narrative" requirement from US2. |
| Separate `/projects/[slug]` pages | Spec requires "full case study content, screenshots gallery, and challenges/solutions narrative" per project — too much content for a modal overlay. | A modal/sheet overlay was considered but rejected because the content depth (multiple sections, gallery) would overflow and break mobile UX. |
| Swiper.js for two use cases | Testimonials carousel + project screenshot gallery both need touch/swipe, autoplay, and a11y. Using a single library for both avoids bundling two carousel solutions. | CSS scroll-snap alone lacks autoplay, navigation dots, and reliable keyboard control across browsers. |
