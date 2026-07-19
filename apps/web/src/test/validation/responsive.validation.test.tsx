import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioReadinessPanel } from "@/components/portfolio-readiness/PortfolioReadinessPanel";
import { portfolioReadinessPlaceholder } from "@/config/portfolio-readiness-placeholders";

describe("responsive layout smoke checks", () => {
  it("PortfolioReadinessPanel renders without layout errors at narrow width", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 375 });
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <PortfolioReadinessPanel viewModel={portfolioReadinessPlaceholder} />,
    );

    expect(container.querySelector("section[aria-label='Portfolio readiness score']")).toBeTruthy();
  });

  it("PortfolioReadinessPanel renders without layout errors at desktop width", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <PortfolioReadinessPanel viewModel={portfolioReadinessPlaceholder} />,
    );

    expect(container.querySelector("section[aria-label='Prediction confidence']")).toBeTruthy();
  });
});
