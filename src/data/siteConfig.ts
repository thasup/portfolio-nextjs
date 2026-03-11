export const siteConfig = {
  name: 'Thanachon "First" Suppasatian',
  shortName: 'First',
  title: 'Senior Software Engineer',
  currentCompany: 'TeamStack',
  currentFocus: 'Building AI-first products',
  tagline:
    'Senior software engineer building AI-first products with product ownership, systems thinking, and a long-term founder trajectory.',
  location: 'Bangkok, Thailand',
  email: 'thanachon.sup@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/thanachon',
  githubUrl: 'https://github.com/thasup',
  avatarImage: '/images/avatar.webp',
  resumeUrl: '/resume.pdf',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thanachon.me',
  roles: [
    'Senior Software Engineer',
    'AI-first Product Builder',
    'Systems Thinker',
    'Founder in Formation',
  ],
  stats: {
    yearsExperience: 7,
    softwareYears: 4,
    projectsShipped: 6,
    domains: 3,
  },
  trustHighlights: [
    'AWS Certified Cloud Practitioner · 2025',
    'TOEIC 915/990 · English proficiency',
    'MEP Engineering → Software → AI',
    'Bangkok, Thailand · Open to international roles',
  ],
} as const
