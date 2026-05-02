interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  border?: string;
}

export function Badge({ label, color, bg, border }: BadgeProps) {
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: 9,
        padding: "2px 7px",
        borderRadius: 3,
        fontWeight: 600,
        letterSpacing: "0.07em",
        background: bg || "rgba(255,255,255,0.06)",
        color: color || "var(--cos-text-2)",
        border: `1px solid ${border || "rgba(255,255,255,0.08)"}`,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}
