# Contract: GlassSVGFilters Component

**Feature**: 007-liquid-distortion-enhancement  
**Date**: 2026-03-17  
**Version**: 1.0.0

## Overview

Global component that renders SVG filter definitions for liquid glass distortion effect. Must be rendered once in the application root (RootLayout).

## Component API

### Interface

```typescript
interface GlassSVGFiltersProps {
  // No props - this is a purely declarative component
}

export function GlassSVGFilters(): JSX.Element;
```

### Usage

```tsx
// In app/layout.tsx or app/[locale]/layout.tsx
import { GlassSVGFilters } from '@/components/glass/GlassSVGFilters';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlassSVGFilters />
        {children}
      </body>
    </html>
  );
}
```

## Rendered Output

### Complete SVG Structure

```xml
<svg 
  style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }}
  aria-hidden="true"
>
  <defs>
    <filter id="glass-distortion-low" filterUnits="objectBoundingBox">
      <!-- Low intensity filter -->
    </filter>
    
    <filter id="glass-distortion-medium" filterUnits="objectBoundingBox">
      <!-- Medium intensity filter -->
    </filter>
    
    <filter id="glass-distortion-high" filterUnits="objectBoundingBox">
      <!-- High intensity filter -->
    </filter>
  </defs>
</svg>
```

### Filter Definitions

Each filter follows this structure:

```xml
<filter id="glass-distortion-{intensity}" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
  <!-- 1. Generate turbulence noise -->
  <feTurbulence 
    type="fractalNoise" 
    baseFrequency="{X} {Y}" 
    numOctaves="1" 
    seed="5" 
    result="turbulence"
  />
  
  <!-- 2. Smooth the noise -->
  <feGaussianBlur 
    in="turbulence" 
    stdDeviation="3" 
    result="softMap"
  />
  
  <!-- 3. Add specular lighting -->
  <feSpecularLighting 
    in="softMap" 
    surfaceScale="5" 
    specularConstant="{C}" 
    specularExponent="100" 
    lighting-color="white" 
    result="specLight"
  >
    <fePointLight x="-200" y="-200" z="300" />
  </feSpecularLighting>
  
  <!-- 4. Composite lighting -->
  <feComposite 
    in="specLight" 
    operator="arithmetic" 
    k1="0" k2="1" k3="1" k4="0" 
    result="litImage"
  />
  
  <!-- 5. Displace the background -->
  <feDisplacementMap 
    in="SourceGraphic" 
    in2="softMap" 
    scale="{S}" 
    xChannelSelector="R" 
    yChannelSelector="G"
  />
</filter>
```

## Filter Parameters

### Low Intensity (`#glass-distortion-low`)

- **baseFrequency**: `0.005 0.005` - Very fine grain
- **scale**: `75` - Subtle displacement
- **specularConstant**: `0.8` - Gentle highlights

**Use cases**: ValueProp cards, Timeline cards, Footer

### Medium Intensity (`#glass-distortion-medium`)

- **baseFrequency**: `0.01 0.01` - Balanced grain
- **scale**: `100` - Noticeable distortion
- **specularConstant**: `1.0` - Natural highlights

**Use cases**: Navbar, panels, default intensity

### High Intensity (`#glass-distortion-high`)

- **baseFrequency**: `0.015 0.015` - Coarse grain
- **scale**: `150` - Dramatic displacement
- **specularConstant**: `1.2` - Bright highlights

**Use cases**: Hero sections, modals, accent elements

## Performance Characteristics

### DOM Footprint

- **Total size**: ~1.5KB uncompressed (~400 bytes gzipped)
- **Element count**: 1 `<svg>` + 3 `<filter>` + 15 filter primitives
- **Render cost**: One-time on initial page load
- **Memory**: ~50KB heap allocation (browser-cached)

### Browser Caching

- Filters are cached by browser once referenced
- Subsequent `filter: url(#id)` usages have zero overhead
- Filter definitions never re-rendered (static)

## Accessibility

### ARIA Attributes

```tsx
<svg aria-hidden="true">
  <!-- Purely decorative, not announced by screen readers -->
</svg>
```

### Visual Impact

- Filters do NOT affect semantic structure
- Screen readers ignore SVG filter definitions
- Content readability unaffected (distortion on background only)

## Browser Compatibility

### Supported Browsers

- Chrome 20+ (2012)
- Firefox 35+ (2015)
- Safari 9+ (2015)
- Edge 79+ (2020)

### Graceful Degradation

If browser doesn't support SVG filters:
1. `filter: url(#id)` silently fails
2. Backdrop-filter remains active
3. Component still functions normally

## Export Contract

```typescript
// From @/components/glass/GlassSVGFilters
export function GlassSVGFilters(): JSX.Element;

// Filter ID constants (optional export)
export const GLASS_FILTER_IDS = {
  LOW: 'glass-distortion-low',
  MEDIUM: 'glass-distortion-medium',
  HIGH: 'glass-distortion-high',
} as const;
```

## Testing Requirements

### Unit Tests

- Component renders without errors
- Exactly 3 filter elements created
- Filter IDs match expected values
- SVG is hidden (`visibility: hidden`, `aria-hidden="true"`)

### Integration Tests

- Filters can be referenced by CSS `filter: url(#id)`
- Filters work alongside backdrop-filter
- Multiple components can reference same filter

### Visual Tests

- Apply each filter to test element
- Verify distortion is visible
- Verify intensity differences (low < medium < high)

## Version History

- **1.0.0** (2026-03-17): Initial implementation
