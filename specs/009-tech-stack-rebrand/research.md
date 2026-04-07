# Research & Decisions: Tech Stack Rebrand

**Feature**: `009-tech-stack-rebrand`
**Date**: 2026-03-17

## Decisions

### 1. Data Structure Refactor

- **Decision**: Create a new data file `src/data/tech-capabilities.ts` to replace `src/data/skills.ts`.
- **Rationale**: The new "3-Tier" structure (Core, Architecture, Data) is fundamentally different from the previous "Skill Cluster" (Frontend, Backend, etc.) structure. Replacing the file avoids debt and confusion.
- **Schema**:

  ```typescript
  export interface TechTier {
    id: 'core' | 'architecture' | 'data';
    title: string;
    subtitle: string; // "My primary stack..."
    icon: React.ElementType; // Lucide Icon
    proof: string; // "Used in 80%..."
    tools: string[];
    color: string; // for icon/theme
  }
  ```

### 2. Component Strategy

- **Decision**: Create `src/components/sections/TechCapabilities/` to replace `src/components/sections/Skills/`.
- **Rationale**: The visual presentation is completely different (cards vs. lists/grids).
- **Icon System**: Use `lucide-react` icons directly in the config.
  - Tier 1: `Zap` (Lightning Bolt)
  - Tier 2: `Shield`
  - Tier 3: `BarChart3` (Bar Chart)

### 3. Project Tags

- **Decision**: Maintain `techStack` as `string[]` in `Project` type for flexibility, but validate against a known list of tools if possible.
- **Rationale**: Migration of all project data to a relational ID system is out of scope for this task. String matching is sufficient for display.

### 4. Localization

- **Decision**: All static text (titles, descriptions, proofs) will be moved to `messages/{locale}.json`.
- **Keys**:
  - `tech.title`, `tech.subtitle`
  - `tech.tiers.core.title`, `tech.tiers.core.subtitle`, `tech.tiers.core.proof`
  - etc.

## Alternatives Considered

- **Keeping `skills.ts`**: Rejected because the field names `level`, `tagKey`, `statusKey` are no longer relevant to the new "Impact-First" philosophy. We want to remove "proficiency levels" entirely.
