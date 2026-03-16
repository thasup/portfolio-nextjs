# Feature Specification: "Liquid Glass" Global Design System

**Feature Branch**: `006-liquid-glass-system`  
**Created**: 2026-03-16  
**Status**: Draft  
**Input**: User description: "A web-native 'Liquid Glass' design system for Thanachon's portfolio — the visual and interaction foundation that makes every component feel like it exists in the 'Age of AI': premium, intelligent, alive. Reference: Apple WWDC 2025 Liquid Glass material."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - "The Surface is Alive" (Priority: P1)

As a visitor, I want the UI components to feel like physical glass that reflects the page's ambient color and breathes with subtle translucency so that the interface feels intelligent and premium.

**Why this priority**: Defines the core identity of the "Age of AI" aesthetic. Without this, it's just a standard flat UI.

**Independent Test**: View any glass card against a multi-colored background. Verify that the background "bleeds" through with a sophisticated blur and that the card has a "specular highlight" that gives it depth.

**Acceptance Scenarios**:

1. **Given** a multi-colored background, **When** a glass component is placed on it, **Then** it MUST display high-quality backdrop-filter blur and refraction.
2. **Given** a desktop browser, **When** I move the mouse over the surface, **Then** a subtle specular highlight MUST respond to the movement (where supported/performant).

---

### User Story 2 - "Every Interaction has Weight" (Priority: P1)

As a visitor, I want interactive elements to respond with physically-grounded motion (buoyancy, yielding, springing) so that the digital material feels tangible.

**Why this priority**: Essential for the "Liquid" part of the Liquid Glass system. Standard CSS transitions are too rigid for this aesthetic.

**Independent Test**: Click or hover over a glass button. Verify it uses Framer Motion spring physics (SPRING_BUOYANT/SPRING_SNAPPY) rather than linear easing.

**Acceptance Scenarios**:

1. **Given** a glass interactive element, **When** hovered, **Then** it MUST scale and shadow-shift with organic spring physics.
2. **Given** a press action, **When** released, **Then** the component MUST "bounce" back to its original state with no visual jank.

---

### User Story 3 - "It Works Everywhere" (Priority: P1)

As a user on an older device or a browser without backdrop-filter support, I want the components to remains perfectly readable and beautiful so that my experience is never broken.

**Why this priority**: Performance and accessibility are hard constraints. The site must be ultra-fast (95+ Lighthouse).

**Independent Test**: Disable backdrop-filter in dev tools. Verify the component falls back to a high-quality semi-transparent solid color that maintains contrast.

**Acceptance Scenarios**:

1. **Given** a browser without `backdrop-filter` support, **When** viewing the site, **Then** the UI MUST remain highly legible and professional using fallback transparency.
2. **Given** a page with glass elements, **When** audited by Lighthouse, **Then** the Performance score MUST stay above 95.

---

### User Story 4 - "Light and Dark are Both Premium" (Priority: P1)

As a user, I want the glass effect to feel native to both Light and Dark modes without either feeling like an afterthought.

**Why this priority**: Dark mode is usually the primary for "AI" themes, but light mode must be "crisp and crystal" to maintain professionalism.

**Acceptance Scenarios**:

1. **Given** Light Mode, **When** viewed, **Then** glass MUST feel like frosted crystal (higher translucency, lighter borders).
2. **Given** Dark Mode, **When** viewed, **Then** glass MUST feel like a deep, luminous panel floating in space (lower translucency, vibrant internal glows).

---

### User Story 5 - "The Hierarchy is Instantly Readable" (Priority: P2)

As a visitor, I want to distinguish between layers of information instantly through visual depth cues rather than just borders.

**Why this priority**: Prevents the "cluttered" feeling common in poorly implemented glassmorphism.

**Acceptance Scenarios**:

1. **Given** multiple overlapping glass elements (e.g., a modal over a card), **When** viewed, **Then** the more elevated element MUST have a more intense blur and more prominent border/shadow.

---

### Edge Cases

- **Stacked Blur Layers**: Performance degrades exponentially with overlapping backdrop-filters. Requirement: System MUST cap active layers at 4.
- **High-Contrast Needs**: Translucency can kill contrast. Requirement: Content within glass MUST use high-contrast tokens (WCAG AA/AAA).
- **Reduced Motion**: Respect `prefers-reduced-motion` by swapping spring buoyant animations for simple opacity fades.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001: The Liquid Token Set**: System MUST define CSS variables/Tailwind primitives for:
    - `glass-blur`: base (8px), elevated (16px), floating (24px).
    - `glass-border`: multi-layered translucent borders (1px outer + inner glow).
    - `glass-surface`: `rgba()` values for Light (white 0.15) and Dark (black 0.1).
- **FR-002: Adaptive Materiality**: Components MUST accept an `elevation` prop that automatically adjusts blur intensity and shadow depth.
- **FR-003: "Liquid" Physics Engine**: Export standardized `Framer Motion` transition objects:
    - `SPRING_BUOYANT`: high stiffness, lower damping.
    - `SPRING_GENTLE`: for subtle ambient breathing.
    - `SPRING_SNAPPY`: for tooltips and rapid feedback.
- **FR-004: Specular Highlight System**: Semi-transparent radial gradient ::before element that can (optionally) track mouse position.
- **FR-005: Adaptive Shadow Framework**: CSS layered shadows (ambient + key light) using color-mix for vibrancy.
- **FR-006: Performance Guardrails**: 
    - MUST NOT animate `backdrop-filter` radius (use opacity instead).
    - MUST NOT use `box-shadow` blur values greater than 60px.
    - MUST NOT use Canvas or WebGL.

### Key Entities

- **GlassPrimitive**: The base layout component using `backdrop-filter` and `elevation` logic.
- **LiquidMotion**: Shared animation definitions for Framer Motion.
- **SurfaceHighlight**: Logic for theSpecular light response.

## Architecture & Constraints

To ensure the "Liquid Glass" system remains performance-first as mandated by the constitution, the following constraints are strictly enforced:

### Performance & GPU Optimization
- **No Backdrop Animation**: `backdrop-filter` radius changes trigger heavy repaints. Animating opacity of a glass layer is the preferred method for entry/exit.
- **Layer Limit**: A maximum of **4 active backdrop-filter layers** may overlap in the viewport at once.
- **Shadow Caps**: `box-shadow` blur radius MUST NOT exceed **60px** to avoid expensive GPU compositing overhead.
- **Native Implementation**: No external glass or glassmorphism libraries. Every effect is built with vanilla CSS and Framer Motion primitives.
- **No Canvas/WebGL**: All effects must be achievable via CSS/DOM to keep bundle size low and maintain accessibility.

### Thematic & Visual Logic
- **Pure CSS Theming**: Dark/Light mode logic MUST rely on CSS variables and `prefers-color-scheme`. No JS-based theme detection for style injection.
- **Selective Application**: Glass is reserved for **elevated** components (cards, nav, modals). Background sections and base layout remain solid to preserve visual hierarchy.
- **Legibility First**: Translucency MUST NOT compromise WCAG AA contrast. All text on glass MUST use high-contrast color tokens.

## Implementation Strategy

1. **Token Foundation**: Define CSS variables in `globals.css` for glass surfaces, borders, and blurs.
2. **Glass Component primitive**: Create a reusable `GlassCard` or `GlassPanel` that handles backdrop-filter fallback logic.
3. **Motion Integration**: Standardize Framer Motion `spring` configs to ensure consistent "buoyancy" across the app.
4. **Specular Highlight**: Implement the mouse-tracking highlight as an optional, performance-gated feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **Lighthouse Performance Score**: **95+**.
- **SC-002**: **Frame Rate**: UI interactions MUST maintain 60fps on mid-range devices.
- **SC-003**: **Bundle Size**: Impact of the core glass system MUST be under **10kb** (min+gz).
- **SC-004**: **Accessibility**: All text on glass surfaces MUST pass WCAG AA contrast check.
- **SC-005**: **Browser Support**: Graceful fallback for Firefox (where backdrop-filter is sometimes disabled) and older Safari.
