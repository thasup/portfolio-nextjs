'use client'

import { createContext, useContext, useTransition, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

type Locale = 'en' | 'th'

interface LocaleContextType {
  setLocale: (locale: Locale) => void
  isPending: boolean
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale: Locale
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const setLocale = (newLocale: Locale) => {
    const currentLocale = pathname.startsWith('/th') ? 'th' : 'en'
    if (newLocale === currentLocale) return

    // Fire tracking event
    trackEvent(GA_EVENTS.LANGUAGE_TOGGLE, {
      from_language: currentLocale,
      to_language: newLocale,
    })

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Navigate in transition for smooth update
    startTransition(() => {
      let newPath = pathname
      if (newLocale === 'th') {
        if (!pathname.startsWith('/th')) {
          newPath = pathname === '/' ? '/th' : `/th${pathname}`
        }
      } else {
        if (pathname.startsWith('/th')) {
          newPath = pathname.replace(/^\/th/, '') || '/'
        }
      }

      const hash = window.location.hash
      router.replace(`${newPath}${hash}`)
      router.refresh()
    })
  }

  return (
    <LocaleContext.Provider value={{ setLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocaleContext() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocaleContext must be used within LocaleProvider')
  }
  return context
}
