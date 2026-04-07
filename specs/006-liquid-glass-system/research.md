# Research: Liquid Glass Global Design System

## Decision 1: Motion & Specular Regression Coverage

- **Decision**: Use Storybook visual regression with Chromatic (or Playwright trace) stories that exercise hover/press/specular highlight states while also snapshotting reduced-motion fallbacks.
- **Rationale**: Storybook isolates each glass primitive, so Chromatic can diff specular gradients and motion endpoints without running full pages. Playwright captures interaction timelines (hover, mouse move) and verifies CSS custom properties applied for specular position.
- **Alternatives considered**:

  1. **Percy on full pages** – rejected because backdrop-filter jitter across sections causes noisy diffs and slows pipelines.
  2. **Manual QA only** – rejected; spec demands ongoing guardrails as components evolve.

## Decision 2: Performance Tier Detection Heuristics

- **Decision**: Implement `usePerformanceTier()` with a one-time `requestIdleCallback` probe that measures `navigator.hardwareConcurrency`, `deviceMemory`, and a short `performance.now()` loop to detect long frame time; Tier 2 is assigned when cores ≤4 **or** deviceMemory ≤3GB **or** loop exceeds 8ms.
- **Rationale**: Lightweight synchronous heuristics keep hook cost under 2ms and align with Lighthouse-friendly practices. Setting `document.documentElement.dataset.tier` enables pure CSS fallbacks defined in the spec.
- **Alternatives considered**:

  1. **Server-side UA sniffing** – unreliable across devices, complicates CDN caching.
  2. **Full FPS measurement via rAF averaging** – more accurate but takes >500ms and risks layout jank.

## Decision 3: Tailwind CSS 4 Token Strategy

- **Decision**: Continue using CSS custom properties in `globals.css` and expose them via Tailwind using the new `@theme` declarations plus utility classes (e.g., `bg-[var(--surface-e2-fill)]`).
- **Rationale**: Tailwind v4 leans on CSS variables; keeping tokens in globals allows both plain CSS (for glass primitives) and utility classes (for legacy components) without duplicating color math.
- **Alternatives considered**:

  1. **Custom Tailwind plugin** to generate `glass-elevation-*` utilities – more code, less flexibility for bespoke components.
  2. **Inline style objects** – scattershot and harder to theme across light/dark.

## Decision 4: shadcn/ui Integration

- **Decision**: Keep shadcn-based primitives (Button, Dialog) but wrap them with glass components so the underlying focus states/focus rings stay intact; avoid editing shadcn source files.
- **Rationale**: shadcn already handles accessibility and keyboard interactions. Wrapping ensures glass surfaces inherit the tokens without forking vendor code.
- **Alternatives considered**:

  1. **Fork shadcn components** – high maintenance whenever upstream updates land.
  2. **Replace with custom components** – would duplicate a11y logic and slow delivery.

## Decision 5: Framer Motion Springs

- **Decision**: Export literal config objects (`SPRING_GENTLE`, `SPRING_BUOYANT`, `SPRING_SNAPPY`) plus a `pressMotionProps` helper that toggles to CSS-only transforms under `prefers-reduced-motion`.
- **Rationale**: Shared configs eliminate drift. Wrapping press/hover handlers ensures we never animate blur radius (per constraint) and allows hook-based disabling on Tier 2 devices.
- **Alternatives considered**:

  1. **Per-component variants** – would make tuning inconsistent across sections.
  2. **CSS transitions only** – fails FR-002 requirement for physical springs.

## Decision 6: next-themes for Dark/Light Alignment

- **Decision**: Continue using `next-themes` to sync `class="dark"` toggle and hydrate tokens; ensure glass components subscribe to theme only via CSS (no JS re-render), relying on class-based overrides defined in `globals.css`.
- **Rationale**: Prevents hydration mismatches and keeps spec’s “pure CSS theming” rule. `next-themes` already exists in the repo, so no new dependency footprint.
- **Alternatives considered**:

  1. **Custom theme context** – redundant and adds extra renders.
  2. **Media-query-only** – would break manual toggle UX already shipping.

## Decision 7: next-intl & Bilingual Content

- **Decision**: Keep all copy in `messages/*` and ensure the new components accept `children` instead of hardcoded strings so translations remain intact. Add a quickstart note reminding teams to run `pnpm next-intl extract` (if used) after copy changes.
- **Rationale**: Maintains Principle IV and avoids regression where new components ship English-only placeholders.
- **Alternatives considered**:

  1. **Inline English microcopy** inside glass components – fails bilingual mandate.
  2. **Duplicated component variants per locale** – unnecessary complexity.

## Decision 8: Radix UI Accessibility Alignment

- **Decision**: For interactive glass pieces (buttons, modal, navbar), continue composing Radix primitives (Dialog, Switch, Tooltip) beneath the glass wrappers so focus traps and aria attributes remain vendor-maintained.
- **Rationale**: Radix’ headless components already satisfy accessibility baselines; layering glass purely via CSS ensures we do not break semantics.
- **Alternatives considered**:

  1. **Custom popover/modal logic** – error-prone and violates Principle II (fast, premium delivery).
  2. **Third-party glass UI kits** – forbidden by spec (native implementation only).
