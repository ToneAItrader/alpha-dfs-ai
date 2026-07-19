import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "@/components/dashboard/SummaryCards";

describe("SummaryCards", () => {
  it("renders all summary card placeholders", () => {
    render(<SummaryCards />);

    expect(screen.getByLabelText("Summary cards")).toBeInTheDocument();
    expect(screen.getByText("Readiness Grade")).toBeInTheDocument();
    expect(screen.getByText("Confidence")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Grade")).toBeInTheDocument();
    expect(screen.getByText("Simulation Status")).toBeInTheDocument();
  });
});
