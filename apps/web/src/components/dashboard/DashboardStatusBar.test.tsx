import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardStatusBar } from "@/components/dashboard/DashboardStatusBar";

describe("DashboardStatusBar", () => {
  it("renders status fields from placeholder data", () => {
    render(<DashboardStatusBar />);

    expect(screen.getByLabelText("Dashboard status")).toBeInTheDocument();
    expect(screen.getByText("Current Slate")).toBeInTheDocument();
    expect(screen.getByText("Analysis Status")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Readiness")).toBeInTheDocument();
    expect(screen.getByText("Last Analysis")).toBeInTheDocument();
    expect(screen.getByText("Idle")).toBeInTheDocument();
    expect(screen.getByText("Not yet run")).toBeInTheDocument();
  });
});
