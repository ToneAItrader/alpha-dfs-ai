import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileNavProvider } from "@/components/layout/MobileNavContext";
import { Header } from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

function renderHeader(analysisStatus?: "idle" | "analyzing" | "complete") {
  return render(
    <MobileNavProvider>
      <Header analysisStatus={analysisStatus} />
    </MobileNavProvider>,
  );
}

describe("Header", () => {
  it("renders idle pipeline status by default", () => {
    renderHeader();
    expect(screen.getByTestId("header-analysis-status")).toHaveTextContent("Idle");
  });

  it("renders analyzing and complete statuses", () => {
    const { rerender } = renderHeader("analyzing");
    expect(screen.getByTestId("header-analysis-status")).toHaveTextContent("Analyzing");

    rerender(
      <MobileNavProvider>
        <Header analysisStatus="complete" />
      </MobileNavProvider>,
    );
    expect(screen.getByTestId("header-analysis-status")).toHaveTextContent("Complete");
  });
});
