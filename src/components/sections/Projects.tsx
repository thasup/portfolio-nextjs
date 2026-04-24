'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { type ProjectDomain } from '@/types/project'
import { projects } from '@/data/projects'
import { ProjectCard } from '../projects/ProjectCard'
import { ProjectFilter } from '../projects/ProjectFilter'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { sortFeaturedFirst } from '@/lib/content'

export function Projects() {
  const t = useTranslations('projects')
  const [activeDomain, setActiveDomain] = useState<ProjectDomain | 'all'>('all')
  const reducedMotion = useReducedMotion()

  const handleDomainChange = (domain: ProjectDomain | 'all') => {
    setActiveDomain(domain);
    trackEvent(GA_EVENTS.PROJECT_FILTER_CHANGE, {
      filter_category: domain
    });
  }

  const filteredProjects = sortFeaturedFirst(projects).filter(
    (project) => activeDomain === 'all' || project.domain === activeDomain
  )

  return (
    <section id="projects" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label={t('header.label')}
          title={t('header.title')}
          subtitle={t('header.subtitle')}
        />

        <ProjectFilter activeDomain={activeDomain} onDomainChange={handleDomainChange} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout={!reducedMotion}
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
                transition={{
                  opacity: { duration: 0.2 },
                  layout: { type: 'spring', stiffness: 200, damping: 25 },
                  delay: reducedMotion ? 0 : index * 0.05,
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            {t('noProjects')}
          </div>
        )}
      </div>
    </section>
  )
}
