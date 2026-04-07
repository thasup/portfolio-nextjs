export const siteConfig = {
  name: 'Thanachon "First" Suppasatian',
  shortName: "First",
  email: "thanachonfirst@hotmail.com",
  linkedinUrl: "https://linkedin.com/in/thasup",
  githubUrl: "https://github.com/thasup",
  avatarImage: "/images/profile/avatar.jpeg",
  resumeUrl: "/resume.pdf",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thanachon.me",
  stats: {
    yearsExperience: 7,
    softwareYears: 4,
    projectsShipped: 6,
    domains: 3
  }
} as const;
