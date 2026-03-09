'use client';

import { useRef, useEffect } from 'react';
import { trackEvent, GA_EVENTS } from '@/lib/analytics';
import { LocalizedText } from '@/components/shared/LocalizedText';
import { type TimelineChapter } from '@/types/timeline';

export function ChapterBreak({ chapter, index }: { chapter: TimelineChapter; index: number }) {
  const breakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent(GA_EVENTS.TIMELINE_SCENE_ENTER, {
              scene_id: chapter.id,
              scene_type: 'chapter',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (breakRef.current) observer.observe(breakRef.current);
    return () => observer.disconnect();
  }, [chapter.id]);

  return (
    <div 
      ref={breakRef}
      className="relative flex min-h-[50vh] flex-col items-center justify-center py-24 my-24 border-y border-border/10 bg-gradient-to-b from-transparent via-primary/5 to-transparent text-center px-4"
    >
      <div className="absolute text-[12rem] md:text-[20rem] font-bold text-primary/5 pointer-events-none select-none tracking-tighter leading-none -z-10 blur-sm">
        0{index + 1}
      </div>
      <div className="z-10 max-w-2xl px-4 py-8 rounded-3xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
          <LocalizedText en={chapter.titleEn} th={chapter.titleTh} />
        </h2>
        <div className="inline-flex mb-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold tracking-wider uppercase">
          {chapter.period}
        </div>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed text-balance">
          <LocalizedText en={chapter.descriptionEn} th={chapter.descriptionTh} />
        </p>
      </div>
    </div>
  );
}
