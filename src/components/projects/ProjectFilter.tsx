'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DOMAIN_LABELS, type ProjectDomain } from '@/types/project'

interface ProjectFilterProps {
  activeDomain: ProjectDomain | 'all'
  onDomainChange: (domain: ProjectDomain | 'all') => void
}

export function ProjectFilter({ activeDomain, onDomainChange }: ProjectFilterProps) {
  return (
    <div className="mb-12 flex justify-center w-full overflow-x-auto pb-4">
      <Tabs
        value={activeDomain}
        onValueChange={(value) => onDomainChange(value as ProjectDomain | 'all')}
        className="w-auto"
      >
        <TabsList className="h-12 justify-start px-2 py-2">
          <TabsTrigger value="all" className="px-4 py-2 font-medium">
            All Projects
          </TabsTrigger>
          {(Object.entries(DOMAIN_LABELS) as [ProjectDomain, string][]).map(
            ([key, label]) => (
              <TabsTrigger key={key} value={key} className="px-4 py-2 font-medium">
                {label}
              </TabsTrigger>
            )
          )}
        </TabsList>
      </Tabs>
    </div>
  )
}
