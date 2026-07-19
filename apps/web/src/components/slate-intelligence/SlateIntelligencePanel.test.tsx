import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SlateIntelligencePanel } from "@/components/slate-intelligence/SlateIntelligencePanel";
import { mapSlateIntelligence } from "@/lib/mappers/slate-intelligence-mapper";

describe("SlateIntelligencePanel", () => {
  it("renders all eight required sections", () => {
    render(<SlateIntelligencePanel viewModel={mapSlateIntelligence(undefined)} />);

    expect(screen.getByLabelText("Slate summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Slate grade")).toBeInTheDocument();
    expect(screen.getByLabelText("Recommended strategy")).toBeInTheDocument();
    expect(screen.getByLabelText("Injury overview")).toBeInTheDocument();
    expect(screen.getByLabelText("Weather summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Ownership outlook")).toBeInTheDocument();
    expect(screen.getByLabelText("Featured games")).toBeInTheDocument();
    expect(screen.getByLabelText("Intelligence summary")).toBeInTheDocument();
  });

  it("renders live mapped intelligence values", () => {
    render(
      <SlateIntelligencePanel
        viewModel={mapSlateIntelligence({
          slateGrade: 88,
          volatilityScore: 42,
          recommendedStrategy: "balanced",
          confidenceRating: 0.81,
          factors: ["Live factor"],
          slateName: "Live Slate",
          week: 3,
          gameCount: 9,
          teamCount: 18,
          totalPlayers: 144,
        })}
      />,
    );

    expect(screen.getByText("88/100")).toBeInTheDocument();
    expect(screen.getByText("81%")).toBeInTheDocument();
    expect(screen.getAllByText("Balanced").length).toBeGreaterThan(0);
    expect(screen.getByText("Live factor")).toBeInTheDocument();
  });
});
