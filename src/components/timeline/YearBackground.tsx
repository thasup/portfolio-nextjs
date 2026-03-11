"use client";

import { motion } from "framer-motion";
import { YearKey, YEAR_THEMES } from "@/data/timelineChapters";

interface YearBackgroundProps {
  activeYear: YearKey | null;
}

export function YearBackground({ activeYear }: YearBackgroundProps) {
  const years: YearKey[] = [2018, 2021, 2022, 2023, 2024, 2025];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {years.map((year) => {
        const theme = YEAR_THEMES[year];
        return (
          <motion.div
            key={year}
            className="absolute inset-0"
            animate={{ opacity: activeYear === year ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${theme.gradientFrom}, ${theme.gradientTo} 40%, transparent 70%)`,
            }}
          />
        );
      })}
    </div>
  );
}
