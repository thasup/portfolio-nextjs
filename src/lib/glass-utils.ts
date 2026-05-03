import { type GlassElevation } from "@/components/glass";

export function getGlassFallbackStyles(elevation: GlassElevation): string {
  const elevationMap: Record<GlassElevation, string> = {
    e1: "bg-card/95 shadow-sm",
    e2: "bg-card/98 shadow-md",
    e3: "bg-card shadow-md",
    e4: "bg-card shadow-lg",
    e5: "bg-card shadow-xl",
  };

  return elevationMap[elevation] || elevationMap.e2;
}

export function shouldUseGlassEffects(
  performanceTier: 1 | 2,
  hasBackdropFilter: boolean,
): boolean {
  return performanceTier === 1 && hasBackdropFilter;
}
