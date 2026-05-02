"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingBrand() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <section id="brand">
        <div className="container">
          <div className="brand-header reveal">
            <div className="section-label">Brand & Design System</div>
            <h2>Every token, justified.</h2>
            <p>
              CapitalOS's visual language is precision-first: monospaced
              numbers, editorial display type, and a palette built around
              financial semantics — not aesthetics for their own sake.
            </p>
          </div>

          {/*<!-- Logo -->*/}
          <div className="brand-logo-showcase reveal">
            <div className="logo-panel dark">
              <div className="logo-full">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="32"
                    height="32"
                    rx="7"
                    fill="rgba(0,201,122,0.12)"
                  />
                  <path
                    d="M22 10.5C20.3 9.2 18.2 8.4 16 8.4C10.7 8.4 6.4 12.7 6.4 18C6.4 23.3 10.7 27.6 16 27.6C18.2 27.6 20.3 26.8 22 25.5"
                    stroke="#00c97a"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="22" cy="10.5" r="2" fill="#00c97a" />
                  <circle cx="22" cy="25.5" r="2" fill="#00c97a" />
                  <path
                    d="M16 13L16 18L20 18"
                    stroke="rgba(0,201,122,0.5)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="18" r="1.5" fill="#00c97a" />
                </svg>
                <div className="logo-text-mark">
                  Capital<span>OS</span>
                </div>
              </div>
              <div className="logo-tagline">One source of financial truth</div>
            </div>
            <div className="logo-panel light">
              <div className="logo-full">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="32"
                    height="32"
                    rx="7"
                    fill="rgba(0,160,96,0.1)"
                  />
                  <path
                    d="M22 10.5C20.3 9.2 18.2 8.4 16 8.4C10.7 8.4 6.4 12.7 6.4 18C6.4 23.3 10.7 27.6 16 27.6C18.2 27.6 20.3 26.8 22 25.5"
                    stroke="#00a060"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="22" cy="10.5" r="2" fill="#00a060" />
                  <circle cx="22" cy="25.5" r="2" fill="#00a060" />
                  <path
                    d="M16 13L16 18L20 18"
                    stroke="rgba(0,160,96,0.5)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="18" r="1.5" fill="#00a060" />
                </svg>
                <div className="logo-text-mark">
                  Capital<span>OS</span>
                </div>
              </div>
              <div className="logo-tagline">One source of financial truth</div>
            </div>
          </div>

          {/*<!-- Colors -->*/}
          <div className="reveal">
            <div className="brand-section-title">
              Color System — Semantic, Not Decorative
            </div>
            <div className="color-row">
              <div className="swatch">
                <div
                  className="swatch-color"
                  style="background:#060c14; border: 1px solid #111;"
                ></div>
                <div className="swatch-name">Void</div>
                <div className="swatch-hex">#060c14</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#0d1421;"></div>
                <div className="swatch-name">Surface</div>
                <div className="swatch-hex">#0d1421</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#162035;"></div>
                <div className="swatch-name">Surface+</div>
                <div className="swatch-hex">#162035</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#eef2f8;"></div>
                <div className="swatch-name">Text Primary</div>
                <div className="swatch-hex">#eef2f8</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#8da0b8;"></div>
                <div className="swatch-name">Text Secondary</div>
                <div className="swatch-hex">#8da0b8</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#00c97a;"></div>
                <div className="swatch-name">Emerald</div>
                <div className="swatch-hex">Growth · CTA</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#f0a020;"></div>
                <div className="swatch-name">Amber</div>
                <div className="swatch-hex">Warning · Attention</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#ff4466;"></div>
                <div className="swatch-name">Rose</div>
                <div className="swatch-hex">Danger · Debt</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#3a82f7;"></div>
                <div className="swatch-name">Sapphire</div>
                <div className="swatch-hex">Info · Secondary</div>
              </div>
              <div className="swatch">
                <div className="swatch-color" style="background:#9b6dff;"></div>
                <div className="swatch-name">Violet</div>
                <div className="swatch-hex">AI · Intelligence</div>
              </div>
            </div>
          </div>

          {/*<!-- Typography -->*/}
          <div className="reveal">
            <div className="brand-section-title">Typography System</div>
            <div className="type-specimen">
              <div className="type-sample">
                <div className="type-sample-name">
                  Display — Cormorant Garamond
                </div>
                <div className="type-sample-display">
                  Capital
                  <br />
                  Intelligence
                </div>
                <div className="type-meta">
                  Headings, hero text, editorial statements. Signals editorial
                  refinement — unexpected for fintech, memorable for it.
                </div>
              </div>
              <div className="type-sample">
                <div className="type-sample-name">Body — DM Sans</div>
                <div className="type-sample-body">
                  Every capital decision — How much runway do I have? Is my
                  Emergency Fund adequately funded? — requires a single
                  authoritative answer, not three approximations.
                </div>
                <div className="type-meta">
                  Body copy, labels, UI text. Clean and precise without being
                  sterile.
                </div>
              </div>
              <div className="type-sample">
                <div className="type-sample-name">Mono — JetBrains Mono</div>
                <div className="type-sample-mono">
                  ฿671,234
                  <br />
                  +16.6% ↑<br />
                  14.7mo runway
                  <br />
                  SYNC_OK · 02:04 ICT
                </div>
                <div className="type-meta">
                  Numbers, code, labels, badges, timestamps. Every financial
                  figure uses mono — signals precision.
                </div>
              </div>
            </div>
          </div>

          {/*<!-- Components -->*/}
          <div className="component-grid reveal">
            <div className="component-panel">
              <div className="component-panel-title">KPI Cards</div>
              <div className="kpi-demo-grid">
                <div className="kpi-demo green">
                  <div className="kpi-demo-val">฿671K</div>
                  <div className="kpi-demo-lbl">Net Worth</div>
                </div>
                <div className="kpi-demo blue">
                  <div className="kpi-demo-val">฿411K</div>
                  <div className="kpi-demo-lbl">Liquid Capital</div>
                </div>
                <div className="kpi-demo amber">
                  <div className="kpi-demo-val">16.5mo</div>
                  <div className="kpi-demo-lbl">Runway</div>
                </div>
                <div className="kpi-demo rose">
                  <div className="kpi-demo-val">฿45K</div>
                  <div className="kpi-demo-lbl">Credit Debt</div>
                </div>
              </div>
            </div>

            <div className="component-panel">
              <div className="component-panel-title">Status Badges</div>
              <div className="badge-row">
                <span className="ds-badge green">SYNCED</span>
                <span className="ds-badge green">ON TRACK</span>
                <span className="ds-badge amber">STALE</span>
                <span className="ds-badge amber">WARNING</span>
                <span className="ds-badge rose">CRITICAL</span>
                <span className="ds-badge rose">OVERDUE</span>
                <span className="ds-badge blue">LIQUID</span>
                <span className="ds-badge blue">SEMI</span>
                <span className="ds-badge violet">AI ACTIVE</span>
              </div>
              <div
                className="component-panel-title"
                style="margin-top: var(--space-5)"
              >
                Goal Progress Bars
              </div>
              <div className="prog-demo">
                <div className="prog-row">
                  <div className="prog-labels">
                    <span>Emergency Fund 🚨</span>
                    <span>58.7%</span>
                  </div>
                  <div className="prog-track">
                    <div
                      className="prog-fill"
                      style="width:0%;background:var(--amber)"
                      data-target-width="58.7"
                    ></div>
                  </div>
                </div>
                <div className="prog-row">
                  <div className="prog-labels">
                    <span>Business Venture 📊</span>
                    <span>51.7%</span>
                  </div>
                  <div className="prog-track">
                    <div
                      className="prog-fill"
                      style="width:0%;background:var(--sapphire)"
                      data-target-width="51.7"
                    ></div>
                  </div>
                </div>
                <div className="prog-row">
                  <div className="prog-labels">
                    <span>Wedding Fund 💍</span>
                    <span>2.0%</span>
                  </div>
                  <div className="prog-track">
                    <div
                      className="prog-fill"
                      style="width:0%;background:var(--rose)"
                      data-target-width="2"
                    ></div>
                  </div>
                </div>
                <div className="prog-row">
                  <div className="prog-labels">
                    <span>Jane's Wedding ✅</span>
                    <span>109%</span>
                  </div>
                  <div className="prog-track">
                    <div
                      className="prog-fill"
                      style="width:0%;background:var(--emerald)"
                      data-target-width="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
