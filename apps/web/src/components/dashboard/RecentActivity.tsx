import { dashboardPlaceholderData } from "@/config/dashboard-placeholders";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type RecentActivityProps = {
  items?: typeof dashboardPlaceholderData.recentActivity;
};

export function RecentActivity({
  items = dashboardPlaceholderData.recentActivity,
}: RecentActivityProps) {
  return (
    <section aria-label="Recent activity">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Recent Activity
      </h2>
      <Card>
        {items.length === 0 ? (
          <EmptyState
            title="No analysis runs yet"
            description="Recent slate analyses will appear here after you run Analyze Slate."
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-foreground">{item.label}</span>
                <span className="text-xs text-muted">{item.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
