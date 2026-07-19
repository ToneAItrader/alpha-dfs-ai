import { Card } from "@/components/ui/Card";
import { Checklist } from "@/components/ui/Checklist";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type ReadinessChecklistSectionProps = {
  items: PortfolioReadinessViewModel["checklist"];
};

export function ReadinessChecklistSection({ items }: ReadinessChecklistSectionProps) {
  return (
    <section aria-label="Readiness checklist">
      <SectionHeading title="Readiness Checklist" />
      <Card>
        <Checklist items={items} />
      </Card>
    </section>
  );
}
