# Image Asset Strategy & Specification

This document outlines the requirements and strategy for image resources across the portfolio. Per the [Constitution](file:///Users/first/git/me/portfolio-nextjs/.specify/memory/constitution.md), all images must maintain a premium, cinematic feel without including human figures to maximize credibility and focus on technical/product essence.

## Core Visual Principles

1.  **No Humans**: Use realistic textures, abstract forms, or light-based visuals to represent themes.
2.  **Abstract Context**: For projects, use abstraction to represent the domain/problem rather than hallucinating fake UI screenshots.
3.  **Premium Aesthetic**: Utilize vibrant color palettes (consistent with domain themes), glassmorphism, depth, and cinematic lighting.
4.  **Consistency**: Maintain a unified look and feel across all categories while respecting domain-specific color coding.

## Image Categories & Requirements

| Category | Purpose | Themes | Sizing | Style | Target Paths |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Project Hero** | Primary visual for project cards and detail headers. | Domain-specific abstraction (AI, Web3, eCommerce, Frontend). | 1200x630 (1.91:1) | Cinematic, depth, domain-colored. | `/public/images/projects/[slug]/hero.png` |
| **Identity** | Abstract professional "avatar" representing the engineer. | Systems thinking, intelligence, neural-architectural hybrid. | 1024x1024 | Geometric, crystalline, refined. | `/public/images/profile/avatar.png` |
| **SEO (OG)** | Social sharing previews for English and Thai locales. | Brand overview, "60-second impact" visual. | 1200x630 | High-impact, balanced, logo-ready. | `/public/images/og-default.webp`<br>`/public/images/og-th.webp` |
| **Favicon/Branding**| Browser and mobile icons. | Minimalist distillation of the Identity theme. | 512x512 | Vector-like, high contrast, symbol-focused. | `/public/images/favicon/*.png` |
| **Project Gallery** | (Optional) Secondary screenshots for deep-dive sections. | Detailed aspects of the project (data flow, logic nodes). | 1200x800 | Texture-focused, technical abstraction. | `/public/images/projects/[slug]/gallery-*.png` |

## Project-Specific Image Definitions

Each project requires a unique Hero image that reflects its domain and strategic value.

### AI & LLM (Indigo/Ethereal Theme)
-   **The Air Product**: 
    -   *Theme*: Internal AI Product, 3-year roadmap, strategic vision.
    -   *Visual*: Ethereal blue intelligence "clouds" being shaped by structured architectural lines; sense of future-growth and context-awareness.
-   **AI Event Creation Platform**: 
    -   *Theme*: Generative AI for production workflows.
    -   *Visual*: Vibrancy of events (colorful energy) meeting sharp, crystalline AI processing patterns.

### Web3 (Purple/Crystalline Theme)
-   **Tangier DAO**: 
    -   *Theme*: Trustless community fundraising, decentralized giving.
    -   *Visual*: Interlocking crystalline "circles" representing giving nodes; Ethereum-colored (purple/silver) on-chain grid.
-   **Token Gating**: 
    -   *Theme*: NFT access control, multi-chain security.
    -   *Visual*: Gated light/energy passing through multi-layered hexagonal "shields" or "keys".

### E-Commerce (Emerald/Geometric Theme)
-   **AP Thai**: 
    -   *Theme*: Property discovery at scale, mobile-first.
    -   *Visual*: Geometric perspective grids representing modern architecture and mapping data points moving in sync.
-   **B2B Catalog**: 
    -   *Theme*: Headless commerce, complex B2B logic, logistics.
    -   *Visual*: Infinite grid of "cubes" or "modules" fading into depth, representing inventory and business logic.

### Frontend & Product (Sky/System Theme)
-   **TeamStack Roster**: 
    -   *Theme*: 0 to 1 MVP delivery, team orchestration.
    -   *Visual*: Interlocking geometric blocks representing team members being "assembled" into a stable structure.
-   **MAQE Website v5**: 
    -   *Theme*: Corporate asset, stability, long-term maintenance.
    -   *Visual*: Solid foundation pillars or a central "core" being woven together by precise code-like light filaments.

## Current Status & Gap Analysis

| Asset Group | Status | Issues / Findings |
| :--- | :--- | :--- |
| **Project Heros** | ⚠️ Partial | Files exist in `public/images/projects/` but formats mismatch `src/data/projects.ts`. Data expects `.png` but files are `.webp` or `.svg`. |
| **Identity/Avatar** | ❌ Missing | Currently using a text-based placeholder ("TS") in `Hero.tsx`. |
| **SEO (OG)** | ❌ Missing | `generateMetadata` in `page.tsx` references `/images/og-default.webp` and `/images/og-th.webp` but files do not exist. |
| **Favicon** | ⚠️ Generic | Default `favicon.ico` exists but lacks the specified abstract branding. |
| **Project Gallery** | ❌ Missing | `screenshots` arrays in `projects.ts` are currently empty. |

### Technical Audit: Filename Mismatch
The `src/data/projects.ts` file currently references `.png` for all `heroImage` paths. However, the local filesystem contains a mix of `.webp` and `.svg`.

**Recommendation**: Standardize all production assets to `.webp` for performance, and update `src/data/projects.ts` to match.

## Image Generation Roadmap
To fulfill the requirements, the following prompts and batches should be executed:

1.  **Identity Batch**: Generate the abstract avatar and favicon base.
2.  **AI Domain Batch**: Generate Heros for `the-air-product` and `ai-event-platform`.
3.  **Web3 Domain Batch**: Generate Heros for `tangier-dao` and `token-gating`.
4.  **E-Commerce/Frontend Batch**: Generate Heros for the remaining projects.
5.  **SEO/Composition Batch**: Compose the OG images using the generated branding and site tagline.
