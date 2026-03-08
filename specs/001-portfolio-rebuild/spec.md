# Feature Specification: Portfolio Website Rebuild

**Feature Branch**: `001-portfolio-rebuild`
**Created**: 2026-03-08
**Status**: Draft
**Input**: User description: "Build a personal portfolio website for Thanachon Suppasatian — Senior Software Engineer pivoting toward Senior AI Engineer and Product Owner roles, with a 10-year vision of becoming a SaaS founder."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First Impression & Identity (Priority: P1)

A visitor lands on the portfolio site for the first time. Within 10 seconds, they understand three things about Thanachon: (1) he has shipped AI features in production, (2) he works across multiple domains (Web3, e-commerce, frontend), and (3) he is building toward something bigger than an individual contributor career. The hero section communicates a clear professional identity — not "Software Engineer" generically, but a specific positioning that signals Senior AI Engineer ambitions and product thinking. A persistent navigation bar lets the visitor jump to any section. The site supports light and dark modes and respects the visitor's system preference.

**Why this priority**: The hero section and navigation are the foundation of the entire site. Without a compelling first impression, no visitor will scroll further. Every other story depends on the layout, theme, and navigation established here.

**Independent Test**: Can be fully tested by loading the site on desktop and mobile, verifying the hero content communicates a clear differentiated identity, confirming theme toggle works, and checking that all navigation links scroll to their target sections.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the site for the first time, **When** the page finishes loading, **Then** they see a hero section with Thanachon's name, professional title, a concise tagline that positions him as an AI-focused engineer with product thinking, a professional avatar image, and prominent call-to-action buttons.
2. **Given** a visitor is on any section of the page, **When** they look at the navigation bar, **Then** they see links to all major sections (Timeline, Projects, Skills, Testimonials, Contact) and a theme toggle button.
3. **Given** a visitor's operating system is set to dark mode, **When** they load the site, **Then** the site renders in dark mode by default. They can toggle to light mode and the preference persists across page reloads.
4. **Given** a visitor is on a mobile device (viewport < 768px), **When** they view the site, **Then** all sections are fully responsive with a mobile-friendly navigation (hamburger menu or equivalent).
5. **Given** a visitor scrolls down the page, **When** they pass the hero section, **Then** a scroll progress indicator appears showing how far they have scrolled through the page.

---

### User Story 2 — Interactive Career Timeline (Priority: P1)

A technical recruiter or hiring manager wants to understand Thanachon's career trajectory quickly. They see an interactive vertical timeline showing 4 years of career milestones. Each node on the timeline represents a significant moment — a role change, a major project launch, a skill acquisition, or a career pivot. The visitor can scan the entire timeline at a glance to get the big picture, then click or tap any node to expand it and see what Thanachon did, what he learned, and the measurable impact. The timeline visually distinguishes between different types of events (work experience, projects, education, achievements). As the visitor scrolls, timeline nodes animate into view with subtle reveal effects.

**Why this priority**: The timeline is the core narrative device. It is the primary mechanism through which all three target audiences (technical recruiter, product leader, potential co-founder) understand Thanachon's trajectory. Without the timeline, the site is just a static résumé.

**Independent Test**: Can be fully tested by navigating to the timeline section, verifying all career events render in chronological order, clicking each node to confirm the detail expansion works, checking that scroll-triggered animations fire, and filtering by event type.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Timeline section, **When** the section enters the viewport, **Then** they see a vertical timeline with nodes representing career events, each showing a date, title, company/context, and a brief summary.
2. **Given** a visitor views the timeline, **When** they click or tap a timeline node, **Then** it expands to reveal a detailed description including: what was done, what was learned, and the concrete impact or outcome.
3. **Given** a visitor views the timeline, **When** they look at the timeline nodes, **Then** each node is visually coded by event type (e.g., work experience, project, education, achievement) using distinct icons or color indicators.
4. **Given** a visitor is scrolling through the timeline, **When** a new timeline node enters the viewport, **Then** it animates into view with a subtle fade-up reveal effect that respects the visitor's reduced-motion preferences.
5. **Given** a visitor has expanded a timeline node, **When** they click it again or click a different node, **Then** the first node collapses smoothly and the new node expands.

---

### User Story 3 — Project Showcase with Domain Filtering (Priority: P2)

A visitor wants to explore Thanachon's project portfolio to evaluate the breadth and depth of his work. They see a grid of project cards, each prominently displaying the project name, a screenshot or visual, the business domain (AI, Web3, E-commerce, Frontend), a one-line summary of the problem being solved, and the key technologies used. The AI Event Platform and Tangier DAO projects are visually emphasized as headline achievements. The visitor can filter projects by domain to see only AI projects, only Web3 projects, etc. Clicking a project card opens a detailed view or modal showing the full story: the business problem, the approach, key features, technical decisions, and outcomes.

**Why this priority**: The project showcase is how visitors verify that Thanachon has actually shipped real work. It transforms abstract claims into concrete evidence. However, it depends on the layout and navigation from US1.

**Independent Test**: Can be fully tested by navigating to the Projects section, verifying all six projects render correctly, testing each domain filter, and clicking each project to confirm the detail view opens with complete information.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Projects section, **When** the section enters the viewport, **Then** they see a grid of project cards showing at least six projects, each with a title, domain badge, problem summary, technology tags, and a project image.
2. **Given** a visitor views the Projects section, **When** they look at the filter controls, **Then** they see filter options for all represented domains (All, AI, Web3, E-commerce, Frontend) and "All" is selected by default.
3. **Given** a visitor clicks the "AI" filter, **When** the filter is applied, **Then** only AI-domain projects are visible, and the transition between filter states is smooth and animated.
4. **Given** a visitor clicks a project card, **When** the detail view opens, **Then** it displays: the business problem, the approach taken, key features delivered, technology stack used, and measurable outcomes or impact.
5. **Given** the AI Event Platform and Tangier DAO projects are present, **When** the visitor views the unfiltered grid, **Then** these two projects are visually distinguished as headline achievements (e.g., larger cards, featured badge, or prominent positioning).

---

### User Story 4 — Skills Presentation with Career Narrative (Priority: P2)

A visitor wants to understand Thanachon's technical capabilities and where he is heading. They see skills organized into meaningful clusters (e.g., AI & LLM, Frontend, Backend, DevOps, Product). Each cluster has a brief narrative that contextualizes those skills — not just listing "Python" but explaining that Python is used for production LLM pipelines and AI feature development. Visual indicators show relative proficiency or experience level for each skill. The AI & LLM cluster is visually positioned as the primary focus area, signaling the career trajectory. Skills animate into view as the visitor scrolls, with skill bars or proficiency indicators filling in.

**Why this priority**: Skills presentation directly supports the credibility of the timeline and projects. It shows the visitor that Thanachon's abilities are intentionally directed toward AI. However, it can be delivered independently of the project showcase.

**Independent Test**: Can be fully tested by navigating to the Skills section, verifying all skill clusters render with their narratives, confirming the AI & LLM cluster has visual prominence, and checking that proficiency animations trigger on scroll.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Skills section, **When** the section enters the viewport, **Then** they see skills grouped into named clusters, each with a cluster title, a contextual narrative sentence, and individual skill items.
2. **Given** a visitor views a skill cluster, **When** they look at individual skills, **Then** each skill shows a name, an icon or logo, and a visual proficiency indicator (e.g., fill bar, percentage, or experience-level label).
3. **Given** a visitor views all skill clusters, **When** they compare the clusters visually, **Then** the AI & LLM cluster is positioned prominently (first or largest) to signal it as the primary career trajectory.
4. **Given** a visitor scrolls the Skills section into view, **When** skill proficiency indicators enter the viewport, **Then** they animate from zero to their target value with a smooth fill effect that respects reduced-motion preferences.

---

### User Story 5 — Social Proof via Testimonials (Priority: P3)

A visitor wants independent validation of Thanachon's capabilities. They see a carousel or grid of testimonials from real colleagues, managers, and clients at MAQE Bangkok over 4 years. Each testimonial includes the person's name, role, professional relationship to Thanachon, and a specific quote. The testimonials feel human and specific — referencing concrete situations or qualities — not generic "great to work with" statements. The collection covers different perspectives: technical leadership, collaboration, product thinking, and reliability.

**Why this priority**: Testimonials reinforce the narrative established by the timeline, projects, and skills. They serve as third-party validation. However, the site delivers value to visitors even without testimonials, making this a P3 priority.

**Independent Test**: Can be fully tested by navigating to the Testimonials section, verifying all testimonials render with complete attribution, and confirming the carousel or navigation works to browse through multiple testimonials.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Testimonials section, **When** the section enters the viewport, **Then** they see testimonial cards, each displaying a quote, the person's name, their role or title, and their relationship to Thanachon (e.g., "Former Manager at MAQE").
2. **Given** there are more testimonials than fit on screen, **When** the visitor interacts with the carousel controls (arrows, dots, or swipe), **Then** additional testimonials are revealed with smooth slide transitions.
3. **Given** a visitor reads a testimonial, **When** they evaluate the quote, **Then** the content references specific qualities, skills, or situations rather than generic praise.

---

### User Story 6 — Value Proposition Section (Priority: P3)

A visitor has scrolled through the timeline, projects, skills, and testimonials. Before reaching the contact section, they see a concise value proposition that crystallizes what Thanachon brings to an organization. Five specific values are presented: (1) ships production AI features, (2) thinks product-first, (3) operates full-stack, (4) adopts new technology fast, and (5) is building toward founder territory. Each value has a brief supporting statement and optionally links back to evidence elsewhere on the page (a project, a timeline event, a testimonial).

**Why this priority**: The value proposition section ties the entire narrative together before the call-to-action. It is important for the emotional arc but is not strictly necessary for the site to function.

**Independent Test**: Can be fully tested by navigating to the value proposition section and verifying all five values render with their supporting statements and any cross-reference links resolve correctly.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls past the Testimonials section, **When** they reach the Value Proposition section, **Then** they see exactly five value statements, each with a title, a supporting description, and an icon or visual element.
2. **Given** a visitor views a value statement, **When** they click a cross-reference link (e.g., "See the AI Event Platform project"), **Then** the page scrolls to the referenced section or element.

---

### User Story 7 — Dual-Intent Contact Experience (Priority: P2)

A visitor is ready to reach out. The contact section lets them self-select their intent from four options: (1) hire as AI Engineer, (2) hire as Product Owner, (3) collaborate on a SaaS idea, or (4) general inquiry. Each option surfaces a tailored message or form context that makes the visitor feel that their specific intent is understood. The contact form validates inputs, provides clear feedback on submission, and sends the message. Social links (LinkedIn, GitHub, email) are also prominently displayed as alternative contact methods.

**Why this priority**: The contact section is the conversion point — the entire site builds toward this moment. It is P2 because the form itself can be simple initially, but the intent-selection mechanism is critical for the multi-audience strategy.

**Independent Test**: Can be fully tested by navigating to the Contact section, selecting each intent option, filling out and submitting the form, and verifying validation and submission feedback work correctly.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Contact section, **When** the section enters the viewport, **Then** they see four clearly labeled intent options (Hire as AI Engineer, Hire as Product Owner, Collaborate on SaaS, General Inquiry) and social links (LinkedIn, GitHub, Email).
2. **Given** a visitor selects "Hire as AI Engineer", **When** they view the contact form, **Then** the form context or messaging adapts to acknowledge their hiring intent (e.g., custom heading, relevant placeholder text).
3. **Given** a visitor fills out the contact form with valid data, **When** they submit the form, **Then** they see a clear success confirmation message and the form resets.
4. **Given** a visitor submits the form with missing or invalid fields, **When** the validation runs, **Then** they see specific, inline error messages for each invalid field (e.g., "Email address is required", "Please enter a valid email").
5. **Given** a visitor prefers not to use the form, **When** they click a social link, **Then** the link opens in a new tab to the respective platform profile.

---

### Edge Cases

- What happens when a visitor accesses the site on an extremely slow connection? All images must lazy-load with blur placeholders, and the critical text content must be visible before images finish loading.
- What happens when a visitor has JavaScript disabled? The site should render all static content (text, images via `<noscript>` fallbacks) even without JavaScript. Interactive features (animations, filters, form) gracefully degrade.
- What happens when a visitor uses a screen reader to navigate the site? All interactive elements must have appropriate ARIA labels, the timeline must be navigable via keyboard, and the page structure must use semantic headings.
- What happens when the contact form submission fails due to a network error? The visitor must see a clear error message with the option to retry, and their form data must not be lost.
- What happens when a visitor resizes their browser from desktop to mobile width? All sections must reflow responsively without content overlap or horizontal scrolling.
- What happens when there are zero projects matching a selected filter? The projects section must show a "No projects in this category" message rather than an empty grid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST render as a single-page application with smooth scroll navigation between sections.
- **FR-002**: The site MUST include these sections in order: Hero, Timeline, Projects, Skills, Testimonials, Value Proposition, Contact.
- **FR-003**: The navigation bar MUST remain visible (sticky) at all times and highlight the currently active section as the visitor scrolls.
- **FR-004**: The site MUST support light mode and dark mode, defaulting to the visitor's system preference, with a manual toggle that persists the choice.
- **FR-005**: The Hero section MUST display Thanachon's name, a professional title, a positioning tagline, a professional avatar image, and at least two call-to-action buttons (e.g., "View My Work" and "Get In Touch").
- **FR-006**: The Timeline section MUST display career events in chronological order along a vertical axis, with each event showing a date, title, company or context, event type indicator, and expandable detail content.
- **FR-007**: Timeline events MUST be categorized by type (work experience, project, education, achievement) with distinct visual indicators for each type.
- **FR-008**: The Projects section MUST display at least six projects as cards in a responsive grid layout, each showing a title, domain badge, problem summary, technology tags, and a project image.
- **FR-009**: The Projects section MUST provide domain-based filtering with options for All, AI, Web3, E-commerce, and Frontend.
- **FR-010**: Each project card MUST be expandable or clickable to reveal a detailed view containing: business problem, approach, key features, technology stack, and outcomes.
- **FR-011**: The AI Event Platform and Tangier DAO projects MUST be visually distinguished as featured or headline projects.
- **FR-012**: The Skills section MUST display skills grouped into named clusters with a narrative description per cluster and visual proficiency indicators per skill.
- **FR-013**: The AI & LLM skill cluster MUST be visually positioned as the primary focus area (first in order or given the most visual prominence).
- **FR-014**: The Testimonials section MUST display quotes from colleagues, managers, or clients with full attribution (name, role, relationship).
- **FR-015**: The Testimonials section MUST support browsing through multiple testimonials via a carousel with navigation controls.
- **FR-016**: The Value Proposition section MUST present exactly five value statements, each with a title, description, icon, and optional cross-reference link to supporting evidence on the page.
- **FR-017**: The Contact section MUST allow visitors to self-select their intent from four options: Hire as AI Engineer, Hire as Product Owner, Collaborate on SaaS, General Inquiry.
- **FR-018**: The Contact form MUST validate all required fields (name, email, message) with inline error messages before allowing submission.
- **FR-019**: The Contact section MUST display social links (LinkedIn, GitHub, Email) as alternative contact methods.
- **FR-020**: All scroll-triggered animations MUST respect the visitor's `prefers-reduced-motion` setting by disabling or reducing animations when this preference is active.
- **FR-021**: The site MUST include a scroll progress indicator that shows the visitor's position within the page.
- **FR-022**: All interactive elements MUST be keyboard-accessible and include appropriate ARIA attributes.
- **FR-023**: The site MUST be statically exportable with no server-side runtime dependencies.
- **FR-024**: The site MUST include proper SEO metadata: title tag, meta description, Open Graph tags, and a structured heading hierarchy.
- **FR-025**: All content (timeline events, projects, skills, testimonials, values) MUST be driven by structured data files, not hardcoded in component markup.

### Key Entities

- **TimelineEvent**: Represents a career milestone. Key attributes: date, title, company/context, event type (work, project, education, achievement), summary, detailed description, impact statement, skills learned.
- **Project**: Represents a portfolio project. Key attributes: title, domain (AI, Web3, E-commerce, Frontend), problem summary, detailed description, approach, key features list, technology tags, outcomes/impact, image, featured flag, external links (live site, source code).
- **SkillCluster**: Represents a group of related skills. Key attributes: cluster name, narrative description, display order, emphasis flag (for AI & LLM cluster).
- **Skill**: Represents an individual technical skill. Key attributes: name, icon identifier, proficiency level (1-100 or named tier), parent cluster.
- **Testimonial**: Represents social proof from a colleague or client. Key attributes: quote text, author name, author role/title, relationship to Thanachon, author avatar image.
- **ValueProposition**: Represents one of five core value statements. Key attributes: title, description, icon identifier, cross-reference link (optional anchor to another section or element).
- **ContactIntent**: Represents a visitor's reason for reaching out. Key attributes: intent label, intent key, contextual heading, contextual placeholder text.

### Assumptions

- The site is a **single-page layout** with all sections on one page, navigated via smooth scroll. There are no separate routes for individual projects or timeline events.
- **Contact form submissions** are sent via an email delivery service (e.g., Resend). The form does not store messages in a database; it delivers them to Thanachon's email.
- **Testimonials are static content** provided by Thanachon. There is no system for third parties to submit testimonials dynamically.
- **Project images** are provided by Thanachon as static assets. There is no CMS or dynamic image upload capability.
- **Six projects** are the initial scope. Additional projects can be added by editing the data file without code changes.
- **Google Analytics 4** is used for visitor tracking. No other analytics or tracking systems are required.
- The site targets **modern evergreen browsers** (Chrome, Firefox, Safari, Edge — latest 2 versions). Internet Explorer is not supported.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify Thanachon's professional focus (AI Engineer) and career trajectory (toward Product Owner/SaaS founder) within 10 seconds of landing on the site.
- **SC-002**: The site achieves Lighthouse scores of 95+ across all four categories (Performance, Accessibility, Best Practices, SEO) on both mobile and desktop audits.
- **SC-003**: A visitor can navigate from the hero section to any other section within 2 seconds using the navigation bar.
- **SC-004**: A visitor can scan the complete career timeline and identify all major career milestones within 30 seconds.
- **SC-005**: A visitor can filter projects by domain and view a project's full detail within 3 clicks from the initial page load.
- **SC-006**: The site loads and displays above-the-fold content with a Largest Contentful Paint (LCP) under 2.5 seconds on a standard 4G connection.
- **SC-007**: All interactive elements (timeline nodes, project filters, carousel controls, form inputs, theme toggle) are operable via keyboard-only navigation.
- **SC-008**: The contact form can be completed and submitted in under 60 seconds by a visitor who knows their intent.
- **SC-009**: The site renders correctly and all content is accessible across viewports from 320px to 2560px wide without horizontal scrolling or content overflow.
- **SC-010**: The entire site builds and exports as static files with zero errors and zero server runtime dependencies.
