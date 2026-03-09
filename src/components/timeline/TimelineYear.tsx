"use client";

import { useEffect, useRef } from "react";
import { YearKey, YEAR_THEMES } from "@/data/timelineChapters";
import type { TimelineEvent } from "@/types/timeline";

interface TimelineYearProps {
  year: YearKey;
  events: TimelineEvent[];
  locale: "en" | "th";
  onYearEnter: (year: YearKey, offsetTop: number) => void;
  children: React.ReactNode;
}

export function TimelineYear({
  year,
  events,
  locale,
  onYearEnter,
  children,
}: TimelineYearProps) {
  const yearRef = useRef<HTMLDivElement>(null);
  const theme = YEAR_THEMES[year];

  useEffect(() => {
    if (yearRef.current) {
      const offsetTop = yearRef.current.offsetTop;
      onYearEnter(year, offsetTop);
    }
  }, [year, onYearEnter]);

  const yearLabel = locale === "th" ? theme.labelTh : theme.label;

  return (
    <div ref={yearRef} data-year={year} className="relative mb-24 md:mb-32">
      <div className="mb-12 md:mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <h2
            className="year-numeral opacity-10"
            style={{ color: theme.accentHex }}
          >
            {year}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="h-0.5 w-12"
            style={{ backgroundColor: theme.accentHex }}
          />
          <h3 className={`text-xl md:text-2xl font-bold ${theme.accentClass}`}>
            {yearLabel}
          </h3>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">{children}</div>
    </div>
  );
}
