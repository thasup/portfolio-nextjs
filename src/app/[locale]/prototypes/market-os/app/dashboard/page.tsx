import Link from "next/link";
import { AppPage } from "@/components/prototypes/market-os/app/AppPage";
import {
  CatChip,
  StatusChip,
} from "@/components/prototypes/market-os/primitives/Chips";
import { getOrgBySlug } from "@/lib/marketos/queries/orgs";
import { getCurrentPool } from "@/lib/marketos/queries/pool";
import {
  countActiveMissions,
  countActiveMissionCategories,
  listMissions,
} from "@/lib/marketos/queries/missions";
import { listMyBids, getBidRate } from "@/lib/marketos/queries/bids";
import { getMemberWithStats } from "@/lib/marketos/queries/members";
import { getCurrentMember } from "@/lib/marketos/auth";
import { DEMO_ORG_SLUG } from "@/lib/marketos/constants";
import { fmtBudget, fmtPostedAgo } from "@/lib/marketos/format";
import type { BidStatus } from "@/lib/marketos/types";

const AC = {
  cream: "#f9f7f6",
  dark: "#1e3a2f",
  orange: "#f2a84b",
  blue: "#b9d9e0",
  peach: "#f6d9a3",
  muted: "#7a7f79",
  border: "rgba(30,58,47,0.1)",
};

/**
 * Dashboard — spec §8.2 binding catalog.
 *
 * Anonymous visitors see org-wide stats (active missions, pool
 * remaining, recent missions); the personal stats (My Bid Rate,
 * Reputation Score, My Active Bids) hide cleanly when there's no
 * resolved member.
 */
export default async function DashboardPage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org) {
    return (
      <AppPage>
        <EmptyShell title="Demo org not seeded" />
      </AppPage>
    );
  }

  const member = await getCurrentMember(org.slug);

  const [
    pool,
    activeMissions,
    activeCategories,
    recentMissions,
    memberStats,
    myBids,
    bidRate,
  ] = await Promise.all([
    getCurrentPool(org.id),
    countActiveMissions(org.id),
    countActiveMissionCategories(org.id),
    listMissions(org.id, { limit: 4 }),
    member ? getMemberWithStats(member.id) : Promise.resolve(null),
    member ? listMyBids(member.id) : Promise.resolve([]),
    member ? getBidRate(member.id) : Promise.resolve(null),
  ]);

  const myActiveBids = myBids
    .filter((b) =>
      (["pending", "shortlisted", "accepted"] as BidStatus[]).includes(
        b.status,
      ),
    )
    .slice(0, 3);

  // Stat cards. Personal stats are conditionally included.
  const stats: Array<{
    label: string;
    value: string;
    sub: string;
    color: string;
  }> = [
    {
      label: "Active Missions",
      value: String(activeMissions),
      sub: `across ${activeCategories} categor${activeCategories === 1 ? "y" : "ies"}`,
      color: AC.orange,
    },
    {
      label: "Pool Remaining",
      value: pool ? "$" + Math.round(pool.unallocatedUsd / 1000) + "k" : "—",
      sub: pool ? `unallocated this ${pool.periodLabel}` : "no current period",
      color: AC.blue,
    },
  ];
  if (member) {
    stats.push({
      label: "My Bid Rate",
      value: bidRate == null ? "—" : `${bidRate}%`,
      sub: "acceptance over 90 days",
      color: "#a5d6a7",
    });
    stats.push({
      label: "Reputation Score",
      value: memberStats ? String(memberStats.reputation) : "0",
      sub: memberStats?.tier ? `tier · ${memberStats.tier}` : "tier · —",
      color: AC.peach,
    });
  }

  const greetingName = member?.displayName.split(" ")[0] ?? "there";

  return (
    <AppPage>
      <div style={{ marginBottom: 32 }}>
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
          Good morning, {greetingName} 👋
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 15,
            color: "rgba(30,58,47,0.55)",
            margin: 0,
          }}
        >
          {pool?.periodLabel ?? "—"} ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${stats.length},1fr)`,
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} className="a-stat-card">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${s.color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: s.color,
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: AC.dark,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: AC.dark,
                margin: "6px 0 3px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 12,
                color: "rgba(30,58,47,0.45)",
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent missions */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: AC.dark,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Recent Missions
            </h2>
            <Link
              href="/prototypes/market-os/app/missions"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: AC.orange,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(30,58,47,0.06)",
            }}
          >
            {recentMissions.length === 0 && (
              <EmptyRow text="No missions yet." />
            )}
            {recentMissions.map((m, i) => (
              <Link
                key={m.id}
                href={`/prototypes/market-os/app/missions/${m.slug}`}
                className="a-row"
                style={{
                  borderBottom:
                    i < recentMissions.length - 1
                      ? `1px solid ${AC.border}`
                      : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: AC.dark,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 4,
                      alignItems: "center",
                    }}
                  >
                    <CatChip cat={m.category} />
                    <span
                      style={{
                        fontSize: 12,
                        color: AC.muted,
                        fontFamily: "var(--font-dm-sans), sans-serif",
                      }}
                    >
                      {fmtPostedAgo(m.postedAt)}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: AC.dark,
                    }}
                  >
                    {fmtBudget(m.budgetUsd)}
                  </div>
                  <StatusChip status={m.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {member && (
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: AC.dark,
                  margin: "0 0 14px",
                  letterSpacing: "-0.02em",
                }}
              >
                My Active Bids
              </h2>
              <div
                style={{
                  background: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(30,58,47,0.06)",
                }}
              >
                {myActiveBids.length === 0 && (
                  <EmptyRow text="You haven't bid on anything yet." />
                )}
                {myActiveBids.map((b, i) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderBottom:
                        i < myActiveBids.length - 1
                          ? `1px solid ${AC.border}`
                          : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontWeight: 600,
                          fontSize: 13,
                          color: AC.dark,
                        }}
                      >
                        Mission #{b.missionId.slice(0, 6)}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: 12,
                          color: AC.muted,
                          marginTop: 2,
                        }}
                      >
                        Submitted {fmtPostedAgo(b.submittedAt)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-bricolage), sans-serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: AC.dark,
                        }}
                      >
                        {fmtBudget(b.amountUsd)}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 8,
                          background:
                            b.status === "shortlisted"
                              ? "rgba(165,214,167,0.5)"
                              : "rgba(246,217,163,0.6)",
                          color: AC.dark,
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pool && (
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "22px 24px",
                boxShadow: "0 1px 4px rgba(30,58,47,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: AC.dark,
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Revenue Pool — {pool.periodLabel}
              </h3>
              {(
                [
                  ["Missions", pool.missionsLockedUsd, AC.orange],
                  ["Base Comp", pool.baseUsd, "rgba(185,217,224,0.8)"],
                  ["Unallocated", pool.unallocatedUsd, "rgba(200,230,201,0.8)"],
                ] as const
              ).map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: 13,
                        color: "rgba(30,58,47,0.7)",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        color: AC.dark,
                      }}
                    >
                      {fmtBudget(val)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(30,58,47,0.06)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pool.totalUsd > 0 ? Math.round((val / pool.totalUsd) * 100) : 0}%`,
                        background: color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: `1px solid ${AC.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: AC.dark,
                  }}
                >
                  Total Pool
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-bricolage), sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    color: AC.dark,
                  }}
                >
                  {fmtBudget(pool.totalUsd)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppPage>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "var(--font-dm-sans), sans-serif",
        fontSize: 13,
        color: AC.muted,
        textAlign: "center",
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

function EmptyShell({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: 48,
        textAlign: "center",
        fontFamily: "var(--font-dm-sans), sans-serif",
        color: AC.muted,
      }}
    >
      {title}
    </div>
  );
}
