import Image from 'next/image'
import Link from 'next/link'
import { type Project } from '@/types/project'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TechBadge } from '@/components/shared/TechBadge'
import { DomainBadge } from '@/components/shared/DomainBadge'
import { ArrowRight } from 'lucide-react'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md dark:hover:shadow-primary/5">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <CardHeader className="p-5 pb-0">
          <div className="mb-2 flex items-center justify-between">
            <DomainBadge domain={project.domain} />
            <span className="text-xs font-medium text-muted-foreground">{project.year}</span>
          </div>
          <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
            {project.title}
          </h3>
        </CardHeader>
        
        <CardContent className="p-5 pt-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.problemSummary}
          </p>
        </CardContent>
        
        <CardFooter className="flex-col items-start gap-4 p-5 pt-0 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <TechBadge key={tech} name={tech} size="sm" />
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm font-medium text-primary mt-2">
            View Case Study
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
