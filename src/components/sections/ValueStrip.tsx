import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { siteConfig } from '@/data/siteConfig'

export function ValueStrip() {
  const stats = [
    { value: siteConfig.stats.yearsExperience, suffix: '+', label: 'Years Experience' },
    { value: siteConfig.stats.projectsShipped, suffix: '', label: 'Projects Shipped' },
    { value: siteConfig.stats.domains, suffix: '', label: 'Industry Domains' },
  ]

  return (
    <section className="border-y border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold md:text-4xl">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
