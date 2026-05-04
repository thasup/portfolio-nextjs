"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingThesis() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="thesis">
        <div className="container">
          <div className="thesis-grid">
            <div className="thesis-content reveal">
              <div className="section-label">Core Thesis</div>
              <h2>Intelligence, not information.</h2>
              <p>
                Structured data alone tells you what <em>is</em>. An LLM with
                full financial context tells you what it <em>means</em>, what to
                do next, and what you&apos;re missing.
              </p>
              <p>
                CapitalOS is not a dashboard that displays data. It is a
                reasoning system that synthesizes it.
              </p>

              <div className="thesis-principles">
                <div className="principle">
                  <div className="principle-num">01</div>
                  <div className="principle-text">
                    <strong>Data without synthesis is noise.</strong> Three
                    separate mental models that must be manually reconciled
                    before any decision is cognitive overhead that compounds.
                  </div>
                </div>
                <div className="principle">
                  <div className="principle-num">02</div>
                  <div className="principle-text">
                    <strong>
                      Decisions made on stale data are structurally worse.
                    </strong>{" "}
                    The ฿395K divergence is not an edge case — it is the
                    predictable output of a manual system under time pressure.
                  </div>
                </div>
                <div className="principle">
                  <div className="principle-num">03</div>
                  <div className="principle-text">
                    <strong>The right abstraction is a command center.</strong>{" "}
                    One that sees accounts, goals, liabilities, projections, and
                    patterns — and surfaces the most important signal at the
                    right time.
                  </div>
                </div>
                <div className="principle">
                  <div className="principle-num">04</div>
                  <div className="principle-text">
                    <strong>
                      LLM integration is the reasoning layer, not a feature.
                    </strong>{" "}
                    Every recommendation is explained, every assumption made
                    explicit, every decision deferred to the human.
                  </div>
                </div>
              </div>
            </div>

            <div className="thesis-visual reveal reveal-delay-2">
              <div className="thesis-rings">
                <div className="ring ring-4"></div>
                <div className="ring ring-3"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-1">
                  <div className="ring-core-label">
                    Capital
                    <br />
                    OS
                  </div>
                </div>
                {/*<!-- orbital dots -->*/}
                <div
                  className="orbit-dot"
                  style={{
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  📊
                </div>
                <div
                  className="orbit-dot"
                  style={{
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  💰
                </div>
                <div
                  className="orbit-dot"
                  style={{
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  📈
                </div>
                <div
                  className="orbit-dot"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  🤖
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
