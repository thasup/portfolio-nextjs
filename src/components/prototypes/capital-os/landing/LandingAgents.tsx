"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingAgents() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="agents">
        <div className="container">
          <div className="agents-header reveal">
            <div className="section-label">Intelligence Layer</div>
            <h2>
              Four agents.
              <br />
              One reasoning loop.
            </h2>
            <p>
              CapitalOS implements a multi-agent architecture where each agent
              thinks in a different mode — and all four collaborate before any
              recommendation reaches you.
            </p>
          </div>

          <div className="agents-grid">
            <div className="agent-card accountant reveal reveal-delay-1">
              <div className="agent-header">
                <div className="agent-icon">🔢</div>
                <div className="agent-trust">
                  <span className="trust-label">Trust Factor</span>
                  <div className="trust-bar">
                    <div className="trust-fill" data-width="100"></div>
                  </div>
                  <span className="agent-trust-pct">100%</span>
                </div>
              </div>
              <h4 className="agent-title">The Accountant</h4>
              <div className="agent-subtitle">Reconciliation & Consistency</div>
              <p className="agent-desc">
                Makes the three sources tell the same story. Computes canonical
                net worth, detects divergence above 5%, and surfaces
                reconciliation failures before any decision is made. Questions
                everything. Assumes nothing.
              </p>
              <ul className="agent-outputs">
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"Net worth is ฿500,000
                  as of sync time. Manual records last updated 180 days ago (gap:
                  ฿400K)."
                </li>
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"YNAB matches within
                  ฿1,200 rounding tolerance. No action required."
                </li>
              </ul>
            </div>

            <div className="agent-card analyst reveal reveal-delay-2">
              <div className="agent-header">
                <div className="agent-icon">📡</div>
                <div className="agent-trust">
                  <span className="trust-label">Trust Factor</span>
                  <div className="trust-bar">
                    <div className="trust-fill" data-width="80"></div>
                  </div>
                  <span className="agent-trust-pct">80%</span>
                </div>
              </div>
              <h4 className="agent-title">The Analyst</h4>
              <div className="agent-subtitle">Pattern & Anomaly Detection</div>
              <p className="agent-desc">
                Finds signals in noise using z-score analysis and trend
                detection. What's normal? What's unusual? Surfaces patterns
                you'd never notice manually across 90 days of transaction
                history.
              </p>
              <ul className="agent-outputs">
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"Health & Fitness: ฿15K
                  this month, 300% above 3-month average. Intentional?"
                </li>
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"Wedding Fund: ฿0
                  contribution for 8 weeks. At current velocity, misses target
                  by 18 months."
                </li>
              </ul>
            </div>

            <div className="agent-card strategist reveal reveal-delay-3">
              <div className="agent-header">
                <div className="agent-icon">🔭</div>
                <div className="agent-trust">
                  <span className="trust-label">Trust Factor</span>
                  <div className="trust-bar">
                    <div className="trust-fill" data-width="60"></div>
                  </div>
                  <span className="agent-trust-pct">60%</span>
                </div>
              </div>
              <h4 className="agent-title">The Strategist</h4>
              <div className="agent-subtitle">
                Scenario & Trajectory Modeling
              </div>
              <p className="agent-desc">
                Models outcomes of decisions across 24-month horizons. Simulates
                burn rate, income changes, investment returns, and goal
                timelines simultaneously. Useful for comparison — not
                prediction.
              </p>
              <ul className="agent-outputs">
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"Paying off ฿50K in
                  credit cards today extends runway by 2.5 months."
                </li>
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"If MissionOS succeeds
                  in month 4 at ฿80K/mo, net worth reaches ฿1.1M by Dec '27."
                </li>
              </ul>
            </div>

            <div className="agent-card advisor reveal reveal-delay-4">
              <div className="agent-header">
                <div className="agent-icon">🧭</div>
                <div className="agent-trust">
                  <span className="trust-label">Trust Factor</span>
                  <div className="trust-bar">
                    <div className="trust-fill" data-width="50"></div>
                  </div>
                  <span className="agent-trust-pct">50%</span>
                </div>
              </div>
              <h4 className="agent-title">The Advisor</h4>
              <div className="agent-subtitle">
                Recommendation & Decision Support
              </div>
              <p className="agent-desc">
                Synthesizes inputs from all three agents and recommends
                specific, reversible actions ranked by leverage. Always explains
                assumptions. Always defers the final decision to you.
                Recommends, never executes.
              </p>
              <ul className="agent-outputs">
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"Pay ฿50,000 from savings
                  to credit cards today. Saves ฿600/month interest. Liquid drops
                  to ฿350K — still 14 months runway."
                </li>
                <li className="agent-output-item">
                  <span className="output-arrow">→</span>"This recommendation
                  assumes MissionOS income begins month 4. Revise if timeline
                  shifts."
                </li>
              </ul>
            </div>
          </div>

          <div className="agent-pipeline reveal">
            <div className="pipeline-label">
              Reasoning Pipeline — Sequential, Transparent, Human-in-the-Loop
            </div>
            <div className="pipeline-flow">
              <div className="pipeline-step">
                <div
                  className="pipeline-node"
                  style={{
                    background: "var(--emerald-dim)",
                    borderColor: "rgba(0,201,122,0.3)",
                  }}
                >
                  🔢
                </div>
                <div className="pipeline-node-label">
                  Accountant
                  <br />
                  Reconcile
                </div>
              </div>
              <div className="pipeline-arrow"></div>
              <div className="pipeline-step">
                <div
                  className="pipeline-node"
                  style={{
                    background: "var(--sapphire-dim)",
                    borderColor: "rgba(58,130,247,0.3)",
                  }}
                >
                  📡
                </div>
                <div className="pipeline-node-label">
                  Analyst
                  <br />
                  Detect
                </div>
              </div>
              <div className="pipeline-arrow"></div>
              <div className="pipeline-step">
                <div
                  className="pipeline-node"
                  style={{
                    background: "var(--amber-dim)",
                    borderColor: "rgba(240,160,32,0.3)",
                  }}
                >
                  🔭
                </div>
                <div className="pipeline-node-label">
                  Strategist
                  <br />
                  Model
                </div>
              </div>
              <div className="pipeline-arrow"></div>
              <div className="pipeline-step">
                <div
                  className="pipeline-node"
                  style={{
                    background: "var(--violet-dim)",
                    borderColor: "rgba(155,109,255,0.3)",
                  }}
                >
                  🧭
                </div>
                <div className="pipeline-node-label">
                  Advisor
                  <br />
                  Synthesize
                </div>
              </div>
              <div className="pipeline-arrow"></div>
              <div className="pipeline-step">
                <div
                  className="pipeline-node"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  👤
                </div>
                <div className="pipeline-node-label">
                  You
                  <br />
                  Decide
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
