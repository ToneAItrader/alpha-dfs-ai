import { expect, test } from "@playwright/test";
import { analysisPanelRoutes } from "./fixtures/test-env";

test.describe("Navigation", () => {
  for (const panel of analysisPanelRoutes) {
    test(`reaches ${panel.label}`, async ({ page }) => {
      await page.goto(panel.href);
      await expect(page.getByRole("heading", { name: panel.heading, level: 1 })).toBeVisible();
      await expect(page.getByRole("link", { name: panel.label })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  }
});
