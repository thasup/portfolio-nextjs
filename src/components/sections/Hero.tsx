'use client'

import Link from 'next/link'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/data/siteConfig'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTranslations } from 'next-intl'

export function Hero() {
  const reducedMotion = useReducedMotion()
  const t = useTranslations('hero')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const Wrapper = reducedMotion ? 'div' : motion.div

  return (
    <section
      id="hero"
      className="relative flex min-h-[70vh] items-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Wrapper
          {...(!reducedMotion && {
            variants: containerVariants,
            initial: 'hidden',
            animate: 'visible',
          })}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Text content */}
          <div>
            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('availability')}
              </span>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
                {t('intro')}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t('roleLine')}
              </h1>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-6 max-w-2xl space-y-4">
                <p className="text-base leading-relaxed text-foreground md:text-xl">
                  {t('tagline')}
                </p>
                <div className="max-w-xl rounded-2xl border border-border bg-muted/40 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground md:text-base">
                    {t('proofHeadline')}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">
                    {t('proofSubheadline')}
                  </p>
                </div>
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="space-y-2">
                  <Button size="lg" asChild>
                    <Link href="/#projects">{t('ctaPrimary')}</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">{t('ctaPrimaryHint')}</p>
                </div>
                {/* <div className="space-y-2">
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact/">{t('ctaSecondary')}</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">{t('ctaSecondaryHint')}</p>
                </div> */}
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <p className="mt-8 text-sm font-medium text-muted-foreground md:text-base">
                {t('directionLine')}
              </p>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[t('trust1'), t('trust2'), t('trust3'), t('trust4')].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-8 flex gap-3">
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </Wrapper>
          </div>

          {/* Avatar */}
          <Wrapper
            {...(!reducedMotion && { variants: itemVariants })}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-linear-to-br from-primary/20 via-accent/20 to-primary/20 blur-2xl" />
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-border bg-muted sm:h-80 sm:w-80">
                <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-muted-foreground">
                  TS
                </div>
              </div>
            </div>
          </Wrapper>
        </Wrapper>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <motion.div
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-muted-foreground"
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
