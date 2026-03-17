export type GlassElevation = 'e1' | 'e2' | 'e3' | 'e4' | 'e5';

export type DistortionIntensity = 'low' | 'medium' | 'high';

export interface DistortionConfig {
  baseFrequency: [number, number];
  scale: number;
  seed: number;
  specularConstant: number;
  surfaceScale: number;
}
