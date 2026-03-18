# Feature Specification: Tech Stack Representation Strategy and Rebrand

**Feature Branch**: `009-tech-stack-rebrand`
**Created**: 2026-03-17
**Status**: Draft
**Input**: User description: "Tech Stack Representation Strategy... The Constitutional Critique of the 'Icon Grid'..."

## User Scenarios & Testing

### User Story 1 - Hiring Manager Evaluation (Priority: P1)

As a hiring manager scanning the portfolio, I want to see the candidate's core delivering capability immediately, so that I can determine if they fit our senior-level needs within the "60-Second Impact Window".

**Why this priority**: This directly addresses the "Salesmanship vs. Reality" framework and Principle I (Product Impact Over Implementation Folklore). The current "Icon Grid" creates noise; the new strategy focuses on impact.

**Independent Test**: Can be tested by navigating to the homepage and verifying the "Tech Stack" section displays the 3 Tiers with context, rather than a grid of logos.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** they scroll to the "Tech Stack" section, **Then** they see the section title "Technical Capabilities & Governance" and subtitle "Tools I use to engineer premium experiences, ensure reliability, and measure business impact."
2. **Given** the Tier 1 (Core Delivery Stack) card, **When** viewed, **Then** it displays a Lightning Bolt icon (Yellow/Orange), the list of tools, positioning text, and the proof point: "Used in 80% of my shipped projects."
3. **Given** the Tier 2 (Architecture & Quality) card, **When** viewed, **Then** it displays a Shield icon (Green), the list of tools, positioning text, and the proof point: "Praised by peers for setting developer standards."
4. **Given** the Tier 3 (Data & Product Insights) card, **When** viewed, **Then** it displays a Bar Chart icon (Blue), the list of tools, positioning text, and the proof point: "Guided UX restructuring that improved conversion."
5. **Given** the homepage, **When** scanned, **Then** there are NO sections labeled "To be learned", "Familiar", or "Used to use".
6. **Given** the homepage, **When** scanned, **Then** there is NO grid of disembodied technology logos.

---

### User Story 2 - Project Technology Context (Priority: P1)

As a visitor viewing a specific project, I want to see the technologies used as badges within the project context, so that I understand what tools were used to build that specific evidence of work.

**Why this priority**: Connects Tool to Evidence (Principle VI).

**Independent Test**: Can be tested by opening a Project Modal and verifying tech stack presence.

**Acceptance Scenarios**:

1. **Given** a Project Modal is open, **When** viewing the project details, **Then** the tech stack is displayed as Tags/Badges.
2. **Given** the project details, **When** viewing the tags, **Then** they are relevant to that specific project (not a generic list).

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display the Tech Stack on the homepage categorized into exactly three tiers: Core Delivery, Architecture & Quality, and Data & Product Insights.
- **FR-002**: The system MUST use the section title "Technical Capabilities & Governance" and subtitle "Tools I use to engineer premium experiences, ensure reliability, and measure business impact."
- **FR-003**: The system MUST NOT display "To be learned", "Familiar", or "Used to use" categories or lists.
- **FR-004**: The system MUST NOT display a standalone grid of icons without context.
- **FR-005**: The system MUST render technology tags/badges within the Project Modals (or Project Detail views).
- **FR-006**: The system MUST use the specific copy provided for each tier's positioning and proof points.
  - **Tier 1 (Core Delivery)**:
    - **Icon**: Lightning Bolt (Yellow/Orange)
    - **Positioning**: "My primary stack for building fast, accessible, and premium web applications."
    - **Proof Point**: "Used in 80% of my shipped projects."
  - **Tier 2 (Architecture & Quality)**:
    - **Icon**: Shield (Green)
    - **Positioning**: "Tools I use to ensure type safety, scalable architecture, and production reliability."
    - **Proof Point**: "Praised by peers for setting developer standards."
  - **Tier 3 (Data & Product Insights)**:
    - **Icon**: Bar Chart (Blue)
    - **Positioning**: "Instrumentation and data tools used to measure impact and inform product decisions."
    - **Proof Point**: "Guided UX restructuring that improved conversion."

### Key Entities

- **Tech Stack Tier**: Represents a category of tools (Core, Architecture, Data) containing a title, icon, description/positioning, list of tools, and a proof point.
- **Tech Tool**: Represents a specific technology (e.g., Next.js) with a name and potentially an icon (used only within the card/badge context, not as a standalone grid).

### Edge Cases

- **EC-001**: **Mobile View**: On smaller screens, the 3-Tier cards should stack vertically to maintain readability.
- **EC-002**: **Empty Project Stack**: If a specific project in the portfolio has no technologies defined, the "Tech Stack" section in the modal should be hidden rather than showing an empty state.
- **EC-003**: **Long Text Handling**: Positioning text should wrap appropriately without breaking the card layout on mid-sized screens (tablets).

## Success Criteria

### Measurable Outcomes

- **SC-001**: The "Skills" section on the homepage is replaced by the 3-Tier Strategy cards.
- **SC-002**: All "To be learned", "Familiar", and "Used to use" references are removed from the codebase/UI.
- **SC-003**: 100% of Project Modals display technology tags.
- **SC-004**: Page load performance (LCP) does not degrade due to the new layout (should likely improve by removing massive icon grids).
