export interface SkillEvidence {
  name: string
  level: number
  tagEn?: string
  tagTh?: string
}

export interface Skill {
  name: string
  icon?: string
  level: number
}

export interface SkillCluster {
  id: string
  nameEn: string
  nameTh: string
  narrativeEn: string
  narrativeTh: string
  statusEn?: string
  statusTh?: string
  order: number
  emphasized: boolean
  evidenceRefs?: string[]
  skills: SkillEvidence[]
}
