import { APP_SCOPE } from "@/config/navigation";

const APP_VERSION = "0.1.0";

export function AppFooter() {
  return (
    <footer className="mt-8 border-t border-surface-border pt-6">
      <div className="flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            <span className="font-medium text-foreground">Version</span> {APP_VERSION}
          </p>
          <p>
            <span className="font-medium text-foreground">Architecture Freeze</span> v1.0
            APPROVED
          </p>
        </div>
        <div className="space-y-1 sm:text-right">
          <p className="font-medium text-foreground">Scope</p>
          <p>DraftKings · NFL · Classic Salary Cap</p>
          <p className="text-muted">{APP_SCOPE}</p>
        </div>
      </div>
    </footer>
  );
}
