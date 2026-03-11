# UI & Content Contracts: Full Portfolio Content Revision

**Feature**: 004-portfolio-content-revision  
**Date**: 2026-03-11  
**Phase**: 1 (Contracts)

## Overview

This feature does not introduce external APIs. The relevant contracts are internal UI/content contracts between structured data sources and the portfolio surfaces that render them.

---

## 1. Hero Contract

### Inputs

- Preferred display name and current-role positioning
- Short trust-strip proof points
- Primary and secondary CTAs
- Locale-specific messaging for EN and TH

### Guarantees

- The first screen exposes identity, current focus, and differentiation without requiring secondary interaction.
- No more than two dominant CTAs compete for attention.
- Hero content remains equivalent in meaning across locales.

### Fallbacks

- If a locale-specific phrase is unavailable, the English meaning must still be preserved without leaving the hero incomplete.

---

## 2. Timeline Contract

### Inputs

- Ordered career chapters
- Ordered timeline events with summaries, impacts, optional richer narratives, and linked signals/testimonials
- Locale-aware labels and chapter framing

### Guarantees

- The timeline reads as capability evolution across a 7+ year arc.
- Current proof is reachable quickly without erasing the earlier systems-thinking origin.
- Reduced-motion and accessible reading paths preserve information even if presentation becomes less cinematic.

### Fallbacks

- If a richer description is unavailable for a locale, the summary-level content must still communicate the event truthfully.

---

## 3. Projects Contract

### Inputs

- Strategically ranked project entries
- Flagship status
- Ownership framing (`what I owned` or equivalent)
- Signals and related evidence

### Guarantees

- Current flagship work appears before lower-priority historical proof when signaling present direction.
- Each featured project makes strategic contribution understandable, not just technologies used.

### Fallbacks

- If some current work cannot be described exhaustively, the project card must still truthfully communicate role, level of ownership, and why the work matters.

---

## 4. Testimonials Contract

### Inputs

- Real attributed quotes
- Strongest-line preview text where used
- Author identity and relationship context
- Optional validation tags/signals

### Guarantees

- Testimonials are attributable and specific.
- Preview surfaces expose a high-signal line before full quote expansion when preview mode is used.
- Testimonial content reinforces broader portfolio claims rather than acting as isolated praise.

### Fallbacks

- If avatar or extended relationship metadata is unavailable, attribution and quote specificity remain mandatory.

---

## 5. Signals Contract

### Inputs

- Shared signal taxonomy with stable IDs and labels
- Mappings from signals to projects, timeline events, testimonials, and value propositions

### Guarantees

- Repeated signals mean the same thing everywhere they appear.
- Signals improve scanning and pattern recognition rather than becoming decorative noise.

### Fallbacks

- If a section cannot visually render chips, the semantic link can still be preserved through nearby text or metadata.

---

## 6. Skills Contract

### Inputs

- Capability clusters
- Evidence references
- Current-focus or core-strength emphasis where relevant

### Guarantees

- Skills are framed around applied capability and current direction.
- The section supports both breadth and emphasis without devolving into arbitrary self-scoring.

---

## 7. Value Proposition Contract

### Inputs

- Audience-relevant value statements
- Linked proof and optional testimonial validation
- Shared signal references

### Guarantees

- Every major value proposition is anchored in evidence.
- Value propositions help visitors self-sort by fit rather than repeating generic self-description.

---

## 8. Contact Intent Contract

### Inputs

- Intent key
- Label and heading per locale
- Tailored preview prompt
- Optional placeholder guidance

### Guarantees

- Contact surfaces distinguish AI hiring, product ownership, collaboration, and general outreach.
- Each path sets expectations for what context the visitor should provide.
- No intent path feels like a generic duplicated form.

---

## 9. Cross-Section Consistency Contract

### Required invariant set

The following must remain consistent across all rendered surfaces:

- Preferred naming and professional identity
- Current company and present direction
- Years of experience and story chronology
- Flagship project emphasis
- Certification and credibility references
- Audience-specific next steps

### Failure condition

If any of the above differ between hero, timeline, projects, testimonials, about, or contact surfaces, the feature fails content consistency review.

---

## Summary

The core contract for this feature is trust consistency. Every content surface must read from structured evidence and reinforce the same story with different levels of detail, not tell competing versions of who First is or why he matters.
