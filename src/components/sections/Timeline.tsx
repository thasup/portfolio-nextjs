import { SectionHeader } from '@/components/shared/SectionHeader'
import { TimelineTrack } from '../timeline/TimelineTrack'
import { TimelineAccordion } from '../timeline/TimelineAccordion'
import { timelineEvents } from '@/data/timelineEvents'

export function Timeline() {
  // For the desktop horizontal track, we probably only want to show ~5-6 key milestones
  // to prevent cramming. Let's slice the most recent/important ones.
  const desktopEvents = timelineEvents.slice(0, 6)

  return (
    <section id="timeline" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label="MY TIMELINE"
          title="Career Journey"
          subtitle="4 years of building across AI, Web3, e-commerce, and frontend"
        />
        
        {/* Render Desktop Track */}
        <TimelineTrack events={desktopEvents} />

        {/* Render Mobile Accordion (showing all events) */}
        <TimelineAccordion events={timelineEvents} />
      </div>
    </section>
  )
}
