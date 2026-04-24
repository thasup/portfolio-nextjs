export type SignalId =
  | 'production-ai'
  | 'product-ownership'
  | 'systems-thinking'
  | 'collaborative-growth'
  | 'cross-functional-trust'
  | 'knowledge-sharing'
  | 'full-stack-delivery'
  | 'founder-trajectory'

export interface NarrativeClaim {
  id: string
  statementEn: string
  statementTh: string
  surfacedIn: string[]
  proofRefs: string[]
  signals?: SignalId[]
}

export interface EvidenceLink {
  sourceClaimId: string
  targetType: 'project' | 'timeline-event' | 'testimonial' | 'skill-cluster' | 'value-proposition'
  targetId: string
  reasonEn: string
  reasonTh?: string
}

export interface SignalDefinition {
  id: SignalId
  labelEn: string
  labelTh: string
  shortLabelEn?: string
  shortLabelTh?: string
  descriptionEn: string
  descriptionTh: string
}
