'use client'

import Link from 'next/link'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/data/siteConfig'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTranslations } from 'next-intl'

export function Hero() {
  const reducedMotion = useReducedMotion()
  const t = useTranslations('hero')
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % siteConfig.roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden pt-16"
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {siteConfig.name.split(' ')[0]}
                <br />
                <span className="text-gradient">{siteConfig.name.split(' ').slice(1).join(' ')}</span>
              </h1>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-4 h-8 text-xl font-medium text-muted-foreground sm:text-2xl">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    {siteConfig.roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                {siteConfig.tagline}
              </p>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="/#projects">{t('ctaPrimary')}</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact/">{t('ctaSecondary')}</Link>
                </Button>
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
