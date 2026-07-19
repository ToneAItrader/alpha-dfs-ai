import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedGamesSection } from "@/components/slate-intelligence/FeaturedGamesSection";

describe("FeaturedGamesSection", () => {
  it("renders featured game cards", () => {
    render(
      <FeaturedGamesSection
        games={[
          {
            id: "g1",
            matchup: "NYJ @ NE",
            vegasTotal: "42.5",
            spread: "NE -3.5",
            expectedPace: "Moderate",
          },
        ]}
      />,
    );

    expect(screen.getByText("NYJ @ NE")).toBeInTheDocument();
    expect(screen.getByText("42.5")).toBeInTheDocument();
    expect(screen.getByText("NE -3.5")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });
});
