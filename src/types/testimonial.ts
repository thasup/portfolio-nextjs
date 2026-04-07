import type { SignalId } from '@/types/content'

export type TestimonialProofThemeId =
  | 'business-impact'
  | 'technical-ownership'
  | 'stakeholder-confidence'
  | 'force-multiplier'
  | 'systematic-problem-solving'
  | 'psychological-safety'
  | 'cultural-catalyst'
  | 'root-cause-collaboration'
  | 'engineering-mentorship'
  | 'trust-organization'

export interface TestimonialProofTheme {
  id: TestimonialProofThemeId
  labelEn: string
  labelTh: string
  descriptionEn: string
  descriptionTh: string
}

export interface Testimonial {
  id: string
  authorName: string
  authorRoleKey: string
  company?: string
  relationshipKey: string
  proofThemeId: TestimonialProofThemeId
  proofThemeLabelKey: string
  summaryQuoteKey: string
  fullQuoteKey: string
  contextNoteKey?: string
  validates?: SignalId[]
  authorAvatar?: string
}
