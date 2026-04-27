"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, FileText } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { siteConfig } from "@/data/siteConfig";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { isNavAnchorEnabled } from "@/lib/featureFlags";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname() ?? "";

  // Standalone prototype surfaces (e.g. /prototypes/market-os) own their
  // own chrome — suppress the Nexus global navbar there. Computed before
  // any other hooks below; the actual early-return happens after all
  // hooks so the hook order stays stable across renders.
  const isStandalone =
    pathname.startsWith("/prototypes") ||
    pathname.startsWith("/en/prototypes") ||
    pathname.startsWith("/th/prototypes");

  const baseItems = useMemo(
    () => [
      { id: "hero", label: t("about"), href: "/#hero" },
      { id: "timeline", label: t("experience"), href: "/#timeline" },
      { id: "projects", label: t("projects"), href: "/#projects" },
      { id: "skills", label: t("skills"), href: "/#skills" },
      { id: "testimonials", label: t("testimonials"), href: "/#testimonials" },
      { id: "value", label: t("value"), href: "/#value" },
      { id: "contact", label: t("contact"), href: "/#contact" },
      // { id: "articles", label: t("articles"), href: "/articles" },
      // { id: "learn", label: t("learn"), href: "/learn" }
    ],
    [t]
  );

  const navItems = useMemo(
    () => baseItems.filter((item) => isNavAnchorEnabled(item.href)),
    [baseItems]
  );

  const sectionIds = useMemo(
    () =>
      navItems
        .filter((item) => item.href.startsWith("/#"))
        .map((item) => item.href.split("#")[1] || ""),
    [navItems]
  );

  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isStandalone) return null;

  const isActive = (href: string) => {
    // Handle non-anchor links (e.g., /articles)
    if (!href.includes("#")) {
      return false; // These are handled by the router's active state
    }
    // Handle anchor links (e.g., /#hero)
    if (!activeSection) return false;
    return href.includes(`#${activeSection}`);
  };

  const navContent = (
    <>
      <Link
        href="/"
        className="text-lg font-bold tracking-tight transition-colors hover:text-primary z-50 relative"
      >
        Thanachon
        <span className="text-primary">.</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden items-center gap-1 md:flex absolute left-1/2 -translate-x-1/2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
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
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center gap-2 md:hidden">
        <LanguageToggle />
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label={t("open_menu")}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">{t("menu_title")}</SheetTitle>
            <div className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-border" />
              <Button className="mt-2" asChild>
                <Link href="/contact/" onClick={() => setOpen(false)}>
                  {t("hire_me")}
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );

  return (
    <header className="hdr flex items-center justify-between px-6 py-4 border-b border-[var(--color-line-soft)] bg-[var(--color-paper)] z-40 fixed top-0 w-full">
      {navContent}
    </header>
  );
}
