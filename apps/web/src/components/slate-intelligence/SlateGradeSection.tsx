import { SummaryCard } from "@/components/ui/SummaryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type SlateGradeSectionProps = {
  data?: SlateIntelligencePlaceholderData["grade"];
};

export function SlateGradeSection({
  data = slateIntelligencePlaceholderData.grade,
}: SlateGradeSectionProps) {
  return (
    <section aria-label="Slate grade">
      <SectionHeading title="Slate Grade" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Overall Grade" value={data.overallGrade} />
        <SummaryCard label="Confidence" value={data.confidence} />
        <SummaryCard label="Volatility" value={data.volatility} />
        <SummaryCard label="Predictability" value={data.predictability} />
      </div>
    </section>
  );
}
