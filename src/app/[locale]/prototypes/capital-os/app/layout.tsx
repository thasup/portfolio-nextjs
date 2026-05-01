/**
 * CapitalOS app shell layout.
 *
 * Provides the sidebar + main content area structure
 * for all `/prototypes/capital-os/app/*` routes.
 */
import type { ReactNode } from "react";
import { CapitalOSSidebar } from "@/components/prototypes/capital-os/layout/CapitalOSSidebar";

export default function CapitalOSAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div id="capital-os-app-shell" className="flex min-h-screen">
      <CapitalOSSidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--cos-bg)" }}
      >
        {children}
      </main>
    </div>
  );
}
