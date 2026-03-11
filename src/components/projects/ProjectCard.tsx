'use client'

import Image from 'next/image'
import { type Project } from '@/types/project'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TechBadge } from '@/components/shared/TechBadge'
import { DomainBadge } from '@/components/shared/DomainBadge'
import { ArrowRight } from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import { LocalizedText, getLocalizedData } from '@/components/shared/LocalizedText'
import { useLocale } from 'next-intl'
import { getSignalLabel } from '@/lib/content'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { open } = useModal()
  const locale = useLocale()

  const title = getLocalizedData(project, 'title', locale);
  const problemSummary = locale === 'th' ? project.problemSummaryTh : project.problemSummaryEn;
  const tagline = getLocalizedData(project, 'tagline', locale);
  const whatIOwned = locale === 'th' ? project.whatIOwnedTh : project.whatIOwnedEn;
  const signalLabels = (project.signals ?? []).slice(0, 3).map((signal) =>
    getSignalLabel(signal, locale === 'th' ? 'th' : 'en')
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
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md dark:hover:shadow-primary/5">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={project.heroImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <CardHeader className="p-5 pb-0">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <DomainBadge domain={project.domain} />
              {signalLabels.map((label) => (
                <span key={label} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">
                  {label}
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{project.year}</span>
          </div>
          <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {tagline}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 p-5 pt-3">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {problemSummary}
          </p>
          {whatIOwned && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <LocalizedText en="What I Owned" th="สิ่งที่ผมเป็นเจ้าของ" />
              </div>
              <p className="text-sm">{whatIOwned}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col items-start gap-4 p-5 pt-0 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <TechBadge key={tech} name={tech} size="sm" />
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                +{project.techStack.length - 3} <LocalizedText en="more" th="อื่นๆ" />
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm font-medium text-primary mt-2">
            <LocalizedText en="View Case Study" th="ดูรายละเอียดโปรเจกต์" />
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
