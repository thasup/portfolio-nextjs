"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { supportsBackdropFilter } from "@/lib/feature-detection";
import { getFilterId, shouldEnableDistortion } from "@/lib/glass-distortion";
import { SPRING_GENTLE } from "@/lib/springs";
import { cn } from "@/lib/utils";
import {
  DistortionConfig,
  DistortionIntensity,
  GlassElevation,
} from "./glass-types";

export interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  elevation?: GlassElevation;
  className?: string;
  children?: React.ReactNode;

  // Distortion props
  distortion?: boolean;
  distortionIntensity?: DistortionIntensity;
  customDistortionConfig?: Partial<DistortionConfig>;
  shine?: boolean;
}

export const GlassModal = React.forwardRef<HTMLDivElement, GlassModalProps>(
  (
    {
      open,
      onClose,
      elevation = "e4",
      distortion = false,
      distortionIntensity = "medium",
      shine = false,
      className,
      children,
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();

    const canBlur = performanceTier === 1 && hasBackdropFilter;
    const canDistort =
      distortion && canBlur && shouldEnableDistortion(performanceTier);

    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    const overlayVariants = !reducedMotion
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      : undefined;

    const contentVariants = !reducedMotion
      ? {
          hidden: { opacity: 0, scale: 0.95, y: 20 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: SPRING_GENTLE,
          },
        }
      : undefined;

    const baseStyles = cn(
      "relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border p-6",
      // If NOT distorting and CAN blur, add backdrop class (standard)
      !canDistort && canBlur
        ? `backdrop-blur-[var(--glass-${elevation}-blur)]`
        : "",
      // If NOT distorting and CANNOT blur, fall back to bg-card
      !canDistort && !canBlur ? "bg-card" : "",
      // If distorting, ensure relative positioning and isolation
      canDistort ? "relative overflow-hidden isolate" : "",
      className,
    );

    const borderColor = `var(--glass-${elevation}-border)`;
    const boxShadow = `var(--glass-${elevation}-shadow)`;

    // 1. DISTORTION ENABLED
    if (canDistort) {
      const filterId = getFilterId(distortionIntensity);

      const blurValues = {
        e1: "8px",
        e2: "12px",
        e3: "16px",
        e4: "20px",
        e5: "24px",
      };

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
      };

      return (
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="absolute inset-0 bg-black/50"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
                onClick={onClose}
              />
              <motion.div
                ref={ref}
                className={baseStyles}
                style={containerStyle}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
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
                <div className="liquidGlass-content" style={contentStyle}>
                  {children}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      );
    }

    // 2. STANDARD GLASS
    const simpleStyle: React.CSSProperties = {
      backgroundColor: canBlur ? `var(--glass-${elevation}-fill)` : undefined,
      borderColor,
      boxShadow,
    };

    return (
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={onClose}
            />
            <motion.div
              ref={ref}
              className={baseStyles}
              style={simpleStyle}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  },
);

GlassModal.displayName = "GlassModal";
