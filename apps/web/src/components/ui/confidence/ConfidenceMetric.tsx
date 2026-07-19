type ConfidenceMetricProps = {
  label: string;
  value: string;
};

export function ConfidenceMetric({ label, value }: ConfidenceMetricProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
