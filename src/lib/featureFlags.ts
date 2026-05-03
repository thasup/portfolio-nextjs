export enum Section {
  HERO = "hero",
  TIMELINE = "timeline",
  PROJECTS = "projects",
  TECH_CAPABILITIES = "techCapabilities",
  SKILLS = "skills",
  TESTIMONIALS = "testimonials",
  VALUE_PROP = "valueProp",
  CONTACT = "contact",
  NAVBAR = "navbar",
  FOOTER = "footer",
}

const isDev = process.env.NODE_ENV !== "production";

/**
 * Central feature flag configuration for controlling section visibility.
 * Set to `true` to enable a section, `false` to disable it.
 *
 * In development (isDev), all sections are enabled by default.
 * In production, sections follow the configuration below.
 *
 * Sections marked with `isWip: true` in navigation data will only show
 * when their corresponding flag is enabled.
 */
const sectionConfig: Record<Section, boolean> = {
  [Section.HERO]: true,
  [Section.TIMELINE]: true,
  [Section.PROJECTS]: true,
  [Section.TECH_CAPABILITIES]: true,
  [Section.SKILLS]: false, // WIP - disable in production
  [Section.TESTIMONIALS]: true,
  [Section.VALUE_PROP]: false, // WIP - disable in production
  [Section.CONTACT]: false, // WIP - disable in production
  [Section.NAVBAR]: true,
  [Section.FOOTER]: true,
};

/**
 * Maps navigation href anchors to their corresponding Section enum values.
 * This allows navigation items to be controlled by the same feature flags.
 */
const anchorToSectionMap: Record<string, Section> = {
  hero: Section.HERO,
  timeline: Section.TIMELINE,
  projects: Section.PROJECTS,
  skills: Section.SKILLS,
  testimonials: Section.TESTIMONIALS,
  value: Section.VALUE_PROP,
  contact: Section.CONTACT,
};

/**
 * Check if a section is enabled.
 * In development, all sections are enabled.
 * In production, uses the sectionConfig settings.
 */
export function isSectionEnabled(section: Section): boolean {
  if (isDev) return true;
  return sectionConfig[section] ?? false;
}

/**
 * Check if a navigation anchor (href like '/#skills') should be visible.
 * Extracts the anchor and checks against the corresponding section flag.
 */
export function isNavAnchorEnabled(href: string): boolean {
  if (isDev) return true;

  const anchor = href.split("#")[1];
  if (!anchor) return true;

  const section = anchorToSectionMap[anchor];
  if (!section) return true;

  return sectionConfig[section] ?? false;
}

/**
 * Legacy flag for backward compatibility.
 * Controls visibility of sections marked as WIP in navigation.
 * Prefer using isSectionEnabled() or isNavAnchorEnabled() for new code.
 */
export const featureFlags = {
  showWipSections: isDev,
};

export { isDev };
