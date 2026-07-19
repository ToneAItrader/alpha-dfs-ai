import { ConfidenceSummary } from "@/components/ui/confidence";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatLastAnalysis,
  formatOptionalNumber,
  formatReadinessStatus,
  formatSimulationStatus,
} from "@/lib/format-display";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

type SimulationOverviewSectionProps = {
  data: SimulationResultsViewModel["overview"];
};

export function SimulationOverviewSection({ data }: SimulationOverviewSectionProps) {
  return (
    <section aria-label="Simulation overview">
      <SectionHeading title="Simulation Overview" />
      <ConfidenceSummary
        items={[
          {
            label: "Simulation Status",
            value: formatSimulationStatus(data.simulationStatus),
          },
          {
            label: "Simulation Count",
            value: formatOptionalNumber(data.simulationCount),
          },
          {
            label: "Last Run",
            value: formatLastAnalysis(data.lastRunAt),
          },
          {
            label: "Analysis Status",
            value: formatReadinessStatus(data.analysisStatus),
          },
        ]}
      />
    </section>
  );
}
