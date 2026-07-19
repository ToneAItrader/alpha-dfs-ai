import type { ConfidenceTier } from "@/types/shared/confidence";
import { cn } from "@/lib/cn";

export type ConfidenceBadgeProps = {
  label: string;
  tier?: ConfidenceTier | null;
  className?: string;
};

const tierStyles: Record<ConfidenceTier, string> = {
  high: "bg-success/10 text-success ring-success/30",
  moderate: "bg-warning/10 text-warning ring-warning/30",
  low: "bg-muted/20 text-muted ring-muted/30",
};

export function ConfidenceBadge({ label, tier, className }: ConfidenceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1",
        tier ? tierStyles[tier] : "bg-surface-hover text-muted ring-surface-border",
        className,
      )}
    >
      {label}
    </span>
  );
}
