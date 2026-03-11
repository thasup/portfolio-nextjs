# Quickstart: Full Portfolio Content Revision

**Feature**: 004-portfolio-content-revision  
**Date**: 2026-03-11  
**Phase**: 1 (Implementation Guide)

## Prerequisites

- Node.js 18+ installed
- Repository dependencies installed with `npm install`
- Feature branch checked out: `004-portfolio-content-revision`
- Familiarity with the existing content architecture in `src/data/`, `messages/`, and homepage section components
- Source brief available at `.windsurf/docs/full_portfolio_content_revision.md`

---

## Implementation Sequence

### Step 1: Audit the current content surfaces

Review the existing structured content and rendering surfaces before changing copy:

- `src/data/timelineEvents.ts`
- `src/data/timelineChapters.ts`
- `src/data/projects.ts`
- `src/data/testimonials.ts`
- `src/data/skills.ts`
- `src/data/valuePropositions.ts`
- `src/data/contactIntents.ts`
- `messages/en.json`
- `messages/th.json`
- `src/components/sections/*`
- `src/app/[locale]/about/*`
- `src/app/[locale]/contact/*`

**Verification**: Document any existing contradictions in role, company, years of experience, flagship work, or naming before editing.

---

### Step 2: Correct identity, hero, and flagship positioning first

Update the highest-impact first-impression surfaces so the portfolio immediately reflects:

- current TeamStack context
- preferred naming with `First`
- stronger current flagship emphasis
- accurate trust-strip proof points

Likely touch points:

- `src/components/sections/Hero.tsx`
- `src/data/siteConfig.ts`
- `messages/en.json`
- `messages/th.json`

**Verification**: A reviewer should be able to identify current role, present direction, and one trust signal from the first screen alone.

---

### Step 3: Expand the timeline to the full 7+ year arc

Update the timeline data and timeline presentation so the story includes:

- pre-software MEP engineering origin
- self-directed transition chapter
- MAQE growth and leadership arc
- TeamStack product-builder chapter
- clearer capability progression across chapters

Likely touch points:

- `src/data/timelineChapters.ts`
- `src/data/timelineEvents.ts`
- `src/components/sections/Timeline.tsx`
- `src/components/timeline/*`

**Verification**: A reviewer should recognize the engineering-to-software evolution and identify why the earlier chapter matters to the present narrative.

---

### Step 4: Replace placeholder testimonials with real proof

Implement the real attributed testimonials from the source brief and support a skim-friendly preview treatment for their strongest lines.

Likely touch points:

- `src/data/testimonials.ts`
- `src/components/sections/Testimonials.tsx`
- `src/components/sections/TestimonialsCarousel.tsx`

**Verification**: The testimonial section should feel materially more trustworthy and specific than generic praise.

---

### Step 5: Re-rank projects and expose ownership

Update project ordering and project card content to foreground current strategic proof and ownership framing.

Likely touch points:

- `src/data/projects.ts`
- `src/components/sections/Projects.tsx`
- related project detail or modal surfaces under `src/components/projects/` and `src/components/modals/`
- `src/app/[locale]/projects/*`

**Verification**: Reviewers should identify The Air Product as the current flagship and understand what First owned on the strongest work.

---

### Step 6: Introduce the signal system and evidence loops

Add a shared signal vocabulary and ensure claims, projects, testimonials, and value propositions reinforce one another.

Likely touch points:

- `src/data/` shared signal definitions if needed
- `src/data/valuePropositions.ts`
- `src/data/projects.ts`
- `src/data/testimonials.ts`
- `src/data/timelineEvents.ts`
- relevant section components that render chips, labels, or related proof

**Verification**: Repeated signals such as production AI, systems thinking, and product ownership should mean the same thing across sections.

---

### Step 7: Reframe skills, about, and contact paths

Finish the conversion and audience-fit layers by updating:

- capability-cluster-based skills framing
- the full about-page story
- contact intents for AI hiring, product ownership, collaboration, and general outreach

Likely touch points:

- `src/data/skills.ts`
- `src/data/valuePropositions.ts`
- `src/data/contactIntents.ts`
- `src/app/[locale]/about/page.tsx`
- `src/components/sections/Skills.tsx`
- `src/components/sections/ValueProp.tsx`
- `src/components/sections/Contact.tsx`

**Verification**: Different visitor types should find a clear fit path and next step without generic messaging.

---

### Step 8: Complete bilingual parity and consistency review

Run a final pass to ensure the same claims and strategic framing hold in both locales.

Checklist:

- current role and company match
- years of experience match
- flagship project emphasis matches
- testimonials preserve meaning
- contact intents stay equivalent in purpose
- naming is intentionally adapted where needed without factual drift

**Verification**: English- and Thai-speaking reviewers should reach the same understanding of identity, credibility, and next steps.

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

### Content review checklist

- First screen communicates current identity and differentiation.
- Timeline reflects the full 7+ year arc.
- Current flagship work is clearly prioritized.
- Testimonials are real, attributed, and specific.
- Skills are framed as capability, not arbitrary scoring.
- Contact paths acknowledge visitor intent.
- No contradictions remain across sections.

---

## Common Risks

### Risk: Narrative drift between sections

**Mitigation**: Update shared data sources first and check all rendered surfaces after each major content pass.

### Risk: Thai content becomes literal instead of audience-fit

**Mitigation**: Review EN/TH in pairs and validate meaning parity, not string parity.

### Risk: New chips, labels, or previews create visual clutter

**Mitigation**: Preserve skim hierarchy and only surface evidence markers that support decision-making.

### Risk: Ongoing/current work cannot be fully disclosed

**Mitigation**: Keep the current flagship framing truthful at the level of ownership, direction, and relevance without inventing unavailable specifics.

---

## Recommended Implementation Order

1. Hero and identity correction
2. Timeline truth correction
3. Real testimonial replacement
4. Flagship project reprioritization
5. Signal system and evidence loops
6. Skills, value proposition, about, and contact refinements
7. Final bilingual and consistency QA

---

## Summary

This feature is best implemented as a coordinated narrative-system revision, not a sequence of isolated copy tweaks. The fastest safe path is to correct the highest-signal proof surfaces first, then connect them with consistent structured data, bilingual parity, and clear conversion paths.
