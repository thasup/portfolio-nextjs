import { siteConfig } from '@/data/siteConfig'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { TimelineSection } from '@/components/timeline/TimelineSection'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `About Me | ${siteConfig.name}`,
  description: siteConfig.tagline,
}

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-20 text-center">
         <SectionHeader
            label={t('label')}
            title={t('title')}
          />
          <div className="mx-auto flex justify-center mb-10 w-full">
            <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-border bg-muted">
                 {/* Fallback pattern matching the hero avatar */ }
                  <div className="flex h-full w-full items-center justify-center text-5xl md:text-7xl font-bold bg-muted text-muted-foreground p-8">
                   {siteConfig.name.split(' ').map(n => n[0]).join('')}
                 </div>
            </div>
          </div>

          <div className="text-lg md:text-xl leading-relaxed text-muted-foreground space-y-6 text-left mb-12">
             <p>{t('bio1')}</p>
             <p>{t('bio2')}</p>
             <p>{t('bio3')}</p>
          </div>

           <div className="flex justify-center flex-wrap gap-4">
               <Link href="/#projects" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90">
                 {t('ctaProjects')}
               </Link>
               {siteConfig.resumeUrl && (
                  <a href={siteConfig.resumeUrl} target="_blank" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                    {t('ctaResume')}
                  </a>
               )}
           </div>
      </div>
      
      {/* We reuse the timeline section here as the story */}
      <TimelineSection />
    </div>
  )
}
