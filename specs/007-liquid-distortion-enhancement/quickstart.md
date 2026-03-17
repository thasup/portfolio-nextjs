# Quickstart: Liquid Distortion Enhancement

**Feature**: 007-liquid-distortion-enhancement  
**Last Updated**: 2026-03-17

## 5-Minute Setup

### 1. Add SVG Filters to Root Layout

```tsx
// app/[locale]/layout.tsx
import { GlassSVGFilters } from '@/components/glass/GlassSVGFilters';

export default function RootLayout({ children }) {
  return (
    <html lang={locale}>
      <body>
        <GlassSVGFilters />  {/* Add this line */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Enable Distortion on Glass Components

```tsx
// Before (basic glass)
<GlassCard elevation="e2">
  <h3>Value Proposition</h3>
  <p>Description here</p>
</GlassCard>

// After (with liquid distortion)
<GlassCard elevation="e2" distortion>
  <h3>Value Proposition</h3>
  <p>Description here</p>
</GlassCard>
```

### 3. Customize Intensity (Optional)

```tsx
// Subtle effect for cards
<GlassCard distortion distortionIntensity="low">
  <p>Gentle distortion</p>
</GlassCard>

// Dramatic effect for hero sections
<GlassCard distortion distortionIntensity="high" shine>
  <h1>Bold Statement</h1>
</GlassCard>
```

---

## Common Use Cases

### ValueProp Cards (Subtle)

```tsx
<GlassCard elevation="e2" hover distortion distortionIntensity="low">
  <div className="p-6">
    <Icon className="w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
    <p className="text-muted-foreground">Ship features quickly...</p>
  </div>
</GlassCard>
```

### Navbar (Balanced)

```tsx
{scrolled && (
  <GlassPanel elevation="e3" distortion distortionIntensity="medium">
    <nav className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <Logo />
        <NavLinks />
      </div>
    </nav>
  </GlassPanel>
)}
```

### Modal (Dramatic)

```tsx
<GlassModal 
  isOpen={isOpen} 
  onClose={handleClose}
  distortion 
  distortionIntensity="high"
  shine
>
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
    <p className="mb-6">Are you sure you want to proceed?</p>
    <div className="flex gap-4">
      <GlassButton onClick={handleConfirm}>Confirm</GlassButton>
      <GlassButton onClick={handleClose}>Cancel</GlassButton>
    </div>
  </div>
</GlassModal>
```

### Contact Form (With Shine)

```tsx
<GlassCard elevation="e3" distortion shine>
  <form className="p-6 space-y-4">
    <Input placeholder="Name" />
    <Input placeholder="Email" />
    <Textarea placeholder="Message" />
    <GlassButton type="submit" distortion>Send</GlassButton>
  </form>
</GlassCard>
```

---

## Performance Considerations

### Automatic Tier Detection

Distortion automatically disabled on low-end devices:

```tsx
// No code changes needed - this happens automatically
const performanceTier = usePerformanceTier();

// Tier 1 (iPhone 12+, MacBook M1+): Full distortion ✓
// Tier 2 (iPhone SE 2020, budget Android): Distortion disabled, fallback to blur ✓
```

### Manual Opt-Out

Force disable distortion if needed:

```tsx
// Disable distortion for performance-critical sections
<GlassCard elevation="e2" distortion={false}>
  <HeavyComponent />
</GlassCard>
```

---

## Troubleshooting

### Distortion Not Visible

**Check 1**: Is `<GlassSVGFilters />` rendered in root layout?

```tsx
// ✓ Correct
<body>
  <GlassSVGFilters />
  {children}
</body>

// ✗ Missing
<body>
  {children}  <!-- No filters defined! -->
</body>
```

**Check 2**: Is `distortion` prop set?

```tsx
// ✓ Enabled
<GlassCard distortion>

// ✗ Disabled (default)
<GlassCard>
```

**Check 3**: Check browser console for errors

```javascript
// Open DevTools > Console
// Look for: "Failed to set filter: url(#glass-distortion-medium)"
```

**Check 4**: Verify performance tier

```tsx
// Add temporary logging
const performanceTier = usePerformanceTier();
console.log('Performance Tier:', performanceTier);
// Should be 1 for distortion to work
```

### Distortion Too Subtle/Intense

Adjust intensity:

```tsx
// Too subtle? Increase
<GlassCard distortion distortionIntensity="high">

// Too intense? Decrease
<GlassCard distortion distortionIntensity="low">
```

### Text Readability Issues

Distortion should NOT affect text (it only affects background). If text appears distorted:

**Check**: Is content inside `.liquidGlass-content` layer?

```tsx
// ✓ Correct structure (automatic)
<div className="liquidGlass-wrapper">
  <div className="liquidGlass-effect" />  <!-- Distorted -->
  <div className="liquidGlass-tint" />
  <div className="liquidGlass-content">  <!-- Clear -->
    <p>Text here</p>
  </div>
</div>
```

---

## Migration from 006

### Zero Breaking Changes

All existing code works without modification:

```tsx
// Before (006)
<GlassCard elevation="e2" hover>Content</GlassCard>

// After (007) - SAME CODE WORKS
<GlassCard elevation="e2" hover>Content</GlassCard>

// After (007) - OPT-IN to distortion
<GlassCard elevation="e2" hover distortion>Content</GlassCard>
```

### Gradual Adoption

Enable distortion incrementally:

```tsx
// Week 1: Add SVG filters
<GlassSVGFilters />

// Week 2: Enable on hero section
<GlassCard distortion>Hero content</GlassCard>

// Week 3: Enable on cards
<GlassCard distortion distortionIntensity="low">Card content</GlassCard>

// Week 4: Enable everywhere
// (All components updated)
```

---

## Best Practices

### Intensity Guidelines

| Component Type | Recommended Intensity | Rationale |
|----------------|----------------------|-----------|
| ValueProp cards | `low` | Subtle, doesn't distract from content |
| Timeline cards | `low` | Maintains text readability |
| Navbar/Footer | `medium` | Balanced effect, visible but not overwhelming |
| Panels | `medium` | Default intensity, good for most cases |
| Hero sections | `high` | Makes a statement, draws attention |
| Modals | `high` | Dramatic effect for focused interactions |
| Buttons | `medium` or disabled | Buttons usually don't need distortion |

### Shine Layer Usage

Use `shine` prop sparingly for extra polish:

```tsx
// ✓ Good: Hero section, modals
<GlassCard distortion distortionIntensity="high" shine>

// ✗ Overuse: Every card
<GlassCard distortion shine>  <!-- Too much shine -->
```

### Performance Budget

- **Maximum 10 distortion-enabled components** per page for optimal performance
- Prefer `distortionIntensity="low"` for multiple components on same page
- Reserve `intensity="high"` for 1-2 focal points

---

## Next Steps

### Visual Testing

Use Storybook (feature 008) to test all distortion variants:

```bash
npm run storybook
# Navigate to: Components > Glass > GlassCard
# Toggle "distortion" control
# Change "distortionIntensity" dropdown
```

### Performance Profiling

Monitor frame rate with distortion enabled:

```bash
# Open Chrome DevTools > Performance
# Record 5 seconds of scrolling
# Check: Frame rate should be 60fps, frame time <16ms
```

### Visual Regression Testing

Capture baseline screenshots:

```bash
# Once Storybook is set up
npm run test:visual
# Review snapshots in /tests/visual/__snapshots__/
```

---

## FAQ

**Q: Can I use distortion without the shine layer?**  
A: Yes, `distortion` and `shine` are independent props.

**Q: Does distortion work with dark mode?**  
A: Yes, distortion effect adapts to theme automatically.

**Q: Can I animate the distortion?**  
A: Not in 007. Future enhancement will add mouse-reactive distortion.

**Q: Does this work on mobile?**  
A: Yes, on Tier 1 mobile devices (iPhone 12+, mid-range Android). Tier 2 devices get fallback.

**Q: How much does this increase bundle size?**  
A: ~2KB gzipped (SVG filters + utilities). Zero production runtime cost.

**Q: Can I customize filter parameters beyond low/medium/high?**  
A: Yes, use `customDistortionConfig` prop (advanced usage, see contracts/glass-components.md).
