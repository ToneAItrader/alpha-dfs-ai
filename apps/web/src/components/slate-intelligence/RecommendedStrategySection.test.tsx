import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecommendedStrategySection } from "@/components/slate-intelligence/RecommendedStrategySection";

describe("RecommendedStrategySection", () => {
  it("highlights primary strategy placeholder", () => {
    render(
      <RecommendedStrategySection
        data={{
          primary: "Tournament Focus",
          options: ["Balanced", "Tournament Focus", "Cash Focus"],
        }}
      />,
    );

    expect(screen.getAllByText("Tournament Focus")).toHaveLength(2);
    expect(screen.getByText(/Primary recommendation/i)).toBeInTheDocument();
  });
});
