import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDataSourceStatus } from "@/lib/format-display";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";
import { cn } from "@/lib/cn";

type EvidenceSourcesSectionProps = {
  categories: PlayerEvidenceViewModel["evidenceSourceCategories"];
};

export function EvidenceSourcesSection({ categories }: EvidenceSourcesSectionProps) {
  return (
    <section aria-label="Evidence sources">
      <SectionHeading title="Evidence Sources" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="flex items-center justify-between gap-2 py-4">
            <span className="text-sm font-medium text-foreground">{category.label}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                statusStyles[category.status],
              )}
            >
              {formatDataSourceStatus(category.status)}
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}

const statusStyles = {
  available: "bg-success/10 text-success ring-success/30",
  partial: "bg-warning/10 text-warning ring-warning/30",
  pending: "bg-muted/20 text-muted ring-muted/30",
  unavailable: "bg-muted/20 text-muted ring-muted/30",
};
