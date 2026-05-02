"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingHero() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="hero">
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="hero-badge reveal">
            <div className="hero-badge-dot"></div>
            Personal Financial Intelligence · Built May 2026
          </div>

          <p className="hero-problem-statement reveal reveal-delay-1">
            Three platforms.
            <br />
            Three truths.
            <br />
            <span style={{ color: "var(--emerald)" }}>Zero synthesis.</span>
          </p>

          <h1 className="hero-title reveal reveal-delay-2">
            One source
            <br />
            of financial <em>truth.</em>
          </h1>

          <p className="hero-sub reveal reveal-delay-3">
            CapitalOS collapses YNAB, Airtable, and Snowball into a single
            authoritative intelligence layer — so every capital decision is made
            from reconciled, real-time data, not manual approximation.
          </p>

          <div className="hero-actions reveal reveal-delay-4">
            <Link href={`#agents`} className="btn-primary">
              Explore Intelligence Layer
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
          </div>

          <div className="hero-stats reveal reveal-delay-5">
            <div className="hero-stat">
              <span className="hero-stat-val">
                <span className="unit">฿</span>
                <span className="counter" data-target="500000">
                  0
                </span>
              </span>
              <span className="hero-stat-label">Net Worth Managed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-val">
                <span className="counter" data-target="14">
                  0
                </span>
              </span>
              <span className="hero-stat-label">Accounts Tracked</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-val">
                <span className="counter" data-target="3">
                  0
                </span>
              </span>
              <span className="hero-stat-label">Sources Unified</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-val">
                <span className="counter" data-target="6">
                  0
                </span>
              </span>
              <span className="hero-stat-label">Goals Monitored</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-val">
                <span className="counter" data-target="4">
                  0
                </span>
              </span>
              <span className="hero-stat-label">AI Agents Active</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
