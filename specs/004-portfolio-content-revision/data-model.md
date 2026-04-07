# Data Model: Full Portfolio Content Revision

**Feature**: 004-portfolio-content-revision  
**Date**: 2026-03-11  
**Phase**: 1 (Data Model & Entities)

## Overview

This document defines the structured content entities that support the full portfolio content revision. The feature does not add database-backed models; it strengthens and extends version-controlled content models that drive the portfolio UI across hero, timeline, projects, testimonials, skills, value propositions, about, and contact paths.

---

## 1. NarrativeClaim

**Location**: Cross-cutting concept across `src/data/*`, `messages/*`, and section components

Represents a core statement about identity, capability, trajectory, or differentiation that appears in multiple places and must remain consistent.

### Core attributes

```typescript
interface NarrativeClaim {
  id: string;
  theme:
    | 'identity'
    | 'current_role'
    | 'career_arc'
    | 'flagship_work'
    | 'credibility'
    | 'founder_trajectory'
    | 'audience_fit';
  statementEn: string;
  statementTh: string;
  proofRefs: string[];
  surfacedIn: string[];
}
```

### Validation rules

- `id` MUST be unique.
- `statementEn` MUST exist.
- `proofRefs` MUST map to at least one supporting project, timeline event, testimonial, certification, or capability cluster.
- No two surfaced claims may contradict each other on role, company, years of experience, credentials, or flagship emphasis.

---

## 2. CareerChapter

**Location**: `src/data/timelineChapters.ts` (existing, enhanced as needed)

Represents a major phase in the career story.

### Core attributes

```typescript
interface CareerChapter {
  id: string;
  yearKey: number;
  labelEn: string;
  labelTh: string;
  periodLabelEn: string;
  periodLabelTh: string;
  narrativeRoleEn: string;
  narrativeRoleTh: string;
  tagEn: string;
  tagTh: string;
  accent: string;
}
```

### Validation rules

- Chapters MUST preserve chronological order.
- Labels MUST support the story of capability evolution, not just time grouping.
- The sequence MUST cover pre-software engineering through current TeamStack work.

---

## 3. TimelineEvent

**Location**: `src/data/timelineEvents.ts` (existing, enhanced)

Represents a dated piece of evidence in the career arc.

### Core attributes

```typescript
interface TimelineEvent {
  id: string;
  date: string;
  sortDate: string;
  titleEn: string;
  titleTh: string;
  company?: string;
  type: 'work' | 'project' | 'achievement' | 'learning' | 'milestone';
  chapter: number;
  featured: boolean;
  summaryEn: string;
  summaryTh: string;
  descriptionEn?: string;
  descriptionTh?: string;
  impactEn?: string;
  impactTh?: string;
  capabilityGainedEn?: string;
  capabilityGainedTh?: string;
  skills?: string[];
  signals?: SignalId[];
  testimonialRef?: string;
  duration?: string;
}
```

### Validation rules

- `sortDate` MUST be a valid sortable date string.
- `titleEn` and `summaryEn` MUST exist.
- `chapter` MUST map to an existing career chapter.
- `testimonialRef`, when present, MUST map to an existing testimonial.
- `signals`, when present, MUST map to the approved signal taxonomy.
- Featured events SHOULD have richer narrative and impact fields than non-featured entries.

---

## 4. ProjectCard

**Location**: `src/data/projects.ts` (existing, enhanced)

Represents a project showcased in the portfolio’s projects section and related deep views.

### Core attributes

```typescript
interface ProjectCard {
  slug: string;
  titleEn: string;
  titleTh: string;
  year: number;
  featured: boolean;
  status: 'active' | 'shipped' | 'archived';
  company?: string;
  taglineEn: string;
  taglineTh: string;
  problemSummaryEn?: string;
  problemSummaryTh?: string;
  whatIOwnedEn?: string;
  whatIOwnedTh?: string;
  signals?: SignalId[];
  proofRefs?: string[];
}
```

### Validation rules

- `slug` MUST be unique.
- The current flagship work MUST be represented and prioritized correctly.
- `whatIOwned*` fields SHOULD exist for projects used as strategic proof.
- Signal labels on projects MUST be consistent with the shared signal taxonomy.

---

## 5. Testimonial

**Location**: `src/data/testimonials.ts` (existing, enhanced)

Represents an attributed external validation source.

### Core attributes

```typescript
interface Testimonial {
  id: string;
  quoteEn: string;
  quoteTh: string;
  sharpestLineEn?: string;
  sharpestLineTh?: string;
  authorName: string;
  authorRole: string;
  company?: string;
  relationshipEn?: string;
  relationshipTh?: string;
  validates?: SignalId[];
  avatar?: string;
}
```

### Validation rules

- Testimonials MUST be real and attributable.
- `quoteEn` MUST exist; `quoteTh` SHOULD exist for Thai parity.
- `sharpestLine*` SHOULD represent the highest-signal trust statement when preview treatment is used.
- `validates` MUST reference defined signals only.

---

## 6. Signal

**Location**: new or enhanced shared data source under `src/data/`

Represents a reusable trust marker shared across sections.

### Core attributes

```typescript
type SignalId =
  | 'production-ai'
  | 'product-ownership'
  | 'founder-signal'
  | 'systems-thinking'
  | 'knowledge-multiplier'
  | 'fast-learner'
  | 'cross-functional'
  | 'full-stack';

interface Signal {
  id: SignalId;
  labelEn: string;
  labelTh: string;
  descriptionEn: string;
  descriptionTh: string;
  colorToken: string;
  iconName?: string;
}
```

### Validation rules

- Signal IDs MUST remain stable across all references.
- Labels MUST be skim-friendly.
- A signal SHOULD appear in more than one section if it is part of the shared evidence system.

---

## 7. CapabilityCluster

**Location**: `src/data/skills.ts` (existing, enhanced)

Represents grouped capability framing for the skills section.

### Core attributes

```typescript
interface CapabilityCluster {
  id: string;
  nameEn: string;
  nameTh: string;
  narrativeEn: string;
  narrativeTh: string;
  statusEn?: string;
  statusTh?: string;
  emphasized: boolean;
  order: number;
  evidenceRefs: string[];
  items: SkillItem[];
}

interface SkillItem {
  name: string;
  level?: number;
  tagEn?: string;
  tagTh?: string;
}
```

### Validation rules

- Clusters MUST be ordered intentionally.
- The current strategic focus SHOULD be visibly emphasized.
- `evidenceRefs` MUST map to projects, timeline events, or other proof entities.

---

## 8. ValueProposition

**Location**: `src/data/valuePropositions.ts` (existing, enhanced)

Represents a visitor-facing reason to believe and hire/collaborate.

### Core attributes

```typescript
interface ValueProposition {
  id: string;
  titleEn: string;
  titleTh: string;
  descriptionEn: string;
  descriptionTh: string;
  proofEn?: string;
  proofTh?: string;
  signalTag?: SignalId;
  crossRef?: string;
  clientValidation?: string;
}
```

### Validation rules

- Each value proposition MUST map to identifiable proof.
- `clientValidation`, when present, MUST map to an existing testimonial.
- Propositions SHOULD collectively cover AI, product thinking, full-stack delivery, fast domain shifts, and founder trajectory where supported by source evidence.

---

## 9. ContactIntent

**Location**: `src/data/contactIntents.ts` (existing, enhanced)

Represents a tailored entry path into contact/conversion.

### Core attributes

```typescript
interface ContactIntent {
  key: 'hire-ai' | 'hire-po' | 'collaborate' | 'general';
  labelEn: string;
  labelTh: string;
  headingEn: string;
  headingTh: string;
  previewEn: string;
  previewTh: string;
  placeholderEn?: string;
  placeholderTh?: string;
  iconName?: string;
}
```

### Validation rules

- Keys MUST remain stable for analytics or routing references.
- Copy MUST clearly differentiate visitor intent.
- Thai and English intent labels MUST preserve equivalent meaning.

---

## 10. EvidenceLink

**Location**: Cross-cutting relationship concept

Represents the explicit link between a claim and its proof source.

### Core attributes

```typescript
interface EvidenceLink {
  sourceClaimId: string;
  targetType: 'project' | 'timeline-event' | 'testimonial' | 'skill-cluster' | 'credential';
  targetId: string;
  reason: string;
}
```

### Validation rules

- High-value claims SHOULD have at least one evidence link.
- Evidence links SHOULD reinforce repeated trust signals across sections.

---

## Entity Relationships

```text
NarrativeClaim
  ├── proofRefs ─────► ProjectCard
  ├── proofRefs ─────► TimelineEvent
  ├── proofRefs ─────► Testimonial
  └── proofRefs ─────► CapabilityCluster

CareerChapter
  └── contains ─────► TimelineEvent (many)

ProjectCard
  ├── signals ──────► Signal (many)
  └── proofRefs ────► NarrativeClaim / ValueProposition support

Testimonial
  └── validates ────► Signal (many)

CapabilityCluster
  └── evidenceRefs ─► ProjectCard / TimelineEvent

ValueProposition
  ├── signalTag ────► Signal
  └── clientValidation ─► Testimonial

ContactIntent
  └── aligns with ──► audience-specific ValueProposition and conversion path
```

---

## Data Migration Plan

### Existing files to enhance

- `src/data/projects.ts`
- `src/data/testimonials.ts`
- `src/data/skills.ts`
- `src/data/timelineChapters.ts`
- `src/data/timelineEvents.ts`
- `src/data/valuePropositions.ts`
- `src/data/contactIntents.ts`
- `messages/en.json`
- `messages/th.json`

### Likely additions

- Shared signal definitions if the current codebase does not already centralize them.
- Additional type declarations under `src/types/` if current interfaces are too narrow for new fields such as `sharpestLine`, `whatIOwned`, `validates`, `capabilityGained`, or `proofRefs`.

### Migration priorities

1. Correct identity, current-role, and flagship narrative data.
2. Replace placeholder testimonials with real attributed data.
3. Expand timeline and project structures to carry stronger narrative proof.
4. Add signal/evidence-link fields where needed.
5. Finalize bilingual parity and consistency review.

---

## Summary

This feature extends the existing content model rather than creating a new runtime system. The most important modeling requirement is consistency: claims, evidence, localization, and audience intent must all map cleanly across the existing data modules so the revised portfolio reads as one coherent story.
