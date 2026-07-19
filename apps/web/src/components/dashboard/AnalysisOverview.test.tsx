import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnalysisOverview } from "@/components/dashboard/AnalysisOverview";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("AnalysisOverview", () => {
  it("renders linked overview sections", () => {
    render(<AnalysisOverview />);

    expect(screen.getByLabelText("Analysis overview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Slate Intelligence/i })).toHaveAttribute(
      "href",
      "/slate-intelligence",
    );
    expect(screen.getByRole("link", { name: /Recommended Portfolio/i })).toHaveAttribute(
      "href",
      "/recommended-portfolio",
    );
    expect(screen.getByRole("link", { name: /Player Evidence/i })).toHaveAttribute(
      "href",
      "/player-evidence",
    );
    expect(screen.getByRole("link", { name: /Portfolio Health/i })).toHaveAttribute(
      "href",
      "/portfolio-health",
    );
  });
});
