import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type SummaryRecommendationsSectionProps = {
  insights: PortfolioReadinessViewModel["summary"]["insights"];
};

export function SummaryRecommendationsSection({
  insights,
}: SummaryRecommendationsSectionProps) {
  return (
    <section aria-label="Summary and recommendations">
      <SectionHeading title="Summary & Recommendations" />
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
