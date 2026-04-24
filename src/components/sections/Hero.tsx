"use client";

import Link from "next/link";
import { default as NextImage } from "next/image";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/siteConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslations } from "next-intl";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const t = useTranslations("hero");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const Wrapper = reducedMotion ? "div" : motion.div;

  return (
    <section
      id="hero"
      className="relative flex min-h-[70vh] items-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Wrapper
          {...(!reducedMotion && {
            variants: containerVariants,
            initial: "hidden",
            animate: "visible"
          })}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Text content */}
          <div>
            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <span className="mb-4 inline-flex items-center gap-2 eyebrow px-3 py-1 bg-[var(--color-paper-2)] border border-[var(--color-line-soft)] rounded-full text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("availability")}
              </span>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <p className="eyebrow text-[var(--color-praxis-accent)]">
                {t("intro")}
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-[var(--color-ink)]">
                {t("roleLine")}
              </h1>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-6 max-w-2xl space-y-4">
                <p className="text-base leading-relaxed text-[var(--color-ink-2)] md:text-xl">
                  {t("tagline")}
                </p>
                <div className="max-w-xl card inset px-5 py-4">
                  <p className="text-sm font-medium text-[var(--color-ink)] md:text-base">
                    {t("proofHeadline")}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-3)] md:text-base">
                    {t("proofSubheadline")}
                  </p>
                </div>
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="space-y-2">
                  <Link href="/#projects" className="btn primary lg">
                    {t("ctaPrimary")}
                  </Link>
                  <p className="text-xs text-[var(--color-ink-4)] mt-2">{t("ctaPrimaryHint")}</p>
                </div>
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <p className="mt-8 text-sm font-medium text-[var(--color-ink-3)] md:text-base">
                {t("directionLine")}
              </p>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[t("trust1"), t("trust2")].map((item) => (
                  <div
                    key={item}
                    className="card px-4 py-3 text-sm text-[var(--color-ink-2)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Wrapper>

            <Wrapper {...(!reducedMotion && { variants: itemVariants })}>
              <div className="mt-8 flex gap-3">
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="rounded-md p-2 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </Wrapper>
          </div>

          {/* Avatar */}
          <Wrapper
            {...(!reducedMotion && { variants: itemVariants })}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-linear-to-br from-[var(--color-praxis-accent-soft)] via-[var(--color-ai-soft)] to-[var(--color-praxis-accent-soft)] blur-2xl" />
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-[3px] border-[var(--color-line)] bg-[var(--color-paper-2)] sm:h-80 sm:w-80">
                <NextImage
                  src={siteConfig.avatarImage}
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 256px, 320px"
                  priority
                />
              </div>
            </div>
          </Wrapper>
        </Wrapper>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <motion.div
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[var(--color-ink-4)]"
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
