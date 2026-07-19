import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SimulationResultsPanel } from "@/components/simulation-results/SimulationResultsPanel";

describe("SimulationResultsPanel", () => {
  it("renders all seven required sections", () => {
    render(<SimulationResultsPanel />);

    expect(screen.getByLabelText("Simulation overview")).toBeInTheDocument();
    expect(screen.getByLabelText("Projection summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Probability summary")).toBeInTheDocument();
    expect(screen.getByLabelText("GPP field metrics")).toBeInTheDocument();
    expect(screen.getByLabelText("Outcome distribution")).toBeInTheDocument();
    expect(screen.getByLabelText("Simulation insights")).toBeInTheDocument();
    expect(screen.getByLabelText("Analysis metadata")).toBeInTheDocument();
  });

  it("renders placeholder insights", () => {
    render(<SimulationResultsPanel />);

    expect(screen.getByText("High ceiling portfolio (placeholder)")).toBeInTheDocument();
    expect(screen.getByText("Median Projection")).toBeInTheDocument();
  });
});
