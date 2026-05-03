"use client";

import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SkillBarProps {
  name: string;
  level: number;
  icon?: string;
}

export function SkillBar({ name, level }: SkillBarProps) {
  const { ref, inView } = useInView();
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name}: ${level}%`}
      >
        <div
          className={cn(
            "h-full rounded-full bg-primary",
            !reducedMotion && "transition-all duration-1000 ease-out",
          )}
          style={{
            width: inView || reducedMotion ? `${level}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}
