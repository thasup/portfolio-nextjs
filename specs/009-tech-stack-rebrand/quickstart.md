# Quickstart: Tech Stack Rebrand

**Feature**: `009-tech-stack-rebrand`
**Date**: 2026-03-17

## Overview

This feature replaces the old "Skills" section with a "Technical Capabilities" section organized into 3 strategic tiers. It also adds technology tags to project modals.

## How to Modify the Tech Stack

The tech stack is now strictly defined in `src/data/tech-capabilities.ts`.

### Adding a Tool to a Tier

1. Open `src/data/tech-capabilities.ts`.
2. Find the relevant Tier object (`id: 'core'`, `'architecture'`, or `'data'`).
3. Add the string name of the tool to the `tools` array.

```typescript
{
  id: 'core',
  // ...
  tools: ['Next.js', 'React', 'NEW_TOOL_HERE'],
}
```

### Modifying Tier Copy

1. Open `messages/en.json` (and `th.json`).
2. Navigate to `tech.tiers.{tierId}`.
3. Update `title`, `subtitle`, or `proof`.

```json
"tech": {
  "tiers": {
    "core": {
      "proof": "Updated proof point text..."
    }
  }
}
```

## How to Usage in Components

### Rendering the Capabilities Section

Use the `TechCapabilities` component (to be created):

```tsx
import { TechCapabilities } from '@/components/sections/TechCapabilities';

export default function HomePage() {
  return (
    <main>
      {/* ... */}
      <TechCapabilities />
      {/* ... */}
    </main>
  );
}
```

### Rendering Tech Badges in Modals

The `ProjectModal` will automatically render tags based on the `project.techStack` array.

```tsx
// Inside ProjectModal.tsx
<div className="flex flex-wrap gap-2">
  {project.techStack.map(tech => (
    <Badge key={tech}>{tech}</Badge>
  ))}
</div>
```
