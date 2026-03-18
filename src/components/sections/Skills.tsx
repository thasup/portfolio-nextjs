import { useTranslations, useLocale } from 'next-intl'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SkillBar } from '@/components/shared/SkillBar'
import { skillClusters } from '@/data/skills'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function Skills() {
  const t = useTranslations('skills')
  const locale = useLocale()

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="grid gap-8 md:grid-cols-2">
          {skillClusters.sort((a, b) => a.order - b.order).map((cluster, index) => (
            <ScrollReveal key={cluster.id} delay={index * 0.1}>
              <Card
                className={cn(
                  'h-full border transition-colors',
                  cluster.emphasized
                    ? 'border-primary/50 shadow-sm shadow-primary/5'
                    : 'border-border hover:border-border/80'
                )}
              >
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {t(cluster.labelKey)}
                    {cluster.emphasized && (
                      <span className="flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </CardTitle>
                  {cluster.statusKey && t.has(cluster.statusKey) && (
                    <div>
                      <span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                        {t(cluster.statusKey)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t(cluster.descriptionKey)}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="grid gap-4">
                    {cluster.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <SkillBar name={skill.name} level={skill.level} />
                        {skill.tagKey && (
                          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider block pl-1">
                            {t(skill.tagKey)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {cluster.evidenceRefs && cluster.evidenceRefs.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cluster.evidenceRefs.map((ref) => (
                        <Link
                          key={ref}
                          href={`${locale === 'th' ? '/th' : ''}/projects/${ref}`}
                          className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          {ref}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
