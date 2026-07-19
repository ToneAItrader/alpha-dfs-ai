import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalNumber, formatOptionalText } from "@/lib/format-display";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

type PredictionStabilitySectionProps = {
  data: ConfidenceIndicatorsViewModel["stability"];
};

export function PredictionStabilitySection({ data }: PredictionStabilitySectionProps) {
  return (
    <section aria-label="Prediction stability">
      <SectionHeading title="Prediction Stability" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Stability Score", value: formatOptionalNumber(data.stabilityScore) },
            {
              label: "Projection Consistency",
              value: formatOptionalText(data.projectionConsistency),
            },
            { label: "Variance", value: formatOptionalText(data.variance) },
            { label: "Reliability", value: formatOptionalText(data.reliability) },
          ]}
        />
      </Card>
    </section>
  );
}

type DataQualitySectionProps = {
  data: ConfidenceIndicatorsViewModel["quality"];
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
            { label: "Injury Coverage", value: formatOptionalText(data.injuryCoverage) },
            { label: "Weather Coverage", value: formatOptionalText(data.weatherCoverage) },
            { label: "Market Coverage", value: formatOptionalText(data.marketCoverage) },
            { label: "Expert Consensus", value: formatOptionalText(data.expertConsensus) },
          ]}
        />
      </Card>
    </section>
  );
}

type ModelAgreementSectionProps = {
  data: ConfidenceIndicatorsViewModel["agreement"];
};

export function ModelAgreementSection({ data }: ModelAgreementSectionProps) {
  return (
    <section aria-label="Model agreement">
      <SectionHeading title="Model Agreement" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Internal Agreement", value: formatOptionalText(data.internalAgreement) },
            { label: "External Agreement", value: formatOptionalText(data.externalAgreement) },
            {
              label: "Historical Agreement",
              value: formatOptionalText(data.historicalAgreement),
            },
            { label: "Overall Agreement", value: formatOptionalText(data.overallAgreement) },
          ]}
        />
      </Card>
    </section>
  );
}

type ProjectionCalibrationSectionProps = {
  data: ConfidenceIndicatorsViewModel["calibration"];
};

export function ProjectionCalibrationSection({ data }: ProjectionCalibrationSectionProps) {
  if (!data.enabled) {
    return null;
  }

  return (
    <section aria-label="Projection calibration">
      <SectionHeading title="Projection Calibration" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            {
              label: "Calibrated Projection",
              value: formatOptionalNumber(data.calibratedProjection),
            },
            {
              label: "Calibration Factor",
              value: formatOptionalNumber(data.calibrationFactor),
            },
          ]}
        />
        {data.notes.length > 0 ? (
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {data.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </Card>
    </section>
  );
}
