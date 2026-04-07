# Contract: Glass Components with Distortion Support

**Feature**: 007-liquid-distortion-enhancement  
**Date**: 2026-03-17  
**Version**: 1.0.0

## Overview

This contract defines the extended API surface for Glass components (GlassCard, GlassPanel, GlassButton, GlassModal) with liquid distortion enhancement support.

## GlassCard API

### Interface

```typescript
interface GlassCardProps {
  // Existing props (unchanged from 006)
  elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5';
  hover?: boolean;
  interactive?: boolean;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  
  // NEW: Distortion props
  distortion?: boolean;                          // Default: false
  distortionIntensity?: 'low' | 'medium' | 'high';  // Default: 'medium'
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;                               // Default: false
}
```

### Behavior Contract

**When `distortion={false}` (default)**:
- Component renders existing simple structure (backward compatible)
- No extra DOM layers created
- Performance identical to 006 implementation
- SVG filters not applied

**When `distortion={true}` on Tier 1 device**:
- Component renders 4-layer DOM structure:
  1. `.liquidGlass-wrapper` - container
  2. `.liquidGlass-effect` - backdrop-filter + SVG filter
  3. `.liquidGlass-tint` - semi-transparent color
  4. `.liquidGlass-shine` (if `shine={true}`) - edge highlights
  5. `.liquidGlass-content` - children
- SVG filter applied: `filter: url(#glass-distortion-{intensity})`
- Frame rate maintained at 60fps (tested on iPhone 12+, MacBook Air M1)

**When `distortion={true}` on Tier 2 device**:
- Distortion automatically disabled (performance tier detection)
- Falls back to `distortion={false}` behavior
- No visual difference from Tier 1 with distortion=false

**When `shine={true}`**:
- `.liquidGlass-shine` layer added regardless of distortion state
- Inset box-shadows create edge highlights
- Light mode: `inset 2px 2px 1px rgba(255,255,255,0.5)`
- Dark mode: `inset 2px 2px 1px rgba(255,255,255,0.3)`

### Example Usage

```tsx
// Basic distortion
<GlassCard distortion>
  <p>Content</p>
</GlassCard>

// Custom intensity
<GlassCard distortion distortionIntensity="high">
  <p>Dramatic effect</p>
</GlassCard>

// With shine layer
<GlassCard distortion shine>
  <p>Extra polish</p>
</GlassCard>

// Advanced customization
<GlassCard 
  distortion 
  distortionIntensity="medium"
  customDistortionConfig={{ scale: 120, seed: 10 }}
>
  <p>Fine-tuned</p>
</GlassCard>

// Backward compatible (no distortion)
<GlassCard elevation="e2" hover>
  <p>Works exactly as before</p>
</GlassCard>
```

### Breaking Changes

**NONE**. All new props are optional with safe defaults. Existing usage remains unchanged.

---

## GlassPanel API

### Interface

```typescript
interface GlassPanelProps {
  // Existing props (unchanged from 006)
  elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5';
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  
  // NEW: Distortion props
  distortion?: boolean;                          // Default: false
  distortionIntensity?: 'low' | 'medium' | 'high';  // Default: 'medium'
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;                               // Default: false
}
```

### Behavior Contract

Identical to GlassCard (see above), except:
- Default `elevation` is `'e3'` instead of `'e2'`
- No `hover` or `interactive` props (panels are static)

### Example Usage

```tsx
<GlassPanel distortion distortionIntensity="low">
  <nav>Navigation content</nav>
</GlassPanel>
```

---

## GlassButton API

### Interface

```typescript
interface GlassButtonProps {
  // Existing props (unchanged from 006)
  elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5';
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  
  // NEW: Distortion props
  distortion?: boolean;                          // Default: false
  distortionIntensity?: 'low' | 'medium' | 'high';  // Default: 'medium'
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;                               // Default: false
}
```

### Behavior Contract

Identical to GlassCard, with button-specific considerations:
- Distortion effect does NOT interfere with click events
- `:focus-visible` ring appears on top layer (z-index: 3)
- `:disabled` state grays out all layers equally
- Framer Motion spring animations work alongside distortion

### Example Usage

```tsx
<GlassButton distortion onClick={handleClick}>
  Click me
</GlassButton>
```

---

## GlassModal API

### Interface

```typescript
interface GlassModalProps {
  // Existing props (unchanged from 006)
  isOpen: boolean;
  onClose: () => void;
  elevation?: 'e1' | 'e2' | 'e3' | 'e4' | 'e5';
  className?: string;
  children?: React.ReactNode;
  
  // NEW: Distortion props
  distortion?: boolean;                          // Default: false
  distortionIntensity?: 'low' | 'medium' | 'high';  // Default: 'medium'
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;                               // Default: false
}
```

### Behavior Contract

Identical to GlassCard, with modal-specific considerations:
- Distortion applied to modal content, NOT backdrop overlay
- AnimatePresence exit animation works with distortion layers
- Recommended intensity: `'high'` for dramatic modal effect

### Example Usage

```tsx
<GlassModal 
  isOpen={isOpen} 
  onClose={handleClose}
  distortion
  distortionIntensity="high"
  shine
>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</GlassModal>
```

---

## Shared Behavior Guarantees

### Performance

- **Frame rate**: 60fps on Tier 1 devices (iPhone 12+, MacBook Air M1+, mid-range Android)
- **Frame time**: <16ms per frame during scroll/interaction
- **Memory**: <5MB additional heap allocation for entire distortion system
- **Paint time**: <5ms in Chrome DevTools Performance panel

### Accessibility

- **Contrast**: WCAG 2.1 AA compliant (4.5:1 minimum) - content layer undistorted
- **Keyboard**: Focus indicators visible on top layer (z-index: 3)
- **Screen readers**: Semantic structure unchanged (layers are presentational)
- **Reduced motion**: Distortion static (no animated effects)

### Browser Support

- **Full support**: Chrome 89+, Safari 14+, Firefox 85+, Edge 90+
- **Graceful degradation**: Older browsers → backdrop-filter only → solid backgrounds
- **Feature detection**: Automatic via existing `supportsBackdropFilter()` and `usePerformanceTier()`

### Theme Support

- **Light mode**: Distortion + tint layers use light theme tokens
- **Dark mode**: Automatic token adjustment for enhanced appearance
- **Transitions**: Smooth theme changes (no flicker or visual artifacts)

---

## Version Compatibility

### With 006-liquid-glass-system

- **Minimum version**: Requires 006 fully implemented (Phases 1-8 complete)
- **Dependencies**: `usePerformanceTier`, `useReducedMotion`, `supportsBackdropFilter`
- **CSS tokens**: Requires `--glass-e{1-5}-fill`, `--glass-e{1-5}-border`, `--glass-e{1-5}-shadow`

### Migration Path

**From 006 to 007**: Zero code changes required.

```tsx
// Before (006)
<GlassCard elevation="e2" hover>
  <p>Content</p>
</GlassCard>

// After (007) - same code works
<GlassCard elevation="e2" hover>
  <p>Content</p>
</GlassCard>

// After (007) - opt-in to distortion
<GlassCard elevation="e2" hover distortion>
  <p>Content</p>
</GlassCard>
```

---

## Testing Requirements

### Unit Tests

- Component renders with `distortion={true}`
- Component renders with `distortion={false}` (backward compat)
- Props are correctly passed to underlying elements
- Conditional rendering logic (Tier 1 vs Tier 2)

### Integration Tests

- SVG filter IDs correctly referenced
- Performance tier detection works
- Theme switching updates colors
- Reduced motion disables effects

### Visual Regression Tests

- Snapshot with distortion enabled (each intensity)
- Snapshot with distortion disabled
- Snapshot light vs dark mode
- Snapshot with shine layer

### Performance Tests

- Frame rate during scroll (60fps target)
- Memory allocation (<5MB increase)
- Paint/composite time (<5ms)

---

## Deprecation Policy

**No deprecations**. All existing API surface maintained.

Future enhancements may add:
- Animated distortion (mouse-reactive)
- Custom SVG filter composition
- WebGL-based distortion (opt-in)

These will be additive (new props) with backward compatibility guaranteed.
