<!--
  Sync Impact Report
  ────────────────────────────────────────────────────
  Version change: 2.1.0 → 3.0.0

  Modified principles:
    - I. Hybrid Static Rendering (Vercel) → I. Product Impact Over Implementation Folklore
    - II. TailwindCSS + shadcn/ui Only → II. Fast, Premium, Accessible Delivery
    - IV. Image Optimization Is Mandatory → III. Insight-Dense Storytelling
    - V. Component Hierarchy → IV. Bilingual Quality With Audience Fit
    - VI. Animation Philosophy — Subtle Only → V. Cinematic Narrative, Subordinate to Clarity
    - VIII. Data-Driven Architecture → VI. Evidence-Led Content System
    - XVI. Analytics Event Tracking — Comprehensive Granular Insights → VII. Measurement Must Inform Decisions
    - XVII. First Impression Standards — The 60-Second Impact Rule → VIII. Conversion Paths Must Stay Obvious
    - XIX. Modal-First Navigation → IX. Attention Retention Without Dead Ends
    - XX. Accessibility Commitments → X. Honest Technical Governance

  Added sections:
    - Experience Standards

  Removed sections:
    - Fixed Library Stack

  Templates requiring updates:
    - .specify/templates/plan-template.md       ✅ updated
    - .specify/templates/spec-template.md       ✅ reviewed — no updates needed
    - .specify/templates/tasks-template.md      ✅ reviewed — no updates needed
    - README.md                                 ✅ updated

  Follow-up TODOs: none
-->

# Portfolio Website Constitution

## Core Principles

### I. Product Impact Over Implementation Folklore

This portfolio exists to create a memorable first impression, hold attention,
and help the right visitors reach a confident decision quickly. Architecture,
content, and UI choices MUST be evaluated against those outcomes first.

- Every feature MUST improve at least one of these goals: first-impression
  clarity, attention retention, insight-at-a-glance, or conversion quality.
- Product decisions MUST favor what visitors can understand within the first
  5, 15, 30, and 60 seconds over internally elegant but low-impact complexity.
- The constitution MUST define enduring priorities, not speculative or brittle
  implementation details that are likely to drift.

### II. Fast, Premium, Accessible Delivery

The site MUST feel premium without sacrificing performance or accessibility.
Polish is a requirement, not decoration.

- Production targets remain non-negotiable: Lighthouse 100 desktop and 95+
  mobile across Performance, Accessibility, Best Practices, and SEO.
- Above-the-fold content MUST load fast enough to preserve the first 5-second
  impression window, with stable layout and zero avoidable visual jitter.
- WCAG 2.1 AA compliance is the baseline for color contrast, keyboard access,
  focus visibility, semantic structure, and assistive-technology support.
- Motion, layering, and visual effects MUST never reduce readability, delay
  comprehension, or block core content.

### III. Insight-Dense Storytelling

Every section MUST communicate useful meaning quickly, not merely display more
content. The portfolio is a guided decision journey, not a content dump.

- Each major section MUST answer one instant question and one deeper question.
- Every screen MUST expose a visible hierarchy of headline, proof, outcome,
  and a path to deeper exploration.
- Information density MUST be optimized for both skim mode and deep mode:
  summary first, detail on demand.
- Claims about skill, leadership, product thinking, or AI capability MUST be
  supported by concrete examples, metrics, or third-party evidence.

### IV. Bilingual Quality With Audience Fit

Thai and English experiences MUST both feel first-class and strategically
adapted to their audiences.

- English remains the default content baseline for international reach.
- Thai and English content MUST deliver equivalent value, not literal
  translation alone; wording MAY differ to improve resonance by audience.
- Locale routing, metadata, canonical handling, and language persistence MUST
  be implemented consistently across the app once a routing strategy is chosen.
- Thai typography, spacing, and copy rhythm MUST be intentionally tuned for
  readability and premium presentation.

### V. Cinematic Narrative, Subordinate to Clarity

The timeline is the portfolio centerpiece, and rich interactions are allowed
only when they strengthen comprehension and recall.

- The timeline MUST read as a narrative of capability evolution, not a raw log
  of dates and job titles.
- Motion MUST guide attention, reinforce chapter changes, and reveal meaning in
  sequence; it MUST NOT exist as ambient spectacle without informational value.
- The first timeline chapters MUST surface the clearest evidence of trajectory,
  range, and ambition within the first 20 seconds of timeline interaction.
- Reduced-motion users MUST receive the same information and progression cues
  without dependency on animation.

### VI. Evidence-Led Content System

Portfolio content MUST remain structured, typed, and reusable so that the same
truth can power hero summaries, section cards, and deep dives consistently.

- User-facing content MUST come from version-controlled structured sources
  under `src/data/` and `messages/`, not scattered hardcoded JSX strings.
- The content authority order is: repository content canvas, resume/CV,
  LinkedIn, GitHub, then feature specs for gap-filling only.
- Every significant claim SHOULD be traceable to a project, timeline event,
  testimonial, certification, metric, or personal principle.
- Reusable content fragments SHOULD support summary, section, modal, and SEO
  representations without changing the underlying facts.

### VII. Measurement Must Inform Decisions

Analytics exist to improve the portfolio, not to satisfy vanity or exhaustively
record noise.

- Interaction tracking MUST focus on decision-making questions: what earns
  attention, what builds trust, what causes drop-off, and what converts.
- Events MUST be typed, consistently named, and documented in a shared
  analytics utility before broad adoption.
- Every new tracked event MUST have a clear downstream use in analysis,
  iteration, or experience validation.
- Instrumentation MUST not materially harm performance, readability, or user
  trust.

### VIII. Conversion Paths Must Stay Obvious

Visitors MUST always have a clear next step, whether they want to skim, go
deeper, or initiate contact.

- The hero MUST communicate who, what, why, and primary credibility within the
  first screen, with no more than two dominant CTAs.
- Each major section SHOULD hand off naturally to the next through cross-links,
  curiosity hooks, or related evidence.
- Contact intent, resume access, and deep exploration paths MUST remain easy to
  find without overwhelming the primary narrative.
- Conversion UX MUST reduce ambiguity by acknowledging visitor intent rather
  than presenting a generic contact form alone.

### IX. Attention Retention Without Dead Ends

The portfolio SHOULD keep visitors productively engaged inside the experience
while still allowing credible external proof where necessary.

- Supplemental detail SHOULD open in-place through modals, overlays, anchored
  expansion, or other low-friction mechanisms that preserve context.
- If direct-linkable detail pages exist for SEO or sharing, they MUST reuse the
  same content model and maintain continuity with the primary narrative.
- External destinations are permitted only when they materially strengthen
  credibility or conversion, such as social profiles, downloadable resume, or
  authoritative evidence.
- Any external action MUST be intentional, clearly labeled, and measurable.

### X. Honest Technical Governance

The codebase MUST remain modern, maintainable, and truthful to the implemented
system, but the constitution MUST not freeze incidental technical decisions that
belong in specs, plans, or code.

- TypeScript strict mode, accessible semantic HTML, and maintainable component
  boundaries are required.
- Next.js App Router, TailwindCSS, shadcn/ui, and the current core libraries are
  the default stack, but library-level substitutions MAY be approved without a
  constitutional amendment if they preserve the principles and materially
  improve the product.
- Runtime capabilities, routing strategies, and deployment details MUST be
  documented in active specs and implementation docs, not duplicated here as
  permanent law unless they are truly foundational.
- Any rule proven misleading, stale, or in conflict with shipped behavior MUST
  be amended promptly rather than defended as doctrine.

## Experience Standards

### 60-Second Impact Window

- Within 5 seconds, a visitor MUST understand who Thanachon is, what he does,
  and why he is differentiated.
- Within 15 seconds, a visitor SHOULD grasp the core expertise and intended
  career direction.
- Within 30 seconds, a visitor SHOULD encounter compelling project or timeline
  proof.
- Within 45 seconds, a visitor SHOULD see trust-building evidence such as
  metrics, testimonials, certifications, or outcomes.
- Within 60 seconds, a visitor SHOULD either convert, explore deeper, or leave
  with an accurate and memorable impression.

### Content Quality Standards

- Generic self-promotional phrases such as "passionate about" or "team player"
  MUST be replaced by evidence-backed statements.
- English copy MUST be direct, confident, and globally legible.
- Thai copy MUST be professional, natural, and audience-aware.
- Project and timeline narratives MUST clarify the problem, ownership,
  approach, tradeoffs, and result where the information exists.
- Visual labels, chips, and metadata SHOULD help visitors recognize patterns
  such as business impact, production AI, leadership, or product thinking.

### Technical Delivery Baseline

- Use Next.js App Router with TypeScript strict mode.
- Use TailwindCSS for styling and shadcn/ui as the component foundation.
- Prefer `next/image` and modern image formats for all managed imagery.
- Respect reduced motion and progressive enhancement for interactive features.
- Keep user-facing content statically sourceable and deterministic at build
  time, even if limited server capabilities are used for contact or other
  narrowly scoped needs.

## Development Workflow

### Build & Review Expectations

1. `npm run dev` MUST start the local development environment.
2. `npm run build` MUST succeed with zero errors.
3. `npm run lint` MUST succeed before merge.
4. Major experience changes MUST be reviewed against the 60-second impact
   window, accessibility baseline, and product narrative quality.

### Constitution Check Expectations

Every implementation plan MUST explicitly verify:

- how the feature improves first impression, attention retention, insight
  density, or conversion quality;
- how the feature preserves performance and accessibility;
- how content and claims stay evidence-led and bilingual-ready where relevant;
- how success will be measured without adding low-value analytics noise;
- whether any implementation detail belongs in a spec or README rather than the
  constitution.

### File and Content Discipline

- Components MUST use clear ownership boundaries and meaningful names.
- Shared data structures MUST be typed and colocated sensibly.
- README and implementation docs MUST reflect the real app architecture.
- New docs MUST not copy outdated assumptions from framework boilerplate.

## Governance

- This constitution supersedes ad-hoc project conventions.
- Amendments MUST include a rationale and a semantic version bump.
- Versioning policy:
  - **MAJOR**: principles are removed, merged, or redefined in a way that
    changes how features should be planned or evaluated.
  - **MINOR**: a new principle or materially expanded requirement is added.
  - **PATCH**: wording is clarified without changing substantive expectations.
- Plans, specs, tasks, and documentation MUST align with the current
  constitution, but detailed implementation choices belong in those artifacts,
  not here, unless they are truly foundational.
- Code reviews and planning reviews MUST reject work that is polished yet weak
  on clarity, truthful evidence, accessibility, or performance.

**Version**: 3.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-11
