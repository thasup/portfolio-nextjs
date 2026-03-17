# Contracts: Liquid Glass Components & Hooks

## 1. `GlassCard` Primitive

**File**: `src/components/glass/GlassCard.tsx`

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `elevation` | `1 \| 2 \| 3 \| 4 \| 5` | `2` | Maps to `[data-glass]` attribute to select blur/fill/border tokens. |
| `specular` | `boolean` | `elevation >= 2` | Enables `.glass-specular` class and pointer-driven highlight. |
| `as` | `'div' \| 'article' \| 'section' \| 'button'` | `'div'` | Render primitive. When `'button'`, ensures `type="button"` default. |
| `onClick` | `() => void` | `undefined` | Enables interactive state; triggers Framer Motion press animation. |
| `className` | `string` | `''` | Additional classes merged with `.glass-surface`. |
| `children` | `React.ReactNode` | required | Slot for card content. |

### Behavior

1. Applies `.glass-surface` plus `[data-glass]`.
2. Adds `.glass-specular` when `specular` true; pointer handlers throttle to rAF and respect reduced motion & tier 2.
3. Uses `motion.div` wrapper when `onClick` or hover animations required; `SPRING_GENTLE` for hover scale, `SPRING_SNAPPY` for press.
4. Respects `prefers-reduced-motion` and Tier 2 by falling back to static scale (1) and static highlight.

## 2. `GlassPanel`

**File**: `src/components/glass/GlassPanel.tsx`

- Extends `GlassCard` but defaults to `as="section"`, `elevation=2`, `specular=false`.
- Adds optional `bleed` boolean to allow background spreading beyond container with padding clamp.
- Provides `header`, `body`, `footer` slots via compound components or props.

## 3. `GlassButton`

**File**: `src/components/glass/GlassButton.tsx`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Maps to elevation 3 (primary) or 2 (secondary). |
| `href` | `string` | `undefined` | If provided, renders `next/link` anchor preserving `.glass-surface`. |
| `intent` | `{ category: string; label: string }` | optional | Sent to analytics helper on press. |
| `icon` | `React.ReactNode` | `undefined` | Render icon slot before label. |
| `loading` | `boolean` | `false` | Disables hover/press motion and shows spinner. |

Behavior: wraps shadcn `Button` for semantics; uses `SPRING_SNAPPY` on press, `SPRING_GENTLE` hover, respects reduced motion + Tier 2.

## 4. `GlassModal`

**File**: `src/components/glass/GlassModal.tsx`

Composes Radix Dialog root/portal/content.

- `backdropElevation = 5` (semi-opaque overlay) and `contentElevation = 4`.
- Props mirror shadcn Dialog (`open`, `onOpenChange`, `title`, `description`).
- Provides `actions` slot for CTAs; actions use `GlassButton` to maintain materiality.
- Enforces focus trap + aria per Radix; no additional event listeners beyond specular freeze.

## 5. `GlassNavbar`

**File**: `src/components/glass/GlassNavbar.tsx`

- Accepts `sections: Array<{ id: string; label: string }>` and `activeSection` string.
- Supports `onNavigate(id)` callback for smooth scroll.
- Elevation 3 surface with scroll-linked opacity (0 → 1) using `SPRING_GENTLE`; disabled for reduced motion.
- On Tier 2, replaces blur with solid fill per tokens.

## 6. `usePerformanceTier`

**File**: `src/lib/performance.ts`

Signature: `export function usePerformanceTier(): 1 | 2`

Behavior:

1. Runs client-side only (`useEffect`).
2. Schedules detection via `requestIdleCallback` (fallback `setTimeout`).
3. Heuristics: tier becomes 2 when any condition met:
   - `navigator.hardwareConcurrency <= 4`
   - `navigator.deviceMemory && deviceMemory <= 3`
   - Micro benchmark running 300k no-op loops exceeds 8ms
4. Sets `document.documentElement.dataset.tier` for CSS overrides.
5. Returns tier value so components can branch JS logic (e.g., skip pointer listeners).

## 7. `LiquidSprings`

**File**: `src/lib/springs.ts`

Exports:

```ts
export const SPRING_GENTLE = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } as const
export const SPRING_BUOYANT = { type: 'spring', stiffness: 200, damping: 20, mass: 1.0 } as const
export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 35, mass: 0.6 } as const
export const pressMotionProps = {
  whileTap: { scale: 0.98 },
  transition: SPRING_SNAPPY,
}
```

Reduced-motion guard: components wrap motion props with `useReducedMotion()` and skip `whileTap` when true.

## 8. Section Refactor Contracts

Each section under `src/components/sections/*` must consume the new primitives:

| Section | Component | Elevation | Specular | Motion |
| --- | --- | --- | --- | --- |
| Navbar | `GlassNavbar` | 3 | No | `SPRING_GENTLE` opacity scroll |
| Hero trust badges | `GlassCard` | 1 | No | Static |
| Timeline header | `GlassPanel` | 1 | No | `SPRING_BUOYANT` entrance |
| Timeline cards | `GlassCard` | 2 | Yes | `SPRING_BUOYANT` entrance + `SPRING_GENTLE` hover |
| Projects card | `GlassCard` | 2/3 | Yes | `SPRING_BUOYANT` + `SPRING_GENTLE` |
| Skills panel | `GlassPanel` | 1 | No | `SPRING_BUOYANT` |
| Testimonials slide | `GlassPanel` | 2 | No | Swiper-managed |
| Value prop card | `GlassCard` | 1 | No | `SPRING_BUOYANT` |
| Contact intent selector | `GlassButton` group | 2 | No | `SPRING_SNAPPY` press |
| Modal/backdrop | `GlassModal` | 4/5 | Yes (static) | `SPRING_BUOYANT` open |

## 9. Analytics & Measurement

- Reuse `trackEvent` helper for significant interactions (`GlassButton` presses, contact intents).
- Do **not** add new GA events unless they inform success signals defined in plan (hover/intent, conversion).

## 10. Documentation Hooks

- Update `quickstart.md` after any API change to glass primitives.
- When adding new elevations or tokens, modify both `globals.css` and Tailwind `@theme` definitions; update this contract file accordingly.
