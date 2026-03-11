"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Code2, Trophy, BookOpen, Rocket, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TimelineEvent } from "@/types/timeline";
import { YearKey, YEAR_THEMES } from "@/data/timelineChapters";
import { useModal } from "@/hooks/useModal";
import { trackEvent, GA_EVENTS } from "@/lib/analytics";
import { getSignalLabel } from "@/lib/content";

interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  labelTh: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  work: {
    icon: Briefcase,
    label: "Work",
    labelTh: "งาน",
  },
  project: {
    icon: Code2,
    label: "Project",
    labelTh: "โปรเจกต์",
  },
  achievement: {
    icon: Trophy,
    label: "Achievement",
    labelTh: "ความสำเร็จ",
  },
  education: {
    icon: BookOpen,
    label: "Learning",
    labelTh: "การเรียนรู้",
  },
  learning: {
    icon: BookOpen,
    label: "Learning",
    labelTh: "การเรียนรู้",
  },
  milestone: {
    icon: Rocket,
    label: "Milestone",
    labelTh: "จุดสำคัญ",
  },
};

interface TimelineEventCardProps {
  event: TimelineEvent;
  year: YearKey;
  index: number;
  locale: "en" | "th";
}

type RingColorStyle = React.CSSProperties & {
  "--tw-ring-color": string;
};

export function TimelineEventCard({
  event,
  year,
  index,
  locale,
}: TimelineEventCardProps) {
  const t = useTranslations("timeline");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { open } = useModal();

  const handleDeepDive = () => {
    // Track analytics
    const eventYear = new Date(event.sortDate).getFullYear();
    trackEvent(GA_EVENTS.TIMELINE_DEEPDIVE_OPEN, {
      event_id: event.id,
      event_title: event.titleEn,
      year: eventYear,
      event_type: event.type,
    });

    // Open modal
    open({ type: "timeline-event", id: event.id });

    // Update URL hash
    window.location.hash = `timeline-event-${event.id}`;
  };
  
  const theme = YEAR_THEMES[year];
  const category = CATEGORY_CONFIG[event.type];
  const Icon = category?.icon || Code2;

  const title = locale === "th" && event.titleTh ? event.titleTh : event.titleEn;
  const summary = locale === "th" && event.summaryTh ? event.summaryTh : event.summaryEn;
  const impact = locale === "th" && event.impactTh ? event.impactTh : event.impactEn;
  const capabilityGained =
    locale === "th" && event.capabilityGainedTh ? event.capabilityGainedTh : event.capabilityGainedEn;
  const categoryLabel = locale === "th" ? category?.labelTh : category?.label;
  const signalLabels = (event.signals ?? []).slice(0, 3).map((signal) => getSignalLabel(signal, locale));

  const displayedSkills = event.skills.slice(0, 5);
  const remainingCount = event.skills.length - 5;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-xl border bg-card/60 backdrop-blur-sm p-6 timeline-card-hover ring-1`}
      style={{
        borderColor: `${theme.accentHex}40`,
        "--tw-ring-color": `${theme.accentHex}30`,
      } as RingColorStyle}
    >
      {/* Glow strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{
          background: `linear-gradient(to right, transparent, ${theme.accentHex}, transparent)`,
        }}
      />

      {/* Category badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: `${theme.accentHex}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: theme.accentHex }} />
        </div>
        <span
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: theme.accentHex }}
        >
          {categoryLabel}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">{event.date}</span>
      </div>

      {/* Title and company */}
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{event.company}</p>

      {/* Summary */}
      <p className="text-sm mb-3 leading-relaxed">{summary}</p>

      {capabilityGained && (
        <div className="mb-3 text-sm">
          <span className="font-medium" style={{ color: theme.accentHex }}>
            {t("eventCard.capability")}{" "}
          </span>
          <span className="text-muted-foreground">{capabilityGained}</span>
        </div>
      )}

      {/* Impact */}
      {impact && (
        <div
          className="rounded-lg p-3 mb-4 text-sm"
          style={{ backgroundColor: `${theme.accentHex}08` }}
        >
          <span className="font-medium" style={{ color: theme.accentHex }}>
            {t("eventCard.evidence")}{" "}
          </span>
          {impact}
        </div>
      )}

      {signalLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {signalLabels.map((label) => (
            <span
              key={label}
              className="px-2 py-1 text-[11px] rounded-full border text-muted-foreground"
              style={{ borderColor: `${theme.accentHex}35` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Tech badges */}
      {event.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {displayedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs rounded-md bg-muted/50 text-foreground"
            >
              {skill}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground">
              +{remainingCount}
            </span>
          )}
        </div>
      )}

      {/* Deep Dive button */}
      <button
        onClick={handleDeepDive}
        className="text-sm font-medium hover:underline transition-colors cursor-pointer"
        style={{ color: theme.accentHex }}
      >
        {t("deepDive")}
      </button>
    </motion.div>
  );
}
