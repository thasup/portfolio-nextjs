# Research: Vertical Scroll Timeline — Technical Decisions

**Feature**: 003-vertical-scroll-timeline  
**Date**: 2026-03-09  
**Phase**: 0 (Research & Design Decisions)

## Overview

This document captures technical research and design decisions for implementing a high-performance, cinematic vertical scroll timeline with year-themed gradients, an animated spine, and Deep Dive modals.

---

## 1. Framer Motion Scroll Performance Patterns

### Decision: `useScroll` + `useMotionValueEvent` for Reactive Updates

**Context**: The spine needs to track scroll progress in real-time with a traveling dot and fill animation. The spec requires 60fps performance.

**Research Findings**:
- Framer Motion's `useScroll` returns `MotionValue` objects that read scroll position off the main thread
- Direct subscription via `useMotionValueEvent` prevents React re-renders for every scroll tick
- `MotionValue.get()` is a snapshot and won't react to changes; state updates needed for React props

**Implementation Pattern**:
```tsx
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start start", "end end"]
});

const [spineProgress, setSpineProgress] = useState(0);

useMotionValueEvent(scrollYProgress, "change", (v) => {
  setSpineProgress(v);
});

// Pass spineProgress (live state) to TimelineSpine
<TimelineSpine scrollProgress={spineProgress} />
```

**Alternatives Considered**:
- ❌ `scrollYProgress.get()` in render — static snapshot, doesn't react
- ❌ `useTransform` chaining — adds complexity for state-dependent logic
- ✅ `useMotionValueEvent` + state — balances reactivity with performance

**Performance Impact**: Batched state updates (React 19) ensure re-renders don't block scroll thread.

---

## 2. GPU-Accelerated Animation Rules

### Decision: CSS Transforms & Opacity Only (Compositor-Optimized)

**Context**: Scroll-triggered animations must maintain 60fps on devices with varying GPU capabilities.

**Research Findings** (Framer Motion + Browser Compositor):
- **GPU-accelerated properties**: `transform` (translate, scale, rotate), `opacity`
- **Paint-triggering properties**: `background`, `border`, `box-shadow`, `width`, `height`
- **Layout-triggering properties**: `margin`, `padding`, `top/left` (without `position: fixed`)

**Animation Inventory** (This Feature):

| Element | Property | Optimization |
|---------|----------|-------------|
| Spine fill | `scaleY` | ✅ GPU (transform) |
| Traveling dot | `top` via `useTransform` → applied as `style` | ✅ Framer handles as transform internally |
| Year backgrounds | `opacity` crossfade | ✅ GPU (opacity) |
| Event cards | `translateY` hover | ✅ GPU (transform) |
| Card reveals | `opacity` + `x` (Framer Motion) | ✅ GPU |

**Forbidden Patterns**:
```tsx
// ❌ BAD: Triggers layout
<div style={{ height: `${progress * 100}%` }} />

// ✅ GOOD: GPU transform
<motion.div style={{ scaleY: progress, transformOrigin: "top" }} />

// ❌ BAD: Triggers repaint
<motion.div animate={{ background: activeColor }} />

// ✅ GOOD: Layer opacity crossfade
{yearGradients.map(year => (
  <motion.div animate={{ opacity: activeYear === year ? 1 : 0 }} />
))}
```

**Performance Verification**:
- Chrome DevTools → Performance → Enable "Paint Flashing"
- Target: Zero green flashes during scroll (no repaints)
- FPS meter should stay locked at 60fps

---

## 3. Year Theme Color System Implementation

### Decision: Static Theme Objects + Runtime `style` Prop for Dynamic Colors

**Context**: Each year (2022-2025) has a unique color palette. Colors must be applied to spine, dots, borders, backgrounds, and text.

**Research Findings**:
- TailwindCSS utilities are **static** — cannot be dynamic at runtime
- Safelist approach bloats bundle with unused classes
- CSS custom properties (`--color-year-accent`) require DOM injection
- Inline `style` prop with dynamic values is permitted per Constitution Principle II

**Implementation Pattern**:
```tsx
// src/data/timelineChapters.ts
export const YEAR_THEMES = {
  2022: {
    label: "The Foundation",
    labelTh: "รากฐาน",
    spineColor: "#F59E0B",      // amber-500
    dotColor: "#FCD34D",        // amber-300
    accentHex: "#F59E0B",
    gradientFrom: "rgba(251, 191, 36, 0.06)",
    gradientTo: "rgba(245, 158, 11, 0.03)",
  },
  // ... 2023, 2024, 2025
} as const;

// Component usage
<div 
  className="border rounded-lg"
  style={{ 
    borderColor: `${theme.accentHex}40`,  // 40 = 25% opacity in hex
    backgroundColor: `${theme.accentHex}08`
  }}
/>
```

**Alternatives Considered**:
- ❌ Tailwind safelist — 4 years × 5 colors × 10 utilities = 200+ classes in bundle
- ❌ CSS custom properties — requires `<style>` injection, breaks SSR expectations
- ✅ `style` prop with runtime values — explicit, performant, constitution-compliant

**Type Safety**:
```tsx
type YearKey = 2022 | 2023 | 2024 | 2025;
const theme = YEAR_THEMES[year as YearKey];
```

---

## 4. Active Year Detection Strategy

### Decision: IntersectionObserver + Viewport Threshold

**Context**: The "active year" determines which background gradient is visible and which year marker on the spine is highlighted.

**Research Findings**:
- Framer Motion's `useInView` is designed for one-time reveals, not continuous tracking
- Custom `IntersectionObserver` with `rootMargin` provides fine-grained control
- Threshold: `-20% 0px -60% 0px` means year is active when header is 20% from top

**Implementation Pattern**:
```tsx
useEffect(() => {
  const years = [2022, 2023, 2024, 2025];
  const yearEls = years.map(y => 
    sectionRef.current!.querySelector(`[data-year="${y}"]`)
  );

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      
      if (visible[0]) {
        const year = Number(visible[0].target.dataset.year);
        setActiveYear(year);
      }
    },
    { 
      root: null, 
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0 
    }
  );

  yearEls.forEach(el => el && observer.observe(el));
  return () => observer.disconnect();
}, []);
```

**Alternatives Considered**:
- ❌ Scroll position math — brittle, breaks with dynamic content heights
- ❌ `useInView` per year — fires once, can't track re-entry
- ✅ IntersectionObserver — built for this, efficient, respects scroll direction

---

## 5. Modal Deep Dive Integration

### Decision: Extend Existing `useModal` Hook with `timeline-event` Type

**Context**: "Deep Dive" buttons open modals. Constitution Principle XIV mandates centralized modal system with URL hash support.

**Research Findings**:
- Existing modal system (from spec 002) uses `useModal` hook
- Modal types: `'project'`, `'timeline-event'`, `'certificate'`, `'testimonial'`
- URL hash pattern: `#timeline-event-{eventId}`
- Modal content rendered via type discrimination

**Implementation Pattern**:
```tsx
// src/hooks/useModal.ts (extend existing)
type ModalType = 'project' | 'timeline-event' | 'certificate' | 'testimonial';

interface TimelineEventModalData {
  type: 'timeline-event';
  id: string;  // event.id
}

// Component usage
import { useModal } from '@/hooks/useModal';

const { open } = useModal();

const handleDeepDive = () => {
  trackEvent(Events.TIMELINE_DEEPDIVE_OPEN, {
    event_id: event.id,
    event_title: event.titleEn,
    year,
    event_type: event.type,
  });
  open({ type: 'timeline-event', id: event.id });
};
```

**Modal Content Component**:
```tsx
// src/components/modals/TimelineEventModal.tsx
export function TimelineEventModal({ eventId }: { eventId: string }) {
  const event = timelineEvents.find(e => e.id === eventId);
  const locale = useLocale();
  
  const title = locale === 'th' ? event.titleTh : event.titleEn;
  const description = locale === 'th' ? event.descriptionTh : event.descriptionEn;
  const impact = locale === 'th' ? event.impactTh : event.impactEn;
  
  return (
    <div className="space-y-6">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="impact-block">{impact}</div>
      <TechStack skills={event.skills} />
      {event.mediaLinks && <MediaGallery links={event.mediaLinks} />}
    </div>
  );
}
```

**Alternatives Considered**:
- ❌ Separate modal system — violates Constitution XIV
- ❌ Client-side routing (`/timeline/[id]`) — breaks single-page narrative flow
- ✅ Extend existing modal — reuses infrastructure, maintains consistency

---

## 6. Mobile Optimization: Traveling Dot Threshold

### Decision: Hide Below 768px (Tailwind `md:` Breakpoint)

**Context**: Traveling dot animation may cause jank on low-end mobile devices. Clarification Q1 answer: 768px.

**Research Findings**:
- CSS media query `@media (min-width: 768px)` aligns with Tailwind's `md:` prefix
- Conditional rendering in React: `useMediaQuery` or CSS `display: none`
- Performance impact: 16ms budget per frame at 60fps; dot animation ~2-3ms on mid-range mobile

**Implementation Pattern**:
```tsx
// TimelineSpine.tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

return (
  <div className="relative">
    {/* Track and fill — always visible */}
    <motion.div className="spine-fill" style={{ scaleY: progress }} />
    
    {/* Traveling dot — hidden on mobile */}
    {!isMobile && (
      <motion.div 
        className="traveling-dot"
        style={{ top: useTransform(progress, [0, 1], [0, totalHeight]) }}
      />
    )}
    
    {/* Year markers — simplified on mobile (smaller size) */}
    <div className="year-markers md:scale-100 scale-75" />
  </div>
);
```

**CSS Alternative** (if using pure CSS):
```css
.traveling-dot {
  display: none;
}

@media (min-width: 768px) {
  .traveling-dot {
    display: block;
  }
}
```

**Performance Verification**:
- Test on iPhone SE (low-end), Pixel 5 (mid-range)
- Chrome DevTools → Performance → Mobile throttling
- Target: Maintain 60fps scroll with dot hidden

---

## 7. Bilingual Content Fallback Strategy

### Decision: Empty String Falls Back to English

**Context**: Edge case from spec: "If a Thai translation is missing for an entry, it should fallback gracefully."

**Research Findings**:
- Existing data files use empty strings (`''`) for incomplete translations
- Fallback logic prevents rendering empty elements
- Warning in dev mode helps identify missing translations

**Implementation Pattern**:
```tsx
const locale = useLocale() as 'en' | 'th';

const getLocalizedText = (en: string, th: string) => {
  if (locale === 'th' && th) return th;
  return en; // Always has English fallback
};

// Component usage
<h3>{getLocalizedText(event.titleEn, event.titleTh)}</h3>
```

**Dev-Mode Warning**:
```tsx
if (process.env.NODE_ENV === 'development' && locale === 'th' && !th) {
  console.warn(`Missing Thai translation for: ${en.substring(0, 30)}...`);
}
```

**Alternatives Considered**:
- ❌ Show `[Missing Translation]` — breaks UX
- ❌ Throw error — too strict, blocks build
- ✅ Silent fallback + dev warning — balances UX and maintainability

---

## 8. Sticky Spine Positioning

### Decision: `top: 6rem` (96px) Below Navbar

**Context**: Clarification Q5 answer. Spine must remain visible during scroll without overlapping navbar.

**Research Findings**:
- Navbar height: 4rem (64px) per existing layout
- Additional breathing room: 2rem (32px)
- Total offset: 6rem (96px)

**Implementation Pattern**:
```tsx
// TimelineSection.tsx
<div className="flex gap-6 sm:gap-8 lg:gap-10">
  {/* Spine column */}
  <div className="relative shrink-0 w-10">
    <div className="sticky top-24"> {/* 6rem = 24 × 0.25rem */}
      <TimelineSpine {...props} />
    </div>
  </div>
  
  {/* Content column */}
  <div className="flex-1 min-w-0">
    {/* Years and events */}
  </div>
</div>
```

**Responsive Adjustment**:
```tsx
// Mobile: Smaller top offset if navbar collapses
<div className="sticky top-16 md:top-24">
```

---

## 9. Analytics Event Naming & Properties

### Decision: Follow Existing Pattern from `src/lib/analytics.ts`

**Context**: Constitution XVI requires typed GA4 events. Clarification Q2 specifies properties.

**Research Findings**:
- Existing events: `PAGE_VIEW`, `NAV_LINK_CLICK`, `PROJECT_CARD_CLICK`, `MODAL_OPEN`
- Convention: `SCREAMING_SNAKE_CASE` string constants
- Properties: flat object, no nested values

**New Events**:
```tsx
// src/lib/analytics.ts
export const Events = {
  // ... existing events
  TIMELINE_PROGRESS: 'timeline_progress',
  TIMELINE_DEEPDIVE_OPEN: 'timeline_deepdive_open',
} as const;

// Usage
trackEvent(Events.TIMELINE_PROGRESS, { percent: 25 });

trackEvent(Events.TIMELINE_DEEPDIVE_OPEN, {
  event_id: 'ai-event-platform',
  event_title: 'AI Event Platform Launch',
  year: 2024,
  event_type: 'project',
});
```

**Type Safety**:
```tsx
type TimelineProgressEvent = {
  percent: 25 | 50 | 75 | 100;
};

type TimelineDeepDiveEvent = {
  event_id: string;
  event_title: string;
  year: number;
  event_type: 'work' | 'project' | 'achievement' | 'learning' | 'milestone';
};
```

---

## 10. Featured Event Visual Treatment

### Decision: 1px Ring (30% Opacity) + 2px Top Gradient Strip

**Context**: Clarification Q4. Featured events (e.g., AI Event Platform) need subtle visual distinction.

**Implementation Pattern**:
```tsx
// TimelineEventCard.tsx
<div
  className={cn(
    "relative rounded-xl border bg-card/60 backdrop-blur-sm",
    "hover:bg-card/80 transition-all duration-300",
    event.featured && "ring-1"
  )}
  style={{
    borderColor: event.featured ? `${theme.accentHex}40` : undefined,
    // @ts-ignore — custom property for ring color
    '--tw-ring-color': event.featured ? `${theme.accentHex}30` : undefined,
  }}
>
  {/* Featured glow strip */}
  {event.featured && (
    <div
      className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
      style={{
        background: `linear-gradient(
          to right, 
          transparent, 
          ${theme.accentHex}, 
          transparent
        )`,
      }}
    />
  )}
  
  {/* Card content */}
</div>
```

**Why No Box Shadow**:
- Box shadow triggers expensive repaints during scroll
- Ring + gradient strip provide clear visual hierarchy without performance cost

---

## Summary

All technical unknowns resolved. No blocking issues identified. Implementation can proceed to Phase 1 (Data Model & Contracts).

**Key Takeaways**:
1. **Performance**: GPU-only animations, IntersectionObserver for tracking, mobile optimizations
2. **Architecture**: Extend existing modal system, reuse shared components, static theme objects
3. **Type Safety**: Strict TypeScript for all events, themes, and data structures
4. **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels, reduced-motion support
5. **Bilingual**: Fallback strategy for missing translations, consistent with existing i18n pattern
