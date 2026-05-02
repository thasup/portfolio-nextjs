import Link from "next/link";
import { MkLogo } from "@/components/prototypes/market-os/primitives/MkLogo";
import { SidebarNav } from "@/components/prototypes/market-os/app/SidebarNav";
import type { PoolCompositionDTO } from "@/lib/marketos/types";
import { fmtBudgetCompact } from "@/lib/marketos/format";

const AC = {
  cream: "#f9f7f6",
  dark: "#1e3a2f",
  orange: "#f2a84b",
};

interface SidebarProps {
  /**
   * Pool composition for the org's current revenue period. `null` means
   * the org has no current period (fresh org, demo not seeded). The
   * widget renders an empty state in that case rather than guessing.
   */
  pool: PoolCompositionDTO | null;
}

/**
 * Server-rendered sidebar shell. The active-link highlight is delegated
 * to `<SidebarNav />` (a small client island that uses `usePathname()`).
 * All pool data flows in as a prop so this component never imports a
 * mock module — see `.windsurf/plans/021-marketos-mvp.md` T-208.
 */
export function Sidebar({ pool }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        background: AC.dark,
        display: "flex",
        flexDirection: "column",
        padding: "0 12px",
        flexShrink: 0,
        height: "100vh",
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "20px 12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          borderBottom: "1px solid rgba(249,247,246,0.07)",
          marginBottom: 8,
        }}
      >
        <MkLogo size={28} variant="app" />
        <span
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 700,
            fontSize: 17,
            color: "white",
            letterSpacing: "-0.03em",
          }}
        >
          MarketOS
        </span>
      </div>

      <SidebarNav />

      {pool ? <PoolWidget pool={pool} /> : <PoolWidgetEmpty />}

      <Link
        href="/prototypes/market-os"
        style={{
          background: "transparent",
          border: "1px solid rgba(249,247,246,0.1)",
          borderRadius: 8,
          padding: "8px 12px",
          color: "rgba(249,247,246,0.55)",
          fontSize: 12,
          fontFamily: "var(--font-dm-sans), sans-serif",
          marginBottom: 16,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M8 10L4 6L8 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Back to landing
      </Link>
    </aside>
  );
}

function PoolWidget({ pool }: { pool: PoolCompositionDTO }) {
  const allocatedPct =
    pool.totalUsd > 0
      ? Math.round((pool.missionsLockedUsd / pool.totalUsd) * 100)
      : 0;
  return (
    <div
      style={{
        margin: "auto 0 12px",
        padding: "16px 14px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        border: "1px solid rgba(249,247,246,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(249,247,246,0.42)",
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            {pool.periodLabel} Pool
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "white",
              fontFamily: "var(--font-bricolage), sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {fmtBudgetCompact(pool.totalUsd)}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: AC.orange,
            fontFamily: "var(--font-dm-sans), sans-serif",
            background: "rgba(242,168,75,0.15)",
            padding: "3px 8px",
            borderRadius: 8,
          }}
        >
          {pool.ratio}% rev
        </div>
      </div>
      <div
        style={{
          height: 5,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${allocatedPct}%`,
            background: `linear-gradient(90deg, ${AC.orange}, #e89a35)`,
            borderRadius: 3,
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {(
          [
            ["Missions", fmtBudgetCompact(pool.missionsLockedUsd), AC.orange],
            ["Base", fmtBudgetCompact(pool.baseUsd), "rgba(249,247,246,0.45)"],
            [
              "Free",
              fmtBudgetCompact(pool.unallocatedUsd),
              "rgba(185,217,224,0.8)",
            ],
          ] as const
        ).map(([l, v, c]) => (
          <div
            key={l}
            style={{
              fontSize: 10,
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "rgba(249,247,246,0.38)",
            }}
          >
            <span style={{ color: c, fontWeight: 700 }}>{v}</span> {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function PoolWidgetEmpty() {
  return (
    <div
      style={{
        margin: "auto 0 12px",
        padding: "16px 14px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 14,
        border: "1px dashed rgba(249,247,246,0.12)",
        fontFamily: "var(--font-dm-sans), sans-serif",
        fontSize: 11,
        color: "rgba(249,247,246,0.42)",
        lineHeight: 1.5,
      }}
    >
      No revenue period set yet. Pool data appears here once the current period
      is configured.
    </div>
  );
}
