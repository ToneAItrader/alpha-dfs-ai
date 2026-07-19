import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ConfidenceBadge,
  ConfidenceCard,
  ConfidenceMetric,
  ConfidenceSummary,
} from "@/components/ui/confidence";

describe("ConfidenceBadge", () => {
  it("renders tier label", () => {
    render(<ConfidenceBadge label="High" tier="high" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders without tier", () => {
    render(<ConfidenceBadge label="Pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});

describe("ConfidenceMetric", () => {
  it("renders label and value", () => {
    render(<ConfidenceMetric label="Confidence Score" value="82" />);
    expect(screen.getByText("Confidence Score")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
  });
});

describe("ConfidenceCard", () => {
  it("renders title and children", () => {
    render(
      <ConfidenceCard title="Test Card">
        <p>Content</p>
      </ConfidenceCard>,
    );
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("ConfidenceSummary", () => {
  it("renders summary items", () => {
    render(
      <ConfidenceSummary
        items={[
          { label: "Stability", value: "—" },
          { label: "Quality", value: "—" },
        ]}
      />,
    );
    expect(screen.getByText("Stability")).toBeInTheDocument();
    expect(screen.getByText("Quality")).toBeInTheDocument();
  });
});
