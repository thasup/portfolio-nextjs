import type { SignalId } from "@/types/content";

export type TimelineEventType =
  | "work"
  | "project"
  | "education"
  | "achievement"
  | "learning"
  | "milestone";

export interface TimelineChapter {
  id: string;
  order: number;
  period: string;
  accentColor: string;
  eventIds: string[];
}

export interface MediaLink {
  type: "image" | "video" | "link";
  url: string;
}

export interface TimelineEvent {
  id: string;
  chapterId: string;
  date: string;
  sortDate: string;
  company: string;
  type: TimelineEventType;
  skills: string[];
  featured: boolean;
  signals?: SignalId[];
  testimonialRef?: string;
  duration?: string;
  mediaLinks?: MediaLink[];
  icon?: string;
  tech?: string[];
}
