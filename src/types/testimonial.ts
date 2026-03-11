import type { SignalId } from '@/types/content'

export interface Testimonial {
  id: string
  quoteEn: string
  quoteTh: string
  sharpestLineEn?: string
  sharpestLineTh?: string
  authorName: string
  authorRoleEn: string
  authorRoleTh: string
  company?: string
  relationshipEn: string
  relationshipTh: string
  validates?: SignalId[]
  authorAvatar?: string
}
