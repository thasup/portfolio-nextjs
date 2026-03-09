import { cn } from '@/lib/utils'
import { type TimelineEvent } from '@/types/timeline'
import { Briefcase, GraduationCap, Award, Rocket } from 'lucide-react'

interface TimelineNodeProps {
  event: TimelineEvent
  isActive: boolean
  onClick: () => void
}

export function TimelineNode({ event, isActive, onClick }: TimelineNodeProps) {
  const Icon = () => {
    switch (event.type) {
      case 'work': return <Briefcase className="h-4 w-4" />
      case 'education': return <GraduationCap className="h-4 w-4" />
      case 'achievement': return <Award className="h-4 w-4" />
      case 'project': return <Rocket className="h-4 w-4" />
      default: return <div className="h-2 w-2 rounded-full bg-current" />
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-3 transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )}
      aria-expanded={isActive}
      aria-controls={`timeline-panel-${event.id}`}
      id={`timeline-tab-${event.id}`}
    >
      <div className="text-xs font-medium tracking-wider uppercase">{event.date.split(' ')[0]}</div>
      <div
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-background',
          isActive
            ? 'border-primary bg-primary/10 text-primary scale-110'
            : 'border-border group-hover:border-primary/50 group-hover:text-primary'
        )}
      >
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-25" />
        )}
        <Icon />
      </div>
      <div className="w-24 text-center text-sm font-medium leading-tight line-clamp-2">
        {event.titleEn}
      </div>
    </button>
  )
}
