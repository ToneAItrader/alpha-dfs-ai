"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

type ErrorDisplayProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorDisplay({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorDisplayProps) {
  return (
    <div
      data-testid="error-display"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-danger/30 bg-danger/5 px-6 py-10 text-center",
        className,
      )}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="max-w-md text-sm text-muted">{message}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground ring-1 ring-surface-border transition hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
