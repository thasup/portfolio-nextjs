'use client';

import { useEffect, useState } from 'react';
import { detectPerformanceTier, type PerformanceTier } from '@/lib/performance';

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>(1);

  useEffect(() => {
    setTier(detectPerformanceTier());
  }, []);

  return tier;
}
