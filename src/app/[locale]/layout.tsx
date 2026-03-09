import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { sarabun } from '@/lib/fonts'
import { ThemeProvider } from 'next-themes'
import { GoogleAnalytics } from '@next/third-parties/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { ModalProvider } from '@/components/modal/ModalContext'
import { ModalShell } from '@/components/modal/ModalShell'
import { siteConfig } from '@/data/siteConfig'
import '@/styles/globals.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })

  return {
    title: {
      default: `${siteConfig.name} — ${t('title')}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: t('description'),
    metadataBase: new URL(siteConfig.siteUrl),
    openGraph: {
      title: `${siteConfig.name} — ${t('title')}`,
      description: t('description'),
      url: siteConfig.siteUrl,
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} — ${t('title')}`,
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body 
        className={`min-h-screen bg-background font-sans antialiased ${
          locale === 'th' ? 'font-sarabun leading-loose' : ''
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>
              <ScrollProgress />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <ModalShell />
            </ModalProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
