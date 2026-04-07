import { SectionHeader } from '@/components/shared/SectionHeader'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { GlassCard } from '@/components/glass'
import { valuePropositions } from '@/data/valuePropositions'
import { Sparkles, Target, Layers, Zap, Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getSignalLabel } from '@/lib/content'

export function ValueProp() {
  const t = useTranslations('value')
  const tRoot = useTranslations()

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const title = t(value.titleKey as any)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const description = t(value.descriptionKey as any)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const proof = value.proofKey ? t(value.proofKey as any) : null
            const signalKey = value.signalTag ? getSignalLabel(value.signalTag) : null
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
                <GlassCard elevation="e2" hover className="h-full group">
                  <div className="p-6 md:p-8 flex flex-col h-full">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getIcon(value.icon)}
                    </div>
                    {signalKey && (
                      <div className="mb-3">
                        <span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {tRoot(signalKey as any)}
                        </span>
                      </div>
                    )}
                    <h3 className="mb-3 text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed grow">
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
                  </div>
                </GlassCard>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
