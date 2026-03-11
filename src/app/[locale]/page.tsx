import { Hero } from '@/components/sections/Hero'
import { ValueStrip } from '@/components/sections/ValueStrip'
import { Timeline } from '@/components/sections/Timeline'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'
import { ValueProp } from '@/components/sections/ValueProp'
import { Contact } from '@/components/sections/Contact'
import { siteConfig } from '@/data/siteConfig'
import { featureFlags } from '@/lib/featureFlags'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isThai = locale === 'th';
  
  return {
    title: `${siteConfig.name} | Senior Software Engineer`,
    description: isThai 
      ? 'Senior Software Engineer ที่สร้างผลิตภัณฑ์ AI-first ด้วย systems thinking และ product ownership'
      : siteConfig.tagline,
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

export default function HomePage() {
  const { showWipSections } = featureFlags

  return (
    <>
      <Hero />
      <ValueStrip />
      <Timeline />
      <Projects />
      {showWipSections && <Skills />}
      <Testimonials />
      {showWipSections && <ValueProp />}
      {showWipSections && <Contact />}
    </>
  )
}
