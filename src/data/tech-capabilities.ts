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
        name: 'Frameworks & Rendering',
        tools: [
          { name: 'React', primary: true },
          { name: 'Next.js', primary: true },
          { name: 'Vue' },
          { name: 'Nuxt' },
        ],
      },
      {
        name: 'Language & Type Safety',
        tools: [
          { name: 'TypeScript', primary: true },
          { name: 'JavaScript' },
        ],
      },
      {
        name: 'State & Data Flow',
        tools: [
          { name: 'TanStack Query', primary: true },
          { name: 'Zustand' },
          { name: 'Pinia' },
        ],
      },
      {
        name: 'Forms & Validation',
        tools: [
          { name: 'Zod' },
          { name: 'React Hook Form' },
        ],
      },
      {
        name: 'UI Systems & Styling',
        tools: [
          { name: 'TailwindCSS', primary: true },
          { name: 'shadcn/ui' },
          { name: 'MUI' },
          { name: 'SCSS' },
          { name: 'Framer Motion' },
        ],
      },
      {
        name: 'Testing & Quality',
        tools: [
          { name: 'Vitest' },
          { name: 'Jest' },
          { name: 'Playwright' },
        ],
      },
      {
        name: 'Tooling & Dev Experience',
        tools: [
          { name: 'Vite', primary: true },
          { name: 'ESLint' },
          { name: 'Prettier' },
          { name: 'Stylelint' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    number: '02',
    titleKey: 'tech.capabilities.ai.title',
    taglineKey: 'tech.capabilities.ai.tagline',
    signalKey: 'tech.capabilities.ai.signal',
    outcomeTextKey: 'tech.capabilities.ai.outcomeText',
    outcomeProject: 'The Air Product / AI Event Platform',
    iconName: 'Sparkles',
    emphasized: true,
    accentColor: '#f59e0b',
    accentRgb: '245, 158, 11',
    subsystems: [
      {
        name: 'LLM Integration',
        tools: [
          { name: 'OpenAI SDK', primary: true },
          { name: 'Vercel AI SDK' },
          { name: 'LangChain' },
        ],
      },
      {
        name: 'Retrieval & Context Systems',
        tools: [
          { name: 'RAG Pipelines', primary: true },
          { name: 'Embeddings' },
          { name: 'Vector Databases' },
        ],
      },
      {
        name: 'AI Engineering Practices',
        tools: [
          { name: 'Prompt Engineering' },
          { name: 'Context Engineering' },
          { name: 'Spec-driven Development' },
        ],
      },
      {
        name: 'Cloud AI Platforms',
        tools: [
          { name: 'Amazon Bedrock' },
          { name: 'Amazon SageMaker' },
        ],
      },
    ],
  },
  {
    id: 'fullstack',
    number: '03',
    titleKey: 'tech.capabilities.fullstack.title',
    taglineKey: 'tech.capabilities.fullstack.tagline',
    signalKey: 'tech.capabilities.fullstack.signal',
    outcomeTextKey: 'tech.capabilities.fullstack.outcomeText',
    outcomeProject: 'Token Gating / Tangier DAO',
    iconName: 'Server',
    emphasized: false,
    accentColor: '#a855f7',
    accentRgb: '168, 85, 247',
    subsystems: [
      {
        name: 'Backend Architecture',
        tools: [
          { name: 'Node.js', primary: true },
          { name: 'NestJS', primary: true },
          { name: 'REST' },
          { name: 'GraphQL' },
          { name: 'Apollo' },
        ],
      },
      {
        name: 'Data Layer',
        tools: [
          { name: 'PostgreSQL', primary: true },
          { name: 'MongoDB' },
        ],
      },
      {
        name: 'Cloud & Platforms',
        tools: [
          { name: 'AWS' },
          { name: 'GCP' },
          { name: 'Firebase' },
          { name: 'Supabase' },
        ],
      },
      {
        name: 'DevOps & Deployment',
        tools: [
          { name: 'Docker', primary: true },
          { name: 'GitHub Actions' },
          { name: 'CircleCI' },
        ],
      },
    ],
  },
  {
    id: 'product',
    number: '04',
    titleKey: 'tech.capabilities.product.title',
    taglineKey: 'tech.capabilities.product.tagline',
    signalKey: 'tech.capabilities.product.signal',
    outcomeTextKey: 'tech.capabilities.product.outcomeText',
    outcomeProject: 'Peatix Integration',
    iconName: 'Target',
    emphasized: false,
    accentColor: '#10b981',
    accentRgb: '16, 185, 129',
    subsystems: [
      {
        name: 'Analytics & Tracking',
        tools: [
          { name: 'Google Analytics (GA4)', primary: true },
          { name: 'Google Tag Manager' },
        ],
      },
      {
        name: 'Observability & Reliability',
        tools: [
          { name: 'Sentry', primary: true },
          { name: 'OpenTelemetry' },
        ],
      },
      {
        name: 'Product & Collaboration',
        tools: [
          { name: 'Jira' },
          { name: 'Agile Methodologies' },
        ],
      },
    ],
  },
];
