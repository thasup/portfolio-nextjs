'use client'

import { type TimelineEvent } from '@/types/timeline'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface TimelineAccordionProps {
  events: TimelineEvent[]
}

export function TimelineAccordion({ events }: TimelineAccordionProps) {
  // Open the first one by default
  const defaultValue = events[0]?.id

  return (
    <div className="md:hidden">
      <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full">
        {events.map((event) => (
          <AccordionItem key={event.id} value={event.id} className="border-b-border">
            <AccordionTrigger className="hover:no-underline text-left">
              <div className="flex flex-col gap-1 items-start">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {event.date}
                </span>
                <span className="text-lg font-bold">{event.title}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {event.company}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4 space-y-4">
                <p className="leading-relaxed text-sm">{event.description}</p>
                <div className="space-y-1.5">
                  <span className="text-sm font-semibold text-primary">Impact</span>
                  <p className="text-sm text-muted-foreground">{event.impact}</p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {event.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="font-normal text-[10px] px-1.5 py-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
