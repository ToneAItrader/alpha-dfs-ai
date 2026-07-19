import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type InjuryOverviewSectionProps = {
  data?: SlateIntelligencePlaceholderData["injuries"];
};

export function InjuryOverviewSection({
  data = slateIntelligencePlaceholderData.injuries,
}: InjuryOverviewSectionProps) {
  return (
    <section aria-label="Injury overview">
      <SectionHeading title="Injury Overview" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Major Injuries", value: data.majorInjuries },
            { label: "Questionable Players", value: data.questionablePlayers },
            { label: "Backup Opportunities", value: data.backupOpportunities },
            { label: "Rookie Opportunities", value: data.rookieOpportunities },
          ]}
        />
      </Card>
    </section>
  );
}
