import React from 'react';
import { GlassCard, GlassPanel, GlassButton } from '@/components/glass';

export function GlassThemeTest() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Glass Card Elevations</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard elevation="e1" className="p-4">
            <h3 className="font-semibold">E1 - Subtle</h3>
            <p className="text-sm text-muted-foreground">Minimal blur and depth</p>
          </GlassCard>
          <GlassCard elevation="e2" className="p-4">
            <h3 className="font-semibold">E2 - Default</h3>
            <p className="text-sm text-muted-foreground">Balanced appearance</p>
          </GlassCard>
          <GlassCard elevation="e3" className="p-4">
            <h3 className="font-semibold">E3 - Medium</h3>
            <p className="text-sm text-muted-foreground">Moderate depth</p>
          </GlassCard>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Interactive Glass</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard elevation="e2" hover className="p-6">
            <h3 className="font-semibold">Hover Effect</h3>
            <p className="text-sm text-muted-foreground">Hover over this card</p>
          </GlassCard>
          <GlassCard elevation="e2" specular className="p-6">
            <h3 className="font-semibold">Specular Highlight</h3>
            <p className="text-sm text-muted-foreground">Move your mouse over this card</p>
          </GlassCard>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Glass Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <GlassButton elevation="e2">Default Button</GlassButton>
          <GlassButton elevation="e3" specular>Specular Button</GlassButton>
          <GlassButton elevation="e2" disabled>Disabled Button</GlassButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Glass Panel</h2>
        <GlassPanel elevation="e4" className="p-6">
          <h3 className="mb-2 text-xl font-bold">Panel Content</h3>
          <p className="text-muted-foreground">
            This panel uses E4 elevation with stronger glass effects.
          </p>
        </GlassPanel>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Liquid Distortion (New)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard elevation="e3" distortion distortionIntensity="low" className="p-6">
            <h3 className="font-semibold">Low Distortion</h3>
            <p className="text-sm text-muted-foreground">Subtle liquid texture.</p>
          </GlassCard>
          <GlassCard elevation="e3" distortion distortionIntensity="medium" className="p-6">
            <h3 className="font-semibold">Medium Distortion</h3>
            <p className="text-sm text-muted-foreground">Balanced liquid texture.</p>
          </GlassCard>
          <GlassCard elevation="e3" distortion distortionIntensity="high" className="p-6">
            <h3 className="font-semibold">High Distortion</h3>
            <p className="text-sm text-muted-foreground">Dramatic liquid texture.</p>
          </GlassCard>
          <GlassCard elevation="e3" distortion shine className="p-6">
            <h3 className="font-semibold">Distortion + Shine</h3>
            <p className="text-sm text-muted-foreground">Liquid texture with edge highlights.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
