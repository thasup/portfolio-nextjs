import { AppPage } from "@/components/prototypes/market-os/app/AppPage";
import {
  CatChip,
  TierChip,
} from "@/components/prototypes/market-os/primitives/Chips";
import { getOrgBySlug } from "@/lib/marketos/queries/orgs";
import { listLeaderboard } from "@/lib/marketos/queries/members";
import { DEMO_ORG_SLUG } from "@/lib/marketos/constants";
import { fmtBudget } from "@/lib/marketos/format";

const AC = {
  cream: "#f9f7f6",
  dark: "#1e3a2f",
  orange: "#f2a84b",
  muted: "#7a7f79",
  border: "rgba(30,58,47,0.1)",
};

/**
 * People — spec §8.8. Top-3 cards plus a leaderboard table, sorted by
 * reputation (desc). Reputation is computed by `marketos_member_stats`.
 */
export default async function PeoplePage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org)
    return (
      <AppPage>
        <p
          style={{
            color: AC.muted,
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          Demo org not seeded.
        </p>
      </AppPage>
    );

  const sorted = await listLeaderboard(org.id, { limit: 50 });
  const top = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <AppPage>
      <h1
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: AC.dark,
          margin: "0 0 4px",
          letterSpacing: "-0.03em",
        }}
      >
        People
      </h1>
      <p
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 14,
          color: "rgba(30,58,47,0.55)",
          margin: "0 0 28px",
          maxWidth: 640,
        }}
      >
        Reputation is the by-product of delivery. The leaderboard is read-only —
        no scores can be bought or assigned. Sort by total earned, on-time rate,
        or specialty as needed.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {top.map((p, i) => (
          <div
            key={p.id}
            className="a-stat-card"
            style={{
              padding: "24px 24px 20px",
              position: "relative",
              border:
                i === 0
                  ? "1.5px solid rgba(242,168,75,0.4)"
                  : `1px solid ${AC.border}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 800,
                fontSize: 14,
                color: i === 0 ? AC.orange : AC.muted,
              }}
            >
              #{i + 1}
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(30,58,47,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: AC.dark,
                marginBottom: 14,
              }}
            >
              {initials(p.displayName)}
            </div>
            <div
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: AC.dark,
                letterSpacing: "-0.02em",
              }}
            >
              {p.displayName}
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: AC.muted,
                margin: "2px 0 12px",
              }}
            >
              {p.title ?? p.role}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <TierChip tier={p.tier} />
              {p.specialty && <CatChip cat={p.specialty} />}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                paddingTop: 12,
                borderTop: `1px solid ${AC.border}`,
              }}
            >
              <Stat label="Reputation" value={p.reputation} />
              <Stat
                label="On-time"
                value={p.onTimePct == null ? "—" : `${p.onTimePct}%`}
              />
              <Stat label="Completed" value={p.completed} />
              <Stat label="Earned" value={fmtBudget(p.totalEarnedUsd)} />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(30,58,47,0.06)",
        }}
      >
        <div
          style={{
            padding: "14px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 140px 110px 110px 110px",
            gap: 16,
            borderBottom: `1px solid ${AC.border}`,
            background: AC.cream,
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 11,
            color: AC.muted,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 600,
          }}
        >
          <div>Contributor</div>
          <div>Specialty</div>
          <div style={{ textAlign: "right" }}>Reputation</div>
          <div style={{ textAlign: "right" }}>On-time</div>
          <div style={{ textAlign: "right" }}>Earned</div>
        </div>
        {rest.map((p, i) => (
          <div
            key={p.id}
            style={{
              padding: "14px 24px",
              display: "grid",
              gridTemplateColumns: "1fr 140px 110px 110px 110px",
              gap: 16,
              alignItems: "center",
              borderBottom:
                i < rest.length - 1 ? `1px solid ${AC.border}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(30,58,47,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: AC.dark,
                }}
              >
                {initials(p.displayName)}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: AC.dark,
                  }}
                >
                  {p.displayName}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: 12,
                    color: AC.muted,
                  }}
                >
                  {p.title ?? p.role}
                </div>
              </div>
            </div>
            {p.specialty ? (
              <CatChip cat={p.specialty} />
            ) : (
              <span style={{ color: AC.muted, fontSize: 12 }}>—</span>
            )}
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: AC.dark,
              }}
            >
              {p.reputation}
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 14,
                color: AC.dark,
              }}
            >
              {p.onTimePct == null ? "—" : `${p.onTimePct}%`}
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 14,
                color: AC.dark,
              }}
            >
              {fmtBudget(p.totalEarnedUsd)}
            </div>
          </div>
        ))}
      </div>
    </AppPage>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 11,
          color: AC.muted,
          marginBottom: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: AC.dark,
        }}
      >
        {value}
      </div>
    </div>
  );
}
