"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { trackEvent, GA_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "th" : "en";

    setIsChanging(true);

    // Fire tracking event
    trackEvent(GA_EVENTS.LANGUAGE_TOGGLE, {
      from_language: locale,
      to_language: nextLocale,
    });

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Construct new path
    let newPath = pathname;
    if (nextLocale === "th") {
      if (!pathname.startsWith("/th")) {
        newPath = pathname === "/" ? "/th" : `/th${pathname}`;
      }
    } else {
      if (pathname.startsWith("/th")) {
        newPath = pathname.replace(/^\/th/, "") || "/";
      }
    }

    // Navigate with hash preserved and force refresh for server components
    const hash = window.location.hash;
    router.push(`${newPath}${hash}`);
    router.refresh();

    // Reset loading state after navigation
    setTimeout(() => setIsChanging(false), 300);
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isChanging}
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        isChanging && "opacity-50 cursor-not-allowed",
      )}
      aria-label={`Switch to ${locale === "en" ? "Thai" : "English"}`}
    >
      <span
        className={cn(
          "transition-colors",
          locale === "en"
            ? "text-foreground font-semibold"
            : "text-muted-foreground",
        )}
      >
        EN
      </span>
      <span className="text-muted-foreground/30">|</span>
      <span
        className={cn(
          "transition-colors",
          locale === "th"
            ? "text-foreground font-semibold"
            : "text-muted-foreground",
        )}
      >
        TH
      </span>
    </button>
  );
}
