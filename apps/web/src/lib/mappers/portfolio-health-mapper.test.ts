import { describe, expect, it } from "vitest";
import { mapPortfolioHealth } from "@/lib/mappers/portfolio-health-mapper";
import { idlePortfolioHealthDto } from "@/test/fixtures/analysis-dto-fixtures";

describe("portfolio-health-mapper", () => {
  it("defaults exposure summary when DTO omits it", () => {
    const viewModel = mapPortfolioHealth(idlePortfolioHealthDto);

    expect(viewModel.exposureSummary).toEqual({
      playerExposures: [],
      teamExposures: [],
      stackExposures: [],
      salaryFlexibilityPct: null,
      warnings: [],
    });
  });

  it("maps live multi-lineup exposure summary from DTO", () => {
    const viewModel = mapPortfolioHealth({
      ...idlePortfolioHealthDto,
      overview: {
        ...idlePortfolioHealthDto.overview,
        overallStatus: "healthy",
        overallHealthScore: 82,
      },
      exposureSummary: {
        playerExposures: [{ playerId: "p1", name: "Player One", exposurePct: 100 }],
        teamExposures: [{ team: "BUF", exposurePct: 22.2 }],
        stackExposures: [{ gameId: "BUF@KC", exposurePct: 16.7 }],
        salaryFlexibilityPct: 1.2,
        warnings: ["Elevated BUF team exposure (22.2%)"],
      },
    });

    expect(viewModel.exposureSummary.playerExposures).toHaveLength(1);
    expect(viewModel.exposureSummary.warnings[0]).toContain("BUF");
  });
});
