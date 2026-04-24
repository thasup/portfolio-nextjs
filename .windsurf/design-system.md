# Portfolio Design System

> A comprehensive design system documentation for the Next.js portfolio project featuring glassmorphism, bilingual support, and performance-optimized components.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Glass Morphism System](#glass-morphism-system)
6. [Components](#components)
7. [Motion & Animation](#motion--animation)
8. [Icons](#icons)
9. [Accessibility](#accessibility)
10. [Performance](#performance)
11. [Internationalization](#internationalization)

---

## Design Philosophy

### Tone & Mood
The design system embodies a **modern, premium aesthetic** inspired by Notion's clean interface with a signature glassmorphism approach. The visual language balances:

- **Clarity**: Clean, readable interfaces with excellent contrast
- **Depth**: Strategic use of elevation and transparency
- **Fluidity**: Smooth animations and liquid glass effects
- **Professionalism**: Balanced, refined visual hierarchy

### Core Principles

1. **Performance First**: Adaptive rendering based on device capabilities
2. **Accessibility**: WCAG 2.1 AA compliance with reduced motion support
3. **Consistency**: Unified design tokens across all components
4. **Bilingual Ready**: Optimized for English and Thai languages
5. **Responsive**: Mobile-first approach with fluid breakpoints

---

## Color System

### Color Format
All colors use **OKLCH color space** for perceptual uniformity and better dark mode transitions.

### Base Tokens

#### Light Mode
```css
--color-primary: oklch(0.55 0.22 264)        /* Rich purple-blue */
--color-primary-foreground: #ffffff
--color-accent: oklch(0.75 0.18 75)          /* Warm yellow-green */
--color-accent-foreground: #0f172a
--color-background: #ffffff
--color-foreground: #0f172a                  /* Slate 900 */
--color-muted: #f1f5f9                       /* Slate 100 */
--color-muted-foreground: #64748b            /* Slate 500 */
--color-card: #ffffff
--color-card-foreground: #0f172a
--color-border: #e2e8f0                      /* Slate 200 */
--color-input: #e2e8f0
--color-ring: oklch(0.55 0.22 264)
--color-destructive: #ef4444                 /* Red 500 */
--color-destructive-foreground: #ffffff
```

#### Dark Mode
```css
--color-primary: oklch(0.7 0.17 264)         /* Lighter purple-blue */
--color-primary-foreground: #ffffff
--color-accent: oklch(0.8 0.15 75)           /* Lighter yellow-green */
--color-accent-foreground: #0f172a
--color-background: #020617                  /* Slate 950 */
--color-foreground: #f8fafc                  /* Slate 50 */
--color-muted: #1e293b                       /* Slate 800 */
--color-muted-foreground: #94a3b8            /* Slate 400 */
--color-card: #0f172a                        /* Slate 900 */
--color-card-foreground: #f8fafc
--color-border: #1e293b
--color-input: #1e293b
--color-ring: oklch(0.7 0.17 264)
--color-destructive: #dc2626                 /* Red 600 */
--color-destructive-foreground: #ffffff
```

### Color Usage Guidelines

| Token | Use Cases |
|-------|-----------|
| `primary` | CTAs, links, interactive elements, brand touchpoints |
| `accent` | Highlights, success states, secondary actions |
| `background` | Page backgrounds, main surfaces |
| `foreground` | Body text, primary content |
| `muted` | Secondary backgrounds, disabled states |
| `muted-foreground` | Secondary text, placeholders |
| `card` | Card backgrounds, elevated surfaces |
| `border` | Dividers, borders, separators |
| `destructive` | Error states, delete actions |

### Semantic Colors

```css
/* Success */
bg-emerald-500              /* #10b981 */

/* Info */
bg-blue-500                 /* #3b82f6 */

/* Warning */
bg-amber-500                /* #f59e0b */
```

---

## Typography

### Font Families

```css
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif
--font-mono: var(--font-geist-mono), ui-monospace, monospace
--font-sarabun: var(--font-sarabun), 'Sarabun', sans-serif
```

### Font Stack

1. **Primary**: **Geist Sans** - Modern, clean sans-serif for English
2. **Thai**: **Sarabun** - Optimized for Thai script readability
3. **Monospace**: **Geist Mono** - For code snippets and technical content

### Thai Font Handling
```tsx
// Automatically applied based on locale
html[lang="th"] body {
  font-family: var(--font-sarabun), var(--font-sans);
}
```

Configuration in `src/lib/fonts.ts`:
```tsx
export const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
});
```

### Type Scale

| Style | Class | Size | Weight | Line Height | Usage |
|-------|-------|------|--------|-------------|-------|
| H1 | `text-4xl sm:text-5xl lg:text-6xl` | 36px / 48px / 60px | 700 | 1.1 | Page titles |
| H2 | `text-3xl sm:text-4xl` | 30px / 36px | 700 | 1.2 | Section headers |
| H3 | `text-2xl sm:text-3xl` | 24px / 30px | 600 | 1.3 | Subsections |
| H4 | `text-xl sm:text-2xl` | 20px / 24px | 600 | 1.4 | Card titles |
| Body Large | `text-base md:text-xl` | 16px / 20px | 400 | 1.6 | Hero descriptions |
| Body | `text-base` | 16px | 400 | 1.5 | Default text |
| Body Small | `text-sm md:text-base` | 14px / 16px | 400 | 1.5 | Secondary content |
| Caption | `text-xs` | 12px | 400 | 1.4 | Labels, metadata |
| Overline | `text-xs tracking-[0.18em] uppercase` | 12px | 500 | 1.5 | Categories, tags |

### Font Rendering

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Spacing & Layout

### Spacing Scale (Tailwind 4.0)

```
0.5 → 2px      (0.125rem)
1   → 4px      (0.25rem)
2   → 8px      (0.5rem)
3   → 12px     (0.75rem)
4   → 16px     (1rem)
5   → 20px     (1.25rem)
6   → 24px     (1.5rem)
8   → 32px     (2rem)
10  → 40px     (2.5rem)
12  → 48px     (3rem)
16  → 64px     (4rem)
20  → 80px     (5rem)
24  → 96px     (6rem)
```

### Container Widths

```tsx
max-w-6xl    /* 1152px - Main content container */
max-w-4xl    /* 896px - Articles, forms */
max-w-2xl    /* 672px - Narrow content */
max-w-xl     /* 576px - Very narrow content */
```

### Padding & Margins

```css
/* Section spacing */
.section-padding {
  padding-block: 7rem;  /* 112px vertical padding */
}

/* Container padding */
px-4 sm:px-6            /* Responsive horizontal padding */
```

### Grid & Flexbox Patterns

```tsx
/* Two-column responsive layout */
<div className="grid gap-12 lg:grid-cols-2">

/* Three-column cards */
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

/* Centered flex container */
<div className="flex items-center justify-center">

/* Space between layout */
<div className="flex items-center justify-between">
```

### Border Radius

```css
--radius-sm: 0.25rem      /* 4px - Small elements */
--radius-md: 0.375rem     /* 6px - Buttons, inputs */
--radius-lg: 0.5rem       /* 8px - Cards (rounded-lg) */
--radius-xl: 0.75rem      /* 12px - Panels (rounded-xl) */
--radius-2xl: 1rem        /* 16px - Large cards (rounded-2xl) */
--radius-full: 9999px     /* Pills, circles */
```

### Breakpoints

```tsx
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large screens */
```

---

## Glass Morphism System

### Overview
The **Liquid Glass System** is a premium glassmorphism implementation with:

- 5-tier elevation system
- Adaptive performance rendering
- Optional liquid distortion effects
- Dynamic specular highlights
- Dark/light mode theming

### Elevation Scale

| Level | Use Case | Blur Strength | Opacity | Shadow |
|-------|----------|---------------|---------|--------|
| **E1** | Background elements, subtle layers | Minimal | 50-60% | Light |
| **E2** | Default cards, content blocks | Balanced | 55-65% | Medium |
| **E3** | Panels, important containers | Moderate | 60-70% | Moderate |
| **E4** | Modals, overlays | Strong | 65-75% | Strong |
| **E5** | Critical focus elements | Intense | 70-80% | Very strong |

### Glass Tokens

#### Light Mode
```css
--glass-e1-fill: color-mix(in oklch, var(--color-background) 50%, transparent);
--glass-e1-border: color-mix(in oklch, var(--color-foreground) 12%, transparent);
--glass-e1-shadow: 0 2px 8px -2px color-mix(in oklch, var(--color-foreground) 6%, transparent);

--glass-e2-fill: color-mix(in oklch, var(--color-background) 55%, transparent);
--glass-e2-border: color-mix(in oklch, var(--color-foreground) 14%, transparent);
--glass-e2-shadow: 0 4px 12px -2px color-mix(in oklch, var(--color-foreground) 8%, transparent);

/* ... e3, e4, e5 follow similar pattern with increasing values */
```

#### Dark Mode
```css
--glass-e1-fill: color-mix(in oklch, var(--color-background) 40%, transparent);
--glass-e1-border: color-mix(in oklch, var(--color-foreground) 15%, transparent);
--glass-e1-shadow: 0 2px 8px -2px color-mix(in oklch, var(--color-foreground) 8%, transparent);

/* ... increased transparency and stronger borders for dark mode */
```

### Glass Components

#### GlassCard
Interactive card with optional hover and specular effects.

```tsx
import { GlassCard } from '@/components/glass';

<GlassCard 
  elevation="e2" 
  hover 
  specular
>
  <h3>Card Title</h3>
  <p>Card content...</p>
</GlassCard>
```

**Props:**
- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` (default: 'e2')
- `hover?: boolean` - Lift on hover (default: false)
- `interactive?: boolean` - Motion interactions (default: false)
- `specular?: boolean` - Mouse-tracking highlight (default: false)
- `distortion?: boolean` - Liquid glass effect (default: false)
- `distortionIntensity?: 'low' | 'medium' | 'high'` (default: 'low')
- `shine?: boolean` - Edge highlight (default: false)

#### GlassPanel
Static panel for sections and containers.

```tsx
<GlassPanel elevation="e3" specular>
  <div>Panel content...</div>
</GlassPanel>
```

**Props:**
- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` (default: 'e3')
- `specular?: boolean` (default: false)

#### GlassButton
Button with glass styling and spring animations.

```tsx
<GlassButton 
  elevation="e2" 
  distortion 
  shine
  onClick={handleClick}
>
  Click Me
</GlassButton>
```

**Props:**
- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` (default: 'e2')
- `specular?: boolean` (default: false)
- `disabled?: boolean` (default: false)
- `type?: 'button' | 'submit' | 'reset'` (default: 'button')
- `distortion?: boolean` (default: false)
- `distortionIntensity?: 'low' | 'medium' | 'high'` (default: 'low')
- `shine?: boolean` (default: false)

#### GlassModal
Modal dialog with glass effect.

```tsx
<GlassModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  elevation="e4"
  distortion
  distortionIntensity="high"
>
  <div>Modal content...</div>
</GlassModal>
```

**Props:**
- `open: boolean` - Visibility state
- `onClose: () => void` - Close handler
- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` (default: 'e4')
- `distortion?: boolean` (default: false)
- `distortionIntensity?: 'low' | 'medium' | 'high'` (default: 'high')
- `shine?: boolean` (default: false)

### Liquid Distortion Effects

Enable organic glass refraction with SVG filters:

```tsx
<GlassCard 
  distortion 
  distortionIntensity="medium"
  shine
>
  Content with liquid glass effect
</GlassCard>
```

**Intensity Levels:**
- `low`: Subtle texture, maintains text readability
- `medium`: Balanced liquid appearance
- `high`: Dramatic refraction for hero sections

### Performance Tiers

The glass system adapts based on device capabilities:

**Tier 1 (High Performance)**
- Full glass effects with backdrop-filter
- Liquid distortion enabled
- Smooth animations

**Tier 2 (Low Performance)**
- Solid semi-transparent backgrounds
- No blur or distortion
- Simplified animations

**Detection Logic:**
```tsx
// Tier 2 if:
- Device memory < 4GB
- CPU cores < 4
// Otherwise Tier 1
```

### Utility Class

```css
.glass {
  background: color-mix(in oklch, var(--color-background) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## Components

### shadcn/ui Base Components

The design system uses **shadcn/ui** (New York style) as the foundation:

**Configuration** (`components.json`):
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "baseColor": "neutral",
  "cssVariables": true
}
```

**Available Components:**
- `accordion` - Collapsible content sections
- `avatar` - User profile images
- `badge` - Status indicators, labels
- `button` - Interactive buttons
- `card` - Content containers
- `dialog` - Modal dialogs
- `form` - Form controls with validation
- `input` - Text inputs
- `label` - Form labels
- `separator` - Visual dividers
- `sheet` - Side panels
- `switch` - Toggle switches
- `tabs` - Tabbed interfaces
- `textarea` - Multi-line text inputs
- `tooltip` - Contextual hints

### Button Component

```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// As Link
<Button asChild>
  <Link href="/path">Navigate</Link>
</Button>
```

**Variants:**

| Variant | Background | Use Case |
|---------|------------|----------|
| `default` | Primary color | Main CTAs |
| `destructive` | Red | Delete, dangerous actions |
| `outline` | Transparent with border | Secondary actions |
| `secondary` | Muted background | Tertiary actions |
| `ghost` | Transparent | Subtle interactions |
| `link` | No background | Text links |

### Card Component

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Custom Section Components

#### Hero
Full-width hero section with:
- Staggered animations
- Availability badge
- CTA buttons
- Social links
- Avatar image
- Scroll indicator

```tsx
import { Hero } from '@/components/sections/Hero';

<Hero />
```

#### Timeline
Vertical scroll timeline with:
- Year numerals
- Sticky spine
- Hover effects
- Card elevations

```tsx
import { Timeline } from '@/components/sections/Timeline';

<Timeline />
```

#### Testimonials
Carousel with:
- Swiper integration
- Pagination dots
- Custom navigation
- Glass cards

```tsx
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';

<TestimonialsCarousel />
```

---

## Motion & Animation

### Framework
**Framer Motion** for declarative animations with spring physics.

### Spring Configurations

Located in `src/lib/springs.ts`:

```tsx
// Smooth, slow animations for cards and panels
export const SPRING_GENTLE: Spring = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1,
};

// Bouncy, playful animations for interactive elements
export const SPRING_BUOYANT: Spring = {
  type: 'spring',
  stiffness: 120,
  damping: 14,
  mass: 0.8,
};

// Fast, crisp animations for buttons and toggles
export const SPRING_SNAPPY: Spring = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 0.5,
};
```

### Keyframe Animations

```css
/* Fade up entrance */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
--animate-fade-up: fade-up 0.5s ease-out;

/* Simple fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
--animate-fade-in: fade-in 0.3s ease-out;

/* Shimmer effect */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
--animate-shimmer: shimmer 2s infinite;
```

### Motion Variants

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};
```

### Reduced Motion Support

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

const reducedMotion = useReducedMotion();
const Wrapper = reducedMotion ? 'div' : motion.div;

<Wrapper 
  {...(!reducedMotion && {
    variants: itemVariants,
    initial: "hidden",
    animate: "visible"
  })}
>
  Content
</Wrapper>
```

**CSS Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Common Animation Patterns

```tsx
// Hover lift
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: 'spring', stiffness: 300 }}
>

// Scale on tap
<motion.button
  whileTap={{ scale: 0.95 }}
>

// Infinite bounce
<motion.div
  animate={{ y: [0, 8, 0] }}
  transition={{ 
    duration: 2, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }}
>

// Stagger children
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## Icons

### Icon Library
**Lucide React** - Modern, consistent icon set with excellent tree-shaking.

```bash
npm install lucide-react
```

### Usage

```tsx
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';

<Github className="h-5 w-5" />
<Mail className="h-4 w-4" />
```

### Icon Sizes

```tsx
h-4 w-4    /* 16px - Inline with text */
h-5 w-5    /* 20px - Standard buttons */
h-6 w-6    /* 24px - Larger buttons */
h-8 w-8    /* 32px - Feature icons */
```

### Common Icons

| Icon | Import | Use Case |
|------|--------|----------|
| `Github` | `lucide-react` | GitHub link |
| `Linkedin` | `lucide-react` | LinkedIn link |
| `Mail` | `lucide-react` | Email link |
| `ArrowDown` | `lucide-react` | Scroll indicator |
| `ExternalLink` | `lucide-react` | External links |
| `Menu` | `lucide-react` | Mobile menu |
| `X` | `lucide-react` | Close buttons |
| `ChevronRight` | `lucide-react` | Navigation |

### Icon Styling

```tsx
// Default
<Icon className="h-5 w-5" />

// With color
<Icon className="h-5 w-5 text-primary" />

// Interactive
<Icon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />

// In buttons (auto-sized)
<Button>
  <Icon />
  Click Me
</Button>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **Interactive elements**: Clear focus indicators

#### Keyboard Navigation
```tsx
// Focus styles
focus-visible:outline-none 
focus-visible:ring-1 
focus-visible:ring-ring

// Disabled states
disabled:pointer-events-none 
disabled:opacity-50
```

#### ARIA Labels
```tsx
<a 
  href={siteConfig.linkedinUrl}
  aria-label="LinkedIn"
>
  <Linkedin className="h-5 w-5" />
</a>

<button aria-label="Close modal">
  <X />
</button>
```

#### Semantic HTML
```tsx
// Use semantic elements
<section id="hero">
<nav>
<main>
<footer>
<article>

// Proper heading hierarchy
<h1> → <h2> → <h3>
```

### Reduced Motion

Respects user preference for reduced animations:

```tsx
@media (prefers-reduced-motion: reduce) {
  /* Disable animations */
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

### Screen Reader Support

```tsx
// Hidden content for screen readers
<VisuallyHidden>
  Additional context for screen readers
</VisuallyHidden>

// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Form Accessibility

```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

<Label htmlFor="email">Email</Label>
<Input 
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <p id="email-error" role="alert">
    {errors.email.message}
  </p>
)}
```

---

## Performance

### Performance Tier Detection

Automatically adapts rendering based on device capabilities:

```tsx
// src/lib/performance.ts
export type PerformanceTier = 1 | 2;

export function detectPerformanceTier(): PerformanceTier {
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency || 1;

  if (memory !== undefined && memory < 4) return 2;
  if (cores < 4) return 2;
  
  return 1;
}
```

**Tier 1**: Full effects with blur and distortion  
**Tier 2**: Solid backgrounds, no blur or distortion

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src={siteConfig.avatarImage}
  alt={siteConfig.name}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 256px, 320px"
  priority  // For above-fold images
/>
```

### Code Splitting

```tsx
// Dynamic imports for heavy components
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { ssr: false }
);
```

### Font Loading Strategy

```tsx
// next/font with swap display
export const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',  // Prevent FOIT
});
```

### CSS Optimization

```tsx
// Tailwind 4.0 with PostCSS
// Automatic purging and minification
// CSS variables for dynamic theming
```

### Bundle Size

Key dependencies and their purposes:

| Package | Size | Purpose |
|---------|------|---------|
| `next` | Core | Framework |
| `framer-motion` | ~30KB | Animations |
| `lucide-react` | Tree-shakeable | Icons |
| `next-intl` | ~15KB | i18n |
| `swiper` | ~45KB | Carousels |

---

## Internationalization

### Framework
**next-intl** for type-safe, performant i18n.

### Supported Locales

- **en** - English (default)
- **th** - Thai

### Translation Files

```
messages/
  en.json
  th.json
```

### Usage

```tsx
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');
  
  return (
    <h1>{t('roleLine')}</h1>
  );
}
```

### Translation Structure

```json
{
  "hero": {
    "intro": "Hello, I'm",
    "roleLine": "Full Stack Developer & Product Engineer",
    "tagline": "Building scalable web applications...",
    "ctaPrimary": "View My Work",
    "ctaSecondary": "Get In Touch"
  }
}
```

### Locale Switching

```tsx
import { useLocale } from 'next-intl';

const locale = useLocale();
// 'en' or 'th'
```

### Font Switching

Automatically switches to Sarabun for Thai content:

```css
html[lang="th"] body {
  font-family: var(--font-sarabun), var(--font-sans);
}
```

### Routing

```
/en/          → English homepage
/th/          → Thai homepage
/en/projects  → English projects
/th/projects  → Thai projects
```

---

## Utilities

### `cn()` - Class Name Utility

Combines `clsx` and `tailwind-merge` for intelligent class merging:

```tsx
import { cn } from '@/lib/utils';

// Merges classes intelligently, resolving conflicts
cn('px-4 py-2', 'px-6')  // → 'py-2 px-6'

// Common pattern
<div className={cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  className  // Allow external overrides
)}>
```

### Helper Functions

```tsx
// Format ISO date to readable format
formatDate('2024-03-15')  // → 'Mar 2024'

// Get initials from name
getInitials('John Doe')  // → 'JD'
```

---

## File Organization

```
src/
├── app/                      # Next.js 15 app router
│   └── [locale]/            # Localized routes
├── components/
│   ├── glass/               # Glass morphism system
│   ├── layout/              # Layout components
│   ├── sections/            # Page sections
│   ├── shared/              # Shared components
│   ├── ui/                  # shadcn/ui components
│   └── timeline/            # Timeline components
├── data/                    # Static data, config
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities, helpers
│   ├── fonts.ts
│   ├── springs.ts
│   ├── performance.ts
│   └── utils.ts
├── styles/
│   └── globals.css          # Design tokens, base styles
└── types/                   # TypeScript types
```

---

## Quick Reference

### Common Patterns

**Responsive Container:**
```tsx
<div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
```

**Section Wrapper:**
```tsx
<section className="section-padding">
```

**Glass Card:**
```tsx
<GlassCard elevation="e2" hover>
  <h3>Title</h3>
  <p>Content</p>
</GlassCard>
```

**Animated Element:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

**Translated Text:**
```tsx
const t = useTranslations('section');
<h1>{t('title')}</h1>
```

### Design Tokens Reference

```css
/* Colors */
var(--color-primary)
var(--color-accent)
var(--color-background)
var(--color-foreground)

/* Fonts */
var(--font-sans)
var(--font-mono)
var(--font-sarabun)

/* Radius */
var(--radius-lg)

/* Glass */
var(--glass-e2-fill)
var(--glass-e2-border)
var(--glass-e2-shadow)

/* Animations */
var(--animate-fade-up)
var(--animate-fade-in)
```

---

## Development Guidelines

### Component Development

1. **Use composition over configuration**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Title</CardTitle>
     </CardHeader>
   </Card>
   ```

2. **Prefer semantic HTML**
   ```tsx
   <section>, <article>, <nav>, <main>
   ```

3. **Support reduced motion**
   ```tsx
   const reducedMotion = useReducedMotion();
   const Wrapper = reducedMotion ? 'div' : motion.div;
   ```

4. **Make components i18n-ready**
   ```tsx
   const t = useTranslations('componentName');
   ```

5. **Follow accessibility guidelines**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management

### Styling Guidelines

1. **Use design tokens** instead of hardcoded values
   ```tsx
   ✅ bg-background text-foreground
   ❌ bg-white text-black
   ```

2. **Leverage Tailwind utilities**
   ```tsx
   ✅ <div className="flex items-center gap-4">
   ❌ <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
   ```

3. **Use `cn()` for conditional classes**
   ```tsx
   className={cn('base-class', isActive && 'active-class')}
   ```

4. **Prefer utility classes over custom CSS**
   - Only use custom CSS for complex animations or one-off effects

### Performance Guidelines

1. **Lazy load heavy components**
   ```tsx
   const Heavy = dynamic(() => import('./Heavy'), { ssr: false });
   ```

2. **Optimize images with Next.js Image**
   ```tsx
   <Image src="..." alt="..." fill sizes="..." />
   ```

3. **Use performance tier detection**
   ```tsx
   const tier = detectPerformanceTier();
   if (tier === 1) enableEffects();
   ```

4. **Minimize client-side JavaScript**
   - Use RSC when possible
   - Mark interactive components with "use client"

---

## Conclusion

This design system provides a comprehensive foundation for building a modern, accessible, and performant portfolio website. It balances aesthetic appeal with technical excellence through:

- **Consistent visual language** with design tokens
- **Premium glassmorphism** with performance adaptation
- **Smooth animations** respecting user preferences
- **Bilingual support** for global reach
- **Accessibility-first** approach
- **Developer experience** with TypeScript and modern tooling

For questions or contributions, refer to the component documentation in:
- `src/components/glass/README.md` - Glass system details
- `.storybook/` - Component stories and examples
- `docs/` - Additional documentation

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Maintained by:** Portfolio Development Team
