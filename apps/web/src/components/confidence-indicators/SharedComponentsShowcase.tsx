import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ConfidenceBadge,
  ConfidenceCard,
  ConfidenceMetric,
  ConfidenceSummary,
} from "@/components/ui/confidence";

export function SharedComponentsShowcase() {
  return (
    <section aria-label="Shared confidence components">
      <SectionHeading
        title="Shared Components"
        description="Reusable PCE presentation components for embedding across analysis pages."
      />
      <div className="space-y-6">
        <ConfidenceCard title="ConfidenceBadge" description="Tier-based confidence label.">
          <div className="flex flex-wrap gap-2">
            <ConfidenceBadge label="High" tier="high" />
            <ConfidenceBadge label="Moderate" tier="moderate" />
            <ConfidenceBadge label="Low" tier="low" />
            <ConfidenceBadge label="Pending" />
          </div>
        </ConfidenceCard>

        <ConfidenceCard title="ConfidenceMetric" description="Single confidence metric display.">
          <dl className="grid gap-4 sm:grid-cols-2">
            <ConfidenceMetric label="Confidence Score" value="—" />
            <ConfidenceMetric label="Reliability Grade" value="—" />
          </dl>
        </ConfidenceCard>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">ConfidenceSummary</h3>
          <ConfidenceSummary
            columns={3}
            items={[
              { label: "Stability", value: "—" },
              { label: "Data Quality", value: "—" },
              { label: "Agreement", value: "—" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
