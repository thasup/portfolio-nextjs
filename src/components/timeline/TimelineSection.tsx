'use client';

import { useRef, useEffect, useState } from 'react';
import { trackEvent, GA_EVENTS } from '@/lib/analytics';
import { timelineEvents } from '@/data/timelineEvents';
import { timelineChapters } from '@/data/timelineChapters';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TimelineSpine } from './TimelineSpine';
import { ChapterBreak } from './ChapterBreak';
import { EventScene } from './EventScene';
import { LocalizedText } from '@/components/shared/LocalizedText';

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // F004 timeline progress mapping
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, bottom, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled through the section
      // 0 = section top hits window bottom, 1 = section bottom hits window top
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - top) / (height + windowHeight)));
      const percentage = Math.round(scrollProgress * 100);

      // We really want to fire only once per quartile, but for simplicity, we mock state
      // Realistically we'd use a dedicated hook for progress intervals (25, 50, 75, 100)
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="timeline" className="relative min-h-screen pt-32 pb-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <SectionHeader
          label={<LocalizedText en="MY TIMELINE" th="ช่วงเวลา" />}
          title={<LocalizedText en="Career Journey" th="เส้นทางการทำงาน" />}
          subtitle={<LocalizedText en="4 years of building across AI, Web3, e-commerce, and frontend" th="ประสบการณ์ 4 ปีเต็ม จากระบบ e-commerce ปัจจุบันสู่โลก AI" />}
        />

        <div className="relative mt-24" ref={containerRef}>
          <TimelineSpine />

          <div className="lg:pl-8 xl:pl-16 space-y-0">
             {timelineChapters.map((chapter, chapterIdx) => {
                const chapterEvents = timelineEvents.filter(e => e.chapterId === chapter.id);

                return (
                  <div key={chapter.id} className="relative">
                     <ChapterBreak chapter={chapter} index={chapterIdx} />
                     <div className="flex flex-col gap-0 md:gap-12">
                       {chapterEvents.map((event, eventIdx) => (
                         <EventScene key={event.id} event={event} index={eventIdx} />
                       ))}
                     </div>
                  </div>
                )
             })}
          </div>
        </div>
      </div>
    </section>
  );
}
