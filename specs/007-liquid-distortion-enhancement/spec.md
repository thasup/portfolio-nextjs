# Feature Specification: Liquid Distortion Enhancement

**Feature Branch**: `feature/007-liquid-distortion-enhancement`  
**Created**: 2026-03-17  
**Status**: Draft  
**Parent Feature**: 006-liquid-glass-system  
**Input**: User request to enhance glassmorphism with SVG filter-based liquid distortion effect

## User Scenarios & Testing

### User Story 1 - Enhanced Glass Visual Fidelity (Priority: P1)

As a portfolio visitor, I want glass UI elements to exhibit realistic liquid distortion effects so that the interface feels more premium, tactile, and memorable.

**Why this priority**: The core glassmorphism implementation (006) provides backdrop-filter blur and transparency, but lacks the organic "liquid" distortion that makes the effect truly distinctive. This enhancement directly supports Constitution Principle II ("Fast, Premium, Accessible Delivery") and Principle V ("Liquid interactive polish").

**Independent Test**: Can be fully tested by viewing any glass component (GlassCard, GlassPanel, GlassButton) and observing the SVG-based turbulence distortion applied to content behind the glass. Success = distortion is visible, performance remains acceptable (no jank).

**Acceptance Scenarios**:

1. **Given** a GlassCard component on the ValueProp section, **When** the page loads, **Then** content behind the card shows subtle liquid distortion through the glass surface
2. **Given** a visitor hovers over a glass element, **When** the mouse moves across the surface, **Then** the distortion effect remains stable without flickering or visual artifacts
3. **Given** a low-performance device (Tier 2), **When** glass components render, **Then** the distortion effect gracefully degrades to basic blur to maintain performance targets

---

### User Story 2 - Layered Glass Architecture (Priority: P2)

As a developer, I want glass components to support a layered DOM structure (effect + tint + shine + content) so that I can create depth and realism matching modern macOS/iOS design language.

**Why this priority**: The reference implementation uses 4 layers (effect, tint, shine, content) to achieve realistic glass depth. This architectural change enables future enhancements like gradient tints, edge highlights, and advanced compositing.

**Independent Test**: Can be tested by inspecting glass component DOM and verifying the 4-layer structure exists. Success = layers render correctly in the proper z-index order without layout shifts.

**Acceptance Scenarios**:

1. **Given** a glass component with `distortion` prop enabled, **When** inspecting the DOM, **Then** 4 child divs exist: `.liquidGlass-effect`, `.liquidGlass-tint`, `.liquidGlass-shine`, `.liquidGlass-content`
2. **Given** custom content passed to a glass component, **When** rendered, **Then** content appears in the `.liquidGlass-content` layer at z-index 3 (topmost)
3. **Given** a glass component without distortion enabled, **When** rendered, **Then** the simplified structure (no extra layers) is used for better performance

---

### User Story 3 - Configurable Distortion Parameters (Priority: P3)

As a designer/developer, I want to control distortion intensity, turbulence frequency, and specular lighting so that different UI contexts can use appropriate glass effects (subtle for cards, pronounced for modals).

**Why this priority**: Not all glass surfaces need the same distortion intensity. ValueProp cards benefit from subtle effects, while hero sections or modals can showcase more dramatic liquid glass. This provides design flexibility while maintaining a cohesive system.

**Independent Test**: Can be tested by creating glass components with different `distortionIntensity` values (low/medium/high) and verifying visual differences. Success = distortion scales appropriately without breaking the effect.

**Acceptance Scenarios**:

1. **Given** a GlassCard with `distortionIntensity="low"`, **When** rendered, **Then** SVG filter uses baseFrequency="0.005" and scale="75"
2. **Given** a GlassCard with `distortionIntensity="high"`, **When** rendered, **Then** SVG filter uses baseFrequency="0.02" and scale="200"
3. **Given** a glass component with custom `turbulenceSeed`, **When** rendered, **Then** the distortion pattern is deterministic and reproducible

---

### User Story 4 - Shine/Reflection Layer (Priority: P4)

As a portfolio visitor, I want glass surfaces to show subtle edge highlights and specular reflections so that the material feels physically plausible and luxurious.

**Why this priority**: Real glass reflects light at edges and has subtle shine gradients. This completes the "liquid glass" effect by adding the final 10% of visual polish.

**Independent Test**: Can be tested by viewing a glass component with `shine` prop enabled and observing box-shadow insets creating edge highlights. Success = highlights are visible but not distracting.

**Acceptance Scenarios**:

1. **Given** a glass component with `shine={true}`, **When** rendered, **Then** the `.liquidGlass-shine` layer has inset box-shadows creating edge highlights
2. **Given** dark mode active, **When** glass component renders, **Then** shine highlights use appropriate dark-mode colors (lighter insets)
3. **Given** reduced motion preference, **When** glass renders, **Then** shine layer is static (no animated shimmer)

---

### Edge Cases

- What happens when browser doesn't support SVG filters? → Graceful degradation to standard backdrop-filter blur
- What happens when backdrop-filter is also unsupported? → Fallback to solid semi-transparent background (existing Tier 2 behavior)
- How does distortion affect text readability? → Distortion only applies to the effect layer, not content layer. Text remains sharp.
- What happens with nested glass components? → Each maintains its own filter context; no double-distortion on content
- How does this perform on mobile devices? → Performance tier detection (existing) disables distortion on low-end devices
- What happens when printing the page? → CSS print media queries disable filters for clean printouts

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide an SVG filter definition (`#glass-distortion`) that creates realistic liquid glass distortion using feTurbulence and feDisplacementMap
- **FR-002**: Glass components (GlassCard, GlassPanel, GlassButton, GlassModal) MUST support an optional `distortion` boolean prop to enable/disable the effect
- **FR-003**: Glass components with distortion enabled MUST render a 4-layer DOM structure: effect layer (backdrop-filter + SVG filter), tint layer (semi-transparent color), shine layer (edge highlights), content layer (children)
- **FR-004**: System MUST provide three distortion intensity presets: "low" (subtle), "medium" (default), "high" (dramatic)
- **FR-005**: SVG filter MUST include configurable parameters: baseFrequency (turbulence grain), scale (displacement magnitude), turbulence seed (pattern variation)
- **FR-006**: Distortion effect MUST be disabled on Tier 2 performance devices (existing performance tier detection)
- **FR-007**: System MUST support optional `shine` boolean prop to enable edge highlight layer with inset box-shadows
- **FR-008**: SVG filter definition MUST be rendered once globally (not duplicated per component) for performance
- **FR-009**: Glass components MUST maintain existing props and behavior when distortion is disabled (backward compatibility)
- **FR-010**: System MUST respect `prefers-reduced-motion` by disabling any animated distortion effects

### Key Entities

- **SVG Filter Definition**: The `#glass-distortion` filter using feTurbulence, feGaussianBlur, feSpecularLighting, feDisplacementMap
- **Glass Component Layer Structure**: 4 nested divs with specific classes and z-index hierarchy
- **Distortion Configuration**: Object defining baseFrequency, scale, seed, specularConstant, surfaceScale
- **Performance Tier Context**: Existing hook determining whether to enable distortion (Tier 1) or fallback (Tier 2)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Glass components with distortion enabled render visible liquid distortion effect within 16ms (60fps target)
- **SC-002**: Lighthouse Performance score remains 95+ on mobile and 100 on desktop after distortion implementation
- **SC-003**: Text readability (contrast ratio) on glass surfaces remains WCAG 2.1 AA compliant (4.5:1 for normal text)
- **SC-004**: Memory usage increase from SVG filters stays under 5MB additional heap allocation
- **SC-005**: 90% of visitors on Tier 1 devices see distortion effect; 10% on Tier 2 see graceful fallback
- **SC-006**: Visual regression tests pass for all glass component variants (with/without distortion, light/dark mode)
- **SC-007**: Glass components maintain existing API surface (no breaking changes to current implementations)
- **SC-008**: Dev-reported "premium feel" increases in qualitative feedback (subjective but trackable)

## Technical Constraints

### Performance

- SVG filters can be GPU-intensive; MUST test on low-end devices (iPhone SE, budget Android)
- Filter definitions MUST be reused (not inlined per component) to minimize DOM bloat
- Distortion MUST be opt-in per component to allow performance-critical areas to use lightweight glass

### Browser Support

- SVG filters supported in all modern browsers (Chrome 20+, Firefox 35+, Safari 9+, Edge 79+)
- Graceful degradation required for older browsers or browsers with filters disabled
- Use CSS `@supports` for feature detection where applicable

### Accessibility

- Distortion MUST NOT reduce text contrast below WCAG AA standards
- Reduced motion preference MUST disable any animated distortion (if added in future)
- Glass components remain keyboard-navigable and screen-reader accessible

### Integration

- MUST integrate with existing Liquid Glass system (006) without breaking current implementations
- MUST work with existing performance tier detection (usePerformanceTier hook)
- MUST work with existing theme system (light/dark mode color tokens)
- MUST work with existing specular highlight system (useSpecularHighlight hook)

## Dependencies

- **Parent Feature**: 006-liquid-glass-system (MUST be fully implemented first)
- **Existing Hooks**: usePerformanceTier, useReducedMotion, supportsBackdropFilter
- **Existing Components**: GlassCard, GlassPanel, GlassButton, GlassModal (will be enhanced)
- **Design Tokens**: CSS custom properties for glass fills, borders, shadows (already exist)

## Out of Scope

- Animated liquid flow effects (future enhancement)
- Mouse-reactive distortion that follows cursor movement (future enhancement)
- WebGL-based distortion rendering (SVG filters only for this phase)
- Custom distortion shapes beyond turbulence noise (future enhancement)
- Real-time distortion parameter tweaking UI (Storybook controls will suffice)

## Success Metrics

### User Experience

- Subjective "premium feel" rating from team/stakeholders: Target 4.5+/5
- No reported readability issues or accessibility complaints
- Positive feedback on visual polish in portfolio reviews

### Technical

- Lighthouse Performance: 95+ mobile, 100 desktop (no regression)
- Time to Interactive: No increase beyond +50ms
- Frame rate during scroll: Maintain 60fps on Tier 1, 30fps on Tier 2
- Browser compatibility: 95%+ of visitors see correct rendering (distortion or fallback)

### Development

- Implementation time: 2-3 days (SVG filter setup, component refactor, testing)
- Zero breaking changes to existing glass component usage
- Storybook stories document all distortion variants
