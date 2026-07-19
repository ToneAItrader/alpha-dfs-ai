import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type RecommendedStrategySectionProps = {
  data?: SlateIntelligencePlaceholderData["recommendedStrategy"];
};

export function RecommendedStrategySection({
  data = slateIntelligencePlaceholderData.recommendedStrategy,
}: RecommendedStrategySectionProps) {
  return (
    <section aria-label="Recommended strategy">
      <SectionHeading
        title="Recommended Strategy"
        description="Placeholder strategy options from Slate Intelligence Agent."
      />
      <Card>
        <p className="mb-4 text-xs text-muted">
          Primary recommendation:{" "}
          <span className="font-medium text-accent">{data.primary}</span>
        </p>
        <ul className="flex flex-wrap gap-2">
          {data.options.map((option) => {
            const isPrimary = option === data.primary;
            return (
              <li key={option}>
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1",
                    isPrimary
                      ? "bg-accent/10 text-accent ring-accent/30"
                      : "bg-surface text-muted ring-surface-border",
                  )}
                >
                  {option}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
