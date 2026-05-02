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
  Activity,
} from "lucide-react";
import { useState } from "react";

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
    <aside
      id="capital-os-sidebar"
      className={`
        flex flex-col border-r transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[260px]"}
      `}
      style={{
        background: "var(--cos-surface)",
        borderColor: "var(--cos-border-subtle)",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <Link
        href={`${basePath}/dashboard`}
        className="flex items-center gap-3 border-b px-4 py-4 hover:bg-[var(--cos-surface-2)] transition-colors"
        style={{ borderColor: "var(--cos-border-subtle)" }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--cos-accent)", color: "#fff" }}
        >
          <Activity className="h-4 w-4" />
        </div>
        {!collapsed && (
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

      {/* ── Primary nav ────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2">
          {!collapsed && (
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
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Secondary nav ──────────────────────────── */}
        <div className="mt-6">
          {!collapsed && (
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
                  {!collapsed && (
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

      {/* ── Collapse toggle ────────────────────────── */}
      <div
        className="border-t px-3 py-3"
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
    </aside>
  );
}
