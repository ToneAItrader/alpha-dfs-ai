import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrimaryLineupCard } from "@/components/ui/LineupCard";
import type { PrimaryLineupViewModel } from "@/types/recommended-portfolio-view-model";

const sampleLineup: PrimaryLineupViewModel = {
  lineupId: "p1",
  portfolioType: "primary",
  rank: 1,
  projectedPoints: 142.5,
  confidence: 82,
  risk: "Low",
  salaryUsed: 49800,
  ownership: 18,
  correlation: "QB + WR stack",
  leverage: 1.2,
  explainabilitySummary: "Strong primary stack with value at RB.",
};

describe("PrimaryLineupCard", () => {
  it("renders lineup metrics from view model", () => {
    render(<PrimaryLineupCard lineup={sampleLineup} />);

    expect(screen.getByRole("heading", { name: /Primary · Rank 1/i })).toBeInTheDocument();
    expect(screen.getByText("142.5")).toBeInTheDocument();
    expect(screen.getByText("$49,800")).toBeInTheDocument();
    expect(screen.getByText(/Strong primary stack/i)).toBeInTheDocument();
  });
});
