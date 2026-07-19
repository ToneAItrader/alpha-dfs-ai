import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type OwnershipOutlookSectionProps = {
  data?: SlateIntelligencePlaceholderData["ownership"];
};

export function OwnershipOutlookSection({
  data = slateIntelligencePlaceholderData.ownership,
}: OwnershipOutlookSectionProps) {
  return (
    <section aria-label="Ownership outlook">
      <SectionHeading title="Ownership Outlook" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Chalk Players", value: data.chalkPlayers },
            { label: "Contrarian Opportunities", value: data.contrarianOpportunities },
            { label: "Ownership Concentration", value: data.ownershipConcentration },
            { label: "Leverage Opportunities", value: data.leverageOpportunities },
          ]}
        />
      </Card>
    </section>
  );
}
