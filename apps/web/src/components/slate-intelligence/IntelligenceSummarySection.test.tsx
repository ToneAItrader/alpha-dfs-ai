import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntelligenceSummarySection } from "@/components/slate-intelligence/IntelligenceSummarySection";

describe("IntelligenceSummarySection", () => {
  it("renders placeholder insights", () => {
    render(
      <IntelligenceSummarySection
        insights={["High scoring environment", "Elite leverage"]}
      />,
    );

    expect(screen.getByText("High scoring environment")).toBeInTheDocument();
    expect(screen.getByText("Elite leverage")).toBeInTheDocument();
  });
});
