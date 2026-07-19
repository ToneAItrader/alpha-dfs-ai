import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PipelineStatusProvider } from "@/providers/pipeline-status-provider";
import { AnalyzeSlateButton } from "@/components/dashboard/AnalyzeSlateButton";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

function renderAnalyzeButton() {
  return render(
    <PipelineStatusProvider>
      <AnalyzeSlateButton />
    </PipelineStatusProvider>,
  );
}

describe("AnalyzeSlateButton", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "idle",
          currentSlate: "No slate loaded",
          portfolioReadiness: "Pending",
          lastAnalysisAt: "Never",
          runId: null,
        }),
      }),
    );
  });

  it("renders enabled analyze control", () => {
    renderAnalyzeButton();

    const button = screen.getByRole("button", { name: /analyze slate/i });
    expect(button).not.toBeDisabled();
  });

  it("shows manual-run helper message", () => {
    renderAnalyzeButton();

    expect(screen.getByText(/Manual-run analysis trigger/i)).toBeInTheDocument();
  });
});
