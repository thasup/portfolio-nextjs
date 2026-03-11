# Quickstart: Vertical Scroll Timeline Implementation

**Feature**: 003-vertical-scroll-timeline  
**Date**: 2026-03-09  
**Phase**: 1 (Implementation Guide)

## Prerequisites

- Node.js 18+ installed
- Repository cloned and dependencies installed (`npm install`)
- Feature branch checked out: `003-vertical-scroll-timeline`
- Familiarity with Next.js 15 App Router, TypeScript, Framer Motion

---

## Implementation Sequence

### Step 1: Enhance Data Model (15 min)

**File**: `src/types/timeline.ts`

Add new fields to the `TimelineEvent` interface:

```typescript
export interface TimelineEvent {
  // ... existing fields
  descriptionEn: string;         // ✨ NEW: Full narrative for modal
  descriptionTh: string;         // ✨ NEW: Full narrative for modal (Thai)
  featured: boolean;             // ✨ NEW: Visual emphasis flag
  mediaLinks?: MediaLink[];      // ✨ NEW: Optional media for modal
}

export interface MediaLink {
  type: 'image' | 'video' | 'link';
  url: string;
  caption?: string;
  captionTh?: string;
}
```

**Verification**: `npm run build` — TypeScript should report errors in `timelineEvents.ts` for missing fields.

---

### Step 2: Update Timeline Data (30 min)

**File**: `src/data/timelineEvents.ts`

For each event, add the new required fields:

```typescript
{
  id: 'ai-event-platform',
  // ... existing fields
  descriptionEn: 'Full narrative here...',  // Expand from summaryEn
  descriptionTh: '',                        // Leave empty for now (fallback to EN)
  featured: true,                           // Mark 2-3 flagship events as true
  // mediaLinks: []                         // Optional, skip for now
}
```

**Quick win**: Start with `descriptionEn = summaryEn` for all events, then expand 2-3 featured events with full narratives.

**Verification**: TypeScript errors should clear after adding all three fields.

---

### Step 3: Create Year Themes (15 min)

**File**: `src/data/timelineChapters.ts`

Add the `YEAR_THEMES` constant to the existing file:

```typescript
export const YEAR_THEMES = {
  2022: {
    label: "The Foundation",
    labelTh: "รากฐาน",
    gradientFrom: "rgba(251, 191, 36, 0.06)",
    gradientTo: "rgba(245, 158, 11, 0.03)",
    spineColor: "#F59E0B",
    dotColor: "#FCD34D",
    accentHex: "#F59E0B",
    accentClass: "text-amber-500",
    bgClass: "from-amber-500/5 via-amber-400/3 to-transparent",
  },
  2023: {
    label: "The Frontier",
    labelTh: "ชายแดนใหม่",
    gradientFrom: "rgba(139, 92, 246, 0.06)",
    gradientTo: "rgba(109, 40, 217, 0.03)",
    spineColor: "#8B5CF6",
    dotColor: "#C4B5FD",
    accentHex: "#8B5CF6",
    accentClass: "text-violet-500",
    bgClass: "from-violet-500/5 via-violet-400/3 to-transparent",
  },
  2024: {
    label: "The Intelligence Layer",
    labelTh: "ชั้น Intelligence",
    gradientFrom: "rgba(99, 102, 241, 0.07)",
    gradientTo: "rgba(67, 56, 202, 0.03)",
    spineColor: "#6366F1",
    dotColor: "#A5B4FC",
    accentHex: "#6366F1",
    accentClass: "text-indigo-500",
    bgClass: "from-indigo-500/6 via-indigo-400/3 to-transparent",
  },
  2025: {
    label: "The Vision",
    labelTh: "วิสัยทัศน์",
    gradientFrom: "rgba(16, 185, 129, 0.06)",
    gradientTo: "rgba(5, 150, 105, 0.03)",
    spineColor: "#10B981",
    dotColor: "#6EE7B7",
    accentHex: "#10B981",
    accentClass: "text-emerald-500",
    bgClass: "from-emerald-500/5 via-emerald-400/3 to-transparent",
  },
} as const;

export type YearKey = 2022 | 2023 | 2024 | 2025;
```

**Verification**: Import `YEAR_THEMES` in a component to confirm TypeScript recognizes the constant.

---

### Step 4: Add Analytics Events (10 min)

**File**: `src/lib/analytics.ts`

Add new event constants:

```typescript
export const Events = {
  // ... existing events
  TIMELINE_PROGRESS: 'timeline_progress',
  TIMELINE_DEEPDIVE_OPEN: 'timeline_deepdive_open',
} as const;
```

Add TypeScript interfaces:

```typescript
export interface TimelineProgressEvent {
  percent: 25 | 50 | 75 | 100;
}

export interface TimelineDeepDiveEvent {
  event_id: string;
  event_title: string;
  year: number;
  event_type: 'work' | 'project' | 'achievement' | 'learning' | 'milestone';
}
```

---

### Step 5: Build Timeline Components (2-3 hours)

Create components in this order (dependency graph):

#### 5.1: YearBackground (20 min)

**File**: `src/components/timeline/YearBackground.tsx`

```typescript
"use client";

import { motion } from "framer-motion";

interface YearBackgroundProps {
  activeYear: number | null;
}

const yearGradients: Record<number, { top: string; mid: string }> = {
  2022: { top: "rgba(251,191,36,0.07)", mid: "rgba(245,158,11,0.03)" },
  2023: { top: "rgba(139,92,246,0.07)", mid: "rgba(109,40,217,0.03)" },
  2024: { top: "rgba(99,102,241,0.08)", mid: "rgba(67,56,202,0.03)" },
  2025: { top: "rgba(16,185,129,0.07)", mid: "rgba(5,150,105,0.03)" },
};

export function YearBackground({ activeYear }: YearBackgroundProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Object.entries(yearGradients).map(([year, colors]) => (
        <motion.div
          key={year}
          className="absolute inset-0"
          animate={{ opacity: activeYear === Number(year) ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${colors.top}, ${colors.mid} 40%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
```

**Test**: Import in a page, pass `activeYear={2022}`, verify gradient renders.

#### 5.2: TimelineSpine (45 min)

**File**: `src/components/timeline/TimelineSpine.tsx`

Key features:
- Track (full height background line)
- Fill (animated via `scaleY`)
- Traveling dot (hidden <768px)
- Year markers

See `spec.md` implementation section for full code.

**Test**: Render with static `scrollProgress={0.5}`, verify spine fills to 50%.

#### 5.3: TimelineEventCard (45 min)

**File**: `src/components/timeline/TimelineEventCard.tsx`

Key features:
- Category badge with icon
- Title, summary, impact
- Tech badges (max 5)
- Deep Dive button
- Featured styling (ring + top strip)

**Test**: Render a single event card, verify all metadata displays correctly.

#### 5.4: TimelineYear (30 min)

**File**: `src/components/timeline/TimelineYear.tsx`

Groups events by year, renders year header + event cards.

**Test**: Pass 2024 events, verify year header "2024 — The Intelligence Layer" appears.

#### 5.5: Timeline (Main Orchestrator) (60 min)

**File**: `src/components/sections/Timeline.tsx`

Key features:
- `useScroll` for scroll tracking
- IntersectionObserver for active year detection
- Analytics milestone tracking (25%, 50%, 75%, 100%)
- Layout: spine (left) + content (right)

**Test**: Add to home page, scroll through timeline, verify animations trigger.

#### 5.6: Barrel Exports (5 min)

**File**: `src/components/timeline/index.ts`

```typescript
export { TimelineSpine } from './TimelineSpine';
export { TimelineYear } from './TimelineYear';
export { TimelineEventCard } from './TimelineEventCard';
export { YearBackground } from './YearBackground';
```

---

### Step 6: Add i18n Translations (15 min)

**Files**: `src/messages/en.json`, `src/messages/th.json`

Add timeline-specific keys:

```json
{
  "timeline": {
    "label": "Timeline",
    "title": "The Chronicle",
    "subtitle": "A cinematic journey through milestones, projects, and growth"
  }
}
```

Thai version (`th.json`):

```json
{
  "timeline": {
    "label": "ไทม์ไลน์",
    "title": "พงศาวดาร",
    "subtitle": "การเดินทางที่น่าประทับใจผ่านจุดสำคัญ โปรเจกต์ และการเติบโต"
  }
}
```

---

### Step 7: Integrate into Home Page (10 min)

**File**: `src/app/[locale]/page.tsx`

```typescript
import { Timeline } from '@/components/sections/Timeline';

export default function HomePage() {
  return (
    <>
      {/* ... existing sections */}
      <Timeline />
      {/* ... remaining sections */}
    </>
  );
}
```

---

### Step 8: Add Global CSS Utilities (10 min)

**File**: `src/styles/globals.css`

```css
@layer utilities {
  /* Timeline-specific utilities */
  .timeline-card-hover {
    transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
  }
  .timeline-card-hover:hover {
    transform: translateY(-2px);
  }

  /* Prevent spine from causing horizontal scroll on mobile */
  .timeline-spine-wrapper {
    position: sticky;
    top: 6rem;
    align-self: flex-start;
    height: 0;
    overflow: visible;
  }

  /* Large year number — decorative */
  .year-numeral {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1;
    user-select: none;
    pointer-events: none;
  }
}
```

---

### Step 9: Modal Integration (30 min)

**File**: `src/hooks/useModal.ts` (extend existing)

Add `'timeline-event'` to modal types:

```typescript
type ModalType = 'project' | 'timeline-event' | 'certificate' | 'testimonial';
```

**File**: `src/components/modals/TimelineEventModal.tsx` (create new)

```typescript
import { useLocale } from 'next-intl';
import { timelineEvents } from '@/data/timelineEvents';
import { TechBadge } from '@/components/shared/TechBadge';

export function TimelineEventModal({ eventId }: { eventId: string }) {
  const event = timelineEvents.find(e => e.id === eventId);
  const locale = useLocale() as 'en' | 'th';
  
  if (!event) return <div>Event not found</div>;
  
  const title = locale === 'th' ? event.titleTh || event.titleEn : event.titleEn;
  const description = locale === 'th' ? event.descriptionTh || event.descriptionEn : event.descriptionEn;
  const impact = locale === 'th' ? event.impactTh || event.impactEn : event.impactEn;
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{event.company} · {event.date}</p>
      </div>
      
      <div className="prose prose-sm dark:prose-invert">
        <p>{description}</p>
      </div>
      
      {impact && (
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="text-sm font-semibold mb-2">Impact</h3>
          <p className="text-sm">{impact}</p>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-semibold mb-3">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {event.skills.map(skill => (
            <TechBadge key={skill} name={skill} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Integrate into modal router** (wherever modal content is determined):

```typescript
if (modalData.type === 'timeline-event') {
  return <TimelineEventModal eventId={modalData.id} />;
}
```

---

### Step 10: Performance Verification (20 min)

#### Chrome DevTools Performance Audit

1. Open DevTools → Performance tab
2. Start recording
3. Scroll through entire timeline section
4. Stop recording

**Success Criteria**:
- FPS graph stays at 60fps (green line)
- No long tasks (yellow/red blocks >50ms)
- No layout thrashing (purple "Layout" spikes)

#### Lighthouse Audit

```bash
npm run build
npm start
```

Navigate to `http://localhost:3000` in Chrome Incognito.

**Success Criteria**:
- Performance: 95+ (mobile), 100 (desktop)
- Accessibility: 100
- Best Practices: 100
- SEO: 100

#### Mobile Device Testing

Test on:
- iPhone SE (low-end iOS)
- Pixel 5 (mid-range Android)

**Verify**:
- Traveling dot hidden below 768px ✅
- Scroll remains smooth (no jank) ✅
- Background transitions complete in <1.5s ✅

---

## Common Issues & Solutions

### Issue: TypeScript errors after adding new fields

**Solution**: Ensure all three fields (`descriptionEn`, `descriptionTh`, `featured`) are added to EVERY event in `timelineEvents.ts`. Use empty strings for missing Thai translations.

### Issue: Spine doesn't fill during scroll

**Solution**: Verify `useMotionValueEvent` is updating state:

```typescript
const [spineProgress, setSpineProgress] = useState(0);
useMotionValueEvent(scrollYProgress, "change", (v) => {
  setSpineProgress(v);
});
```

Pass `spineProgress` (state), not `scrollYProgress.get()` (snapshot).

### Issue: Year backgrounds don't crossfade

**Solution**: Check IntersectionObserver is firing. Add console.log:

```typescript
const observer = new IntersectionObserver((entries) => {
  console.log('Intersection:', entries);
  // ...
});
```

### Issue: Horizontal scroll appears on mobile

**Solution**: Ensure spine wrapper has `overflow: visible` and parent has `overflow-x: hidden`:

```tsx
<div className="overflow-x-hidden">
  <Timeline />
</div>
```

### Issue: Analytics events not firing

**Solution**: Verify `trackEvent` is imported from `@/lib/analytics` and GA4 is initialized in layout.

---

## Development Workflow

### Local Development

```bash
npm run dev
```

Navigate to `http://localhost:3000/en` (English) or `http://localhost:3000/th` (Thai).

### Build Verification

```bash
npm run build
```

Should complete with **zero errors** and **zero warnings**.

### Deploy to Vercel

```bash
git add .
git commit -m "feat: implement vertical scroll timeline"
git push origin 003-vertical-scroll-timeline
```

Open PR on GitHub. Vercel will auto-deploy preview.

---

## Next Steps After Implementation

1. **Add Thai Translations**: Fill in `descriptionTh` and `impactTh` for all events
2. **Expand Featured Events**: Write full narratives for 2-3 flagship projects
3. **Add Media**: Collect screenshots/videos for `mediaLinks` field
4. **Fine-tune Colors**: Adjust year theme gradients based on visual feedback
5. **A/B Test**: Track TIMELINE_DEEPDIVE_OPEN rate to optimize CTA placement

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|-------------|
| Data model updates | 1 hour | None |
| Component implementation | 3 hours | Data model |
| Modal integration | 30 min | Components |
| i18n translations | 15 min | None |
| Performance testing | 30 min | All above |
| **Total** | **~5 hours** | Sequential |

**Recommended approach**: Implement incrementally. Test each component in isolation before integration. Use Storybook or dedicated test page for component development if available.
