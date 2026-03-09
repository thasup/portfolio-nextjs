export interface ValueProposition {
  id: string
  titleEn: string
  titleTh: string
  descriptionEn: string
  descriptionTh: string
  icon: string
  crossRefType?: 'project' | 'timeline' | 'section' | null
  crossRefId?: string
}
