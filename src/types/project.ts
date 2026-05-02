import type { SignalId } from "@/types/content";

export type ProjectDomain = "ai" | "web3" | "ecommerce" | "frontend";

export const DOMAIN_LABELS: Record<ProjectDomain, string> = {
  ai: "AI & LLM",
  web3: "Web3",
  ecommerce: "E-Commerce",
  frontend: "Frontend",
};

export const DOMAIN_COLORS: Record<ProjectDomain, string> = {
  ai: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  web3: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  ecommerce: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  frontend: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export interface Project {
  slug: string;
  domain: ProjectDomain;
  company?: string;
  techStack: string[];
  heroImage: string;
  screenshots?: string[];
  featured: boolean;
  strategicPriority?: number;
  signals?: SignalId[];
  proofRefs?: string[];
  liveUrl?: string;
  sourceUrl?: string;
  year: string;
}
