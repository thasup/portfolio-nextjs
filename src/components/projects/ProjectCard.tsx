'use client'

import Image from 'next/image'
import { type Project } from '@/types/project'
import { TechBadge } from '@/components/shared/TechBadge'
import { DomainBadge } from '@/components/shared/DomainBadge'
import { ArrowRight } from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import { useTranslations } from 'next-intl'
import { getSignalLabel } from '@/lib/content'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { open } = useModal()
  const t = useTranslations('projects.' + project.slug)
  const labelsT = useTranslations('projects.labels')

  const tRoot = useTranslations()
  const title = t('title')
  const tagline = t('tagline')
  const problemSummary = t('problemSummary')
  const whatIOwned = t.raw('whatIOwned')
  
  const signalKeys = (project.signals ?? []).slice(0, 3).map((signal) =>
    getSignalLabel(signal)
  )

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    open({ type: 'project', id: project.slug });
  };

  return (
    <div 
      onClick={handleClick} 
      className="group block h-full cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open({ type: 'project', id: project.slug });
        }
      }}
    >
      <div className="card h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-[var(--color-ink-2)]">
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--color-line-soft)] bg-[var(--color-paper-2)]">
          <Image
            src={project.heroImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <DomainBadge domain={project.domain} />
              {signalKeys.map((key) => (
                <span key={key} className="rounded-full border border-[var(--color-line)] px-2 py-1 text-[10px] text-[var(--color-ink-3)]">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {tRoot(key as any)}
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-[var(--color-ink-3)]">{project.year}</span>
          </div>
          
          <h3 className="font-display text-xl font-medium tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-praxis-accent)]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-ink-2)]">
            {tagline}
          </p>
        
          <div className="mt-4 space-y-4">
            <p className="line-clamp-3 text-sm text-[var(--color-ink-3)]">
              {problemSummary}
            </p>
            {whatIOwned && (
              <div className="card inset p-3">
                <div className="eyebrow mb-1">
                  {labelsT('whatIOwned')}
                </div>
                <p className="text-sm text-[var(--color-ink-2)]">{whatIOwned}</p>
              </div>
            )}
          </div>
          
          <div className="flex-col items-start gap-4 pt-5 mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map((tech) => (
                <TechBadge key={tech} name={tech} size="sm" />
              ))}
              {project.techStack.length > 3 && (
                <span className="text-[10px] text-[var(--color-ink-3)] px-1 py-0.5">
                  +{project.techStack.length - 3} {labelsT('more')}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm font-medium text-[var(--color-praxis-accent)] mt-3">
              {labelsT('viewCaseStudy')}
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
