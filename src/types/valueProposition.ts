import type { SignalId } from '@/types/content'

export interface ValueProposition {
  id: string
  titleKey: string
  descriptionKey: string
  icon: string
  proofKey?: string
  crossRef?: string | null
  signalTag?: SignalId
  clientValidation?: string
}
