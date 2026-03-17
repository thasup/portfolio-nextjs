# Quickstart: Liquid Glass System

## Prerequisites

1. **Node & PNPM/NPM**: Node 20+ with the repo’s package manager (npm) already installed.
2. **Environment**: Copy `.env.local.example` to `.env.local` (no new vars required for this feature).
3. **Dependencies**: Run `npm install` at repo root if you have not pulled the latest packages.

## Local Development

```bash
npm run dev
```

- Starts Next.js App Router with Turbopack.
- Visit `http://localhost:3000` and toggle light/dark using the existing theme switch to verify token propagation.
- Use DevTools → Rendering → Emulate CSS prefers-reduced-motion to confirm fallbacks.

## Implementing the Liquid Glass Tokens

1. Update `src/styles/globals.css` with the primitive + semantic tokens from the spec (blur, fill, border, shadows, specular, springs).
2. Add `[data-glass]` attribute rules and `.glass-surface` utility classes, including `@supports not (backdrop-filter)` fallback.
3. Wire Tailwind v4 `@theme` declarations to expose tokens for legacy utility usage.

## Creating Glass Components

1. **Directory**: `src/components/glass/` containing `GlassCard`, `GlassPanel`, `GlassButton`, `GlassModal`, `GlassNavbar`, plus `index.ts` barrel.
2. **Props**:
   - `elevation` default 2; enforces `data-glass` attribute.
   - `specular` defaults to `elevation >= 2`; toggles `.glass-specular` class.
   - `onClick` + `as` support to build interactive variants.
3. **Motion**:
   - Import `SPRING_GENTLE`, `SPRING_BUOYANT`, `SPRING_SNAPPY` from `src/lib/springs.ts`.
   - Press animation uses `SPRING_SNAPPY`; hover uses `SPRING_GENTLE` with reduced-motion guard.
4. **Specular highlight**:
   - Attach pointer listeners only on desktop + Tier 1.
   - Use CSS vars `--specular-x/y` on `.glass-specular::before`.

## Performance & Accessibility

1. Implement `usePerformanceTier()` in `src/lib/performance.ts`:
   - Run on client mount using `requestIdleCallback` or fallback `setTimeout`.
   - Measure `navigator.hardwareConcurrency`, `navigator.deviceMemory`, and a micro benchmark.
   - Apply `document.documentElement.dataset.tier = "2"` when heuristics flag low capability.
2. Respect `useReducedMotion()` (already in repo) to disable motion + specular updates.
3. Enforce ≤4 simultaneous `.glass-surface` layers per viewport (e.g., degrade card hover when modal open).

## Testing & QA

1. **Lint**: `npm run lint` before every commit.
2. **Storybook visual regression** (Chromatic or Playwright):
   - Create stories per glass component with light/dark, Tier 1/2, and reduced-motion controls.
   - Use Chromatic GitHub check as merge gate to catch visual drift.
3. **Lighthouse CI**:
   - Add `.lighthouserc.json` from spec root and wire GitHub Action to run 3 passes per build.
4. **Manual scenarios**:
   - Desktop pointer specular highlight.
   - Mobile static highlight.
   - Firefox/backdrop-filter disabled fallback.

## Rollout Order

1. Ship core tokens + primitives.
2. Migrate sections in priority order: Navbar → Timeline → Hero → Projects → Skills → Testimonials → Value Prop → Contact CTA.
3. Track regressions with Chromatic/Lighthouse before moving to next section.

## Troubleshooting

- **Specular jitter**: Ensure pointer events throttled to `requestAnimationFrame` and clamp positions inside element bounds.
- **Performance tier not applying**: Confirm the hook runs only client-side and `document.documentElement.dataset.tier` exists before component render.
- **Blur disabled everywhere**: Check `[data-tier="2"]` overrides are not globally applied (remove manual data attributes from HTML tag during dev testing).
