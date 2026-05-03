interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
}

export function ProgressBar({ value, max = 100, color }: ProgressBarProps) {
  const p = Math.min(100, Math.round((value / max) * 100));
  
  // Auto-color based on percentage if no color provided
  const autoColor = p >= 100
    ? "var(--cos-positive)"
    : p >= 60
      ? "var(--cos-positive)"
      : p >= 30
        ? "var(--cos-warning)"
        : "var(--cos-negative)";

  const barColor = color || autoColor;

  return (
    <div
      style={{
        height: 4,
        background: "var(--cos-border-subtle)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${p}%`,
          background: barColor,
          borderRadius: 2,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}
