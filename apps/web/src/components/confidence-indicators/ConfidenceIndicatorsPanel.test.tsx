import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConfidenceIndicatorsPanel } from "@/components/confidence-indicators/ConfidenceIndicatorsPanel";

describe("ConfidenceIndicatorsPanel", () => {
  it("renders all six required sections", () => {
    render(<ConfidenceIndicatorsPanel />);

    expect(screen.getByLabelText("Confidence overview")).toBeInTheDocument();
    expect(screen.getByLabelText("Prediction stability")).toBeInTheDocument();
    expect(screen.getByLabelText("Data quality")).toBeInTheDocument();
    expect(screen.getByLabelText("Model agreement")).toBeInTheDocument();
    expect(screen.getByLabelText("Confidence insights")).toBeInTheDocument();
    expect(screen.getByLabelText("Analysis metadata")).toBeInTheDocument();
  });

  it("renders placeholder insights", () => {
    render(<ConfidenceIndicatorsPanel />);

    expect(screen.getByText("High confidence recommendation (placeholder)")).toBeInTheDocument();
    expect(screen.getByText("Stability Score")).toBeInTheDocument();
  });

  it("renders shared component showcase when enabled", () => {
    render(<ConfidenceIndicatorsPanel showComponentShowcase />);

    expect(screen.getByLabelText("Shared confidence components")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
