import { useTranslations, useLocale } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SkillBar } from "@/components/shared/SkillBar";
import { skillClusters } from "@/data/skills";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Skills() {
  const t = useTranslations("skills");
  const locale = useLocale();

  return (
    <section id="skills" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-8 md:grid-cols-2">
          {skillClusters
            .sort((a, b) => a.order - b.order)
            .map((cluster, index) => (
              <ScrollReveal key={cluster.id} delay={index * 0.1}>
                <div
                  className={cn(
                    "card h-full flex flex-col",
                    cluster.emphasized
                      ? "border-[var(--color-ink-2)] shadow-sm"
                      : "",
                  )}
                >
                  <div className="p-6 pb-4">
                    <h3 className="font-display text-xl flex items-center gap-2 text-[var(--color-ink)] mb-2">
                      {t(cluster.labelKey)}
                      {cluster.emphasized && (
                        <span className="flex h-2 w-2 rounded-full bg-[var(--color-praxis-accent)]" />
                      )}
                    </h3>
                    {cluster.statusKey && t.has(cluster.statusKey) && (
                      <div className="mb-2">
                        <span className="rounded-full border border-[var(--color-line)] px-2 py-1 text-[11px] text-[var(--color-ink-3)]">
                          {t(cluster.statusKey)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-[var(--color-ink-2)]">
                      {t(cluster.descriptionKey)}
                    </p>
                  </div>
                  <div className="p-6 pt-0 grid gap-5 flex-1 content-start">
                    <div className="grid gap-4">
                      {cluster.skills.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <SkillBar name={skill.name} level={skill.level} />
                          {skill.tagKey && (
                            <span className="text-[10px] text-[var(--color-ink-3)] uppercase tracking-wider block pl-1">
                              {t(skill.tagKey)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {cluster.evidenceRefs &&
                      cluster.evidenceRefs.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 mt-auto">
                          {cluster.evidenceRefs.map((ref) => (
                            <Link
                              key={ref}
                              href={`${locale === "th" ? "/th" : ""}/projects/${ref}`}
                              className="rounded-full border border-[var(--color-line)] px-2 py-1 text-[11px] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
                            >
                              {ref}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
}
