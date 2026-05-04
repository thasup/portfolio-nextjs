"use client";

/**
 * CapitalOS Design System Showcase
 *
 * A comprehensive reference page demonstrating:
 * - Semantic token mapping
 * - Spacing scale
 * - Typography rules
 * - Component states
 * - Interaction patterns
 * - Accessibility guidelines
 */
import { useEffect } from "react";
import "../landing.css";

import { LandingNav } from "@/components/prototypes/capital-os/landing/LandingNav";
import { LandingFooter } from "@/components/prototypes/capital-os/landing/LandingFooter";
import {
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  Sparkles,
  Wallet,
  TrendingUp,
  CreditCard,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Design System Section Component
function DSSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ds-section">
      <div className="container">
        <div className="ds-section-header">
          <h2 className="ds-section-title">{title}</h2>
          {description && <p className="ds-section-desc">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

// Color Swatch Component
function ColorSwatch({
  name,
  token,
  value,
  description,
  intent,
}: {
  name: string;
  token: string;
  value: string;
  description: string;
  intent?: "success" | "warning" | "danger" | "info" | "ai" | "neutral";
}) {
  const intentClass = intent ? `ds-swatch-intent-${intent}` : "";
  return (
    <div className={`ds-swatch ${intentClass}`}>
      <div
        className="ds-swatch-color"
        style={{ background: value }}
      />
      <div className="ds-swatch-info">
        <div className="ds-swatch-name">{name}</div>
        <code className="ds-swatch-token">{token}</code>
        <div className="ds-swatch-desc">{description}</div>
      </div>
    </div>
  );
}

// Component State Example
function StateExample({
  state,
  children,
  code,
}: {
  state: string;
  children: React.ReactNode;
  code: string;
}) {
  return (
    <div className="ds-state-example">
      <div className="ds-state-label">{state}</div>
      <div className="ds-state-demo">{children}</div>
      <code className="ds-state-code">{code}</code>
    </div>
  );
}

// Do/Don't Example
function DoDont({
  do: doContent,
  dont: dontContent,
  doLabel,
  dontLabel,
}: {
  do: React.ReactNode;
  dont: React.ReactNode;
  doLabel?: string;
  dontLabel?: string;
}) {
  return (
    <div className="ds-dodont">
      <div className="ds-do">
        <div className="ds-dodont-label">
          <CheckCircle className="h-4 w-4" />
          {doLabel || "Do"}
        </div>
        {doContent}
      </div>
      <div className="ds-dont">
        <div className="ds-dodont-label">
          <AlertOctagon className="h-4 w-4" />
          {dontLabel || "Don't"}
        </div>
        {dontContent}
      </div>
    </div>
  );
}

export default function CapitalOSDesignPage() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");

    if (!cursor || !ring) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };

    const handleHover = () => {
      ring.style.width = "48px";
      ring.style.height = "48px";
      ring.style.borderColor = "var(--emerald-bright)";
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    };

    const handleHoverOut = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(0,201,122,0.4)";
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    };

    window.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll(
      "a, button, .ds-btn, .ds-card",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleHoverOut);
    });

    const reveals = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 100;
      reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", revealOnScroll);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  return (
    <div className="capitalos-landing">
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>

      <LandingNav />

      {/* Hero Section */}
      <section id="hero" style={{ minHeight: "60vh" }}>
        <div className="hero-content" style={{ paddingTop: "120px" }}>
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Design System v2.0
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
            Every token,
            <br />
            justified.
          </h1>
          <p style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
            A comprehensive design system built for financial clarity. Semantic
            colors, rigorous spacing, and accessibility-first components.
          </p>
        </div>
      </section>

      {/* Semantic Colors */}
      <DSSection
        title="Semantic Color System"
        description="Colors mapped to intents, not just aesthetics. Every hue communicates meaning."
      >
        <div className="ds-grid-2">
          {/* Intent Colors */}
          <div className="ds-card">
            <h3 className="ds-card-title">Intent-Based Colors</h3>
            <div className="ds-swatch-grid">
              <ColorSwatch
                name="Success / Emerald"
                token="--intent-success"
                value="#10b981"
                description="On track goals, synced data, completed actions"
                intent="success"
              />
              <ColorSwatch
                name="Warning / Amber"
                token="--intent-warning"
                value="#f59e0b"
                description="Stale data, approaching limits, attention needed"
                intent="warning"
              />
              <ColorSwatch
                name="Danger / Rose"
                token="--intent-danger"
                value="#ef4444"
                description="Credit card debt, overdue deadlines, errors"
                intent="danger"
              />
              <ColorSwatch
                name="Info / Blue"
                token="--intent-info"
                value="#3b82f6"
                description="Liquid assets, secondary actions, information"
                intent="info"
              />
              <ColorSwatch
                name="AI / Violet"
                token="--intent-ai"
                value="#8b5cf6"
                description="AI-generated insights, intelligence layer"
                intent="ai"
              />
            </div>
          </div>

          {/* Surface Hierarchy */}
          <div className="ds-card">
            <h3 className="ds-card-title">Surface Hierarchy</h3>
            <div className="ds-swatch-grid">
              <ColorSwatch
                name="Surface Void"
                token="--surface-void"
                value="#020408"
                description="Deepest background, modals, overlays"
              />
              <ColorSwatch
                name="Surface Base"
                token="--surface-base"
                value="#0a0e1a"
                description="Primary app background"
              />
              <ColorSwatch
                name="Surface Elevated"
                token="--surface-elevated"
                value="#111827"
                description="Cards, panels, popovers"
              />
              <ColorSwatch
                name="Surface Hovered"
                token="--surface-hovered"
                value="#1f2937"
                description="Hover states, active items"
              />
              <ColorSwatch
                name="Surface Active"
                token="--surface-active"
                value="#374151"
                description="Pressed states, selected items"
              />
            </div>
          </div>
        </div>

        {/* Usage Rules */}
        <div className="ds-card ds-mt-6">
          <h3 className="ds-card-title">Color Usage Rules</h3>
          <div className="ds-rules-grid">
            <DoDont
              doLabel="Use Rose for debt"
              dontLabel="Don't mix contexts"
              do={
                <div className="ds-example-row">
                  <CreditCard
                    className="h-5 w-5"
                    style={{ color: "#ef4444" }}
                  />
                  <span style={{ color: "#ef4444", fontFamily: "var(--font-mono)" }}>
                    ฿45,000 Credit Card Debt
                  </span>
                </div>
              }
              dont={
                <div className="ds-example-row">
                  <CreditCard
                    className="h-5 w-5"
                    style={{ color: "#10b981" }}
                  />
                  <span style={{ color: "#10b981" }}>Same color for everything</span>
                </div>
              }
            />
            <DoDont
              doLabel="Use Blue for liquid"
              dontLabel="Don't use random colors"
              do={
                <div className="ds-example-row">
                  <Wallet className="h-5 w-5" style={{ color: "#3b82f6" }} />
                  <span style={{ color: "#3b82f6", fontFamily: "var(--font-mono)" }}>
                    ฿411,234 Liquid Capital
                  </span>
                </div>
              }
              dont={
                <div className="ds-example-row">
                  <Wallet className="h-5 w-5" style={{ color: "#ec4899" }} />
                  <span>Inconsistent color choice</span>
                </div>
              }
            />
          </div>
        </div>
      </DSSection>

      {/* Typography */}
      <DSSection
        title="Typography System"
        description="Three fonts, distinct purposes. Display for editorial, Body for UI, Mono for precision."
      >
        <div className="ds-grid-3">
          {/* Display */}
          <div className="ds-type-card">
            <div className="ds-type-label">Display — Cormorant Garamond</div>
            <div
              className="ds-type-sample-display"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Capital
              <br />
              Intelligence
            </div>
            <div className="ds-type-usage">
              <strong>Use for:</strong> Landing page heroes, editorial statements
              <br />
              <strong>Don&apos;t use for:</strong> Dashboard headers, data displays
            </div>
          </div>

          {/* Body */}
          <div className="ds-type-card">
            <div className="ds-type-label">Body — DM Sans</div>
            <div
              className="ds-type-sample-body"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every capital decision requires a single authoritative answer, not
              three approximations from different spreadsheets.
            </div>
            <div className="ds-type-usage">
              <strong>Use for:</strong> UI text, labels, navigation, body copy
              <br />
              <strong>Don&apos;t use for:</strong> Financial figures, display headers
            </div>
          </div>

          {/* Mono */}
          <div className="ds-type-card">
            <div className="ds-type-label">Mono — JetBrains Mono</div>
            <div
              className="ds-type-sample-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ฿671,234
              <br />
              +16.6% ↑<br />
              14.7mo runway
              <br />
              SYNC_OK · 02:04
            </div>
            <div className="ds-type-usage">
              <strong>Use for:</strong> All financial figures, timestamps, status codes
              <br />
              <strong>Required:</strong> Every money display must use mono
            </div>
          </div>
        </div>

        {/* Type Scale */}
        <div className="ds-card ds-mt-6">
          <h3 className="ds-card-title">Type Scale</h3>
          <div className="ds-type-scale">
            <div className="ds-type-scale-row">
              <span className="ds-type-scale-name">text-3xl</span>
              <span className="ds-type-scale-value">36px</span>
              <span className="ds-type-scale-usage">Page headings (REDUCED from 120px)</span>
            </div>
            <div className="ds-type-scale-row">
              <span className="ds-type-scale-name">text-xl</span>
              <span className="ds-type-scale-value">22px</span>
              <span className="ds-type-scale-usage">Section headings</span>
            </div>
            <div className="ds-type-scale-row">
              <span className="ds-type-scale-name">text-base</span>
              <span className="ds-type-scale-value">16px</span>
              <span className="ds-type-scale-usage">Card titles, primary content</span>
            </div>
            <div className="ds-type-scale-row">
              <span className="ds-type-scale-name">text-sm</span>
              <span className="ds-type-scale-value">13px</span>
              <span className="ds-type-scale-usage">Labels, metadata</span>
            </div>
            <div className="ds-type-scale-row">
              <span className="ds-type-scale-name">text-xs</span>
              <span className="ds-type-scale-value">11px</span>
              <span className="ds-type-scale-usage">Captions, badges</span>
            </div>
          </div>
        </div>
      </DSSection>

      {/* Spacing */}
      <DSSection
        title="Spacing Scale"
        description="4/8/12/16/24/32/48 base scale. Consistent rhythm creates visual hierarchy."
      >
        <div className="ds-grid-2">
          {/* Base Scale */}
          <div className="ds-card">
            <h3 className="ds-card-title">Base Scale</h3>
            <div className="ds-spacing-visual">
              {[
                { name: "space-1", value: "4px", width: "4px" },
                { name: "space-2", value: "8px", width: "8px" },
                { name: "space-3", value: "12px", width: "12px" },
                { name: "space-4", value: "16px", width: "16px" },
                { name: "space-6", value: "24px", width: "24px" },
                { name: "space-8", value: "32px", width: "32px" },
                { name: "space-12", value: "48px", width: "48px" },
              ].map((space) => (
                <div key={space.name} className="ds-spacing-row">
                  <code className="ds-spacing-name">{space.name}</code>
                  <div
                    className="ds-spacing-bar"
                    style={{ width: space.width }}
                  />
                  <span className="ds-spacing-value">{space.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Spacing */}
          <div className="ds-card">
            <h3 className="ds-card-title">Semantic Usage</h3>
            <div className="ds-spacing-usage">
              <div className="ds-spacing-usage-item">
                <code>--gap-xs (4px)</code>
                <span>Icon gaps, tightest spacing</span>
              </div>
              <div className="ds-spacing-usage-item">
                <code>--gap-sm (8px)</code>
                <span>Inline elements, related items</span>
              </div>
              <div className="ds-spacing-usage-item">
                <code>--gap-md (12px)</code>
                <span>Default small gap</span>
              </div>
              <div className="ds-spacing-usage-item">
                <code>--gap-lg (16px)</code>
                <span>Component padding, card gaps</span>
              </div>
              <div className="ds-spacing-usage-item">
                <code>--gap-xl (24px)</code>
                <span>Section gaps, form sections</span>
              </div>
              <div className="ds-spacing-usage-item">
                <code>--gap-2xl (32px)</code>
                <span>Large gaps, card padding</span>
              </div>
            </div>
          </div>
        </div>
      </DSSection>

      {/* Component States */}
      <DSSection
        title="Component States"
        description="Every interactive element has defined states: default, hover, active, focus, disabled, error."
      >
        <div className="ds-grid-2">
          {/* Button States */}
          <div className="ds-card">
            <h3 className="ds-card-title">Button States</h3>
            <div className="ds-states-grid">
              <StateExample state="Default" code=".ds-btn">
                <button className="ds-btn">Default</button>
              </StateExample>
              <StateExample state="Hover" code=".ds-btn:hover">
                <button className="ds-btn ds-btn-hover">Hover</button>
              </StateExample>
              <StateExample state="Active" code=".ds-btn:active">
                <button className="ds-btn ds-btn-active">Active</button>
              </StateExample>
              <StateExample state="Focus" code=".ds-btn:focus-visible">
                <button className="ds-btn ds-btn-focus">Focus</button>
              </StateExample>
              <StateExample state="Disabled" code=".ds-btn:disabled">
                <button className="ds-btn" disabled>
                  Disabled
                </button>
              </StateExample>
              <StateExample state="Danger" code=".ds-btn-danger">
                <button className="ds-btn ds-btn-danger">Danger</button>
              </StateExample>
            </div>
          </div>

          {/* Card States */}
          <div className="ds-card">
            <h3 className="ds-card-title">Card States</h3>
            <div className="ds-states-grid">
              <StateExample state="Default" code=".ds-card">
                <div className="ds-card-mini">Default Card</div>
              </StateExample>
              <StateExample state="Hover" code=".ds-card:hover">
                <div className="ds-card-mini ds-card-hover">Hover State</div>
              </StateExample>
              <StateExample state="Active" code=".ds-card:active">
                <div className="ds-card-mini ds-card-active">Active State</div>
              </StateExample>
            </div>
          </div>
        </div>
      </DSSection>

      {/* KPI Components */}
      <DSSection
        title="KPI Components"
        description="Financial data display with semantic color coding and monospace figures."
      >
        <div className="ds-kpi-grid">
          {/* Net Worth - Success */}
          <div className="ds-kpi-card ds-kpi-success">
            <div className="ds-kpi-header">
              <span className="ds-kpi-label">Net Worth</span>
              <div className="ds-kpi-icon">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="ds-kpi-value">฿671,234</div>
            <div className="ds-kpi-meta">
              <ArrowUpRight className="h-3 w-3" />
              <span>Total assets minus debt</span>
            </div>
          </div>

          {/* Liquid Capital - Info */}
          <div className="ds-kpi-card ds-kpi-info">
            <div className="ds-kpi-header">
              <span className="ds-kpi-label">Liquid Capital</span>
              <div className="ds-kpi-icon">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="ds-kpi-value">฿411,234</div>
            <div className="ds-kpi-meta">
              <span>Available for deployment</span>
            </div>
          </div>

          {/* Runway - Warning */}
          <div className="ds-kpi-card ds-kpi-warning">
            <div className="ds-kpi-header">
              <span className="ds-kpi-label">Financial Runway</span>
              <div className="ds-kpi-icon">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="ds-kpi-value">16.5mo</div>
            <div className="ds-kpi-meta">
              <span>At current burn rate</span>
            </div>
          </div>

          {/* Debt - Danger */}
          <div className="ds-kpi-card ds-kpi-danger">
            <div className="ds-kpi-header">
              <span className="ds-kpi-label">Total Debt</span>
              <div className="ds-kpi-icon">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="ds-kpi-value">฿45,000</div>
            <div className="ds-kpi-meta">
              <ArrowDownRight className="h-3 w-3" />
              <span>High-interest liabilities</span>
            </div>
          </div>
        </div>
      </DSSection>

      {/* Status Badges */}
      <DSSection
        title="Status Badges"
        description="Concise status indicators using semantic color coding."
      >
        <div className="ds-card">
          <div className="ds-badge-row">
            <span className="ds-badge ds-badge-success">
              <CheckCircle className="h-3 w-3" />
              SYNCED
            </span>
            <span className="ds-badge ds-badge-success">
              <CheckCircle className="h-3 w-3" />
              ON TRACK
            </span>
            <span className="ds-badge ds-badge-warning">
              <AlertTriangle className="h-3 w-3" />
              STALE
            </span>
            <span className="ds-badge ds-badge-warning">
              <AlertTriangle className="h-3 w-3" />
              WARNING
            </span>
            <span className="ds-badge ds-badge-danger">
              <AlertOctagon className="h-3 w-3" />
              CRITICAL
            </span>
            <span className="ds-badge ds-badge-danger">
              <AlertOctagon className="h-3 w-3" />
              OVERDUE
            </span>
            <span className="ds-badge ds-badge-info">
              <Info className="h-3 w-3" />
              LIQUID
            </span>
            <span className="ds-badge ds-badge-ai">
              <Sparkles className="h-3 w-3" />
              AI ACTIVE
            </span>
          </div>
        </div>
      </DSSection>

      {/* Accessibility */}
      <DSSection
        title="Accessibility"
        description="WCAG 2.2 AA compliant. Keyboard navigable, screen reader friendly."
      >
        <div className="ds-grid-2">
          <div className="ds-card">
            <h3 className="ds-card-title">Contrast Ratios</h3>
            <div className="ds-contrast-list">
              <div className="ds-contrast-item">
                <span>Text Primary on Surface Base</span>
                <span className="ds-contrast-ratio">14:1</span>
                <span className="ds-badge ds-badge-success">AAA</span>
              </div>
              <div className="ds-contrast-item">
                <span>Text Secondary on Surface Base</span>
                <span className="ds-contrast-ratio">7:1</span>
                <span className="ds-badge ds-badge-success">AAA</span>
              </div>
              <div className="ds-contrast-item">
                <span>Success on Surface Base</span>
                <span className="ds-contrast-ratio">5:1</span>
                <span className="ds-badge ds-badge-success">AA</span>
              </div>
              <div className="ds-contrast-item">
                <span>Danger on Surface Base</span>
                <span className="ds-contrast-ratio">6:1</span>
                <span className="ds-badge ds-badge-success">AA</span>
              </div>
            </div>
          </div>

          <div className="ds-card">
            <h3 className="ds-card-title">Focus Indicators</h3>
            <div className="ds-focus-examples">
              <button className="ds-btn ds-btn-focus-example">
                Focus-visible ring
              </button>
              <div className="ds-focus-code">
                <code>
                  box-shadow: 0 0 0 2px var(--surface-base), 0 0 0 4px
                  var(--intent-success);
                </code>
              </div>
            </div>
          </div>
        </div>
      </DSSection>

      {/* Motion */}
      <DSSection
        title="Motion Principles"
        description="Purposeful, restrained animation. Respect user preferences."
      >
        <div className="ds-grid-3">
          <div className="ds-card">
            <h3 className="ds-card-title">Duration Scale</h3>
            <div className="ds-duration-list">
              <div className="ds-duration-item">
                <code>--duration-fast</code>
                <span>100ms</span>
                <span className="ds-duration-desc">Hover states</span>
              </div>
              <div className="ds-duration-item">
                <code>--duration-normal</code>
                <span>150ms</span>
                <span className="ds-duration-desc">Button clicks</span>
              </div>
              <div className="ds-duration-item">
                <code>--duration-slow</code>
                <span>250ms</span>
                <span className="ds-duration-desc">Panel expands</span>
              </div>
              <div className="ds-duration-item">
                <code>--duration-slower</code>
                <span>350ms</span>
                <span className="ds-duration-desc">Page transitions</span>
              </div>
            </div>
          </div>

          <div className="ds-card">
            <h3 className="ds-card-title">Easing Functions</h3>
            <div className="ds-easing-list">
              <div className="ds-easing-item">
                <code>--ease-out</code>
                <span>cubic-bezier(0.16, 1, 0.3, 1)</span>
              </div>
              <div className="ds-easing-item">
                <code>--ease-in-out</code>
                <span>cubic-bezier(0.4, 0, 0.2, 1)</span>
              </div>
            </div>
          </div>

          <div className="ds-card">
            <h3 className="ds-card-title">Reduced Motion</h3>
            <div className="ds-motion-preference">
              <p>
                All animations respect{" "}
                <code>prefers-reduced-motion</code>:
              </p>
              <pre className="ds-code-block">
                {`@media (prefers-reduced-motion: reduce) {
  --duration-fast: 0ms;
  --duration-normal: 0ms;
  --duration-slow: 0ms;
}`}
              </pre>
            </div>
          </div>
        </div>
      </DSSection>

      <LandingFooter />
    </div>
  );
}
