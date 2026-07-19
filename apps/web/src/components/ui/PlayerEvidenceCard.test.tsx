import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerEvidenceCard } from "@/components/ui/PlayerEvidenceCard";
import type { PlayerEvidenceItemViewModel } from "@/types/player-evidence-view-model";

const samplePlayer: PlayerEvidenceItemViewModel = {
  playerId: "p1",
  name: "Josh Allen",
  position: "QB",
  team: "BUF",
  opponent: "KC",
  salary: 8200,
  projectedPoints: 24.5,
  confidence: 88,
  confidenceTier: "high",
  risk: "Low",
  injuryStatus: "healthy",
  matchupSummary: "Favorable implied total",
  ownershipOutlook: "Chalk",
  evidenceSources: ["expert_consensus"],
  explainabilitySummary: "Strong passing volume expected.",
};

describe("PlayerEvidenceCard", () => {
  it("renders player evidence fields from view model", () => {
    render(<PlayerEvidenceCard player={samplePlayer} />);

    expect(screen.getByText("Josh Allen")).toBeInTheDocument();
    expect(screen.getByText(/QB · BUF vs KC/i)).toBeInTheDocument();
    expect(screen.getByText("$8,200")).toBeInTheDocument();
    expect(screen.getByText("24.5")).toBeInTheDocument();
    expect(screen.getByText(/Strong passing volume/i)).toBeInTheDocument();
  });
});
