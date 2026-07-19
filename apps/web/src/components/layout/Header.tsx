import { MobileNavToggle } from "@/components/layout/MobileNavToggle";
import { APP_SCOPE } from "@/config/navigation";
import {
  pipelineStatusLabels,
  pipelineStatusStyles,
  type PipelineDisplayStatus,
} from "@/lib/mappers/pipeline-status-mapper";

type HeaderProps = {
  analysisStatus?: PipelineDisplayStatus;
};

export function Header({ analysisStatus = "idle" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <MobileNavToggle />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              DraftKings NFL Classic
            </p>
            <p className="truncate text-xs text-muted">{APP_SCOPE}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            data-testid="header-analysis-status"
            className={`hidden rounded-full px-3 py-1 text-xs font-medium ring-1 sm:inline-flex ${pipelineStatusStyles[analysisStatus]}`}
            aria-live="polite"
          >
            {pipelineStatusLabels[analysisStatus]}
          </span>
        </div>
      </div>
    </header>
  );
}
