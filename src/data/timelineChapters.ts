import { TimelineChapter } from "@/types/timeline";

export const timelineChapters: TimelineChapter[] = [
  {
    id: "chapter-foundation",
    order: 1,
    period: "2018–2021",
    accentColor: "#78716C",
    eventIds: ["toparch-mep"],
  },
  {
    id: "chapter-bet",
    order: 2,
    period: "2021–2022",
    accentColor: "#F97316",
    eventIds: ["career-pivot", "toeic-first"],
  },
  {
    id: "chapter-craft",
    order: 3,
    period: "2022–2023",
    accentColor: "#F59E0B",
    eventIds: ["join-maqe", "ap-thai", "peatix-series"],
  },
  {
    id: "chapter-frontier",
    order: 4,
    period: "2023–2024",
    accentColor: "#8B5CF6",
    eventIds: [
      "fedx-guild",
      "token-gating",
      "maqe-website-v5",
      "toeic-second",
      "online-catalog",
    ],
  },
  {
    id: "chapter-intelligence",
    order: 5,
    period: "2024–2025",
    accentColor: "#6366F1",
    eventIds: ["tangier-dao", "ai-event-platform", "aws-certified"],
  },
  {
    id: "chapter-vision",
    order: 6,
    period: "2025–Present",
    accentColor: "#10B981",
    eventIds: [
      "join-teamstack",
      "the-air-product",
      "teamstack-roster",
      "gaia-project",
    ],
  },
  // {
  //   id: 'chapter-acceleration',
  //   order: 7,
  //   period: '2026–Present',
  //   accentColor: '#06B6D4',
  //   eventIds: ['portfolio-refactor'],
  // },
];

export type YearKey = 2018 | 2021 | 2022 | 2023 | 2024 | 2025;

export interface YearTheme {
  period: string;
  gradientFrom: string;
  gradientTo: string;
  spineColor: string;
  dotColor: string;
  accentHex: string;
  accentClass: string;
  bgClass: string;
  labelKey: string;
  tagKey: string;
}

export const YEAR_THEMES: Record<YearKey, YearTheme> = {
  2018: {
    period: "2018–2021",
    gradientFrom: "rgba(120, 113, 108, 0.08)",
    gradientTo: "rgba(168, 162, 158, 0.03)",
    spineColor: "#78716C",
    dotColor: "#A8A29E",
    accentHex: "#78716C",
    accentClass: "text-stone-500",
    bgClass: "from-stone-500/5 via-stone-400/3 to-transparent",
    labelKey: "2018.label",
    tagKey: "2018.tag",
  },
  2021: {
    period: "2021–2022",
    gradientFrom: "rgba(249, 115, 22, 0.08)",
    gradientTo: "rgba(253, 186, 116, 0.03)",
    spineColor: "#F97316",
    dotColor: "#FDBA74",
    accentHex: "#F97316",
    accentClass: "text-orange-500",
    bgClass: "from-orange-500/5 via-orange-400/3 to-transparent",
    labelKey: "2021.label",
    tagKey: "2021.tag",
  },
  2022: {
    period: "2022–2023",
    gradientFrom: "rgba(251, 191, 36, 0.06)",
    gradientTo: "rgba(245, 158, 11, 0.03)",
    spineColor: "#F59E0B",
    dotColor: "#FCD34D",
    accentHex: "#F59E0B",
    accentClass: "text-amber-500",
    bgClass: "from-amber-500/5 via-amber-400/3 to-transparent",
    labelKey: "2022.label",
    tagKey: "2022.tag",
  },
  2023: {
    period: "2023–2024",
    gradientFrom: "rgba(139, 92, 246, 0.06)",
    gradientTo: "rgba(109, 40, 217, 0.03)",
    spineColor: "#8B5CF6",
    dotColor: "#C4B5FD",
    accentHex: "#8B5CF6",
    accentClass: "text-violet-500",
    bgClass: "from-violet-500/5 via-violet-400/3 to-transparent",
    labelKey: "2023.label",
    tagKey: "2023.tag",
  },
  2024: {
    period: "2024–2025",
    gradientFrom: "rgba(99, 102, 241, 0.07)",
    gradientTo: "rgba(67, 56, 202, 0.03)",
    spineColor: "#6366F1",
    dotColor: "#A5B4FC",
    accentHex: "#6366F1",
    accentClass: "text-indigo-500",
    bgClass: "from-indigo-500/6 via-indigo-400/3 to-transparent",
    labelKey: "2024.label",
    tagKey: "2024.tag",
  },
  2025: {
    period: "2025–Present",
    gradientFrom: "rgba(16, 185, 129, 0.06)",
    gradientTo: "rgba(5, 150, 105, 0.03)",
    spineColor: "#10B981",
    dotColor: "#6EE7B7",
    accentHex: "#10B981",
    accentClass: "text-emerald-500",
    bgClass: "from-emerald-500/5 via-emerald-400/3 to-transparent",
    labelKey: "2025.label",
    tagKey: "2025.tag",
  },
  // 2026: {
  //   period: '2026–Present',
  //   gradientFrom: 'rgba(6, 182, 212, 0.06)',
  //   gradientTo: 'rgba(8, 145, 178, 0.03)',
  //   spineColor: '#06B6D4',
  //   dotColor: '#67E8F9',
  //   accentHex: '#06B6D4',
  //   accentClass: 'text-cyan-500',
  //   bgClass: 'from-cyan-500/5 via-cyan-400/3 to-transparent',
  //   labelKey: '2026.label',
  //   tagKey: '2026.tag',
  // },
} as const;
