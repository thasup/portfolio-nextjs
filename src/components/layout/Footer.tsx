import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { navigationItems } from '@/data/navigation'
import { featureFlags } from '@/lib/featureFlags'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const tConfig = useTranslations('siteConfig')
  const { showWipSections } = featureFlags
  const footerNavItems = navigationItems.filter((item) => showWipSections || !item.isWip)

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold">
              {siteConfig.name.split(' ')[0]}
              <span className="text-primary">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {tConfig('title')} · {tConfig('location')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('navigation')}
            </h3>
            <ul className="space-y-2">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('connect')}
            </h3>
            <div className="flex gap-3">
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. {t('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
