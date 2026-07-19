import { cn } from "@/lib/cn";

export type DetailGridItem = {
  label: string;
  value: string;
};

type DetailGridProps = {
  items: DetailGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
};

export function DetailGrid({ items, columns = 2, className }: DetailGridProps) {
  return (
    <dl className={cn("grid gap-4", columnClasses[columns], className)}>
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            {item.label}
          </dt>
          <dd className="text-sm font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
