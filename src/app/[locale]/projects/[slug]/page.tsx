import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { projects } from '@/data/projects'
import { siteConfig } from '@/data/siteConfig'
import { DomainBadge } from '@/components/shared/DomainBadge'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { ProjectMeta } from '@/components/projects/ProjectMeta'
import { LocalizedText, getLocalizedData } from '@/components/shared/LocalizedText'

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  const title = getLocalizedData(project, 'title', locale);
  const tagline = getLocalizedData(project, 'tagline', locale);

  return {
    title: `${title} | Projects | ${siteConfig.name}`,
    description: tagline,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const project = projects.find((p) => p.slug === slug)
  
  if (!project) {
    notFound()
  }

  const features = locale === 'th' && project.featuresTh && project.featuresTh.length > 0 
    ? project.featuresTh 
    : project.featuresEn;

  const title = getLocalizedData(project, 'title', locale);
  const problem = getLocalizedData(project, 'problem', locale);
  const approach = getLocalizedData(project, 'approach', locale);
  const outcomes = getLocalizedData(project, 'outcomes', locale);
  const challenges = getLocalizedData(project, 'challenges', locale);

  return (
    <article className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Back Link */}
        <Link 
          href="/#projects" 
          className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all projects
        </Link>
        
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4">
            <DomainBadge domain={project.domain} />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
            <LocalizedText en={project.titleEn} th={project.titleTh} />
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl text-balance max-w-3xl">
            <LocalizedText en={project.taglineEn} th={project.taglineTh} />
          </p>
        </header>
        
        {/* Hero Image */}
        <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={project.heroImage}
            alt={`${title} hero graphic`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Context/Problem */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">The Challenge</h2>
              <p className="leading-relaxed text-muted-foreground text-lg">
                {problem}
              </p>
            </section>
            
            {/* Approach */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">The Approach</h2>
              <p className="leading-relaxed text-muted-foreground text-lg">
                {approach}
              </p>
            </section>

            {/* Key Features */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Key Features</h2>
              <ul className="space-y-3">
                {features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start text-muted-foreground">
                    <CheckCircle2 className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="leading-relaxed text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Gallery */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">Screenshots</h2>
                <ProjectGallery images={project.screenshots} altText={title} />
              </section>
            )}

            {/* Outcomes & Challenges */}
            <section className="space-y-4 rounded-xl border-l-4 border-l-primary bg-primary/5 p-6 md:p-8">
              <h2 className="text-2xl font-bold">Impact & Outcomes</h2>
              <p className="leading-relaxed font-medium text-lg">
                {outcomes}
              </p>
              {project.challengesEn && (
                <>
                  <h3 className="text-xl font-bold mt-6 mb-2">Technical Challenges</h3>
                  <p className="leading-relaxed text-muted-foreground text-lg">
                    {challenges}
                  </p>
                </>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <ProjectMeta project={project} />
          </aside>
        </div>
      </div>
    </article>
  )
}
