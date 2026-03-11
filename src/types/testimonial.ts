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
  authorRoleEn: string
  authorRoleTh: string
  company?: string
  relationshipEn: string
  relationshipTh: string
  proofThemeId: TestimonialProofThemeId
  proofThemeLabelEn: string
  proofThemeLabelTh: string
  summaryQuoteEn: string
  summaryQuoteTh: string
  fullQuoteEn: string
  fullQuoteTh: string
  contextNoteEn?: string
  contextNoteTh?: string
  validates?: SignalId[]
  authorAvatar?: string
  // Deprecated fields for backward compatibility during migration
  /** @deprecated Use summaryQuoteEn instead */
  sharpestLineEn?: string
  /** @deprecated Use summaryQuoteTh instead */
  sharpestLineTh?: string
  /** @deprecated Use fullQuoteEn instead */
  quoteEn?: string
  /** @deprecated Use fullQuoteTh instead */
  quoteTh?: string
}
