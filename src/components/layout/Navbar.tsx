'use client'

import Link from 'next/link'
import { Menu, FileText } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { siteConfig } from '@/data/siteConfig'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { featureFlags } from '@/lib/featureFlags'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')
  const { showWipSections } = featureFlags

  const baseItems = useMemo(
    () => [
      { id: 'hero', label: t('about'), href: '/#hero' },
      { id: 'timeline', label: t('experience'), href: '/#timeline' },
      { id: 'projects', label: t('projects'), href: '/#projects' },
      { id: 'skills', label: t('skills'), href: '/#skills', isWip: true },
      { id: 'testimonials', label: t('testimonials'), href: '/#testimonials' },
      { id: 'value', label: t('value'), href: '/#value', isWip: true },
      { id: 'contact', label: t('contact'), href: '/#contact', isWip: true },
    ],
    [t]
  )

  const navItems = useMemo(
    () => baseItems.filter((item) => showWipSections || !item.isWip),
    [baseItems, showWipSections]
  )

  const sectionIds = useMemo(
    () =>
      navItems
        .filter((item) => item.href.startsWith('/#'))
        .map((item) => item.href.split('#')[1] || ''),
    [navItems]
  )

  const activeSection = useScrollSpy(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (!activeSection) return false
    return href.includes(`#${activeSection}`)
  }

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'glass border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      )}
      aria-label={t('sr_navigation')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Name */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight transition-colors hover:text-primary z-50 relative"
        >
          {siteConfig.name.split(' ')[0]}
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <LanguageToggle />
          {siteConfig.resumeUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                {t('resume')}
              </a>
            </Button>
          )}
          {/* <Button size="sm" asChild>
            <Link href="/contact/">{t('hire_me')}</Link>
          </Button> */}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                {siteConfig.resumeUrl && (
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      {t('resume')}
                    </a>
                  </Button>
                )}
                <Button className="mt-2" asChild>
                  <Link href="/contact/" onClick={() => setOpen(false)}>
                    {t('hire_me')}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
