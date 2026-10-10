import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

import {
  checkStillVisible,
  collectAnimated,
  noHorizontalOverflow,
  settleBox,
} from "./helpers-batch4";

/**
 * Rendered behaviour for batch 4 of the component audit
 * (`docs/audits/web-component-audit.md`): charts, layout primitives and the
 * sidebar. Moved out of `e2e/component-interactions.spec.ts` per the parallel
 * protocol — that file is shared across concurrent batches and must not be
 * edited; each batch's e2e lives in its own `e2e/<label>.spec.ts`.
 */

/**
 * The app pins `defaultTheme="dark"` in `ThemeProvider`, so Playwright's
 * `colorScheme` option alone does NOT flip it — next-themes only consults
 * `prefers-color-scheme` when the stored theme is "system". Without this, the
 * `desktop-light` project renders the dark palette and every "checked in light
 * mode" claim is false. Seed next-themes' own storage key instead.
 */
test.beforeEach(async ({ page }, testInfo) => {
  const theme = testInfo.project.name === "desktop-light" ? "light" : "dark";
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);
});

/* ══════════════════════════════════════════════════════════════════════════════
   Batch 4 — charts, layout primitives and sidebar
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * Retargeted per `.tmp/route-map.md`: the old `base/charts`, `base/layout`
 * and `base/sidebar` category pages were deleted and each specimen they held
 * now lives at its own `/design-system/components/<name>` route. These three
 * arrays are that same coverage, split out by former category, so every page
 * that used to be reachable through the aggregate route is still visited by
 * the sweeps below (overflow, console noise, reduced motion, screenshots).
 */
const CHART_ROUTES = [
  "/design-system/components/chart",
  "/design-system/components/chart-cartesian",
  "/design-system/components/chart-polar",
  "/design-system/components/chart-geometry",
];

const LAYOUT_ROUTES = [
  "/design-system/components/aspect-ratio",
  "/design-system/components/scroll-area",
  "/design-system/components/carousel",
  "/design-system/components/resizable",
];

const SIDEBAR_ROUTES = [
  "/design-system/components/sidebar",
  "/design-system/components/user-menu",
];

const STRUCTURE_PAGES = [...CHART_ROUTES, ...LAYOUT_ROUTES, ...SIDEBAR_ROUTES];

const STRUCTURE_SHOTS = path.join(
  process.cwd(),
  "test-results/screenshots/structure",
);

/**
 * `networkidle` is not enough for a recharts page, and that cost a whole e2e
 * round to learn.
 *
 * `ResponsiveContainer` measures its box and only then renders the plot, so
 * every chart selector returns zero at the moment the network goes quiet.
 * Probed on the live page: at load, 70 containers and **0** surfaces; a second
 * later, 70 surfaces and 196 cartesian ticks. Waiting on the tick itself is the
 * only honest signal that the chart has actually been drawn.
 */
async function chartsPainted(page: Page) {
  // Either family's tick. The retarget split one aggregate page into four
  // routes, and `chart-polar` has no cartesian axis at all — waiting on the
  // cartesian selector there waited thirty seconds for something that could
  // never appear, and failed the whole loop on the one route that was fine.
  await page.waitForSelector(
    ".recharts-cartesian-axis-tick-value, .recharts-polar-angle-axis-tick-value",
    { timeout: 30_000 },
  );
  await page.waitForTimeout(1_500);
}

/**
 * The busiest state each batch-4 page can reach, the way a reader reaches it.
 *
 * Charts: nothing to open — every one of the seventy specimens is already
 * drawing. Layout: the resizable handle focused, so its ring is in frame.
 * Sidebar: the shell matrix is already assembled; the demo route is where the
 * collapse states live.
 */
async function openStructureState(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");

  /*
   * The charts page needs the plots painted before anything is measured, and
   * so does everything laid out beside them.
   *
   * The first reduced-motion sweep reported twenty-five `ActiveIndicator`
   * pills as 0x0 — `animation: none`, `opacity: 1`, `visibility: visible`, and
   * no box. That is not reduced motion hiding anything: it is
   * `useActiveIndicator` measuring its active option before the page has
   * settled, and the charts page settles late because seventy
   * `ResponsiveContainer`s render on a second pass. Waiting for the plots is
   * what makes the two contexts comparable.
   */
  if (url.includes("/components/chart")) {
    await chartsPainted(page);
  }

  /*
   * The same race, on the sidebar page's own travelling pills.
   *
   * `ActiveIndicator` ships as `w-0` and is given its width by an effect
   * (`useActiveIndicator`), not by layout — so a page read too early reports
   * every `.toggle-slide` as 0x0. That is exactly what the release gate caught
   * here: `full verify:full` run under four-worker contention read the
   * sidebar page before its pills (`.sidebar-pill`, the icon-rail toggle
   * pill) had been measured, and reported nine of them as "hidden" by reduced
   * motion when they were never sized in either context. Batch 1 hit the
   * identical race on `component-interactions.spec.ts`'s control pages and
   * fixed it the same way — wait for every `.toggle-slide` to have width, or to
   * be a deliberately parked (nothing-selected) pill at `opacity: 0`. Cheap
   * on pages with no sliding indicator at all: the selector matches nothing
   * and `.every()` on an empty array is `true`.
   */
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll(".toggle-slide")).every(
      (el) =>
        el.getBoundingClientRect().width > 0 ||
        parseFloat(getComputedStyle(el).opacity) === 0,
    ),
  );

  await page.evaluate(() => window.scrollTo(0, 0));

  if (url.endsWith("/resizable")) {
    const handle = page.getByRole("separator", { name: /Resize/ }).first();
    if (await handle.count()) await handle.focus();
  }

  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      try {
        a.finish();
      } catch {
        /* an infinite animation cannot finish; leave it running */
      }
    }),
  );

  /* `scroll-behavior: smooth` is global — see the display block's note. */
  let last = -1;
  for (let i = 0; i < 20; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (y === last) break;
    last = y;
    await page.waitForTimeout(100);
  }
}

/**
 * `/sidebar-demo` itself was never deleted and needed no route change — but
 * its own "Back to Sidebar" link (`app/sidebar-demo/page.tsx`) still points
 * at the deleted `/design-system/components/base/sidebar`, one of the
 * category routes this retargeting removed. That link sits in the initial
 * viewport, so Next.js's automatic prefetch fetches it on every load; the
 * fetch 404s and then fails outright with `net::ERR_INSUFFICIENT_RESOURCES`
 * (confirmed with a raw Playwright network trace), and network activity
 * never goes quiet again. `waitForLoadState("networkidle")` therefore hangs
 * to its full timeout on every test that visits this page — not a batch-4
 * regression, since nothing here touches that link or that page, but a
 * pre-existing dead reference this migration exposed. Flagged separately
 * (spawn_task) for whoever owns `app/sidebar-demo/page.tsx`, since this spec
 * file may not edit pages; here, the fix is to stop waiting on a network
 * state the page can no longer reach and wait on a concrete element instead
 * — the same fix Playwright's own docs recommend over `networkidle` even
 * without a dead link in the mix.
 */
async function gotoSidebarDemo(page: Page) {
  await page.goto("/sidebar-demo");
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator('[data-slot="sidebar"], [data-slot="sidebar-trigger"]')
    .first()
    .waitFor({ state: "visible" });
}

test.describe("structure", () => {
  /* ── Charts ─────────────────────────────────────────────────────────────── */

  /**
   * Trap 14, measured rather than remembered, in whichever theme this project
   * is running.
   *
   * Two facts, and the second is the one that rots silently. First: the STOCK
   * selector `.recharts-cartesian-axis-tick text` still matches nothing in
   * recharts 3.8, which is what stranded every axis label on recharts' own
   * `#666`. Second: our three `-value` selectors do match, and the fill they
   * produce really is `--muted-foreground` — read off the live element and
   * compared against the token resolved from the same document, so a retuned
   * token moves both sides together and the assertion cannot go stale.
   */
  test("chart axis ticks are painted from the token, not by recharts", async ({
    page,
  }, testInfo) => {
    /*
     * Retargeted per `.tmp/route-map.md`: `base/charts` (one aggregate page)
     * was deleted and its seventy specimens now sit across four per-item
     * routes — cartesian ticks on `chart`/`chart-cartesian`/`chart-geometry`,
     * polar-angle ticks on `chart-polar`. The assertion is unchanged (every
     * tick painted from `--muted-foreground`, the stock recharts selector
     * matching nothing); it now runs once per route instead of once for the
     * whole aggregate, so a single page regressing is named rather than
     * averaged away.
     */
    test.setTimeout(120_000);
    let totalCartesian = 0;
    let totalPolar = 0;
    let totalStockMatches = 0;
    const perPage: string[] = [];

    for (const url of CHART_ROUTES) {
      await page.goto(url);
      await chartsPainted(page);

      const measured = await page.evaluate(() => {
        const rgb = (v: string) => {
          const probe = document.createElement("span");
          probe.style.color = v;
          document.body.appendChild(probe);
          const out = getComputedStyle(probe).color;
          probe.remove();
          return out;
        };

        const expected = rgb(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--muted-foreground")
            .trim(),
        );

        const read = (sel: string) => {
          const els = Array.from(document.querySelectorAll<SVGTextElement>(sel));
          return {
            count: els.length,
            fills: Array.from(new Set(els.map((e) => getComputedStyle(e).fill))),
          };
        };

        /*
         * Trap 14's clone method: lift one live tick into a bare <svg> appended
         * to <body>, so it sits OUTSIDE [data-slot="chart"] and our selector
         * stops matching it. What comes back is recharts' own value, first-hand,
         * without reverting anything.
         */
        let stockFill: string | null = null;
        const sample = document.querySelector<SVGTextElement>(
          ".recharts-cartesian-axis-tick-value",
        );
        if (sample) {
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
          );
          svg.appendChild(sample.cloneNode(true));
          document.body.appendChild(svg);
          stockFill = getComputedStyle(svg.firstElementChild!).fill;
          svg.remove();
        }

        return {
          expected,
          cartesian: read(".recharts-cartesian-axis-tick-value"),
          polarAngle: read(".recharts-polar-angle-axis-tick-value"),
          /* The one-line check trap 14 names: the stock selector's yield. */
          stockSelectorMatches: document.querySelectorAll(
            ".recharts-cartesian-axis-tick text",
          ).length,
          stockFill,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        };
      });

      perPage.push(
        `${url}: ${measured.theme} — ${measured.cartesian.count} cartesian + ` +
          `${measured.polarAngle.count} polar, fill ${measured.cartesian.fills.join("|")} ` +
          `against ${measured.expected}, stock matched ${measured.stockSelectorMatches}, ` +
          `recharts' own fill ${measured.stockFill}`,
      );

      totalCartesian += measured.cartesian.count;
      totalPolar += measured.polarAngle.count;
      totalStockMatches += measured.stockSelectorMatches;

      if (measured.cartesian.count > 0) {
        expect(measured.cartesian.fills, `${url} cartesian ticks`).toEqual([
          measured.expected,
        ]);
      }
      if (measured.polarAngle.count > 0) {
        expect(measured.polarAngle.fills, `${url} polar ticks`).toEqual([
          measured.expected,
        ]);
      }
      /* If this ever stops being 0, recharts moved the tick back and the fix
         above it is now the redundant half rather than the load-bearing one. */
      expect(measured.stockSelectorMatches, `${url} stock selector`).toBe(0);
    }

    testInfo.annotations.push({
      type: "chart-axis-ticks",
      description: perPage.join(" | "),
    });

    /* Every tick across the four routes is painted from the token, and the
       aggregate carries the same shape the single aggregate page used to. */
    expect(totalCartesian).toBeGreaterThan(0);
    expect(totalPolar).toBeGreaterThan(0);
    expect(totalStockMatches).toBe(0);
  });

  /*
   * `.recharts-rectangle` IS the path in recharts 3.8, not a group containing
   * one — probed on the live page: 263 elements, every one a `<path>` with a
   * `d`. The first version of this test looked for `.recharts-rectangle path`
   * and found zero, which is indistinguishable from "no bar was ever drawn".
   * That distinction is the whole point of the test, so the selector is
   * recorded here rather than left to be rediscovered.
   */
  test("every chart series paints a mark, and none of them is an empty plot", async ({
    page,
  }, testInfo) => {
    /*
     * Retargeted per `.tmp/route-map.md`: bars live on `chart`, `chart-
     * cartesian` and `chart-geometry`; sectors and radial marks on
     * `chart-polar`; curves on `chart` and `chart-cartesian`. Looping the
     * four per-item routes reaches the same seventy specimens the deleted
     * `base/charts` aggregate page held, and checks each route's own marks
     * rather than only a combined total.
     */
    test.setTimeout(150_000);
    let totalBars = 0;
    let totalSectors = 0;
    let totalCurves = 0;
    const perPage: string[] = [];

    for (const url of CHART_ROUTES) {
      await page.goto(url);
      await chartsPainted(page);

      const drawn = await page.evaluate(() => {
        const bars = Array.from(
          document.querySelectorAll<SVGPathElement>(".recharts-rectangle"),
        );
        const sectors = Array.from(
          document.querySelectorAll<SVGPathElement>(".recharts-sector"),
        );
        const curves = Array.from(
          document.querySelectorAll<SVGPathElement>(
            ".recharts-line-curve, .recharts-area-area",
          ),
        );
        const hasGeometry = (el: SVGPathElement) =>
          (el.getAttribute("d") ?? "").length > 0;

        return {
          bars: bars.length,
          barsDrawn: bars.filter(hasGeometry).length,
          sectors: sectors.length,
          sectorsDrawn: sectors.filter(hasGeometry).length,
          curves: curves.length,
          curvesDrawn: curves.filter(hasGeometry).length,
        };
      });

      perPage.push(
        `${url}: bars ${drawn.barsDrawn}/${drawn.bars} · sectors ` +
          `${drawn.sectorsDrawn}/${drawn.sectors} · curves ` +
          `${drawn.curvesDrawn}/${drawn.curves}`,
      );

      totalBars += drawn.bars;
      totalSectors += drawn.sectors;
      totalCurves += drawn.curves;

      expect(drawn.barsDrawn, `${url} bars`).toBe(drawn.bars);
      expect(drawn.sectorsDrawn, `${url} sectors`).toBe(drawn.sectors);
      expect(drawn.curvesDrawn, `${url} curves`).toBe(drawn.curves);
    }

    testInfo.annotations.push({
      type: "chart-marks",
      description: perPage.join(" | "),
    });

    expect(totalBars).toBeGreaterThan(0);
    expect(totalSectors).toBeGreaterThan(0);
    expect(totalCurves).toBeGreaterThan(0);
  });

  test("the chart tooltip appears on hover, in the numeric voice", async ({
    page,
  }, testInfo) => {
    test.setTimeout(90_000);
    await page.goto("/design-system/components/chart");
    await chartsPainted(page);

    /*
     * The tooltip wrapper belonging to THE CHART THAT WAS HOVERED.
     *
     * The page carries 67 of them, one per chart, and they are all in the DOM
     * from the first paint with `visibility: hidden`. `.first()` therefore
     * resolves to a wrapper that will never become visible however long you
     * wait for it, which is what the first round of this test did in all five
     * projects. Scoping to the hovered chart's own container is the fix.
     */
    const chart = page.locator('[data-slot="chart"]').first();
    /* Scroll it into view FIRST. `boundingBox()` returns document-relative
       coordinates for an element below the fold, and `mouse.move` then lands
       somewhere else entirely — the pointer never enters the plot and the
       tooltip stays hidden, which reads exactly like "hover does not work". */
    await chart.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const plot = chart.locator(".recharts-surface").first();
    const box = await plot.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width * 0.35, box!.y + box!.height / 2);
    await page.waitForTimeout(250);
    /* Recharts tracks pointer MOVEMENT inside the surface, so a single jump to
       a coordinate is not reliably a hover. Move across it in steps. */
    await page.mouse.move(box!.x + box!.width * 0.55, box!.y + box!.height / 2, {
      steps: 5,
    });

    const tooltip = chart.locator(".recharts-tooltip-wrapper").first();
    await expect(tooltip).toBeVisible({ timeout: 10_000 });

    const read = await tooltip.evaluate((el) => {
      const number = el.querySelector(".type-number-sm");
      return {
        text: (el.textContent ?? "").trim().slice(0, 80),
        hasNumberRole: Boolean(number),
        numberFamily: number ? getComputedStyle(number).fontFamily : null,
        numberVariant: number
          ? getComputedStyle(number).fontVariantNumeric
          : null,
      };
    });

    testInfo.annotations.push({
      type: "chart-tooltip",
      description: `"${read.text}" · ${read.numberFamily} · ${read.numberVariant}`,
    });

    expect(read.text.length).toBeGreaterThan(0);
    /* `type-number-sm` is the numeric voice — mono, tabular, 600. A figure in
       Inter beside a proportional one is a column that will not line up. */
    expect(read.hasNumberRole).toBe(true);
    expect(read.numberFamily?.toLowerCase()).toContain("mono");
  });

  /*
   * The error state is a REAL seam, not a drawn replica: the toggle puts the
   * panel into failure and `Try again` really returns it to Ready. §5's rule
   * that a failure state must be reachable the way production reaches it.
   */
  test("a chart's four states are all reachable, and the box never moves", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);
    await page.goto("/design-system/components/chart");
    await chartsPainted(page);

    /* `ChartStates` names its own control strip, and that is the only stable
       address on the page: `Panel` carries no slot of its own, and "the first
       div after the toggle group" is a structural guess that breaks the first
       time the frame changes. */
    const group = page.getByRole("radiogroup", { name: /chart state/ }).first();
    await expect(group).toBeVisible();
    const slot = page.locator('[data-slot="chart-state-slot"]').first();

    const heights: Record<string, number> = {};
    for (const label of ["Empty", "Loading", "Error", "Ready"]) {
      await group.getByRole("radio", { name: label }).click();
      await page.waitForTimeout(800);
      const b = await slot.boundingBox();
      heights[label] = Math.round(b?.height ?? 0);
    }

    testInfo.annotations.push({
      type: "chart-states",
      description: Object.entries(heights)
        .map(([k, v]) => `${k} ${v}px`)
        .join(" · "),
    });

    /* Error offers a way back, and it really works. */
    await group.getByRole("radio", { name: "Error" }).click();
    await expect(slot.getByText("This series did not load")).toBeVisible();
    await slot.getByRole("button", { name: "Try again" }).click();
    await expect(slot.getByText("This series did not load")).toBeHidden();

    const values = Object.values(heights);
    const spread = Math.max(...values) - Math.min(...values);
    expect(spread).toBeLessThanOrEqual(4);
  });

  /* ── Accordion and Collapsible ──────────────────────────────────────────── */

  test("Accordion: the panel resolves to its full height, and nothing is clipped", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/accordion");
    await page.waitForLoadState("networkidle");

    /* `.nth(1)` — the FAQ ships `defaultValue="odds"`, so the first trigger is
       already open on load and Enter would close it. Batch 3's finding. */
    const trigger = page.locator('[data-slot="accordion-trigger"]').nth(1);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");

    const item = page.locator('[data-slot="accordion-item"]').nth(1);
    const content = item.locator('[data-slot="accordion-content"]');
    await settleBox(content, "accordion content");

    const measured = await content.evaluate((el) => {
      const inner = el.firstElementChild as HTMLElement;
      return {
        outerHeight: Math.round(el.getBoundingClientRect().height),
        innerHeight: Math.round(inner.getBoundingClientRect().height),
        innerScrollHeight: inner.scrollHeight,
        /* The correction: the wrapper must NOT be pinned to the height Radix
           measured once, or content that grows afterwards is clipped behind
           `overflow-hidden` with no scrollbar and no way to reach it. */
        innerCssHeight: getComputedStyle(inner).height,
        animation: getComputedStyle(el).animationName,
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
    });

    testInfo.annotations.push({
      type: "accordion",
      description:
        `open ${measured.outerHeight}px, inner ${measured.innerHeight}px ` +
        `(scrollHeight ${measured.innerScrollHeight}, css ${measured.innerCssHeight}), ` +
        `animation ${measured.animation}, reduced ${measured.reduced}`,
    });

    expect(measured.outerHeight).toBeGreaterThan(0);
    /* Nothing clipped: the wrapper is as tall as its own content. */
    expect(measured.innerHeight).toBeGreaterThanOrEqual(
      measured.innerScrollHeight - 1,
    );
    /* And it is fully open — not frozen mid-unfold under reduced motion. */
    expect(measured.outerHeight).toBeGreaterThanOrEqual(
      measured.innerHeight - 1,
    );

    /* Closing resolves all the way to nothing, in both motion settings. */
    await page.keyboard.press("Enter");
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("false");
    await expect
      .poll(
        async () => {
          const b = await content.boundingBox();
          return Math.round(b?.height ?? 0);
        },
        { message: "the accordion never closed all the way" },
      )
      .toBe(0);
  });

  /*
   * The other half of the clipping fix, and the half the first pass missed.
   *
   * Removing `h-(--radix-accordion-content-height)` from the inner wrapper was
   * necessary and not sufficient: `anim-unfold` shipped
   * `animation-fill-mode: both`, and a forwards fill paints from the ANIMATION
   * origin, which outranks every author rule. So the panel itself stayed pinned
   * to the height Radix measured once, and content that grew afterwards was
   * still unreachable behind `overflow: hidden`. Measured before the fix on the
   * built app: a 50px panel, content grown to 290px, 230px of it gone, in both
   * motion settings.
   *
   * This drives the real thing — open the panel, then GROW it the way a late
   * image, a swapped font or a longer translation does — because "does the
   * panel follow its content" cannot be read off the source.
   */
  test("Accordion: a panel that grows after it opened is not clipped", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/accordion");
    await page.waitForLoadState("networkidle");

    const trigger = page.locator('[data-slot="accordion-trigger"]').nth(1);
    await trigger.click();
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");

    const content = page
      .locator('[data-slot="accordion-item"]')
      .nth(1)
      .locator('[data-slot="accordion-content"]');
    await settleBox(content, "accordion content");

    const measured = await content.evaluate((el) => {
      const before = {
        height: Math.round(el.getBoundingClientRect().height),
        fill: getComputedStyle(el).animationFillMode,
      };
      const grow = document.createElement("p");
      grow.textContent = "grown ".repeat(120);
      grow.setAttribute("data-probe", "grown");
      el.firstElementChild!.appendChild(grow);
      return before;
    });

    await page.waitForTimeout(400);

    const after = await content.evaluate((el) => {
      const probe = el.querySelector("[data-probe]")!;
      const box = el.getBoundingClientRect();
      return {
        height: Math.round(box.height),
        scrollHeight: el.scrollHeight,
        clipped: Math.round(probe.getBoundingClientRect().bottom - box.bottom),
      };
    });

    testInfo.annotations.push({
      type: "accordion-growth",
      description:
        `fill-mode ${measured.fill} · ${measured.height}px -> ${after.height}px ` +
        `(scrollHeight ${after.scrollHeight}), clipped ${after.clipped}px`,
    });

    /* `backwards`, never `both`: a forwards fill is what pinned it. */
    expect(measured.fill).toBe("backwards");
    expect(after.height).toBeGreaterThan(measured.height);
    expect(after.clipped).toBeLessThanOrEqual(1);
    expect(after.scrollHeight).toBeLessThanOrEqual(after.height + 1);
  });

  test("the accordion chevron is muted, which is the rule batch 3 woke up", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/accordion");
    await page.waitForLoadState("networkidle");

    const measured = await page.evaluate(() => {
      const rgb = (v: string) => {
        const probe = document.createElement("span");
        probe.style.color = v;
        document.body.appendChild(probe);
        const out = getComputedStyle(probe).color;
        probe.remove();
        return out;
      };
      const icons = Array.from(
        document.querySelectorAll<SVGElement>(
          '[data-slot="accordion-trigger-icon"]',
        ),
      );
      const visible = icons.filter(
        (i) => getComputedStyle(i).display !== "none",
      );
      const first = visible[0];
      return {
        total: icons.length,
        visible: visible.length,
        colours: Array.from(
          new Set(visible.map((i) => getComputedStyle(i).color)),
        ),
        muted: rgb(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--muted-foreground")
            .trim(),
        ),
        size: first
          ? `${Math.round(first.getBoundingClientRect().width)}x${Math.round(
              first.getBoundingClientRect().height,
            )}`
          : "",
      };
    });

    testInfo.annotations.push({
      type: "accordion-chevron",
      description:
        `${measured.visible} of ${measured.total} visible, ${measured.size}, ` +
        `colour ${measured.colours.join("|")} against --muted-foreground ${measured.muted}`,
    });

    expect(measured.visible).toBeGreaterThan(0);
    expect(measured.colours).toEqual([measured.muted]);
  });

  /* ── ScrollArea ─────────────────────────────────────────────────────────── */

  /*
   * The batch-4 correction, measured where it actually matters. Radix hides the
   * native rail and did not make the viewport focusable, so the content it hid
   * was unreachable from a keyboard. This drives the real path: focus it, press
   * End, and watch it scroll.
   */
  test("ScrollArea: the hidden scrollbar has a keyboard alternative", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/scroll-area");
    await page.waitForLoadState("networkidle");

    const viewport = page
      .locator('[data-slot="scroll-area-viewport"][aria-label="Possible hits"]')
      .first();
    await expect(viewport).toBeVisible();

    await viewport.focus();
    const focused = await viewport.evaluate(
      (el) => document.activeElement === el,
    );
    expect(focused).toBe(true);

    const ring = await viewport.evaluate((el) => {
      const s = getComputedStyle(el);
      return { boxShadow: s.boxShadow, role: el.getAttribute("role") };
    });

    const before = await viewport.evaluate((el) => el.scrollTop);
    await page.keyboard.press("End");
    await expect
      .poll(async () => viewport.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(before);
    const after = await viewport.evaluate((el) => el.scrollTop);

    testInfo.annotations.push({
      type: "scroll-area",
      description:
        `role ${ring.role}, focus ring "${ring.boxShadow}", ` +
        `End scrolled ${before} -> ${after}`,
    });

    /* The ring has been declared on this element since the file was written
       and could never paint, because nothing could focus it. */
    expect(ring.boxShadow).not.toBe("none");
    expect(ring.role).toBe("group");
  });

  /* ── Resizable ──────────────────────────────────────────────────────────── */

  test("Resizable: the arrow keys move the split, and the handle is named", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/resizable");
    await page.waitForLoadState("networkidle");

    const handle = page
      .getByRole("separator", { name: "Resize the card list" })
      .first();
    await expect(handle).toBeVisible();

    const before = await handle.getAttribute("aria-valuenow");
    await handle.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => handle.getAttribute("aria-valuenow"), {
        message: "the arrow keys did not move the split",
      })
      .not.toBe(before);
    const after = await handle.getAttribute("aria-valuenow");

    const box = await handle.boundingBox();
    testInfo.annotations.push({
      type: "resizable",
      description:
        `aria-valuenow ${before} -> ${after}, handle ` +
        `${Math.round(box?.width ?? 0)}x${Math.round(box?.height ?? 0)}`,
    });
  });

  /* ── Sidebar ────────────────────────────────────────────────────────────── */

  test("Sidebar: Cmd/Ctrl+B toggles it, and the trigger says which way it goes", async ({
    page,
  }, testInfo) => {
    await gotoSidebarDemo(page);

    const isMobile = await page.evaluate(
      () => window.matchMedia("(max-width: 767px)").matches,
    );
    test.skip(
      isMobile,
      "below md the panel is a Sheet with no rail — see the mobile sheet test",
    );

    const panel = page.locator('[data-slot="sidebar"]').first();
    await expect(panel).toHaveAttribute("data-state", "expanded");

    await page.keyboard.press("Control+b");
    await expect(panel).toHaveAttribute("data-state", "collapsed");
    const collapsedName = await page
      .getByRole("button", { name: "Expand sidebar" })
      .count();

    await page.keyboard.press("Control+b");
    await expect(panel).toHaveAttribute("data-state", "expanded");
    const expandedName = await page
      .getByRole("button", { name: "Collapse sidebar" })
      .count();

    testInfo.annotations.push({
      type: "sidebar-toggle",
      description:
        `collapsed -> "Expand sidebar" x${collapsedName}, ` +
        `expanded -> "Collapse sidebar" x${expandedName}`,
    });

    expect(collapsedName).toBeGreaterThan(0);
    expect(expandedName).toBeGreaterThan(0);
  });

  /*
   * The collapsed rail is icons only, so the tooltip IS the label. Reached from
   * the keyboard rather than the pointer, because the rail is the state where a
   * mouse user has hover and a keyboard user has nothing else.
   */
  test("Sidebar: the collapsed rail shows a tooltip on focus", async ({
    page,
  }, testInfo) => {
    await gotoSidebarDemo(page);

    const isMobile = await page.evaluate(
      () => window.matchMedia("(max-width: 767px)").matches,
    );
    test.skip(isMobile, "there is no icon rail below md — the panel is a Sheet");

    const panel = page.locator('[data-slot="sidebar"]').first();
    await page.keyboard.press("Control+b");
    await expect(panel).toHaveAttribute("data-state", "collapsed");
    await page.waitForTimeout(500);

    const row = page
      .locator('[data-slot="sidebar-menu-button"]:visible')
      .nth(1);
    await row.focus();

    const tip = page.locator('[data-slot="tooltip-content"]').first();
    await expect(tip).toBeVisible({ timeout: 5_000 });
    const text = (await tip.textContent())?.trim();

    testInfo.annotations.push({
      type: "sidebar-rail-tooltip",
      description: `focused row -> tooltip "${text}"`,
    });
    expect((text ?? "").length).toBeGreaterThan(0);
  });

  test("Sidebar: the active row says it is current, not just that it is coloured", async ({
    page,
  }, testInfo) => {
    await gotoSidebarDemo(page);

    /* Below md there are no rows in the document at all until the Sheet is
       opened — the mobile branch mounts nothing before that. Open it, so the
       claim is made about the same rows in every project. */
    const isMobile = await page.evaluate(
      () => window.matchMedia("(max-width: 767px)").matches,
    );
    if (isMobile) {
    /*
     * The mobile panel is addressed as `[data-slot="sidebar"][data-mobile]`,
     * NOT as `[data-slot="sheet-content"]`.
     *
     * `Sidebar` writes its own `data-slot="sidebar"` onto `SheetContent`, and
     * a later prop wins — so on mobile the sheet body carries the sidebar's
     * slot and the sheet's own slot is gone. Nothing is wrong with that (the
     * component IS the sidebar here), but a test that reaches for the sheet
     * slot silently finds nothing and reports "the sheet never opened".
     */
      await page.locator('[data-slot="sidebar-trigger"]').first().click();
      await expect(
        page.locator('[data-slot="sidebar"][data-mobile="true"]'),
      ).toBeVisible();
    }

    const measured = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-slot="sidebar-menu-button"], [data-slot="sidebar-menu-sub-button"]',
        ),
      );
      const active = rows.filter((r) => r.dataset.active === "true");
      return {
        rows: rows.length,
        active: active.length,
        current: active.filter((r) => r.getAttribute("aria-current") === "page")
          .length,
        inactiveWithCurrent: rows.filter(
          (r) => r.dataset.active !== "true" && r.hasAttribute("aria-current"),
        ).length,
      };
    });

    testInfo.annotations.push({
      type: "sidebar-active",
      description:
        `${measured.active} of ${measured.rows} rows active, ` +
        `${measured.current} carry aria-current=page, ` +
        `${measured.inactiveWithCurrent} false positives`,
    });

    expect(measured.active).toBeGreaterThan(0);
    expect(measured.current).toBe(measured.active);
    expect(measured.inactiveWithCurrent).toBe(0);
  });

  test("Sidebar: below md it is a Sheet that traps focus and closes on Escape", async ({
    page,
  }, testInfo) => {
    await gotoSidebarDemo(page);

    const isMobile = await page.evaluate(
      () => window.matchMedia("(max-width: 767px)").matches,
    );
    test.skip(!isMobile, "this is the mobile branch");

    /*
     * The mobile panel is addressed as `[data-slot="sidebar"][data-mobile]`,
     * NOT as `[data-slot="sheet-content"]`.
     *
     * `Sidebar` writes its own `data-slot="sidebar"` onto `SheetContent`, and
     * a later prop wins — so on mobile the sheet body carries the sidebar's
     * slot and the sheet's own slot is gone. Nothing is wrong with that (the
     * component IS the sidebar here), but a test that reaches for the sheet
     * slot silently finds nothing and reports "the sheet never opened".
     */
    /* And the trigger by its slot, not by its name: `/sidebar$/i` also matches
       the demo's own `sidebar` variant button, so the name resolved to two
       controls. */
    const trigger = page.locator('[data-slot="sidebar-trigger"]').first();
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await page.keyboard.press("Enter");

    const sheet = page.locator('[data-slot="sidebar"][data-mobile="true"]');
    await expect(sheet).toBeVisible();
    await settleBox(sheet, "mobile sidebar sheet");

    const inside = await page.evaluate(() => {
      const el = document.querySelector('[data-slot="sidebar"][data-mobile]');
      return Boolean(el && el.contains(document.activeElement));
    });

    const box = await sheet.boundingBox();
    const client = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    const returned = await page.evaluate(
      () =>
        document.activeElement?.getAttribute("data-slot") ===
        "sidebar-trigger",
    );

    testInfo.annotations.push({
      type: "sidebar-mobile-sheet",
      description:
        `sheet ${Math.round(box?.width ?? 0)}px at x ${Math.round(box?.x ?? 0)} ` +
        `of ${client}, focus trapped ${inside}, focus returned ${returned}`,
    });

    expect(inside).toBe(true);
    /* The sheet is `--width-sidebar-mobile`, not SheetContent's `w-3/4`. */
    expect(Math.round(box?.width ?? 0)).toBeLessThanOrEqual(client);
    expect(Math.round(box?.x ?? 0)).toBeGreaterThanOrEqual(-1);
    expect(returned).toBe(true);
  });

  test("the sidebar shell never scrolls the page sideways, open or collapsed", async ({
    page,
  }, testInfo) => {
    await gotoSidebarDemo(page);

    const open = await noHorizontalOverflow(page);
    await page.keyboard.press("Control+b");
    await page.waitForTimeout(500);
    const collapsed = await noHorizontalOverflow(page);

    testInfo.annotations.push({
      type: "sidebar-overflow",
      description:
        `open ${open.scrollWidth} vs ${open.innerWidth} · ` +
        `collapsed ${collapsed.scrollWidth} vs ${collapsed.innerWidth}` +
        (open.widest.width
          ? ` · widest ${open.widest.tag} ${open.widest.width} ${open.widest.cls}`
          : ""),
    });

    expect(open.scrollWidth).toBeLessThanOrEqual(open.innerWidth + 1);
    expect(collapsed.scrollWidth).toBeLessThanOrEqual(collapsed.innerWidth + 1);
  });

  test("the batch-4 pages never scroll sideways", async ({
    page,
  }, testInfo) => {
    /* Ten per-item routes now, not three aggregate pages — widen the budget
       to match (see the console-noise test below for the same reasoning). */
    test.setTimeout(120_000);
    for (const url of STRUCTURE_PAGES) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const m = await noHorizontalOverflow(page);
      testInfo.annotations.push({
        type: "overflow",
        description:
          `${url}: ${m.scrollWidth} vs ${m.innerWidth}` +
          (m.widest.width
            ? ` · widest ${m.widest.tag} ${m.widest.width} ${m.widest.cls}`
            : ""),
      });
      expect(m.scrollWidth, `${url} scrolls sideways`).toBeLessThanOrEqual(
        m.innerWidth + 1,
      );
    }
  });

  test("nothing on the batch-4 pages logs to the console on a fresh load", async ({
    page,
  }, testInfo) => {
    /* Visits eleven pages (the ten per-item `STRUCTURE_PAGES` routes plus
       `/sidebar-demo` — up from four when this ran against three aggregate
       category pages), each with a networkidle wait plus a fixed 1.5s
       settle for Recharts' async resize warning (see below). That is tight
       against Playwright's 30s default under four-worker contention — the
       other multi-page tests in this file (`reduced motion leaves nothing
       invisible…`, `structure specimen screenshots`) already budget
       180s+ for the same reason. This test asserts real behaviour (no
       console noise); it was timing out on the wait, not the assertion, so
       widening the budget does not weaken what it checks. */
    test.setTimeout(150_000);
    const noise: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") {
        // Name the page and, for a failed resource, the URL — a bare
        // "404 (Not Found)" once cost a whole run to trace.
        const where = m.location();
        noise.push(
          `${m.type()} @ ${page.url()}${where?.url ? ` [${where.url}]` : ""}: ${m.text().slice(0, 200)}`,
        );
      }
    });
    page.on("pageerror", (e) => noise.push(`pageerror @ ${page.url()}: ${e.message}`));
    page.on("response", (r) => {
      if (r.status() >= 400) noise.push(`http ${r.status()} ${r.url()} @ ${page.url()}`);
    });

    for (const url of STRUCTURE_PAGES) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      /* Recharts logs "The width(0) and height(0) of chart should be greater
         than 0" whenever a ResponsiveContainer resolves to nothing, which is
         the signature of a chart in a container that cannot size itself. A
         fresh navigation is where it shows up. */
      await page.waitForTimeout(1_500);
    }
    /* `/sidebar-demo` separately — `networkidle` can never fire on this page
       (see `gotoSidebarDemo`'s comment), so it is visited through that same
       concrete-element wait rather than the loop above. */
    await gotoSidebarDemo(page);
    await page.waitForTimeout(1_500);

    testInfo.annotations.push({
      type: "console",
      description: noise.length ? noise.join(" | ") : "silent",
    });
    expect(noise).toEqual([]);
  });

  test("reduced motion leaves nothing invisible on the batch-4 pages", async ({
    browser,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "the inverted sweep runs once, from the reduced-motion project",
    );
    /* Ten per-item routes now, each opened twice (normal + reduced context) —
       up from three aggregate pages. Widen the budget proportionally. */
    test.setTimeout(420_000);

    const normal = await browser.newContext({ reducedMotion: "no-preference" });
    const reduced = await browser.newContext({ reducedMotion: "reduce" });
    let checked = 0;

    try {
      for (const url of STRUCTURE_PAGES) {
        const a = await normal.newPage();
        await a.addInitScript(() =>
          window.localStorage.setItem("theme", "dark"),
        );
        await openStructureState(a, url);
        const expected = (await a.evaluate(collectAnimated)).filter(
          (n) => n.visible,
        );
        await a.close();

        const b = await reduced.newPage();
        await b.addInitScript(() =>
          window.localStorage.setItem("theme", "dark"),
        );
        await openStructureState(b, url);
        // The Preview/Code toggle's travelling pill is sized by an effect
        // after mount (`useActiveIndicator` measures the active option). On
        // the carousel page — Embla initialising in the same tick — the check
        // once ran before that effect and read three pills at 0×0, which is
        // "not painted yet", not "hidden by reduced motion". Wait for every
        // pill to have a box before judging.
        await b
          .waitForFunction(
            () =>
              [...document.querySelectorAll<HTMLElement>('[data-slot="preview-stage"]')].length ===
                0 ||
              [...document.querySelectorAll<HTMLElement>(".anim-change")].every(
                (el) => el.getBoundingClientRect().width > 0,
              ),
            undefined,
            { timeout: 10_000 },
          )
          .catch(() => undefined);
        const gone = await b.evaluate(checkStillVisible, expected);
        await b.close();

        checked += expected.length;
        expect(gone, `${url} hides content under reduced motion`).toEqual([]);
      }
    } finally {
      await normal.close();
      await reduced.close();
    }

    testInfo.annotations.push({
      type: "reduced-motion",
      description: `${checked} animated elements checked across ${STRUCTURE_PAGES.length} pages`,
    });
  });

  test("structure specimen screenshots", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "reduced-motion",
      "the reduced-motion project's frames duplicate desktop-dark",
    );
    // Ten per-item routes now, not three aggregate pages — widen the budget.
    test.setTimeout(240_000);

    for (const url of STRUCTURE_PAGES) {
      await openStructureState(page, url);
      await page.screenshot({
        path: path.join(
          STRUCTURE_SHOTS,
          `${testInfo.project.name}-${url.split("/").pop()}.png`,
        ),
      });
    }
  });

  test("per-component captures: the states a page shot cannot reach", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "reduced-motion",
      "the reduced-motion project's frames duplicate desktop-dark",
    );
    test.setTimeout(180_000);

    const shot = async (key: string, locator: ReturnType<Page["locator"]>) => {
      await expect(locator).toBeVisible();
      await settleBox(locator, key);
      await locator.screenshot({
        path: path.join(STRUCTURE_SHOTS, `${testInfo.project.name}-${key}.png`),
      });
    };

    // 1. A chart in each of its four states, including the new error seam.
    // `chart` (retargeted from the deleted `base/charts` aggregate) is the
    // route that carries both `ChartStates` and the accessibility writeup.
    await page.goto("/design-system/components/chart");
    await chartsPainted(page);
    const group = page.getByRole("radiogroup", { name: /chart state/ }).first();
    const slot = page.locator('[data-slot="chart-state-slot"]').first();
    for (const label of ["Loading", "Error", "Empty", "Ready"]) {
      await group.getByRole("radio", { name: label }).click();
      await page.waitForTimeout(800);
      await shot(`chart-${label.toLowerCase()}`, slot);
    }

    // 2. The accessibility section — the reasoning, live on the page.
    await shot("chart-accessibility", page.locator("section#accessibility"));

    /*
     * 3. Accordion — retargeted from the deleted `base/navigation` aggregate
     * to its own `accordion` route. The old single `section#disclosure` shot
     * covered both "several open at once" and "a disabled item"; the
     * per-item page carries those as two separate sections (`variants` and
     * `examples`), so both are captured rather than dropping one.
     */
    await page.goto("/design-system/components/accordion");
    await page.waitForLoadState("networkidle");
    await shot("accordion-variants", page.locator("section#variants"));
    await shot("accordion-examples", page.locator("section#examples"));

    // 4. ScrollArea with its viewport focused — the ring that could never
    // paint. Retargeted from `base/layout` to its own `scroll-area` route.
    await page.goto("/design-system/components/scroll-area");
    await page.waitForLoadState("networkidle");
    const viewport = page
      .locator('[data-slot="scroll-area-viewport"][aria-label="Possible hits"]')
      .first();
    await viewport.focus();
    await shot("scroll-area-focused", page.locator("section#preview"));

    // 5. Resizable with the handle focused. Retargeted from `base/layout` to
    // its own `resizable` route.
    await page.goto("/design-system/components/resizable");
    await page.waitForLoadState("networkidle");
    const handle = page
      .getByRole("separator", { name: "Resize the card list" })
      .first();
    await handle.focus();
    await shot("resizable-focused", page.locator("section#preview"));

    // 6. Aspect ratio, card and separator — each retargeted to its own route
    // (`base/layout` and `base/data` are both deleted); every specimen's
    // preview section is the direct replacement for the old shared section.
    await page.goto("/design-system/components/aspect-ratio");
    await page.waitForLoadState("networkidle");
    await shot("aspect-ratio", page.locator("section#preview"));
    await page.goto("/design-system/components/card");
    await page.waitForLoadState("networkidle");
    await shot("card", page.locator("section#preview"));
    await page.goto("/design-system/components/separator");
    await page.waitForLoadState("networkidle");
    await shot("separator", page.locator("section#preview"));

    // 7. The sidebar shell, expanded and collapsed, on its own route.
    await gotoSidebarDemo(page);
    const isMobile = await page.evaluate(
      () => window.matchMedia("(max-width: 767px)").matches,
    );

    if (isMobile) {
      await page.locator('[data-slot="sidebar-trigger"]').first().click();
      const sheet = page.locator('[data-slot="sidebar"][data-mobile="true"]');
      await expect(sheet).toBeVisible();
      await shot("sidebar-mobile-sheet", sheet);
      await page.keyboard.press("Escape");
    } else {
      await shot(
        "sidebar-expanded",
        page.locator('[data-slot="sidebar"]').first(),
      );
      await page.keyboard.press("Control+b");
      await page.waitForTimeout(600);
      await shot(
        "sidebar-collapsed",
        page.locator('[data-slot="sidebar"]').first(),
      );
      await page.keyboard.press("Control+b");
      await page.waitForTimeout(600);
    }

    // 8. The sidebar specimen's own accessibility section. Retargeted from
    // the deleted `base/sidebar` aggregate to the `sidebar` catalog route.
    await page.goto("/design-system/components/sidebar");
    await page.waitForLoadState("networkidle");
    await shot("sidebar-accessibility", page.locator("section#accessibility"));
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   Batch 4 — visual closers for rows 63 (IconSwap), 64 (ICON_SIZES/Icon) and 65
   (Prose)
   ══════════════════════════════════════════════════════════════════════════════
   Row 63's own specimen (IconSwap, on the buttons page) already has
   pre-existing shots under `shots/controls/`, read directly with the Read
   tool rather than recaptured here. Rows 64/65 (icons, typography) had no
   shots anywhere in the tree — this closes that gap the same way batch 4's
   own structure pages were captured: theme-seeded, animations settled, one
   `h1`, no sideways scroll, no console noise, one screenshot per page per
   project. */
test.describe("batch4 visual closers", () => {
  const CLOSER_PAGES = [
    { url: "/design-system/icons", key: "icons" },
    { url: "/design-system/typography", key: "typography" },
  ];

  for (const { url, key } of CLOSER_PAGES) {
    test(`${key}: one h1, no sideways scroll, no console errors`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(60_000);
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text().slice(0, 200));
      });
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

      await page.goto(url);
      await page.waitForLoadState("networkidle");
      // Settle any entrance/reveal motion the same way the structure pages do.
      await page.waitForTimeout(1_000);

      await expect(page.locator("h1")).toHaveCount(1);

      const overflow = await noHorizontalOverflow(page);
      expect(
        overflow.scrollWidth,
        `${url} scrolls sideways`,
      ).toBeLessThanOrEqual(overflow.innerWidth + 1);

      testInfo.annotations.push({
        type: "console",
        description: errors.length ? errors.join(" | ") : "silent",
      });
      expect(errors).toEqual([]);
    });

    test(`${key}: structure specimen screenshot`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name === "reduced-motion",
        "the reduced-motion project's frame duplicates desktop-dark",
      );
      test.setTimeout(60_000);

      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1_000);

      await page.screenshot({
        path: path.join(
          STRUCTURE_SHOTS,
          `${testInfo.project.name}-${key}.png`,
        ),
        fullPage: true,
      });
    });
  }
});
