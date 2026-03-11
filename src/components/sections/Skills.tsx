import { SectionHeader } from '@/components/shared/SectionHeader'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SkillBar } from '@/components/shared/SkillBar'
import { skillClusters } from '@/data/skills'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocalizedText } from '@/components/shared/LocalizedText'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label={<LocalizedText en="SKILLS" th="ทักษะ" />}
          title={<LocalizedText en="Technical Arsenal" th="ความสามารถทางเทคนิค" />}
          subtitle={<LocalizedText en="Intentionally building toward AI engineering mastery" th="ความเชี่ยวชาญด้าน AI และซอฟต์แวร์เต็มรูปแบบ" />}
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
                    <LocalizedText en={cluster.nameEn} th={cluster.nameTh} />
                    {cluster.emphasized && (
                      <span className="flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </CardTitle>
                  {(cluster.statusEn || cluster.statusTh) && (
                    <div>
                      <span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                        <LocalizedText en={cluster.statusEn || ''} th={cluster.statusTh || cluster.statusEn || ''} />
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <LocalizedText en={cluster.narrativeEn} th={cluster.narrativeTh} />
                  </p>
                </CardHeader>
                <CardContent className="grid gap-5">
                  {cluster.skills.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                  {cluster.evidenceRefs && cluster.evidenceRefs.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cluster.evidenceRefs.map((ref) => (
                        <Link
                          key={ref}
                          href={`/projects/${ref}`}
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
