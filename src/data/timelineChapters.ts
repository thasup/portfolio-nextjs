import { TimelineChapter } from '@/types/timeline';

export const timelineChapters: TimelineChapter[] = [
  {
    id: "chapter-1-pivot",
    order: 1,
    titleEn: "The Pivot",
    titleTh: "จุดเปลี่ยน",
    descriptionEn: "Leaving mechanical engineering to build software from the ground up.",
    descriptionTh: "ก้าวออกจากวิศวกรรมเครื่องกลสู่การพัฒนาซอฟต์แวร์เต็มตัว",
    period: "2019–2021",
    accentColor: "#f59e0b",
    eventIds: ["ap-thai"]
  },
  {
    id: "chapter-2-craft",
    order: 2,
    titleEn: "The Craft",
    titleTh: "การขัดเกลาฝีมือ",
    descriptionEn: "Mastering frontend architecture and delivering scaled applications.",
    descriptionTh: "เรียนรู้สถาปัตยกรรม Frontend และส่งมอบแอปพลิเคชันระดับสเกล",
    period: "2021–2022",
    accentColor: "#3b82f6",
    eventIds: ["kmitl"]
  },
  {
    id: "chapter-3-frontier",
    order: 3,
    titleEn: "The Frontier",
    titleTh: "พรมแดนใหม่",
    descriptionEn: "Exploring Web3, DAOs, and decentralized application development.",
    descriptionTh: "สำรวจ Web3, DAO, และการพัฒนาแอปพลิเคชันแบบกระจายศูนย์",
    period: "2022–2023",
    accentColor: "#8b5cf6",
    eventIds: ["tangier-dao"]
  },
  {
    id: "chapter-4-intelligence",
    order: 4,
    titleEn: "The Intelligence Layer",
    titleTh: "การตื่นตัวของ AI",
    descriptionEn: "Integrating LLMs and AI services into production products.",
    descriptionTh: "ผสานรวม LLM และบริการ AI เข้าสู่ผลิตภัณฑ์จริง",
    period: "2023–2024",
    accentColor: "#10b981",
    eventIds: ["happily-ai-event"]
  },
  {
    id: "chapter-5-vision",
    order: 5,
    titleEn: "The Vision",
    titleTh: "วิสัยทัศน์",
    descriptionEn: "Stepping into Product Ownership to align engineering with business goals.",
    descriptionTh: "ก้าวเข้าสู่บทบาท Product Owner เพื่อผสานวิศวกรรมเข้ากับเป้าหมายทางธุรกิจ",
    period: "2024–Present",
    accentColor: "#ec4899",
    eventIds: ["maqe"]
  }
];

export type YearKey = 2022 | 2023 | 2024 | 2025;

export interface YearTheme {
  label: string;
  labelTh: string;
  gradientFrom: string;
  gradientTo: string;
  spineColor: string;
  dotColor: string;
  accentHex: string;
  accentClass: string;
  bgClass: string;
}

export const YEAR_THEMES: Record<YearKey, YearTheme> = {
  2022: {
    label: "The Foundation",
    labelTh: "รากฐาน",
    gradientFrom: "rgba(251, 191, 36, 0.06)",
    gradientTo: "rgba(245, 158, 11, 0.03)",
    spineColor: "#F59E0B",
    dotColor: "#FCD34D",
    accentHex: "#F59E0B",
    accentClass: "text-amber-500",
    bgClass: "from-amber-500/5 via-amber-400/3 to-transparent",
  },
  2023: {
    label: "The Frontier",
    labelTh: "พรมแดนใหม่",
    gradientFrom: "rgba(139, 92, 246, 0.06)",
    gradientTo: "rgba(109, 40, 217, 0.03)",
    spineColor: "#8B5CF6",
    dotColor: "#C4B5FD",
    accentHex: "#8B5CF6",
    accentClass: "text-violet-500",
    bgClass: "from-violet-500/5 via-violet-400/3 to-transparent",
  },
  2024: {
    label: "The Intelligence Layer",
    labelTh: "ชั้น Intelligence",
    gradientFrom: "rgba(99, 102, 241, 0.07)",
    gradientTo: "rgba(67, 56, 202, 0.03)",
    spineColor: "#6366F1",
    dotColor: "#A5B4FC",
    accentHex: "#6366F1",
    accentClass: "text-indigo-500",
    bgClass: "from-indigo-500/6 via-indigo-400/3 to-transparent",
  },
  2025: {
    label: "The Vision",
    labelTh: "วิสัยทัศน์",
    gradientFrom: "rgba(16, 185, 129, 0.06)",
    gradientTo: "rgba(5, 150, 105, 0.03)",
    spineColor: "#10B981",
    dotColor: "#6EE7B7",
    accentHex: "#10B981",
    accentClass: "text-emerald-500",
    bgClass: "from-emerald-500/5 via-emerald-400/3 to-transparent",
  },
} as const;
