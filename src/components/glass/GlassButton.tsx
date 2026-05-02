"use client";

import React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useSpecularHighlight } from "@/hooks/useSpecularHighlight";
import { supportsBackdropFilter } from "@/lib/feature-detection";
import { getFilterId, shouldEnableDistortion } from "@/lib/glass-distortion";
import { SPRING_SNAPPY } from "@/lib/springs";
import { cn } from "@/lib/utils";
import {
  DistortionConfig,
  DistortionIntensity,
  GlassElevation,
} from "./glass-types";

export interface GlassButtonProps {
  elevation?: GlassElevation;
  specular?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";

  // Distortion props
  distortion?: boolean;
  distortionIntensity?: DistortionIntensity;
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;
}

export const GlassButton = React.forwardRef<
  HTMLButtonElement,
  GlassButtonProps
>(
  (
    {
      elevation = "e2",
      specular = false,
      distortion = false,
      distortionIntensity = "medium",
      shine = false,
      className,
      children,
      disabled = false,
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();
    const { ref: specularRef, position } = useSpecularHighlight(specular);

    const canBlur = performanceTier === 1 && hasBackdropFilter;
    const canDistort =
      distortion && canBlur && shouldEnableDistortion(performanceTier);

    const baseStyles = cn(
      "rounded-md border px-4 py-2 font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      (specular || canDistort) && "relative overflow-hidden",
      canDistort && "isolate",
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

    const mergedRef = (node: HTMLButtonElement | null) => {
      if (specular && specularRef) {
        (
          specularRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node;
      }
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
      }
    };

    const specularStyle: React.CSSProperties = specular
      ? {
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(circle 80px at ${position.x}% ${position.y}%, var(--glass-specular-strong), transparent 70%)`,
          pointerEvents: "none",
          opacity: 0.6,
          zIndex: 4,
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

      const containerStyle: React.CSSProperties = {
        borderColor,
        boxShadow,
      };

      return (
        <motion.button
          ref={mergedRef}
          type={type}
          disabled={disabled}
          className={baseStyles}
          style={containerStyle}
          whileHover={!reducedMotion ? "hover" : undefined}
          whileTap={!reducedMotion ? "tap" : undefined}
          variants={hoverVariants}
          onClick={onClick}
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
          {specular && <span style={specularStyle} aria-hidden="true" />}
          <span className="relative z-10 liquidGlass-content">{children}</span>
        </motion.button>
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
    };

    return (
      <motion.button
        ref={mergedRef}
        type={type}
        disabled={disabled}
        className={baseStyles}
        style={simpleStyle}
        whileHover={!reducedMotion ? "hover" : undefined}
        whileTap={!reducedMotion ? "tap" : undefined}
        variants={hoverVariants}
        onClick={onClick}
        {...props}
      >
        {specular && <span style={specularStyle} aria-hidden="true" />}
        <span className={specular ? "relative z-10" : undefined}>
          {children}
        </span>
      </motion.button>
    );
  },
);

GlassButton.displayName = "GlassButton";
