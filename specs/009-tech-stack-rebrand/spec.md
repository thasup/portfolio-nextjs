# Feature Specification: Tech Stack Representation Strategy and Rebrand

**Feature Branch**: `009-tech-stack-rebrand`
**Created**: 2026-03-17
**Revised**: 2026-03-18
**Status**: Implemented
**Revision Note**: Redesigned from 3-tier "proof points" to 4-capability "system ownership" model based on senior signal feedback.

## Core Design Philosophy

**Before**: Tool-first, tier-based display. Felt like "4 unrelated skill buckets."

**After**: System-layer ownership model. Each capability = a system you own, not a list you've touched. Tools grouped by **engineering purpose**, not HR keywords.

The framework: *Frontend → AI → Fullstack → Product* — a complete engineering narrative for modern product roles.

---

## User Scenarios & Testing

### User Story 1 - Hiring Manager Evaluation (Priority: P1)

As a hiring manager scanning the portfolio, I want to see the candidate's senior engineering capability and ownership immediately, so that I can determine if they can own modern product systems end-to-end within the "60-Second Impact Window".

**Why this priority**: Addresses Principle I (Product Impact Over Implementation Folklore). The new model signals systems thinking and decision authority, not just tool familiarity.

**Independent Test**: Navigate to the homepage, scroll to the "Core Capabilities" section, and verify all 4 cards render correctly with the complete anatomy.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** they scroll to the section, **Then** they see the layer pills (Frontend → AI → Fullstack → Product), the heading "Core Capabilities", and the positioning subtitle.
2. **Given** each capability card, **When** viewed, **Then** it displays: numbered badge (01-04), Lucide icon, title, italic tagline, subsystem grid, measurable outcome box with project reference, and signal quote blockquote.
3. **Given** the Frontend capability (01), **When** viewed, **Then** the signal reads "I design complete frontend systems, not just screens." and the outcome references "AP Thai / MAQE Website".
4. **Given** the AI capability (02), **When** viewed, **Then** the signal reads "I can design real AI systems, not just call APIs." and the outcome references "The Air Product / AI Event Platform".
5. **Given** emphasized cards (Frontend, AI), **When** viewed, **Then** they render with accent-colored border glow distinguishing them from supporting capabilities.
6. **Given** any card, **When** hovered, **Then** the accent stripe brightens, an ambient glow appears, and the icon scales up.
7. **Given** the homepage, **When** scanned, **Then** there are NO sections labeled "To be learned", "Familiar", or "Used to use".
8. **Given** the homepage, **When** scanned, **Then** there is NO standalone grid of disembodied technology logos.

---

### User Story 2 - Project Technology Context (Priority: P1)

As a visitor viewing a specific project, I want to see the technologies used as badges within the project context, so that I understand what tools were used to build that specific evidence of work.

**Why this priority**: Connects Tool to Evidence (Principle VI).

**Independent Test**: Open a Project Modal and verify tech stack badges display correctly.

**Acceptance Scenarios**:

1. **Given** a Project Modal is open, **When** viewing the project details, **Then** the tech stack is displayed as Tags/Badges.
2. **Given** the project details, **When** viewing the tags, **Then** they are relevant to that specific project (not a generic list).
3. **Given** a project with no techStack defined, **When** the modal opens, **Then** no empty badge container is shown.

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display 4 capability cards in a 2-column grid: Frontend Systems, AI Systems, Fullstack Systems, Product Impact.
- **FR-002**: The system MUST use "Core Capabilities" as the section heading and display layer pills (Frontend → AI → Fullstack → Product) above the heading.
- **FR-003**: Each card MUST contain: numbered badge, icon, title, tagline, subsystem grid, measurable outcome box, and signal quote.
- **FR-004**: Tools within each subsystem MUST be visually distinguished as primary (accent-colored) vs. supporting (muted).
- **FR-005**: Emphasized cards (Frontend, AI) MUST render with accent-colored borders and glow to signal priority.
- **FR-006**: Each card MUST use its own accent color system via CSS variables (`--card-accent`, `--card-accent-rgb`), driving stripe, glow, badges, and signal quote styling.
- **FR-007**: The system MUST NOT display "To be learned", "Familiar", or "Used to use" categories.
- **FR-008**: The system MUST NOT display a standalone grid of icons without context.
- **FR-009**: The system MUST render technology tags/badges within Project Modals from `project.techStack`.

### Capability Definitions

| # | ID | Title | Icon | Accent | Emphasized | Signal |
|---|---|---|---|---|---|---|
| 01 | `frontend` | Frontend Systems & Experience Engineering | LayoutTemplate | `#4f8ef7` | ✅ | "I design complete frontend systems, not just screens." |
| 02 | `ai` | AI Systems & Intelligent Automation | Sparkles | `#f59e0b` | ✅ | "I can design real AI systems, not just call APIs." |
| 03 | `fullstack` | Fullstack Systems & Infrastructure Delivery | Server | `#a855f7` | ❌ | "Can independently ship and operate systems in production." |
| 04 | `product` | Product & Business Impact Engineering | Target | `#10b981` | ❌ | "I don't just build features—I measure, debug, and improve business outcomes." |

### Key Entities

- **Capability**: A system layer owned by the engineer. Contains numbered badge, icon, title, tagline, signal quote, measurable outcome (text + project reference), and grouped subsystems.
- **Subsystem**: A named cluster of tools within a capability, organized by engineering purpose (e.g., "Frameworks & Rendering", "State & Data Flow").
- **Tool**: A specific technology with a `primary` flag. Primary tools render with accent color; supporting tools render muted.

### Edge Cases

- **EC-001**: On mobile, the 2-column card grid stacks to 1 column.
- **EC-002**: If `project.techStack` is empty, the badge container in Project Modal is hidden.
- **EC-003**: Non-primary tools in a subsystem render in muted text to avoid visual noise on cards with many tools.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The homepage "Skills" section is replaced by the 4-capability system ownership display.
- **SC-002**: All proficiency-tier language ("To be learned", "Familiar", "Used to use") is removed from codebase and UI.
- **SC-003**: 100% of Project Modals display technology tags.
- **SC-004**: Each capability card signals senior-level ownership through: system naming, engineering-purpose grouping, project-specific outcomes, and positioning quotes.
- **SC-005**: Both English and Thai locales render the section correctly with translated marketing copy (signal, outcome, tagline) while technical tool names remain in English.
