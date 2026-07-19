import { dashboardPlaceholderData } from "@/config/dashboard-placeholders";
import { cn } from "@/lib/cn";
import {
  pipelineStatusLabels,
  pipelineStatusStyles,
  type PipelineDisplayStatus,
} from "@/lib/mappers/pipeline-status-mapper";

type DashboardStatusBarProps = {
  data?: typeof dashboardPlaceholderData;
};

export function DashboardStatusBar({
  data = dashboardPlaceholderData,
}: DashboardStatusBarProps) {
  const status = data.analysisStatus as PipelineDisplayStatus;

  return (
    <section
      aria-label="Dashboard status"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <StatusItem label="Current Slate" value={data.currentSlate} />
      <StatusItem label="Analysis Status">
        <span
          data-testid="analysis-status"
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ring-1",
            pipelineStatusStyles[status],
          )}
        >
          {pipelineStatusLabels[status]}
        </span>
      </StatusItem>
      <StatusItem label="Portfolio Readiness" value={data.portfolioReadiness} />
      <StatusItem label="Last Analysis" value={data.lastAnalysisAt} />
    </section>
  );
}

function StatusItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1 text-sm font-medium text-foreground">
        {children ?? value}
      </div>
    </div>
  );
}
