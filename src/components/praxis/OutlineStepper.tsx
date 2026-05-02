"use client";

/**
 * Lightweight vertical indicator for the outline review.
 *
 * Not a router — the full outline is rendered in one page; this is just
 * a navigational aid when the outline is long enough to scroll. Clicks
 * scroll the matching unit card into view via its `id`.
 */
import { useTranslations } from "next-intl";

export interface OutlineStepperProps {
  units: ReadonlyArray<{ index: number; title: string }>;
  activeIndex: number | null;
}

export function OutlineStepper({ units, activeIndex }: OutlineStepperProps) {
  const t = useTranslations("praxis.outline");

  return (
    <nav aria-label={t("stepperLabel")} className="sticky top-24">
      <div className="eyebrow mb-4">{t("stepperHeading")}</div>
      <div className="phases">
        {units.map((u) => {
          const active = activeIndex === u.index;
          return (
            <a
              key={u.index}
              href={`#unit-${u.index}`}
              className={`phase ${active ? "on" : ""}`}
            >
              <span className="n">
                {u.index < 10 ? `0${u.index}` : u.index}
              </span>
              <span className="t truncate">{u.title}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
