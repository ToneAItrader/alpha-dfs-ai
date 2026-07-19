"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePipelineStatus } from "@/providers/pipeline-status-provider";
import { cn } from "@/lib/cn";

type AnalyzeSlateButtonProps = {
  className?: string;
};

export function AnalyzeSlateButton({ className }: AnalyzeSlateButtonProps) {
  const router = useRouter();
  const { refreshPipelineStatus, notifyAnalyzing } = usePipelineStatus();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setIsRunning(true);
    setError(null);
    notifyAnalyzing();

    try {
      const response = await fetch("/api/pipeline/analyze", { method: "POST" });
      if (!response.ok) {
        throw new Error("Analysis request failed");
      }
      router.refresh();
      await refreshPipelineStatus();
    } catch {
      setError("Unable to start analysis. Please try again.");
      await refreshPipelineStatus();
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <button
        type="button"
        data-testid="analyze-slate-button"
        onClick={handleAnalyze}
        disabled={isRunning}
        aria-busy={isRunning}
        className="inline-flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-background transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Play className="h-5 w-5" aria-hidden="true" />
        {isRunning ? "Analyzing Slate…" : "Analyze Slate"}
      </button>
      <p className="text-center text-xs text-muted">
        Manual-run analysis trigger — refreshes results on completion
      </p>
      {error ? (
        <p data-testid="analyze-slate-error" className="text-center text-xs text-warning">
          {error}
        </p>
      ) : null}
    </div>
  );
}
