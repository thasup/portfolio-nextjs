'use client'

import { useTranslations } from 'next-intl'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type ProjectDomain } from '@/types/project'

interface ProjectFilterProps {
  activeDomain: ProjectDomain | 'all'
  onDomainChange: (domain: ProjectDomain | 'all') => void
}

export function ProjectFilter({ activeDomain, onDomainChange }: ProjectFilterProps) {
  const t = useTranslations('projects.labels')
  const domains: ProjectDomain[] = ['ai', 'web3', 'ecommerce', 'frontend']

  return (
    <div className="mb-12 w-full overflow-x-auto pb-4">
      <Tabs
        value={activeDomain}
        onValueChange={(value) => onDomainChange(value as ProjectDomain | 'all')}
        className="flex justify-items-start md:justify-center"
      >
        <TabsList className="h-12 justify-start px-2 py-2 w-auto">
          <TabsTrigger value="all" className="px-4 py-2 font-medium">
            {t('all')}
          </TabsTrigger>
          {domains.map((domain) => (
            <TabsTrigger key={domain} value={domain} className="px-4 py-2 font-medium">
              {t(`domains.${domain}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
