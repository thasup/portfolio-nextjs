"use client";

/**
 * CapitalOS sidebar navigation.
 *
 * A clean, collapsible sidebar with two-tier navigation:
 * - Primary: Dashboard, Accounts, Projection, Goals
 * - Secondary: Transactions, Intelligence, Settings (Phase 2+)
 */
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { JSX } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Wallet,
  Receipt,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  ArrowRightLeft,
  Scale,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  badge?: string;
  isRoot?: boolean;
}

const NAV_PRIMARY: NavItem[] = [
  {
    id: "nav-dashboard",
    title: "Dashboard",
    href: "dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "nav-accounts",
    title: "Accounts",
    href: "accounts",
    icon: Wallet,
  },
  {
    id: "nav-projection",
    title: "Projection",
    href: "projection",
    icon: TrendingUp,
  },
  {
    id: "nav-goals",
    title: "Goals",
    href: "goals",
    icon: Target,
  },
  {
    id: "nav-intelligence",
    title: "Intelligence",
    href: "intelligence",
    icon: Brain,
  },
];

const NAV_SECONDARY: NavItem[] = [
  {
    id: "nav-transactions",
    title: "Transactions",
    href: "transactions",
    icon: Receipt,
    badge: "Phase 4",
  },
  {
    id: "nav-mapping",
    title: "Mapping",
    href: "mapping",
    icon: ArrowRightLeft,
    badge: "v4",
  },
  {
    id: "nav-reconciliation",
    title: "Reconcile",
    href: "reconciliation",
    icon: Scale,
    badge: "v4",
  },
  {
    id: "nav-snapshots",
    title: "Snapshots",
    href: "snapshots",
    icon: HardDrive,
    badge: "Data",
  },
  {
    id: "nav-settings",
    title: "Settings",
    href: "settings",
    icon: Settings,
    badge: "Phase 4",
  },
];


export function CapitalOSSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile drawer on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const sidebar = document.getElementById("capital-os-sidebar");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Extract the base path to build relative links
  const segments = pathname.split("/");
  const localeIndex = segments.findIndex((s) => s === "en" || s === "th");
  const locale = segments[localeIndex] || "en";
  const basePath = `/${locale}/prototypes/capital-os/app`;

  const getHref = (item: NavItem) => {
    return item.isRoot ? `/${locale}${item.href}` : `${basePath}/${item.href}`;
  };

  const isActive = (item: NavItem) => {
    const fullHref = getHref(item);
    if (item.isRoot) {
      return pathname === fullHref;
    }
    return pathname === fullHref || pathname.startsWith(`${fullHref}/`);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`
          fixed bottom-4 right-4 z-40 rounded-lg p-3 shadow-lg
          transition-opacity duration-200 md:hidden
          ${mobileOpen ? "pointer-events-none opacity-0" : "opacity-100"}
        `}
        style={{
          background: "var(--cos-surface)",
          border: "1px solid var(--cos-border-subtle)",
          color: "var(--cos-text)",
        }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="capital-os-sidebar"
        className={`
          flex flex-col border-r transition-all duration-300 ease-in-out
          h-screen w-[260px]
          fixed top-0 left-0 z-50
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:sticky md:top-0 md:translate-x-0
          ${collapsed ? "md:w-[68px]" : "md:w-[260px]"}
        `}
        style={{
          background: "var(--cos-surface)",
          borderColor: "var(--cos-border-subtle)",
        }}
      >
      {/* ── Header ─────────────────────────────────── */}
      <div
        className="flex items-center justify-between border-b px-4 py-4"
        style={{ borderColor: "var(--cos-border-subtle)" }}
      >
        <Link
          href={`${basePath}/dashboard`}
          className="flex items-center gap-3 hover:bg-[var(--cos-surface-2)] transition-colors"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/capital_os/icons/capital_os-icon.png"
              alt="CapitalOS"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold">CapitalOS</span>
              <span
                className="truncate text-xs"
                style={{ color: "var(--cos-text-2)" }}
              >
                Financial Intelligence
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1 md:hidden"
          style={{ color: "var(--cos-text-3)" }}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ── Primary nav ────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2">
          {(!collapsed || mobileOpen) && (
            <span
              className="mb-2 block px-2 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--cos-text-3)" }}
            >
              Platform
            </span>
          )}
          <ul className="space-y-1">
            {NAV_PRIMARY.map((item) => (
              <li key={item.id}>
                <Link
                  id={item.id}
                  href={getHref(item)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                    transition-colors duration-150
                    ${isActive(item) ? "" : "hover:bg-[var(--cos-surface-2)]"}
                  `}
                  style={{
                    background: isActive(item)
                      ? "var(--cos-accent-muted)"
                      : undefined,
                    color: isActive(item)
                      ? "var(--cos-accent)"
                      : "var(--cos-text-2)",
                  }}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {(!collapsed || mobileOpen) && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Secondary nav ──────────────────────────── */}
        <div className="mt-6">
          {(!collapsed || mobileOpen) && (
            <span
              className="mb-2 block px-2 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--cos-text-3)" }}
            >
              Advanced
            </span>
          )}
          <ul className="space-y-1">
            {NAV_SECONDARY.map((item) => (
              <li key={item.id}>
                <Link
                  id={item.id}
                  href={getHref(item)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                    transition-colors duration-150
                    ${isActive(item) ? "" : "hover:bg-[var(--cos-surface-2)]"}
                  `}
                  style={{
                    background: isActive(item)
                      ? "var(--cos-accent-muted)"
                      : undefined,
                    color: isActive(item)
                      ? "var(--cos-accent)"
                      : "var(--cos-text-2)",
                  }}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {(!collapsed || mobileOpen) && (
                    <>
                      <span>{item.title}</span>
                      {item.badge && (
                        <span
                          className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: "var(--cos-surface-2)",
                            color: "var(--cos-text-3)",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </nav>

      {/* ── Collapse toggle (desktop) ─────────────── */}
      <div
        className="hidden md:block border-t px-3 py-3"
        style={{ borderColor: "var(--cos-border-subtle)" }}
      >
        <button
          id="capital-os-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-[var(--cos-surface-2)]"
          style={{ color: "var(--cos-text-3)" }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Close toggle (mobile) ──────────────────── */}
      <div
        className="md:hidden border-t px-3 py-3"
        style={{ borderColor: "var(--cos-border-subtle)" }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-[var(--cos-surface-2)]"
          style={{ color: "var(--cos-text-3)" }}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
    </>
  );
}
