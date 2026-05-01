'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { navigationItems } from '@/data/navigation'
import { isNavAnchorEnabled } from '@/lib/featureFlags'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const pathname = usePathname() ?? ''
  const footerNavItems = navigationItems.filter((item) => isNavAnchorEnabled(item.href) && item.isAnchor)

  const isLandingPage = pathname === '/' || pathname === '/en' || pathname === '/th' || pathname === '/en/' || pathname === '/th/';

  return (
    <footer className="border-t border-[var(--color-line-soft)] bg-[var(--color-paper)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-[var(--color-ink)] flex items-center gap-2">
              <span>
                Thanachon
                <span className="text-[var(--color-praxis-accent)]">.</span>
              </span>
              {!isLandingPage && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                  Nexus
                </span>
              )}
            </Link>
            <p className="mt-2 text-sm text-[var(--color-ink-3)]">
              {t('headline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 eyebrow text-[var(--color-ink-3)]">
              {isLandingPage ? t('navigation') : 'Nexus'}
            </h3>
            <ul className="space-y-2">
              {isLandingPage ? (
                footerNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/" className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]">
                      {t('home')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/prototypes" className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]">
                      {t('prototypes')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/articles" className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]">
                      {t('articles')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          {isLandingPage ? (
            <div>
              <h3 className="mb-3 eyebrow text-[var(--color-ink-3)]">
                {t('resources')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/articles"
                    className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {t('articles')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prototypes"
                    className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {t('prototypes')}
                  </Link>
                </li>
              </ul>
            </div>
          ) : <div />}

          {/* Social */}
          <div>
            <h3 className="mb-3 eyebrow text-[var(--color-ink-3)]">
              {t('connect')}
            </h3>
            <div className="flex gap-3">
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="rounded-md p-2 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-line-soft)] pt-6 text-center text-sm text-[var(--color-ink-3)]">
          © {new Date().getFullYear()} {siteConfig.name}. {t('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
