"use client";

import React from 'react';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { useSpecularHighlight } from '@/hooks/useSpecularHighlight';
import { supportsBackdropFilter } from '@/lib/feature-detection';
import { cn } from '@/lib/utils';

export type GlassElevation = 'e1' | 'e2' | 'e3' | 'e4' | 'e5';

export interface GlassPanelProps {
  elevation?: GlassElevation;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ elevation = 'e3', specular = false, className, children, style: customStyle, ...props }, ref) => {
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();
    const { ref: specularRef, position } = useSpecularHighlight(specular);

    const shouldBlur = performanceTier === 1 && hasBackdropFilter;

    const baseStyles = cn(
      'rounded-lg border p-6 relative overflow-hidden',
      className
    );

    const blurValues = {
      e1: '8px',
      e2: '12px',
      e3: '16px',
      e4: '20px',
      e5: '24px',
    };

    const style: React.CSSProperties = {
      backgroundColor: shouldBlur ? `var(--glass-${elevation}-fill)` : 'var(--color-card)',
      backdropFilter: shouldBlur ? `blur(${blurValues[elevation]}) saturate(180%)` : undefined,
      WebkitBackdropFilter: shouldBlur ? `blur(${blurValues[elevation]}) saturate(180%)` : undefined,
      borderColor: `var(--glass-${elevation}-border)`,
      boxShadow: `var(--glass-${elevation}-shadow)`,
      ...customStyle,
    };

    const mergedRef = (node: HTMLDivElement | null) => {
      if (specular && specularRef) {
        (specularRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const specularStyle: React.CSSProperties = specular
      ? {
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle 120px at ${position.x}% ${position.y}%, var(--glass-specular-medium), transparent 70%)`,
          pointerEvents: 'none',
          opacity: 0.5,
        }
      : {};

    return (
      <div ref={mergedRef} className={baseStyles} style={style} {...props}>
        {specular && <div style={specularStyle} aria-hidden="true" />}
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
