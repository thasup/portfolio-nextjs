export const siteConfig = {
  name: 'Thanachon Supasatian',
  title: 'Senior Software Engineer',
  tagline:
    'Building production AI systems and full-stack products. Pivoting from 4 years of shipping across Web3, e-commerce, and frontend into Senior AI Engineer — with a 10-year vision of founding a SaaS company.',
  location: 'Bangkok, Thailand',
  email: 'thanachon.sup@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/thanachon',
  githubUrl: 'https://github.com/thasup',
  avatarImage: '/images/avatar.webp',
  resumeUrl: '/resume.pdf',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thanachon.me',
  roles: [
    'Senior Software Engineer',
    'AI Engineer',
    'Product Thinker',
    'Future SaaS Founder',
  ],
  stats: {
    yearsExperience: 4,
    projectsShipped: 6,
    domains: 3,
  },
} as const
