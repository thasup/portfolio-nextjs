export type PerformanceTier = 1 | 2;

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") {
    return 1;
  }

  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency || 1;

  if (memory !== undefined && memory < 4) {
    return 2;
  }

  if (cores < 4) {
    return 2;
  }

  return 1;
}
