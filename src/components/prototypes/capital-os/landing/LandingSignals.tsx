"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingSignals() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="signals">
        <div className="container">
          <div className="signals-header reveal">
            <div className="section-label">Signal Theory</div>
            <h2>Measure everything. Surface only what matters.</h2>
            <p>
              A bad intelligence system drowns you in alerts. A good one
              surfaces only the signal that demands your attention — right now.
            </p>
          </div>

          <div className="signals-tiers">
            <div className="signal-tier tier-1 reveal reveal-delay-1">
              <div className="tier-header">
                <div className="tier-num">I</div>
                <div className="tier-name">Foundational</div>
              </div>
              <div className="tier-cadence">Alert immediately · Always on</div>
              <div className="tier-items">
                <span className="tier-item">Net worth accuracy (±฿1K)</span>
                <span className="tier-item">Liquid capital</span>
                <span className="tier-item">Runway (months)</span>
                <span className="tier-item">Credit card debt</span>
                <span className="tier-item">Data freshness</span>
              </div>
            </div>
            <div className="signal-tier tier-2 reveal reveal-delay-2">
              <div className="tier-header">
                <div className="tier-num">II</div>
                <div className="tier-name">Decision</div>
              </div>
              <div className="tier-cadence">
                Weekly review · Drive recommendations
              </div>
              <div className="tier-items">
                <span className="tier-item">Burn rate (7-day avg)</span>
                <span className="tier-item">Goal velocity</span>
                <span className="tier-item">Portfolio return</span>
                <span className="tier-item">Source divergence</span>
                <span className="tier-item">Deadline alignment</span>
              </div>
            </div>
            <div className="signal-tier tier-3 reveal reveal-delay-3">
              <div className="tier-header">
                <div className="tier-num">III</div>
                <div className="tier-name">Contextual</div>
              </div>
              <div className="tier-cadence">Monthly · Inform reasoning</div>
              <div className="tier-items">
                <span className="tier-item">Spend z-score by category</span>
                <span className="tier-item">Goal deadline pressure</span>
                <span className="tier-item">Income assumptions</span>
                <span className="tier-item">Relationship budget shifts</span>
              </div>
            </div>
            <div className="signal-tier tier-4 reveal reveal-delay-4">
              <div className="tier-header">
                <div className="tier-num">IV</div>
                <div className="tier-name">Noise</div>
              </div>
              <div className="tier-cadence">Rarely · Mostly ignore</div>
              <div className="tier-items">
                <span className="tier-item noise">
                  Transaction categorization
                </span>
                <span className="tier-item noise">Daily portfolio swings</span>
                <span className="tier-item noise">
                  Micro-vehicle optimization
                </span>
                <span className="tier-item noise">
                  Individual FX fluctuation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
