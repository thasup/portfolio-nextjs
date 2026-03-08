export type TimelineEventType = 'work' | 'project' | 'education' | 'achievement'

export interface TimelineEvent {
  id: string
  date: string
  sortDate: string
  title: string
  company: string
  type: TimelineEventType
  summary: string
  description: string
  impact: string
  skills: string[]
  icon?: string
}
