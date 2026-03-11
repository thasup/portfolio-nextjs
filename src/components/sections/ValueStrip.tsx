'use client'

import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import type { GitHubStats } from '@/lib/github'

interface ValueStripProps {
  githubStats?: GitHubStats | null
}

export function ValueStrip({ githubStats }: ValueStripProps) {
  const t = useTranslations('hero')

  const stats = [
    {
      value: githubStats?.totalStars ?? 0,
      suffix: '',
      label: t('stripStars'),
      available: !!githubStats,
    },
    {
      value: githubStats?.totalCommits ?? 0,
      suffix: '+',
      label: t('stripCommits'),
      available: !!githubStats,
    },
    {
      value: githubStats?.totalContributions ?? 0,
      suffix: '+',
      label: t('stripContributions'),
      available: !!githubStats,
    },
    {
      value: githubStats?.contributedRepos ?? 0,
      suffix: '',
      label: t('stripRepos'),
      available: !!githubStats,
    },
  ]

  return (
    <section className="border-y border-border bg-muted/30 py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold md:text-4xl">
                  {stat.available ? (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
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
