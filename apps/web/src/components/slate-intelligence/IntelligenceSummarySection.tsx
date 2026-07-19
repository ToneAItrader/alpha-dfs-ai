import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type IntelligenceSummarySectionProps = {
  insights?: SlateIntelligencePlaceholderData["intelligenceSummary"];
};

export function IntelligenceSummarySection({
  insights = slateIntelligencePlaceholderData.intelligenceSummary,
}: IntelligenceSummarySectionProps) {
  return (
    <section aria-label="Intelligence summary">
      <SectionHeading title="Intelligence Summary" />
      <Card>
        <ul className="space-y-2">
          {insights.map((insight) => (
            <li
              key={insight}
              className="flex items-start gap-2 text-sm text-foreground before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']"
            >
              {insight}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
