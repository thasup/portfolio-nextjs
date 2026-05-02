"use client";

import { useTranslations } from "next-intl";
import { capabilities } from "@/data/tech-capabilities";
import { CapabilityCard } from "@/components/sections/TechCapabilities/CapabilityCard";
import { SectionHeader } from "@/components/shared/SectionHeader";

// SYSTEM THINKING LAYERS
// User Experience → System Architecture → Intelligence → Business Impact
const LAYERS = [
  "User Experience",
  "System Architecture",
  "Intelligence",
  "Business Impact",
];

export function TechCapabilities() {
  const t = useTranslations("tech");

  return (
    <section id="skills" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label={t("label")}
          title={t("sectionTitle")}
          subtitle={t("subtitle")}
        >
          {/* Layer pills above header */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
            aria-label="Capability layers"
          >
            {LAYERS.map((layer, i) => (
              <span key={layer} className="flex items-center gap-2">
                <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {layer}
                </span>
                {i < LAYERS.length - 1 && (
                  <span
                    className="text-xs text-muted-foreground/40"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </SectionHeader>

        {/* Cards — 2-column grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.id} capability={cap} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
