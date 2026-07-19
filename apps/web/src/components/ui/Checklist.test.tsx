import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checklist } from "@/components/ui/Checklist";

describe("Checklist", () => {
  it("renders item states", () => {
    render(
      <Checklist
        items={[
          { id: "a", label: "Item complete", state: "complete" },
          { id: "b", label: "Item pending", state: "pending" },
        ]}
      />,
    );

    expect(screen.getByText("Item complete")).toBeInTheDocument();
    expect(screen.getByText("Item pending")).toBeInTheDocument();
    expect(screen.getAllByText("Complete")).toHaveLength(1);
    expect(screen.getAllByText("Pending")).toHaveLength(1);
  });
});
