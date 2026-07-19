import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type SlateSummarySectionProps = {
  data?: SlateIntelligencePlaceholderData["summary"];
};

export function SlateSummarySection({
  data = slateIntelligencePlaceholderData.summary,
}: SlateSummarySectionProps) {
  return (
    <section aria-label="Slate summary">
      <SectionHeading title="Slate Summary" />
      <Card>
        <DetailGrid
          columns={3}
          items={[
            { label: "Slate Name", value: data.slateName },
            { label: "Week", value: data.week },
            { label: "Main Slate Date", value: data.mainSlateDate },
            { label: "Games", value: data.games },
            { label: "Teams", value: data.teams },
            { label: "Total Players", value: data.totalPlayers },
          ]}
        />
      </Card>
    </section>
  );
}
