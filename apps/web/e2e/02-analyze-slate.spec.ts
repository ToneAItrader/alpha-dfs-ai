import { expect, test } from "@playwright/test";

test.describe("Analyze Slate", () => {
  test("runs analysis and reaches complete status", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("analysis-status")).toHaveText("Idle");

    const analyzeRequest = page.waitForResponse(
      (response) =>
        response.url().includes("/api/pipeline/analyze") && response.request().method() === "POST",
    );

    await page.getByTestId("analyze-slate-button").click();
    await expect(page.getByTestId("analyze-slate-button")).toHaveText("Analyzing Slate…");

    const response = await analyzeRequest;
    expect(response.ok()).toBeTruthy();

    await expect(page.getByTestId("analysis-status")).toHaveText("Complete", {
      timeout: 90_000,
    });
  });
});
