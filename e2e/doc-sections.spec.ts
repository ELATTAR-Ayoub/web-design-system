import { expect, test } from "@playwright/test";

/**
 * The collapsed-section contract on a component page — pinned here because
 * every OTHER spec runs with the reader's "Expand all" preference set (see
 * `playwright.config.ts`), so nothing else in the suite ever sees the closed
 * default a human sees.
 *
 * Three claims: closed by default after the Preview, the section's own hash
 * opens it, and the strip's toggle opens everything and remembers.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("documentation sections", () => {
  test("sections run in the canonical order, the first chapters open and the reference closed", async ({
    page,
  }) => {
    await page.goto("/design-system/components/button");
    await page.waitForLoadState("networkidle");

    await expect(page.locator('section#preview [data-slot="preview-stage"]').first()).toBeVisible();

    // Order: `lib/ds/docs/section-order.ts`, whatever order the page declared.
    const ids = await page.locator("article section[id]").evaluateAll((els) => els.map((el) => el.id));
    const canonical = ["preview", "installation", "variants", "states", "sizes", "examples", "usage"];
    const present = canonical.filter((id) => ids.includes(id));
    expect(ids.slice(0, present.length)).toEqual(present);

    // Open by default: installation, variants, sizes, examples, usage. Closed:
    // states and every reference section.
    const state = await page
      .locator("article section[id]")
      .evaluateAll((els) =>
        Object.fromEntries(
          els.map((el) => [el.id, el.querySelector("details") ? el.querySelector("details")!.open : "plain"]),
        ),
      );
    for (const id of ["installation", "variants", "sizes", "examples", "usage"]) {
      if (id in state) expect(state[id], `${id} opens by default`).toBe(true);
    }
    for (const id of ["states", "api", "accessibility", "keyboard", "responsive", "source"]) {
      if (id in state) expect(state[id], `${id} is closed by default`).toBe(false);
    }
    // Content is in the DOM while closed — find-in-page and fragment links
    // depend on it — just not visible.
    await expect(page.locator("section#api details > div").first()).toBeHidden();
  });

  test("the Preview stage is at least 640px tall", async ({ page }) => {
    await page.goto("/design-system/components/button");
    const stage = page.locator('section#preview [data-slot="preview-stage"]').first();
    await expect(stage).toBeVisible();
    const box = await stage.boundingBox();
    expect(Math.round(box!.height)).toBeGreaterThanOrEqual(640);
  });

  test("navigating to a section's hash opens that section", async ({ page }) => {
    await page.goto("/design-system/components/button#api");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("section#api details")).toHaveAttribute("open", "");
    await expect(page.locator("section#states details")).not.toHaveAttribute("open", "");

    // And a later hash change, from the rail or the strip.
    await page.evaluate(() => {
      window.location.hash = "#states";
    });
    await expect(page.locator("section#states details")).toHaveAttribute("open", "");
  });

  test("the summary toggles by keyboard, and Expand all opens everything and remembers", async ({
    page,
  }) => {
    await page.goto("/design-system/components/button");
    await page.waitForLoadState("networkidle");

    const summary = page.locator("section#api summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("section#api details")).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(page.locator("section#api details")).not.toHaveAttribute("open", "");

    // The strip is the below-`xl` control; make it visible.
    await page.setViewportSize({ width: 1100, height: 900 });
    const toggle = page.getByRole("button", { name: "Expand all" });
    await toggle.click();
    for (const d of await page.locator('details[data-slot="doc-section"]').all()) {
      await expect(d).toHaveAttribute("open", "");
    }
    await expect(page.getByRole("button", { name: "Collapse all" })).toBeVisible();

    await page.reload();
    // `domcontentloaded`, not `networkidle` — a live agent specimen's transport keeps
    // the network from ever going idle on some pages, and the assertion
    // below retries on its own.
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("section#api details")).toHaveAttribute("open", "", { timeout: 15_000 });
  });
});
