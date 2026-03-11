# Quickstart: Portfolio Website Rebuild

**Branch**: `001-portfolio-rebuild`
**Date**: 2026-03-08

## Prerequisites

- Node.js 20+ (check: `node --version`)
- npm 10+ (check: `npm --version`)
- Git

## Initial Setup

```bash
# 1. Switch to the feature branch
git checkout 001-portfolio-rebuild

# 2. Install dependencies (fresh install after package.json overhaul)
rm -rf node_modules package-lock.json
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your values:
#   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
#   NEXT_PUBLIC_SITE_URL=https://thanachon.me
```

## Development

```bash
# Start dev server
npm run dev
# Open http://localhost:3000
```

## Build (Static Export)

```bash
# Build and export to /out directory
npm run build

# Verify static output
ls out/
# Should contain: index.html, about/index.html, contact/index.html,
# projects/ai-event-platform/index.html, etc.
```

## Adding shadcn/ui Components

```bash
# Install a shadcn component (example: button)
npx shadcn@latest add button

# Components are added to src/components/ui/
# NEVER edit files in src/components/ui/ directly
# Extend via wrapper components in src/components/shared/
```

## Deployment (Netlify)

```bash
# Local preview with Netlify CLI (optional)
npx netlify-cli dev

# Deploy is automatic via git push to main branch
# Netlify reads netlify.toml for build config:
#   build command: npm run build
#   publish directory: out
```

## Project Structure Quick Reference

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router pages |
| `src/components/ui/` | shadcn/ui (do not edit) |
| `src/components/shared/` | Reusable primitives |
| `src/components/layout/` | Navbar, Footer, ScrollProgress |
| `src/components/sections/` | Home page sections |
| `src/components/timeline/` | Timeline sub-components |
| `src/components/projects/` | Project sub-components |
| `src/data/` | All content data (TypeScript) |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Utility functions |
| `src/styles/` | Global CSS (TailwindCSS v4) |
| `src/types/` | TypeScript type definitions |
| `public/images/` | Static images (all WebP) |

## Adding Content

### Add a new project

1. Create image directory: `public/images/projects/[slug]/`
2. Add hero image as `hero.webp`
3. Add screenshots as `screenshot-1.webp`, etc.
4. Edit `src/data/projects.ts` — add new `Project` entry
5. Run `npm run build` to verify `generateStaticParams()` picks up the new slug

### Add a timeline event

1. Edit `src/data/timelineEvents.ts` — add new `TimelineEvent` entry
2. Set `sortDate` for correct ordering
3. No build step needed beyond normal dev server reload

### Add a testimonial

1. (Optional) Add avatar to `public/images/testimonials/[name].webp`
2. Edit `src/data/testimonials.ts` — add new `Testimonial` entry
3. If no avatar, the component shows initials from `authorName`

### Update skills

1. Edit `src/data/skills.ts`
2. Add skills to existing clusters or add new clusters
3. Adjust `order` numbers if inserting between existing clusters

## Validation Checklist

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build (catches static export issues)
npm run build

# Lighthouse (run in Chrome DevTools on built site)
# Target: 95+ on Performance, Accessibility, Best Practices, SEO
```

## Common Issues

**"Image Optimization API not available for static export"**
→ `next.config.ts` must have `images: { unoptimized: true }`

**"Dynamic server usage" build error**
→ A component is using server-only APIs. All interactive components
must be `'use client'`. Check for `cookies()`, `headers()`, or
`searchParams` usage.

**Swiper "window is not defined"**
→ Swiper components must be dynamically imported with `ssr: false`:
```typescript
const SwiperComponent = dynamic(() => import('./SwiperComponent'), {
  ssr: false,
})
```

**Netlify form not detecting submissions**
→ Ensure the form has `data-netlify="true"` attribute and a hidden
`<input name="form-name" value="contact">`. Netlify parses the
post-processed HTML — the form must be present in the static output.
