export interface SkillEvidence {
  name: string
  level: number
  tagKey?: string
}

export interface Skill {
  name: string
  icon?: string
  level: number
}

export interface SkillCluster {
  id: string
  labelKey: string
  descriptionKey: string
  statusKey?: string
  order: number
  emphasized: boolean
  evidenceRefs?: string[]
  skills: SkillEvidence[]
}
