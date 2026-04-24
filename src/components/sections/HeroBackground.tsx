"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroBackground() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reducedMotion) return null;

  // Generate more dynamic particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // random x start position (%)
    y: Math.random() * 100, // random y start position (%)
    size: Math.random() * 4 + 1.5, // size between 1.5px and 5.5px
    duration: Math.random() * 15 + 15, // float duration
    delay: Math.random() * 5,
    wobble: Math.random() * 20 - 10, // horizontal drift
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* 
        Aurora Lights:
        Using much higher opacity and larger blurs to create a vibrant liquid mesh effect.
        The colors are based on the brand's primary/accent colors. 
      */}
      
      {/* Primary Blob (Right Side) */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-linear-to-bl from-[var(--color-praxis-accent)] via-[var(--color-ai-primary)] to-transparent blur-[80px] md:blur-[120px] opacity-40 dark:opacity-60"
        animate={{
          scale: [1, 1.2, 0.9, 1],
          x: [0, -50, 20, 0],
          y: [0, 40, -20, 0],
          rotate: [0, 90, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Secondary Blob (Bottom Right) */}
      <motion.div
        className="absolute bottom-[-20%] right-[10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-linear-to-tr from-purple-600 via-[var(--color-praxis-accent)] to-transparent blur-[80px] md:blur-[120px] opacity-30 dark:opacity-50"
        animate={{
          scale: [1, 1.1, 1.3, 1],
          x: [0, 40, -40, 0],
          y: [0, -50, 20, 0],
          rotate: [360, 180, 90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Tertiary Blob (Center Right) - For extra depth */}
      <motion.div
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/40 dark:bg-emerald-500/30 blur-[80px] md:blur-[100px] opacity-30 dark:opacity-40"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particles Overlay */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[var(--color-ink)] dark:bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 2.5}px var(--color-ink)`,
            }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              y: [0, -150], // Float way up
              x: [0, p.wobble, -p.wobble, 0], // Wobble left and right
              opacity: [0, 0.7, 0.7, 0], // Fade in, hold, fade out
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>
      
      {/* Noise Texture Overlay for that premium grainy look */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
