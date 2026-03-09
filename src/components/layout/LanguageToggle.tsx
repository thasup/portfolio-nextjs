'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { trackEvent, GA_EVENTS } from '@/lib/analytics';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    
    // Fire tracking event before navigation
    trackEvent(GA_EVENTS.LANGUAGE_TOGGLE, {
      from_language: locale,
      to_language: nextLocale
    });

    // Set cookie for next-intl detection
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Construct the new path based on routing strategy (Strategy B)
    let newPath = pathname;
    if (nextLocale === 'th') {
      if (!pathname.startsWith('/th')) {
        newPath = pathname === '/' ? '/th' : `/th${pathname}`;
      }
    } else {
      if (pathname.startsWith('/th')) {
        newPath = pathname.replace(/^\/th/, '') || '/';
      }
    }

    // Retain hash if present
    const hash = window.location.hash;
    router.replace(`${newPath}${hash}`);
  };

  return (
    <button
      onClick={toggleLocale}
      className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      aria-label={`Switch to ${locale === 'en' ? 'Thai' : 'English'}`}
    >
      <span className={locale === 'en' ? 'font-bold' : 'text-muted-foreground'}>EN</span>
      <span className="mx-2 text-muted-foreground/30">|</span>
      <span className={locale === 'th' ? 'font-bold' : 'text-muted-foreground'}>TH</span>
    </button>
  );
}
