export interface NavigationItem {
  label: string
  href: string
  isAnchor: boolean
  isWip?: boolean
}

export const navigationItems: NavigationItem[] = [
  { label: 'About', href: '/#about', isAnchor: true },
  { label: 'Experience', href: '/#timeline', isAnchor: true },
  { label: 'Projects', href: '/#projects', isAnchor: true },
  { label: 'Skills', href: '/#skills', isAnchor: true, isWip: true },
  { label: 'Testimonials', href: '/#testimonials', isAnchor: true },
  { label: 'Value', href: '/#value', isAnchor: true, isWip: true },
  { label: 'Contact', href: '/#contact', isAnchor: true, isWip: true },
]
