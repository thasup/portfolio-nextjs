'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type ProjectDomain } from '@/types/project'
import { projects } from '@/data/projects'
import { ProjectCard } from '../projects/ProjectCard'
import { ProjectFilter } from '../projects/ProjectFilter'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Projects() {
  const [activeDomain, setActiveDomain] = useState<ProjectDomain | 'all'>('all')
  const reducedMotion = useReducedMotion()

  const filteredProjects = projects.filter(
    (project) => activeDomain === 'all' || project.domain === activeDomain
  )

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label="MY WORK"
          title="Featured Projects"
          subtitle="Real problems solved with code that shipped to production"
        />

        <ProjectFilter activeDomain={activeDomain} onDomainChange={setActiveDomain} />

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
            No projects found for this category.
          </div>
        )}

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
