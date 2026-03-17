# Data Model: Liquid Distortion Enhancement

**Feature**: 007-liquid-distortion-enhancement  
**Date**: 2026-03-17  
**Status**: Complete

## Entity Definitions

### 1. DistortionConfig

**Purpose**: Configuration object defining SVG filter parameters for liquid glass distortion effect.

**Fields**:
- `baseFrequency`: [number, number] - Turbulence noise frequency in X and Y dimensions
  - Valid range: [0.001, 0.05]
  - Typical values: [0.005, 0.005] (low), [0.01, 0.01] (medium), [0.015, 0.015] (high)
- `scale`: number - Displacement magnitude for feDisplacementMap
  - Valid range: 50-250
  - Typical values: 75 (low), 100 (medium), 150 (high)
- `seed`: number - Turbulence pattern seed for deterministic noise
  - Valid range: 1-20
  - Default: 5
- `specularConstant`: number - Specular lighting intensity
  - Valid range: 0.5-2.0
  - Typical values: 0.8 (low), 1.0 (medium), 1.2 (high)
- `surfaceScale`: number - Surface depth for lighting calculations
  - Valid range: 1-10
  - Default: 5

**Validation Rules**:
- `baseFrequency` values must be positive and <= 0.05 (performance constraint)
- `scale` must be >= 50 to be visually perceptible
- All numeric fields must be finite numbers

**Relationships**:
- Referenced by `DistortionIntensityPreset` enum
- Used by `GlassSVGFilters` component to generate filter definitions

**Example**:
```typescript
const mediumDistortion: DistortionConfig = {
  baseFrequency: [0.01, 0.01],
  scale: 100,
  seed: 5,
  specularConstant: 1.0,
  surfaceScale: 5,
};
```

---

### 2. DistortionIntensity

**Purpose**: Enum/Union type for predefined distortion intensity presets.

**Values**:
- `'low'` - Subtle distortion for ValueProp cards, Timeline cards
- `'medium'` - Balanced distortion for panels, default intensity (DEFAULT)
- `'high'` - Dramatic distortion for hero sections, modals

**Validation Rules**:
- Must be one of the three string literals
- Case-sensitive

**Relationships**:
- Maps to `DistortionConfig` via `DISTORTION_PRESETS` constant
- Used as prop type in Glass component interfaces

**Type Definition**:
```typescript
type DistortionIntensity = 'low' | 'medium' | 'high';
```

---

### 3. GlassComponentProps (Extended)

**Purpose**: Extended props interface for Glass components (GlassCard, GlassPanel, GlassButton, GlassModal) with distortion support.

**New Fields** (added to existing interfaces):
- `distortion?: boolean` - Enable/disable distortion effect
  - Default: false (backward compatible)
  - When true, renders 4-layer DOM structure
- `distortionIntensity?: DistortionIntensity` - Preset intensity level
  - Default: 'medium'
  - Only used when `distortion={true}`
- `customDistortionConfig?: Partial<DistortionConfig>` - Override preset config
  - Optional advanced customization
  - Merged with preset config
- `shine?: boolean` - Enable/disable edge highlight layer
  - Default: false
  - Creates inset box-shadow on `.liquidGlass-shine` layer

**Existing Fields** (unchanged):
- `elevation?: GlassElevation` - Depth level (e1-e5)
- `hover?: boolean` - Enable hover animations
- `interactive?: boolean` - Enable interactive states
- `specular?: boolean` - Enable specular highlights
- `className?: string` - Additional CSS classes
- `children?: React.ReactNode` - Content to render
- `style?: React.CSSProperties` - Inline styles

**Validation Rules**:
- `distortion` and `distortionIntensity` are ignored if `performanceTier === 2`
- `customDistortionConfig` requires `distortion={true}` to have effect
- `shine` layer rendered regardless of distortion state

**Example Usage**:
```typescript
<GlassCard elevation="e2" distortion={true} distortionIntensity="medium" shine={true}>
  <p>Content here</p>
</GlassCard>
```

---

### 4. LayerStructure

**Purpose**: Internal DOM layer hierarchy for distortion-enabled glass components.

**Layers** (in z-index order):
1. `.liquidGlass-wrapper` - Container element (position: relative)
   - Role: Establishes stacking context
   - Properties: overflow: hidden, border-radius inherited

2. `.liquidGlass-effect` - Background distortion layer (z-index: 0)
   - Role: Applies backdrop-filter + SVG filter
   - Properties: position: absolute, inset: 0
   - Filters: `backdrop-filter: blur(Npx)`, `filter: url(#glass-distortion-{intensity})`

3. `.liquidGlass-tint` - Color overlay layer (z-index: 1)
   - Role: Adds semi-transparent color fill
   - Properties: position: absolute, inset: 0
   - Background: `var(--glass-e{N}-fill)`

4. `.liquidGlass-shine` - Edge highlight layer (z-index: 2)
   - Role: Creates glass edge reflections
   - Properties: position: absolute, inset: 0
   - Box-shadow: `inset 2px 2px 1px rgba(255,255,255,0.5)` (light mode)

5. `.liquidGlass-content` - Content layer (z-index: 3)
   - Role: Renders children elements
   - Properties: position: relative (to stay above other layers)
   - Contains: `{children}` prop

**Conditional Rendering**:
- If `distortion={false}`: Only `.liquidGlass-wrapper` + direct children (no layers)
- If `distortion={true}`: Full 5-element structure

**Example DOM Output**:
```html
<div class="liquidGlass-wrapper rounded-xl border ...">
  <div class="liquidGlass-effect" style="filter: url(#glass-distortion-medium)"></div>
  <div class="liquidGlass-tint"></div>
  <div class="liquidGlass-shine"></div>
  <div class="liquidGlass-content">
    <!-- children here -->
  </div>
</div>
```

---

### 5. SVGFilterDefinition

**Purpose**: Global SVG filter element with feTurbulence and feDisplacementMap primitives.

**Attributes**:
- `id`: string - Unique filter identifier (e.g., "glass-distortion-medium")
  - Referenced by CSS `filter: url(#id)`
- `filterUnits`: "objectBoundingBox" - Filter coordinate system
- `x`, `y`, `width`, `height`: "0%", "0%", "100%", "100%" - Filter region

**Filter Primitives** (in order):
1. `<feTurbulence>` - Generate Perlin noise
   - `type="fractalNoise"`
   - `baseFrequency` from DistortionConfig
   - `numOctaves="1"` (performance optimization)
   - `seed` from DistortionConfig
   - `result="turbulence"`

2. `<feGaussianBlur>` - Smooth the noise
   - `in="turbulence"`
   - `stdDeviation="3"`
   - `result="softMap"`

3. `<feSpecularLighting>` - Add surface highlights
   - `in="softMap"`
   - `surfaceScale`, `specularConstant` from DistortionConfig
   - `specularExponent="100"`
   - `lighting-color="white"`
   - `result="specLight"`
   - Child: `<fePointLight x="-200" y="-200" z="300"/>`

4. `<feComposite>` - Combine lighting with noise
   - `in="specLight"`
   - `operator="arithmetic"`
   - `k1="0" k2="1" k3="1" k4="0"`
   - `result="litImage"`

5. `<feDisplacementMap>` - Warp the background
   - `in="SourceGraphic"`
   - `in2="softMap"`
   - `scale` from DistortionConfig
   - `xChannelSelector="R" yChannelSelector="G"`

**Relationships**:
- Defined once in `<GlassSVGFilters />` component
- Referenced by all distortion-enabled Glass components
- Three instances created: low, medium, high intensity

---

## State Transitions

### Distortion Lifecycle

```
[Component Mount]
  ↓
[Check performanceTier]
  ↓
Tier 1 → [distortion prop enabled] → Render layered structure
  ↓                                    ↓
Tier 2 → Force distortion=false → Render simple structure
  ↓
[Apply SVG filter if supported]
  ↓
Not supported → Fallback to backdrop-filter only
  ↓
Not supported → Fallback to solid background
```

### Theme Transition

```
[Theme Change: light ↔ dark]
  ↓
[Update CSS custom properties]
  ↓
--glass-e{N}-fill updated
--glass-e{N}-border updated
  ↓
[Layers re-render with new colors]
  ↓
Tint layer reflects new fill
Shine layer reflects new highlight color
```

---

## Relationships Diagram

```
DistortionIntensity ('low' | 'medium' | 'high')
  ↓ maps to
DistortionConfig { baseFrequency, scale, seed, ... }
  ↓ used by
SVGFilterDefinition <filter id="glass-distortion-{intensity}">
  ↓ referenced by
GlassComponentProps { distortion, distortionIntensity, ... }
  ↓ renders
LayerStructure { wrapper, effect, tint, shine, content }
```

---

## Performance Constraints

### Memory Limits
- Maximum 3 global SVG filter definitions (~1.5KB total)
- Maximum 4 extra DOM nodes per distortion-enabled component
- Target: <5MB additional heap allocation for entire system

### Rendering Constraints
- Frame time must remain <16ms (60fps) on Tier 1 devices
- Filter complexity: numOctaves=1 (avoid numOctaves=2 for performance)
- Displacement scale capped at 250 (higher values cause excessive GPU load)

### Browser Constraints
- SVG filters supported: Chrome 20+, Firefox 35+, Safari 9+, Edge 79+
- Graceful degradation for unsupported browsers (no distortion, no errors)

---

## Accessibility Considerations

### Content Separation
- Distortion applies ONLY to `.liquidGlass-effect` layer
- `.liquidGlass-content` layer remains undistorted
- Text readability unaffected (content is sharp, background is blurred/distorted)

### Reduced Motion
- `prefers-reduced-motion: reduce` disables any future animated distortion
- Static distortion pattern remains (no movement/shimmer)
- Shine layer static (no animated highlights)

### Keyboard Navigation
- Layered structure does not interfere with focus order
- Children remain keyboard-accessible
- Focus indicators visible on top layer (z-index: 3)

---

## Example Integration

```typescript
// In GlassCard.tsx
import { getDistortionConfig, shouldEnableDistortion } from '@/lib/glass-distortion';

const GlassCard = ({ 
  distortion = false, 
  distortionIntensity = 'medium',
  customDistortionConfig,
  shine = false,
  ...props 
}) => {
  const performanceTier = usePerformanceTier();
  const canDistort = distortion && shouldEnableDistortion(performanceTier);
  
  const config = customDistortionConfig 
    ? { ...getDistortionConfig(distortionIntensity), ...customDistortionConfig }
    : getDistortionConfig(distortionIntensity);
  
  const filterId = `glass-distortion-${distortionIntensity}`;
  
  return (
    <div className="liquidGlass-wrapper">
      {canDistort && (
        <>
          <div className="liquidGlass-effect" style={{ filter: `url(#${filterId})` }} />
          <div className="liquidGlass-tint" />
          {shine && <div className="liquidGlass-shine" />}
        </>
      )}
      <div className={canDistort ? "liquidGlass-content" : undefined}>
        {children}
      </div>
    </div>
  );
};
```
