"use client";

import { motion } from "framer-motion";
import { YearKey, YEAR_THEMES } from "@/data/timelineChapters";

interface TimelineSpineProps {
  totalHeight: number;
  scrollProgress: number;
  activeYear: YearKey | null;
  yearPositions: Record<YearKey, number>;
}

export function TimelineSpine({
  totalHeight,
  scrollProgress,
  activeYear,
  yearPositions,
}: TimelineSpineProps) {
  const years = Object.keys(YEAR_THEMES).map(Number) as YearKey[];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="relative w-1" style={{ height: `${totalHeight}px` }}>
      {/* Background track */}
      <div className="absolute inset-x-0 top-0 bottom-0 w-1 bg-border rounded-full" />

      {/* Animated fill */}
      <motion.div
        className="absolute inset-x-0 top-0 w-1 rounded-full origin-top"
        style={{
          scaleY: scrollProgress,
          backgroundColor: activeYear ? YEAR_THEMES[activeYear].spineColor : "#6366F1",
        }}
      />

      {/* Traveling dot - hidden on mobile */}
      {!isMobile && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg"
          style={{
            top: `${scrollProgress * totalHeight}px`,
            backgroundColor: activeYear ? YEAR_THEMES[activeYear].dotColor : "#A5B4FC",
            boxShadow: activeYear
              ? `0 0 12px ${YEAR_THEMES[activeYear].dotColor}`
              : "0 0 12px #A5B4FC",
          }}
        />
      )}

      {/* Year markers */}
      {years.map((year) => {
        const position = yearPositions[year] || 0;
        const theme = YEAR_THEMES[year];
        const isActive = activeYear === year;

        return (
          <div
            key={year}
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-300"
            style={{ top: `${position}px` }}
          >
            <div
              className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                isActive ? "scale-150" : "scale-100"
              }`}
              style={{
                backgroundColor: isActive ? theme.spineColor : "transparent",
                borderColor: theme.spineColor,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
