# Research: Curated Testimonials Experience

**Feature**: 005-curated-testimonials  
**Date**: 2026-03-11  
**Phase**: 0 (Research & Design Decisions)

## Overview

This document captures the key implementation decisions for redesigning the portfolio testimonials experience so it delivers fast trust recognition, deeper credibility on demand, and a more premium editorial presentation without sacrificing accessibility, bilingual quality, or performance.

---

## 1. Authoritative Testimonial Source Strategy

### Decision: Use `.windsurf/docs/curated_testimonials_strategy.md` as the planning authority, then encode the final content into the structured testimonial data model

**Rationale**:

- The curated testimonials strategy already defines the strongest short quote, full quote, speaker context, and proof purpose for each testimonial.
- The constitution requires user-facing content to remain structured and version-controlled inside the application data system.
- Keeping the markdown strategy doc as planning input and `src/data/testimonials.ts` as the shipping source avoids duplication drift.

**Alternatives considered**:

- Render the markdown document directly at runtime — rejected because it bypasses the typed content system.
- Keep the current shorter testimonial dataset and manually copy fragments into components — rejected because it loses depth and weakens consistency.

---

## 2. Summary-First, Detail-on-Demand Pattern

### Decision: Use a layered testimonial model with a high-signal summary card and a richer full-content modal

**Rationale**:

- The constitution explicitly favors skim mode plus deep mode rather than forcing all content into one density level.
- The spec requires visitors to understand testimonial value within seconds while still supporting full-story reading.
- Cards and modal are already established patterns in this portfolio, so strengthening that pattern is lower risk than inventing a new flow.

**Alternatives considered**:

- Show only short quotes on cards with no expansion — rejected because it leaves too much of the proof unused.
- Show only full quotes in the overview — rejected because long text blocks damage first-glance scanning.
- Use summary cards plus an expanded modal — chosen because it satisfies both first impression and detailed proof reading.

---

## 3. Proof Theme Taxonomy

### Decision: Add an explicit proof theme per testimonial to make strategic value visible at a glance

**Rationale**:

- The curated source organizes testimonials by why they matter: business impact, stakeholder confidence, technical ownership, systematic problem solving, and similar themes.
- The current model has `validates` signal references, but the testimonial-specific strategic framing is not surfaced clearly to readers.
- A visible proof theme improves pattern recognition and reduces the chance that quotes feel repetitive.

**Alternatives considered**:

- Leave proof categories implicit — rejected because visitors may miss why each quote is strategically different.
- Encode proof theme only in hidden metadata — rejected because it does not improve scanning.
- Add a single primary proof theme per testimonial with optional related signals — chosen because it stays clear and lightweight.

---

## 4. Modal Reading Experience Strategy

### Decision: Treat the testimonial modal as a focused reading surface with clear speaker context, readable long-form formatting, and preserved emotional tone

**Rationale**:

- Several curated testimonials include multi-paragraph content and supporting statements that lose impact if flattened into one dense paragraph.
- The current `TestimonialModal.tsx` centers one quote but does not yet support richer editorial structure or stronger contextual framing.
- The constitution allows modal-first detail exploration when it preserves narrative continuity and avoids dead ends.

**Alternatives considered**:

- Keep the current visually centered quote-only modal — rejected because it underserves the curated long-form content.
- Route each testimonial to a separate page — rejected because it adds friction and breaks context retention.
- Use a richer in-place modal with structured reading hierarchy — chosen because it keeps users inside the narrative while improving comprehension.

---

## 5. Existing Carousel vs. Layout Strategy

### Decision: Keep the testimonials section within the existing section + modal architecture, but allow card presentation and interaction density to evolve beyond the current generic carousel feel

**Rationale**:

- The repo already has `Testimonials.tsx`, `TestimonialsCarousel.tsx`, and the shared modal system integrated into the homepage flow.
- Reusing the existing architecture lowers implementation risk and keeps the redesign scoped.
- The main weakness is not the existence of a carousel itself, but the generic presentation and insufficient information hierarchy within cards and modal.

**Alternatives considered**:

- Replace the section with a wholly new routing or page architecture — rejected as out of scope.
- Preserve the existing card design with content swaps only — rejected because the spec explicitly targets a top-tier presentation upgrade.
- Rework the card and modal contracts inside the existing architecture — chosen because it aligns ambition with scope.

---

## 6. Bilingual Testimonial Handling

### Decision: Keep English and Thai testimonial content structurally parallel, while allowing preview lines and supporting labels to differ by locale for readability

**Rationale**:

- The project already uses locale-aware fields and `getLocalizedData` helpers.
- Thai and English quote lengths differ, so one-size-fits-all preview truncation would be brittle and potentially distort meaning.
- The constitution requires equivalent value rather than literal text symmetry.

**Alternatives considered**:

- Use English content as the sole full quote and translate only support labels — rejected because it weakens Thai parity.
- Force preview lengths to match character-for-character across locales — rejected because it harms readability.
- Preserve full localized quotes and allow locale-sensitive summaries — chosen because it maintains authenticity and quality.

---

## 7. Analytics Scope for This Feature

### Decision: Reuse existing modal analytics and only add testimonial-specific events if they answer a concrete question about trust-building behavior

**Rationale**:

- `src/lib/analytics.ts` and `ModalContext.tsx` already track modal open and close events.
- The constitution says measurement should inform decisions rather than create noise.
- The feature’s primary success can be validated through UX review and content outcomes before additional instrumentation is justified.

**Alternatives considered**:

- Add broad testimonial interaction tracking for every hover, swipe, and scroll detail — rejected as likely low-value noise.
- Add no measurement consideration at all — rejected because the spec still needs observable success signals.
- Start with existing modal analytics and add targeted follow-up later if necessary — chosen as the most proportionate approach.

---

## 8. Accessibility Strategy

### Decision: Preserve keyboard-operable card selection and modal navigation while ensuring long-form testimonial content remains semantically readable

**Rationale**:

- The spec explicitly requires keyboard-only or equivalent non-pointer interaction clarity.
- The current testimonial cards are clickable, but redesign work must preserve or improve semantic affordances and focus treatment.
- Long-form quote formatting must remain understandable to assistive technologies and not depend on visual styling alone.

**Alternatives considered**:

- Optimize only for visual polish and treat accessibility as regression testing later — rejected because it conflicts with the constitution.
- Reduce all testimonials back to uniform short blurbs to simplify accessibility — rejected because it sacrifices the feature goal.
- Design the richer experience with accessibility as a first-order constraint — chosen because it preserves both quality and compliance.

---

## 9. Data Model Extension Strategy

### Decision: Extend the testimonial model to explicitly support summary content, full content, speaker context, and proof categorization rather than overloading existing generic fields

**Rationale**:

- The current model already has `quote*`, `sharpestLine*`, `authorRole*`, `relationship*`, and `validates`, but the curated content needs more explicit separation between card summary, modal body, and strategic framing.
- A richer typed model will reduce ad hoc formatting logic in components.
- The constitution favors reusable content fragments that support summary and modal representations without changing the underlying facts.

**Alternatives considered**:

- Keep the current schema and derive all presentation states in components — rejected because it would make the UI logic fragile and content harder to maintain.
- Store modal-only formatting directly in JSX — rejected because it breaks the evidence-led structured content system.
- Add explicit typed fields for summary, detail, and proof context — chosen because it best fits the content architecture.

---

## Summary

No blocking technical unknowns remain.

**Key takeaways**:

1. The curated markdown strategy is the planning authority, but structured data remains the shipping source of truth.
2. The correct interaction model is summary first, detail on demand.
3. Each testimonial needs an explicit proof theme to maximize first-glance differentiation.
4. The modal should evolve into a richer reading surface rather than a centered quote splash.
5. Existing modal analytics are sufficient as a starting point; extra tracking must be justified.
