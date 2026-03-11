import { siteConfig } from '@/data/siteConfig'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Timeline } from '@/components/sections/Timeline'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `About Me | ${siteConfig.name}`,
  description: siteConfig.tagline,
}

export default async function AboutPage() {
  const t = await getTranslations('about')
  const acts = [
    { title: t('act1Title'), body: t('act1Body') },
    { title: t('act2Title'), body: t('act2Body') },
    { title: t('act3Title'), body: t('act3Body') },
    { title: t('act4Title'), body: t('act4Body') },
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-20 text-center">
         <SectionHeader
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
          <div className="mx-auto flex justify-center mb-10 w-full">
            <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-border bg-muted">
                  <div className="flex h-full w-full items-center justify-center text-5xl md:text-7xl font-bold bg-muted text-muted-foreground p-8">
                   {siteConfig.name.split(' ').map(n => n[0]).join('')}
                 </div>
            </div>
          </div>

          <div className="space-y-8 text-left mb-12">
             {acts.map((act) => (
               <div key={act.title} className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
                 <h2 className="mb-4 text-2xl font-bold">{act.title}</h2>
                 <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                   {act.body.split('\n\n').map((paragraph) => (
                     <p key={paragraph}>{paragraph}</p>
                   ))}
                 </div>
               </div>
             ))}
             <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
               <h2 className="mb-4 text-2xl font-bold">{t('personalityTitle')}</h2>
               <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                 {t('personalityBody').split('\n\n').map((paragraph) => (
                   <p key={paragraph}>{paragraph}</p>
                 ))}
               </div>
             </div>
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
      <Timeline />
    </div>
  )
}
