/**
 * CapitalOS prototype root layout.
 *
 * Wraps every `/prototypes/capital-os/*` page in a `[data-capitalos]`
 * scope so the palette in `src/styles/palettes/capitalos.css` activates
 * cleanly without leaking tokens to the rest of the Nexus portfolio.
 *
 * The Nexus global Navbar and Footer are suppressed for any
 * `/prototypes/*` route — see the early-return in
 * `src/components/layout/Navbar.tsx` and `Footer.tsx`.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { inter } from "@/lib/capital-os/fonts";

export const metadata: Metadata = {
  title: "CapitalOS — Financial Intelligence",
  description:
    "An intelligence dashboard for personal financial data fabrication, monitoring, projection, and AI-powered insights.",
};

export default function CapitalOSLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-capitalos
      id="capital-os-root"
      className={inter.variable}
      style={{
        minHeight: "100vh",
        fontFamily: 'var(--font-inter-cos), "Inter", system-ui, sans-serif',
        background: "var(--cos-bg)",
        color: "var(--cos-text)",
      }}
    >
      {children}
    </div>
  );
}
