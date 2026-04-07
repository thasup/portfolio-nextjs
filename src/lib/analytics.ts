export const GA_EVENTS = {
  LANGUAGE_TOGGLE: 'language_toggle',
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',
  MODAL_SCROLL_DEPTH: 'modal_scroll_depth',
  TIMELINE_SCENE_ENTER: 'timeline_scene_enter',
  PROJECT_FILTER_CHANGE: 'project_filter_change',
  SECTION_VISIBLE: 'section_visible',
  HERO_CTA_CLICK: 'hero_cta_click',
  TIMELINE_PROGRESS: 'timeline_progress',
  TIMELINE_DEEPDIVE_OPEN: 'timeline_deepdive_open',
  TIMELINE_FILTER: 'timeline_filter',
  SCROLL_DEPTH: 'scroll_depth',
  RESUME_DOWNLOAD: 'resume_download',
} as const;

export type EventName = typeof GA_EVENTS[keyof typeof GA_EVENTS];
type GtagFunction = (
  command: 'event',
  name: EventName | string,
  params?: Record<string, string | number | boolean>
) => void;

export function trackEvent(name: EventName | string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const gtag = window.gtag as GtagFunction;
    gtag('event', name, params);
  }
}

export function trackTimeOnPage(seconds: number) {
  trackEvent('time_on_page', { seconds });
}

export function trackScrollDepth(percentage: number) {
  trackEvent(GA_EVENTS.SCROLL_DEPTH, { percentage });
}

export function trackSectionVisibility(sectionId: string) {
  trackEvent(GA_EVENTS.SECTION_VISIBLE, { section: sectionId });
}

export interface TimelineProgressEvent {
  percent: 25 | 50 | 75 | 100;
}

export interface TimelineDeepDiveEvent {
  event_id: string;
  event_title: string;
  year: number;
  event_type: 'work' | 'project' | 'education' | 'achievement' | 'learning' | 'milestone';
}
