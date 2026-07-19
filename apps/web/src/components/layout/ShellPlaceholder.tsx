type ShellPlaceholderProps = {
  title: string;
  description: string;
  taskId?: string;
};

export function ShellPlaceholder({
  title,
  description,
  taskId,
}: ShellPlaceholderProps) {
  return (
    <div className="grid gap-6">
      <div className="rounded-xl border border-dashed border-surface-border bg-surface/50 p-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted ring-1 ring-surface-border">
            Application Shell
          </span>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
          {taskId ? (
            <p className="text-xs text-muted">
              Content will be implemented in Task {taskId}.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((slot) => (
          <div
            key={slot}
            className="h-32 animate-pulse rounded-xl bg-surface-elevated ring-1 ring-surface-border"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
