# Data Model: Curated Testimonials Experience

**Feature**: 005-curated-testimonials  
**Date**: 2026-03-11  
**Phase**: 1 (Data Model & Entities)

## Overview

This feature extends the portfolio’s existing testimonial content model so the same underlying proof can support two presentation layers: a fast-scanning testimonial card and a richer editorial modal. The feature does not add database-backed models; it strengthens version-controlled data entities and their UI-facing contracts.

---

## 1. TestimonialEntry

**Location**: `src/data/testimonials.ts` and `src/types/testimonial.ts`

Represents one curated testimonial with summary, attribution, and full-detail presentation fields.

### Core attributes for TestimonialEntry

```typescript
interface TestimonialEntry {
  id: string;
  authorName: string;
  authorRoleEn: string;
  authorRoleTh: string;
  company?: string;
  relationshipEn: string;
  relationshipTh: string;
  proofThemeId: TestimonialProofThemeId;
  proofThemeLabelEn: string;
  proofThemeLabelTh: string;
  summaryQuoteEn: string;
  summaryQuoteTh: string;
  fullQuoteEn: string;
  fullQuoteTh: string;
  contextNoteEn?: string;
  contextNoteTh?: string;
  validates?: SignalId[];
  authorAvatar?: string;
}
```

### Validation rules for TestimonialEntry

- `id` MUST be unique.
- `authorName`, `authorRoleEn`, `relationshipEn`, `summaryQuoteEn`, and `fullQuoteEn` MUST exist.
- `summaryQuote*` MUST preserve the meaning of the curated card quote.
- `fullQuote*` MUST preserve the intended meaning and voice of the curated full endorsement.
- `proofThemeId` MUST map to an approved proof theme.
- `summaryQuote*` and `fullQuote*` MUST not contradict each other.
- Thai fields SHOULD preserve equivalent meaning even if phrasing or length differs.

---

## 2. TestimonialProofTheme

**Location**: likely colocated with testimonial data or types

Represents the primary strategic reason a testimonial matters in the portfolio’s trust narrative.

### Core attributes for TestimonialProofTheme

```typescript
type TestimonialProofThemeId =
  | 'business-impact'
  | 'technical-ownership'
  | 'stakeholder-confidence'
  | 'force-multiplier'
  | 'systematic-problem-solving'
  | 'psychological-safety'
  | 'cultural-catalyst'
  | 'root-cause-collaboration'
  | 'engineering-mentorship'
  | 'trust-organization';

interface TestimonialProofTheme {
  id: TestimonialProofThemeId;
  labelEn: string;
  labelTh: string;
  descriptionEn: string;
  descriptionTh: string;
}
```

### Validation rules for TestimonialProofTheme

- Theme IDs MUST remain stable once adopted.
- Labels MUST be readable in a card or modal metadata context.
- Descriptions SHOULD explain why the testimonial is strategically different from others.

---

## 3. TestimonialCardViewModel

**Location**: Derived in section components from `TestimonialEntry`

Represents the minimal information required for fast scanning in the overview state.

### Core attributes for TestimonialCardViewModel

```typescript
interface TestimonialCardViewModel {
  id: string;
  summaryQuote: string;
  authorName: string;
  authorRole: string;
  relationship: string;
  proofThemeLabel: string;
  credibilitySignals?: string[];
}
```

### Validation rules for TestimonialCardViewModel

- The card model MUST be derivable from one `TestimonialEntry` without inventing new facts.
- The visible combination of summary quote, author, and proof theme MUST help differentiate the testimonial from adjacent cards.
- Card content MUST stay readable in narrow viewports.

---

## 4. TestimonialModalViewModel

**Location**: Derived in `TestimonialModal.tsx` from `TestimonialEntry`

Represents the data needed for the expanded reading state.

### Core attributes for TestimonialModalViewModel

```typescript
interface TestimonialModalViewModel {
  id: string;
  fullQuote: string;
  authorName: string;
  authorRole: string;
  relationship: string;
  company?: string;
  proofThemeLabel: string;
  proofThemeDescription?: string;
  contextNote?: string;
  validates?: string[];
}
```

### Validation rules for TestimonialModalViewModel

- The modal model MUST preserve the full testimonial meaning.
- Attribution MUST remain visible without requiring the reader to hunt for it.
- Optional supporting metadata MUST clarify trust context rather than clutter the reading surface.

---

## 5. TestimonialInteractionState

**Location**: existing modal and testimonials UI state

Represents the active interaction state for the testimonial browsing flow.

### Core attributes for TestimonialInteractionState

```typescript
interface TestimonialInteractionState {
  selectedTestimonialId: string | null;
  isModalOpen: boolean;
  lastViewedTestimonialId?: string;
}
```

### Validation rules for TestimonialInteractionState

- `selectedTestimonialId` MUST map to a valid testimonial whenever `isModalOpen` is `true`.
- Closing the modal MUST return the visitor to the overview context without losing section orientation.

---

## Entity Relationships

```text
TestimonialProofTheme
  └── categorizes ─────► TestimonialEntry (many)

TestimonialEntry
  ├── derives ─────────► TestimonialCardViewModel
  ├── derives ─────────► TestimonialModalViewModel
  └── validates ───────► SignalId (many, optional)

TestimonialInteractionState
  └── selects ─────────► TestimonialEntry (zero or one at a time)
```

---

## Data Migration Plan

### Existing files to enhance

- `src/data/testimonials.ts`
- `src/types/testimonial.ts`
- `src/components/sections/Testimonials.tsx`
- `src/components/sections/TestimonialsCarousel.tsx`
- `src/components/modal/content/TestimonialModal.tsx`

### Potential supporting updates

- `messages/en.json`
- `messages/th.json`
- `src/lib/analytics.ts` if targeted testimonial-specific events are later justified

### Migration priorities

1. Normalize the curated testimonial set into a richer structured schema.
2. Ensure summary-card content and modal content are explicitly separated.
3. Add proof theme labeling and any supporting context fields.
4. Update UI components to consume the richer schema without hardcoded copy logic.
5. Validate bilingual parity and modal/card readability.

---

## Summary

The key modeling requirement is representational integrity: one testimonial entry must be able to power a concise overview card and a rich modal without changing the underlying facts, speaker identity, or strategic meaning.
