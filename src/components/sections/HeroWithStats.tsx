"use client";

import { Hero } from "./Hero";
import { ValueStrip } from "./ValueStrip";
import type { GitHubStats } from "@/lib/github";

interface HeroWithStatsProps {
  githubStats?: GitHubStats | null;
}

export function HeroWithStats({ githubStats }: HeroWithStatsProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col">
        <Hero />
      </div>
      <ValueStrip githubStats={githubStats} />
    </div>
  );
}
