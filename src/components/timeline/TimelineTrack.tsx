'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimelineNode } from './TimelineNode'
import { TimelineDetail } from './TimelineDetail'
import { type TimelineEvent } from '@/types/timeline'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TimelineTrackProps {
  events: TimelineEvent[]
}

export function TimelineTrack({ events }: TimelineTrackProps) {
  // Default to the first event open
  const [activeEventId, setActiveEventId] = useState<string | null>(events[0]?.id || null)
  const reducedMotion = useReducedMotion()

  const activeEvent = events.find((e) => e.id === activeEventId)

  return (
    <div className="hidden md:block">
      {/* Horizontal Track Container */}
      <div className="relative">
        {/* The continuous line */}
        <div className="absolute top-[32px] left-[48px] right-[48px] h-0.5 bg-border -z-10" />
        
        {/* The nodes */}
        <div className="flex justify-between relative px-2">
          {events.map((event) => (
            <div key={event.id} className="relative z-10 flex-shrink-0">
              <TimelineNode
                event={event}
                isActive={activeEventId === event.id}
                onClick={() => setActiveEventId(event.id === activeEventId ? null : event.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Detail Panel */}
      <div className="mt-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeEvent && (
            <motion.div
              key={activeEvent.id}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              id={`timeline-panel-${activeEvent.id}`}
              role="region"
              aria-labelledby={`timeline-tab-${activeEvent.id}`}
            >
              <TimelineDetail event={activeEvent} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
