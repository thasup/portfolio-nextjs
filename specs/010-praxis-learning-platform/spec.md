# Feature Specification: PRAXIS — AI-Generated Personalized Learning Platform

**Feature Branch**: `005-praxis-learning-platform`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "PRAXIS — an AI-powered personalized learning platform embedded at `/learn/*` inside the portfolio. Topic-agnostic from day one: any learner types a topic, an AI (Nori) generates a reviewable curriculum, adapts onboarding to the topic, produces unit content and templates on demand, and teaches through personalized conversation. Phase 1 is invite-only with Supabase-backed auth and persistence; primary user is Jane (sales rep) with Sales as the first generated topic."

## Context & Guiding Decisions

PRAXIS is a dynamic subsystem grafted onto a portfolio that is otherwise static-first. The product is motivated by a single observation: high-quality learning content exists but is fragmented, generic, and passive. The differentiator is not content aggregation, but an AI that teaches actively, questions, and adapts to the learner's context.

Seven decisions are frozen before this specification and shape every requirement below:

1. **Topic-agnostic from day one.** There are no hand-authored "modules". Any learner can type any topic. The curriculum is AI-generated, reviewable, and cacheable. Sales is the first entry in the shared topic cache, not a special case.
2. **Named persona.** The AI is named **Nori**. Product copy, system prompts, and tone all converge on this persona.
3. **Invite-only, authenticated audience.** Phase 1 is not a public product. Access is gated by invitation and a Supabase-backed magic-link session. Progress persists across devices.
4. **English only, locale-aware.** All user-facing strings and generated content are English for Phase 1. Data models, route structure, and prompt assembly must accept a locale parameter from the first commit so Thai can be added later without migration.
5. **7-day return rate is the north-star metric.** Everything else (completion, conversation depth, template downloads) is secondary.
6. **Hybrid deployment, not static export.** The portfolio's existing Vercel configuration already permits serverless routes; no config removal is required.
7. **Scope discipline is existential.** The list of excluded behaviors (Section "Out of Scope") is frozen at start of Phase 1 and reviewed weekly.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First-time invited learner starts a topic (Priority: P1)

As an **invited learner**, I want to **accept an invitation, sign in, type a topic I want to learn, and receive a credible, personalized curriculum within minutes**, so I feel that PRAXIS is built for my actual situation rather than a generic course library.

**Why this priority**: First-session success is the only thing that produces a 7-day return. If the curriculum feels generic, wrong, or slow to arrive, the learner does not come back.

**Independent Test**: A newly invited learner can go from magic-link email to a ready-to-read first unit in under five minutes, with visibly personalized content.

**Acceptance Scenarios**:

1. **Given** a learner has received an invitation email, **When** they click the magic link, **Then** they land in an authenticated session with an empty library and a prominent blank-canvas topic entry.
2. **Given** an authenticated learner with no prior topics, **When** they type a topic and submit, **Then** PRAXIS generates a proposed curriculum outline and shows it for review before full unit generation begins.
3. **Given** a proposed outline is visible, **When** the learner edits a unit title or reorders units, **Then** full generation proceeds using the edited outline, not the original.
4. **Given** the outline is accepted, **When** full generation completes, **Then** the learner is returned to a module overview showing all units, a progress indicator, and a clearly highlighted "start here" unit.

---

### User Story 2 — Learner converses with Nori, who knows their context (Priority: P1)

As a **learner inside a unit**, I want to **have a conversation with Nori that references my role, what I do, and my stated goal**, so the examples and follow-up questions feel specific and actionable rather than textbook-generic.

**Why this priority**: The AI Learning Mate concept is the product's central differentiator. If Nori produces generic Claude.ai-quality output, the product has no reason to exist.

**Independent Test**: A learner can open any unit, read the structured content, start a conversation with Nori, and within three message turns see at least one reference to their own stated context (role, product, customer, or goal).

**Acceptance Scenarios**:

1. **Given** a learner has completed adaptive onboarding for a topic, **When** they begin a unit conversation, **Then** Nori's first message references at least one piece of onboarding context by paraphrase.
2. **Given** a conversation is in progress, **When** the learner sends a message, **Then** Nori streams a response within three seconds of token-level first byte and ends most replies with a single follow-up question.
3. **Given** a conversation exceeds twenty message turns, **When** the learner continues, **Then** older turns are summarized or pruned transparently and Nori still references the learner's stated context correctly.
4. **Given** a learner returns to the same unit after days, **When** they reopen the conversation, **Then** the prior conversation is restored exactly as it ended.

---

### User Story 3 — Returning learner resumes across devices (Priority: P1)

As a **returning learner who switched devices**, I want to **sign back in and find my exact progress, generated units, and prior conversations preserved**, so the platform feels like a place my learning actually lives.

**Why this priority**: 7-day return is the north-star metric. Return requires trust that nothing is lost. Single-device localStorage would silently destroy progress and kill the metric.

**Independent Test**: A learner who completes one unit on desktop and returns on mobile two days later sees the same completion state, the same unit content, and the same prior conversations without any re-onboarding.

**Acceptance Scenarios**:

1. **Given** a learner has progress on one device, **When** they sign in on another, **Then** their library, completion state, and conversations match.
2. **Given** a learner has multiple topics in their library, **When** they revisit the `/learn` entry, **Then** they see a library view sorted by most-recent activity with progress percentages.
3. **Given** a learner has an uninvited friend, **When** the friend attempts to view any `/learn/*` route, **Then** they see an explicit "invitation required" state, not a generic login form.

---

### User Story 4 — Learner downloads a template for a real situation (Priority: P1)

As a **learner approaching a real situation** (a sales call, a salary negotiation, a design review), I want to **download a template already filled in for my product and context**, so I can walk into the room with something concrete rather than a blank framework.

**Why this priority**: The PRD's strongest value proposition is "templates over theory". A generic template is worse than no template. A template pre-filled with the learner's product, customers, and goals is substantially more useful than anything self-directed learners assemble on their own.

**Independent Test**: A learner can request a template from a unit and receive a downloadable file whose contents demonstrably reference their onboarding context (their product name, their customer description, or their stated goal).

**Acceptance Scenarios**:

1. **Given** a learner has completed onboarding and a unit, **When** they request a template from the unit, **Then** PRAXIS generates a DOCX or XLSX file containing at least three learner-specific substitutions and delivers it for download.
2. **Given** a generated template is visible, **When** the learner regenerates it, **Then** a new variation is produced without duplicating the previous output verbatim.
3. **Given** a template request is for a topic where file structure is uncertain, **When** the learner previews before download, **Then** they see an in-browser preview with an option to request changes before committing to the file.

---

### User Story 5 — Learner uses Nori as a full-screen standalone coach (Priority: P2)

As a **learner with an urgent question that does not fit any unit** ("I have a sales call in twenty minutes, help"), I want to **open Nori in a full-screen chat that already knows my context and prior units**, so I can get focused help without navigating a curriculum.

**Why this priority**: This is the highest-frequency return pattern for an engaged learner. It is not P1 because a learner can still get help inside any unit's chat; the standalone experience is an optimization.

**Independent Test**: A learner can open `/learn/[topic]/mate`, see a visible "what Nori knows about you" panel, type a freeform question, and receive a response shaped by their library history and onboarding context.

**Acceptance Scenarios**:

1. **Given** a learner opens the full-screen mate entry, **When** the screen loads, **Then** a context rail displays the learner's role, product, current topic, and covered units.
2. **Given** a first-time full-screen user, **When** they see the empty prompt, **Then** they see four preset intent chips (roleplay, review, prep, just talk) that each seed a different system prompt variant.
3. **Given** a conversation is started in full-screen, **When** the learner returns to a unit, **Then** the unit's own conversation thread is untouched by the full-screen thread.

---

### User Story 6 — Learner uses PRAXIS on mobile between activities (Priority: P1)

As **Jane between sales calls**, I want to **use PRAXIS on my phone with one-handed touch input**, so the time between calls becomes productive learning time rather than dead phone-staring time.

**Why this priority**: Jane is the primary Phase 1 user and her primary device is her phone. A broken mobile experience eliminates her use case entirely.

**Independent Test**: A learner can complete onboarding, read a unit, have a twelve-turn conversation with Nori, and download a template entirely on a 375px-wide viewport without any horizontal scroll, input obstruction, or layout break.

**Acceptance Scenarios**:

1. **Given** a learner opens PRAXIS on a 375px viewport, **When** they interact with any page, **Then** every touch target meets a minimum 44×44px hit area.
2. **Given** a mobile chat is active, **When** the keyboard opens, **Then** the message input remains visible above the keyboard and the latest message remains in view.
3. **Given** a learner taps a template download on iOS Safari, **When** the file is produced, **Then** it saves successfully without a blank tab, failed preview, or corrupted file.

---

### Edge Cases

- What happens when a learner types a topic that falls outside acceptable scope (medical advice, legal advice, financial advice, anything sexually explicit, anything targeted at minors)?
- What happens when the Claude API is unavailable mid-generation or mid-conversation?
- What happens when a learner requests curriculum generation for a topic already in the shared cache from another learner's session?
- What happens when a learner tries to invite someone else or share a unit they generated?
- What happens when a learner completes all units and has nothing left in a topic?
- What happens when a generated unit contains a factual error the learner notices?
- What happens when the same learner starts ten topics without finishing any?
- What happens when a learner's magic link expires or they request a new one while already signed in?
- What happens when token usage or API cost exceeds a configured monthly threshold?

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & access
- **FR-001**: PRAXIS MUST gate every route under `/learn/*` behind an authenticated session; unauthenticated visitors MUST see an explicit "invitation required" state, not a generic 404 or login form.
- **FR-002**: PRAXIS MUST support invitation-only onboarding where only pre-listed email addresses can receive a magic link and establish a session.
- **FR-003**: PRAXIS MUST deliver magic-link emails via the existing `resend` dependency without introducing a second email provider.
- **FR-004**: PRAXIS MUST preserve a learner's session across devices for the same authenticated account.
- **FR-005**: PRAXIS MUST allow the platform curator to add or revoke invitations through a server-side mechanism accessible without deploying code.

#### Library & topic entry
- **FR-006**: PRAXIS MUST render a library view at `/learn` that lists the authenticated learner's topics with title, progress percentage, last-active timestamp, and resume action.
- **FR-007**: PRAXIS MUST render a blank-canvas topic entry affordance on the library view that accepts any free-form topic string plus a set of seeded suggestion chips.
- **FR-008**: PRAXIS MUST apply a topic-scope guardrail to any submitted topic string and reject topics falling into medical, legal, financial-advice, explicit, or minors-targeted categories with a clear explanation, not a silent failure.

#### Curriculum generation
- **FR-009**: PRAXIS MUST generate a curriculum outline of three to seven units for an accepted topic and display it in a reviewable state before any full unit generation begins.
- **FR-010**: PRAXIS MUST allow the learner to edit unit titles, reorder units, or request regeneration of the outline before accepting it.
- **FR-011**: PRAXIS MUST cache accepted curriculum outlines keyed by a normalized topic fingerprint so repeated requests for equivalent topics reuse prior work across learners.
- **FR-012**: PRAXIS MUST generate full unit content — learning objectives, explainer prose, worked examples, and at least one suggested practice activity — in response to unit access, personalized by the learner's onboarding context.
- **FR-013**: PRAXIS MUST support block-level regeneration so a learner can request a new version of a single content block without regenerating the whole unit.

#### Adaptive onboarding
- **FR-014**: PRAXIS MUST conduct a topic-adaptive onboarding flow consisting of between three and five questions whose phrasing is generated from the topic, not hardcoded to sales.
- **FR-015**: PRAXIS MUST persist onboarding answers to the learner's profile and inject them into every subsequent AI prompt for that topic.
- **FR-016**: PRAXIS MUST allow a learner to revisit and edit onboarding answers at any time, causing subsequent AI responses to reflect the updated context.

#### AI conversation (Nori)
- **FR-017**: PRAXIS MUST present an embedded AI conversation surface on every unit page, contextualized with the learner's profile, the topic, the current unit's content, and the persona definition for Nori.
- **FR-018**: PRAXIS MUST stream AI responses progressively so output appears within three seconds of submission on a typical broadband connection.
- **FR-019**: PRAXIS MUST maintain per-unit conversation history of at least twenty turns and restore it exactly on return visits.
- **FR-020**: PRAXIS MUST prune or summarize older conversation context when total input tokens would exceed a configured budget, without silently dropping learner-referenced facts.
- **FR-021**: PRAXIS MUST offer a full-screen standalone chat surface at `/learn/[topic]/mate` that exposes learner context in a visible rail and accepts preset intent chips as prompt variants.
- **FR-022**: PRAXIS MUST keep unit-level and full-screen conversations in separate threads; neither overwrites the other.

#### Templates on demand
- **FR-023**: PRAXIS MUST generate downloadable templates in DOCX, XLSX, or PDF format on learner request, personalized with the learner's onboarding context.
- **FR-024**: PRAXIS MUST show an in-browser preview of any generated template before committing to a download.
- **FR-025**: PRAXIS MUST allow a learner to request a regeneration of the template with a short natural-language instruction (for example, "make it for enterprise buyers, not SMB").

#### Progress & persistence
- **FR-026**: PRAXIS MUST track per-unit completion state and display it on the library view and the module overview.
- **FR-027**: PRAXIS MUST persist all learner-generated content (curricula, units, conversations, templates, onboarding) server-side and make it recoverable across devices.

#### Scope, safety, and quality
- **FR-028**: PRAXIS MUST never offer financial, medical, or legal advice in any Nori response and MUST refuse cleanly when asked.
- **FR-029**: PRAXIS MUST display a visible error state, preserve unsaved input, and provide a one-tap retry when the Claude API fails or is rate-limited.
- **FR-030**: PRAXIS MUST include a server-side spend guardrail that returns a controlled error state if Anthropic API spend exceeds a configured monthly threshold.

#### Bilingual readiness (architecture only for Phase 1)
- **FR-031**: PRAXIS data models, API routes, and prompt assembly MUST accept a `locale` parameter and default to `en` for Phase 1, such that adding Thai requires only content and system-prompt work, not schema changes.

### Non-Functional Requirements

- **NFR-001 — AI latency**: Time to first streamed token MUST be under three seconds on a 50 Mbps connection.
- **NFR-002 — Page load**: First Contentful Paint MUST be under 1.5s on desktop and 2.5s on mobile for static `/learn/*` shells.
- **NFR-003 — Accessibility**: All `/learn/*` routes MUST meet WCAG 2.1 AA, including keyboard navigability, visible focus, and semantic structure.
- **NFR-004 — Mobile**: All experiences MUST work on viewports from 320px width with 44×44px minimum touch targets.
- **NFR-005 — Privacy**: Learner onboarding answers, generated content, and conversations MUST be scoped to the authenticated learner and NOT exposed to other learners.
- **NFR-006 — Cost**: Shared curriculum and unit cache MUST reduce per-learner generation cost on repeated common topics by at least fifty percent versus an uncached baseline.
- **NFR-007 — Configurability**: Nori persona copy, system prompt sections, and behavioral rules MUST live in a versioned configuration file, editable without touching component code.
- **NFR-008 — Token discipline**: Static system prompt scaffolding MUST remain under 800 tokens; conversation context sent per request MUST stay under 8,000 tokens through summarization or pruning.

### Key Entities *(data)*

- **Learner**: An authenticated account with a profile, a library of topics, and a history of conversations and generations.
- **Invitation**: A curator-created record that authorizes a specific email address to become a Learner.
- **Topic**: A learner-scoped instance of a subject of study. Holds the onboarding answers, the curriculum outline, the unit completion state, and the conversation history for that subject.
- **Curriculum Outline**: The reviewable unit list generated before full content. Cacheable across learners by normalized topic fingerprint.
- **Unit**: A single lesson within a topic. Contains generated content blocks, a conversation thread, and associated template references.
- **Content Block**: An individually regenerable piece of unit content — an explainer paragraph, an example, a diagram description, or a practice activity.
- **Conversation**: An ordered sequence of messages between a Learner and Nori, scoped to either a unit or the full-screen standalone surface.
- **Template**: A learner-personalized downloadable asset derived from a topic and the learner's onboarding context.
- **Onboarding Profile**: The structured set of answers a Learner has provided for a Topic. Versioned so edits do not silently rewrite history.
- **Spend Ledger**: A running tally of Anthropic API token spend used for the configured monthly guardrail.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 — North-star, 7-day return**: At least 40% of first-time invited learners return to an authenticated session within seven days of their first unit completion.
- **SC-002 — Personalization is visible**: At least 80% of audited Nori conversations contain a reference to the learner's onboarding context within the first three assistant turns.
- **SC-003 — First-topic success**: At least 70% of learners who accept a generated outline complete at least one unit in that topic.
- **SC-004 — Curriculum cache efficiency**: After ten distinct learners on the platform, shared curriculum cache hits reduce average generation cost per topic by at least 50%.
- **SC-005 — Template real-world use**: At least 50% of learners who download a template report using it in a real situation within two weeks (surveyed at return visit).
- **SC-006 — Topic scope safety**: Zero audited Nori responses in Phase 1 provide medical, legal, or financial advice when users attempt to elicit it.
- **SC-007 — Cross-device trust**: Zero reports of missing or reset progress after device switches during the Phase 1 invite window.
- **SC-008 — Mobile viability**: Jane can complete a full unit loop (open, read, chat twelve turns, download template) on her phone without layout break, lost input, or broken download.
- **SC-009 — Cost discipline**: Monthly Anthropic spend stays under the configured guardrail, with the guardrail set to a level that covers at least ten active invited learners.

## Assumptions

- Anthropic API access with a Claude model capable of streaming and long-context conversation is available and billed to a project budget owned by the curator.
- Supabase is available as the persistence and auth backend; the cost of Supabase's free or starter tier is acceptable for Phase 1.
- The existing `resend` integration is sufficient for magic-link delivery volumes in Phase 1.
- The curator maintains a small, managed invite list (not public signup) throughout Phase 1.
- Jane, and at most a handful of other invited learners, are the Phase 1 user base; no horizontal scaling considerations apply.
- The portfolio's existing Liquid Glass design system and `messages/en.json` tooling remain the UI and localization substrate.
- Thai content and bilingual UX are out of scope for Phase 1 but not out of scope for the architecture.
- The `.windsurf/contexts/Praxis PRD v1.html` and `Praxis Wireframes.html` documents are the authoritative product brief; this specification supersedes them wherever they conflict because of the seven guiding decisions locked at the top of this document.

## Out of Scope (Phase 1 freeze list)

The following behaviors are explicitly excluded from Phase 1. Each is a reasonable future direction but introducing it before soft-launch violates scope discipline.

- Public signup or any form of non-invited access.
- Video content, audio content, or transcription of learner input.
- Community features, peer visibility, shared notes, or social progress indicators.
- Gamification (badges, streaks, XP, leaderboards).
- Team or organization accounts, manager dashboards, or multi-seat billing.
- A third-party module marketplace or learner-as-author workflows.
- Native mobile applications.
- SCORM, xAPI, or any LMS integration.
- Paid tiers, subscriptions, or payment processing.
- Autonomous web research or external source retrieval during generation.
- Real-time collaboration, live tutoring, or human-in-the-loop moderation of generated content.
- Thai-language content (architecture-only readiness is in scope).
- Playbook PDF export (Phase 3).
- Cross-topic knowledge transfer inside a single conversation (Phase 3).
