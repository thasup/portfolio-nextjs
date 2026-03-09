# Contracts: Vertical Scroll Timeline

**Feature**: 003-vertical-scroll-timeline  
**Date**: 2026-03-09

## Contract Scope Decision

**Verdict**: No external contracts required for this feature.

### Rationale

The vertical scroll timeline is a **UI component feature** that:

1. Does not expose any public APIs to external consumers
2. Does not define CLI commands or schemas
3. Does not create new HTTP endpoints or webhooks
4. Does not establish inter-service communication protocols

### Internal Contracts (TypeScript Interfaces)

All component interfaces are **internal contracts** between React components and are fully documented in:

- **Data Model**: [`../data-model.md`](../data-model.md) — Entity definitions and validation rules
- **Type Safety**: `src/types/timeline.ts` — TypeScript interfaces enforced at compile time
- **Component Props**: Documented in data-model.md Section 5

### Consumer Contract

The timeline feature is consumed by the home page:

```typescript
// src/app/[locale]/page.tsx
import { Timeline } from '@/components/sections/Timeline';

export default function HomePage() {
  return (
    <>
      <Timeline />
    </>
  );
}
```

**Consumer expectations**:
- Timeline is a self-contained section component
- No props required (all data sourced from `src/data/timelineEvents.ts`)
- Renders bilingual content based on Next.js locale context
- Respects user's theme preference (dark/light mode)
- Fires GA4 analytics events automatically

### Data Contract

Timeline components consume data from static TypeScript files:

**Data Source**: `src/data/timelineEvents.ts`

**Contract**: All events MUST conform to the `TimelineEvent` interface (see data-model.md)

**Breaking changes**:
- Adding required fields to `TimelineEvent` interface → TypeScript compilation error
- Removing fields → Runtime error if components depend on them
- Changing field types → TypeScript compilation error

**Non-breaking changes**:
- Adding optional fields (e.g., `mediaLinks?`)
- Adding new events to the array
- Updating bilingual content strings

### Modal Contract

Timeline integrates with the existing centralized modal system:

**Contract**: `useModal` hook accepts:

```typescript
open({ 
  type: 'timeline-event', 
  id: string  // Must match a valid event.id from timelineEvents.ts
});
```

**Provider**: Timeline components  
**Consumer**: `src/hooks/useModal.ts` (existing modal orchestrator)

**Breaking changes**:
- Changing modal type string → requires update in modal router
- Changing ID format → breaks URL hash pattern

### Analytics Contract

Timeline fires typed GA4 events:

**Events**:
1. `TIMELINE_PROGRESS` with `{ percent: 25 | 50 | 75 | 100 }`
2. `TIMELINE_DEEPDIVE_OPEN` with `{ event_id, event_title, year, event_type }`

**Consumer**: Google Analytics 4 via `src/lib/analytics.ts`

**Breaking changes**:
- Changing event names → breaks GA4 dashboard queries
- Removing required properties → analytics data incomplete

---

## Summary

This feature follows the **data-driven component pattern** with no external-facing contracts. All interfaces are TypeScript-enforced internal contracts. The component is a drop-in section that integrates seamlessly with the existing architecture.

For contract specifications in features that **do** expose external interfaces, see:
- Web APIs: OpenAPI/Swagger specs
- CLI tools: Command schema + help text
- Libraries: Public API surface documentation
