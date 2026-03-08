# Component Interface Contracts

**Branch**: `001-portfolio-rebuild`
**Date**: 2026-03-08

This document specifies the public interfaces (props, behavior, events)
for all components in the portfolio rebuild. Components are organized by
the hierarchy defined in the constitution.

## Shared Components (`src/components/shared/`)

### ScrollReveal

```typescript
interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number          // Animation delay in seconds (default: 0)
  direction?: 'up' | 'left' | 'right'  // Reveal direction (default: 'up')
  className?: string      // Additional wrapper classes
}
```

**Behavior**: Wraps children in a Framer Motion `motion.div`. Fades in
and translates from the specified direction when the element enters the
viewport (detected via `useInView`). Animation fires once. Respects
`useReducedMotion()` — if reduced motion preferred, renders children
immediately without animation.

### SectionHeader

```typescript
interface SectionHeaderProps {
  title: string           // Section heading (rendered as <h2>)
  subtitle?: string       // Supporting description text
  label?: string          // Small pre-title label (e.g., "MY JOURNEY")
  align?: 'left' | 'center'  // Text alignment (default: 'center')
}
```

**Behavior**: Renders a consistent section header block. `label` renders
as a small uppercase text above the title. No interactive behavior.

### TechBadge

```typescript
interface TechBadgeProps {
  name: string            // Technology name to display
  variant?: 'default' | 'outline'  // shadcn Badge variant (default: 'default')
}
```

**Behavior**: Renders a shadcn `Badge` with the technology name. No
interactive behavior.

### AnimatedCounter

```typescript
interface AnimatedCounterProps {
  end: number             // Target number to count to
  duration?: number       // Animation duration in seconds (default: 2)
  suffix?: string         // Text after number (e.g., "+", "years")
  prefix?: string         // Text before number (e.g., "$")
}
```

**Behavior**: Counts from 0 to `end` when the element enters the
viewport. Uses Framer Motion `useMotionValue` and `useTransform`.
Fires once. Respects reduced motion — shows final value immediately.

### SkillBar

```typescript
interface SkillBarProps {
  name: string            // Skill name
  level: number           // Proficiency 0-100
  icon?: string           // Lucide icon name (optional)
}
```

**Behavior**: Renders skill name, optional icon, and a horizontal bar
that fills to `level`% width. Fill animation triggered by `useInView`,
fires once. Uses Framer Motion for smooth fill. Shows percentage text.
Respects reduced motion.

### DomainBadge

```typescript
import type { ProjectDomain } from '@/types/project'

interface DomainBadgeProps {
  domain: ProjectDomain   // 'ai' | 'web3' | 'ecommerce' | 'frontend'
}
```

**Behavior**: Renders a color-coded badge. Colors by domain:
- `ai` → indigo background
- `web3` → purple background
- `ecommerce` → emerald background
- `frontend` → sky background

Displays the human-readable domain label from a lookup map.

## Layout Components (`src/components/layout/`)

### Navbar

```typescript
// No props — reads from src/data/navigation.ts and src/data/siteConfig.ts
```

**Behavior**:
- Sticky top with `z-50`
- Background: transparent when at top, solid with blur when scrolled
- Renders nav links from `navigation.ts`
- Active section highlighting via `useScrollSpy` (only for anchor links)
- Anchor links trigger smooth scroll; page links use standard navigation
- Contains `ThemeToggle` button
- Mobile: hamburger icon → opens `MobileMenu`
- ARIA: `<nav>` element, `aria-label="Main navigation"`, `aria-current="page"` on active

### MobileMenu

```typescript
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}
```

**Behavior**: Slide-in drawer from right side on mobile. Renders same
nav links as desktop. Closes on link click, Escape key, or overlay
click. Focus trapped while open. ARIA: `role="dialog"`, `aria-modal="true"`.

### ThemeToggle

```typescript
// No props — uses next-themes useTheme()
```

**Behavior**: Button that toggles between light and dark mode. Shows
Sun icon in dark mode, Moon icon in light mode. Uses `setTheme()` from
`useTheme()`. ARIA: `aria-label="Toggle theme"`.

### ScrollProgress

```typescript
// No props
```

**Behavior**: Fixed bar at top of viewport (below navbar). Width
represents scroll progress (0% at top, 100% at bottom). Implemented
with CSS `scaleX` transform driven by scroll event listener or CSS
`animation-timeline: scroll()`. Primary color background. `aria-hidden="true"`.

### Footer

```typescript
// No props — reads from src/data/siteConfig.ts
```

**Behavior**: Displays social links (LinkedIn, GitHub, Email), copyright
text with current year. Links open in new tab with `rel="noopener noreferrer"`.

## Section Components (`src/components/sections/`)

### Hero

```typescript
// No props — reads from src/data/siteConfig.ts
```

**Behavior**:
- Renders: name, professional title, tagline, avatar image, 2 CTA buttons
- Avatar uses `next/image` with `priority={true}` and static import for blur
- CTA 1: "View My Work" → smooth scrolls to `#projects`
- CTA 2: "Get In Touch" → navigates to `/contact`
- Framer Motion entrance: staggered fade-up for text elements, scale-in for avatar
- Full-viewport height on desktop, auto-height on mobile

### ValueStrip

```typescript
// No props — uses hardcoded metrics or reads from src/data/siteConfig.ts
```

**Behavior**: Horizontal row of 3-4 stat counters (e.g., "4+ Years",
"6 Projects", "3 Domains"). Uses `AnimatedCounter` for each number.
Subtle background differentiation from hero section.

### Timeline

```typescript
// No props — reads from src/data/timelineEvents.ts
```

**Behavior**:
- Manages `activeEventId: string | null` state
- Desktop (≥768px): renders `TimelineTrack` + `TimelineDetail`
- Mobile (<768px): renders `TimelineAccordion`
- Uses `SectionHeader` with title "Career Journey" / label "MY TIMELINE"

### Projects

```typescript
// No props — reads from src/data/projects.ts
```

**Behavior**:
- Manages `activeFilter: ProjectDomain | 'all'` state (default: `'all'`)
- Renders `ProjectFilter` (shadcn Tabs) + grid of `ProjectCard`
- Filtered cards use Framer Motion `AnimatePresence` + `layout` for transitions
- Featured projects are positioned first and/or given larger card size
- Uses `SectionHeader` with title "Featured Projects" / label "MY WORK"

### Skills

```typescript
// No props — reads from src/data/skills.ts
```

**Behavior**:
- Renders skill clusters in `order` sequence
- Each cluster: name heading, narrative text, grid of `SkillBar`
- Emphasized cluster (AI & LLM) gets visual distinction (larger, first)
- Uses `SectionHeader` with title "Technical Arsenal" / label "SKILLS"
- `ScrollReveal` wraps each cluster with stagger delay

### Testimonials

```typescript
// No props — reads from src/data/testimonials.ts
```

**Behavior**:
- Swiper carousel (dynamically imported, `ssr: false`)
- Modules: Autoplay (3s pause), Pagination (dots)
- Each slide: quote text, shadcn Avatar (with AvatarFallback for initials),
  author name, role, relationship
- Uses `SectionHeader` with title "What People Say" / label "TESTIMONIALS"
- Keyboard accessible: arrow keys navigate slides

### ValueProp

```typescript
// No props — reads from src/data/valuePropositions.ts
```

**Behavior**:
- Renders 5 value cards in a responsive grid (3 cols desktop, 1 col mobile)
- Each card: lucide icon, title, description, optional "See evidence" link
- Cross-ref links smooth-scroll to target or navigate to project page
- `ScrollReveal` with stagger animation
- Uses `SectionHeader` with title "Why Work With Me" / label "VALUE"

### ContactCTA

```typescript
// No props — reads from src/data/contactIntents.ts
```

**Behavior**:
- 4 intent cards (shadcn Card) in a 2×2 grid
- Clicking an intent card: highlights it, reveals form below with
  tailored heading and placeholder from the selected ContactIntent
- Form fields: name, email, message (React Hook Form + Zod validation)
- Form element: `data-netlify="true"`, `name="contact"`, hidden bot-field
- Submit: standard form POST (Netlify intercepted) or AJAX fetch
- Success: shows confirmation message, resets form
- Error: shows error message with retry, preserves input data
- Social links row: LinkedIn, GitHub, Email (mailto:)
- Uses `SectionHeader` with title "Let's Connect" / label "CONTACT"

## Timeline Sub-Components (`src/components/timeline/`)

### TimelineTrack

```typescript
interface TimelineTrackProps {
  events: TimelineEvent[]
  activeId: string | null
  onSelectEvent: (id: string) => void
}
```

**Behavior**: Horizontal scrollable track with nodes. Each node shows
date and title. Active node is visually highlighted. Horizontal line
connects nodes. Scroll buttons on overflow edges. Keyboard: arrow keys
navigate between nodes, Enter/Space activates.

### TimelineNode

```typescript
interface TimelineNodeProps {
  event: TimelineEvent
  isActive: boolean
  onClick: () => void
}
```

**Behavior**: Individual node on the track. Shows event type icon,
date, brief title. Visual state changes on active. Click toggles active.
Framer Motion scale/color animation on state change. ARIA: `button` role,
`aria-expanded` for active state.

### TimelineDetail

```typescript
interface TimelineDetailProps {
  event: TimelineEvent | null
}
```

**Behavior**: Panel below the track showing expanded content of the
active event. Displays description, impact statement, skills learned.
Framer Motion `AnimatePresence` for enter/exit animations. Renders
nothing when `event` is null.

### TimelineAccordion

```typescript
interface TimelineAccordionProps {
  events: TimelineEvent[]
  activeId: string | null
  onToggleEvent: (id: string) => void
}
```

**Behavior**: Mobile vertical accordion. Each item shows event type
icon, date, title, company as the header row. Clicking expands the
detail below. Single-open: only one item expanded at a time. Framer
Motion height animation for expand/collapse. ARIA: accordion pattern
with `aria-expanded`, `aria-controls`.

## Project Sub-Components (`src/components/projects/`)

### ProjectCard

```typescript
interface ProjectCardProps {
  project: Project
  featured?: boolean
}
```

**Behavior**: shadcn Card linking to `/projects/${project.slug}`.
Shows: hero image (next/image, lazy), domain badge, title, problem
summary, tech stack badges (max 4-5). Featured cards are larger
(col-span-2 on desktop grid). Framer Motion `layout` prop for
smooth reflow on filter. Hover effect on desktop.

### ProjectFilter

```typescript
interface ProjectFilterProps {
  activeFilter: ProjectDomain | 'all'
  onFilterChange: (filter: ProjectDomain | 'all') => void
  availableDomains: ProjectDomain[]
}
```

**Behavior**: shadcn Tabs component. Tabs: "All", then one per
`availableDomains`. Single-select. Triggers `onFilterChange` on click.
ARIA: `tablist` role via shadcn Tabs.

### ProjectGallery

```typescript
interface ProjectGalleryProps {
  images: string[]        // Array of WebP image paths
  projectTitle: string    // For alt text generation
}
```

**Behavior**: Swiper carousel (dynamically imported, `ssr: false`).
Modules: Navigation (arrows) + Pagination (dots). Each slide: next/image
with responsive sizing. ARIA: `aria-label` on navigation buttons.

### ProjectMeta

```typescript
interface ProjectMetaProps {
  techStack: string[]
  liveUrl?: string
  sourceUrl?: string
  year: string
}
```

**Behavior**: Horizontal row of TechBadges + external link buttons
(lucide ExternalLink icon). Links open in new tab. Year displayed.

## Page Contracts (`src/app/`)

### Root Layout (`layout.tsx`)

- Wraps all pages with: Geist fonts, ThemeProvider, Navbar, Footer,
  ScrollProgress, GoogleAnalytics
- Metadata: title template (`%s | Thanachon Suppasatian`), default
  description, OG tags with site URL

### Home Page (`page.tsx`)

- Composes sections in order: Hero, ValueStrip, Timeline, Projects,
  Skills, Testimonials, ValueProp, ContactCTA
- Each section wrapped in `<section id="...">` for anchor navigation

### Project Detail (`projects/[slug]/page.tsx`)

- `generateStaticParams()` returns all project slugs from data
- `generateMetadata()` returns project-specific title + description
- Renders: hero image, tagline, problem, approach, features, tech
  stack (ProjectMeta), challenges, outcomes, ProjectGallery, back link

### About Page (`about/page.tsx`)

- Extended bio, career narrative, professional philosophy
- Links to timeline sections and projects

### Contact Page (`contact/page.tsx`)

- Full-page version of ContactCTA section
- Same intent selection + form + social links
- Standalone page for direct linking from resume/email signatures

## Custom Hooks (`src/hooks/`)

### useScrollSpy

```typescript
function useScrollSpy(sectionIds: string[]): string | null
```

Returns the `id` of the section currently most visible in the viewport.
Uses Intersection Observer with threshold array. Updates on scroll.

### useInView

```typescript
function useInView(options?: IntersectionObserverInit): [
  ref: React.RefObject<HTMLElement>,
  inView: boolean
]
```

Returns a ref and a boolean indicating if the element is in view.
Wraps `IntersectionObserver`. Fires once by default (for animations).

### useReducedMotion

```typescript
function useReducedMotion(): boolean
```

Re-exports Framer Motion's `useReducedMotion()` or provides a
standalone implementation using `matchMedia('(prefers-reduced-motion: reduce)')`.

## Utility Functions (`src/lib/`)

### utils.ts

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]): string
```

Standard shadcn class merging utility.

### analytics.ts

```typescript
function trackEvent(name: string, params?: Record<string, string>): void
```

Wrapper around `window.gtag('event', ...)`. Gracefully handles missing
gtag (dev environment, ad blockers). Available event names:
`cta_click`, `project_filter`, `timeline_expand`, `resume_download`.
