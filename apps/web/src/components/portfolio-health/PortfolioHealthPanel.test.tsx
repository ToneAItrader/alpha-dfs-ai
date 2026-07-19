import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioHealthPanel } from "@/components/portfolio-health/PortfolioHealthPanel";

describe("PortfolioHealthPanel", () => {
  it("renders all eight required sections", () => {
    render(<PortfolioHealthPanel />);

    expect(screen.getByLabelText("Portfolio health overview")).toBeInTheDocument();
    expect(screen.getByLabelText("Exposure balance")).toBeInTheDocument();
    expect(screen.getByLabelText("Stack diversity")).toBeInTheDocument();
    expect(screen.getByLabelText("Ownership distribution")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary distribution")).toBeInTheDocument();
    expect(screen.getByLabelText("Risk profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Health recommendations")).toBeInTheDocument();
    expect(screen.getByLabelText("Analysis metadata")).toBeInTheDocument();
  });

  it("renders placeholder recommendations", () => {
    render(<PortfolioHealthPanel />);

    expect(screen.getByText("Exposure is balanced (placeholder)")).toBeInTheDocument();
    expect(screen.getByText("QB Exposure")).toBeInTheDocument();
  });
});
