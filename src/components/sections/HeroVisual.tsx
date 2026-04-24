"use client";

import { motion } from "framer-motion";
import { default as NextImage } from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroVisual() {
  const reducedMotion = useReducedMotion();

  // If reduced motion is preferred, just return a static but nice version
  if (reducedMotion) {
    return (
      <div className="relative flex justify-center lg:justify-end">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-linear-to-br from-[var(--color-praxis-accent-soft)] via-[var(--color-ai-soft)] to-[var(--color-praxis-accent-soft)] blur-2xl opacity-50" />
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-[3px] border-[var(--color-line)] bg-[var(--color-paper-2)] sm:h-80 sm:w-80">
            <NextImage
              src={siteConfig.avatarImage}
              alt={siteConfig.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 256px, 320px"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full justify-center lg:justify-end py-10">
      <div className="relative flex h-[350px] w-[350px] items-center justify-center sm:h-[450px] sm:w-[450px]">
        
        {/* Background ambient glow that pulses */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-linear-to-br from-[var(--color-praxis-accent-soft)] via-[var(--color-ai-soft)] to-[var(--color-praxis-accent-soft)] blur-3xl"
          animate={{ 
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.4, 0.6, 0.3, 0.4] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbiting Ring 1 (Dashed) */}
        <motion.div
          className="absolute inset-4 rounded-full border border-dashed border-[var(--color-ink-4)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbiting Ring 2 (Solid with gradient) */}
        <motion.div
          className="absolute inset-10 rounded-full border border-[var(--color-line-soft)]"
          style={{ borderTopColor: 'var(--color-praxis-accent)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Node on the ring */}
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--color-praxis-accent)] shadow-[0_0_10px_var(--color-praxis-accent)]" />
        </motion.div>

        {/* Orbiting Ring 3 (Inner, fast) */}
        <motion.div
          className="absolute inset-16 rounded-full border border-[var(--color-line-soft)]"
          style={{ borderBottomColor: 'var(--color-ai-primary, #6366f1)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Node on the ring */}
          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#6366f1] shadow-[0_0_10px_#6366f1]" />
        </motion.div>

        {/* Floating tech nodes (decorative) */}
        <motion.div 
          className="absolute top-[15%] right-[10%] card flex items-center justify-center p-2 text-[var(--color-ink-3)] bg-[var(--color-paper)]/50 backdrop-blur-md"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </motion.div>

        <motion.div 
          className="absolute bottom-[20%] left-[5%] card flex items-center justify-center p-2 text-[var(--color-praxis-accent)] bg-[var(--color-paper)]/50 backdrop-blur-md"
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
        </motion.div>

        <motion.div 
          className="absolute top-[20%] left-[10%] h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <motion.div 
          className="absolute bottom-[30%] right-[5%] h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Central Avatar */}
        <div className="relative z-10 flex h-48 w-48 items-center justify-center sm:h-60 sm:w-60">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-line)] bg-[var(--color-paper-2)] overflow-hidden">
            <NextImage
              src={siteConfig.avatarImage}
              alt={siteConfig.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 640px) 192px, 240px"
              priority
            />
          </div>
          
          {/* Inner ring overlay */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
