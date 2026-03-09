"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { YearBackground } from "@/components/timeline/YearBackground";
import { TimelineSpine } from "@/components/timeline/TimelineSpine";
import { TimelineYear } from "@/components/timeline/TimelineYear";
import { TimelineEventCard } from "@/components/timeline/TimelineEventCard";
import { timelineEvents } from "@/data/timelineEvents";
import { YearKey } from "@/data/timelineChapters";
import { trackEvent, GA_EVENTS, TimelineProgressEvent } from "@/lib/analytics";

export function Timeline() {
  const t = useTranslations("timeline");
  const locale = useLocale() as "en" | "th";
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [activeYear, setActiveYear] = useState<YearKey | null>(null);
  const [spineProgress, setSpineProgress] = useState(0);
  const [yearPositions, setYearPositions] = useState<Record<YearKey, number>>({} as Record<YearKey, number>);
  const [totalHeight, setTotalHeight] = useState(0);
  const [milestones, setMilestones] = useState({ 25: false, 50: false, 75: false, 100: false });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setSpineProgress(v);

    // Track analytics milestones
    const percent = Math.round(v * 100);
    if (percent >= 25 && !milestones[25]) {
      trackEvent(GA_EVENTS.TIMELINE_PROGRESS, { percent: 25 });
      setMilestones((prev) => ({ ...prev, 25: true }));
    }
    if (percent >= 50 && !milestones[50]) {
      trackEvent(GA_EVENTS.TIMELINE_PROGRESS, { percent: 50 });
      setMilestones((prev) => ({ ...prev, 50: true }));
    }
    if (percent >= 75 && !milestones[75]) {
      trackEvent(GA_EVENTS.TIMELINE_PROGRESS, { percent: 75 });
      setMilestones((prev) => ({ ...prev, 75: true }));
    }
    if (percent >= 100 && !milestones[100]) {
      trackEvent(GA_EVENTS.TIMELINE_PROGRESS, { percent: 100 });
      setMilestones((prev) => ({ ...prev, 100: true }));
    }
  });

  // Calculate total height for spine
  useEffect(() => {
    if (contentRef.current) {
      setTotalHeight(contentRef.current.scrollHeight);
    }
  }, []);

  // IntersectionObserver for active year detection
  useEffect(() => {
    if (!sectionRef.current) return;

    const years: YearKey[] = [2022, 2023, 2024, 2025];
    const yearElements = years.map((y) =>
      sectionRef.current!.querySelector(`[data-year="${y}"]`)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          const year = Number(visible[0].target.getAttribute("data-year")) as YearKey;
          setActiveYear(year);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    yearElements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Group events by year
  const eventsByYear = timelineEvents.reduce((acc, event) => {
    const year = new Date(event.sortDate).getFullYear() as YearKey;
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<YearKey, typeof timelineEvents>);

  // Sort events within each year by sortDate ascending
  Object.keys(eventsByYear).forEach((year) => {
    eventsByYear[year as unknown as YearKey].sort(
      (a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()
    );
  });

  const years: YearKey[] = [2022, 2023, 2024, 2025];

  const handleYearEnter = useCallback((year: YearKey, offsetTop: number) => {
    setYearPositions((prev) => ({ ...prev, [year]: offsetTop }));
  }, []);

  return (
    <section ref={sectionRef} id="timeline" className="relative section-padding overflow-hidden">
      <YearBackground activeYear={activeYear} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader label={t("label")} title={t("title")} subtitle={t("subtitle")} />

        <div className="flex gap-6 sm:gap-8 lg:gap-12 mt-12 md:mt-16">
          {/* Spine column */}
          <div className="hidden md:block relative shrink-0 w-10">
            <div className="timeline-spine-wrapper">
              <TimelineSpine
                totalHeight={totalHeight}
                scrollProgress={spineProgress}
                activeYear={activeYear}
                yearPositions={yearPositions}
              />
            </div>
          </div>

          {/* Content column */}
          <div ref={contentRef} className="flex-1 min-w-0">
            {years.map((year) => {
              const events = eventsByYear[year] || [];
              if (events.length === 0) return null;

              return (
                <TimelineYear
                  key={year}
                  year={year}
                  events={events}
                  locale={locale}
                  onYearEnter={handleYearEnter}
                >
                  {events.map((event, index) => (
                    <TimelineEventCard
                      key={event.id}
                      event={event}
                      year={year}
                      index={index}
                      locale={locale}
                    />
                  ))}
                </TimelineYear>
              );
            })}

            {/* Vision CTA */}
            <div className="mt-24 md:mt-32 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("visionTitle")}</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                {t("visionDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
