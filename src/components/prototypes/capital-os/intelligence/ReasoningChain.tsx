"use client";

/**
 * Reasoning Chain component.
 *
 * Visualizes the 4-agent flow: Accountant → Analyst → Strategist → Advisor
 */
import { SectionLabel } from "@/components/prototypes/capital-os/ui/SectionLabel";

export interface ReasoningStep {
  agent: string;
  icon: string;
  output: string;
}

const DEFAULT_STEPS: ReasoningStep[] = [
  {
    agent: "Accountant",
    icon: "🔢",
    output:
      "Verified current balances from YNAB sync (2h ago). Data confirmed accurate.",
  },
  {
    agent: "Analyst",
    icon: "📡",
    output: "Computed pattern and anomaly. Z-score calculated against 90-day baseline.",
  },
  {
    agent: "Strategist",
    icon: "🔭",
    output: "Modeled 3 scenarios. Net impact computed at each decision branch.",
  },
  {
    agent: "Advisor",
    icon: "🧭",
    output: "Recommendation synthesized. Ranked by impact × reversibility ÷ effort.",
  },
];

interface ReasoningChainProps {
  steps?: ReasoningStep[];
}

export function ReasoningChain({ steps = DEFAULT_STEPS }: ReasoningChainProps) {
  return (
    <div>
      <SectionLabel>Reasoning Chain</SectionLabel>
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 pb-2.5">
            {/* Timeline dots and line */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-2 h-2 rounded-full mt-1"
                style={{ background: "var(--cos-accent)" }}
              />
              {i < steps.length - 1 && (
                <div
                  className="w-px flex-1 min-h-[16px] mt-1"
                  style={{ background: "var(--cos-border-subtle)" }}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-2.5">
              <div className="text-xs font-semibold text-[var(--cos-text)] mb-0.5 flex items-center gap-1.5">
                <span>{step.icon}</span>
                <span>{step.agent}</span>
              </div>
              <div className="text-xs text-[var(--cos-text-1)] leading-relaxed">
                {step.output}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
