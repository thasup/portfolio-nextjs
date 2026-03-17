import { DistortionConfig, DistortionIntensity } from '@/components/glass/glass-types';
import { PerformanceTier } from '@/lib/performance';

export const DISTORTION_PRESETS: Record<DistortionIntensity, DistortionConfig> = {
  low: {
    baseFrequency: [0.005, 0.005],
    scale: 75,
    seed: 5,
    specularConstant: 0.8,
    surfaceScale: 5,
  },
  medium: {
    baseFrequency: [0.01, 0.01],
    scale: 100,
    seed: 5,
    specularConstant: 1.0,
    surfaceScale: 5,
  },
  high: {
    baseFrequency: [0.015, 0.015],
    scale: 150,
    seed: 5,
    specularConstant: 1.2,
    surfaceScale: 5,
  },
};

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getDistortionConfig(
  intensity: DistortionIntensity = 'medium',
  customConfig?: Partial<DistortionConfig>
): DistortionConfig {
  const preset = DISTORTION_PRESETS[intensity];
  
  if (!customConfig) {
    return preset;
  }

  return {
    baseFrequency: customConfig.baseFrequency || preset.baseFrequency,
    scale: customConfig.scale !== undefined ? clampValue(customConfig.scale, 50, 250) : preset.scale,
    seed: customConfig.seed !== undefined ? clampValue(customConfig.seed, 1, 20) : preset.seed,
    specularConstant: customConfig.specularConstant !== undefined ? clampValue(customConfig.specularConstant, 0.5, 2.0) : preset.specularConstant,
    surfaceScale: customConfig.surfaceScale !== undefined ? clampValue(customConfig.surfaceScale, 1, 10) : preset.surfaceScale,
  };
}

export function getFilterId(intensity: DistortionIntensity): string {
  return `glass-distortion-${intensity}`;
}

export function shouldEnableDistortion(performanceTier: PerformanceTier): boolean {
  return performanceTier === 1;
}
