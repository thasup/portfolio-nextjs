import type { CSSProperties, ReactNode } from "react";

/**
 * Standard page-shell wrapper for every `/app/*` view. Matches the
 * reference mockup's padding (`36px 40px`) and `1060px` content cap.
 */
export function AppPage({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        padding: "36px 40px",
        maxWidth: 1060,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function AppPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: "#1e3a2f",
            margin: "0 0 4px",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 14,
              color: "rgba(30,58,47,0.5)",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </div>
  );
}
