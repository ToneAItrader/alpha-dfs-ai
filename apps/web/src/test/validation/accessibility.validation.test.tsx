import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppLoading from "@/app/(app)/loading";
import AppError from "@/app/(app)/error";
import {
  ConfidenceBadge,
  ConfidenceCard,
  ConfidenceMetric,
  ConfidenceSummary,
} from "@/components/ui/confidence";

describe("app loading and error states", () => {
  it("renders accessible loading spinner", () => {
    render(<AppLoading />);
    expect(screen.getByRole("status", { name: "Loading view" })).toBeInTheDocument();
  });

  it("renders accessible error display with retry", () => {
    render(<AppError error={new Error("Provider failed")} reset={() => undefined} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Unable to load this view" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});

describe("shared confidence accessibility", () => {
  it("ConfidenceMetric uses semantic definition list structure", () => {
    render(<ConfidenceMetric label="Confidence Score" value="82" />);

    expect(screen.getByText("Confidence Score").tagName).toBe("DT");
    expect(screen.getByText("82").tagName).toBe("DD");
  });

  it("ConfidenceCard exposes heading for titled cards", () => {
    render(
      <ConfidenceCard title="Prediction Stability">
        <ConfidenceSummary items={[{ label: "Score", value: "72" }]} />
      </ConfidenceCard>,
    );

    expect(screen.getByRole("heading", { name: "Prediction Stability" })).toBeInTheDocument();
  });

  it("ConfidenceBadge renders visible tier text", () => {
    render(<ConfidenceBadge label="High confidence" tier="high" />);
    expect(screen.getByText("High confidence")).toBeVisible();
  });

  it("ConfidenceSummary renders all provided labels", () => {
    render(
      <ConfidenceSummary
        columns={2}
        items={[
          { label: "Overall Confidence", value: "78" },
          { label: "Reliability Grade", value: "B" },
        ]}
      />,
    );

    expect(screen.getByText("Overall Confidence")).toBeInTheDocument();
    expect(screen.getByText("Reliability Grade")).toBeInTheDocument();
  });
});
