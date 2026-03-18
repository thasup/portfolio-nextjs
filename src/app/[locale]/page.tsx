import { HeroWithStats } from '@/components/sections/HeroWithStats'
import { getTranslations } from 'next-intl/server'
import { Timeline } from '@/components/sections/Timeline'
import { Projects } from '@/components/sections/Projects'
import { TechCapabilities } from '@/components/sections/TechCapabilities'
import { Testimonials } from '@/components/sections/Testimonials'
import { ValueProp } from '@/components/sections/ValueProp'
import { Contact } from '@/components/sections/Contact'
import { siteConfig } from '@/data/siteConfig'
import { featureFlags } from '@/lib/featureFlags'
import { fetchGitHubStats } from '@/lib/github'
import { Skills } from '@/components/sections/Skills'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'siteConfig' });
  const isThai = locale === 'th';

  return {
    title: `${siteConfig.name} | Senior Software Engineer`,
    description: t('tagline'),
    // Provide correct alternate links relying on the route locale layout
    alternates: {
      canonical: isThai ? `${siteConfig.siteUrl}/th` : siteConfig.siteUrl,
      languages: {
        en: siteConfig.siteUrl,
        th: `${siteConfig.siteUrl}/th`,
      },
    },
    openGraph: {
      images: [
        {
          url: isThai ? '/images/og-th.webp' : '/images/og-default.webp',
          width: 1200,
          height: 630,
        }
      ]
    }
  }
}

export default async function HomePage() {
  const { showWipSections } = featureFlags
  const githubUsername = siteConfig.githubUrl.split('/').pop() || 'thasup'
  const githubStats = await fetchGitHubStats(githubUsername)

  return (
    <>
      <HeroWithStats githubStats={githubStats} />
      <Timeline />
      <Projects />
      <TechCapabilities />
      {showWipSections && <Skills />}
      <Testimonials />
      {showWipSections && <ValueProp />}
      {showWipSections && <Contact />}
    </>
  )
}
