# Research: Full Portfolio Content Revision

**Feature**: 004-portfolio-content-revision  
**Date**: 2026-03-11  
**Phase**: 0 (Research & Design Decisions)

## Overview

This document captures the key design and implementation decisions for a content-heavy portfolio revision that must improve first impression, trust, and conversion quality without weakening bilingual quality, performance, or maintainability.

---

## 1. Content Source-of-Truth Strategy

### Decision: Treat structured repository content as the shipping source of truth, with the revision brief as the planning authority

**Rationale**:

- The constitution requires user-facing content to remain structured and version-controlled.
- The feature brief in `.windsurf/docs/full_portfolio_content_revision.md` contains the corrected facts, stronger narrative framing, and implementation priorities needed to repair the current portfolio story.
- Shipping content must still live in reusable app data sources rather than a one-off markdown document.

**Alternatives considered**:

- Keep the markdown document as a runtime content source — rejected because it would bypass the existing typed content system.
- Scatter copy updates directly into JSX — rejected because it would create drift and weaken reuse across sections and locales.

---

## 2. Narrative Revision Scope

### Decision: Revise all high-signal narrative surfaces in one coordinated pass

**Rationale**:

- The current problem is not isolated to one section; the hero, timeline, projects, testimonials, value proposition, about story, and contact flows all contribute to credibility.
- Partial fixes would preserve contradictions such as old employer context, undersold years of experience, or outdated flagship emphasis.
- Coordinated revision is the safest way to meet the spec requirement for zero unresolved contradictions across major surfaces.

**Alternatives considered**:

- Update hero only — rejected because it would still leave legacy contradictions elsewhere.
- Update timeline only — rejected because first-impression and conversion paths would remain weak.
- Do a complete coordinated revision — chosen because the sections must reinforce one another.

---

## 3. Hero Positioning Strategy

### Decision: Optimize the hero for first-screen comprehension of identity, current role, and differentiated trajectory

**Rationale**:

- Constitution standards require the first screen to communicate who First is, what he does, and why he is differentiated.
- The brief makes clear that current TeamStack context, AI-first direction, preferred naming, and high-value trust signals are central to first-impression quality.
- Hero copy should remain skim-first and evidence-backed rather than overly poetic.

**Alternatives considered**:

- Lead with broad aspirational founder messaging — rejected because it risks sounding speculative before proof is established.
- Lead with dense technical detail — rejected because it weakens first-glance clarity.
- Lead with concise current-role positioning supported by trust signals — chosen because it balances clarity and ambition.

---

## 4. Timeline Storytelling Approach

### Decision: Present the timeline as capability evolution across a full 7+ year arc

**Rationale**:

- The constitution defines the timeline as a narrative centerpiece and requires that it read as capability evolution rather than a raw log.
- The source brief materially changes the story by restoring the pre-software engineering chapter and showing that the pivot is evolution, not escape.
- This structure also supports deeper trust by showing systems thinking before software, not only after it.

**Alternatives considered**:

- Start the story at the first software role — rejected because it erases the systems-thinking origin story.
- Keep chronology but remove narrative framing — rejected because it weakens comprehension and recall.
- Use chapter-based chronology with explicit capability progression — chosen because it aligns with constitution and source brief.

---

## 5. Featured Project Prioritization

### Decision: Rank projects by strategic signal strength instead of chronology alone

**Rationale**:

- The brief explicitly identifies The Air Product as the current flagship and TeamStack Roster as missing current-role proof.
- Visitors evaluating fit care more about current trajectory and strongest signal than simple historical order.
- Flagship ordering should reinforce current direction toward AI-first product building.

**Alternatives considered**:

- Keep chronological order — rejected because it undersells current capability.
- Use only featured/current projects and hide older range proof — rejected because the site still needs depth and range.
- Use strategic ranking with tiered proof — chosen because it balances current relevance with breadth.

---

## 6. Testimonial Strategy

### Decision: Replace placeholder praise with real attributed testimonials and expose a skim-friendly strongest-line preview

**Rationale**:

- The brief states this is the single highest-impact trust change.
- Real quotes from clients, managers, peers, and leadership validate different strengths: ownership, trust, systems thinking, cross-functional collaboration, and initiative.
- Long quotes can overwhelm skim readers, so a strongest-line preview pattern supports both skim mode and deep mode.

**Alternatives considered**:

- Use only shortened testimonial excerpts — rejected because it weakens attribution depth.
- Show only full quotes — rejected because skim readers may miss the strongest signal.
- Show real attributed quotes with strongest-line preview and expansion path — chosen because it maximizes both trust and readability.

---

## 7. Signal System Design

### Decision: Use a reusable cross-section signal taxonomy to reinforce recurring strengths

**Rationale**:

- The source brief proposes a site-wide semantic marker system for concepts such as production AI, product ownership, systems thinking, and founder trajectory.
- The constitution explicitly encourages visual labels and metadata that help visitors recognize patterns quickly.
- Repeated signals create evidence loops across hero, timeline, projects, testimonials, and value propositions.

**Alternatives considered**:

- Keep each section semantically isolated — rejected because repeated strengths become harder to remember.
- Add too many bespoke chips per section — rejected because it increases cognitive load.
- Reuse a shared signal vocabulary across sections — chosen because it improves recognition and consistency.

---

## 8. Skills Framing Model

### Decision: Reframe skills around capability clusters with proof and current emphasis

**Rationale**:

- The source brief replaces generic percentage bars with narrative clusters tied to evidence and strategic direction.
- This better serves hiring managers and founders who care about applied capability, not arbitrary self-scoring.
- It also allows the portfolio to emphasize current AI focus without hiding strong frontend and full-stack foundations.

**Alternatives considered**:

- Preserve flat percentage bars — rejected because they are low-trust and low-context.
- Replace skills with a simple tech list — rejected because it hides strategic emphasis.
- Use capability clusters with evidence references — chosen because it is both more credible and more decision-useful.

---

## 9. Contact Intent Design

### Decision: Keep contact intent-aware and explicitly support AI hiring, product ownership, collaboration, and general outreach

**Rationale**:

- The constitution requires conversion UX to acknowledge visitor intent rather than default to a generic contact form.
- The brief provides clear differentiated audiences and tailored prompts for each.
- Intent-aware contact copy should reduce ambiguity and help qualified opportunities self-identify faster.

**Alternatives considered**:

- Single generic contact form — rejected because it weakens conversion clarity.
- Too many narrow contact intents — rejected because it fragments the CTA surface.
- Four clear intent paths — chosen because it covers the most important visitor motivations cleanly.

---

## 10. Analytics Scope for This Revision

### Decision: Prefer content validation and existing engagement signals before adding new events

**Rationale**:

- The constitution says measurement must answer real questions and avoid noise.
- This feature is primarily a content/system revision; success is first established through moderated review and consistency checks.
- If new instrumentation is added, it should be narrowly scoped to flagship engagement, testimonial interaction, or intent-path selection.

**Alternatives considered**:

- Add broad new tracking across every revised section — rejected as low-value noise.
- Add no measurable follow-up at all — rejected because the spec still requires observable success signals.
- Use existing analytics where possible and add only high-value events later if necessary — chosen as the balanced path.

---

## 11. Bilingual Content Handling

### Decision: Preserve meaning parity across EN/TH while allowing audience-appropriate wording

**Rationale**:

- The constitution requires equivalent value, not literal translation.
- The brief contains locale-sensitive framing, especially around preferred naming, warmth, and Thai market resonance.
- Revision work should treat bilingual content as paired strategic messaging, not mirrored string replacement.

**Alternatives considered**:

- Literal translation of English-first copy — rejected because it weakens audience fit.
- Separate unrelated narratives by locale — rejected because it risks factual drift.
- Equivalent meaning with culturally appropriate phrasing — chosen because it preserves trust and parity.

---

## 12. Implementation Priority Order

### Decision: Sequence work by highest trust and contradiction risk first

**Rationale**:

- The brief’s priority order is sound: timeline truth, real testimonials, current flagship projects, and hero corrections produce the biggest product impact first.
- Downstream refinements such as evidence loops and capability chips are highest-value after the core narrative is corrected.

**Chosen sequence**:

1. Hero accuracy and current-role correction
2. Full timeline revision to 7+ year arc
3. Real testimonial replacement and preview treatment
4. Flagship project reprioritization and ownership framing
5. Signal system and evidence loops
6. Skills, value proposition, about, and contact refinements
7. Final bilingual consistency pass and regression review

---

## Summary

No blocking technical unknowns remain. The implementation is primarily a structured content and UI-contract revision within the existing Next.js architecture.

**Key takeaways**:

1. Structured content remains the shipping source of truth.
2. The revision must be coordinated across all major proof surfaces.
3. The highest-value work is truth correction plus stronger trust signals.
4. Bilingual parity and evidence loops are first-class design constraints.
5. Additional analytics should be minimal and justified.
