# Architectural Contracts: Bilingual Portfolio

**Branch**: `002-bilingual-portfolio` | **Date**: 2026-03-08 | **Context**: [plan.md](../plan.md)

## 1. Centralized Modal System Contract

Zero external navigation from detailed content blocks; everything renders atop the view hierarchy using URL hashing to guarantee native browser navigation compatibility.

### `ModalType` and `ModalPayload` definitions

```typescript
type ModalType = 'project' | 'timeline-event' | 'certificate' | 'testimonial';

interface ModalPayload {
  type: 'project';        id: string;  // project slug
  type: 'timeline-event'; id: string;  // event id
  type: 'certificate';    id: 'aws-ccp' | 'toeic';
  type: 'testimonial';    id: string;  // testimonial id
}

interface ModalContextValue {
  isOpen: boolean;
  payload: ModalPayload | null;
  open: (payload: ModalPayload) => void;
  close: () => void;
}
```

### Usage Guarantee

- `useHashModal` hook synchronizes the hash string (e.g., `#project-ai-event-platform`) onto the global window object.
- The root `Modal` component reacts natively, scaling up/down via Framer Motion without server SSR disruption.

## 2. Analytics Reporting Contract

Every interaction corresponds to a rigidly typed schema mapping Google Analytics 4 via `@next/third-parties/google`.

### `Events` Map Definition

```typescript
export const Events = {
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',
  TIMELINE_SCENE_ENTER: 'timeline_scene_enter',
  PROJECT_CARD_CLICK: 'project_card_click',
  LANGUAGE_TOGGLE: 'language_toggle',
  // ... maps perfectly to the constitution rules
} as const;

type EventName = typeof Events[keyof typeof Events];

interface EventParams {
  modal_open: { type: ModalType; id: string };
  modal_close: { type: ModalType; id: string; time_spent_ms: number };
  timeline_scene_enter: { event_id: string; event_title: string; index: number };
  project_card_click: { slug: string; domain: string; featured: boolean };
  language_toggle: { from: 'en'|'th'; to: 'en'|'th' };
}
```

## 3. i18n Contract (next-intl)

UI strings decoupled securely from static data exports. Handled natively via `<IntlProvider/>` components bound directly to `/en/...` and `/th/...` route mappings.

### Format Schema (e.g., `messages/en.json`)

```json
{
  "nav": {
    "timeline": "Timeline",
    "projects": "Projects",
    "skills": "Skills",
    "about": "About",
    "contact": "Contact",
    "resume": "Resume",
    "hireMe": "Hire Me"
  },
  "hero": {
    "availability": "Open to Senior AI Engineer & PO roles · Bangkok",
    "tagline": "I build products that think.",
    "ctaPrimary": "See My Work",
    "ctaSecondary": "Get In Touch"
  }
}
```

### Component Implementation Rule

```typescript
import { useTranslations, useLocale } from 'next-intl';

export default function HeroContent() {
  const t = useTranslations('hero');
  const locale = useLocale(); 
  // Read static strings via `t` (e.g., t('ctaPrimary'))
  // Read CMS data objects dynamically (e.g., locale === 'th' ? project.titleTh : project.titleEn)
}
```

## 4. Static Data Authority Contract

- All narrative content (timeline, projects, testimonials, skills, values) must live in typed files within `src/data/`.
- Updates to content are performed by editing these files directly, reviewed via version control.
- No build-time network fetches are permitted; deterministic builds rely solely on repository data.
