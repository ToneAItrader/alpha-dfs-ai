import { SummaryCard } from "@/components/ui/SummaryCard";

export type ConfidenceSummaryItem = {
  label: string;
  value: string;
  hint?: string;
};

type ConfidenceSummaryProps = {
  items: ConfidenceSummaryItem[];
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
} as const;

export function ConfidenceSummary({ items, columns = 4 }: ConfidenceSummaryProps) {
  return (
    <div className={`grid gap-4 ${columnClasses[columns]}`}>
      {items.map((item) => (
        <SummaryCard
          key={item.label}
          label={item.label}
          value={item.value}
          hint={item.hint}
        />
      ))}
    </div>
  );
}
