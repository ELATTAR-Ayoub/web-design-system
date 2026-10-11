import { expect, test, type Locator, type Page } from "@playwright/test";

import { COMPONENT_DOCS, docRoute } from "@/lib/ds/docs/catalog";
import { categoryHref, DS_GROUPS, DS_ROOT } from "@/lib/ds/nav";

const ROUTES = [
  ...new Set([
    DS_ROOT,
    ...DS_GROUPS.flatMap((group) => group.categories.map((category) => categoryHref(group, category))),
    ...COMPONENT_DOCS.map((doc) => docRoute(doc.name)),
    `${DS_ROOT}/components/agent-workspace/live`,
  ]),
];

const DESTRUCTIVE = /\b(delete|remove|clear|discard|reset|revoke|erase|wipe|destroy)\b/i;

// Watches the page for a second and marks every element that changes on its own (a streaming
// demo, a timer), so the comparison below ignores motion nobody caused.
const markLive = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            const el = record.target instanceof Element ? record.target : record.target.parentElement;
            el?.setAttribute("data-e2e-live", "");
          }
        });
        observer.observe(document.body, { childList: true, characterData: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 1000);
      }),
  );

// The page's content, without toasts, live regions, self-changing regions and open overlays, so only real changes count.
const snapshot = (page: Page) =>
  page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll("[data-sonner-toaster], [role=status], [role=alert], [aria-live], [data-e2e-live], [role=dialog], [role=alertdialog], [role=menu], [data-radix-popper-content-wrapper], script, style")
      .forEach((n) => n.remove());
    return clone.innerText.replace(/\s+/g, " ").trim();
  });

async function tryAction(page: Page, control: Locator, name: string, problems: string[]) {
  await markLive(page);
  const before = await snapshot(page);
  await control.click({ timeout: 2000 }).catch(() => {});

  const confirm = page.getByRole("alertdialog");
  const asked = await confirm
    .waitFor({ state: "visible", timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  if (asked) {
    const cancel = confirm.getByRole("button", { name: /^(cancel|keep|no|back)\b/i }).first();
    if (await cancel.count()) await cancel.click();
    else await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    if ((await snapshot(page)) !== before) problems.push(`"${name}": cancelling the confirmation still changed the page`);
    return;
  }
  const after = await snapshot(page);
  if (after !== before) problems.push(`"${name}": destroys without asking — needs an Alert Dialog confirmation`);
  await page.keyboard.press("Escape");
}

test.describe("irreversible actions", () => {
  test.beforeEach(({ browserName }, testInfo) => {
    void browserName;
    test.skip(testInfo.project.name !== "desktop-dark", "behaviour, not layout — runs once");
    test.setTimeout(300_000);
  });

  for (const route of ROUTES) {
    test(`every destructive action asks first: ${route}`, async ({ page }) => {
      const problems: string[] = [];
      await page.goto(route);
      await page.waitForLoadState("load");

      // Direct controls.
      const controls = page.getByRole("button", { name: DESTRUCTIVE });
      const count = await controls.count();
      for (let i = 0; i < count; i++) {
        await page.goto(route);
        await page.waitForLoadState("load");
        const control = page.getByRole("button", { name: DESTRUCTIVE }).nth(i);
        if (!(await control.isVisible().catch(() => false)) || !(await control.isEnabled().catch(() => false))) continue;
        if (await control.evaluate((el) => !!el.closest("details:not([open]) > :not(summary)"))) continue;
        const name = (await control.getAttribute("aria-label")) ?? (await control.innerText()).trim();
        await control.scrollIntoViewIfNeeded().catch(() => {});
        await tryAction(page, control, name, problems);
      }

      // Destructive items inside menus.
      await page.goto(route);
      await page.waitForLoadState("load");
      const menus = await page.locator("[aria-haspopup=menu]:visible").count();
      for (let m = 0; m < Math.min(menus, 20); m++) {
        await page.goto(route);
        await page.waitForLoadState("load");
        const trigger = page.locator("[aria-haspopup=menu]:visible").nth(m);
        if (await trigger.evaluate((el) => !!el.closest("details:not([open]) > :not(summary)")).catch(() => true)) continue;
        await trigger.scrollIntoViewIfNeeded().catch(() => {});
        await trigger.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(200);
        const items = page.getByRole("menuitem", { name: DESTRUCTIVE });
        if (!(await items.count())) {
          await page.keyboard.press("Escape");
          continue;
        }
        const item = items.first();
        const name = (await item.innerText()).trim();
        await tryAction(page, item, `${name} (menu)`, problems);
      }

      expect(problems, problems.join("\n")).toEqual([]);
    });
  }
});
