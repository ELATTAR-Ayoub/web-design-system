import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Browser assertions for the four audited gaps closed by this worker:
 * `resizable` (interaction — hit-area target size), `tooltip` (interaction —
 * touch open path), `navigation-menu` (states — the indicator's position),
 * `press` (interaction — keyboard `:active`). Per `.tmp/gaps-brief.md`, this
 * is a NEW spec file — `e2e/component-interactions.spec.ts` is owned by
 * another worker running concurrently and must not be touched.
 *
 * Run alone: `PW_PORT=3152 npx playwright test e2e/gaps-interaction.spec.ts
 * --project=desktop-dark`.
 */

async function gotoComponent(page: Page, name: string) {
  await page.goto(`/design-system/components/${name}`);
  await page.waitForLoadState("networkidle");
}

/* ── resizable — hit-area target size (interaction) ──────────────────────── */

test.describe("resizable — hit-area target size", () => {
  test("a press 20px off the drawn 1px line still reaches the handle, and past ~22px it does not", async ({
    page,
  }) => {
    await gotoComponent(page, "resizable");
    const handle = page.locator('[data-slot="resizable-handle"]').first();
    await handle.scrollIntoViewIfNeeded();
    const box = await handle.boundingBox();
    if (!box) throw new Error("resizable handle has no box");
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    const probe = (dx: number) =>
      page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y);
          return el?.getAttribute("data-slot") ?? el?.tagName ?? null;
        },
        { x: cx + dx, y: cy },
      );

    // Drawn line itself is 1px wide — RULES' "nothing is hardcoded" still
    // requires the hit area, not the paint, to reach the floor.
    expect(box.width).toBeLessThanOrEqual(2);

    // Old hit area was after:w-1 (4px total, ±2px) — a point at ±20px is
    // deep inside the new --size-target-min (44px, ±22px) hit area and was
    // never reachable under the old one.
    expect(await probe(-20)).toBe("resizable-handle");
    expect(await probe(20)).toBe("resizable-handle");

    // And it is bounded: a point clearly outside the 44px zone does not
    // resolve to the handle — the fix widens the target, it does not make it
    // unbounded.
    expect(await probe(-30)).not.toBe("resizable-handle");
    expect(await probe(30)).not.toBe("resizable-handle");
  });
});

/* ── tooltip — touch open path (interaction) ─────────────────────────────── */

test.describe("tooltip — touch open path", () => {
  test("a touch tap opens the tooltip; a second tap closes it; hover still works", async ({
    page,
  }) => {
    await gotoComponent(page, "tooltip");
    const trigger = page.locator('[data-slot="tooltip-trigger"]').first();
    await trigger.scrollIntoViewIfNeeded();
    await expect(page.getByRole("tooltip").last()).toHaveCount(0);

    await trigger.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 1 });
    await trigger.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 1 });
    await expect(page.getByRole("tooltip").last()).toBeVisible();

    await trigger.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 1 });
    await trigger.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 1 });
    await expect(page.getByRole("tooltip").last()).toHaveCount(0);
  });

  test("a touch tap outside the trigger closes an open tooltip", async ({ page }) => {
    await gotoComponent(page, "tooltip");
    const trigger = page.locator('[data-slot="tooltip-trigger"]').first();
    await trigger.scrollIntoViewIfNeeded();

    await trigger.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 2 });
    await trigger.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 2 });
    await expect(page.getByRole("tooltip").last()).toBeVisible();

    await page.locator("body").dispatchEvent("pointerdown", {
      pointerType: "touch",
      pointerId: 2,
    });
    await expect(page.getByRole("tooltip").last()).toHaveCount(0);
  });

  test("mouse hover still opens the tooltip — the touch path did not take it over", async ({
    page,
  }) => {
    await gotoComponent(page, "tooltip");
    const trigger = page.locator('[data-slot="tooltip-trigger"]').first();
    await trigger.hover();
    await expect(page.getByRole("tooltip").last()).toBeVisible();
  });
});

/* ── navigation-menu — the indicator travels (states) ────────────────────── */

test.describe("navigation-menu — indicator position", () => {
  test("opening the second trigger moves the indicator past the first trigger's position", async ({
    page,
  }) => {
    await gotoComponent(page, "navigation-menu");

    // The "Indicator — the caret that names the open trigger" panel is the
    // only NavigationMenu on this page that renders <NavigationMenuIndicator/>
    // — and Radix portals that element into the "indicator track" div its
    // own NavigationMenuList wraps the <ul> in (see the navigation-menu
    // audit's `states` note), so the rendered indicator is a SIBLING of the
    // <ul>, not a descendant of it — it cannot be found via `list.locator(...)`.
    // Its panel is the third NavigationMenuList on this page (Packs,
    // Marketplace — the "Preview" and "Without a viewport" panels come first
    // and carry no indicator).
    const list = page.locator('[data-slot="navigation-menu-list"]').nth(2);
    const triggers = list.locator('[data-slot="navigation-menu-trigger"]');
    const first = triggers.nth(0);
    const second = triggers.nth(1);
    await first.scrollIntoViewIfNeeded();

    const firstBox = await first.boundingBox();
    const secondBox = await second.boundingBox();
    if (!firstBox || !secondBox) throw new Error("triggers have no box");
    expect(secondBox.x).toBeGreaterThan(firstBox.x); // sanity: layout order

    await first.click();
    const indicator = page.locator('[data-slot="navigation-menu-indicator"]');
    await expect(indicator).toBeVisible();
    const afterFirst = await indicator.boundingBox();
    if (!afterFirst) throw new Error("indicator has no box after opening the first trigger");

    // hover, not click, to move to the second trigger. Radix's own
    // `onItemSelect` toggles a trigger's value off when it is already the
    // open one (`setValue(prev => prev === itemValue ? "" : itemValue)`,
    // @radix-ui/react-navigation-menu) — and Playwright's `.click()` first
    // moves the pointer over the element, which itself fires the trigger's
    // hover-intent `onTriggerEnter` and switches `value` to the second
    // trigger BEFORE the click's own `onItemSelect` runs. That click then
    // finds the value already equal to the trigger it targets and closes the
    // whole menu — real, but a click-only artifact of the second click
    // landing on an already-hover-opened trigger, not a repro of the
    // offsetLeft fix under test. A plain hover reaches the same open second
    // panel without it.
    await second.hover();
    await expect
      .poll(async () => {
        const box = await indicator.boundingBox();
        return box?.x ?? null;
      })
      .toBeGreaterThan(afterFirst.x);

    const afterSecond = await indicator.boundingBox();
    if (!afterSecond) throw new Error("indicator has no box after opening the second trigger");
    // It should have travelled roughly onto the second trigger, not just off
    // the first one — pins the fix against a partial/accidental offset. The
    // indicator is a caret CENTRED under the trigger (Radix positions its
    // left edge at `offsetLeft + width/2 - indicatorWidth/2`), so compare
    // its centre to the trigger's span, not its left edge — at tablet the
    // caret's left sat 7px before a narrower trigger's edge and read as a
    // miss when it was dead centre.
    const centre = afterSecond.x + afterSecond.width / 2;
    expect(centre).toBeGreaterThanOrEqual(secondBox.x - 1);
    expect(centre).toBeLessThanOrEqual(secondBox.x + secondBox.width + 1);
  });
});

/* ── press — keyboard :active (interaction) ──────────────────────────────── */

/**
 * The element's computed transform once it has stopped moving: every running
 * animation or transition has finished, and two consecutive frames read the
 * same value. `focus()` and a key press both start a transition, so a read
 * taken straight after either can be an in-flight frame; comparing against
 * one makes a poll pass on the wrong frame and the next read race.
 */
async function settledTransform(button: Locator): Promise<string> {
  return button.evaluate(async (el) => {
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await Promise.all(el.getAnimations().map((a) => a.finished.catch(() => undefined)));
    let previous = getComputedStyle(el).transform;
    for (let i = 0; i < 120; i++) {
      await frame();
      const current = getComputedStyle(el).transform;
      if (current === previous && el.getAnimations().length === 0) return current;
      previous = current;
    }
    return previous;
  });
}

test.describe("press — keyboard activation", () => {
  test("measured: a real key-down/up Space on a focused <button class=\"press\"> DOES squish it — Chromium applies :active", async ({
    page,
  }) => {
    await gotoComponent(page, "press");
    // Inside the page body: the docs header's own menu button also carries
    // `.press` and comes first in the DOM, but it is `lg:hidden` on desktop.
    const button = page.locator("main [data-slot=preview-stage] button.press").first();
    await button.scrollIntoViewIfNeeded();
    await button.focus();

    const restTransform = await settledTransform(button);

    await page.keyboard.down("Space");
    // Read while genuinely held — a real key-down/up pair via CDP, not a
    // synthetic DOM event, per .tmp/gaps-brief.md's instruction. Poll rather
    // than reading once: the style recalculation from :active engaging is
    // not guaranteed to have landed the instant keyboard.down() resolves.
    await expect
      .poll(() => button.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(restTransform);
    // Then let the press transition land, so the held value is the end of the
    // squish and not a frame on the way to it.
    const heldTransform = await settledTransform(button);
    await page.keyboard.up("Space");

    // This is the measurement the press/interaction audit gap rested on —
    // and reverses it: Chromium DOES apply :active for a keyboard Space
    // press on a real, focused <button>, so `press`'s
    // `:active { transform: scale(0.9) }` fires exactly as it would for a
    // pointer press. `restTransform` is `scale(1)` (identity, "none" or
    // "matrix(1, 0, 0, 1, 0, 0)"); `heldTransform` is the 0.9 scale.
    expect(heldTransform).toContain("0.9");
    expect(heldTransform).not.toBe(restTransform);
  });

  test("the keyboard-demo compensation also squishes for Space, driven by data-pressed rather than :active", async ({
    page,
  }) => {
    await gotoComponent(page, "press");
    const demo = page.getByRole("button", { name: "press, keyboard-driven" });
    await demo.scrollIntoViewIfNeeded();
    await demo.focus();

    const restTransform = await demo.evaluate((el) => getComputedStyle(el).transform);
    expect(await demo.getAttribute("data-pressed")).toBeNull();

    await page.keyboard.down("Space");
    await expect(demo).toHaveAttribute("data-pressed", "true");
    // The squish is a transition over `--duration-press-in`, so a read taken
    // the instant the attribute lands sees an in-between matrix (0.9373…).
    // Poll until the scale has arrived at 0.9 rather than asserting on one
    // early frame.
    const scaleOf = (t: string) => {
      const m = /matrix\(([-\d.]+)/.exec(t);
      return m ? Number(m[1]) : t === "none" ? 1 : NaN;
    };
    await expect
      .poll(() => demo.evaluate((el) => getComputedStyle(el).transform).then(scaleOf))
      .toBeCloseTo(0.9, 2);
    const heldTransform = await demo.evaluate((el) => getComputedStyle(el).transform);
    await page.keyboard.up("Space");
    await expect(demo).not.toHaveAttribute("data-pressed");

    expect(scaleOf(heldTransform)).toBeCloseTo(0.9, 2);
    expect(heldTransform).not.toBe(restTransform);
  });
});
