"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { useSpecularHighlight } from '@/hooks/useSpecularHighlight';
import { supportsBackdropFilter } from '@/lib/feature-detection';
import { SPRING_GENTLE } from '@/lib/springs';
import { cn } from '@/lib/utils';

export type GlassElevation = 'e1' | 'e2' | 'e3' | 'e4' | 'e5';

export interface GlassCardProps {
  elevation?: GlassElevation;
  hover?: boolean;
  interactive?: boolean;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ elevation = 'e2', hover = false, interactive = false, specular = false, className, children, style: customStyle, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();
    const { ref: specularRef, position } = useSpecularHighlight(specular);

    const shouldBlur = performanceTier === 1 && hasBackdropFilter;

    const baseStyles = cn(
      'rounded-xl border relative overflow-hidden transition-colors',
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

    if (interactive || hover) {
      const hoverVariants = hover && !reducedMotion
        ? {
            hover: {
              y: -4,
              transition: SPRING_GENTLE,
            },
          }
        : undefined;

      return (
        <motion.div
          ref={mergedRef}
          className={cn(baseStyles, specular && 'relative overflow-hidden')}
          style={style}
          whileHover={hoverVariants ? 'hover' : undefined}
          variants={hoverVariants}
          transition={reducedMotion ? { duration: 0 } : SPRING_GENTLE}
          {...props}
        >
          {specular && <div style={specularStyle} aria-hidden="true" />}
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={mergedRef} className={cn(baseStyles, specular && 'relative overflow-hidden')} style={style} {...props}>
        {specular && <div style={specularStyle} aria-hidden="true" />}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
