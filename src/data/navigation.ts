export interface NavigationItem {
  label: string
  href: string
  isAnchor: boolean
}

export const navigationItems: NavigationItem[] = [
  { label: 'Timeline', href: '/#timeline', isAnchor: true },
  { label: 'Projects', href: '/#projects', isAnchor: true },
  { label: 'Skills', href: '/#skills', isAnchor: true },
  { label: 'Testimonials', href: '/#testimonials', isAnchor: true },
  { label: 'About', href: '/about/', isAnchor: false },
  { label: 'Contact', href: '/contact/', isAnchor: false },
]
