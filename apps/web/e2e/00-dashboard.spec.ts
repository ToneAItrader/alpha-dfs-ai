import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("loads idle dashboard without server error", async ({ page }) => {
    const response = await page.goto("/dashboard");
    expect(response?.status()).toBe(200);

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("analysis-status")).toHaveText("Idle");
    await expect(page.getByTestId("analyze-slate-button")).toBeVisible();
    await expect(
      page.getByTestId("dashboard-page").getByText("DraftKings · NFL · Classic", { exact: true }),
    ).toBeVisible();
  });
});
