"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingCTA() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="cta">
        <div className="container">
          <div className="cta-inner reveal">
            <div className="section-label" style={{ justifyContent: "center" }}>
              Built by First · May 2026
            </div>
            <h2>
              Your capital deserves
              <br />
              <em>better than a spreadsheet.</em>
            </h2>
            <p>
              CapitalOS is the intelligence layer your wealth management stack
              is missing. Stop approximating. Start reasoning.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link
                href={`/${locale}/prototypes/capital-os/app`}
                className="btn-primary"
              >
                View Live Prototype
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link href={`#agents`} className="btn-ghost">
                Read the Architecture
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
