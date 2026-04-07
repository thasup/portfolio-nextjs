"use client";

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface SpecularPosition {
  x: number;
  y: number;
}

export function useSpecularHighlight(enabled: boolean = true) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<SpecularPosition>({ x: 50, y: 50 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion || !ref.current) {
      return;
    }

    const element = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setPosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 50, y: 50 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, reducedMotion]);

  return { ref, position };
}
