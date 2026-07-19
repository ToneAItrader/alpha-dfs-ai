import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with accessible status", () => {
    render(<LoadingSpinner label="Loading dashboard" />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading dashboard");
    expect(screen.getByText("Loading dashboard")).toBeInTheDocument();
  });
});
