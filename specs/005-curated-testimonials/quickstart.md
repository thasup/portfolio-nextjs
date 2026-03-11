# Quickstart: Curated Testimonials Experience

**Feature**: 005-curated-testimonials  
**Date**: 2026-03-11  
**Phase**: 1 (Implementation Guide)

## Prerequisites

- Node.js 18+ installed
- Repository dependencies installed with `npm install`
- Feature branch checked out: `005-curated-testimonials`
- Familiarity with the current testimonials flow in `src/data/testimonials.ts`, `src/components/sections/Testimonials.tsx`, `src/components/sections/TestimonialsCarousel.tsx`, and `src/components/modal/content/TestimonialModal.tsx`
- Curated source brief available at `.windsurf/docs/curated_testimonials_strategy.md`

## Setup Audit Notes

- **Current content gap**: `src/data/testimonials.ts` does not yet reflect the full curated testimonial set and strategic proof framing from the source brief.
- **Current card gap**: `src/components/sections/TestimonialsCarousel.tsx` presents testimonial cards in a solid base pattern, but the hierarchy still feels generic and underuses proof themes and strategic context.
- **Current modal gap**: `src/components/modal/content/TestimonialModal.tsx` renders a quote-centric experience, but it does not yet support richer long-form reading or stronger contextual framing for curated endorsements.
- **Current analytics baseline**: modal open/close analytics already exist via `ModalContext.tsx`, so the feature can ship without immediate new tracking unless a stronger measurement question emerges.

## Implementation Sequence

### Step 1: Normalize the curated testimonial content into structured data

Update the testimonials data source so each curated endorsement includes:

- summary quote for card presentation
- full quote for modal presentation
- speaker attribution
- role and relationship context
- strategic proof theme
- any optional supporting metadata needed for premium presentation

Likely touch points:

- `src/data/testimonials.ts`
- `src/types/testimonial.ts`

**Verification**: Every curated testimonial from the source brief is represented in a typed structure that can support both overview cards and the modal.

---

### Step 2: Redesign the testimonial cards for faster trust recognition

Revise the overview state so cards communicate high-signal proof immediately.

Goals:

- emphasize strongest summary wording
- surface who is speaking
- surface why the quote matters
- preserve readability on mobile and desktop

Likely touch points:

- `src/components/sections/Testimonials.tsx`
- `src/components/sections/TestimonialsCarousel.tsx`
- supporting UI primitives under `src/components/ui/` if needed

**Verification**: A reviewer can scan the section and identify multiple distinct strengths and speaker contexts within a few seconds.

---

### Step 3: Upgrade the testimonial modal into a richer reading surface

Revise the modal so it supports full-length curated content with stronger context and better editorial structure.

Goals:

- preserve full quote meaning
- improve readability for multi-paragraph endorsements
- keep attribution visible
- maintain continuity with the existing modal system

Likely touch points:

- `src/components/modal/content/TestimonialModal.tsx`
- `src/components/modal/ModalShell.tsx`
- `src/components/modal/ModalContext.tsx` if interaction behavior needs refinement

**Verification**: Long testimonials remain readable and premium-feeling without losing context or modal consistency.

---

### Step 4: Validate bilingual integrity and support copy

Ensure the testimonial experience works equally well in English and Thai.

Likely touch points:

- `src/data/testimonials.ts`
- `messages/en.json`
- `messages/th.json`
- shared localization helpers if needed

**Verification**: Both locales preserve attribution clarity, proof meaning, and section readability.

---

### Step 5: Validate accessibility and responsive behavior

Review interaction and reading quality across devices and input methods.

Checklist:

- cards are keyboard reachable
- modal focus behavior remains intact
- long-form content reads comfortably on smaller screens
- interaction cues do not depend on hover alone
- layout does not clip or overwhelm attribution metadata

**Verification**: The section remains usable and understandable in keyboard-only, mobile, and desktop contexts.

---

### Step 6: Decide whether any testimonial-specific analytics are actually needed

Only extend measurement if there is a real decision question such as:

- which proof themes attract opens
- whether visitors open multiple testimonials in sequence
- whether the upgraded modal encourages deeper reading

Likely touch points:

- `src/lib/analytics.ts`
- `src/components/modal/ModalContext.tsx`
- testimonials UI components if a narrowly scoped event is justified

**Verification**: No low-value analytics are added; any added event has a clear downstream use.

---

## Validation Workflow

### Local development

```bash
npm run dev
```

Open:

- `http://localhost:3000/en`
- `http://localhost:3000/th`

### Build verification

```bash
npm run build
npm run lint
```

### Experience review checklist

- The testimonials section feels materially more premium than the prior version.
- Cards communicate speaker, proof, and value at a glance.
- Modal content supports deeper reading without becoming dense or disorienting.
- Speaker attribution remains obvious in overview and modal states.
- EN and TH preserve equivalent trust value.
- No clipping, overlap, or readability failures appear on mobile or desktop.

---

## Common Risks

### Risk: Richer cards become visually noisy

**Mitigation**: Prioritize one dominant line of proof, then layer supporting metadata only if it improves scanning.

### Risk: Long quotes become tiring to read in the modal

**Mitigation**: Use clearer hierarchy and paragraph structure, and avoid collapsing long endorsements into one visual block.

### Risk: Thai and English summaries diverge in meaning

**Mitigation**: Validate each pair of summary and full quotes for semantic parity rather than character parity.

### Risk: Extra analytics create noise without insight

**Mitigation**: Ship with existing modal events unless a new event answers a specific product question.

---

## Recommended Implementation Order

1. Normalize curated testimonial data
2. Redesign the card hierarchy
3. Upgrade the modal reading experience
4. Validate bilingual support
5. Validate accessibility and responsiveness
6. Add only justified analytics refinements

---

## Summary

This feature is best implemented as a content-and-presentation redesign inside the existing testimonials architecture. The safest high-impact path is to strengthen the structured testimonial model first, then redesign the cards and modal to express that richer proof cleanly across languages, screen sizes, and interaction modes.
