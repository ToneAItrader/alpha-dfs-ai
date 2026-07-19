import { Check, Circle, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ChecklistItemState } from "@/types/portfolio-readiness-view-model";

export type ChecklistItem = {
  id: string;
  label: string;
  state: ChecklistItemState;
};

type ChecklistProps = {
  items: ChecklistItem[];
  className?: string;
};

const stateConfig: Record<
  ChecklistItemState,
  { icon: typeof Check; label: string; className: string }
> = {
  complete: {
    icon: Check,
    label: "Complete",
    className: "text-success",
  },
  pending: {
    icon: Circle,
    label: "Pending",
    className: "text-muted",
  },
  unavailable: {
    icon: Minus,
    label: "Unavailable",
    className: "text-muted",
  },
};

export function Checklist({ items, className }: ChecklistProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => {
        const config = stateConfig[item.state];
        const Icon = config.icon;

        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-surface-border bg-surface px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("h-4 w-4 shrink-0", config.className)} aria-hidden="true" />
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {config.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
