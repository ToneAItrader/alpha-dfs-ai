import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

describe("RecentActivity", () => {
  it("renders empty state when no activity", () => {
    render(<RecentActivity />);

    expect(screen.getByLabelText("Recent activity")).toBeInTheDocument();
    expect(screen.getByText("No analysis runs yet")).toBeInTheDocument();
  });

  it("renders activity items when provided", () => {
    render(
      <RecentActivity
        items={[
          { id: "1", label: "Week 1 Main Slate", timestamp: "2026-07-18 14:00 UTC" },
        ]}
      />,
    );

    expect(screen.getByText("Week 1 Main Slate")).toBeInTheDocument();
    expect(screen.getByText("2026-07-18 14:00 UTC")).toBeInTheDocument();
  });
});
