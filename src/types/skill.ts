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
  order: number
  emphasized: boolean
  skills: Skill[]
}
