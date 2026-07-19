import { describe, expect, it } from "vitest";
import { mapConfidenceIndicators } from "@/lib/mappers/confidence-mapper";
import { idleConfidenceDto } from "@/test/fixtures/analysis-dto-fixtures";

describe("confidence-mapper", () => {
  it("defaults calibration block when DTO omits calibrated fields", () => {
    const viewModel = mapConfidenceIndicators(idleConfidenceDto);

    expect(viewModel.calibration).toEqual({
      enabled: false,
      calibratedProjection: null,
      calibrationFactor: null,
      notes: [],
    });
  });

  it("maps live calibration summary from DTO", () => {
    const viewModel = mapConfidenceIndicators({
      ...idleConfidenceDto,
      status: "ready",
      calibratedProjection: 19.4,
      calibrationFactor: 0.97,
      calibrationNotes: ["Calibrated 3 of 15 slate players"],
    });

    expect(viewModel.calibration.enabled).toBe(true);
    expect(viewModel.calibration.calibratedProjection).toBe(19.4);
    expect(viewModel.calibration.calibrationFactor).toBe(0.97);
    expect(viewModel.calibration.notes).toEqual(["Calibrated 3 of 15 slate players"]);
  });
});
