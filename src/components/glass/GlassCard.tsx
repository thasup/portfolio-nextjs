"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { useSpecularHighlight } from '@/hooks/useSpecularHighlight';
import { supportsBackdropFilter } from '@/lib/feature-detection';
import { getDistortionConfig, getFilterId, shouldEnableDistortion } from '@/lib/glass-distortion';
import { SPRING_GENTLE } from '@/lib/springs';
import { cn } from '@/lib/utils';
import { DistortionConfig, DistortionIntensity, GlassElevation } from './glass-types';

export type { GlassElevation };

export interface GlassCardProps {
  elevation?: GlassElevation;
  hover?: boolean;
  interactive?: boolean;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  
  // Distortion props
  distortion?: boolean;
  distortionIntensity?: DistortionIntensity;
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    elevation = 'e2', 
    hover = false, 
    interactive = false, 
    specular = false, 
    distortion = false,
    distortionIntensity = 'medium',
    shine = false,
    className,  
    children, 
    style: customStyle, 
    ...props 
  }, ref) => {
    const reducedMotion = useReducedMotion();
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();
    const { ref: specularRef, position } = useSpecularHighlight(specular);

    // Only enable blur/distortion on Tier 1 devices that support backdrop-filter
    const canBlur = performanceTier === 1 && hasBackdropFilter;
    const canDistort = distortion && canBlur && shouldEnableDistortion(performanceTier);

    const baseStyles = cn(
      'rounded-xl border transition-colors',
      // If distorting, we use a wrapper that is relative and isolated
      canDistort ? 'relative overflow-hidden isolate' : 'relative overflow-hidden',
      className
    );

    const blurValues = {
      e1: '8px',
      e2: '12px',
      e3: '16px',
      e4: '20px',
      e5: '24px',
    };

    // Common styles
    const borderColor = `var(--glass-${elevation}-border)`;
    const boxShadow = `var(--glass-${elevation}-shadow)`;

    // Specular highlight style
    const specularStyle: React.CSSProperties = specular
      ? {
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle 120px at ${position.x}% ${position.y}%, var(--glass-specular-medium), transparent 70%)`,
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 4, // Above content in layered mode? No, spec usually sits on top of surface but below content interaction? 
                     // Actually specular is light reflecting OFF the surface.
                     // In non-distorted, it's just an overlay. 
                     // In distorted, it should probably be on top of the effect layer but below content?
                     // Reference implementation puts shine/specular below content.
        }
      : {};

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

    // --- RENDER LOGIC ---

    const hoverVariants = (interactive || hover) && !reducedMotion
      ? {
          hover: {
            y: -4,
            transition: SPRING_GENTLE,
          },
        }
      : undefined;

    // 1. DISTORTION ENABLED (Layered Structure)
    if (canDistort) {
      const filterId = getFilterId(distortionIntensity);
      // We assume global filters are present. If custom config is needed, we might need inline SVG (not implemented in MVP).
      
      const effectStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backdropFilter: `blur(${blurValues[elevation]}) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blurValues[elevation]}) saturate(180%)`,
        filter: `url(#${filterId})`,
        borderRadius: 'inherit',
      };

      const tintStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        backgroundColor: `var(--glass-${elevation}-fill)`,
        borderRadius: 'inherit',
      };

      const shineStyle: React.CSSProperties = shine ? {
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 0 rgba(255,255,255,0.2)', // simplified shine
        borderRadius: 'inherit',
        pointerEvents: 'none',
      } : {};

      const contentStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 3,
      };

      // Container style
      const containerStyle: React.CSSProperties = {
        borderColor,
        boxShadow,
        ...customStyle,
      };

      const Content = (
        <>
          <div className="liquidGlass-effect" style={effectStyle} aria-hidden="true" />
          <div className="liquidGlass-tint" style={tintStyle} aria-hidden="true" />
          {shine && <div className="liquidGlass-shine" style={shineStyle} aria-hidden="true" />}
          {specular && <div style={{...specularStyle, zIndex: 4}} aria-hidden="true" />}
          <div className="liquidGlass-content" style={contentStyle}>
            {children}
          </div>
        </>
      );

      if (interactive || hover) {
        return (
          <motion.div
            ref={mergedRef}
            className={baseStyles}
            style={containerStyle}
            whileHover={hoverVariants ? 'hover' : undefined}
            variants={hoverVariants}
            transition={reducedMotion ? { duration: 0 } : SPRING_GENTLE}
            {...props}
          >
            {Content}
          </motion.div>
        );
      }

      return (
        <div ref={mergedRef} className={baseStyles} style={containerStyle} {...props}>
          {Content}
        </div>
      );
    }

    // 2. STANDARD GLASS (Backward Compatible)
    const simpleStyle: React.CSSProperties = {
      backgroundColor: canBlur ? `var(--glass-${elevation}-fill)` : 'var(--color-card)',
      backdropFilter: canBlur ? `blur(${blurValues[elevation]}) saturate(180%)` : undefined,
      WebkitBackdropFilter: canBlur ? `blur(${blurValues[elevation]}) saturate(180%)` : undefined,
      borderColor,
      boxShadow,
      ...customStyle,
    };

    if (interactive || hover) {
      return (
        <motion.div
          ref={mergedRef}
          className={cn(baseStyles, specular && 'relative overflow-hidden')}
          style={simpleStyle}
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
      <div ref={mergedRef} className={cn(baseStyles, specular && 'relative overflow-hidden')} style={simpleStyle} {...props}>
        {specular && <div style={specularStyle} aria-hidden="true" />}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
