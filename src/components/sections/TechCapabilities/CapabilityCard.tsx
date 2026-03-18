'use client';

import { useTranslations } from 'next-intl';
import { LayoutTemplate, Server, Target, Sparkles } from 'lucide-react';
import { Capability } from '@/types/tech-capabilities';
import { GlassCard } from '@/components/glass';
import { useModal } from '@/hooks/useModal';

interface CapabilityCardProps {
  capability: Capability;
  index: number;
}

const iconMap = {
  LayoutTemplate,
  Server,
  Target,
  Sparkles,
};

export function CapabilityCard({ capability, index }: CapabilityCardProps) {
  const t = useTranslations();
  const Icon = iconMap[capability.iconName];

  const cssVars = {
    '--card-accent': capability.accentColor,
    '--card-accent-rgb': capability.accentRgb,
    '--card-delay': `${index * 110}ms`,
  } as React.CSSProperties;

  const { open } = useModal();

  return (
    <GlassCard
      elevation="e2"
      hover={true}
      interactive={true}
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        ...cssVars,
        borderColor: capability.emphasized
          ? `rgba(${capability.accentRgb}, 0.2)`
          : undefined,
        boxShadow: capability.emphasized
          ? `0 0 40px -15px rgba(${capability.accentRgb}, 0.15)`
          : undefined,
      }}
    >
      {/* Accent stripe */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, ${capability.accentColor} 0%, rgba(${capability.accentRgb}, 0.3) 55%, transparent 100%)`,
        }}
      />

      {/* Ambient glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 15% 0%, rgba(${capability.accentRgb}, 0.06) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex grow flex-col p-8 md:p-10">
        {/* Header */}
        <header className="mb-6 flex items-start gap-4">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 rounded-xl border p-2.5 transition-transform duration-500 group-hover:scale-110"
              style={{
                color: capability.accentColor,
                backgroundColor: `rgba(${capability.accentRgb}, 0.08)`,
                borderColor: `rgba(${capability.accentRgb}, 0.18)`,
              }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground md:text-xl">
                {t(capability.titleKey)}
              </h3>
              <p className="mt-0.5 text-[12.5px] italic text-muted-foreground/70">
                {t(capability.taglineKey)}
              </p>
            </div>
          </div>
        </header>

        {/* Subsystems grid */}
        <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 border-b border-border/50 pb-6">
          {capability.subsystems.map((sub) => (
            <div key={sub.nameKey}>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {t(sub.nameKey)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sub.tools.map((tool) => (
                  <span
                    key={tool.name}
                    className="rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-default"
                    style={
                      tool.primary
                        ? {
                          color: capability.accentColor,
                          backgroundColor: `rgba(${capability.accentRgb}, 0.15)`,
                          borderWidth: '1px',
                          borderColor: `rgba(${capability.accentRgb}, 0.3)`,
                        }
                        : {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        }
                    }
                    data-primary={tool.primary}
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Measurable outcome */}
        <div
          className="mb-5 rounded-xl border p-4 transition-colors duration-300"
          style={{
            backgroundColor: `rgba(${capability.accentRgb}, 0.04)`,
            borderColor: `rgba(${capability.accentRgb}, 0.15)`,
          }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: capability.accentColor }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: capability.accentColor }}
            >
              {t('tech.outcomeLabel')}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {t(capability.outcomeTextKey)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const projectSlug = capability.outcomeProject.toLowerCase().replace(/\s+/g, '-').replace(/\/.*$/, '');
              open({ type: 'project', id: projectSlug });
            }}
            className="group/flagship mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <span>{t('tech.flagshipLabel')}:</span>
            <span className="underline decoration-dotted underline-offset-2 group-hover/flagship:decoration-solid">
              {capability.outcomeProject}
            </span>
            <span className="opacity-0 transition-opacity group-hover/flagship:opacity-100">→</span>
          </button>
        </div>

        {/* Signal quote */}
        <div
          className="mt-auto rounded-lg border p-4"
          style={{
            backgroundColor: `rgba(${capability.accentRgb}, 0.06)`,
            borderLeftWidth: '3px',
            borderLeftColor: capability.accentColor,
            borderTopColor: `rgba(${capability.accentRgb}, 0.14)`,
            borderRightColor: `rgba(${capability.accentRgb}, 0.1)`,
            borderBottomColor: `rgba(${capability.accentRgb}, 0.1)`,
          }}
        >
          <blockquote className="flex items-start gap-3">
            <span className="shrink-0 text-base leading-relaxed opacity-90">⚡</span>
            <p className="text-[13.5px] font-medium italic leading-relaxed text-foreground">
              &ldquo;{t(capability.signalKey)}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </GlassCard>
  );
}
