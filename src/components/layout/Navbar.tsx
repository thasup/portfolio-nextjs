"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { NavbarAuthProfile } from "@/components/layout/NavbarAuthProfile";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { isNavAnchorEnabled } from "@/lib/featureFlags";
import { getPrototypeConfig } from "@/data/prototypes";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname() ?? "";

  // Determine mode: Landing vs Nexus vs Prototype Project
  const { isLandingPage, activePrototypeId } = useMemo(() => {
    const normalized = pathname.replace(/^\/(en|th)/, "") || "/";
    const isLanding = normalized === "/";
    const segments = normalized.split("/").filter(Boolean);
    const protoId = segments[0] === "prototypes" && segments.length > 1 ? segments[1] : null;
    
    return { 
      isLandingPage: isLanding, 
      activePrototypeId: protoId 
    };
  }, [pathname]);

  const protoConfig = useMemo(() => 
    activePrototypeId ? getPrototypeConfig(activePrototypeId) : null
  , [activePrototypeId]);

  const baseItems = useMemo(
    () => [
      { id: "hero", label: t("about"), href: "/#hero" },
      { id: "timeline", label: t("experience"), href: "/#timeline" },
      { id: "projects", label: t("projects"), href: "/#projects" },
      { id: "skills", label: t("skills"), href: "/#skills" },
      { id: "testimonials", label: t("testimonials"), href: "/#testimonials" },
      { id: "value", label: t("value"), href: "/#value" },
      { id: "contact", label: t("contact"), href: "/#contact" },
    ],
    [t]
  );

  const nexusItems = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      { id: "prototypes", label: t("prototypes"), href: "/prototypes" },
      { id: "articles", label: t("articles"), href: "/articles" },
    ],
    [t]
  );

  const navItems = useMemo(
    () => baseItems.filter((item) => isNavAnchorEnabled(item.href)),
    [baseItems]
  );

  const displayItems = isLandingPage ? navItems : nexusItems;

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

  // Global control: Hide navbar if prototype explicitly requests it
  if (protoConfig?.hideGlobalNav) return null;

  const isActive = (href: string) => {
    if (href.includes("#")) {
      if (!activeSection) return false;
      return href.includes(`#${activeSection}`);
    }
    const normalizedPath = pathname.replace(/^\/(en|th)/, "") || "/";
    return normalizedPath === href;
  };

  const navContent = (
    <>
      <div className="flex items-center gap-2 z-50 relative">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          Thanachon
          <span className="text-primary">.</span>
        </Link>
        {!isLandingPage && (
          <div className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
            Nexus
          </div>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="hidden items-center gap-1 md:flex absolute left-1/2 -translate-x-1/2">
        {displayItems.map((item) => (
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
        <NavbarAuthProfile />
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center gap-2 md:hidden">
        <LanguageToggle />
        <ThemeToggle />
        <NavbarAuthProfile />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label={t("open_menu")}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">{t("menu_title")}</SheetTitle>
            <div className="mt-8 flex flex-col gap-1">
              {displayItems.map((item) => (
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
    <header 
      className={cn(
        "hdr flex items-center justify-between px-6 py-4 border-b border-[var(--color-line-soft)] bg-[var(--color-paper)] z-40 fixed top-0 w-full transition-all duration-300",
        scrolled ? "py-3 shadow-sm" : "py-4"
      )}
    >
      {navContent}
    </header>
  );
}

