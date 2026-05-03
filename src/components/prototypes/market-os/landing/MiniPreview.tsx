import { MkLogo } from "@/components/prototypes/market-os/primitives/MkLogo";

const C = {
  cream: "#f9f7f6",
  dark: "#1e3a2f",
  orange: "#f2a84b",
  blue: "#b9d9e0",
  peach: "#f6d9a3",
  muted: "#7a7f79",
};

const ROWS = [
  {
    title: "Redesign onboarding flow",
    cat: "Design",
    budget: "$8,400",
    status: "open",
    bids: 2,
  },
  {
    title: "Q2 competitive analysis",
    cat: "Research",
    budget: "$3,200",
    status: "open",
    bids: 1,
  },
  {
    title: "Backend API audit",
    cat: "Engineering",
    budget: "$6,800",
    status: "active",
    bids: 4,
  },
  {
    title: "Launch email campaign",
    cat: "Marketing",
    budget: "$5,600",
    status: "open",
    bids: 0,
  },
];

const STATUS_COLOR: Record<string, string> = {
  open: C.blue,
  active: C.peach,
  done: "#c8e6c9",
};

/**
 * The little "browser screenshot" that lives inside the hero. Static —
 * it's a marketing visual, not a live mini-app.
 */
export function MiniPreview() {
  return (
    <div style={{ background: C.cream, display: "flex", height: 340 }}>
      {/* Sidebar */}
      <div
        style={{
          width: 192,
          background: C.dark,
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 18,
          }}
        >
          <MkLogo size={20} variant="landing" />
          <span
            style={{
              color: "white",
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "-0.025em",
            }}
          >
            MarketOS
          </span>
        </div>
        {(
          [
            ["📊", "Dashboard", true],
            ["🎯", "Missions", false],
            ["⚡", "My Bids", false],
            ["👤", "Profile", false],
          ] as const
        ).map(([ico, label, active]) => (
          <div
            key={label}
            style={{
              padding: "7px 10px",
              borderRadius: 7,
              background: active ? "rgba(242,168,75,0.18)" : "transparent",
              color: active ? C.orange : "rgba(249,247,246,0.55)",
              fontSize: 12,
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: active ? 600 : 400,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ fontSize: 11 }}>{ico}</span>
            {label}
          </div>
        ))}
        <div
          style={{
            marginTop: "auto",
            padding: "12px 10px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "rgba(249,247,246,0.45)",
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            Q2 Pool
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-bricolage), sans-serif",
            }}
          >
            $248k
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              margin: "7px 0 4px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "57%",
                background: C.orange,
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(249,247,246,0.38)",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            57% allocated
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "18px 20px", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: C.dark,
              letterSpacing: "-0.025em",
            }}
          >
            Mission Board
          </span>
          <div
            style={{
              height: 24,
              padding: "0 12px",
              background: C.orange,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            + Post Mission
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["All", "Open", "Active", "Done"].map((f, i) => (
            <div
              key={f}
              style={{
                padding: "3px 10px",
                borderRadius: 12,
                background: i === 0 ? C.dark : "rgba(30,58,47,0.06)",
                color: i === 0 ? "white" : C.muted,
                fontSize: 10,
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 500,
              }}
            >
              {f}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {ROWS.map((r, i) => (
            <div key={i} className="l-mission-row">
              <div
                style={{
                  flex: 1,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: C.dark,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontSize: 9,
                  background: "rgba(30,58,47,0.06)",
                  padding: "2px 7px",
                  borderRadius: 5,
                  color: C.muted,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  flexShrink: 0,
                }}
              >
                {r.cat}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.dark,
                  fontFamily: "var(--font-bricolage), sans-serif",
                  flexShrink: 0,
                  minWidth: 48,
                }}
              >
                {r.budget}
              </div>
              <div
                style={{
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: STATUS_COLOR[r.status],
                  color: C.dark,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {r.status}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: C.muted,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  flexShrink: 0,
                }}
              >
                {r.bids} bids
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
