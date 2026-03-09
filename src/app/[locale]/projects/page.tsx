import { Projects } from '@/components/sections/Projects'
import { siteConfig } from '@/data/siteConfig'

export const metadata = {
  title: `All Projects | ${siteConfig.name}`,
  description: 'A comprehensive list of projects spanning AI, Web3, E-commerce, and Frontend architecture.',
}

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-16">
      <Projects />
    </div>
  )
}
