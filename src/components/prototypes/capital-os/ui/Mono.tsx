import { ReactNode } from "react";

interface MonoProps {
  children: ReactNode;
  color?: string;
  size?: number;
}

export function Mono({ children, color, size = 13 }: MonoProps) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: size,
        color: color || "var(--cos-text)",
      }}
    >
      {children}
    </span>
  );
}
