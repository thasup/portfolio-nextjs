"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingProblem() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="problem">
        <div className="container">
          <div className="problem-intro reveal">
            <div className="section-label">The Problem</div>
            <h2>
              Three platforms.
              <br />
              Three truths.
              <br />
              Zero synthesis.
            </h2>
            <p>
              Every capital decision requires manually triangulating three
              inconsistent sources. This is a tax on decision quality that
              compounds with every baht you accumulate.
            </p>
          </div>

          <div className="sources-diagram reveal reveal-delay-1">
            <div className="source-card">
              <div className="source-icon ynab">💰</div>
              <div className="source-name">YNAB</div>
              <div className="source-role">TRANSACTION LEDGER</div>
              <div className="source-tags">
                <span className="tag ok">Cash flow ✓</span>
                <span className="tag ok">Budgets ✓</span>
                <span className="tag fail">Portfolio ✗</span>
                <span className="tag fail">Goals ✗</span>
                <span className="tag warn">Stale ±days</span>
              </div>
            </div>

            <div className="sources-middle">
              <div className="conflict-line"></div>
              <div className="vs-badge">GAP</div>
              <div className="conflict-line"></div>
            </div>

            <div className="source-card">
              <div className="source-icon airtable">📊</div>
              <div className="source-name">Airtable (Gaia)</div>
              <div className="source-role">GOAL & PORTFOLIO SYSTEM</div>
              <div className="source-tags">
                <span className="tag ok">Goals ✓</span>
                <span className="tag ok">Relational ✓</span>
                <span className="tag fail">Auto-sync ✗</span>
                <span className="tag fail">Real-time ✗</span>
              </div>
              <div className="source-gap-val">−฿395,000</div>
              <div className="source-gap-label">
                divergence from reality (April 2026)
              </div>
            </div>
          </div>

          <div className="sources-bottom reveal reveal-delay-2">
            <div className="source-card locked">
              <div className="source-icon snowball">📈</div>
              <div className="source-name">Snowball Analytics</div>
              <div className="source-role">PORTFOLIO PERFORMANCE</div>
              <div className="source-tags">
                <span className="tag ok">Visualizations ✓</span>
                <span className="tag ok">IRR tracking ✓</span>
                <span className="tag fail">Public API ✗</span>
                <span className="tag fail">Writeable ✗</span>
                <span className="tag warn">Closed island</span>
              </div>
            </div>
          </div>

          <div className="problem-statement reveal reveal-delay-3">
            <p>
              &quot;The problem is not data. All three platforms have data. The
              problem is that no single view reconciles them into{" "}
              <strong>actionable intelligence.</strong>&quot;
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
