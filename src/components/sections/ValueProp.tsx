import { SectionHeader } from '@/components/shared/SectionHeader'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { valuePropositions } from '@/data/valuePropositions'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Target, Layers, Zap, Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getSignalLabel } from '@/lib/content'

export function ValueProp() {
  const t = useTranslations('value')
  const locale = useLocale()
  const isThai = locale === 'th'

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="h-6 w-6" />
      case 'Target': return <Target className="h-6 w-6" />
      case 'Layers': return <Layers className="h-6 w-6" />
      case 'Zap': return <Zap className="h-6 w-6" />
      case 'Rocket': return <Rocket className="h-6 w-6" />
      default: return <span />
    }
  }

  return (
    <section id="value" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {valuePropositions.map((value, index) => {
            const isLastOrphaned = index === valuePropositions.length - 1 && valuePropositions.length % 2 !== 0
            const title = isThai && value.titleTh ? value.titleTh : value.titleEn
            const description = isThai && value.descriptionTh ? value.descriptionTh : value.descriptionEn
            const proof = isThai && value.proofTh ? value.proofTh : value.proofEn
            const signalLabel = value.signalTag ? getSignalLabel(value.signalTag, isThai ? 'th' : 'en') : null
            const href = value.crossRef
              ? value.crossRef.startsWith('project:')
                ? `/projects/${value.crossRef.replace('project:', '')}`
                : value.crossRef.startsWith('timeline:')
                  ? `/#${value.crossRef.replace('timeline:', '')}`
                  : value.crossRef.startsWith('section:')
                    ? `/#${value.crossRef.replace('section:', '')}`
                    : value.crossRef
              : null
            return (
              <ScrollReveal 
                key={value.id} 
                delay={index * 0.1}
                className={isLastOrphaned ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <Card className="h-full border-border bg-card hover:border-primary/50 transition-colors group">
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getIcon(value.icon)}
                    </div>
                    {signalLabel && (
                      <div className="mb-3">
                        <span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                          {signalLabel}
                        </span>
                      </div>
                    )}
                    <h3 className="mb-3 text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {description}
                    </p>
                    {proof && (
                      <p className="mt-5 rounded-lg border border-border/60 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
                        {proof}
                      </p>
                    )}
                    {href && (
                      <Link 
                        href={href}
                        className="mt-6 flex items-center text-sm font-medium text-primary hover:underline hover:underline-offset-4"
                      >
                        {t('evidence')}
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
