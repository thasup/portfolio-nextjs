import { Hero } from '@/components/sections/Hero'
import { ValueStrip } from '@/components/sections/ValueStrip'
import { Timeline } from '@/components/sections/Timeline'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'
import { ValueProp } from '@/components/sections/ValueProp'
import { Contact } from '@/components/sections/Contact'
import { siteConfig } from '@/data/siteConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isThai = locale === 'th';
  
  return {
    title: isThai ? `${siteConfig.name} | วิศวกร AI ชั้นแนวหน้า` : `${siteConfig.name} | Senior AI Engineer`,
    description: isThai 
      ? 'ผสมผสานความฉลาดของ AI เข้ากับวิศวกรรมฟรอนต์เอนด์ระดับสูง' 
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
  return (
    <>
      <Hero />
      <ValueStrip />
      <Timeline />
      <Projects />
      <Skills />
      <Testimonials />
      <ValueProp />
      <Contact />
    </>
  )
}
