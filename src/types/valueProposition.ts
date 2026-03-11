import type { SignalId } from '@/types/content'

export interface ValueProposition {
  id: string
  titleEn: string
  titleTh: string
  descriptionEn: string
  descriptionTh: string
  icon: string
  proofEn?: string
  proofTh?: string
  crossRef?: string | null
  signalTag?: SignalId
  clientValidation?: string
}
