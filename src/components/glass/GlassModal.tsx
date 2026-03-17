'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { supportsBackdropFilter } from '@/lib/feature-detection';
import { SPRING_GENTLE } from '@/lib/springs';
import { cn } from '@/lib/utils';

export type GlassElevation = 'e1' | 'e2' | 'e3' | 'e4' | 'e5';

export interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  elevation?: GlassElevation;
  className?: string;
  children?: React.ReactNode;
}

export const GlassModal = React.forwardRef<HTMLDivElement, GlassModalProps>(
  ({ open, onClose, elevation = 'e4', className, children }, ref) => {
    const reducedMotion = useReducedMotion();
    const performanceTier = usePerformanceTier();
    const hasBackdropFilter = supportsBackdropFilter();

    const shouldBlur = performanceTier === 1 && hasBackdropFilter;

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
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
      'relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border p-6',
      shouldBlur
        ? `backdrop-blur-[var(--glass-${elevation}-blur)]`
        : 'bg-card',
      className
    );

    const style: React.CSSProperties = {
      backgroundColor: shouldBlur ? `var(--glass-${elevation}-fill)` : undefined,
      borderColor: `var(--glass-${elevation}-border)`,
      boxShadow: `var(--glass-${elevation}-shadow)`,
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
              style={style}
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
  }
);

GlassModal.displayName = 'GlassModal';
