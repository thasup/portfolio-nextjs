import type { SignalId } from '@/types/content'

export function getSignalLabel(signalId: SignalId) {
  return `common.signals.${signalId}`
}

export function sortFeaturedFirst<T extends { featured?: boolean; strategicPriority?: number }>(items: T[]) {
  return [...items].sort((a, b) => {
    const priorityA = a.strategicPriority ?? Number.MAX_SAFE_INTEGER
    const priorityB = b.strategicPriority ?? Number.MAX_SAFE_INTEGER

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    if (a.featured === b.featured) {
      return 0
    }

    return a.featured ? -1 : 1
  })
}
