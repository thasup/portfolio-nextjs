import { Badge } from '@/components/ui/badge'
import { type TimelineEvent } from '@/types/timeline'
import { Card, CardContent } from '@/components/ui/card'

interface TimelineDetailProps {
  event: TimelineEvent
}

export function TimelineDetail({ event }: TimelineDetailProps) {
  return (
    <Card className="mt-8 border-primary/20 bg-muted/30 shadow-none">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{event.title}</h3>
              <p className="text-lg text-muted-foreground">{event.company}</p>
            </div>
            
            <p className="leading-relaxed">{event.description}</p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Impact</h4>
              <p className="text-muted-foreground">{event.impact}</p>
            </div>
          </div>
          
          <div className="w-full md:w-64 space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Skills & Tech</h4>
              <div className="flex flex-wrap gap-2">
                {event.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Date:</span> {event.date}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
