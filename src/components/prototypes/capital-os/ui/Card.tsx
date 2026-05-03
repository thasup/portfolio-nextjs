import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
  className?: string;
}

export function Card({ children, style, accent, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--cos-surface)",
        border: "0.5px solid var(--cos-border-subtle)",
        borderRadius: 12,
        padding: "16px 18px",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: accent,
          }}
        />
      )}
      {children}
    </div>
  );
}
