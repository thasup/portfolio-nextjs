# Data Model: Tech Stack Rebrand

**Feature**: `009-tech-stack-rebrand`
**Date**: 2026-03-17

## Core Entities

### TechTier

Represents a high-level category of technical capability. This replaces the old "SkillCluster".

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier ('core', 'architecture', 'data') |
| `titleKey` | `string` | i18n key for the tier title |
| `subtitleKey` | `string` | i18n key for the positioning statement |
| `proofKey` | `string` | i18n key for the proof point |
| `iconName` | `string` | Name of the Lucide icon to render (e.g., 'Zap', 'Shield') |
| `tools` | `string[]` | List of tool names to display (e.g., ['Next.js', 'React']) |
| `color` | `string` | Theme color class or hex for the icon/accent |

```typescript
// src/types/tech-capabilities.ts

export type TechTierId = 'core' | 'architecture' | 'data';

export interface TechTier {
  id: TechTierId;
  titleKey: string;
  subtitleKey: string;
  proofKey: string;
  iconName: 'Zap' | 'Shield' | 'BarChart3'; // Constrained to used icons
  tools: string[];
  color: string;
}
```

### Project (Existing)

The existing `Project` entity remains largely unchanged, but the `techStack` field usage is now more strictly visually coupled to the tiers (though loose coupled in data).

| Field | Type | Description |
| :--- | :--- | :--- |
| `techStack` | `string[]` | List of technologies used. These are now displayed as badges in the modal. |

## Data Sources

### `src/data/tech-capabilities.ts`

This new file will hold the static configuration for the 3 tiers.

```typescript
import { TechTier } from '@/types/tech-capabilities';

export const techTiers: TechTier[] = [
  {
    id: 'core',
    titleKey: 'tech.tiers.core.title',
    // ...
    tools: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'shadcn/ui'],
  },
  // ...
];
```

### `messages/{locale}.json`

New keys to be added:

```json
{
  "tech": {
    "title": "Technical Capabilities & Governance",
    "subtitle": "Tools I use to engineer premium experiences...",
    "tiers": {
      "core": {
        "title": "Core Delivery Stack",
        "subtitle": "My primary stack for building...",
        "proof": "Used in 80% of my shipped projects."
      },
      "architecture": {
        "title": "Architecture & Quality",
        "subtitle": "Tools I use to ensure type safety...",
        "proof": "Praised by peers for setting developer standards."
      },
      "data": {
        "title": "Data & Product Insights",
        "subtitle": "Instrumentation and data tools...",
        "proof": "Guided UX restructuring that improved conversion."
      }
    }
  }
}
```
