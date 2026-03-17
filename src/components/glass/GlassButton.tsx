"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { useSpecularHighlight } from '@/hooks/useSpecularHighlight';
import { supportsBackdropFilter } from '@/lib/feature-detection';
import { SPRING_SNAPPY } from '@/lib/springs';
import { cn } from '@/lib/utils';

export type GlassElevation = 'e1' | 'e2' | 'e3' | 'e4' | 'e5';

export interface GlassButtonProps {
  elevation?: GlassElevation;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ elevation = 'e2', specular = false, className, children, disabled = false, type = 'button', onClick, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();
    const { ref: specularRef, position } = useSpecularHighlight(specular);

    const shouldBlur = performanceTier === 1 && hasBackdropFilter;

    const baseStyles = cn(
      'rounded-md border px-4 py-2 font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      specular && 'relative overflow-hidden',
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
    };

    const mergedRef = (node: HTMLButtonElement | null) => {
      if (specular && specularRef) {
        (specularRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    };

    const specularStyle: React.CSSProperties = specular
      ? {
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle 80px at ${position.x}% ${position.y}%, var(--glass-specular-strong), transparent 70%)`,
          pointerEvents: 'none',
          opacity: 0.6,
        }
      : {};

    const hoverVariants = !reducedMotion
      ? {
          hover: {
            scale: 1.02,
            y: -2,
            transition: SPRING_SNAPPY,
          },
          tap: {
            scale: 0.98,
            transition: SPRING_SNAPPY,
          },
        }
      : undefined;

    return (
      <motion.button
        ref={mergedRef}
        type={type}
        disabled={disabled}
        className={baseStyles}
        style={style}
        whileHover={!reducedMotion ? 'hover' : undefined}
        whileTap={!reducedMotion ? 'tap' : undefined}
        variants={hoverVariants}
        onClick={onClick}
        {...props}
      >
        {specular && <span style={specularStyle} aria-hidden="true" />}
        <span className={specular ? 'relative z-10' : undefined}>{children}</span>
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
