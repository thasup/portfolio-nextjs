# Data Model: Liquid Glass System

## Entity Map

| Entity | Description | Key Fields / Attributes | Relationships |
| --- | --- | --- | --- |
| `GlassTokenPrimitive` | CSS variables defined in `src/styles/globals.css` representing blur, fills, borders, shadows, specular intensity, and animation timings. | `--glass-blur-*`, `--glass-fill-*`, `--glass-border-*`, `--glass-shadow-*`, `--spring-*`, `--glass-specular-intensity` | Feeds semantic tokens and Tailwind utilities. Overrides exist for `.dark` and `[data-tier="2"]` contexts. |
| `GlassSemanticSurface` | Elevation-specific alias tokens (E1–E5). | `--surface-e{n}-blur/fill/border`, `data-glass="n"` mapping to `--_blur`, `--_fill`, `--_border` | Consumed by glass components via `[data-glass]` attributes and `.glass-surface` class. |
| `GlassComponentPrimitive` | Base React primitive (GlassCard) applying `.glass-surface`, handling `elevation`, `specular`, hover/press springs, and fallback detection. | Props: `elevation`, `specular`, `children`, `className`, `onClick`, `as`, motion variants, specular CSS vars | Extended by `GlassPanel`, `GlassButton`, `GlassModal`, `GlassNavbar`. |
| `GlassPanel` | Section-wide container variant with full-width layout, supports gradient borders and layered content slots. | Props: `elevation`, `padding`, `bleed`, `as`, `children` | Wraps Section components (Timeline, Value Prop, Testimonials). |
| `GlassButton` | Interactive CTA with buoyant hover and snappy press states. | Props: `variant` (primary/secondary), `elevation` (default 3/2), `icon`, `href/onClick`, `disabled`, `intent` analytics payload | Composes shadcn Button for semantics; uses `SPRING_SNAPPY`. |
| `GlassModal` | Elevation 4 container plus Elevation 5 backdrop. | Props: `open`, `onOpenChange`, `title`, `description`, `children`, `footer`, `size` | Built over Radix Dialog; interacts with `GlassCard` tokens. |
| `GlassNavbar` | Scroll-reactive nav using Elevation 3 surface; opacity adjusts via scroll progress. | Props: `sections`, `activeSection`, `onNavigate`, `variant` | Reads `usePerformanceTier` to disable expensive shadows on Tier 2. |
| `SpecularHighlightController` | JS utility hooking pointer events to set `--specular-x/y` custom properties. | Fields: throttled rAF handler, tier-aware toggles, reduced-motion guard | Attached to components with `specular` enabled and `data-tier != 2`. |
| `usePerformanceTier` Hook | Client hook returning tier (1 or 2) and mutating `document.documentElement.dataset.tier`. | Internal state: `tier`, heuristics config (cores, memory, idle task duration) | Referenced by glass components to branch animations and specular logic. |
| `LiquidSprings` | Shared animation configs exported from `src/lib/springs.ts`. | `SPRING_GENTLE`, `SPRING_BUOYANT`, `SPRING_SNAPPY`, helper `pressMotionProps` | Imported by glass components and section refactors. |
| `SectionRefactorTargets` | Existing sections to migrate (Navbar, Hero, Timeline, Projects, Skills, Testimonials, ValueProp, ContactCTA). | Field per section: `elevation`, `specular`, `spring usage`, `fallback notes` | Each references relevant glass component variant and tokens. |

## State & Transitions

- **Specular highlight**: transitions between pointer positions via CSS custom properties updated at most 30fps. Falls back to static gradient when `prefers-reduced-motion` or Tier 2.
- **Performance tier**: Initialized on client mount. Tier 1 keeps blur tokens; Tier 2 zeroes blur and increases fill to maintain contrast.
- **Glass elevation selection**: Each component sets `data-glass` attribute; CSS ensures consistent blur/fill/border combos. Elevation changes trigger corresponding motion (buoyant entrance, gentle hover, snappy press) and shadows.

## Validation Rules

1. **Layer cap**: Maximum four simultaneous `.glass-surface` elements with backdrop-filter active per viewport. Implementation must enforce via layout constraints (e.g., flattening nested cards on mobile).
2. **Contrast**: Text inside glass surfaces must use existing typography tokens ensuring WCAG AA; evaluate using current `text-foreground` / `text-secondary` palette.
3. **Reduced motion**: `useReducedMotion` hook must disable non-essential spring animations, convert entrance transitions to opacity fades, and freeze specular highlight.
4. **Fallback support**: `@supports not (backdrop-filter)` branch provides solid background + border tokens, guaranteeing Firefox/Safari compliance.
5. **Performance tier**: When Tier 2 detected, components must refrain from applying `backdrop-filter` blur (0px) and increase fill opacity as defined in spec tokens.

## Derived Data

- **Elevation map**: Provided table in spec translates to component defaults; store as JSON (optional) or TypeScript map for enforcement.
- **Token exposures**: Tailwind `@theme` can expose `glass-blur`, `glass-fill`, etc., to allow transitional refactor of legacy components without rewriting CSS.

## Open Questions / Clarifications

1. **Automated regression coverage**: Should Chromatic + Playwright be part of CI before merge or optional? (Recommended default: merge-blocking GitHub action.)
2. **Specular pointer events on touch**: Should we detect pointer type (mouse vs touch) instead of relying solely on Tier 2 + reduced-motion? Need confirmation to avoid unnecessary listeners on hybrid devices.
3. **Layer cap enforcement**: Need UX decision on which sections degrade first when >4 surfaces would overlap (e.g., disable card hover glass when modal open?).
