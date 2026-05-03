"use client";

import React from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useSpecularHighlight } from "@/hooks/useSpecularHighlight";
import { supportsBackdropFilter } from "@/lib/feature-detection";
import { getFilterId, shouldEnableDistortion } from "@/lib/glass-distortion";
import { cn } from "@/lib/utils";
import {
  DistortionConfig,
  DistortionIntensity,
  GlassElevation,
} from "./glass-types";

export interface GlassPanelProps {
  elevation?: GlassElevation;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;

  // Distortion props
  distortion?: boolean;
  distortionIntensity?: DistortionIntensity;
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      elevation = "e3",
      specular = false,
      distortion = false,
      distortionIntensity = "medium",
      shine = false,
      className,
      children,
      style: customStyle,
      ...props
    },
    ref,
  ) => {
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();
    const { ref: specularRef, position } = useSpecularHighlight(specular);

    const canBlur = performanceTier === 1 && hasBackdropFilter;
    const canDistort =
      distortion && canBlur && shouldEnableDistortion(performanceTier);

    const baseStyles = cn(
      "rounded-lg border p-6 transition-colors",
      canDistort
        ? "relative overflow-hidden isolate"
        : "relative overflow-hidden",
      className,
    );

    const blurValues = {
      e1: "8px",
      e2: "12px",
      e3: "16px",
      e4: "20px",
      e5: "24px",
    };

    const borderColor = `var(--glass-${elevation}-border)`;
    const boxShadow = `var(--glass-${elevation}-shadow)`;

    const mergedRef = (node: HTMLDivElement | null) => {
      if (specular && specularRef) {
        (specularRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      }
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const specularStyle: React.CSSProperties = specular
      ? {
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(circle 120px at ${position.x}% ${position.y}%, var(--glass-specular-medium), transparent 70%)`,
          pointerEvents: "none",
          opacity: 0.5,
        }
      : {};

    // 1. DISTORTION ENABLED
    if (canDistort) {
      const filterId = getFilterId(distortionIntensity);

      const effectStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backdropFilter: `blur(${blurValues[elevation]}) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blurValues[elevation]}) saturate(180%)`,
        filter: `url(#${filterId})`,
        borderRadius: "inherit",
      };

      const tintStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        zIndex: 1,
        backgroundColor: `var(--glass-${elevation}-fill)`,
        borderRadius: "inherit",
      };

      const shineStyle: React.CSSProperties = shine
        ? {
            position: "absolute",
            inset: 0,
            zIndex: 2,
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 0 rgba(255,255,255,0.2)",
            borderRadius: "inherit",
            pointerEvents: "none",
          }
        : {};

      const contentStyle: React.CSSProperties = {
        position: "relative",
        zIndex: 3,
      };

      const containerStyle: React.CSSProperties = {
        borderColor,
        boxShadow,
        ...customStyle,
      };

      return (
        <div
          ref={mergedRef}
          className={baseStyles}
          style={containerStyle}
          {...props}
        >
          <div
            className="liquidGlass-effect"
            style={effectStyle}
            aria-hidden="true"
          />
          <div
            className="liquidGlass-tint"
            style={tintStyle}
            aria-hidden="true"
          />
          {shine && (
            <div
              className="liquidGlass-shine"
              style={shineStyle}
              aria-hidden="true"
            />
          )}
          {specular && (
            <div style={{ ...specularStyle, zIndex: 4 }} aria-hidden="true" />
          )}
          <div className="liquidGlass-content" style={contentStyle}>
            {children}
          </div>
        </div>
      );
    }

    // 2. STANDARD GLASS
    const simpleStyle: React.CSSProperties = {
      backgroundColor: canBlur
        ? `var(--glass-${elevation}-fill)`
        : "var(--color-card)",
      backdropFilter: canBlur
        ? `blur(${blurValues[elevation]}) saturate(180%)`
        : undefined,
      WebkitBackdropFilter: canBlur
        ? `blur(${blurValues[elevation]}) saturate(180%)`
        : undefined,
      borderColor,
      boxShadow,
      ...customStyle,
    };

    return (
      <div
        ref={mergedRef}
        className={baseStyles}
        style={simpleStyle}
        {...props}
      >
        {specular && <div style={specularStyle} aria-hidden="true" />}
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = "GlassPanel";
