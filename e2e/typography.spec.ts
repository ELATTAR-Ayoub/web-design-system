import { expect, test } from "@playwright/test";

/**
 * The breakpoints, proved in a browser.
 *
 * `test/foundation/typography-contract.test.ts` asserts what the stylesheet
 * SAYS: two media blocks, at `(width >= 768px)` and `(width >= 1024px)`. It
 * cannot prove the transition actually lands between 767 and 768 — a media
 * query that never matches, a rule dropped by the compiler, or a later
 * declaration winning are all invisible to a text parser and all silent in the
 * browser. So this reads the computed size at the four widths either side of
 * both breakpoints.
 *
 * Two roles, one per face and one per behaviour: `.type-h1` is a word role
 * whose steps are close together, and `.type-number-xl` is the numeric role
 * with the widest travel.
 */

const STEPS = {
  // Flutter 0.0.3's `typography.dart`, which `styles/tokens.css` now matches
  // step for step: `h1` is 30 / 32 / 36 and `numberXl` is 36 / 42 / 48. The
  // previous numbers here (36/40/48, 40/48/56) were the pre-convergence
  // scale, and this test kept them for a whole round after the tokens moved.
  "type-h1": { mobile: "30px", tablet: "32px", desktop: "36px" },
  "type-number-xl": { mobile: "36px", tablet: "42px", desktop: "48px" },
} as const;

/** The first element carrying the class, measured as the browser paints it. */
async function fontSize(page: import("@playwright/test").Page, cls: string) {
  return page.evaluate((c) => {
    const el = document.querySelector(`.${c}`);
    if (!el) throw new Error(`no .${c} on the page`);
    return getComputedStyle(el).fontSize;
  }, cls);
}

test.describe("the type scale flips at 768 and 1024 and nowhere else", () => {
  // One project is enough: this is a viewport assertion, not a theme one, and
  // the page is the same in both.
  test.skip(({ browserName }) => browserName !== "chromium");

  for (const [cls, steps] of Object.entries(STEPS)) {
    test(`.${cls}`, async ({ page }) => {
      await page.goto("/design-system/typography");
      await page.waitForSelector(`.${cls}`);

      await page.setViewportSize({ width: 767, height: 900 });
      expect(await fontSize(page, cls), "767 is still the mobile step").toBe(steps.mobile);

      await page.setViewportSize({ width: 768, height: 900 });
      expect(await fontSize(page, cls), "768 is the tablet step").toBe(steps.tablet);

      await page.setViewportSize({ width: 1023, height: 900 });
      expect(await fontSize(page, cls), "1023 is still the tablet step").toBe(steps.tablet);

      await page.setViewportSize({ width: 1024, height: 900 });
      expect(await fontSize(page, cls), "1024 is the desktop step").toBe(steps.desktop);
    });
  }
});
