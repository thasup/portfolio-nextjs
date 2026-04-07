export interface NavigationItem {
  label: string
  href: string
  isAnchor: boolean
  /** @deprecated Visibility is now controlled centrally in @/lib/featureFlags */
  isWip?: boolean
}

export const navigationItems: NavigationItem[] = [
  { label: 'About', href: '/#about', isAnchor: true },
  { label: 'Experience', href: '/#timeline', isAnchor: true },
  { label: 'Projects', href: '/#projects', isAnchor: true },
  { label: 'Skills', href: '/#skills', isAnchor: true },
  { label: 'Testimonials', href: '/#testimonials', isAnchor: true },
  { label: 'Value', href: '/#value', isAnchor: true },
  { label: 'Contact', href: '/#contact', isAnchor: true },
]
