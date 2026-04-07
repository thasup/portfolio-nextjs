# Data Model: Vertical Scroll Timeline

**Feature**: 003-vertical-scroll-timeline  
**Date**: 2026-03-09  
**Phase**: 1 (Data Model & Entities)

## Overview

This document defines the data structures and their relationships for the vertical scroll timeline feature. All entities are implemented as TypeScript interfaces with strict typing.

---

## 1. TimelineEvent

**Location**: `src/types/timeline.ts` (existing, enhanced)  
**Data Source**: `src/data/timelineEvents.ts` (existing, enhanced)

Represents a discrete entry in the chronological narrative.

### Interface

```typescript
export interface TimelineEvent {
  // Identifiers
  id: string;                    // Unique identifier (kebab-case, e.g., "ai-event-platform")
  chapterId: string;             // Parent chapter reference (e.g., "chapter-1-pivot")
  
  // Temporal attributes
  date: string;                  // Display date (e.g., "Oct 2024", "2025 - Present")
  sortDate: string;              // ISO date for sorting (e.g., "2024-10-01")
  
  // Core content (bilingual)
  titleEn: string;               // English title
  titleTh: string;               // Thai title (empty string if missing → fallback to EN)
  summaryEn: string;             // Brief summary for card display (EN)
  summaryTh: string;             // Brief summary for card display (TH)
  descriptionEn: string;         // ✨ NEW: Full narrative for modal (EN)
  descriptionTh: string;         // ✨ NEW: Full narrative for modal (TH)
  impactEn: string;              // Impact statement for card (EN)
  impactTh: string;              // Impact statement for card (TH)
  
  // Metadata
  company: string;               // Context (e.g., "MAQE Bangkok", "Self-directed Learning")
  type: EventType;               // Category (work/project/achievement/learning/milestone)
  featured: boolean;             // ✨ NEW: Visual emphasis flag
  skills: string[];              // Tech stack (max 5 on card, all in modal)
  mediaLinks?: MediaLink[];      // ✨ NEW: Optional media for modal
}

export type EventType = 
  | 'work' 
  | 'project' 
  | 'achievement' 
  | 'learning' 
  | 'milestone';
```

### MediaLink (Optional)

```typescript
export interface MediaLink {
  type: 'image' | 'video' | 'link';
  url: string;
  caption?: string;
  captionTh?: string;
}
```

### Validation Rules

- `id` MUST be unique across all events
- `sortDate` MUST be valid ISO 8601 date string (YYYY-MM-DD)
- `type` MUST be one of the 5 defined event types
- `titleEn` MUST NOT be empty (required for fallback)
- `skills` array MUST contain valid skill names matching `src/data/skills.ts`
- If `featured === true`, event SHOULD have complete description and impact fields

### Example

```typescript
{
  id: 'ai-event-platform',
  chapterId: 'chapter-1-pivot',
  date: 'Oct 2024',
  sortDate: '2024-10-01',
  titleEn: 'AI Event Platform Launch',
  titleTh: 'เปิดตัว AI Event Platform',
  summaryEn: 'Shipped AI-powered event management platform with LLM-driven content generation.',
  summaryTh: 'พัฒนาแพลตฟอร์มจัดการอีเว้นต์ที่ขับเคลื่อนด้วย AI และ LLM',
  descriptionEn: 'Built a full-stack AI event management platform that uses LLMs for agenda generation, speaker matching, and attendee engagement predictions...',
  descriptionTh: '[Full Thai description]',
  impactEn: 'Platform processed 50+ events with 85% reduction in manual content creation time.',
  impactTh: 'แพลตฟอร์มประมวลผลกว่า 50 อีเว้นต์ ลดเวลาสร้างคอนเทนต์ด้วยตนเองลง 85%',
  company: 'MAQE Bangkok',
  type: 'project',
  featured: true,
  skills: ['Next.js', 'LangChain', 'OpenAI API', 'RAG', 'PostgreSQL', 'WebSocket'],
  mediaLinks: [
    {
      type: 'image',
      url: '/projects/ai-event-platform/screenshot-1.webp',
      caption: 'Event dashboard with AI-generated agenda',
      captionTh: 'แดชบอร์ดอีเว้นต์พร้อมวาระที่สร้างด้วย AI'
    }
  ]
}
```

---

## 2. YearTheme

**Location**: `src/data/timelineChapters.ts` (existing, enhanced with YEAR_THEMES constant)

Defines the design tokens for each year's "chapter" aesthetics.

### Interface

```typescript
export interface YearTheme {
  // Labels
  label: string;                 // English label (e.g., "The Foundation")
  labelTh: string;               // Thai label (e.g., "รากฐาน")
  
  // Color palette
  gradientFrom: string;          // RGBA for radial gradient top (e.g., "rgba(251, 191, 36, 0.06)")
  gradientTo: string;            // RGBA for radial gradient mid (e.g., "rgba(245, 158, 11, 0.03)")
  spineColor: string;            // Hex color for spine fill and markers (e.g., "#F59E0B")
  dotColor: string;              // Hex color for spine dots (e.g., "#FCD34D")
  accentHex: string;             // Hex color for borders, text accents (e.g., "#F59E0B")
  
  // Tailwind utility classes (for static elements)
  accentClass: string;           // Text color utility (e.g., "text-amber-500")
  bgClass: string;               // Background gradient utility (e.g., "from-amber-500/5 via-amber-400/3 to-transparent")
}

export type YearKey = 2022 | 2023 | 2024 | 2025;

export const YEAR_THEMES: Record<YearKey, YearTheme> = {
  // ... theme definitions
} as const;
```

### Validation Rules

- All color values MUST be valid CSS color strings (hex, rgba)
- `accentHex` MUST be a 6-digit hex color (e.g., `#F59E0B`)
- Gradient RGBA values SHOULD have low opacity (0.03-0.07) for subtle effects
- Tailwind utility classes MUST match the project's Tailwind configuration

### Example

```typescript
export const YEAR_THEMES: Record<YearKey, YearTheme> = {
  2022: {
    label: "The Foundation",
    labelTh: "รากฐาน",
    gradientFrom: "rgba(251, 191, 36, 0.06)",   // amber-400/6
    gradientTo: "rgba(245, 158, 11, 0.03)",     // amber-500/3
    spineColor: "#F59E0B",                       // amber-500
    dotColor: "#FCD34D",                         // amber-300
    accentHex: "#F59E0B",
    accentClass: "text-amber-500",
    bgClass: "from-amber-500/5 via-amber-400/3 to-transparent",
  },
  // ... 2023, 2024, 2025
} as const;
```

---

## 3. EventCategoryConfig

**Location**: `src/components/timeline/TimelineEventCard.tsx` (component-level constant)

Maps event types to their visual representation.

### Interface

```typescript
interface CategoryConfig {
  icon: LucideIcon;              // Icon component from lucide-react
  label: string;                 // English label
  labelTh: string;               // Thai label
}

const CATEGORY_CONFIG: Record<EventType, CategoryConfig> = {
  work: {
    icon: Briefcase,
    label: "Work",
    labelTh: "งาน",
  },
  project: {
    icon: Code2,
    label: "Project",
    labelTh: "โปรเจกต์",
  },
  achievement: {
    icon: Trophy,
    label: "Achievement",
    labelTh: "ความสำเร็จ",
  },
  learning: {
    icon: BookOpen,
    label: "Learning",
    labelTh: "การเรียนรู้",
  },
  milestone: {
    icon: Rocket,
    label: "Milestone",
    labelTh: "จุดสำคัญ",
  },
} as const;
```

---

## 4. AnalyticsEvent (Timeline-Specific)

**Location**: `src/lib/analytics.ts` (existing, enhanced)

Defines typed analytics events for timeline interactions.

### New Event Types

```typescript
// Existing Events enum extended with:
export const Events = {
  // ... existing events
  TIMELINE_PROGRESS: 'timeline_progress',
  TIMELINE_DEEPDIVE_OPEN: 'timeline_deepdive_open',
} as const;

// Event property types
export interface TimelineProgressEvent {
  percent: 25 | 50 | 75 | 100;
}

export interface TimelineDeepDiveEvent {
  event_id: string;
  event_title: string;
  year: number;
  event_type: EventType;
}
```

### Usage Example

```typescript
// Progress tracking
trackEvent(Events.TIMELINE_PROGRESS, { percent: 50 });

// Deep dive modal open
trackEvent(Events.TIMELINE_DEEPDIVE_OPEN, {
  event_id: 'ai-event-platform',
  event_title: 'AI Event Platform Launch',
  year: 2024,
  event_type: 'project',
});
```

---

## 5. Component Props Interfaces

### TimelineSpine Props

```typescript
interface TimelineSpineProps {
  totalHeight: number;                      // px height of entire timeline section
  scrollProgress: number;                   // 0–1 from parent (live state)
  activeYear: YearKey | null;               // Currently active year in viewport
  yearPositions: Record<YearKey, number>;   // year → offsetTop px
}
```

### TimelineYear Props

```typescript
interface TimelineYearProps {
  year: YearKey;
  events: TimelineEvent[];
  locale: 'en' | 'th';
  onYearEnter: (year: YearKey, offsetTop: number) => void;
}
```

### TimelineEventCard Props

```typescript
interface TimelineEventCardProps {
  event: TimelineEvent;
  year: YearKey;
  index: number;                            // Global index for stagger delay
  locale: 'en' | 'th';
}
```

### YearBackground Props

```typescript
interface YearBackgroundProps {
  activeYear: YearKey | null;
}
```

---

## 6. Data Relationships

```
TimelineEvent (many)
    │
    ├─► chapterId ──► (implicit) Chapter concept (not enforced)
    │
    ├─► sortDate ──► Determines year grouping
    │                (extract year via `new Date(sortDate).getFullYear()`)
    │
    └─► type ──────► CATEGORY_CONFIG (visual mapping)

YearKey (2022 | 2023 | 2024 | 2025)
    │
    └─► YEAR_THEMES[year] ──► YearTheme (design tokens)

TimelineEvent.skills[]
    │
    └─► (references) src/data/skills.ts skill names
```

---

## 7. Data Migration Plan

### Existing Data Files to Enhance

#### `src/data/timelineEvents.ts`

**Changes Required**:
- Add `descriptionEn: string` field to all events (copy from `descriptionEn` if exists, or expand from `summaryEn`)
- Add `descriptionTh: string` field (empty string if not translated yet)
- Add `featured: boolean` field (default: `false`, set `true` for 2-3 flagship projects)
- Add optional `mediaLinks?: MediaLink[]` field (can be added incrementally)

**Migration Script** (manual):
```typescript
// For each event in timelineEvents array:
{
  // ... existing fields
  descriptionEn: event.summaryEn,  // Start with summary, expand later
  descriptionTh: '',               // Add Thai translation later
  featured: false,                 // Mark 2-3 key projects as true
  // mediaLinks: []                // Optional, add when assets ready
}
```

#### `src/data/timelineChapters.ts`

**Changes Required**:
- Export `YEAR_THEMES` constant alongside existing chapter data
- Ensure year themes match the spec's color palette

**Example Addition**:
```typescript
export const YEAR_THEMES: Record<YearKey, YearTheme> = {
  2022: { /* amber theme */ },
  2023: { /* violet theme */ },
  2024: { /* indigo theme */ },
  2025: { /* emerald theme */ },
} as const;
```

### New Data Files to Create

None required. All data lives in existing files.

---

## 8. Type Safety Checklist

- [ ] `src/types/timeline.ts` updated with `descriptionEn/Th`, `featured`, `mediaLinks?`
- [ ] `src/data/timelineEvents.ts` all entries validated against updated interface
- [ ] `src/data/timelineChapters.ts` exports `YEAR_THEMES` constant
- [ ] `src/lib/analytics.ts` includes `Events.TIMELINE_PROGRESS` and `Events.TIMELINE_DEEPDIVE_OPEN`
- [ ] All component prop interfaces defined with strict types
- [ ] No `any` types anywhere in timeline feature code

---

## Summary

All entities are well-defined with strict TypeScript interfaces. Data model leverages existing structures (`timelineEvents.ts`, `timelineChapters.ts`) with minimal additions. No new database tables or external data sources required. Migration plan is straightforward: add 3 fields to existing events, export YEAR_THEMES constant.
