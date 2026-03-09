export type TimelineEventType = 'work' | 'project' | 'education' | 'achievement'

export interface TimelineChapter {
  id: string
  order: number
  titleEn: string
  titleTh: string
  descriptionEn: string
  descriptionTh: string
  period: string
  accentColor: string
  eventIds: string[]
}

export interface TimelineEvent {
  id: string
  chapterId: string
  date: string
  sortDate: string
  titleEn: string
  titleTh: string
  company: string
  type: TimelineEventType
  summaryEn: string
  summaryTh: string
  descriptionEn?: string
  descriptionTh?: string
  impactEn: string
  impactTh: string
  skills: string[]
  icon?: string
  tech?: string[]
  isFeatured?: boolean
}
