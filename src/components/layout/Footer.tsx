import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { navigationItems } from '@/data/navigation'
import { isNavAnchorEnabled } from '@/lib/featureFlags'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const footerNavItems = navigationItems.filter((item) => isNavAnchorEnabled(item.href) && item.isAnchor)


  return (
    <footer className="border-t border-[var(--color-line-soft)] bg-[var(--color-paper)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-[var(--color-ink)]">
              {siteConfig.name.split(' ')[0]}
              <span className="text-[var(--color-praxis-accent)]">.</span>
            </Link>
            <p className="mt-2 text-sm text-[var(--color-ink-3)]">
              {t('headline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 eyebrow text-[var(--color-ink-3)]">
              {t('navigation')}
            </h3>
            <ul className="space-y-2">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Articles */}
          <div>
            <h3 className="mb-3 eyebrow text-[var(--color-ink-3)]">
              {t('articles')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {t('allArticles')}
                </Link>
              </li>
            </ul>
          </div>

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
