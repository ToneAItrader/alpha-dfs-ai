import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          404
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="max-w-md text-sm text-muted">
          The requested route does not exist in Alpha DFS AI.
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Return to Dashboard
        </Link>
      </div>
    </AppShell>
  );
}
