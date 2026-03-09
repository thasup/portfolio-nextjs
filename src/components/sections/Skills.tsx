import { SectionHeader } from '@/components/shared/SectionHeader'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SkillBar } from '@/components/shared/SkillBar'
import { skillClusters } from '@/data/skills'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label="SKILLS"
          title="Technical Arsenal"
          subtitle="Intentionally building toward AI engineering mastery"
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
                    {cluster.nameEn}
                    {cluster.emphasized && (
                      <span className="flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{cluster.narrativeEn}</p>
                </CardHeader>
                <CardContent className="grid gap-5">
                  {cluster.skills.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
