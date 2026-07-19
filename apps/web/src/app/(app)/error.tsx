"use client";

import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Unable to load this view"
      message={error.message || "An unexpected error occurred while rendering this page."}
      onRetry={reset}
    />
  );
}
