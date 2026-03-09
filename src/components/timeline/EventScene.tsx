'use client';

import { useRef, useEffect } from 'react';
import { useModal } from '@/hooks/useModal';
import { trackEvent, GA_EVENTS } from '@/lib/analytics';
import { LocalizedText } from '@/components/shared/LocalizedText';
import { type TimelineEvent } from '@/types/timeline';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Calendar } from 'lucide-react';
import { TechBadge } from '@/components/shared/TechBadge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function EventScene({ event, index }: { event: TimelineEvent; index: number }) {
  const { open } = useModal();
  const sceneRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent(GA_EVENTS.TIMELINE_SCENE_ENTER, {
              scene_id: event.id,
              scene_type: 'event',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, [event.id]);

  const onDeepDive = () => {
    open({ type: 'timeline-event', id: event.id });
  };

  return (
    <div 
      ref={sceneRef}
      className={cn(
        "min-h-[70vh] flex flex-col justify-center py-16 lg:py-24 relative z-10",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      {/* Content Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-16 xl:px-24">
        <div className="mb-4 flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
          <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {event.company}</span>
        </div>
        
        <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground text-balance">
          <LocalizedText en={event.titleEn} th={event.titleTh} />
        </h3>

        <div className="mb-8 p-4 rounded-xl bg-card border border-border shadow-sm">
           <p className="text-muted-foreground text-lg leading-relaxed text-balance">
             <LocalizedText en={event.summaryEn} th={event.summaryTh} />
           </p>
        </div>

        {event.skills && (
          <div className="flex flex-wrap gap-2 mb-8">
            {event.skills.slice(0, 4).map(skill => (
              <TechBadge key={skill} name={skill} />
            ))}
            {event.skills.length > 4 && (
              <span className="text-xs text-muted-foreground flex items-center px-2">
                +{event.skills.length - 4} <LocalizedText en="more" th="อื่นๆ" />
              </span>
            )}
          </div>
        )}

        <div>
          <Button onClick={onDeepDive} size="lg" className="w-full sm:w-auto font-semibold group rounded-full">
            <LocalizedText en="Deep Dive" th="อ่านเจาะลึก" />
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Art Column */}
      <div className="w-full lg:w-1/2 mt-12 lg:mt-0 px-4 lg:px-12 flex items-center justify-center">
         <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden bg-muted/30 border border-border/50 group cursor-pointer transition-transform hover:scale-105 duration-500 ease-out" onClick={onDeepDive}>
             {/* Abstract SVG art or subtle visual representing the phase */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 flex items-center justify-center text-primary/20 mix-blend-multiply dark:mix-blend-screen">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-2/3 h-2/3 opacity-50 transform rotate-12 group-hover:rotate-6 transition-transform duration-700">
                    <path fill="currentColor" d="M42.7,-73.4C55.9,-67.2,67.5,-56.3,76.4,-43.3C85.3,-30.3,91.5,-15.1,91.6,0.1C91.7,15.3,85.7,30.5,76.5,43.2C67.3,55.9,54.8,66.1,40.9,72C27,77.9,11.8,79.5,-3.6,83.1C-19,86.7,-38,92.3,-52.4,86.8C-66.8,81.3,-76.6,64.7,-82.9,48.2C-89.2,31.7,-92,15.8,-91.1,0.5C-90.2,-14.8,-85.6,-29.6,-77.6,-41.8C-69.6,-54,-58.2,-63.6,-45.5,-70.2C-32.8,-76.8,-18.8,-80.4,-3.3,-76.5C12.2,-72.6,29.5,-79.6,42.7,-73.4Z" transform="translate(100 100)" />
                 </svg>
             </div>
             
             {/* Hover overlay hint */}
             <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background/90 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                 <span className="text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
                     <LocalizedText en="Explore Detail" th="เปิดหน้ารายละเอียด" /> 
                     <ArrowRight className="w-4 h-4" />
                 </span>
             </div>
         </div>
      </div>
    </div>
  );
}
