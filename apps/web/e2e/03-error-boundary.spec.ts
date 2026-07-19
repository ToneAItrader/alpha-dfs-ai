import { expect, test } from "@playwright/test";

test.describe("Analysis error handling", () => {
  test("shows analyze error state instead of a blank page", async ({ page }) => {
    await page.route("**/api/pipeline/analyze", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Analysis failed" }),
      });
    });

    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.getByTestId("analyze-slate-button").click();

    await expect(page.getByTestId("analyze-slate-error")).toBeVisible();
    await expect(page.getByTestId("analyze-slate-error")).toContainText(
      "Unable to start analysis",
    );
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("analyze-slate-button")).toBeEnabled();
  });
});
