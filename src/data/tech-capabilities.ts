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
          { name: 'React.js', primary: true },
          { name: 'Next.js', primary: true },
          { name: 'Vue.js' },
          { name: 'Nuxt.js' },
        ],
      },
      {
        nameKey: 'tech.subsystems.language_type_safety',
        tools: [
          { name: 'TypeScript', primary: true },
          { name: 'JavaScript' },
        ],
      },
      {
        nameKey: 'tech.subsystems.state_data_flow',
        tools: [
          { name: 'TanStack Query' },
          { name: 'Zustand' },
          { name: 'Pinia' },
        ],
      },
      {
        nameKey: 'tech.subsystems.forms_validation',
        tools: [
          { name: 'Zod' },
          { name: 'React Hook Form' },
        ],
      },
      {
        nameKey: 'tech.subsystems.ui_systems_styling',
        tools: [
          { name: 'TailwindCSS' },
          { name: 'shadcn/ui' },
          { name: 'MUI' },
          { name: 'SCSS' },
          { name: 'Framer Motion' },
        ],
      },
      {
        nameKey: 'tech.subsystems.testing_quality',
        tools: [
          { name: 'Vitest' },
          { name: 'Jest' },
          { name: 'Playwright' },
        ],
      },
      {
        nameKey: 'tech.subsystems.tooling_dev_experience',
        tools: [
          { name: 'Vite' },
          { name: 'ESLint' },
          { name: 'Prettier' },
          { name: 'Stylelint' },
        ],
      },
    ],
  },
  {
    id: 'fullstack',
    number: '02',
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
        nameKey: 'tech.subsystems.backend_architecture',
        tools: [
          { name: 'Node.js', primary: true },
          { name: 'Nest.js', primary: true },
          { name: 'REST' },
          { name: 'GraphQL' },
          { name: 'Apollo' },
        ],
      },
      {
        nameKey: 'tech.subsystems.language',
        tools: [
          { name: 'Python' },
          { name: 'PHP' },
        ],
      },
      {
        nameKey: 'tech.subsystems.data_layer',
        tools: [
          { name: 'PostgreSQL', primary: true },
          { name: 'MongoDB' },
        ],
      },
      {
        nameKey: 'tech.subsystems.cloud_platforms',
        tools: [
          { name: 'AWS', primary: true },
          { name: 'Firebase', primary: true },
          { name: 'GCP' },
          { name: 'Supabase' },
        ],
      },
      {
        nameKey: 'tech.subsystems.devops_deployment',
        tools: [
          { name: 'Docker' },
          { name: 'GitHub Actions' },
          { name: 'CircleCI' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    number: '03',
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
        nameKey: 'tech.subsystems.llm_integration',
        tools: [
          { name: 'Vercel AI SDK', primary: true },
          { name: 'LangChain' },
          { name: 'OpenAI SDK' },
        ],
      },
      {
        nameKey: 'tech.subsystems.retrieval_context',
        tools: [
          { name: 'RAG Pipelines' },
          { name: 'Embeddings' },
          { name: 'Vector Databases' },
        ],
      },
      {
        nameKey: 'tech.subsystems.ai_practices',
        tools: [
          { name: 'Spec-driven Development', primary: true },
          { name: 'Prompt Engineering' },
          { name: 'Context Engineering' },
        ],
      },
      {
        nameKey: 'tech.subsystems.cloud_ai_platforms',
        tools: [
          { name: 'Amazon Bedrock' },
          { name: 'Amazon SageMaker' },
        ],
      },
      {
        nameKey: 'tech.subsystems.automation_workflow',
        tools: [
          { name: 'Zapier' },
          { name: 'n8n' },
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
        nameKey: 'tech.subsystems.analytics_tracking',
        tools: [
          { name: 'Google Analytics (GA4)', primary: true },
          { name: 'Google Tag Manager' },
        ],
      },
      {
        nameKey: 'tech.subsystems.observability_reliability',
        tools: [
          { name: 'Sentry', primary: true },
          { name: 'OpenTelemetry' },
        ],
      },
      {
        nameKey: 'tech.subsystems.project_management',
        tools: [
          { name: 'Jira' },
          { name: 'Confluence' },
          { name: 'Notion' },
          { name: 'Airtable' },
        ],
      },
      {
        nameKey: 'tech.subsystems.design_collaboration',
        tools: [
          { name: 'Figma', primary: true },
          { name: 'Miro' },
          { name: 'Canva' },
          { name: 'Slack' },
        ],
      },
      {
        nameKey: 'tech.subsystems.agile_practices',
        tools: [
          { name: 'Agile Methodologies' },
          { name: 'Scrum' },
          { name: 'Kanban' },
          { name: 'Sprint Planning' },
          { name: 'Retrospectives' },
        ],
      },
    ],
  },
];
