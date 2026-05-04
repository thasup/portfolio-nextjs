"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingMetrics() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="metrics">
        <div className="container">
          <div className="metrics-header reveal">
            <div className="section-label">Real Numbers</div>
            <h2>Built on actual financial complexity.</h2>
            <p>
              CapitalOS was designed around a real portfolio — not synthetic
              data.
            </p>
          </div>

          <div className="metrics-grid reveal reveal-delay-1">
            <div className="metric-cell">
              <div className="metric-number">
                <span className="accent">฿</span>
                <span className="counter" data-target="500000">
                  0
                </span>
              </div>
              <div className="metric-desc">Net worth tracked</div>
            </div>
            <div className="metric-cell">
              <div className="metric-number">
                <span className="counter" data-target="14">
                  0
                </span>
              </div>
              <div className="metric-desc">Accounts across 3 platforms</div>
            </div>
            <div className="metric-cell">
              <div className="metric-number">
                <span className="accent">฿</span>
                <span className="counter" data-target="400000">
                  0
                </span>
              </div>
              <div className="metric-desc">
                Divergence eliminated on first sync
              </div>
            </div>
            <div className="metric-cell">
              <div className="metric-number">
                <span className="counter" data-target="6">
                  0
                </span>
              </div>
              <div className="metric-desc">
                Active financial goals monitored
              </div>
            </div>
            <div className="metric-cell">
              <div className="metric-number">
                <span className="counter" data-target="17">
                  0
                </span>
                <span className="accent">mo</span>
              </div>
              <div className="metric-desc">
                Runway projected with scenario sim
              </div>
            </div>
            <div className="metric-cell">
              <div className="metric-number">
                <span className="counter" data-target="4">
                  0
                </span>
              </div>
              <div className="metric-desc">Reasoning agents in pipeline</div>
            </div>
          </div>

          <div className="divergence-alert reveal reveal-delay-2">
            <div className="alert-icon">⚠️</div>
            <div className="alert-body">
              <div className="alert-title">
                Real example: Stale snapshot showed ฿250K. Reality was ฿650K.
              </div>
              <div className="alert-desc">
                After a large income deposit, the manual spreadsheet
                net worth field remained unchanged for months
                because no one updated it. CapitalOS detected
                this divergence on first sync and flagged it as a{" "}
                <code>CRITICAL</code> reconciliation failure. That&apos;s what the
                Accountant agent exists to do.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
