import { Badge } from "@/components/ui/badge";
import {
  type ProjectDomain,
  DOMAIN_LABELS,
  DOMAIN_COLORS,
} from "@/types/project";

interface DomainBadgeProps {
  domain: ProjectDomain;
}

export function DomainBadge({ domain }: DomainBadgeProps) {
  return (
    <Badge variant="secondary" className={DOMAIN_COLORS[domain]}>
      {DOMAIN_LABELS[domain]}
    </Badge>
  );
}
