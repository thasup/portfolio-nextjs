# Feature Specification: Bilingual Portfolio

**Feature Branch**: `002-bilingual-portfolio`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "A bilingual (EN/TH) personal portfolio website for Thanachon Suppasatian that functions as a high-conversion job-hunt asset..."

## Overview & Content Foundation
The site establishes a bilingual experience reflecting the career timeline, projects, and skills of Thanachon Suppasatian (AI Engineer / Product Owner / Founder).
Airtable Gaia Project API check resulted in a 404 (schema absent), so the provided content canvas serves as the authoritative source.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 5-Second Impression (Priority: P1)
As a visitor (Technical Hiring Manager or Product Leader), I want to immediately understand who Thanachon is and his current role within 5 seconds of loading the site.

**Why this priority**: First impressions dictate whether the user stays or leaves. The fast validation of skills (AWS Certified, TOEIC 915) instantly proves credibility.
**Independent Test**: Load the Hero section and verify that user's role, pivot narrative, location, and trust signals are immediately visible above the fold. Ensure clarity holds in both EN and TH without layout breakdown.

**Acceptance Scenarios**:
1. **Given** I am on the home page, **When** the Hero section loads, **Then** I see the name, dual-language title, 2 CTAs ("See My Work", "Get In Touch"), and trust signals within seconds.

---

### User Story 2 - Vertical Narrative Timeline (Priority: P1)
As a visitor, I want to scroll vertically through the Timeline track to see Thanachon's 5 chapters of professional growth (from mechanical engineer to AI builder) without horizontal distractions.

**Why this priority**: The timeline is the site's flagship experience, showing purposeful career progression and overcoming challenges.
**Independent Test**: Scroll the timeline section and verify each chapter functions as a full-width scene (minimum 80vh desktop) with parallax/reveal depth.

**Acceptance Scenarios**:
1. **Given** I reached the Timeline, **When** I scroll vertically, **Then** I experience staggered animations revealing each event's impact.
2. **Given** the timeline is active, **When** I progress, **Then** a persistent vertical spine tracks my position across chapters.

---

### User Story 3 - Centralized Portfolio Showcase (Priority: P1)
As a visitor, I want to view detailed real-world production projects (like AI Event Platform or Tangier) in a centralized modal instead of navigating away.

**Why this priority**: Reduces friction in reviewing project evidence.
**Independent Test**: Click any project card and ensure a full-screen Modal (~80vw x 80vh) opens containing the project details.

**Acceptance Scenarios**:
1. **Given** I am on the Projects section, **When** I click "AI Event Creation & Management Platform", **Then** the Centralized Modal opens.
2. **Given** the Modal is open, **When** I hit the ESC key, **Then** the Modal closes without a page reload and returns me to where I was.

---

### User Story 4 - Bilingual Toggle Support (Priority: P1)
As a Thai-speaking recruiter or founder, I want to switch the website language to Thai to understand how Thanachon approaches Product Ownership.

**Why this priority**: Required to target two very distinct audiences (international AI engineering vs. Thai startup PO roles).
**Independent Test**: Toggle the language control and verify that all CTAs, navigation links, chapter details, and contact forms correctly update to the selected language without page distortion.

**Acceptance Scenarios**:
1. **Given** the site is loaded in English, **When** I switch the language to Thai, **Then** all strings immediately translate to Thai.

---

### User Story 5 - Structured Direct Contact (Priority: P2)
As a visitor, I want to select my intent and easily contact Thanachon using a short 3-field form.

**Why this priority**: This is the conversion point for the site.
**Independent Test**: Use the contact section to select an intent, fill the form, and submit it, verifying the success state.

**Acceptance Scenarios**:
1. **Given** I am in the Contact section, **When** I select an intent and click Submit, **Then** a success message assures a 24-hour response.

---

### Edge Cases

- What happens when a user navigates to the `#` hash for an open Modal but JavaScript is failing? (Server-side rendering or graceful fallback)
- How does the timeline layout respond to extremely short or tall viewports?
- What happens when the Airtable proxy connection fails on the build step? (Use fallback static canvas provided in this specification)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render bilingual (EN/TH) content strings interchangeably on demand, defaulting to English.
- **FR-002**: System MUST render the Timeline with continuous vertical scroll and interactive stage indicators via animations.
- **FR-003**: System MUST provide a centralized Modal (full coverage) for all supplementary deep-dive content lacking external navigation.
- **FR-004**: System MUST track granular GA4 typed user interactions (e.g., `TIMELINE_SCENE_ENTER`, `LANGUAGE_TOGGLE`) explicitly upon these interactions.

### Key Entities
- **Content Event**: Chapter names, historical milestones, narrative text.
- **Project**: Production showcase entity featuring tags, descriptions, approaches, outcomes.
- **Skill Cluster**: Grouped proficiency scores and narratives (e.g., AI & Intelligent Systems).
- **Testimonial**: Quote, author relation, full text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lighthouse Performance Score hits 100 on desktop and 95+ on mobile.
- **SC-002**: First-impression load (LCP) must appear in under 1.2s on desktop, and under 2.0s on mobile.
- **SC-003**: Hero above-the-fold content successfully communicates value propositions without user scrolling.
- **SC-004**: Cumulative Layout Shift (CLS) remains 0.00, enabled via fixed image aspect-ratios.
