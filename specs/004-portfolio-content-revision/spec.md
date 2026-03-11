# Feature Specification: Full Portfolio Content Revision

**Feature Branch**: `004-portfolio-content-revision`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "Full portfolio content revision: update the portfolio narrative, hero, timeline, projects, testimonials, signals, skills framing, about page, and contact intents to reflect the 7+ year arc, current TeamStack role, real testimonials, bilingual quality, and founder trajectory."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand credibility fast (Priority: P1)

As a hiring manager, founder, or product leader visiting the portfolio for the first time, I want to understand within the first screen who First is, what he does now, and why he is differentiated, so I can quickly decide whether deeper evaluation is worth my time.

**Why this priority**: The first-impression layer determines whether visitors continue exploring at all. If the hero and opening proof points are inaccurate or weak, the rest of the portfolio loses value.

**Independent Test**: Can be fully tested by showing the revised hero and opening proof elements to a first-time reviewer and confirming they can accurately restate the candidate’s current role, trajectory, and differentiators after a short skim.

**Acceptance Scenarios**:

1. **Given** a first-time visitor lands on the portfolio, **When** they view the hero section, **Then** they can identify the current professional role, present company context, and primary value proposition without opening any secondary content.
2. **Given** a first-time visitor views the initial trust signals, **When** they skim the first screen, **Then** they encounter accurate high-value proof such as years of experience, certifications, language readiness, or current product focus.
3. **Given** the portfolio is viewed in either supported language, **When** a visitor reads the hero content, **Then** the same core positioning and trust signals are preserved with audience-appropriate wording.

---

### User Story 2 - Evaluate career arc and evidence (Priority: P1)

As a serious evaluator comparing candidates, I want to see a truthful, evidence-backed career story that explains the shift from MEP engineering to software and AI product work, so I can judge depth, growth, and readiness for higher-trust roles.

**Why this priority**: The revised source material materially changes the story. The portfolio must stop underselling the 7+ year arc and must use real work history, flagship projects, and authentic testimonials to build trust.

**Independent Test**: Can be fully tested by reviewing the timeline, featured projects, and testimonials in isolation and verifying that a reviewer can explain the career progression, flagship current work, and external validation without needing outside documents.

**Acceptance Scenarios**:

1. **Given** a visitor explores the professional timeline, **When** they move from early to recent chapters, **Then** they see a coherent arc from pre-software systems work through self-directed transition to current AI-first product building.
2. **Given** a visitor opens featured work, **When** they compare projects, **Then** the current flagship work and strongest strategic proof appear before lower-priority legacy work.
3. **Given** a visitor reaches the social proof section, **When** they read testimonials, **Then** they encounter real attributed quotes that validate ownership, reliability, systems thinking, and collaboration.

---

### User Story 3 - Assess fit by intent (Priority: P2)

As a visitor with a specific goal such as hiring for AI engineering, evaluating product ownership, or exploring collaboration, I want the portfolio to speak to my intent directly, so I can quickly determine whether it matches my needs and what next step to take.

**Why this priority**: Once credibility is established, the portfolio must convert different audiences without forcing each of them through generic messaging.

**Independent Test**: Can be fully tested by reviewing the value proposition, skills framing, and contact entry points for each audience intent and confirming that each path feels tailored and leads to a clear next action.

**Acceptance Scenarios**:

1. **Given** a visitor is evaluating AI engineering capability, **When** they review the relevant narrative and proof, **Then** they can identify production AI experience, current direction, and concrete examples of applied work.
2. **Given** a visitor is evaluating product or founder potential, **When** they review the revised about, project, and value proposition content, **Then** they can recognize ownership mindset, strategic thinking, and long-term direction.
3. **Given** a visitor chooses a contact path, **When** they open the relevant contact intent, **Then** they see copy tailored to that purpose rather than a generic inquiry prompt.

---

### User Story 4 - Read a bilingual portfolio without loss of meaning (Priority: P2)

As an English-speaking or Thai-speaking visitor, I want both language experiences to feel complete, credible, and natural, so I can understand the same story and make the same decision regardless of locale.

**Why this priority**: The portfolio explicitly serves both international and Thai audiences. Bilingual parity is a product requirement, not a translation afterthought.

**Independent Test**: Can be fully tested by comparing parallel content in both supported languages and confirming that major claims, chronology, CTAs, and contact options remain equivalent in meaning and confidence.

**Acceptance Scenarios**:

1. **Given** a visitor switches language, **When** they revisit hero, timeline, projects, testimonials, and contact sections, **Then** the same major claims and strategic story remain intact.
2. **Given** a visitor reads Thai content, **When** they compare tone and trust signals with the English version, **Then** the Thai version feels natural and audience-appropriate rather than mechanically translated.

---

### Edge Cases

- What happens when certain claims have stronger source evidence in one language than the other?
- How does the portfolio handle long testimonial quotes without burying the strongest line or overwhelming skim readers?
- What happens when current-role or flagship-project information changes again in the future and older sections risk contradiction?
- How does the experience behave when a visitor enters directly on a deep-linked project, timeline chapter, or testimonial-related view instead of the homepage?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The portfolio MUST revise its primary narrative to reflect a 7+ year professional arc that includes pre-software engineering, self-directed transition, professional software delivery, and current AI-first product work.
- **FR-002**: The portfolio MUST present the current role and present company context accurately wherever current professional identity is introduced.
- **FR-003**: The portfolio MUST use the preferred professional naming consistently, including the warm-market use of `First` where identity and audience fit benefit from it.
- **FR-004**: The hero experience MUST communicate identity, present focus, and key trust signals in a way that supports understanding within the first screen.
- **FR-005**: The portfolio MUST elevate the strongest current flagship work ahead of older work when signaling present capability and direction, with present TeamStack work clearly outweighing outdated legacy emphasis.
- **FR-006**: The timeline MUST cover the full career arc rather than only the software-agency period.
- **FR-007**: The timeline MUST frame the shift from MEP engineering to software as a coherent progression in systems thinking rather than as an unrelated career reset.
- **FR-008**: Featured projects MUST communicate not only what was built but also the nature of ownership and strategic contribution.
- **FR-009**: The portfolio MUST replace placeholder or weak social proof with real attributed testimonials sourced from authentic colleagues, clients, or leaders.
- **FR-010**: Testimonial presentation MUST preserve attribution and make each quote’s strongest trust-building message easy to identify during a skim, including a clear preview path for the sharpest line before full expansion where testimonials are previewed.
- **FR-011**: The portfolio MUST introduce a consistent cross-section signal system that reinforces major traits such as production AI experience, product ownership, systems thinking, knowledge sharing, and founder trajectory.
- **FR-012**: Skills content MUST be reframed around capability clusters and proof of application rather than abstract self-ratings alone.
- **FR-013**: Value proposition content MUST help distinct audiences understand why First is a strong fit for their needs, including AI engineering, product-minded roles, and founder-style collaboration.
- **FR-014**: The about content MUST tell the full multi-stage professional story in a way that makes the present ambition and future direction feel credible, including Gaia as a serious expression of systems thinking rather than a trivial side project.
- **FR-015**: Contact entry points MUST distinguish between major visitor intents such as AI hiring, product ownership evaluation, collaboration, and general outreach.
- **FR-016**: Both supported language experiences MUST preserve equivalent meaning, proof, and conversion paths across hero, timeline, projects, testimonials, about content, and contact intents.
- **FR-017**: The portfolio MUST avoid contradictions across sections regarding years of experience, company affiliation, flagship work, certifications, naming, and long-term direction.
- **FR-018**: The revised content MUST preserve the portfolio’s premium, insight-dense, conversion-oriented presentation rather than becoming a raw information dump.
- **FR-019**: The portfolio MUST make it easy for visitors to move from summary-level claims into deeper evidence without losing narrative continuity.
- **FR-020**: The portfolio MUST create visible evidence loops between major claims, supporting projects, signals, and testimonials so that high-value assertions are reinforced across sections rather than stated once in isolation.

### Key Entities *(include if feature involves data)*

- **Narrative Claim**: A core statement about identity, experience, capability, ambition, or differentiator that appears across multiple sections and must stay consistent.
- **Career Chapter**: A major phase of the professional journey, including its time period, role in the larger story, and the capabilities it establishes.
- **Timeline Event**: A specific milestone, project, achievement, or role that provides dated evidence within a career chapter.
- **Featured Project**: A selected work example used to demonstrate strategic fit, ownership, and present-day capability.
- **Signal**: A reusable trust marker that labels recurring strengths or themes across sections.
- **Testimonial**: An attributed external quote that validates a defined set of strengths or behaviors.
- **Capability Cluster**: A grouped view of skills framed by applied evidence and current strategic direction.
- **Audience Intent**: A visitor motivation such as hiring, evaluating leadership potential, or exploring collaboration that shapes messaging and calls to action.
- **Evidence Link**: A deliberate connection between a claim, a proof artifact, and a validation source that helps visitors verify trust signals quickly.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In moderated first-impression review, at least 8 out of 10 relevant reviewers can accurately state the candidate’s current role, present direction, and one differentiating trust signal within 15 seconds of viewing the portfolio.
- **SC-002**: In moderated review, at least 8 out of 10 relevant reviewers can correctly identify that the professional story spans more than 7 years and includes an engineering-to-software transition after exploring the timeline or about content.
- **SC-003**: At least 8 out of 10 relevant reviewers can identify the current flagship work and explain why it is strategically important after reviewing the featured projects section.
- **SC-004**: At least 8 out of 10 relevant reviewers report that the testimonial section increases trust because the quotes feel real, attributed, and specific rather than generic praise.
- **SC-005**: At least 8 out of 10 relevant reviewers can recall one specific external validation statement after a quick skim of the testimonial preview layer.
- **SC-006**: English- and Thai-speaking reviewers can complete the same core comprehension tasks with no material loss in accuracy between locales.
- **SC-007**: At least 8 out of 10 relevant reviewers can identify a next step that matches their intent, such as hiring, deeper evaluation, or collaboration, without being prompted.
- **SC-008**: Content review finds zero unresolved contradictions across hero, timeline, projects, testimonials, about content, and contact paths regarding role, company, years of experience, flagship work, credentials, or preferred naming.
- **SC-009**: Stakeholder review concludes that the revised portfolio feels more credible, more strategic, and more attention-holding than the prior version while preserving clarity at a glance.

## Assumptions

- The revision applies to existing portfolio surfaces rather than introducing entirely new top-level sections beyond those already implied by the current experience.
- The six referenced testimonials are approved for use with attribution and can be displayed publicly.
- The portfolio will continue to support both English and Thai audiences as first-class experiences.
- The current flagship work should emphasize present strategic direction even when some ongoing work cannot be disclosed in exhaustive detail.
- Existing navigation and interaction patterns may be reused so long as the revised content preserves clarity, credibility, and conversion quality.
- The detailed source document at `.windsurf/docs/full_portfolio_content_revision.md` is an authoritative content brief for planning and implementation, while this spec remains the stakeholder-facing product definition.
