import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatDataSourceStatus,
  formatOptionalNumber,
} from "@/lib/format-display";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type DataQualitySectionProps = {
  data: PortfolioReadinessViewModel["dataQuality"];
};

export function DataQualitySection({ data }: DataQualitySectionProps) {
  return (
    <section aria-label="Data quality">
      <SectionHeading title="Data Quality" />
      <Card>
        <DetailGrid
          columns={3}
          items={[
            {
              label: "Data Completeness",
              value: formatOptionalNumber(data.dataCompleteness, "%"),
            },
            {
              label: "Injury Data Status",
              value: formatDataSourceStatus(data.injuryDataStatus),
            },
            {
              label: "Weather Data Status",
              value: formatDataSourceStatus(data.weatherDataStatus),
            },
            {
              label: "Market Data Status",
              value: formatDataSourceStatus(data.marketDataStatus),
            },
            {
              label: "Expert Consensus Status",
              value: formatDataSourceStatus(data.expertConsensusStatus),
            },
          ]}
        />
      </Card>
    </section>
  );
}
