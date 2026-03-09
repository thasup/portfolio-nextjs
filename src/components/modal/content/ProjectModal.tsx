'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, CheckCircle2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { DomainBadge } from '@/components/shared/DomainBadge';
import { TechBadge } from '@/components/shared/TechBadge';
import { LocalizedText, getLocalizedData } from '@/components/shared/LocalizedText';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { GA_EVENTS, trackEvent } from '@/lib/analytics';
import { useEffect, useRef } from 'react';

export function ProjectModal({ id }: { id: string }) {
  const locale = useLocale();
  const { close } = useModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.slug === id);

  useEffect(() => {
    // Track scroll depth for the modal specifically
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      if (scrollPercentage > 90) {
        trackEvent(GA_EVENTS.MODAL_SCROLL_DEPTH, { modal_id: id, depth: 90 });
        scrollRef.current.removeEventListener('scroll', handleScroll);
      } else if (scrollPercentage > 50) {
        trackEvent(GA_EVENTS.MODAL_SCROLL_DEPTH, { modal_id: id, depth: 50 });
      }
    };

    const elm = scrollRef.current;
    if (elm) {
      elm.addEventListener('scroll', handleScroll, { passive: true });
      return () => elm.removeEventListener('scroll', handleScroll);
    }
  }, [id]);

  if (!project) return <div className="p-8 text-center text-muted-foreground">Project not found</div>;

  const features = locale === 'th' && project.featuresTh && project.featuresTh.length > 0 
    ? project.featuresTh 
    : project.featuresEn;

  const title = getLocalizedData(project, 'title', locale);

  return (
    <div className="flex flex-col h-full relative" ref={scrollRef}>
      {/* Hero Header Area */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] md:aspect-[3/1] bg-muted overflow-hidden shrink-0">
        <Image
          src={project.heroImage}
          alt={`${title} hero graphic`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
          <div className="mb-4">
            <DomainBadge domain={project.domain} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            <LocalizedText en={project.titleEn} th={project.titleTh} />
          </h2>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground text-balance max-w-3xl drop-shadow-sm">
            <LocalizedText en={project.taglineEn} th={project.taglineTh} />
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 md:p-8 lg:p-12 pb-24 flex-grow shrink-0">
        
        {/* Core Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-border">
          <div className="flex flex-wrap gap-2 flex-grow">
             {project.techStack.map((tech) => (
                <TechBadge key={tech} name={tech} />
             ))}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {project.sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild onClick={close}>
              <Link href={`/${locale === 'th' ? 'th/' : ''}projects/${project.slug}`}>
                Full Page <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Narrative Grid */}
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10 border-r-0 lg:border-r lg:border-border lg:pr-12">
            
            <section className="space-y-4">
              <h3 className="text-2xl font-bold"><LocalizedText en="The Challenge" th="โจทย์และปัญหา" /></h3>
              <p className="leading-relaxed text-muted-foreground text-lg">
                <LocalizedText en={project.problemEn} th={project.problemTh} />
              </p>
            </section>
            
            <section className="space-y-4">
              <h3 className="text-2xl font-bold"><LocalizedText en="The Approach" th="แนวทางการแก้ไข" /></h3>
              <p className="leading-relaxed text-muted-foreground text-lg">
                <LocalizedText en={project.approachEn} th={project.approachTh} />
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold"><LocalizedText en="Key Features" th="ฟีเจอร์หลัก" /></h3>
              <ul className="space-y-3">
                {features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start text-muted-foreground">
                    <CheckCircle2 className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="leading-relaxed text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {project.screenshots && project.screenshots.length > 0 && (
              <section className="space-y-6 pt-6">
                <h3 className="text-2xl font-bold"><LocalizedText en="Screenshots" th="ภาพประกอบ" /></h3>
                <ProjectGallery images={project.screenshots} altText={title} />
              </section>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-primary">
                <LocalizedText en="Impact & Outcomes" th="ผลลัพธ์ที่ได้" />
              </h3>
              <p className="leading-relaxed font-medium">
                <LocalizedText en={project.outcomesEn} th={project.outcomesTh} />
              </p>
            </div>
            
            {project.challengesEn && (
              <div className="rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  <LocalizedText en="Technical Challenges" th="ความท้าทายทางเทคนิค" />
                </h3>
                <p className="leading-relaxed text-sm text-muted-foreground">
                  <LocalizedText en={project.challengesEn} th={project.challengesTh} />
                </p>
              </div>
            )}
            
            <div className="rounded-xl bg-card border border-border p-6 shadow-sm hidden md:block">
              <div className="text-sm text-muted-foreground mb-1"><LocalizedText en="Year Delivered" th="ปีที่ส่งมอบ" /></div>
              <div className="text-2xl font-medium">{project.year}</div>
            </div>
            
            <Button variant="secondary" className="w-full sm:hidden" asChild onClick={close}>
              <Link href={`/${locale === 'th' ? 'th/' : ''}projects/${project.slug}`}>
                <LocalizedText en="View Full Page Version" th="ดูหน้ารายละเอียดเต็ม" /> <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </aside>
        </div>

      </div>
    </div>
  );
}
