import { expect, test } from "@playwright/test";

test.describe("Charts family gallery", () => {
  // First navigation compiles and hydrates ten Recharts specimens in dev.
  test.setTimeout(120_000);

  test("all seven families select real, individually stateful chart specimens", async ({ page }) => {
    await page.goto("/design-system/components/charts");
    await page.waitForLoadState("networkidle");

    const tabs = page.locator('[aria-label="Chart family"] button');
    await expect(tabs).toHaveCount(7);
    await expect(page.locator('[data-slot="chart-state-slot"]')).toHaveCount(10);

    await page.locator('[aria-label="Chart family"]').getByRole("radio", { name: "Pie" }).click();
    await expect(page).toHaveURL(/family=pie/, { timeout: 15_000 });
    await expect(page.locator('[data-slot="chart-state-slot"]')).toHaveCount(11);

    const firstState = page.locator('[aria-label="Simple — chart state"]');
    await firstState.getByRole("radio", { name: "Empty" }).click();
    await expect(page.getByText("No data in this range").first()).toBeVisible();
    await firstState.getByRole("radio", { name: "Ready" }).click();
    await expect(page.getByText("No data in this range")).toHaveCount(0);

    await page.locator('[aria-label="Chart family"]').getByRole("radio", { name: "Tooltips" }).click();
    await expect(page).toHaveURL(/family=tooltips/, { timeout: 15_000 });
    await expect(page.locator('[data-slot="chart-state-slot"]')).toHaveCount(9);
  });

  test("the gallery source toggle shows the selected family source", async ({ page }) => {
    await page.goto("/design-system/components/charts?family=bar");
    await page.waitForLoadState("networkidle");
    const toggle = page.locator('[data-slot="preview-code-toggle"]');
    await toggle.getByRole("radio", { name: "Code" }).click();
    await expect(page.locator('[data-slot="preview-stage"]')).toBeHidden();
    await expect(page.getByText("Ten Bar compositions")).toBeVisible();
    await toggle.getByRole("radio", { name: "Preview" }).click();
    await expect(page.locator('[data-slot="preview-stage"]')).toBeVisible();
  });
});
