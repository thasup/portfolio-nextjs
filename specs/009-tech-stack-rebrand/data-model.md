# Data Model: Tech Stack Rebrand

**Feature**: `009-tech-stack-rebrand`
**Date**: 2026-03-17
**Revised**: 2026-03-18

## Core Entities

### Capability

Represents a system layer owned by the engineer. Replaces the old 3-tier model with 4 capabilities.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `CapabilityId` | Unique identifier ('frontend', 'ai', 'fullstack', 'product') |
| `number` | `string` | Display number ('01', '02', '03', '04') |
| `titleKey` | `string` | i18n key for capability title |
| `taglineKey` | `string` | i18n key for italic tagline |
| `signalKey` | `string` | i18n key for ownership signal quote |
| `outcomeTextKey` | `string` | i18n key for measurable outcome description |
| `outcomeProject` | `string` | Flagship project name (not localized) |
| `iconName` | `IconName` | Lucide icon name |
| `emphasized` | `boolean` | Whether to highlight with accent border/glow |
| `accentColor` | `string` | Hex color for accent elements |
| `accentRgb` | `string` | RGB values for CSS variables (e.g., '79, 142, 247') |
| `subsystems` | `Subsystem[]` | Grouped tool clusters by engineering purpose |

### Subsystem

Represents a cluster of tools grouped by engineering purpose within a capability.

| Field | Type | Description |
| :--- | :--- | :--- |
| `nameKey` | `string` | i18n key for subsystem name (e.g., 'tech.subsystems.frameworks_rendering') |
| `tools` | `Tool[]` | Array of tools in this subsystem |

### Tool

Represents a specific technology or practice.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Tool name in English (not localized, e.g., 'React', 'TypeScript') |
| `primary` | `boolean?` | Optional flag to render with accent color |

```typescript
// src/types/tech-capabilities.ts

export type CapabilityId = 'frontend' | 'fullstack' | 'product' | 'ai';

export interface Tool {
  name: string;
  primary?: boolean;
}

export interface Subsystem {
  nameKey: string;
  tools: Tool[];
}

export interface Capability {
  id: CapabilityId;
  number: string;
  titleKey: string;
  taglineKey: string;
  signalKey: string;
  outcomeTextKey: string;
  outcomeProject: string;
  iconName: 'LayoutTemplate' | 'Server' | 'Target' | 'Sparkles';
  emphasized: boolean;
  accentColor: string;
  accentRgb: string;
  subsystems: Subsystem[];
}
```

### Project (Existing)

The existing `Project` entity remains largely unchanged, but the `techStack` field usage is now more strictly visually coupled to the tiers (though loose coupled in data).

| Field | Type | Description |
| :--- | :--- | :--- |
| `techStack` | `string[]` | List of technologies used. These are now displayed as badges in the modal. |

## Data Sources

### `src/data/tech-capabilities.ts`

Contains the static configuration for 4 capabilities with subsystems.

```typescript
import { Capability } from '@/types/tech-capabilities';

export const capabilities: Capability[] = [
  {
    id: 'frontend',
    number: '01',
    titleKey: 'tech.capabilities.frontend.title',
    taglineKey: 'tech.capabilities.frontend.tagline',
    signalKey: 'tech.capabilities.frontend.signal',
    outcomeTextKey: 'tech.capabilities.frontend.outcomeText',
    outcomeProject: 'AP Thai / MAQE Website',
    iconName: 'LayoutTemplate',
    emphasized: true,
    accentColor: '#4f8ef7',
    accentRgb: '79, 142, 247',
    subsystems: [
      {
        nameKey: 'tech.subsystems.frameworks_rendering',
        tools: [
          { name: 'React', primary: true },
          { name: 'Next.js', primary: true },
          { name: 'Vue' },
          { name: 'Nuxt' },
        ],
      },
      // ... more subsystems
    ],
  },
  // ... 3 more capabilities (ai, fullstack, product)
];
```

### `messages/{locale}.json`

New keys structure:

```json
{
  "tech": {
    "label": "SKILLS",
    "sectionTitle": "Core Capabilities",
    "subtitle": "I design and deliver production systems...",
    "outcomeLabel": "Measurable Outcome",
    "flagshipLabel": "Flagship",
    "subsystems": {
      "frameworks_rendering": "Frameworks & Rendering",
      "language_type_safety": "Language & Type Safety",
      "state_data_flow": "State & Data Flow",
      "llm_integration": "LLM Integration",
      "backend_architecture": "Backend Architecture",
      "analytics_tracking": "Analytics & Tracking",
      "project_management": "Project Management & Documentation",
      // ... 14 more subsystem keys
    },
    "capabilities": {
      "frontend": {
        "title": "Frontend Systems & Experience Engineering",
        "tagline": "Framework-first. System-aware. User-obsessed.",
        "signal": "I design complete frontend systems, not just screens.",
        "outcomeText": "Increased conversion rates..."
      },
      "ai": { /* ... */ },
      "fullstack": { /* ... */ },
      "product": { /* ... */ }
    }
  }
}
```

**Note**: Subsystem names are localized via `tech.subsystems.*` keys. Tool names remain in English (hardcoded in data file).
