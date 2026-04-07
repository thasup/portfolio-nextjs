import type { ContactIntent } from '@/types/contact'

export const contactIntents: ContactIntent[] = [
  {
    key: 'hire-ai',
    labelKey: 'intents.hire-ai.label',
    headingKey: 'intents.hire-ai.heading',
    previewKey: 'intents.hire-ai.preview',
    placeholderKey: 'intents.hire-ai.placeholder',
    icon: 'Sparkles',
  },
  {
    key: 'hire-po',
    labelKey: 'intents.hire-po.label',
    headingKey: 'intents.hire-po.heading',
    previewKey: 'intents.hire-po.preview',
    placeholderKey: 'intents.hire-po.placeholder',
    icon: 'Target',
  },
  {
    key: 'collaborate',
    labelKey: 'intents.collaborate.label',
    headingKey: 'intents.collaborate.heading',
    previewKey: 'intents.collaborate.preview',
    placeholderKey: 'intents.collaborate.placeholder',
    icon: 'Handshake',
  },
  {
    key: 'general',
    labelKey: 'intents.general.label',
    headingKey: 'intents.general.heading',
    previewKey: 'intents.general.preview',
    placeholderKey: 'intents.general.placeholder',
    icon: 'MessageSquare',
  },
]
