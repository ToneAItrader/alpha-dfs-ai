import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type SummaryCardProps = {
  label: string;
  value: string;
  hint?: string;
  className?: string;
};

export function SummaryCard({ label, value, hint, className }: SummaryCardProps) {
  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </Card>
  );
}
