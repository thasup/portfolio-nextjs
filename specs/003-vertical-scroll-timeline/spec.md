# Feature Specification: Vertical Scroll Timeline — Design System & Implementation

**Feature Branch**: `003-vertical-scroll-timeline`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "Vertical Scroll Timeline — Design System & Implementation (The Chronicle)"

## Clarifications

### Session 2026-03-09

- Q: Mobile traveling dot viewport threshold? → A: Hide below 768px (tablet breakpoint) to optimize performance on mobile devices while keeping the feature on tablets.
- Q: Analytics event properties for TIMELINE_PROGRESS and TIMELINE_DEEPDIVE_OPEN? → A: Include `event_id`, `event_title`, `year`, `event_type` following the established GA4 custom dimension pattern.
- Q: Modal "Deep Dive" content structure beyond card summary? → A: Display full `descriptionEn/Th` narrative, expanded `impactEn/Th`, all skills (not limited to 5), and optional media/links.
- Q: Featured event visual enhancement specifications? → A: 1px ring with 30% accent opacity, 2px top gradient strip, no box-shadow glow (performance consideration).
- Q: Sticky spine positioning offset from viewport top? → A: `top: 6rem` (96px) to position below navbar with appropriate breathing room.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browsing Personal Experience (Priority: P1)

As a visitor, I want to see the user's professional journey in a cinematic, narrative format so that I can understand their growth and highlights in under 60 seconds of scrolling.

**Why this priority**: Core value proposition. It transforms a list of events into a compelling story.

**Independent Test**: Can be fully tested by scrolling through the timeline to ensure all years and events are rendered in chronological order with appropriate visual grouping.

**Acceptance Scenarios**:

1. **Given** I am on the portfolio home page, **When** I scroll to the timeline section, **Then** I see the first year header (Foundation) and its associated events.
2. **Given** I am scrolling, **When** I transition between years (e.g., 2022 to 2023), **Then** the ambient background gradient changes smoothly to reflect the new year's theme.

---

### User Story 2 - Deep Diving into Specific Events (Priority: P2)

As a curious visitor, I want to explore specific details of a particular event or project so that I can understand the context and results of that work.

**Why this priority**: Provides the "depth" part of the narrative for users who want to go beyond the summary.

**Independent Test**: Clicking the "Deep Dive" button on any event card opens a modal with expanded content.

**Acceptance Scenarios**:

1. **Given** an event card is visible, **When** I click "Deep Dive", **Then** a modal opens displaying the full details, providing more context than the summary text.

---

### User Story 3 - Rapid Skill Assessment (Priority: P2)

As a technical recruiter, I want to quickly identify the technologies used in each phase of the user's career so that I can assess their technical stack evolution.

**Why this priority**: Essential for professional evaluation and validation of skills mentioned in other sections.

**Independent Test**: Tech badges are visible on event cards and show correctly for each entry.

**Acceptance Scenarios**:

1. **Given** an event has associated technical skills, **When** the card is rendered, **Then** up to 5 technology badges are displayed directly on the card.
2. **Given** an event has more than 5 skills, **When** the card is rendered, **Then** a numeric counter (e.g., "+3") shows the remaining count.

---

### User Story 4 - Tracking Progress (Priority: P3)

As a visitor, I want visual feedback on my progress through the timeline so that I have a sense of where I am in the overall story.

**Why this priority**: Enhances interactivity and provides a "heartbeat" to the scrolling experience.

**Independent Test**: The spine's fill level and traveling dot move in direct response to the scroll position.

**Acceptance Scenarios**:

1. **Given** the timeline is in view, **When** I scroll down, **Then** the vertical spine fills with color and the traveling glow dot tracks the scroll position relative to the section.

---

### Edge Cases

- **Mobile Viewport**: The spine simplifies its layout below 768px viewport width (traveling dot hidden, year markers simplified) while maintaining the narrative flow and fill animation.
- **Missing Translation**: If a Thai translation is missing for an entry, it should fallback gracefully or be identified during implementation.
- **Fast Scrolling**: Background transitions and spine animations should remain stable and performant during rapid rapid scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display events in a vertical, single-column chronological order grouped by year as defined in the "The Chronicle" vision.
- **FR-002**: System MUST implement a dynamic "Spine" (TimelineSpine) that fills based on scroll progress (0-1) with a traveling glow dot (hidden below 768px for performance), year markers, and sticky positioning at `top: 6rem` below the navbar.
- **FR-003**: System MUST provide an ambient background (YearBackground) with radial gradients that crossfade (1.2s duration) as the active year enters the viewport.
- **FR-004**: System MUST support bilingual content (English and Thai) for all timeline elements (titles, summaries, impacts, and category labels).
- **FR-005**: System MUST track scroll progress and fire analytics events (TIMELINE_PROGRESS with properties: `percent`) at 25%, 50%, 75%, and 100% completion, and TIMELINE_DEEPDIVE_OPEN events with properties: `event_id`, `event_title`, `year`, `event_type`.
- **FR-006**: System MUST use Framer Motion for all animations (useMotionValueEvent, useScroll) to ensure GPU-accelerated performance.
- **FR-007**: System MUST display event metadata: Category (work, project, achievement, learning, milestone), Date, Title, Summary, and Impact.
- **FR-008**: System MUST support specific visual styling for different event types (e.g., Rocket icon for milestones, Trophy for achievements) and featured events MUST display a 1px ring with 30% accent opacity and a 2px top gradient strip.
- **FR-009**: System MUST show a "Vision CTA" (What's Next) at the conclusion of the timeline sequence.
- **FR-010**: System MUST implement a modal Deep Dive view triggered by event card buttons, displaying full Description (EN/TH), expanded Impact (EN/TH), complete skills list, and optional media/links, accessible via URL hash pattern `#timeline-event-{id}` for browser history support.

### Key Entities *(include if feature involves data)*

- **Timeline Event**: A discrete entry in the chronological narrative.
  - Attributes: ID, Type (Work/Project/Achievement/Learning/Milestone), Date, Title (EN/TH), Summary (EN/TH - shown on card), Description (EN/TH - full narrative shown in modal), Impact (EN/TH - expanded version in modal), Skills (Array - up to 5 on card, all in modal), SortDate (ISO), Featured (Boolean), Media/Links (optional, shown in modal).
- **Year Theme**: A set of design tokens defining the "chapter" aesthetics.
  - Attributes: Label (EN/TH), Gradient Colors (top/mid), Spine Color, Dot Color, Accent Hex.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page performance remains high during scroll interaction, maintaining 60fps on modern devices (verified via performance profiling).
- **SC-002**: Ambient background crossfade completes within 1.5 seconds of a year header reaching the active viewport threshold (20% from top).
- **SC-003**: 100% of events correctly display their technical stack badges and category-specific icons.
- **SC-004**: All timeline interactions (modal open, analytics tracking) are verified to work correctly on both desktop and mobile viewports.
