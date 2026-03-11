# Tasks: Portfolio Website Rebuild

**Input**: Design documents from `/specs/001-portfolio-rebuild/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No automated tests requested. Validation via manual Lighthouse audits, keyboard navigation testing, and responsive viewport testing.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Next.js App Router with `src/` directory)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project, install dependencies, configure build tooling. Must complete before any component work.

- [x] T001 Remove legacy files and dependencies — delete `styles/`, `components/`, `data/`, `hooks/`, `utils/`, `app/` directories and remove `react-bootstrap`, `sass`, `@vercel/analytics`, `@vercel/speed-insights`, `typed.js`, `autoprefixer` from package.json. Keep `.git/`, `.specify/`, `specs/`, `public/`, `.gitignore`, `.npmrc`, `.nvmrc`, `README.md`

- [x] T002 Initialize Next.js 15 project — run `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack` in the existing repo root. Accept overwrite prompts for package.json, tsconfig.json, next.config.ts. Verify `src/app/` directory is created

- [x] T003 Configure static export — edit `next.config.ts`: set `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. Add `experimental: { optimizePackageImports: ['framer-motion', 'lucide-react', 'swiper'] }`

- [x] T004 Install production dependencies — run `npm install framer-motion swiper react-hook-form zod @hookform/resolvers next-themes lucide-react geist @next/third-parties clsx tailwind-merge`

- [x] T005 Install dev dependencies — run `npm install -D prettier prettier-plugin-tailwindcss`

- [x] T006 Initialize shadcn/ui — run `npx shadcn@latest init` with style: new-york, base color: neutral, CSS variables: yes. Then install required components: `npx shadcn@latest add avatar badge button card input label tabs textarea separator sheet tooltip accordion scroll-area`

- [x] T007 [P] Configure design tokens in `src/styles/globals.css` — write complete CSS file with `@import 'tailwindcss'`, `@theme {}` block defining all color tokens (primary indigo, accent amber, background, foreground, muted, card, border), font variables (`--font-sans`, `--font-mono`), and `.dark` class overrides per the Design Tokens table in plan.md. Add custom utilities: `--section-gap`, `--container-xl`, glass effect classes

- [x] T008 [P] Configure `tailwind.config.ts` — set `darkMode: 'class'`, `content: ['./src/**/*.{ts,tsx}']`. Add custom animation keyframes: `fade-up`, `fade-in`, `shimmer`. Extend theme with brand color tokens bridging shadcn CSS variables

- [x] T009 [P] Configure `tsconfig.json` — ensure `strict: true`, `"paths": {"@/*": ["./src/*"]}`, `allowJs: false`, `incremental: true`, `jsx: "preserve"`, `plugins: [{"name": "next"}]`

- [x] T010 [P] Configure `postcss.config.mjs` — set up PostCSS with `@tailwindcss/postcss` plugin for TailwindCSS v4

- [x] T011 [P] Write `netlify.toml` — configure build command (`npm run build`), publish directory (`out`), security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy), cache headers for `/_next/static/*` (immutable, 1 year) and `/images/*` (1 week)

- [x] T012 [P] Create `.env.local.example` — list all required env vars: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`, `NEXT_PUBLIC_SITE_URL=https://thanachon.me`, `RESEND_API_KEY=re_xxxxx (optional)`

- [x] T013 Create directory structure — create empty directories: `src/components/shared/`, `src/components/layout/`, `src/components/sections/`, `src/components/timeline/`, `src/components/projects/`, `src/data/`, `src/hooks/`, `src/lib/`, `src/types/`, `public/images/projects/`, `public/images/testimonials/`

**Checkpoint**: Project builds with `npm run build` and exports static files to `out/`. All config files present.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions, data files, utility functions, and custom hooks that ALL user stories depend on. MUST be complete before any component work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Type Definitions

- [x] T014 [P] Write `src/types/timeline.ts` — export `TimelineEventType` union (`'work' | 'project' | 'education' | 'achievement'`) and `TimelineEvent` interface with all fields per data-model.md: id, date, sortDate, title, company, type, summary, description, impact, skills, icon

- [x] T015 [P] Write `src/types/project.ts` — export `ProjectDomain` union (`'ai' | 'web3' | 'ecommerce' | 'frontend'`), `DOMAIN_LABELS` map (`{ ai: 'AI & LLM', web3: 'Web3', ecommerce: 'E-Commerce', frontend: 'Frontend' }`), and `Project` interface with all fields per data-model.md: slug, title, domain, tagline, problemSummary, problem, approach, features, techStack, outcomes, challenges, heroImage, screenshots, featured, liveUrl, sourceUrl, year

- [x] T016 [P] Write `src/types/skill.ts` — export `Skill` interface (name, icon, level) and `SkillCluster` interface (id, name, narrative, order, emphasized, skills)

- [x] T017 [P] Write `src/types/testimonial.ts` — export `Testimonial` interface (id, quote, authorName, authorRole, relationship, authorAvatar)

- [x] T018 [P] Write `src/types/valueProposition.ts` — export `ValueProposition` interface (id, title, description, icon, crossRef)

- [x] T019 [P] Write `src/types/contact.ts` — export `ContactIntent` interface (key, label, heading, placeholder, icon) and `ContactFormData` interface (name, email, intent, message). Export Zod schema `contactFormSchema` for form validation

### Data Files

- [x] T020 [P] Write `src/data/siteConfig.ts` — export `siteConfig` object with: name ("Thanachon Supasatian"), title ("Senior Software Engineer"), tagline, location ("Bangkok, Thailand"), email, linkedinUrl, githubUrl, avatarImage path, resumeUrl, siteUrl from env var

- [x] T021 [P] Write `src/data/navigation.ts` — export `NavigationItem` interface (label, href, isAnchor) and `navigationItems` array with 6 entries: Timeline (/#timeline), Projects (/#projects), Skills (/#skills), Testimonials (/#testimonials), About (/about), Contact (/contact)

- [x] T022 [P] Write `src/data/timelineEvents.ts` — import `TimelineEvent` type, export `timelineEvents` array with ~10–15 career events covering: MAQE join, AP Thai project, MAQE website rebuild, B2B catalog, token gating, AWS certification, Tangier DAO, AI Event Platform, LangChain RAG exploration, Senior Engineer promotion. Each event has complete id, date, sortDate, title, company, type, summary, description (~2–4 sentences), impact, skills[], and optional icon

- [x] T023 [P] Write `src/data/projects.ts` — import `Project` type, export `projects` array with 6 projects: `ai-event-platform` (domain: ai, featured: true), `tangier-dao` (domain: web3, featured: true), `token-gating` (domain: web3), `ap-thai` (domain: ecommerce), `b2b-catalog` (domain: ecommerce), `maqe-website` (domain: frontend). Each has complete slug, title, tagline, problemSummary, problem, approach, features[], techStack[], outcomes, challenges, heroImage, screenshots[], featured, liveUrl/sourceUrl, year

- [x] T024 [P] Write `src/data/skills.ts` — import `SkillCluster` type, export `skillClusters` array with 4 clusters ordered: (1) AI & LLM (emphasized: true, skills: Python, LangChain, OpenAI API, RAG, Prompt Engineering, etc.), (2) Frontend Engineering (React, Next.js, TypeScript, TailwindCSS, etc.), (3) Backend & Infrastructure (Node.js, PostgreSQL, AWS, Docker, etc.), (4) Web3 & Blockchain (Solidity, Ethers.js, IPFS, etc.). Each cluster has narrative sentence and skills with name + level (0–100)

- [x] T025 [P] Write `src/data/testimonials.ts` — import `Testimonial` type, export `testimonials` array with 5 placeholder testimonials in the correct tone. Each has: id, quote (≥50 chars, specific and human), authorName, authorRole, relationship, authorAvatar (null for now). Add file-level comment: "// PLACEHOLDER: Replace with real testimonials from MAQE colleagues"

- [x] T026 [P] Write `src/data/valuePropositions.ts` — import `ValueProposition` type, export `valuePropositions` array with exactly 5 entries: (1) "Ships Production AI" → crossRef to ai-event-platform, (2) "Thinks Product-First" → crossRef to #timeline, (3) "Operates Full-Stack" → crossRef to #skills, (4) "Adopts Tech Fast" → crossRef to #projects, (5) "Building Toward Founder" → no crossRef. Each has title, description (~2 sentences), lucide icon name, optional crossRef

- [x] T027 [P] Write `src/data/contactIntents.ts` — import `ContactIntent` type, export `contactIntents` array with 4 entries: hire_ai ("Hire as AI Engineer", Cpu icon), hire_po ("Hire as Product Owner", Target icon), collaborate ("Collaborate on SaaS", Handshake icon), general ("General Inquiry", MessageSquare icon). Each has key, label, heading, placeholder, icon

### Utilities & Hooks

- [x] T028 [P] Write `src/lib/utils.ts` — export `cn()` function using clsx + tailwind-merge (standard shadcn pattern). Export `formatDate(isoDate: string): string` helper for timeline dates

- [x] T029 [P] Write `src/lib/analytics.ts` — export `trackEvent(name: string, params?: Record<string, string>): void` function wrapping `window.gtag('event', ...)`. Handle missing gtag gracefully (dev mode, ad blockers). Define event name constants: `CTA_CLICK`, `PROJECT_FILTER`, `TIMELINE_EXPAND`, `RESUME_DOWNLOAD`

- [x] T030 [P] Write `src/hooks/useScrollSpy.ts` — export `useScrollSpy(sectionIds: string[]): string | null` hook using Intersection Observer with threshold array. Returns the id of the currently most visible section. Updates on scroll

- [x] T031 [P] Write `src/hooks/useInView.ts` — export `useInView(options?: IntersectionObserverInit): [ref, inView]` hook wrapping IntersectionObserver. Returns ref to attach and boolean for visibility. Triggers once by default (for one-shot animations)

- [x] T032 [P] Write `src/hooks/useReducedMotion.ts` — export `useReducedMotion(): boolean` hook using `matchMedia('(prefers-reduced-motion: reduce)')`. Returns true if user prefers reduced motion

**Checkpoint**: All types compile with `npx tsc --noEmit`. All data files import correctly. Hooks and utilities are independently usable.

---

## Phase 3: User Story 1 — First Impression & Identity (Priority: P1) 🎯 MVP

**Goal**: Visitor lands on the site and within 10 seconds understands Thanachon's professional identity. Navbar, theme toggle, scroll progress, hero section, and footer are fully functional.

**Independent Test**: Load site on desktop and mobile. Verify hero content, theme toggle, nav links scroll to anchors, scroll progress bar, responsive mobile menu. All sections show placeholder `<section id="...">` blocks.

### Layout Components

- [x] T033 [P] [US1] Build `src/components/layout/ThemeToggle.tsx` — client component using `next-themes` `useTheme()`. Sun icon (Framer Motion rotate) in dark mode, Moon icon in light mode. Button with `aria-label="Toggle theme"`. Handles mounted state to avoid hydration mismatch

- [x] T034 [P] [US1] Build `src/components/layout/ScrollProgress.tsx` — client component. Fixed bar at very top of viewport (z-50, h-1). Uses Framer Motion `useScroll()` + `useSpring()` for smooth scaleX. Primary color background. `aria-hidden="true"`

- [x] T035 [P] [US1] Build `src/components/layout/MobileMenu.tsx` — client component using shadcn Sheet (side: "right"). Props: `isOpen: boolean`, `onClose: () => void`. Renders nav links from `navigation.ts`. Closes on link click, overlay click. Focus trap. `role="dialog"`, `aria-modal="true"`

- [x] T036 [US1] Build `src/components/layout/Navbar.tsx` — client component. Sticky `<nav>` with `z-40`. Transparent background at top, solid with `backdrop-blur` on scroll (use scroll event listener or Intersection Observer on hero). Renders desktop nav links + ThemeToggle + CTA buttons ("Resume" download, "Hire Me" → /contact). Mobile: hamburger button → opens MobileMenu. Uses `useScrollSpy` for active section highlighting. `aria-label="Main navigation"`

- [x] T037 [P] [US1] Build `src/components/layout/Footer.tsx` — renders site name, role from `siteConfig`, nav links (same as Navbar), social links row (LinkedIn, GitHub, Email with lucide icons), copyright line with current year. Links open in new tab with `rel="noopener noreferrer"`

### Shared Primitives

- [x] T038 [P] [US1] Build `src/components/shared/ScrollReveal.tsx` — client component wrapping children in Framer Motion `motion.div`. Props: `children`, `delay` (default 0), `direction` (default 'up'), `className`. Uses `useInView` (triggerOnce). Respects `useReducedMotion()` — if true, renders immediately. Variants: fade + translate from direction, opacity 0→1

- [x] T039 [P] [US1] Build `src/components/shared/SectionHeader.tsx` — renders: optional small uppercase label span, h2 title, optional subtitle paragraph. Props: `title`, `subtitle?`, `label?`, `align` (default 'center'). Uses consistent spacing classes

- [x] T040 [P] [US1] Build `src/components/shared/AnimatedCounter.tsx` — client component using Framer Motion `useMotionValue`, `useTransform`, `animate`. Props: `end`, `duration` (default 2), `suffix?`, `prefix?`. Counts from 0 to `end` on `useInView`. Respects reduced motion (shows final value immediately)

### Hero Section

- [x] T041 [US1] Build `src/components/sections/Hero.tsx` — client component. Full viewport height (`min-h-screen`). Reads from `siteConfig`. Layout: two-column on desktop (text left, avatar right), stacked on mobile. Elements: name (h1), animated role titles (cycle through "Senior Software Engineer", "AI Engineer", "Product Thinker" using Framer Motion text animation — replaces typed.js), tagline paragraph, availability status badge (green dot + "Open to opportunities"), two CTA buttons (shadcn Button: "View My Work" primary → smooth scroll to #projects, "Get In Touch" outline → /contact), social icon row (LinkedIn, GitHub, Email). Avatar: `next/image` with `priority={true}`, static import for blur, decorative gradient ring. Background: subtle dot-grid pattern via CSS. Framer Motion: staggered fade-up entrance for text elements, scale-in for avatar. Scroll indicator arrow at bottom

### Value Strip

- [x] T042 [US1] Build `src/components/sections/ValueStrip.tsx` — horizontal bar below hero. 3 `AnimatedCounter` cards: "4+" years experience, "6" production projects, "3" industry domains (AI, Web3, E-commerce). Subtle background differentiation from hero. ScrollReveal wrapper

### Root Layout & Home Page

- [x] T043 [US1] Write `src/app/layout.tsx` — import Geist Sans + Geist Mono from `geist` package, set CSS variables `--font-geist-sans`, `--font-geist-mono` on body. Wrap children in `ThemeProvider` from next-themes (attribute: "class", defaultTheme: "system", enableSystem: true). Add `GoogleAnalytics` from `@next/third-parties/google` with `NEXT_PUBLIC_GA_ID`. Include Navbar, Footer, ScrollProgress. Export `metadata` with title template `"%s | Thanachon Supasatian"`, default title, description, Open Graph tags (title, description, url, siteName, images, type), Twitter card meta

- [x] T044 [US1] Write `src/app/page.tsx` — compose home page with `<section>` wrappers: `<section id="hero">` + Hero, ValueStrip, then placeholder sections for timeline, projects, skills, testimonials, valueprop, contact (each as `<section id="..." className="min-h-[50vh]">` with SectionHeader placeholder). This allows nav links to work even before other user stories are implemented

**Checkpoint**: Site loads at `/`. Hero displays with avatar, name, roles, CTAs. Navbar is sticky with active section highlighting. Theme toggles between light/dark. Mobile menu works. Scroll progress bar visible. Footer renders. Placeholder sections exist for all nav targets. `npm run build` produces static export.

---

## Phase 4: User Story 2 — Interactive Career Timeline (Priority: P1)

**Goal**: Visitors can scan Thanachon's career at a glance and drill into any milestone for the full story.

**Independent Test**: Navigate to #timeline. Verify all events render chronologically. Click a node — detail panel expands. Click another — first collapses, new one opens. Test on desktop (horizontal track) and mobile (vertical accordion). Verify scroll animations fire. Test keyboard navigation.

### Timeline Sub-Components

- [x] T045 [P] [US2] Build `src/components/timeline/TimelineNode.tsx` — client component. Props: `event: TimelineEvent`, `isActive: boolean`, `onClick: () => void`. Renders: type icon (mapped from event.type to lucide icon), date, title. Visual state: default (muted) vs active (primary color, scale). Framer Motion scale/opacity animation on active state change. ARIA: `role="button"`, `aria-expanded={isActive}`, `tabIndex={0}`, keyboard Enter/Space triggers onClick

- [x] T046 [P] [US2] Build `src/components/timeline/TimelineDetail.tsx` — client component. Props: `event: TimelineEvent | null`. Renders when event is not null: 3-column grid (desktop) / stacked (mobile) with "What I Did" (description), "What I Learned" (skills as TechBadge list), "Impact" (impact statement). Colored left border matching event type. Close button. Framer Motion `AnimatePresence` for enter (fade-up + height expand) and exit (fade-out + height collapse) animation

- [x] T047 [US2] Build `src/components/timeline/TimelineTrack.tsx` — client component (desktop only, hidden below md breakpoint). Props: `events: TimelineEvent[]`, `activeId: string | null`, `onSelectEvent: (id: string) => void`. Renders horizontal scrollable container with connecting line. Maps events to TimelineNode components along the line. Scroll buttons (ChevronLeft, ChevronRight) appear on overflow edges. ARIA: `role="tablist"`, nodes have `role="tab"`. Keyboard: Left/Right arrow keys navigate between nodes

- [x] T048 [US2] Build `src/components/timeline/TimelineAccordion.tsx` — client component (mobile only, hidden above md breakpoint). Props: `events: TimelineEvent[]`, `activeId: string | null`, `onToggleEvent: (id: string) => void`. Renders vertical list. Each item: header row (type icon, date, title, company, chevron indicator) + collapsible detail. Only one item open at a time. Framer Motion height animation for expand/collapse. ARIA: accordion pattern with `aria-expanded`, `aria-controls`, unique `id` pairs

### Timeline Section

- [x] T049 [US2] Build `src/components/sections/Timeline.tsx` — client component. Imports `timelineEvents` from data. Manages `activeEventId: string | null` state. Sorts events by `sortDate` descending. Renders `SectionHeader` (label: "MY TIMELINE", title: "Career Journey"), then desktop: `TimelineTrack` + `TimelineDetail`; mobile: `TimelineAccordion`. Both pass `activeEventId` and handler. Section wrapped in ScrollReveal. `<section id="timeline">`

- [x] T050 [US2] Replace placeholder `<section id="timeline">` in `src/app/page.tsx` with the `Timeline` component import

**Checkpoint**: Timeline section renders on home page. Desktop shows horizontal track with clickable nodes. Mobile shows accordion. Expanding one node collapses any previously open node. Scroll reveal animations fire. Keyboard navigation works.

---

## Phase 5: User Story 3 — Project Showcase with Domain Filtering (Priority: P2)

**Goal**: Visitors can browse and filter projects by domain, and click through to full case study pages.

**Independent Test**: Navigate to #projects. Verify 6 project cards render. Test each filter tab (All, AI & LLM, Web3, E-Commerce, Frontend). Verify featured projects are visually emphasized. Click a project card to navigate to `/projects/[slug]`. Verify detail page renders with all content, gallery, and back navigation.

### Shared Components

- [x] T051 [P] [US3] Build `src/components/shared/TechBadge.tsx` — renders shadcn Badge with technology name. Props: `name`, `variant` (default 'default'), `size` (default 'default'). Small variant uses `text-xs` + `px-1.5 py-0.5`. Consistent styling for all tech mentions across the site

- [x] T052 [P] [US3] Build `src/components/shared/DomainBadge.tsx` — renders color-coded badge per `ProjectDomain`. Props: `domain: ProjectDomain`. Color mapping: ai → indigo, web3 → purple, ecommerce → emerald, frontend → sky. Displays human-readable label from `DOMAIN_LABELS` map

### Project Sub-Components

- [x] T053 [P] [US3] Build `src/components/projects/ProjectFilter.tsx` — client component using shadcn Tabs. Props: `activeFilter: ProjectDomain | 'all'`, `onFilterChange: (filter) => void`, `availableDomains: ProjectDomain[]`. Renders TabsList with "All" tab + one tab per domain. Single-select. Calls `trackEvent('project_filter', { category })` on filter change. ARIA: tablist/tab roles via shadcn Tabs

- [x] T054 [P] [US3] Build `src/components/projects/ProjectCard.tsx` — renders shadcn Card as `<Link href="/projects/${slug}">`. Props: `project: Project`, `featured?: boolean`. Content: hero image (next/image, lazy, blur placeholder if static import available), DomainBadge, title (h3), problemSummary, techStack (TechBadge row, max 5), year. Featured cards span 2 columns on desktop grid. Framer Motion `layout` prop + `layoutId={project.slug}` for reflow on filter. Hover: subtle scale + shadow transition (CSS transition, not Framer)

- [x] T055 [P] [US3] Build `src/components/projects/ProjectGallery.tsx` — client component (dynamic import, `ssr: false`). Props: `images: string[]`, `projectTitle: string`. Swiper carousel with Navigation + Pagination modules. Each slide: next/image with responsive sizing. `aria-label` on nav buttons. Handles empty images array (renders nothing). Import Swiper CSS modules inline

- [x] T056 [P] [US3] Build `src/components/projects/ProjectMeta.tsx` — renders horizontal row: TechBadge list + external link buttons (lucide ExternalLink icon for live URL, Github icon for source). Props: `techStack: string[]`, `liveUrl?`, `sourceUrl?`, `year`. Links open in new tab (`target="_blank"`, `rel="noopener noreferrer"`)

### Projects Section

- [x] T057 [US3] Build `src/components/sections/Projects.tsx` — client component. Imports `projects` from data. Manages `activeFilter` state (default 'all'). Extracts unique domains from projects array. Renders `SectionHeader` (label: "MY WORK", title: "Featured Projects"), `ProjectFilter`, responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile). Filters projects based on active filter. Featured projects first in sort order. Uses Framer Motion `AnimatePresence` + `motion.div` with `layout` prop on each card wrapper for smooth reflow animation. Shows "No projects in this category" if filter yields empty results. `<section id="projects">`

- [x] T058 [US3] Replace placeholder `<section id="projects">` in `src/app/page.tsx` with the `Projects` component import

### Project Detail Pages

- [x] T059 [US3] Build `src/app/projects/[slug]/page.tsx` — export `generateStaticParams()` returning all 6 slugs from `projects` data. Export `generateMetadata()` returning project-specific title + description. Page layout: hero image (full-width, next/image), back link (← All Projects), title (h1), tagline, DomainBadge + year, problem section, approach section, key features list, ProjectMeta (tech stack + links), challenges section (if exists), outcomes section, ProjectGallery (if screenshots exist), CTA link back to /#projects

**Checkpoint**: Projects grid renders with 6 cards. Filter tabs work with animated transitions. Featured projects visually distinguished. Each card links to `/projects/[slug]`. Detail pages render with all content. `npm run build` generates all 6 static project pages.

---

## Phase 6: User Story 4 — Skills Presentation with Career Narrative (Priority: P2)

**Goal**: Visitors see skills organized by cluster with contextual narratives and visual proficiency indicators, with AI & LLM cluster prominently positioned.

**Independent Test**: Navigate to #skills. Verify 4 clusters render in correct order (AI first). Confirm each cluster has narrative and skill bars. Scroll into view — bars animate from 0 to target. Test reduced motion — bars show final value immediately.

### Shared Components

- [x] T060 [P] [US4] Build `src/components/shared/SkillBar.tsx` — client component. Props: `name`, `level` (0–100), `icon?`. Renders: skill name label, optional lucide icon, percentage text, horizontal bar track with fill. Uses `useInView` (triggerOnce). Framer Motion `motion.div` animate width from `0%` to `${level}%` with spring physics. Duration ~1s. Respects `useReducedMotion()` — if true, renders at full width immediately. ARIA: `role="progressbar"`, `aria-valuenow={level}`, `aria-valuemin={0}`, `aria-valuemax={100}`

### Skills Section

- [x] T061 [US4] Build `src/components/sections/Skills.tsx` — reads `skillClusters` from data. Sorts by `order`. Renders `SectionHeader` (label: "SKILLS", title: "Technical Arsenal"). Maps clusters to cards: each card has cluster name (h3), narrative text, grid of SkillBar components. Emphasized cluster (AI & LLM) gets distinctive styling: larger card, colored border, "Focus Area" badge. ScrollReveal wraps each cluster card with stagger delay (index * 0.1s). `<section id="skills">`

- [x] T062 [US4] Replace placeholder `<section id="skills">` in `src/app/page.tsx` with the `Skills` component import

**Checkpoint**: Skills section renders 4 clusters. AI & LLM cluster is first and visually emphasized. Skill bars animate on scroll. Reduced motion respected.

---

## Phase 7: User Story 5 — Social Proof via Testimonials (Priority: P3)

**Goal**: Visitors see a carousel of specific, human testimonials that reinforce the narrative of Thanachon's impact on teams.

**Independent Test**: Navigate to #testimonials. Verify all testimonials render with complete attribution. Carousel auto-plays. Navigation dots work. Arrow keys navigate slides. Avatars show initials fallback when no image provided.

### Testimonials Section

- [x] T063 [US5] Build `src/components/sections/Testimonials.tsx` — client component (dynamic import with `ssr: false` for Swiper). Imports `testimonials` from data. Renders `SectionHeader` (label: "TESTIMONIALS", title: "What People Say"). Swiper carousel with modules: Autoplay (delay: 4000, pauseOnMouseEnter: true), Pagination (clickable dots). Each slide: shadcn Card containing quote text (styled with quotation marks), shadcn Avatar with AvatarImage (if authorAvatar) and AvatarFallback (initials from authorName), author name, authorRole + relationship text. Responsive: 1 slide per view on mobile, 2 on tablet, 3 on desktop with spaceBetween. Import Swiper CSS. `<section id="testimonials">`

- [x] T064 [US5] Replace placeholder `<section id="testimonials">` in `src/app/page.tsx` with the `Testimonials` component (dynamically imported with loading skeleton)

**Checkpoint**: Testimonials carousel renders. Auto-plays with dots. Avatar initials fallback works. Keyboard accessible.

---

## Phase 8: User Story 6 — Value Proposition (Priority: P3)

**Goal**: Visitors see five crystallized value statements that tie the entire narrative together before the contact section.

**Independent Test**: Navigate to value prop section. Verify exactly 5 cards render with icons, titles, descriptions. Test cross-reference links scroll/navigate correctly.

### Value Proposition Section

- [x] T065 [US6] Build `src/components/sections/ValueProp.tsx` — reads `valuePropositions` from data. Renders `SectionHeader` (label: "VALUE", title: "Why Work With Me"). 5 cards in responsive grid (3 cols desktop, 1 col mobile). Each card: lucide icon (rendered from `icon` string using lucide-react's dynamic icon lookup or a mapped object), title (h3), description, optional "See evidence →" link (if `crossRef` exists — anchor links use smooth scroll, page links use Next Link). ScrollReveal with stagger on cards. `<section id="value">`

- [x] T066 [US6] Replace placeholder `<section id="value">` in `src/app/page.tsx` with the `ValueProp` component import

**Checkpoint**: Value prop section renders 5 cards. Cross-reference links work.

---

## Phase 9: User Story 7 — Dual-Intent Contact Experience (Priority: P2)

**Goal**: Visitors can self-select their contact intent and submit a tailored message via Netlify Forms.

**Independent Test**: Navigate to #contact. Verify 4 intent cards render. Select each intent — form heading and placeholder update accordingly. Submit with valid data — success state appears. Submit with invalid data — inline errors show. Test keyboard-only form completion in under 60s.

### Contact Section

- [x] T067 [US7] Build `src/components/sections/ContactCTA.tsx` — client component. Imports `contactIntents` from data. Manages `selectedIntent: string | null` state. Renders `SectionHeader` (label: "CONTACT", title: "Let's Connect"). Intent selection: 4 shadcn Cards in 2×2 grid, each showing lucide icon + label. Clicking a card sets selectedIntent and reveals form below with AnimatePresence. Form: uses React Hook Form with `zodResolver(contactFormSchema)`. Fields: name (Input), email (Input type="email"), message (Textarea). Hidden fields: `<input type="hidden" name="form-name" value="contact">`, `<input type="hidden" name="intent" value={selectedIntent}>`, `<input name="bot-field" className="hidden">`. Form element: `data-netlify="true"`, `name="contact"`, `action="/success"` (or same page). Inline validation errors via `formState.errors`. Submit button with loading state (disabled + spinner). On success: show success message (CheckCircle icon + "Message sent!" + reset button). On error: show error message with retry. Social links row below form: LinkedIn, GitHub, Email (mailto:) with lucide icons. `<section id="contact">`. Track `trackEvent('cta_click', { intent: selectedIntent })` on submit

- [x] T068 [US7] Replace placeholder `<section id="contact">` in `src/app/page.tsx` with the `ContactCTA` component import

**Checkpoint**: Contact section renders intent cards. Form appears on selection. Validation works. Netlify form attributes present in static HTML output. Social links work.

---

## Phase 10: Additional Pages

**Purpose**: Build standalone pages for About, Contact, and Projects listing that complement the home page.

- [x] T069 [P] Build `src/app/about/page.tsx` — export metadata (title: "About"). Content: extended bio narrative (origin story, career arc, MAQE years, AI pivot moment, 10-year SaaS founder vision, "outside the terminal" personal interests). Use SectionHeader, ScrollReveal. Link to /#timeline and /#projects. Responsive layout

- [x] T070 [P] Build `src/app/contact/page.tsx` — export metadata (title: "Contact"). Full-width standalone version of ContactCTA section with additional introductory text above the intent selector. Same form, same intent cards, same social links. Wrapped in proper page layout

- [x] T071 [P] Build `src/app/projects/page.tsx` — export metadata (title: "Projects"). Same ProjectFilter + ProjectCard grid as home page Projects section but in standalone layout with breadcrumb nav ("Home / Projects") and more vertical spacing. Imports same data and components

**Checkpoint**: `/about`, `/contact`, `/projects` pages render correctly. `npm run build` generates static HTML for all pages.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Image optimization, SEO, accessibility hardening, performance tuning, and launch readiness.

- [x] T072 [P] Create placeholder WebP images in `public/images/` — avatar.webp (400×400), project hero images (1200×630 each) in `projects/[slug]/hero.webp`, OG image (1200×630). Use solid color rectangles with text overlay as placeholders until real images are provided. Correct directory structure: `public/images/avatar.webp`, `public/images/projects/ai-event-platform/hero.webp`, etc.

- [x] T073 [P] Add static image imports for blur placeholders — create `src/lib/images.ts` that statically imports avatar.webp and project hero images. Use these imports in Hero component (priority + blur) and ProjectCard (lazy + blur). This enables Next.js automatic blurDataURL generation at build time

- [x] T074 [P] Wrap Swiper-dependent sections in `next/dynamic` with `ssr: false` — ensure `Testimonials` and `ProjectGallery` are dynamically imported. Add shimmer loading skeletons as fallback UI during dynamic load

- [x] T075 [P] Write metadata exports for all pages — ensure `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/projects/page.tsx`, and `src/app/projects/[slug]/page.tsx` all export `metadata` or `generateMetadata()` with title, description, Open Graph tags. Verify canonical URLs use `NEXT_PUBLIC_SITE_URL`

- [x] T076 [P] Create OG image — add `public/images/og-default.webp` (1200×630) and `public/images/apple-touch-icon.png` (180×180). Reference in root layout metadata: `icons`, `openGraph.images`

- [x] T077 Verify dark mode on all sections — load site in dark mode. Check every section: Hero, ValueStrip, Timeline, Projects, Skills, Testimonials, ValueProp, ContactCTA, Footer. Ensure all text is readable, all backgrounds use correct dark tokens, no white flashes on page load

- [x] T078 Test keyboard navigation comprehensively — tab through entire page. Verify: Navbar links focus correctly, ThemeToggle is focusable, Timeline nodes are keyboard-activatable (Enter/Space), project cards are focusable links, filter tabs navigate with arrow keys, form fields tab in order, submit button is keyboard-accessible, social links are focusable. Fix any gaps with `tabIndex`, `onKeyDown` handlers, or focus styles

- [x] T079 Run `npm run build` and verify static export — confirm `out/` directory contains: `index.html`, `about/index.html`, `contact/index.html`, `projects/index.html`, `projects/ai-event-platform/index.html` (and all 5 other slugs). Verify Netlify form detection by checking `<form data-netlify="true">` is present in `out/contact/index.html` and `out/index.html`

- [x] T080 Run Lighthouse audit on local static export — serve `out/` with `npx serve out`. Run Chrome DevTools Lighthouse on desktop and mobile. Target: 95+ on all 4 categories. Common fixes: add `<meta name="description">`, ensure all images have width/height, verify `<html lang="en">`, check contrast ratios, add missing aria-labels

- [x] T081 [P] Set environment variables in Netlify dashboard — add `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_SITE_URL` to Netlify site environment variables. Verify GA4 event receiving with GA4 DebugView

- [x] T082 [P] Update `README.md` — rewrite for the new architecture. Include: project overview, tech stack, local development setup, build commands, deployment process, content management guide (how to add projects, timeline events, testimonials), environment variables reference

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — delivers MVP
- **US2 (Phase 4)**: Depends on Phase 3 (needs Navbar, layout, ScrollReveal)
- **US3 (Phase 5)**: Depends on Phase 3 (needs layout, TechBadge, ScrollReveal)
- **US4 (Phase 6)**: Depends on Phase 3 (needs layout, ScrollReveal, SkillBar via Phase 2)
- **US5 (Phase 7)**: Depends on Phase 3 (needs layout, ScrollReveal)
- **US6 (Phase 8)**: Depends on Phase 3 (needs layout, ScrollReveal)
- **US7 (Phase 9)**: Depends on Phase 3 (needs layout, ScrollReveal)
- **Additional Pages (Phase 10)**: Depends on Phase 5 (needs ProjectCard, ProjectFilter, ContactCTA)
- **Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No deps on other stories. **This is the MVP.**
- **US2 (P1)**: Can start after US1 — Needs layout components from US1
- **US3 (P2)**: Can start after US1 — Can run **in parallel** with US2
- **US4 (P2)**: Can start after US1 — Can run **in parallel** with US2, US3
- **US5 (P3)**: Can start after US1 — Can run **in parallel** with US2–US4
- **US6 (P3)**: Can start after US1 — Can run **in parallel** with US2–US5
- **US7 (P2)**: Can start after US1 — Can run **in parallel** with US2–US6

### Within Each User Story

- Shared components (if any) before section component
- Sub-components before parent section component
- Section component before page.tsx integration
- Page integration last

### Parallel Opportunities

- All Phase 1 tasks T007–T012 can run in parallel
- All Phase 2 tasks T014–T032 can run in parallel (different files)
- Within US1: T033, T034, T035, T037–T040 can run in parallel
- Within US2: T045, T046 can run in parallel; T047, T048 depend on T045
- Within US3: T051–T056 can run in parallel; T057 depends on T053, T054
- US2 through US7 can all run in parallel after US1 completes

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T013)
2. Complete Phase 2: Foundational (T014–T032)
3. Complete Phase 3: User Story 1 — Hero, Navbar, Layout (T033–T044)
4. **STOP and VALIDATE**: Site loads, hero renders, theme toggles, nav works
5. Deploy preview to Netlify

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test → Deploy (MVP!)
3. Add US2 (Timeline) → Test → Deploy
4. Add US3 (Projects) + US4 (Skills) in parallel → Test → Deploy
5. Add US5 (Testimonials) + US6 (ValueProp) + US7 (Contact) in parallel → Test → Deploy
6. Add Additional Pages → Test → Deploy
7. Polish → Lighthouse audit → Final deploy

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable after US1 (layout) is done
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- All 82 tasks follow the checklist format (checkbox, ID, labels, file paths)
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
