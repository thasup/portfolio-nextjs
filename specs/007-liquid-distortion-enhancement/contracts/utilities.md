# Contract: Glass Distortion Utilities

**Feature**: 007-liquid-distortion-enhancement  
**Date**: 2026-03-17  
**Version**: 1.0.0

## Overview

Helper functions and constants for managing distortion configurations and performance tier logic.

## Exports

### 1. DISTORTION_PRESETS

**Purpose**: Predefined distortion configurations for low/medium/high intensities.

```typescript
const DISTORTION_PRESETS: Record<DistortionIntensity, DistortionConfig> = {
  low: {
    baseFrequency: [0.005, 0.005],
    scale: 75,
    seed: 5,
    specularConstant: 0.8,
    surfaceScale: 5,
  },
  medium: {
    baseFrequency: [0.01, 0.01],
    scale: 100,
    seed: 5,
    specularConstant: 1.0,
    surfaceScale: 5,
  },
  high: {
    baseFrequency: [0.015, 0.015],
    scale: 150,
    seed: 5,
    specularConstant: 1.2,
    surfaceScale: 5,
  },
};
```

**Usage**:
```typescript
import { DISTORTION_PRESETS } from '@/lib/glass-distortion';

const config = DISTORTION_PRESETS['medium'];
console.log(config.scale); // 100
```

---

### 2. getDistortionConfig()

**Purpose**: Get distortion configuration for a given intensity level, with optional custom overrides.

**Signature**:
```typescript
function getDistortionConfig(
  intensity: DistortionIntensity = 'medium',
  customConfig?: Partial<DistortionConfig>
): DistortionConfig;
```

**Parameters**:
- `intensity` - Preset intensity level ('low' | 'medium' | 'high')
- `customConfig` - Optional partial config to override preset values

**Returns**: Complete `DistortionConfig` object

**Behavior**:
- Returns preset config for given intensity
- Merges `customConfig` over preset if provided
- Validates numeric ranges (clamps out-of-range values)

**Example**:
```typescript
// Get medium preset
const medium = getDistortionConfig('medium');
// { baseFrequency: [0.01, 0.01], scale: 100, ... }

// Override scale
const custom = getDistortionConfig('medium', { scale: 120 });
// { baseFrequency: [0.01, 0.01], scale: 120, ... }
```

**Validation**:
- `baseFrequency` clamped to [0.001, 0.05]
- `scale` clamped to [50, 250]
- `seed` clamped to [1, 20]
- `specularConstant` clamped to [0.5, 2.0]
- `surfaceScale` clamped to [1, 10]

---

### 3. shouldEnableDistortion()

**Purpose**: Determine if distortion should be enabled based on performance tier.

**Signature**:
```typescript
function shouldEnableDistortion(performanceTier: number): boolean;
```

**Parameters**:
- `performanceTier` - Performance tier from `usePerformanceTier()` hook (1 or 2)

**Returns**: 
- `true` if Tier 1 (high-performance device)
- `false` if Tier 2 (low-performance device)

**Example**:
```typescript
const performanceTier = usePerformanceTier();
const canDistort = shouldEnableDistortion(performanceTier);

if (canDistort) {
  // Render with distortion
} else {
  // Render without distortion
}
```

**Rationale**:
- Tier 1 devices can handle SVG filters at 60fps
- Tier 2 devices experience frame drops, better to disable
- Follows existing performance tier detection from 006

---

### 4. getFilterId()

**Purpose**: Get SVG filter ID for a given intensity level.

**Signature**:
```typescript
function getFilterId(intensity: DistortionIntensity): string;
```

**Parameters**:
- `intensity` - Distortion intensity level

**Returns**: Filter ID string (e.g., `'glass-distortion-medium'`)

**Example**:
```typescript
const filterId = getFilterId('medium');
// 'glass-distortion-medium'

// Used in component:
<div style={{ filter: `url(#${filterId})` }} />
```

---

### 5. clampValue()

**Purpose**: Internal utility to clamp numeric values within range.

**Signature**:
```typescript
function clampValue(value: number, min: number, max: number): number;
```

**Parameters**:
- `value` - Input value
- `min` - Minimum allowed value
- `max` - Maximum allowed value

**Returns**: Clamped value

**Example**:
```typescript
clampValue(150, 50, 250);  // 150 (within range)
clampValue(300, 50, 250);  // 250 (clamped to max)
clampValue(10, 50, 250);   // 50 (clamped to min)
```

---

## Type Definitions

### DistortionConfig

```typescript
interface DistortionConfig {
  baseFrequency: [number, number];  // [x, y] turbulence frequency
  scale: number;                    // Displacement magnitude
  seed: number;                     // Turbulence seed
  specularConstant: number;         // Specular lighting intensity
  surfaceScale: number;             // Surface depth
}
```

### DistortionIntensity

```typescript
type DistortionIntensity = 'low' | 'medium' | 'high';
```

---

## Usage Examples

### Basic Usage

```typescript
import { getDistortionConfig, shouldEnableDistortion, getFilterId } from '@/lib/glass-distortion';

// In a component
const performanceTier = usePerformanceTier();
const canDistort = shouldEnableDistortion(performanceTier);
const config = getDistortionConfig('medium');
const filterId = getFilterId('medium');

if (canDistort) {
  return (
    <div style={{ filter: `url(#${filterId})` }}>
      Content
    </div>
  );
}
```

### Advanced Customization

```typescript
// Custom distortion with overrides
const customConfig = getDistortionConfig('medium', {
  scale: 120,        // Slightly more intense
  seed: 10,          // Different pattern
});

// Use in component
<div style={{ 
  filter: `url(#glass-distortion-medium)`,
  // Note: SVG filter definitions are static, 
  // custom config would require dynamic filter generation (future enhancement)
}} />
```

### Performance-Aware Rendering

```typescript
function GlassCard({ distortion, distortionIntensity, ...props }) {
  const performanceTier = usePerformanceTier();
  
  // Automatically disable distortion on Tier 2
  const actuallyDistort = distortion && shouldEnableDistortion(performanceTier);
  
  if (actuallyDistort) {
    // Render with distortion layers
  } else {
    // Render without distortion
  }
}
```

---

## Testing Requirements

### Unit Tests

- `getDistortionConfig()` returns correct preset for each intensity
- `getDistortionConfig()` merges custom overrides correctly
- `shouldEnableDistortion()` returns `true` for Tier 1
- `shouldEnableDistortion()` returns `false` for Tier 2
- `getFilterId()` returns correct ID for each intensity
- `clampValue()` correctly clamps out-of-range values

### Integration Tests

- Utilities work with actual `usePerformanceTier()` hook
- Filter IDs match those defined in `<GlassSVGFilters />`
- Config values are valid for SVG filter primitives

---

## Version History

- **1.0.0** (2026-03-17): Initial implementation
