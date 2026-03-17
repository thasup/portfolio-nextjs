# Liquid Glass System

A premium glass morphism design system built on CSS variables, Framer Motion, and performance-aware rendering.

## Quick Start

```tsx
import { GlassCard, GlassPanel, GlassButton, GlassModal } from '@/components/glass';

// Basic glass card
<GlassCard elevation="e2">
  <p>Content with glass effect</p>
</GlassCard>

// Interactive card with hover
<GlassCard elevation="e2" hover>
  <p>Hovers up on mouse over</p>
</GlassCard>

// Card with specular highlight
<GlassCard elevation="e3" specular>
  <p>Tracks mouse for dynamic shine</p>
</GlassCard>
```

## Components

### GlassCard

Interactive card with optional hover and specular effects.

**Props:**

- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` - Visual depth (default: 'e2')
- `hover?: boolean` - Enable hover lift animation (default: false)
- `interactive?: boolean` - Make card interactive with motion (default: false)
- `specular?: boolean` - Enable mouse-tracking highlight (default: false)

### GlassPanel

Static panel for containers and sections.

**Props:**

- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` - Visual depth (default: 'e3')
- `specular?: boolean` - Enable mouse-tracking highlight (default: false)

### GlassButton

Button with glass styling and spring animations.

**Props:**

- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` - Visual depth (default: 'e2')
- `specular?: boolean` - Enable mouse-tracking highlight (default: false)
- `disabled?: boolean` - Disable button (default: false)
- `type?: 'button' | 'submit' | 'reset'` - Button type (default: 'button')
- `distortion?: boolean` - Enable liquid distortion effect (default: false)
- `distortionIntensity?: 'low' | 'medium' | 'high'` - Control distortion strength (default: 'low')
- `shine?: boolean` - Add specular edge highlight (default: false)

### GlassModal

Modal dialog with glass effect and AnimatePresence.

**Props:**

- `open: boolean` - Control modal visibility
- `onClose: () => void` - Close callback
- `elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5'` - Visual depth (default: 'e4')
- `distortion?: boolean` - Enable liquid distortion effect (default: false)
- `distortionIntensity?: 'low' | 'medium' | 'high'` - Control distortion strength (default: 'high')
- `shine?: boolean` - Add specular edge highlight (default: false)

## Liquid Distortion

The system now supports organic "liquid" distortion effects using SVG filters. This creates a realistic glass refraction look.

### Enabling Distortion

Add the `distortion` prop to any glass component:

```tsx
<GlassCard elevation="e2" distortion>
  <p>Liquid glass effect enabled</p>
</GlassCard>
```

### Intensity Levels

Control the strength of the distortion with `distortionIntensity`:

- `'low'` (Default for cards): Subtle texture, good for text legibility.
- `'medium'` (Default for panels): Balanced liquid look.
- `'high'` (Default for modals/hero): Dramatic refraction.

```tsx
<GlassCard distortion distortionIntensity="high">
  <h1>Hero Title</h1>
</GlassCard>
```

### Edge Shine

Add a specular edge highlight with the `shine` prop:

```tsx
<GlassCard distortion shine>
  <p>Glass with refractive edges</p>
</GlassCard>
```

### Performance & Fallbacks

- **Tier 1 Devices**: Full liquid distortion (SVG filters + blur).
- **Tier 2 Devices**: Standard glass blur (no distortion).
- **Low-end / Legacy**: Solid semi-transparent background.

Distortion is automatically disabled on low-power devices to maintain 60fps.

## Elevation Scale

- **E1**: Subtle - Minimal blur and depth for background elements
- **E2**: Default - Balanced appearance for most UI cards
- **E3**: Medium - Moderate depth for panels and containers
- **E4**: Strong - High depth for modals and overlays
- **E5**: Intense - Maximum depth for critical focus elements

## Performance

The system automatically adapts to device capabilities:

- **Tier 1 (High-performance)**: Full glass effects with blur
- **Tier 2 (Low-performance)**: Solid backgrounds without blur

Detection is based on:

- Device memory < 4GB → Tier 2
- CPU cores < 4 → Tier 2
- Otherwise → Tier 1

## Accessibility

- Respects `prefers-reduced-motion` - disables animations when requested
- Specular effects disabled with reduced motion
- Spring physics disabled with reduced motion
- Fallback to instant transitions

## Browser Support

- Modern browsers with backdrop-filter support get full effects
- Older browsers automatically fall back to solid backgrounds
- Feature detection via `@supports` queries

## Theming

Glass tokens automatically adapt to light/dark mode via CSS variables:

```css
/* Light mode */
--glass-fill-light: color-mix(in oklch, var(--color-background) 70%, transparent);

/* Dark mode (.dark class) */
--glass-fill-light: color-mix(in oklch, var(--color-background) 60%, transparent);
```

## Customization

Override CSS variables in `globals.css`:

```css
:root {
  --glass-blur-medium: 16px; /* Increase blur */
  --glass-fill-medium: color-mix(...); /* Adjust opacity */
}
```

## Spring Configurations

Three spring presets available from `@/lib/springs`:

- `SPRING_GENTLE`: Smooth, slow animations (cards, panels)
- `SPRING_BUOYANT`: Bouncy, playful animations (interactive elements)
- `SPRING_SNAPPY`: Fast, crisp animations (buttons, toggles)

## Best Practices

1. Use E2-E3 for most content cards
2. Reserve E4-E5 for modals and critical UI
3. Enable `hover` on clickable cards
4. Use `specular` sparingly for premium feel
5. Test on low-end devices (Tier 2 fallback)
