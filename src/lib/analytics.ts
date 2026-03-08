export const GA_EVENTS = {
  CTA_CLICK: 'cta_click',
  PROJECT_FILTER: 'project_filter',
  TIMELINE_EXPAND: 'timeline_expand',
  RESUME_DOWNLOAD: 'resume_download',
} as const

export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      'event',
      name,
      params
    )
  }
}
