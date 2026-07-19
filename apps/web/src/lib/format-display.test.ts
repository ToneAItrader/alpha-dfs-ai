import { describe, expect, it } from "vitest";
import {
  formatOptionalNumber,
  formatPortfolioStatus,
  formatReadinessStatus,
  formatSalary,
  formatVarianceRating,
} from "@/lib/format-display";

describe("format-display", () => {
  it("formats null numbers as em dash", () => {
    expect(formatOptionalNumber(null)).toBe("—");
  });

  it("formats numbers with suffix", () => {
    expect(formatOptionalNumber(95, "%")).toBe("95%");
  });

  it("formats readiness status labels", () => {
    expect(formatReadinessStatus("ready")).toBe("Ready");
  });

  it("formats variance rating", () => {
    expect(formatVarianceRating("high")).toBe("High");
    expect(formatVarianceRating(null)).toBe("—");
  });

  it("formats portfolio status", () => {
    expect(formatPortfolioStatus("complete")).toBe("Complete");
  });

  it("formats salary", () => {
    expect(formatSalary(50000)).toBe("$50,000");
    expect(formatSalary(null)).toBe("—");
  });
});
