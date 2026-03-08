export interface Skill {
  name: string
  icon?: string
  level: number
}

export interface SkillCluster {
  id: string
  name: string
  narrative: string
  order: number
  emphasized: boolean
  skills: Skill[]
}
