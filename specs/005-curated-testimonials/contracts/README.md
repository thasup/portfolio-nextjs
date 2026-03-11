# UI & Content Contracts: Curated Testimonials Experience

**Feature**: 005-curated-testimonials  
**Date**: 2026-03-11  
**Phase**: 1 (Contracts)

## Overview

This feature does not introduce external APIs. The relevant contracts are internal UI/content contracts between the structured testimonial data source and the portfolio surfaces that render overview cards, expanded modal content, and interaction analytics.

---

## 1. Testimonial Data Contract

### Inputs for Testimonial Data Contract

- One structured testimonial entry per curated endorsement
- Localized summary quote
- Localized full quote
- Speaker identity and role context
- Relationship context
- Primary proof theme
- Optional supporting validation signals

### Guarantees for Testimonial Data Contract

- Each testimonial is attributable to a real named speaker.
- Summary and full versions of the same testimonial remain semantically aligned.
- One testimonial entry can power both card and modal views without inventing additional facts.

### Fallbacks for Testimonial Data Contract

- If optional company or avatar metadata is unavailable, attribution, role context, and proof meaning remain mandatory.

---

## 2. Testimonial Card Contract

### Inputs for Testimonial Card Contract

- Summary quote
- Author name
- Author role
- Relationship context
- Proof theme label

### Guarantees for Testimonial Card Contract

- Cards communicate the strongest testimonial value quickly.
- Cards are distinct enough from one another that visitors can perceive variety in proof.
- Cards remain readable and interactable across narrow and wide viewports.

### Fallbacks for Testimonial Card Contract

- If relationship details need to be shortened for smaller screens, author identity and proof theme must still remain visible.

---

## 3. Testimonial Modal Contract

### Inputs for Testimonial Modal Contract

- Full quote content
- Speaker identity and context
- Proof theme label
- Optional supporting context note or validation metadata

### Guarantees for Testimonial Modal Contract

- The modal preserves the full testimonial meaning and speaker voice.
- Attribution remains visible without requiring extra interaction.
- Multi-paragraph or long-form testimonials remain readable rather than collapsing into a dense block.
- Closing the modal returns the visitor to the testimonial overview context.

### Fallbacks for Testimonial Modal Contract

- If decorative metadata is removed for smaller screens, the modal must still preserve quote readability and speaker attribution.

---

## 4. Modal Interaction Contract

### Inputs for Modal Interaction Contract

- Selected testimonial ID
- Existing modal provider open/close behavior
- Existing modal shell rendering path for `testimonial`

### Guarantees for Modal Interaction Contract

- Selecting a testimonial card opens the corresponding testimonial modal.
- The modal always renders the testimonial matching the selected ID.
- Modal close behavior remains consistent with the rest of the portfolio’s modal system.

### Failure Condition for Modal Interaction Contract

- If a testimonial ID cannot be resolved, the interaction contract fails and must degrade gracefully with a visible fallback state.

---

## 5. Bilingual Content Contract

### Inputs for Bilingual Content Contract

- English and Thai summary quotes
- English and Thai full quotes
- English and Thai role/context labels

### Guarantees for Bilingual Content Contract

- English and Thai experiences deliver equivalent trust value and attribution clarity.
- Locale switching does not change the underlying testimonial facts.
- The card and modal hierarchy remain understandable in both locales.

### Fallbacks for Bilingual Content Contract

- If one locale requires shorter supporting labels for readability, the trust meaning must still remain equivalent.

---

## 6. Measurement Contract

### Inputs for Measurement Contract

- Existing `modal_open` and `modal_close` analytics events
- Optional future testimonial-specific event additions

### Guarantees for Measurement Contract

- Baseline testimonial modal interactions remain measurable through existing modal analytics.
- New analytics are only added when they answer a concrete experience question.

### Fallbacks for Measurement Contract

- If no new testimonial-specific events are added, the feature can still be evaluated through existing modal metrics and UX review.

---

## 7. Accessibility Contract

### Required Invariants for Accessibility Contract

- Testimonial cards remain keyboard reachable and clearly interactive.
- Focus visibility is preserved in overview and modal states.
- Modal content remains semantically readable and attributable.
- Interaction cues do not rely solely on motion, hover, or color.

### Failure Condition for Accessibility Contract

If the redesigned testimonials section becomes harder to use with keyboard navigation, reduced vision, or long-form reading, the feature fails accessibility review.

---

## Summary

The core contract for this feature is trustworthy layered storytelling: every testimonial must work as immediate proof in the overview state and as richer evidence in the modal state, while staying attributable, bilingual-ready, and accessible.
