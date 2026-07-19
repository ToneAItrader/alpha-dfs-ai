import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type WeatherSummarySectionProps = {
  data?: SlateIntelligencePlaceholderData["weather"];
};

export function WeatherSummarySection({
  data = slateIntelligencePlaceholderData.weather,
}: WeatherSummarySectionProps) {
  return (
    <section aria-label="Weather summary">
      <SectionHeading title="Weather Summary" />
      <Card>
        <DetailGrid
          columns={4}
          items={[
            { label: "Wind", value: data.wind },
            { label: "Rain", value: data.rain },
            { label: "Snow", value: data.snow },
            { label: "Temperature", value: data.temperature },
          ]}
        />
      </Card>
    </section>
  );
}
