import { TechTier } from '@/types/tech-capabilities';

export const techTiers: TechTier[] = [
  {
    id: 'core',
    titleKey: 'tech.tiers.core.title',
    subtitleKey: 'tech.tiers.core.subtitle',
    proofKey: 'tech.tiers.core.proof',
    iconName: 'Zap',
    tools: ['Next.js', 'React', 'Nuxt.js', 'Vue.js', 'Node.js', 'Nest.js', 'PostgreSQL', 'TypeScript', 'TailwindCSS', 'shadcn/ui', 'MUI'],
    color: 'text-yellow-500',
  },
  {
    id: 'architecture',
    titleKey: 'tech.tiers.architecture.title',
    subtitleKey: 'tech.tiers.architecture.subtitle',
    proofKey: 'tech.tiers.architecture.proof',
    iconName: 'Shield',
    tools: ['Zod', 'React Hook Form', 'TanStack Query', 'Zustand', 'Pinia', 'Vite', 'Vitest', 'Playwright', 'ESLint', 'GitHub Action'],
    color: 'text-green-500',
  },
  {
    id: 'data',
    titleKey: 'tech.tiers.data.title',
    subtitleKey: 'tech.tiers.data.subtitle',
    proofKey: 'tech.tiers.data.proof',
    iconName: 'BarChart3',
    tools: ['Google Analytics', 'Google Tag Manager', 'Sentry'],
    color: 'text-blue-500',
  },
];
