import { expect, test, type Page } from "@playwright/test";

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

const WIDTHS = [320, 375, 768, 1024, 1280, 1440];
const POPUP_WIDTHS = [375, 1440];

type Problem = { kind: string; where: string; detail: string };

// Runs in the page. Reports page overflow, text that spills or is clipped, and controls something else covers.
function inspectLayout(): Problem[] {
  const problems: Problem[] = [];
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  const describe = (el: Element) => {
    const slot = el.getAttribute("data-slot");
    const label = el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().slice(0, 40);
    return `${el.tagName.toLowerCase()}${slot ? `[data-slot=${slot}]` : ""}${label ? ` "${label}"` : ""}`;
  };
  const visible = (el: Element) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    for (let node: Element | null = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      // A closed <details> keeps boxes for its hidden content in Chromium.
      if (node.closest("[aria-hidden=true], [inert], .sr-only, details:not([open]) > :not(summary)")) return false;
    }
    return true;
  };
  const clippedByAncestor = (el: Element) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (/hidden|auto|scroll|clip/.test(style.overflowX) || style.position === "fixed") return true;
    }
    return false;
  };

  // 1. The page scrolls sideways.
  if (document.documentElement.scrollWidth > vw + 1) {
    const culprits = [...document.body.querySelectorAll("*")]
      .filter((el) => el.getBoundingClientRect().right > vw + 1 && visible(el) && !clippedByAncestor(el))
      .slice(0, 5);
    problems.push({
      kind: "page-overflow",
      where: culprits.map(describe).join(" | ") || "body",
      detail: `page is ${document.documentElement.scrollWidth}px wide in a ${vw}px viewport`,
    });
  }

  // 2. Text that spills out of its box, or is cut off without an ellipsis.
  for (const el of document.body.querySelectorAll("*")) {
    if (el.closest("svg, pre, code, input, textarea, select, [contenteditable], [data-slot=code-block], [role=log]")) continue;
    const ownText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim());
    if (!ownText || !visible(el)) continue;
    const style = getComputedStyle(el);
    if (style.display === "inline") continue;
    const spills = el.scrollWidth > el.clientWidth + 1;
    if (!spills) continue;
    const clipped = /hidden|clip/.test(style.overflowX);
    const scrolls = /auto|scroll/.test(style.overflowX);
    const ellipsis = style.textOverflow === "ellipsis" || style.webkitLineClamp !== "none";
    if (scrolls) continue;
    // An ellipsis is fine; an ellipsis in a box too narrow to show a word is not.
    if (clipped && ellipsis) {
      if (el.clientWidth < 32) problems.push({ kind: "text-squeezed", where: describe(el), detail: `text squeezed into a ${el.clientWidth}px box` });
      continue;
    }
    problems.push({
      kind: clipped ? "text-clipped" : "text-overflow",
      where: describe(el),
      detail: `${el.scrollWidth}px of text in a ${el.clientWidth}px box`,
    });
  }

  // 3. Controls that something else sits on top of.
  const controls = document.querySelectorAll(
    "button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=menuitem], [role=switch], [role=checkbox], [role=radio], [role=option]"
  );
  for (const el of controls) {
    if (!visible(el) || el.matches(":disabled, [aria-disabled=true]") || getComputedStyle(el).pointerEvents === "none") continue;
    const rect = el.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > vh || rect.left < 0 || rect.right > vw) continue;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // Scrolled out of view inside a scrolling or clipping box: not on screen, so nothing covers it.
    let clipped = false;
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      if (!/hidden|auto|scroll|clip/.test(getComputedStyle(node).overflowX + getComputedStyle(node).overflowY)) continue;
      const box = node.getBoundingClientRect();
      if (x < box.left || x > box.right || y < box.top || y > box.bottom) { clipped = true; break; }
    }
    if (clipped) continue;
    const hit = document.elementFromPoint(x, y);
    if (!hit || hit === el || el.contains(hit) || hit.contains(el)) continue;
    if (el.id && hit.closest(`label[for="${el.id}"]`)) continue;
    problems.push({ kind: "covered", where: describe(el), detail: `covered by ${describe(hit)}` });
  }
  return problems;
}

const POPUPS =
  "[role=dialog], [role=alertdialog], [role=menu], [role=listbox], [data-radix-popper-content-wrapper] > *, [role=tooltip]";

// Runs in the page. Marks the popups already open, so only the ones a click opens are measured.
function markOpenPopups(selector: string) {
  for (const el of document.querySelectorAll(selector)) el.setAttribute("data-e2e-seen", "");
}

// Runs in the page. Reports any newly opened popup that does not fit the viewport.
function inspectPopups(selector: string): Problem[] {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const out: Problem[] = [];
  for (const el of document.querySelectorAll(selector)) {
    if (el.hasAttribute("data-e2e-seen")) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    if (rect.left < -1 || rect.top < -1 || rect.right > vw + 1 || rect.bottom > vh + 1) {
      out.push({
        kind: "popup-offscreen",
        where: `${el.getAttribute("role") ?? el.getAttribute("data-slot") ?? el.tagName.toLowerCase()}`,
        detail: `box ${Math.round(rect.left)},${Math.round(rect.top)} → ${Math.round(rect.right)},${Math.round(rect.bottom)} in ${vw}×${vh}`,
      });
    }
  }
  return out;
}

async function open(page: Page, route: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(route);
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
}

// Waits for every finite animation, so a popup is measured where it lands, not mid-slide.
const settle = (page: Page) =>
  page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await Promise.race([
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().iterations !== Infinity)
          .map((a) => a.finished.catch(() => undefined)),
      ),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  });

const report = (problems: (Problem & { width: number })[]) =>
  problems.map((p) => `@${p.width}px ${p.kind}: ${p.where} — ${p.detail}`).join("\n");

test.describe("layout", () => {
  test.beforeEach(({ browserName }, testInfo) => {
    void browserName;
    test.skip(testInfo.project.name !== "desktop-dark", "runs once; widths are set per test");
    test.setTimeout(300_000);
  });

  for (const route of ROUTES) {
    test(`nothing overflows, spills, clips or covers a control: ${route}`, async ({ page }) => {
      const found: (Problem & { width: number })[] = [];
      for (const width of WIDTHS) {
        await open(page, route, width);
        for (const p of await page.evaluate(inspectLayout)) found.push({ ...p, width });
      }
      expect(found, report(found)).toEqual([]);
    });

    test(`every popup fits the screen: ${route}`, async ({ page }) => {
      const found: (Problem & { width: number })[] = [];
      for (const width of POPUP_WIDTHS) {
        await open(page, route, width);
        const triggers = page.locator("[aria-haspopup]:not([aria-haspopup=false]):visible");
        const count = Math.min(await triggers.count(), 30);
        for (let i = 0; i < count; i++) {
          const trigger = triggers.nth(i);
          if (!(await trigger.isEnabled().catch(() => false))) continue;
          if (await trigger.evaluate((el) => !!el.closest("details:not([open]) > :not(summary)"))) continue;
          await trigger.scrollIntoViewIfNeeded().catch(() => {});
          await page.evaluate(markOpenPopups, POPUPS);
          await trigger.click({ timeout: 2000 }).catch(() => {});
          await settle(page);
          for (const p of await page.evaluate(inspectPopups, POPUPS)) found.push({ ...p, width, where: `${p.where} from trigger #${i}` });
          for (const p of await page.evaluate(inspectLayout)) {
            if (p.kind !== "covered") found.push({ ...p, width, where: `${p.where} (popup open)` });
          }
          await page.keyboard.press("Escape");
          // Let the close finish: focus goes back to the trigger at the end, and that can scroll the page.
          await settle(page);
        }
      }
      expect(found, report(found)).toEqual([]);
    });
  }
});
