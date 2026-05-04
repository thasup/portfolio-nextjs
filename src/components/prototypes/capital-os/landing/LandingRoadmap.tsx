"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingRoadmap() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="roadmap">
        <div className="container">
          <div className="roadmap-header reveal">
            <div className="section-label">Product Roadmap</div>
            <h2>Prototype → MVP → Production.</h2>
            <p>
              Three stages, one governing question each. Scope is ruthless. Kill
              criteria are honest.
            </p>
          </div>

          <div className="roadmap-stages">
            <div className="stage-card stage-mvp reveal reveal-delay-1">
              <div className="stage-num">Stage 1 · May–Jun 2026</div>
              <h4 className="stage-title">Reliable Personal Tool</h4>
              <div className="stage-period">6 weeks · 4–6 hours/week</div>
              <p className="stage-question">
                &ldquo;Can I make one capital decision using CapitalOS data alone —
                without opening YNAB or Airtable?&rdquo;
              </p>
              <ul className="stage-features">
                <li className="stage-feature">
                  <span className="feature-check">M1</span>Automated YNAB sync
                  via Vercel Cron (daily 02:00 ICT)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">M2</span>Divergence detector —
                  alert if any source &gt;5% off
                </li>
                <li className="stage-feature">
                  <span className="feature-check">M3</span>Snowball manual
                  snapshot UI (under 60 seconds)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">M4</span>Dashboard: 5 core
                  KPIs only (signal over noise)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">M5</span>Projection engine
                  wired to live DB baseline
                </li>
                <li className="stage-feature">
                  <span className="feature-check">M6</span>Safe CRUD:
                  confirmation modals + change log
                </li>
              </ul>
            </div>

            <div className="stage-card stage-prod reveal reveal-delay-2">
              <div className="stage-num">Stage 2 · Aug–Oct 2026</div>
              <h4 className="stage-title">Production-Ready System</h4>
              <div className="stage-period">Post-Demo Day · 4h/week max</div>
              <p className="stage-question">
                &ldquo;Would this survive 30 days of zero maintenance and still be
                trusted when I return?&rdquo;
              </p>
              <ul className="stage-features">
                <li className="stage-feature">
                  <span className="feature-check">P1</span>Weekly LLM financial
                  digest (proactive, not reactive)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">P2</span>Goal velocity alerts
                  — 2 consecutive months off-pace
                </li>
                <li className="stage-feature">
                  <span className="feature-check">P3</span>Spend pattern z-score
                  detection (&gt;20% above 3-mo avg)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">P4</span>Snowball CSV import
                  (historical data, one operation)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">P5</span>Transaction log with
                  full filtering and goal linkage
                </li>
                <li className="stage-feature">
                  <span className="feature-check">P6</span>Langfuse tracing —
                  latency and cost per AI call
                </li>
              </ul>
            </div>

            <div className="stage-card stage-scale reveal reveal-delay-3">
              <div className="stage-num">Stage 3 · Q4 2026–Q2 2027</div>
              <h4 className="stage-title">Productizable Foundation</h4>
              <div className="stage-period">Trigger: MissionOS outcome</div>
              <p className="stage-question">
                &ldquo;Can a second user connect their accounts without my help in
                under 15 minutes?&rdquo;
              </p>
              <ul className="stage-features">
                <li className="stage-feature">
                  <span className="feature-check">Pr1</span>Per-user YNAB OAuth
                  + Airtable key vault
                </li>
                <li className="stage-feature">
                  <span className="feature-check">Pr2</span>All Prisma queries
                  scoped by userId (full audit)
                </li>
                <li className="stage-feature">
                  <span className="feature-check">Pr3</span>Guided onboarding:
                  connect → map → sync → see net worth
                </li>
                <li className="stage-feature">
                  <span className="feature-check">Pr4</span>Goal templates +
                  currency configuration
                </li>
                <li className="stage-feature">
                  <span className="feature-check">Pr5</span>Stripe billing:
                  $9/mo personal · $15/mo household
                </li>
                <li className="stage-feature">
                  <span className="feature-check">Pr6</span>Sentry + Axiom +
                  Langfuse full observability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
