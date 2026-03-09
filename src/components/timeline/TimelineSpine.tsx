'use client';

import { useScroll } from 'framer-motion';
import { timelineChapters } from '@/data/timelineChapters';
import { LocalizedText } from '@/components/shared/LocalizedText';

export function TimelineSpine() {
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end']
  });

  return (
    <div className="hidden lg:block w-[2px] bg-border absolute left-0 top-0 bottom-0 overflow-hidden rounded-full">
      <div 
        className="w-full bg-primary relative !scale-x-100"
        style={{ height: '20vh', transform: 'translateY(-100%)', top: 'var(--scroll-y, 0px)' }}
        ref={(el) => {
          if (el) {
            scrollYProgress.on("change", (latest) => {
               el.style.setProperty('--scroll-y', `${latest * 100}%`);
            });
          }
        }}
      />
    </div>
  );
}
