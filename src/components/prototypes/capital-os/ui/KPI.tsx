import { ReactNode } from "react";
import { Card } from "./Card";
import { Mono } from "./Mono";

interface KPIProps {
  label: string;
  value: string | ReactNode;
  sub?: string;
  accent?: string;
  onClick?: () => void;
}

export function KPI({ label, value, sub, accent, onClick }: KPIProps) {
  return (
    <Card
      accent={accent}
      style={{ cursor: onClick ? "pointer" : "default" }}
      {...(onClick && { onClick })}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--cos-text-2)",
          fontFamily: "monospace",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {typeof value === "string" ? (
        <Mono size={22} color="var(--cos-text)">
          {value}
        </Mono>
      ) : (
        value
      )}
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: "var(--cos-text-2)",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </Card>
  );
}
