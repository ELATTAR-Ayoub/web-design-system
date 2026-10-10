import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

/**
 * Rendered behaviour for batch 5 of the component audit
 * (`docs/audits/web-component-audit.md`) — what is left of the agent family's
 * smaller pages: core, avatar and voice. The workspace itself is covered by
 * `e2e/agent-workspace.spec.ts`.
 */

const AGENT_PAGES = [
  "/design-system/components/agent-core",
  "/design-system/components/agent-avatar",
  "/design-system/components/voice",
];

const SHOTS = path.join(
  process.cwd(),
  "test-results/screenshots/agent",
);

/**
 * `document.documentElement.clientWidth`, not `window.innerWidth` — see
 * batch 3's finding (§2.13 of its report): on a mobile-shaped context Chrome
 * grows the layout viewport to fit an overflowing document, so `innerWidth`
 * moves to meet `scrollWidth` and the naive comparison cannot fail.
 */
async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

test.beforeEach(async ({ page }, testInfo) => {
  const theme = testInfo.project.name === "desktop-light" ? "light" : "dark";
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);
});

test.describe("batch5", () => {
  for (const url of AGENT_PAGES) {
    test(`${url}: no console errors or warnings on fresh navigation`, async ({ page }) => {
      test.setTimeout(60_000);
      const messages: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" || msg.type() === "warning") messages.push(msg.text());
      });
      page.on("pageerror", (err) => messages.push(String(err)));

      await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
      await page.waitForTimeout(300);

      // The local GPU driver's own diagnostic channel, not something any web
      // page controls — named so a real new warning still fails the check.
      const KNOWN_DRIVER_NOISE = [/GL Driver Message/i];
      const real = messages.filter((m) => !KNOWN_DRIVER_NOISE.some((re) => re.test(m)));
      expect(real, real.join("\n")).toEqual([]);
    });

    test(`${url}: no horizontal overflow at 375`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(url, { waitUntil: "networkidle" });
      const { scrollWidth, clientWidth } = await noHorizontalOverflow(page);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});

test.describe("batch5 — voice", () => {
  test("the speech specimen offers a Speak button, or says the browser cannot speak", async ({ page }) => {
    await page.goto("/design-system/components/voice");
    const speak = page.getByRole("button", { name: "Speak" });
    const unsupported = page.getByText("This browser cannot speak");
    await expect(speak.or(unsupported).first()).toBeVisible();
  });
});

test.describe("batch5 — reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  // The Preview specimen (`<AgentAvatar state="thinking" size="lg" />`) stamps
  // data-agent-avatar on its root (components/agent/avatar/cube-avatar.tsx).
  test("the avatar stays visible under reduced motion", async ({ page }) => {
    await page.goto("/design-system/components/agent-avatar");
    const cube = page.locator("[data-agent-avatar]").first();
    await expect(cube).toBeVisible();
    const opacity = await cube.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0);
  });
});

test.describe("batch5 — screenshots", () => {
  test("every page, in its live state", async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    for (const url of AGENT_PAGES) {
      await page.goto(url, { waitUntil: "networkidle" });
      const slug = url.split("/").pop();
      await page.screenshot({
        path: path.join(SHOTS, `${testInfo.project.name}-${slug}.png`),
        fullPage: true,
      });
    }
  });
});
