import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerEvidencePanel } from "@/components/player-evidence/PlayerEvidencePanel";

describe("PlayerEvidencePanel", () => {
  it("renders all six required sections", () => {
    render(<PlayerEvidencePanel />);

    expect(screen.getByLabelText("Evidence overview")).toBeInTheDocument();
    expect(screen.getByLabelText("Player evidence cards")).toBeInTheDocument();
    expect(screen.getByLabelText("Evidence sources")).toBeInTheDocument();
    expect(screen.getByLabelText("Confidence summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Explainability summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Analysis metadata")).toBeInTheDocument();
  });

  it("renders placeholder player cards", () => {
    render(<PlayerEvidencePanel />);

    expect(screen.getByText("Player One")).toBeInTheDocument();
    expect(screen.getByText("Historical Performance")).toBeInTheDocument();
    expect(screen.getByText("Strong matchup (placeholder)")).toBeInTheDocument();
  });
});
