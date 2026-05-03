import { Badge } from "@/components/ui/badge";

interface TechBadgeProps {
  name: string;
  variant?: "default" | "outline";
  size?: "sm" | "default";
}

export function TechBadge({
  name,
  variant = "outline",
  size = "default",
}: TechBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={
        size === "sm" ? "px-1.5 py-0 text-[10px] font-normal" : "font-normal"
      }
    >
      {name}
    </Badge>
  );
}
