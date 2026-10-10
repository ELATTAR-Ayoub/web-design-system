import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

/**
 * Rendered behaviour for the component audit (`docs/audits/web-component-audit.md`).
 *
 * One `describe` per audit batch. Everything in here is a claim that the unit
 * suite structurally cannot make: a real focus ring painted by a real
 * stylesheet, a measured hit target, a page that does or does not scroll
 * sideways at 375px, an animation that reduced motion left at zero opacity.
 *
 * Later batches append their own `describe` block; `--grep` selects one.
 */

/*
 * The grouped `base/*` category pages this batch exercised were deleted; every
 * capability now lives at its own `/design-system/components/<name>` route
 * (see `.tmp/route-map.md`). The five entries below are the specific
 * components this describe block's own tests drive (button, select, checkbox,
 * radio, slider) — the same breadth the old five category pages gave a sweep,
 * now addressed by component rather than by category.
 */
const CONTROL_PAGES = [
  "/design-system/components/button",
  "/design-system/components/select",
  "/design-system/components/checkbox",
  "/design-system/components/radio",
  "/design-system/components/slider",
];

const SHOTS = path.join(
  process.cwd(),
  "test-results/screenshots/controls",
);

async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    /*
     * `clientWidth`, not `window.innerWidth`.
     *
     * On a mobile-shaped context Chrome GROWS the layout viewport to fit an
     * overflowing document, so `innerWidth` moves to meet `scrollWidth` and
     * the comparison is true however far the page overflows. The chat specimen
     * measured 438 against 438 at a 375px viewport and passed — a real
     * overflow, invisible to the assertion written to catch it. `clientWidth`
     * is the layout viewport and does not move.
     */
    innerWidth: document.documentElement.clientWidth,
    /** The widest offender, so a failure names the element rather than a number. */
    widest: (() => {
      let worst = { tag: "", width: 0, cls: "" };
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1 && r.width > worst.width) {
          worst = {
            tag: el.tagName.toLowerCase(),
            width: Math.round(r.width),
            cls: (el.getAttribute("class") ?? "").slice(0, 120),
          };
        }
      }
      return worst;
    })(),
  }));
}

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

/** One at-risk element, addressed by a path both browser contexts agree on. */
type AnimatedNode = { path: string; label: string; visible: boolean };

/**
 * Every element that carries an animation, or a class from a family that does,
 * with whether it is currently visible. Runs in the page.
 */
function collectAnimated(): AnimatedNode[] {
  /** A structural index path — the two contexts render the same static HTML. */
  const pathOf = (el: Element) => {
    const parts: string[] = [];
    let node: Element | null = el;
    while (node?.parentElement) {
      const i = Array.prototype.indexOf.call(node.parentElement.children, node);
      parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${i + 1})`);
      node = node.parentElement;
    }
    return parts.join(">");
  };

  const isVisible = (el: Element) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return (
      parseFloat(s.opacity) > 0 &&
      s.visibility !== "hidden" &&
      s.display !== "none" &&
      r.width > 0 &&
      r.height > 0
    );
  };

  const out: AnimatedNode[] = [];
  for (const el of Array.from(document.querySelectorAll("*"))) {
    const cls = typeof el.className === "string" ? el.className : "";
    const animated =
      getComputedStyle(el).animationName !== "none" ||
      /(?:^|\s)(?:anim-|animate-|shimmer-|foil-|sheen-|bloom-)/.test(cls);
    if (!animated) continue;
    out.push({
      path: pathOf(el),
      label: `${el.tagName.toLowerCase()}.${cls}`.slice(0, 140),
      visible: isVisible(el),
    });
  }
  return out;
}

/** Which of `expected` stopped being visible. Runs in the page. */
function checkStillVisible(expected: AnimatedNode[]): string[] {
  const gone: string[] = [];
  for (const item of expected) {
    const el = document.querySelector(item.path);
    if (!el) {
      gone.push(`${item.label}  [element missing]`);
      continue;
    }
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const visible =
      parseFloat(s.opacity) > 0 &&
      s.visibility !== "hidden" &&
      s.display !== "none" &&
      r.width > 0 &&
      r.height > 0;
    if (!visible) {
      gone.push(
        `${item.label}  [opacity ${s.opacity}, visibility ${s.visibility}, ` +
          `${Math.round(r.width)}x${Math.round(r.height)}, animation ${s.animationName}]`,
      );
    }
  }
  return gone;
}

test.describe("controls", () => {
  test("the project's theme is the one actually painted", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/button");
    const expected = testInfo.project.name === "desktop-light" ? "light" : "dark";
    const classes = ((await page.locator("html").getAttribute("class")) ?? "")
      .split(/\s+/)
      .filter(Boolean);
    expect(classes, `<html class="${classes.join(" ")}">`).toContain(expected);
  });

  test("buttons page: Tab reaches every action in source order", async ({
    page,
  }) => {
    await page.goto("/design-system/components/button");

    const first = page.getByRole("button", { name: "Open Pack" }).first();
    await first.focus();
    await expect(first).toBeFocused();

    // Walk forward a dozen stops; every landing place must be a real control,
    // never a plain div that has taken a tabindex it cannot use.
    const roles: string[] = [];
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      roles.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return "none";
          return (
            el.getAttribute("role") ?? el.tagName.toLowerCase()
          );
        }),
      );
    }
    // `pre` is allowed: Chromium (130+) makes a scrollable region with no
    // focusable children keyboard-focusable, and at 375 the code views
    // overflow sideways — a Tab stop a keyboard user needs to scroll them.
    const allowed = new Set(["button", "a", "input", "radio", "combobox", "switch", "checkbox", "slider", "select", "textarea", "summary", "pre"]);
    expect(
      roles.filter((r) => !allowed.has(r)),
      `unexpected tab stops: ${roles.join(", ")}`,
    ).toEqual([]);
  });

  test("focus-visible paints a real ring, not a source-only class", async ({
    page,
  }) => {
    await page.goto("/design-system/components/button");
    const button = page.getByRole("button", { name: "Open Pack" }).first();
    await button.focus();

    const ring = await button.evaluate((el) => {
      const s = getComputedStyle(el);
      return { shadow: s.boxShadow, outline: s.outlineWidth };
    });
    // The ring is a box-shadow (`ring-3`), so `none` means the class resolved
    // to nothing — trap 1's signature.
    expect(ring.shadow).not.toBe("none");
  });

  test("disabled Button is neither focusable nor activatable", async ({
    page,
  }) => {
    await page.goto("/design-system/components/button");
    await page.waitForLoadState("networkidle");
    const disabled = page
      .locator('button[disabled]:not([aria-busy="true"])')
      .first();
    await expect(disabled).toBeVisible();
    await expect(disabled).toBeDisabled();

    const focusable = await disabled.evaluate((el) => {
      (el as HTMLElement).focus();
      return document.activeElement === el;
    });
    expect(focusable).toBe(false);

    let clicked = false;
    await page.exposeFunction("__clicked", () => {
      clicked = true;
    });
    await disabled.evaluate((el) =>
      el.addEventListener("click", () =>
        (window as unknown as { __clicked: () => void }).__clicked(),
      ),
    );
    await disabled.click({ force: true });
    expect(clicked).toBe(false);
  });

  test("Select opens on Enter, closes on Escape and returns focus", async ({
    page,
  }) => {
    await page.goto("/design-system/components/select");
    const trigger = page.locator('[data-slot="select-trigger"]').first();

    await trigger.focus();
    await page.keyboard.press("Enter");
    // Scoped to the Select's own popup: the same route renders a Command
    // palette, whose list is a permanently-present `role="listbox"`, so a bare
    // `getByRole("listbox")` passes whether or not the Select ever opened.
    await expect(page.locator('[data-slot="select-content"]')).toHaveCount(1);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.locator('[data-slot="select-content"]')).toHaveCount(0);
    await expect(trigger).toBeFocused();

    // Space is the second documented opener and is easy to lose.
    await page.keyboard.press("Space");
    await expect(page.locator('[data-slot="select-content"]')).toHaveCount(1);
    await page.keyboard.press("Escape");
  });

  test("Checkbox toggles with Space and reports it in ARIA", async ({
    page,
  }) => {
    await page.goto("/design-system/components/checkbox");
    const box = page.getByRole("checkbox", { name: "Unchecked" });

    await box.focus();
    await expect(box).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Space");
    await expect(box).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Space");
    await expect(box).toHaveAttribute("aria-checked", "false");
  });

  test("RadioGroup is one tab stop, arrows move focus, Space selects", async ({
    page,
  }) => {
    await page.goto("/design-system/components/radio");
    // `.first()`: the per-item radio page carries a second, three-option
    // radio group further down (Examples) whose first item is also named
    // "USDC ...", so a bare name match is a strict-mode violation. The
    // Preview group — two items, USDC then Bank transfer — is what the old
    // grouped page's equivalent test exercised.
    const first = page.getByRole("radio", { name: "USDC" }).first();
    await first.focus();
    await page.keyboard.press("ArrowDown");

    const second = page.getByRole("radio", { name: "Bank transfer" }).first();
    await expect(second).toBeFocused();

    /*
     * Selection-follows-focus is NOT asserted, because radix-ui 1.6.7 does not
     * do it reliably: `RadioGroupItem` sets its arrow-key flag from a listener
     * on `document`, which runs after `RovingFocusGroup` has already moved
     * focus inside the item's own keydown, so the `onFocus` that would click
     * the item sees the flag still false. It passed in one of five Playwright
     * projects and failed in four — a race, not a behaviour. Recorded as a
     * `blocked` interaction row in the audit ledger rather than patched here:
     * roving focus belongs to the primitive (RULES §5), and re-implementing it
     * in a wrapper is exactly the fork this system forbids.
     */
    await page.keyboard.press("Space");
    await expect(second).toHaveAttribute("aria-checked", "true");
    await expect(first).toHaveAttribute("aria-checked", "false");
  });

  test("the slider thumb carries the accessible name, not the root", async ({
    page,
  }) => {
    await page.goto("/design-system/components/slider");
    await expect(
      page.getByRole("slider", { name: "Minimum price" }),
    ).toBeVisible();
    await expect(
      page.getByRole("slider", { name: "Maximum price" }),
    ).toBeVisible();
  });

  test("the slider thumb reclaims the 44px hit-target floor", async ({
    page,
  }) => {
    await page.goto("/design-system/components/slider");
    const target = await page
      .getByRole("slider", { name: "Minimum price" })
      .evaluate((el) => {
        const own = el.getBoundingClientRect();
        const before = getComputedStyle(el, "::after");
        const inset = (v: string) => parseFloat(v || "0");
        return {
          width: own.width - inset(before.left) - inset(before.right),
          height: own.height - inset(before.top) - inset(before.bottom),
        };
      });
    expect(Math.round(target.width)).toBeGreaterThanOrEqual(44);
    expect(Math.round(target.height)).toBeGreaterThanOrEqual(44);
  });

  test("no specimen page scrolls sideways", async ({ page }) => {
    for (const url of CONTROL_PAGES) {
      await page.goto(url);
      const m = await noHorizontalOverflow(page);
      expect(
        m.scrollWidth,
        `${url} overflows: widest offender <${m.widest.tag}> ${m.widest.width}px — ${m.widest.cls}`,
      ).toBeLessThanOrEqual(m.innerWidth);
    }
  });

  test("reduced motion leaves nothing invisible", async ({
    browser,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "only meaningful under prefers-reduced-motion: reduce",
    );
    /* Five specimen pages, each loaded twice in two separate browser contexts.
       It fits inside the default 30s alone and did not once batch 3's block
       joined the suite — a capacity problem, not a defect. Batch 2's equivalent
       already carries the same allowance. */
    test.setTimeout(180_000);

    /*
     * The guard is INVERTED on purpose, and the first version of this test had
     * it the wrong way round.
     *
     * That version walked every element under reduced motion and skipped any
     * whose computed `animationName` was `none`. `styles/motion.css`' blanket
     * rule sets `animation-duration: 0.01ms !important` rather than
     * `animation: none`, so most animated elements survived that filter — but
     * anything that *does* reach `animation: none` (Tailwind's own
     * `animate-none`, `data-[align-trigger=true]:animate-none` on
     * `SelectContent`) was skipped, and `animation: none` drops fill-mode. An
     * override that forgets `opacity: 1` therefore lands in exactly the bucket
     * the old filter threw away — the test could not fail for its own subject.
     *
     * So: collect the at-risk set from a context with NO reduced-motion
     * preference, let every animation finish, and record which of those
     * elements end up visible. Then load the same page under reduced motion and
     * require the same elements to still be visible. An element that is legitimately
     * absent — `[hidden]`, `display:none`, a collapsed overlay — never enters
     * the set in the first place, so there is nothing to allow-list.
     */
    const seed = (theme: string) => (ctx: import("@playwright/test").BrowserContext) =>
      ctx.addInitScript((value) => {
        window.localStorage.setItem("theme", value);
      }, theme);

    const normal = await browser.newContext({
      reducedMotion: "no-preference",
      colorScheme: "dark",
      viewport: { width: 1280, height: 800 },
    });
    await seed("dark")(normal);
    const reduced = await browser.newContext({
      reducedMotion: "reduce",
      colorScheme: "dark",
      viewport: { width: 1280, height: 800 },
    });
    await seed("dark")(reduced);

    let checked = 0;
    try {
      for (const url of CONTROL_PAGES) {
        const settle = async (p: Page) => {
          await p.goto(url);
          await p.waitForLoadState("networkidle");
          /*
           * Wait for the JS-measured pieces before reading any size. The
           * `ActiveIndicator` ships as `w-0` and is given its width by an
           * effect, so a page read too early reports the travelling pill as
           * 0x0 — which the first run of this test duly reported as a
           * reduced-motion defect. It was a race: measured directly, the pill
           * is 28x28 and 70x32 under both preferences. A pill that is
           * deliberately parked (nothing selected in its group) stays at
           * `opacity: 0` and is allowed through.
           */
          await p.waitForFunction(() =>
            Array.from(document.querySelectorAll(".toggle-slide")).every(
              (el) =>
                el.getBoundingClientRect().width > 0 ||
                parseFloat(getComputedStyle(el).opacity) === 0,
            ),
          );
          if (url.endsWith("/checkbox")) {
            // Fire the one-shot squash/pop rather than only the idle page.
            await p.getByRole("checkbox", { name: "Unchecked" }).click();
          }
          // Run every animation to its end, so "visible" means the RESTING
          // state rather than a frame caught mid-flight.
          await p.evaluate(() => {
            document
              .getAnimations()
              .forEach((a) => {
                try {
                  a.finish();
                } catch {
                  /* an infinite animation cannot finish; leave it running */
                }
              });
          });
          await p.waitForTimeout(250);
        };

        const a = await normal.newPage();
        await settle(a);
        const expected = (await a.evaluate(collectAnimated)).filter(
          (x) => x.visible,
        );
        await a.close();

        expect(
          expected.length,
          `${url}: found no animated elements at all — the collector is broken, not the page`,
        ).toBeGreaterThan(0);
        checked += expected.length;

        const b = await reduced.newPage();
        await settle(b);
        /*
         * Re-read rather than sampling once.
         *
         * `ActiveIndicator` ships as `w-0` and is given its size by an effect,
         * so a single read taken too early reports the travelling pill and its
         * `size-full` child as 0x0 — which this test duly reported as a
         * reduced-motion defect. `settle`'s `waitForFunction` covers the
         * `.toggle-slide` itself and not its children, so under a full-suite run
         * (where the machine is loaded enough for it to matter) the children
         * were still unsized when the read happened. It failed reproducibly
         * there and passed every time in isolation, which is the signature.
         *
         * The claim is "reduced motion leaves nothing invisible", not "leaves
         * nothing invisible within 250ms" — so an element is only reported gone
         * once it has stayed gone. Something genuinely hidden never comes back,
         * so the guard keeps its teeth.
         */
        let gone: string[] = [];
        for (let attempt = 0; attempt < 8; attempt += 1) {
          gone = await b.evaluate(checkStillVisible, expected);
          if (gone.length === 0) break;
          await b.waitForTimeout(250);
        }
        await b.close();

        expect(
          gone,
          `${url}: visible without reduced motion, invisible with it —\n${gone.join("\n")}`,
        ).toEqual([]);
      }
    } finally {
      await normal.close();
      await reduced.close();
    }

    testInfo.annotations.push({
      type: "reduced-motion",
      description: `${checked} animated elements checked across ${CONTROL_PAGES.length} pages`,
    });
  });

  test("specimen screenshots for the visual axis", async ({ page }, testInfo) => {
    test.skip(
      !["desktop-dark", "desktop-light", "tablet", "mobile"].includes(
        testInfo.project.name,
      ),
      "one capture per viewport/theme project",
    );
    /* Five specimen pages, each loaded and photographed. It fits inside the
       default 30s alone and did not once batch 3's block joined the suite —
       the same capacity problem the reduced-motion sweep above hit, and the
       same allowance batch 2's captures already carry. */
    test.setTimeout(180_000);

    for (const url of CONTROL_PAGES) {
      const name = url.split("/").pop();
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: path.join(SHOTS, `${testInfo.project.name}-${name}.png`),
        fullPage: true,
      });
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * Batch 2 — dialogs, sheets, drawers, popovers, menus, tooltips
 * ──────────────────────────────────────────────────────────────────────────── */

/*
 * `base/dialogs` and `base/menus` were deleted; `dialog` and `dropdown-menu`
 * are the two per-item routes this describe block's own tests drive (see
 * `openFirstOverlay` below), so they stand in for the two former category
 * pages.
 */
const OVERLAY_PAGES = [
  "/design-system/components/dialog",
  "/design-system/components/dropdown-menu",
];

const OVERLAY_SHOTS = path.join(
  process.cwd(),
  "test-results/screenshots/overlays",
);

/**
 * Open one overlay on each page from the KEYBOARD, and leave it open.
 *
 * Every rendered claim below — overflow at 375, reduced motion, the screenshot
 * — is worthless against a closed overlay, and an overlay opened by `.click()`
 * proves nothing about the keyboard path. Returns a locator for the panel.
 */
async function openFirstOverlay(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");

  const isDialogs = url.endsWith("/dialog");
  /*
   * Both triggers are in their pages' live previews. The old menu States
   * matrix used an "Actions" trigger, but that matrix described the Button,
   * not DropdownMenu, and was removed. The preview's voidwing menu has the
   * real checked, submenu, and destructive rows this capture needs.
   */
  const trigger = isDialogs
    ? page.getByRole("button", { name: "Open Pack" }).first()
    : page.getByRole("button", { name: "voidwing" }).first();

  /*
   * `focus({ preventScroll: true })` and then scroll to the top, rather than
   * Playwright's `locator.focus()`.
   *
   * Radix locks the page with `body { overflow: hidden }` while a modal is
   * open. If the focus scrolled the trigger into view first, the page is left
   * at a non-zero scrollY that can no longer be undone, and Playwright's
   * viewport screenshot then composites from the document origin — producing a
   * few hundred pixels of empty background above the header. Measured live on
   * the same state: `scrollY: 809`, dialog top 257 of a 900px viewport, i.e.
   * exactly centred and the header at 0. So the band was an artefact of the
   * capture, not a layout shift — but it made every screenshot below a worse
   * piece of evidence than it needed to be.
   */
  await page.evaluate(() => window.scrollTo(0, 0));
  await trigger.evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");

  const panel = page.locator(
    isDialogs
      ? '[data-slot="dialog-content"]'
      : '[data-slot="dropdown-menu-content"]',
  );
  await expect(panel).toBeVisible();
  return panel;
}

test.describe("overlays", () => {
  test("Dialog: Enter opens, focus moves in, Escape closes and returns focus", async ({
    page,
  }) => {
    await page.goto("/design-system/components/dialog");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Open Pack" }).first();

    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator('[data-slot="dialog-content"]');
    await expect(dialog).toBeVisible();

    const inside = await dialog.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(inside, "focus did not move into the dialog").toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("AlertDialog: the overlay is inert and Escape closes on the first press", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/alert-dialog");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Sell All Cards" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const alert = page.getByRole("alertdialog");
    await expect(alert).toBeVisible();

    // Clicking the overlay must do nothing: an irreversible decision has to be
    // answered, not dismissed.
    await page
      .locator('[data-slot="alert-dialog-overlay"]')
      .click({ position: { x: 5, y: 5 }, force: true });
    await expect(alert).toBeVisible();

    /*
     * One press, and the count is asserted rather than tolerated.
     *
     * It used to take two. `AlertDialogCancel` attached a Tooltip whenever
     * `children` was a string, Radix auto-focuses that cancel button on open,
     * a programmatic focus opens a Radix tooltip, and `DismissableLayer` gives
     * Escape to the highest layer only — so an unrequested tooltip repeating
     * the button's own words swallowed the first press. The tooltip is now
     * gated on the label ACTUALLY being truncated, which is the only case
     * RULES §5 asks it to cover. The loop still counts, because a regression
     * here would otherwise show up as a slightly slower test and nothing else.
     */
    let presses = 0;
    for (; presses < 4; ) {
      await page.keyboard.press("Escape");
      presses += 1;
      /*
       * Read `data-state`, not the element count. `anim-close` runs for
       * --duration-normal, and Radix keeps the node mounted for the whole exit —
       * so counting elements measures the leave animation and reports four or
       * five "presses" for a dialog that actually closed on the second. That
       * mistake was in the first version of this loop and produced a number
       * this report would have printed.
       */
      if ((await alert.count()) === 0) break;
      if ((await alert.getAttribute("data-state")) === "closed") break;
      await page.waitForTimeout(250);
    }
    await expect(alert).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(
      presses,
      "an overlay above the alert dialog is eating the Escape again",
    ).toBe(1);
    testInfo.annotations.push({
      type: "measured",
      description: `AlertDialog needed ${presses} Escape press(es) to start closing`,
    });
  });

  test("DropdownMenu: Enter opens, arrows move, Escape closes and returns focus", async ({
    page,
  }) => {
    await page.goto("/design-system/components/dropdown-menu");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "voidwing" }).first();

    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible();

    /*
     * Which item Radix lands on when the menu opens is not the same across the
     * five projects — the mobile project sets `isMobile`/`hasTouch`, and a
     * touch-shaped context does not always take the "open and focus the first
     * item" path. Asserting "Wallet is focused immediately after Enter" failed
     * on mobile and reduced-motion for that reason. What the system actually
     * promises is that the ARROW KEYS move focus between real menu items, so
     * that is what is asserted: drive the keys and read where focus lands.
     */
    await page.keyboard.press("ArrowDown");
    const focusedName = () =>
      page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el?.getAttribute("role")?.startsWith("menuitem")
          ? (el.textContent ?? "").trim()
          : `not a menuitem: ${el?.tagName.toLowerCase()}`;
      });
    /*
     * Poll both reads. A bare `evaluate` after `keyboard.press` samples
     * whenever it happens to run, and Radix moves roving focus in a React
     * effect — so the second read came back with the FIRST item's name in
     * desktop-light, reporting "ArrowDown did not move" for a menu that had
     * moved a moment later.
     */
    await expect
      .poll(focusedName, { message: "arrow keys did not land on a menu item" })
      .not.toMatch(/^not a menuitem/);
    const first = await focusedName();

    await page.keyboard.press("ArrowDown");
    await expect
      .poll(focusedName, { message: "ArrowDown did not move to another item" })
      .not.toBe(first);
    expect(await focusedName()).not.toMatch(/^not a menuitem/);

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("Tooltip: opens on keyboard focus and dismisses on Escape", async ({
    page,
  }) => {
    await page.goto("/design-system/components/tooltip");
    /*
     * Wait for hydration before focusing anything.
     *
     * A tooltip opens from a React `onFocus` handler, and the static HTML ships
     * the button long before that handler is attached. Under a full parallel
     * run the machine is loaded enough that `focus()` lands first, nothing
     * listens, and focus is never re-evaluated — so the tooltip simply never
     * appears. This test passed three times out of three in isolation and
     * failed every time inside `--grep overlays` for exactly that reason.
     */
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Filters" });

    // Scoped by content, not `.first()`: the tooltip page carries more than one and
    // `first()` can resolve to a different one that is still animating out.
    const tip = page.getByRole("tooltip").filter({ hasText: "Filter and sort" });

    /*
     * Focus in a poll rather than once, and poll the TRIGGER's state.
     *
     * Two separate races were in the way, and both produced a green-looking
     * test that failed only under a loaded parallel run:
     *
     * 1. `networkidle` is not a hydration signal. A `focus()` that lands before
     *    React attaches `onFocus` is never re-evaluated, so the tooltip simply
     *    never opens. Hence re-focusing until it does.
     * 2. Polling `getByRole("tooltip").count()` then asserting visibility read
     *    two different tooltips: the blur at the top of each poll iteration
     *    closes the previous one, which stays mounted through its exit
     *    animation and still matches both the role and the text. The count saw
     *    the dying one; the assertion a moment later saw nothing.
     *
     * Radix puts `aria-describedby` on the trigger for exactly as long as the
     * tooltip is open, which is both unambiguous and the thing a screen reader
     * actually uses — so that is what is polled.
     */
    await expect
      .poll(
        async () => {
          await trigger.blur();
          await page.waitForTimeout(100);
          await trigger.focus();
          await page.waitForTimeout(400); // the provider's 200ms open delay
          return trigger.getAttribute("aria-describedby");
        },
        { message: "keyboard focus never opened the tooltip", timeout: 15_000 },
      )
      .not.toBeNull();
    await expect(tip).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    // Dismissing the label must not move focus off the control it labels.
    await expect(trigger).toBeFocused();
  });

  test("the overlay variant classes resolve to real animations", async ({
    page,
  }) => {
    /*
     * Trap 13: a `data-open:` class looks undefined in a grep of globals.css
     * and is not. The build is the authority, so read `animationName` off the
     * live element with the overlay actually open.
     */
    await page.goto("/design-system/components/dialog");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Open Pack" }).first().focus();
    await page.keyboard.press("Enter");

    const anim = await page
      .locator('[data-slot="dialog-content"]')
      .evaluate((el) => ({
        name: getComputedStyle(el).animationName,
        state: el.getAttribute("data-state"),
      }));
    expect(anim.state).toBe("open");
    expect(
      anim.name,
      "data-open:anim-open did not resolve — the class is dead",
    ).not.toBe("none");

    await page.keyboard.press("Escape");
    await page.goto("/design-system/components/dropdown-menu");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "voidwing" }).first().focus();
    await page.keyboard.press("Enter");
    const menuAnim = await page
      .locator('[data-slot="dropdown-menu-content"]')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(menuAnim, "the anchored enter animation is dead").not.toBe("none");
  });

  test("a Sheet keeps its footer reachable and scrolls its own body", async ({
    page,
  }) => {
    await page.goto("/design-system/components/sheet");
    await page.waitForLoadState("networkidle");
    // The specimen's only real trigger is named "Filters" — the old grouped
    // page distinguished a left/right pair with "(right)"; the per-item page
    // has just the one, anchored right by default.
    await page.getByRole("button", { name: "Filters" }).first().focus();
    await page.keyboard.press("Enter");

    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible();

    const body = sheet.locator('[data-slot="sheet-body"]');
    const geometry = await body.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      overflowY: getComputedStyle(el).overflowY,
    }));
    expect(geometry.overflowY).toBe("auto");

    // The band the whole part exists for: Apply must be on screen with the
    // sheet open, at every viewport, however long the filter list gets.
    const apply = page.getByRole("button", { name: "Apply filters" });
    const box = (await apply.boundingBox())!;
    expect(
      box.y + box.height,
      `Apply filters sits below the fold (body scrolls ${geometry.scrollHeight} in ${geometry.clientHeight})`,
    ).toBeLessThanOrEqual(page.viewportSize()!.height);
  });

  test("the dialog close button reclaims 44x44, and the menu row is measured", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/dropdown-menu");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "voidwing" }).first().focus();
    await page.keyboard.press("Enter");
    const item = await page
      .getByRole("menuitem", { name: /Wallet/ })
      .boundingBox();

    await page.keyboard.press("Escape");
    await page.goto("/design-system/components/dialog");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Open Pack" }).first().focus();
    await page.keyboard.press("Enter");
    // The icon dismissal in the header band, addressed by its position rather
    // than by slot: `DialogFooter showCloseButton` publishes the same slot.
    const closeEl = page
      .locator('[data-slot="dialog-content"] > button[data-slot="dialog-close"]')
      .first();
    // The dialog enters through `zoom-in-95`; a pseudo-element read on the
    // first visible frame is 44 × 0.98 = 43. Let the entrance finish first.
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          // Only finite ones: the starfield and the bloom drift never finish,
          // and waiting on them waited out the whole test.
          .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime as number))
          .map((a) => a.finished.catch(() => undefined)),
      ),
    );
    const close = await closeEl.boundingBox();

    /*
     * The ✕ is drawn at 32 and reclaims 44 through `::after`, the same shape
     * the Slider thumb uses. Measured 33x33 before the reclaim existed, which
     * made it the smallest target in the system. Read the pseudo-element
     * rather than the button box, because the button box is deliberately still
     * 32 — RULES §7 exempts a nested control's *visual* size, not its target.
     */
    const closeTarget = await closeEl.evaluate((el) => {
      const own = el.getBoundingClientRect();
      const a = getComputedStyle(el, "::after");
      const inset = (v: string) => parseFloat(v || "0");
      return {
        width: own.width - inset(a.left) - inset(a.right),
        height: own.height - inset(a.top) - inset(a.bottom),
        overflow: getComputedStyle(el).overflow,
      };
    });
    // `overflow-hidden` on Button clips the reclaim's hit area, not just its
    // paint — so this assertion is what stops the fix silently reverting.
    expect(closeTarget.overflow).toBe("visible");
    expect(Math.round(closeTarget.width)).toBeGreaterThanOrEqual(44);
    expect(Math.round(closeTarget.height)).toBeGreaterThanOrEqual(44);

    /*
     * Recorded, not asserted against 44. The 36px menu row is a documented
     * geometry decision on the menus specimen — `px-3 py-2` on the 8-point
     * scale, shared by Dropdown, Context Menu, Menubar, Select and Command —
     * and raising it is an owner decision about five components at once, not a
     * batch-2 patch. The ledger carries the measurement and the reason.
     */
    testInfo.annotations.push({
      type: "measured",
      description:
        `menu item ${Math.round(item!.width)}x${Math.round(item!.height)}, ` +
        `dialog close drawn ${Math.round(close!.width)}x${Math.round(close!.height)}, ` +
        `target ${Math.round(closeTarget.width)}x${Math.round(closeTarget.height)}`,
    });
    expect(item!.height).toBeGreaterThan(0);
    expect(close!.height).toBeGreaterThan(0);
  });

  test("no overlay page overflows sideways, with an overlay open", async ({
    page,
  }) => {
    for (const url of OVERLAY_PAGES) {
      await openFirstOverlay(page, url);
      const m = await noHorizontalOverflow(page);
      expect(
        m.scrollWidth,
        `${url} (overlay open) overflows: <${m.widest.tag}> ${m.widest.width}px — ${m.widest.cls}`,
      ).toBeLessThanOrEqual(m.innerWidth);
    }
  });

  test("an open overlay fits the viewport at every size", async ({ page }) => {
    for (const url of OVERLAY_PAGES) {
      const panel = await openFirstOverlay(page, url);
      const vp = page.viewportSize()!;
      const box = (await panel.boundingBox())!;
      expect(
        Math.round(box.width),
        `${url}: the open overlay is wider than the viewport`,
      ).toBeLessThanOrEqual(vp.width);
      expect(
        Math.round(box.x),
        `${url}: the open overlay starts off the left edge`,
      ).toBeGreaterThanOrEqual(-1);
    }
  });

  test("reduced motion leaves nothing invisible, with overlays open", async ({
    browser,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "only meaningful under prefers-reduced-motion: reduce",
    );

    const seed = (ctx: import("@playwright/test").BrowserContext) =>
      ctx.addInitScript(() => window.localStorage.setItem("theme", "dark"));

    const normal = await browser.newContext({
      reducedMotion: "no-preference",
      colorScheme: "dark",
      viewport: { width: 1280, height: 800 },
    });
    await seed(normal);
    const reduced = await browser.newContext({
      reducedMotion: "reduce",
      colorScheme: "dark",
      viewport: { width: 1280, height: 800 },
    });
    await seed(reduced);

    let checked = 0;
    try {
      for (const url of OVERLAY_PAGES) {
        const settle = async (p: Page) => {
          await openFirstOverlay(p, url);
          await p.evaluate(() =>
            document.getAnimations().forEach((a) => {
              try {
                a.finish();
              } catch {
                /* an infinite animation cannot finish; leave it running */
              }
            }),
          );
          await p.waitForTimeout(250);
        };

        const a = await normal.newPage();
        await settle(a);
        const expected = (await a.evaluate(collectAnimated)).filter(
          (x) => x.visible,
        );
        await a.close();

        expect(
          expected.length,
          `${url}: found no animated elements at all — the collector is broken, not the page`,
        ).toBeGreaterThan(0);
        checked += expected.length;

        const b = await reduced.newPage();
        await settle(b);
        /*
         * Re-read rather than sampling once.
         *
         * `ActiveIndicator` ships as `w-0` and is given its size by an effect,
         * so a single read taken too early reports the travelling pill and its
         * `size-full` child as 0x0 — which this test duly reported as a
         * reduced-motion defect. `settle`'s `waitForFunction` covers the
         * `.toggle-slide` itself and not its children, so under a full-suite run
         * (where the machine is loaded enough for it to matter) the children
         * were still unsized when the read happened. It failed reproducibly
         * there and passed every time in isolation, which is the signature.
         *
         * The claim is "reduced motion leaves nothing invisible", not "leaves
         * nothing invisible within 250ms" — so an element is only reported gone
         * once it has stayed gone. Something genuinely hidden never comes back,
         * so the guard keeps its teeth.
         */
        let gone: string[] = [];
        for (let attempt = 0; attempt < 8; attempt += 1) {
          gone = await b.evaluate(checkStillVisible, expected);
          if (gone.length === 0) break;
          await b.waitForTimeout(250);
        }
        await b.close();

        expect(
          gone,
          `${url}: visible without reduced motion, invisible with it —\n${gone.join("\n")}`,
        ).toEqual([]);
      }
    } finally {
      await normal.close();
      await reduced.close();
    }

    testInfo.annotations.push({
      type: "reduced-motion",
      description: `${checked} animated elements checked with an overlay open on ${OVERLAY_PAGES.length} pages`,
    });
  });

  test("overlay specimen screenshots, with an overlay open", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["desktop-dark", "desktop-light", "tablet", "mobile"].includes(
        testInfo.project.name,
      ),
      "one capture per viewport/theme project",
    );

    for (const url of OVERLAY_PAGES) {
      const name = url.split("/").pop();
      await openFirstOverlay(page, url);
      await page.screenshot({
        path: path.join(OVERLAY_SHOTS, `${testInfo.project.name}-${name}.png`),
      });
    }
  });
});

/* ── Fix round 1 ─────────────────────────────────────────────────────────── */

/**
 * Every batch-2 overlay, opened from the keyboard where a keyboard can open it,
 * addressed by the panel it produces.
 *
 * The first round of this batch photographed two overlays and wrote
 * "dialog open in each" on eight ledger rows. This table is what makes that
 * claim true: each entry opens exactly one component and hands back the panel,
 * so the screenshot, the console sweep and the reading notes are all about the
 * component the row names.
 */
const OVERLAY_CASES = [
  { key: "dialog", url: "/design-system/components/dialog" },
  { key: "alert-dialog", url: "/design-system/components/alert-dialog" },
  { key: "sheet", url: "/design-system/components/sheet" },
  { key: "drawer", url: "/design-system/components/drawer" },
  { key: "popover", url: "/design-system/components/popover" },
  { key: "hover-card", url: "/design-system/components/hover-card" },
  { key: "tooltip", url: "/design-system/components/tooltip" },
  { key: "dropdown-menu", url: "/design-system/components/dropdown-menu" },
  { key: "context-menu", url: "/design-system/components/context-menu" },
  { key: "menubar", url: "/design-system/components/menubar" },
] as const;

type OverlayKey = (typeof OVERLAY_CASES)[number]["key"];

async function openOne(
  page: Page,
  key: OverlayKey,
  opts: { preventScroll?: boolean } = {},
) {
  const preventScroll = opts.preventScroll ?? false;
  const kb = async (name: string | RegExp) => {
    const t = page.getByRole("button", { name }).first();
    await t.evaluate(
      (el: HTMLElement, ps) => el.focus({ preventScroll: ps }),
      preventScroll,
    );
    await expect(t).toBeFocused();
    await page.keyboard.press("Enter");
    return t;
  };

  switch (key) {
    case "dialog":
      await kb("Open Pack");
      return page.locator('[data-slot="dialog-content"]');
    case "alert-dialog":
      await kb("Sell All Cards");
      return page.getByRole("alertdialog");
    case "sheet":
      await kb("Filters");
      return page.locator('[data-slot="sheet-content"]');
    case "drawer":
      await kb("Card actions");
      return page.locator('[data-slot="drawer-content"]');
    case "popover":
      await kb("How odds work");
      return page.locator('[data-slot="popover-content"]');
    case "hover-card": {
      // Radix opens a hover card on trigger focus, which is the keyboard half
      // of "hover must not be the only route".
      const t = page.getByRole("button", { name: "Voidwing Ascendant" }).first();
      await t.evaluate(
        (el: HTMLElement, ps) => el.focus({ preventScroll: ps }),
        preventScroll,
      );
      const panel = page.locator('[data-slot="hover-card-content"]');
      await expect(panel).toBeVisible({ timeout: 10_000 });
      return panel;
    }
    case "tooltip": {
      const t = page.getByRole("button", { name: "Filters" });
      await expect
        .poll(
          async () => {
            await t.blur();
            await page.waitForTimeout(100);
            await t.focus();
            await page.waitForTimeout(400);
            return t.getAttribute("aria-describedby");
          },
          { timeout: 15_000 },
        )
        .not.toBeNull();
      return page.locator('[data-slot="tooltip-content"]').first();
    }
    case "dropdown-menu":
      await kb("voidwing");
      return page.locator('[data-slot="dropdown-menu-content"]');
    case "context-menu": {
      // Not "Right-click the Stash background": on the per-item context-menu
      // page that text is the `Panel` CAPTION, rendered outside the
      // `ContextMenuTrigger` — right-clicking it opens nothing. The trigger's
      // own text, inside it, is "Right-click the background".
      await page
        .getByText("Right-click the background", { exact: true })
        .click({ button: "right" });
      await page.evaluate(() => window.scrollTo(0, 0));
      return page.locator('[data-slot="context-menu-content"]');
    }
    case "menubar": {
      // A MenubarTrigger is `role="menuitem"`, not a button — Radix treats the
      // whole bar as one menu. `getByRole("button")` finds nothing.
      const t = page.getByRole("menuitem", { name: "View" }).first();
      await t.evaluate(
        (el: HTMLElement, ps) => el.focus({ preventScroll: ps }),
        preventScroll,
      );
      await page.keyboard.press("Enter");
      return page.locator('[data-slot="menubar-content"]');
    }
  }
}

/**
 * Wait until a panel's box stops moving.
 *
 * Measuring an overlay 250ms after it opens is measuring the animation. The
 * bottom-edge assertion caught the Drawer 10px past the fold on that timing;
 * measured at rest it sits exactly on 900 of 900, with its Close button ending
 * at 884. Two identical consecutive reads is the cheapest definition of "the
 * transition finished" that does not care which technology drove it —
 * `getAnimations()` covers Web Animations and misses vaul's CSS transition.
 */
async function settleBox(
  panel: ReturnType<Page["locator"]>,
  label: string,
) {
  let last = "";
  await expect
    .poll(
      async () => {
        const b = await panel.boundingBox();
        const now = b
          ? `${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.width)},${Math.round(b.height)}`
          : "";
        const stable = now !== "" && now === last;
        last = now;
        return stable;
      },
      {
        message: `${label}: the panel never stopped moving`,
        intervals: [120, 120, 120, 200, 200, 300],
        // A section that opens on hydration (every section after the Preview
        // is a `<details>` the suite's preference opens) grows for a moment
        // after load, and on the mobile project that moment outran the
        // default five seconds once. Ten is still "it settled", not "it never
        // moved".
        timeout: 10_000,
      },
    )
    .toBe(true);
}

test.describe("overlays", () => {
  test("every overlay is captured open, one image per component", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["desktop-dark", "desktop-light", "tablet", "mobile"].includes(
        testInfo.project.name,
      ),
      "one capture per viewport/theme project",
    );
    // Ten components, each opened and then reloaded away from — well past the
    // 30s default.
    test.setTimeout(180_000);

    /*
     * A TALL viewport, at the project's own width, and the page pinned to
     * scrollY 0 for every capture.
     *
     * The first attempt at these per-component images came back as slices of
     * empty background. Radix locks the page with `body { overflow: hidden }`
     * while an overlay is open, and a screenshot taken while `scrollY > 0`
     * under that lock composites from the document origin rather than from
     * what is on screen — the same artefact that spoiled the first round's
     * page-level shots. Scrolling back afterwards is impossible, because the
     * lock is already on.
     *
     * So for an ANCHORED overlay the height is raised until every trigger on
     * the page sits inside the first screen, and nothing ever scrolls. The
     * WIDTH is untouched, which is the axis the responsive claim rests on:
     * `mobile` still renders at 375.
     *
     * The four viewport-anchored modals keep the project's own height. They are
     * `position: fixed` and land centred or against an edge whatever the
     * trigger's position, so they need no help — and a Sheet or Drawer
     * photographed in a 2400px viewport would be a picture of a shape the user
     * never sees.
     */
    const vp = page.viewportSize()!;
    const MODAL = new Set(["dialog", "alert-dialog", "sheet", "drawer"]);

    for (const { key, url } of OVERLAY_CASES) {
      const modal = MODAL.has(key);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      if (!modal) {
        // Grow the viewport to the whole document, so an anchored trigger far
        // down the page is reachable WITHOUT scrolling.
        const tallEnough = await page.evaluate(() =>
          Math.min(document.documentElement.scrollHeight + 200, 30000),
        );
        await page.setViewportSize({ width: vp.width, height: tallEnough });
        await page.waitForLoadState("networkidle");
      }
      await page.evaluate(() => window.scrollTo(0, 0));

      const panel = await openOne(page, key, { preventScroll: true });
      await expect(panel).toBeVisible();
      /*
       * Settle before the shutter. The first round's `desktop-dark-menus.png`
       * caught the dropdown mid `zoom-in-95`, and the reading notes then
       * credited a dimmed item to the wrong component. Running every animation
       * to its end makes the image show the resting state.
       */
      await page.evaluate(() =>
        document.getAnimations().forEach((a) => {
          try {
            a.finish();
          } catch {
            /* an infinite animation cannot finish; leave it running */
          }
        }),
      );

      /*
       * Wait for the panel to actually be ON SCREEN before measuring it.
       * `getAnimations().finish()` settles Web Animations; vaul's Drawer slides
       * in on a CSS *transition*, which that call does not touch — so the first
       * drawer capture measured the panel while it was still translated below
       * the fold and saved a rectangle of empty background.
       */
      await expect
        .poll(
          async () => {
            const b = await panel.boundingBox();
            const h = page.viewportSize()!.height;
            return b ? b.y < h - 8 && b.y + b.height > 8 : false;
          },
          { message: `${key}: the panel never entered the viewport` },
        )
        .toBe(true);

      /*
       * Clip from the live rect with a margin, so the image shows the panel in
       * its surroundings rather than a bare crop — clamped to the viewport on
       * every side. An unclamped clip fails outright ("Clipped area is either
       * empty or outside the resulting image") for a panel that sits against an
       * edge, which is exactly where an anchored overlay likes to sit.
       */
      const box = (await panel.boundingBox())!;
      const tall = page.viewportSize()!;
      const pad = 24;
      const x = Math.max(0, Math.min(box.x - pad, tall.width - 1));
      const y = Math.max(0, Math.min(box.y - pad, tall.height - 1));
      await page.screenshot({
        path: path.join(OVERLAY_SHOTS, `${testInfo.project.name}-${key}.png`),
        clip: {
          x,
          y,
          width: Math.max(1, Math.min(box.width + pad * 2, tall.width - x)),
          height: Math.max(1, Math.min(box.height + pad * 2, tall.height - y)),
        },
      });

      await page.keyboard.press("Escape");
      await page.waitForTimeout(150);
      // Every iteration reloads at the top anyway, so nothing needs to be
      // un-done here: a modal's `pointer-events: none` never outlives the page.
    }
  });

  test("opening ANY overlay logs nothing to the console", async ({ page }) => {
    const noise: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        noise.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => noise.push(`pageerror: ${err.message}`));
    test.setTimeout(180_000);

    let current = "";
    for (const { key, url } of OVERLAY_CASES) {
      if (url !== current) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");
        current = url;
      }
      const panel = await openOne(page, key);
      await expect(panel).toBeVisible();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(150);
      await page.goto(url);
      await page.waitForLoadState("networkidle");
    }
    expect(noise, noise.join("\n")).toEqual([]);
  });

  test("EVERY open overlay stays inside the viewport", async ({ page }) => {
    test.setTimeout(180_000);
    /*
     * The generalisation of the 375px check, and it found one.
     *
     * A ContextMenu opens at the POINTER rather than against a trigger box, so
     * a right-click near the middle of a 375px screen put its right-hand edge
     * 54px past the viewport — measured x 189, width 240 — taking every
     * checkbox and radio indicator with it, because those sit at `right-3`.
     * Nothing caught it: the panel is inside a fixed popper wrapper, so it
     * never grows `document.scrollWidth`, and the page-level overflow test was
     * therefore blind to it. Radix's `collisionPadding` alone did not move the
     * panel; capping it with the primitive's own
     * `--radix-context-menu-content-available-width` did.
     */
    for (const { key, url } of OVERLAY_CASES) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const panel = await openOne(page, key);
      await expect(panel).toBeVisible();
      await settleBox(panel, key);

      const fit = await panel.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          // `clientWidth`, not `innerWidth`: `innerWidth` includes a classic
          // scrollbar, so a panel hidden underneath one would measure as
          // fitting. `clientHeight` is the same argument on the other axis.
          vw: document.documentElement.clientWidth,
          vh: document.documentElement.clientHeight,
          side: el.getAttribute("data-side"),
          transform: getComputedStyle(el).transform,
          scrollY: window.scrollY,
        };
      });
      expect(
        fit.right,
        `${key}: the open panel runs ${fit.right - fit.vw}px past the right edge`,
      ).toBeLessThanOrEqual(fit.vw + 1);
      expect(
        fit.left,
        `${key}: the open panel starts off the left edge`,
      ).toBeGreaterThanOrEqual(-1);
      expect(
        fit.bottom,
        `${key}: the open panel runs ${fit.bottom - fit.vh}px past the bottom edge`,
      ).toBeLessThanOrEqual(fit.vh + 1);
      expect(
        fit.top,
        `${key}: the open panel starts above the top edge (${JSON.stringify(fit)})`,
      ).toBeGreaterThanOrEqual(-1);
    }

    /*
     * And the OTHER context menu on the page. The one in OVERLAY_CASES is the
     * groups-and-labels panel; the card menu opens from a different point with
     * a wider set of items, and "a context menu fits" is a claim about where
     * the pointer is, not about one panel's contents.
     */
    await page.goto("/design-system/components/context-menu");
    await page.waitForLoadState("networkidle");
    // By slot, not by text: "Right-click me" also matches a Don't rule further
    // down the page, and the card menu is simply the first trigger.
    await page
      .locator('[data-slot="context-menu-trigger"]')
      .first()
      .click({ button: "right" });
    const card = page.locator('[data-slot="context-menu-content"]');
    await expect(card).toBeVisible();
    await settleBox(card, "card context menu");
    const cardFit = await card.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        bottom: Math.round(r.bottom),
        vw: document.documentElement.clientWidth,
        vh: document.documentElement.clientHeight,
      };
    });
    expect(
      cardFit.right,
      `card context menu runs ${cardFit.right - cardFit.vw}px past the right edge`,
    ).toBeLessThanOrEqual(cardFit.vw + 1);
    expect(cardFit.left).toBeGreaterThanOrEqual(-1);
    expect(cardFit.bottom).toBeLessThanOrEqual(cardFit.vh + 1);
  });

  test("AlertDialog: an explicitly clipped label still reaches its tooltip", async ({
    page,
  }, testInfo) => {
    /*
     * The Playwright half of the truncation contract, and the test a comment in
     * `dialog.test.tsx` once claimed existed when it did not.
     *
     * jsdom lays nothing out, so `useLabelIsTruncated` can never report true
     * there. This runs in a real layout against the `Clipped label` alert
     * dialog on the specimen — a narrow `size="sm"` panel whose two buttons
     * carry deliberately long consequences — and asserts the whole sequence:
     * the label really is clipped, focus reveals the full wording, and Escape
     * then unwinds the layers in the documented order.
     */
    await page.goto("/design-system/components/alert-dialog");
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Clipped label" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const alert = page.getByRole("alertdialog");
    await expect(alert).toBeVisible();

    const action = page.locator('[data-slot="alert-dialog-action"]');
    const full = "Settle $412.00 and close the account ending 4417";

    // 1. The label is genuinely clipped — this is the precondition the whole
    //    feature turns on, so it is asserted rather than assumed.
    const clipped = await action
      .locator('[data-slot="button-label"]')
      .evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
    expect(
      clipped.scrollWidth,
      `the specimen label is not actually clipped (${clipped.scrollWidth} in ${clipped.clientWidth}) — the test proves nothing`,
    ).toBeGreaterThan(clipped.clientWidth + 1);

    // 2. Keyboard focus reveals the full wording. RULES §5 asks for hover AND
    //    keyboard focus; focus is the half a pointer test would miss.
    await expect
      .poll(
        async () => {
          await action.blur();
          await page.waitForTimeout(100);
          await action.focus();
          await page.waitForTimeout(400);
          return action.getAttribute("aria-describedby");
        },
        { message: "focusing a clipped action never opened its tooltip", timeout: 15_000 },
      )
      .not.toBeNull();
    const tip = page.getByRole("tooltip").filter({ hasText: full });
    await expect(tip).toBeVisible();

    // 3. And the documented consequence: where a tooltip IS showing it is the
    //    topmost DismissableLayer, so the first Escape dismisses the tooltip
    //    and the second answers the dialog. That is correct behaviour, not the
    //    defect fixed in round 1 — there the tooltip appeared unbidden on a
    //    label that was never clipped.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    await expect(alert, "the first Escape should have gone to the tooltip").toBeVisible();

    await page.keyboard.press("Escape");
    await expect(alert).toHaveCount(0);
    await expect(trigger).toBeFocused();

    testInfo.annotations.push({
      type: "measured",
      description: `clipped action label ${clipped.scrollWidth} in ${clipped.clientWidth}; tooltip reached on focus; 2 Escapes to unwind`,
    });
  });

  test("Menubar's close animation and disabled dimming are live in the built app", async ({
    page,
  }) => {
    /*
     * Trap 13, from the expensive side. `data-closed:animate-out` and
     * `data-disabled:opacity-50` were added to `menubar.tsx` and asserted only
     * as class substrings in jsdom, which cannot tell a compiled utility from a
     * typo. These read the BUILT app.
     */
    await page.goto("/design-system/components/menubar");
    await page.waitForLoadState("networkidle");

    // A MenubarTrigger is `role="menuitem"`, not a button.
    const trigger = page.getByRole("menuitem", { name: "View" }).first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    const content = page.locator('[data-slot="menubar-content"]');
    await expect(content).toBeVisible();

    // 1. The disabled checkbox item is actually dimmed, not merely inert.
    const disabled = page.getByRole("menuitemcheckbox", {
      name: "Payout ledger",
    });
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    const opacity = await disabled.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity),
    );
    expect(
      opacity,
      "data-disabled:opacity-50 did not resolve — the class is dead",
    ).toBeLessThan(0.75);

    // 2. The exit animation exists. Capture at the moment `data-state` flips,
    //    because Radix unmounts the node as soon as the animation ends.
    const exit = await content.evaluate(
      (el) =>
        new Promise<string>((resolve) => {
          const observer = new MutationObserver(() => {
            if (el.getAttribute("data-state") === "closed") {
              observer.disconnect();
              resolve(getComputedStyle(el).animationName);
            }
          });
          observer.observe(el, {
            attributes: true,
            attributeFilter: ["data-state"],
          });
          setTimeout(() => {
            observer.disconnect();
            resolve("__never-closed__");
          }, 4000);
          (document.activeElement as HTMLElement | null)?.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Escape",
              bubbles: true,
              cancelable: true,
            }),
          );
        }),
    );
    expect(
      exit,
      "data-closed:animate-out did not resolve on MenubarContent",
    ).not.toBe("none");
    expect(exit).not.toBe("__never-closed__");
  });

  test("every popover a specimen opens carries an accessible name", async ({
    page,
  }) => {
    /*
     * The regression guard for the `aria-dialog-name` fix. A `PopoverContent`
     * is `role="dialog"`, and one on the selects route — the date picker
     * wrapping a Calendar — was still anonymous after the popover wiring
     * landed, while the ledger said `accessibility: complete`. Naming the
     * component is not enough; a call site can still forget.
     */
    const cases = [
      {
        url: "/design-system/components/calendar",
        // Addressed by id: the trigger's label changes to the picked date once
        // anything is selected, so a name-based locator is state-dependent.
        // The old grouped page's id was `picker-empty`; the per-item Date
        // Picker specimen carries the same trigger as `picker-demo`.
        selector: "#picker-demo",
        name: "Choose a date",
      },
      {
        url: "/design-system/components/popover",
        // Not `[data-slot="popover-trigger"]`: `PopoverTrigger asChild`
        // hands its props to Radix's `Slot`, which lets the child's OWN
        // `data-slot` win — `Button` sets `data-slot="button"` on the
        // rendered element, so the parent's `data-slot="popover-trigger"`
        // never reaches the DOM. Addressed by role and name instead, which
        // is what the trigger actually renders as.
        selector: 'role=button[name="How odds work"]',
        name: "Per-card odds",
      },
      {
        url: "/design-system/components/popover",
        selector: 'role=button[name="Quick sort"]',
        name: "Quick sort options",
      },
    ];

    for (const c of cases) {
      await page.goto(c.url);
      await page.waitForLoadState("networkidle");
      const trigger = page.locator(c.selector).first();
      await trigger.click();

      const panel = page.locator('[data-slot="popover-content"]');
      await expect(panel).toBeVisible();
      await expect(
        panel,
        `${c.url}: an open popover with no accessible name`,
      ).toHaveAccessibleName(c.name);

      await page.keyboard.press("Escape");
    }

    // And nothing anonymous is left: an open popover must resolve a name by
    // some route, whichever one the call site chose.
    await page.goto("/design-system/components/calendar");
    await page.waitForLoadState("networkidle");
    const anonymous = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-slot="popover-content"]'))
        .filter(
          (el) =>
            !el.getAttribute("aria-label") &&
            !el.getAttribute("aria-labelledby"),
        )
        .map((el) => (el.getAttribute("class") ?? "").slice(0, 80)),
    );
    expect(anonymous, anonymous.join("\n")).toEqual([]);
  });
});

/* â”€â”€ Batch 3 â€” navigation, feedback, chat and data display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/*
 * `base/navigation`, `base/feedback`, `base/chat` and `base/data` were
 * deleted; each old grouped route is represented below by one per-item route
 * from `.tmp/route-map.md` (navigation -> accordion, feedback -> toaster,
 * chat -> message, data -> table) — the same "one page per former category"
 * breadth the old array gave these sweeps.
 */
const DISPLAY_PAGES = [
  "/design-system/components/accordion",
  "/design-system/components/toaster",
  "/design-system/components/message",
  "/design-system/components/table",
];

const DISPLAY_SHOTS = path.join(
  process.cwd(),
  "test-results/screenshots/display",
);

/**
 * A representative page state, reached the way a reader would reach it.
 *
 * The reduced-motion sweep and the screenshots both need MORE than the resting
 * page, because a state that is only reachable by acting is exactly the state a
 * static capture misses. On the accordion page that is a disclosure open.
 * The toaster page's Preview has a live trigger, exercised in the dedicated
 * toast tests; this broad page sweep captures its resting documentation.
 * Message and table carry their relevant surfaces at rest.
 */
async function openDisplayState(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => window.scrollTo(0, 0));

  if (url.endsWith("/accordion")) {
    /* `.nth(1)`, not `.first()`. The FAQ accordion ships
       `defaultValue="odds"`, so the first trigger is already expanded when the
       page loads — pressing Enter on it CLOSES the disclosure, which is the
       opposite of the state this helper exists to reach. Found by the first
       run of this block failing in all five projects at once. */
    const trigger = page.locator('[data-slot="accordion-trigger"]').nth(1);
    await expect(trigger).toBeVisible();
    // Keyboard, not a click: the disclosure's activation key is the claim.
    await trigger.focus({ timeout: 5_000 });
    await page.keyboard.press("Enter");
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");
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

  /*
   * Wait for the page to stop MOVING, not just for the state to be reached.
   *
   * `styles/tokens.css` sets `scroll-behavior: smooth` on the document, and
   * `trigger.focus()` scrolls the disclosure into view — so the first round of
   * these captures photographed the navigation page mid-flight and came back
   * as 1440x900 of flat black, with even the fixed nav rail missing. The state
   * was correct; the frame was not. `getAnimations().finish()` does not touch
   * a smooth scroll, and neither does a fixed wait under load.
   *
   * This is the third distinct way a screenshot has lied in this audit — after
   * batch 2's scroll-locked modal compositing from the document origin, and
   * its capture caught mid `zoom-in-95`.
   */
  let last = -1;
  for (let i = 0; i < 20; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (y === last) break;
    last = y;
    await page.waitForTimeout(100);
  }
}

test.describe("display", () => {
  test("Tabs: the arrows move the selection and the pill travels with it", async ({
    page,
  }) => {
    await page.goto("/design-system/components/tabs");
    await page.waitForLoadState("networkidle");

    const list = page.locator('[data-slot="tabs-list"]').first();
    const tabs = list.locator('[data-slot="tabs-trigger"]');
    const first = tabs.first();

    // Poll, not a bare focus(): `networkidle` is not hydration, and a keypress
    // that lands before React attaches its handler is never re-evaluated.
    await expect.poll(async () => (await tabs.count()) >= 2).toBe(true);
    await first.focus();
    await expect
      .poll(() => first.evaluate((el) => el === document.activeElement))
      .toBe(true);

    const pillBefore = await list.locator(".toggle-slide").boundingBox();
    expect(await first.getAttribute("aria-selected")).toBe("true");
    const firstLabel = (await first.textContent())?.trim();

    await page.keyboard.press("ArrowRight");
    // Assert the selection MOVED rather than where it landed â€” batch 2's
    // concern 4: Radix's roving-focus landing item differs by project.
    await expect
      .poll(async () =>
        (
          await list
            .locator('[data-slot="tabs-trigger"][aria-selected="true"]')
            .first()
            .textContent()
        )?.trim(),
      )
      .not.toBe(firstLabel);

    await settleBox(list.locator(".toggle-slide"), "tabs pill");
    const pillAfter = await list.locator(".toggle-slide").boundingBox();
    // It TRAVELLED: one pill, in a different place. Not two backgrounds
    // blinking â€” RULES Â§4, "Selection travels, it does not blink".
    expect(await list.locator(".toggle-slide").count()).toBe(1);
    expect(Math.round(pillAfter!.x)).not.toBe(Math.round(pillBefore!.x));
  });

  test("Accordion: Enter toggles it, and the height really animates", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/accordion");
    await page.waitForLoadState("networkidle");

    // The second item — the first is open by default (see `openDisplayState`).
    const trigger = page.locator('[data-slot="accordion-trigger"]').nth(1);
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("false");

    await page.keyboard.press("Enter");
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");

    // Addressed by slot rather than by the id in `aria-controls`: `CSS.escape`
    // does not exist in the Node process the test body runs in, and Radix's
    // generated ids need escaping. The association itself is asserted in the
    // unit suite, where the whole DOM is in hand.
    expect(await trigger.getAttribute("aria-controls")).toBeTruthy();
    const content = page
      .locator('[data-slot="accordion-item"]')
      .nth(1)
      .locator('[data-slot="accordion-content"]');
    await settleBox(content, "accordion content");
    const open = await content.boundingBox();
    expect(open!.height).toBeGreaterThan(0);

    // The height is animated by a named utility rather than by a jump. Read
    // live, because a class string cannot tell a compiled utility from a typo.
    const anim = await content.evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    testInfo.annotations.push({
      type: "accordion",
      description: `open ${Math.round(open!.height)}px, animation ${anim}`,
    });
    if (testInfo.project.name !== "reduced-motion") {
      expect(anim).not.toBe("none");
    }

    await page.keyboard.press("Enter");
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("false");
    // Reduced motion or not, it resolves fully closed.
    await expect(content).toBeHidden();
  });

  test("Pagination: the end that cannot act is inert and out of the tab order", async ({
    page,
  }) => {
    await page.goto("/design-system/components/pagination");
    await page.waitForLoadState("networkidle");

    const disabled = page.locator(
      '[data-slot="pagination-link"][data-disabled="true"]',
    );
    await expect(disabled).toHaveCount(1);
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await expect(disabled).toHaveJSProperty("tabIndex", -1);
    // No href â€” which is what takes it out of the link activation path â€” and
    // still `role="link"`, so it is announced rather than vanishing.
    expect(await disabled.getAttribute("href")).toBeNull();
    await expect(disabled).toHaveAttribute("role", "link");
    expect(
      await disabled.evaluate((el) => getComputedStyle(el).pointerEvents),
    ).toBe("none");
  });

  test("Carousel: the arrow keys move it and the dead arrow is disabled", async ({
    page,
  }) => {
    /* The `carousel` page, not `data`. The audit ledger listed the `data`
       route for this row and the specimen has never been there — the first
       run of this test skipped in all five projects, which is what found it.
       The ledger row is corrected; the specimen was always fine. */
    await page.goto("/design-system/components/carousel");
    await page.waitForLoadState("networkidle");

    const carousel = page.locator('[data-slot="carousel"]').first();
    await expect(carousel).toBeVisible();

    const prev = carousel.locator('[data-slot="carousel-previous"]');
    const next = carousel.locator('[data-slot="carousel-next"]');
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    for (const name of ["Previous slide", "Next slide"]) {
      await expect(carousel.getByRole("button", { name })).toHaveCount(1);
    }

    const firstSlide = carousel.locator('[data-slot="carousel-item"]').first();
    const before = (await firstSlide.boundingBox())!.x;
    await next.click();
    await settleBox(firstSlide, "carousel slide");
    expect((await firstSlide.boundingBox())!.x).toBeLessThan(before);
    await expect(prev).toBeEnabled();
  });

  test("Toast: it appears as a live status, blooms on hover, and dismisses", async ({
    page,
  }, testInfo) => {
    /* Sonner pauses its own dismiss timer while the pointer is over the toast,
       so this test spends the full 4s duration AFTER the hover measurement
       before the toast can leave. The default 30s budget was not enough on one
       project out of five — a timeout that says nothing about the component. */
    test.setTimeout(90_000);
    /*
     * The toaster page's Preview fires a real sonner toast; its Variants
     * section separately renders at-rest specimens for visual comparison.
     */
    await page.goto("/design-system/components/toaster");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Sell 3 cards" }).click();
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await settleBox(toast, "toast");

    // It is in a live region â€” the announcement, not just the pixels.
    expect(await toast.evaluate((el) => !!el.closest("[aria-live]"))).toBe(true);

    /* Trap 5: sonner injects its own `[data-sonner-toast][data-styled=true]`
       rules into <head> at runtime, UNLAYERED, so a layered `.cn-toast` loses
       on source order with no error. Reading the reclaimed values off the live
       toast is the only thing that proves the reclaim held. */
    const reclaimed = await toast.evaluate((el) => {
      const s = getComputedStyle(el);
      const before = getComputedStyle(el, "::before");
      return {
        radius: s.borderTopLeftRadius,
        font: s.fontFamily,
        size: s.fontSize,
        bloomBefore: before.backgroundImage,
        bloomAnim: before.animationName,
      };
    });
    // Sonner's own default is 13px on a system stack. Ours is the `small`
    // role — which at the tablet step IS 13px since the Flutter type scale
    // landed, so "not 13px" stopped proving anything. Compare against the
    // token resolved from the same document instead.
    const smallSize = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.className = "type-small";
      document.body.appendChild(probe);
      const v = getComputedStyle(probe).fontSize;
      probe.remove();
      return v;
    });
    expect(reclaimed.size).toBe(smallSize);
    expect(reclaimed.font.toLowerCase()).toContain("inter");
    expect(reclaimed.bloomBefore).not.toBe("none");

    // The bloom SWELLS on hover â€” and it must still be there afterwards.
    const scaleAtRest = await toast.evaluate(
      (el) => getComputedStyle(el, "::before").scale,
    );
    /* `page.mouse.move` to the measured centre, NOT `toast.hover()`.
       `hover()` waits for actionability, and "stable" means the same bounding
       box across two consecutive frames — a sonner toast carries a transform
       transition for its stack offset, and under a loaded four-worker run that
       wait never resolved. It has no timeout of its own, so it consumed the
       whole test budget and reported a bare "test timeout" that said nothing
       about the toast. It passed serially in all five projects every time,
       which is the signature. Nothing about the hover being tested changes:
       the pointer really moves onto the toast. */
    const box = (await toast.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(400);
    const scaleHovered = await toast.evaluate(
      (el) => getComputedStyle(el, "::before").scale,
    );
    testInfo.annotations.push({
      type: "toast",
      description: `radius ${reclaimed.radius}, font-size ${reclaimed.size}, bloom ${reclaimed.bloomAnim}, scale ${scaleAtRest} -> ${scaleHovered}`,
    });
    // Still blooming after the hover â€” the reclaim survives the interaction.
    expect(
      await toast.evaluate(
        (el) => getComputedStyle(el, "::before").backgroundImage,
      ),
    ).not.toBe("none");

    const close = toast.locator("[data-close-button]");
    if (await close.count()) {
      await close.click();
    } else {
      await page.mouse.move(0, 0);
    }
    await expect
      .poll(() => page.locator("[data-sonner-toast]").count(), {
        timeout: 20_000,
      })
      .toBe(0);
  });

  test("Progress: the indeterminate bar draws something, and claims no value", async ({
    page,
  }, testInfo) => {
    await page.goto("/design-system/components/progress");
    await page.waitForLoadState("networkidle");

    const bar = page.getByRole("progressbar", { name: "Contacting the vault" });
    await expect(bar).toBeVisible();
    expect(await bar.getAttribute("aria-valuenow")).toBeNull();

    const indicator = bar.locator('[data-slot="progress-indicator"]');
    const box = (await indicator.boundingBox())!;
    const track = (await bar.boundingBox())!;
    // Visible, and a sliver rather than a reading.
    expect(box.width).toBeGreaterThan(0);
    expect(box.width).toBeLessThan(track.width);

    const anim = await indicator.evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    testInfo.annotations.push({
      type: "progress",
      description: `indeterminate sliver ${Math.round(box.width)} of ${Math.round(track.width)}, animation ${anim}`,
    });
    if (testInfo.project.name === "reduced-motion") {
      // Stopped, but still there â€” the HANDLED entry in styles/motion.css.
      expect(anim).toBe("none");
      expect(await indicator.evaluate((el) => getComputedStyle(el).opacity)).toBe(
        "1",
      );
    } else {
      expect(anim).not.toBe("none");
    }
  });

  test("Spinner: the announcement it always claimed is actually in the tree", async ({
    page,
  }) => {
    await page.goto("/design-system/components/spinner");
    await page.waitForLoadState("networkidle");
    // The Preview is a real pending action now: the spinner mounts only
    // while the withdrawal is genuinely in flight, so start it first.
    await page.getByRole("button", { name: "Request" }).first().click();
    await expect(
      page.getByRole("status", { name: "Requesting withdrawal" }),
    ).toHaveCount(1);
    // And the decorative ones stay out of it.
    expect(
      await page.locator('[data-slot="spinner"][aria-hidden="true"]').count(),
    ).toBeGreaterThan(0);
  });

  test("Alert: the five tones announce at the right urgency", async ({
    page,
  }) => {
    await page.goto("/design-system/components/alert");
    await page.waitForLoadState("networkidle");

    const roles = await page
      .locator('[data-slot="alert"]')
      .evaluateAll((els) =>
        els.map((el) => {
          const cls = el.getAttribute("class") ?? "";
          return {
            role: el.getAttribute("role"),
            assertive:
              cls.includes("destructive-ink") || cls.includes("warning-ink"),
          };
        }),
      );
    expect(roles.length).toBeGreaterThan(0);
    for (const r of roles) {
      expect(r.role).toBe(r.assertive ? "alert" : "status");
    }
  });

  test("Badge grew out of its own fixed height", async ({ page }, testInfo) => {
    await page.goto("/design-system/components/badge");
    await page.waitForLoadState("networkidle");

    const badge = page.locator('[data-slot="badge"]').first();
    await expect(badge).toBeVisible();
    const m = await badge.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      // The role's own size, resolved from the same document at the same
      // width, so the assertion follows the token instead of pinning a
      // number the type scale has since moved past (it was 14; Flutter
      // 0.0.3's `badge` is 10 / 11 / 12 and the tokens now match it).
      const probe = document.createElement("span");
      probe.className = "type-badge";
      document.body.appendChild(probe);
      const roleSize = getComputedStyle(probe).fontSize;
      probe.remove();
      return {
        height: Math.round(r.height),
        lineHeight: s.lineHeight,
        fontSize: s.fontSize,
        roleSize,
      };
    });
    testInfo.annotations.push({
      type: "badge",
      description: `${m.height}px box, ${m.fontSize}/${m.lineHeight} type`,
    });
    // The old `h-5` clipped the badge's own text by 2px. A minimum lets the
    // role decide, and the badge must be wearing the role.
    expect(m.fontSize).toBe(m.roleSize);
    expect(m.height).toBeGreaterThanOrEqual(parseFloat(m.lineHeight));
  });

  test("the 44px floor, measured on every batch-3 target that has one", async ({
    page,
  }, testInfo) => {
    const read = async (
      locator: ReturnType<Page["locator"]>,
      label: string,
    ) => {
      await expect(locator).toBeVisible();
      const box = (await locator.boundingBox())!;
      testInfo.annotations.push({
        type: "target",
        description: `${label} ${Math.round(box.width)}x${Math.round(box.height)}`,
      });
      return box;
    };

    await page.goto("/design-system/components/tabs");
    await page.waitForLoadState("networkidle");
    const tab = await read(
      page.locator('[data-slot="tabs-trigger"]').first(),
      "tabs trigger",
    );

    await page.goto("/design-system/components/pagination");
    await page.waitForLoadState("networkidle");
    const pager = await read(
      page.locator('[data-slot="pagination-link"]').first(),
      "pagination link",
    );

    await page.goto("/design-system/components/navigation-menu");
    await page.waitForLoadState("networkidle");
    const navTrigger = await read(
      page.locator('[data-slot="navigation-menu-trigger"]').first(),
      "navigation-menu trigger",
    );

    await page.goto("/design-system/components/kbd");
    await page.waitForLoadState("networkidle");
    await read(page.locator('[data-slot="kbd"]:visible').first(), "kbd");

    // Recorded rather than asserted: the tab trigger is 32px on a 40px track —
    // the SAME 8-point geometry the audit already parked as an owner decision
    // for the 224x36 menu row. Asserting 44 here would decide it unilaterally.
    expect(tab.height).toBeGreaterThan(0);
    expect(pager.height).toBeGreaterThan(0);
    expect(navTrigger.height).toBeGreaterThanOrEqual(40);
  });

  test("every open NavigationMenu panel stays inside the viewport", async ({
    page,
  }, testInfo) => {
    /*
     * The generalisation, not the instance — batch 2 learned this on the
     * ContextMenu and this batch hit the same class of bug on the other side
     * of the system.
     *
     * An open panel measured **576px wide, x -6 to 570, on a 375px screen**,
     * 195px of it past the right edge. The page-level overflow test could not
     * see it: the panel lives in an absolutely-positioned wrapper, so it never
     * grows `document.scrollWidth`. Photographing it open is what found it.
     */
    await page.goto("/design-system/components/navigation-menu");
    await page.waitForLoadState("networkidle");

    const triggers = page.locator('[data-slot="navigation-menu-trigger"]');
    const n = await triggers.count();
    expect(n).toBeGreaterThan(0);

    for (let i = 0; i < n; i++) {
      const trigger = triggers.nth(i);
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");

      /* Addressed through the trigger's OWN `aria-controls`, not by "the first
         open content on the page". The navigation specimen carries three
         separate `NavigationMenu` roots, and a viewport menu portals its
         content out of the item — so `.first()` handed back a panel belonging
         to a different menu, or none at all, and `settleBox` waited forever on
         a null box in all five projects. */
      const contentId = await trigger.getAttribute("aria-controls");
      expect(contentId, "the trigger names no content").toBeTruthy();
      const panel = page.locator(`[id="${contentId}"]`);
      await expect(panel).toBeVisible();
      // The viewport resizes between triggers on a transition, which is not a
      // Web Animation; finish what can be finished, then wait for the box.
      await page.evaluate(() =>
        document.getAnimations().forEach((a) => {
          try {
            a.finish();
          } catch {
            /* infinite */
          }
        }),
      );
      await settleBox(panel, `navigation-menu panel ${i}`);
      const box = (await panel.boundingBox())!;
      const vw = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      testInfo.annotations.push({
        type: "nav-menu panel",
        description: `#${i} x ${Math.round(box.x)} w ${Math.round(box.width)} right ${Math.round(box.x + box.width)} of ${vw}`,
      });
      expect(Math.round(box.x), `panel ${i} runs off the left`).toBeGreaterThanOrEqual(-1);
      expect(
        Math.round(box.x + box.width),
        `panel ${i} runs off the right`,
      ).toBeLessThanOrEqual(vw + 1);

      await page.keyboard.press("Escape");
      await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("false");
    }
  });

  test("the UserMenu account menu opens inside the viewport", async ({
    page,
  }, testInfo) => {
    /*
     * The third panel this batch found running off the screen, and the third
     * time the same structural blindness hid it: a portalled, fixed-position
     * menu never grows `document.scrollWidth`.
     *
     * Measured on the sidebar specimen at 768: **694px wide starting at x 735**
     * — it began 33px OUTSIDE the viewport and ran to 1429, leaving a strip of
     * icons on screen. `useIsMobile` is false at exactly 768, so `side="right"`
     * applied with nothing like enough room, and Radix could not flip or shift
     * because the panel did not fit on either side. The width came from
     * `--radix-dropdown-menu-trigger-width` — the sidebar ROW's width — with no
     * bound on it.
     */
    await page.goto("/design-system/components/user-menu");
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: /Ayoub Elattar/ }).first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await page.keyboard.press("Enter");

    const menu = page.getByRole("menu").first();
    await expect(menu).toBeVisible();
    await settleBox(menu, "nav-user menu");

    const box = (await menu.boundingBox())!;
    const vw = await page.evaluate(() => document.documentElement.clientWidth);
    testInfo.annotations.push({
      type: "nav-user menu",
      description: `x ${Math.round(box.x)} w ${Math.round(box.width)} right ${Math.round(box.x + box.width)} of ${vw}`,
    });
    expect(Math.round(box.x), "the account menu runs off the left").toBeGreaterThanOrEqual(-1);
    expect(
      Math.round(box.x + box.width),
      "the account menu runs off the right",
    ).toBeLessThanOrEqual(vw + 1);

    // And every item is really readable, not a column of glyphs.
    for (const label of ["Account", "Billing", "Notifications", "Sign out"]) {
      await expect(menu.getByRole("menuitem", { name: label })).toBeVisible();
    }
  });

  test("the Item list has members, not just a list role", async ({ page }) => {
    await page.goto("/design-system/components/item");
    await page.waitForLoadState("networkidle");
    const group = page.locator('[data-slot="item-group"]').first();
    await expect(group).toHaveAttribute("role", "list");
    expect(await group.locator('[role="listitem"]').count()).toBeGreaterThan(0);
  });

  test("the table scrolls itself; the PAGE never scrolls sideways", async ({
    page,
  }, testInfo) => {
    for (const url of DISPLAY_PAGES) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      // Scroll every table container to its end first: a container that
      // scrolls its content is the contract, and doing it is what proves the
      // page does not move with it.
      const scrolled = await page.evaluate(() => {
        let n = 0;
        for (const el of Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-slot="table-container"]',
          ),
        )) {
          el.scrollLeft = el.scrollWidth;
          if (el.scrollLeft > 0) n++;
        }
        return n;
      });

      const { scrollWidth, innerWidth, widest } =
        await noHorizontalOverflow(page);
      testInfo.annotations.push({
        type: "display overflow",
        description: `${url} â€” ${scrollWidth} vs ${innerWidth}, ${scrolled} table(s) scrolled${widest.tag ? `, widest ${widest.tag} ${widest.width}` : ""}`,
      });
      expect(
        scrollWidth,
        `${url} scrolls sideways; widest: ${widest.tag}.${widest.cls} (${widest.width}px)`,
      ).toBeLessThanOrEqual(innerWidth + 1);
    }
  });

  test("nothing on these four pages logs to the console on a fresh load", async ({
    page,
  }) => {
    const noise: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        noise.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => noise.push(`pageerror: ${err.message}`));

    // Fresh navigation each time. A hydration mismatch â€” trap 16, a timestamp
    // or a number formatted with the server's locale â€” is a console error and
    // is exactly what this is here to catch.
    for (const url of DISPLAY_PAGES) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(300);
    }
    expect(noise, noise.join("\n")).toEqual([]);
  });

  test("reduced motion leaves nothing invisible on the four display pages", async ({
    browser,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "only meaningful under prefers-reduced-motion: reduce",
    );
    test.setTimeout(180_000);

    const seed = (ctx: import("@playwright/test").BrowserContext) =>
      ctx.addInitScript(() => window.localStorage.setItem("theme", "dark"));

    const normal = await browser.newContext({
      reducedMotion: "no-preference",
      colorScheme: "dark",
      viewport: { width: 1280, height: 800 },
    });
    await seed(normal);
    const reduced = await browser.newContext({
      reducedMotion: "reduce",
      colorScheme: "dark",
      viewport: { width: 1280, height: 800 },
    });
    await seed(reduced);

    let checked = 0;
    try {
      for (const url of DISPLAY_PAGES) {
        const settle = async (p: Page) => {
          await openDisplayState(p, url);
          await p.waitForTimeout(300);
        };

        const a = await normal.newPage();
        await settle(a);
        const expected = (await a.evaluate(collectAnimated)).filter(
          (x) => x.visible,
        );
        await a.close();

        const b = await reduced.newPage();
        await settle(b);
        // Retry until the set stays gone: `ActiveIndicator` ships `w-0` and is
        // sized by an effect, so a single read can catch a pill mid-measure.
        // Something genuinely hidden never comes back.
        let gone: string[] = [];
        for (let i = 0; i < 6; i++) {
          gone = await b.evaluate(checkStillVisible, expected);
          if (gone.length === 0) break;
          await b.waitForTimeout(200);
        }
        await b.close();

        checked += expected.length;
        expect(
          gone,
          `${url}: reduced motion hid ${gone.length} animated element(s):\n${gone.join("\n")}`,
        ).toEqual([]);
      }
    } finally {
      await normal.close();
      await reduced.close();
    }

    testInfo.annotations.push({
      type: "reduced motion",
      description: `${checked} animated elements checked across ${DISPLAY_PAGES.length} display pages, in their busiest state`,
    });
    expect(checked).toBeGreaterThan(0);
  });

  test("display specimen screenshots, in the page's busiest state", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["desktop-dark", "desktop-light", "tablet", "mobile"].includes(
        testInfo.project.name,
      ),
      "one capture per viewport/theme project",
    );
    test.setTimeout(180_000);

    for (const url of DISPLAY_PAGES) {
      const name = url.split("/").pop();
      await openDisplayState(page, url);
      await page.screenshot({
        path: path.join(DISPLAY_SHOTS, `${testInfo.project.name}-${name}.png`),
        fullPage: false,
      });
    }
  });

  /**
   * The states a viewport-height screenshot of the page top cannot show.
   *
   * Batch 2's lesson, applied: a component photographed open is a different
   * check from a component asserted open, and only the first found the
   * ContextMenu running off a 375px screen.
   */
  test("per-component captures: the states a page shot cannot reach", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["desktop-dark", "desktop-light", "tablet", "mobile"].includes(
        testInfo.project.name,
      ),
      "one capture per viewport/theme project",
    );
    test.setTimeout(180_000);

    const shot = async (key: string, locator: ReturnType<Page["locator"]>) => {
      await settleBox(locator, key);
      await locator.screenshot({
        path: path.join(DISPLAY_SHOTS, `${testInfo.project.name}-${key}.png`),
      });
    };

    // 1. Toast — fire the real Preview action, then capture sonner's live panel.
    await page.goto("/design-system/components/toaster");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Sell 3 cards" }).click();
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await shot("toast", toast);

    // 2. The five alert tones, in one frame.
    await page.goto("/design-system/components/alert");
    await page.waitForLoadState("networkidle");
    /* The `#variants` SECTION, not the first `[data-slot="alert"]` on the
       page. The first alert is the one in the `States` matrix further down,
       and the first capture came back as a single state cell rather than the
       five tones this row's `visual` claim is about. `DsSection` renders its
       `id` on a real `<section>`, so the anchor is the reliable address —
       "Variants" is where the per-item alert page renders all five. */
    await shot("alerts", page.locator("section#variants"));

    // 3. The indeterminate progress sliver — the per-item progress page's
    //    "Examples" section.
    await page.goto("/design-system/components/progress");
    await page.waitForLoadState("networkidle");
    await shot(
      "progress-indeterminate",
      page.locator("section#examples"),
    );

    // 4. Accordion open â€” the disclosure's other half.
    await page.goto("/design-system/components/accordion");
    await page.waitForLoadState("networkidle");
    const trigger = page.locator('[data-slot="accordion-trigger"]').nth(1);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");
    await shot("accordion-open", page.locator('[data-slot="accordion"]').first());

    // 5. The disabled pager end — the per-item pagination page's "Examples"
    //    section.
    await page.goto("/design-system/components/pagination");
    await page.waitForLoadState("networkidle");
    await shot(
      "pagination-disabled",
      page.locator("section#examples"),
    );

    // 6. The navigation menu panel open, from the keyboard.
    await page.goto("/design-system/components/navigation-menu");
    await page.waitForLoadState("networkidle");
    const navTrigger = page
      .locator('[data-slot="navigation-menu-trigger"]')
      .first();
    if (await navTrigger.count()) {
      await navTrigger.focus();
      await page.keyboard.press("Enter");
      await expect
        .poll(() => navTrigger.getAttribute("aria-expanded"))
        .toBe("true");
      /* The CONTENT, addressed through the trigger's own `aria-controls` —
         not the viewport. Below `md` the viewport is a measured container that
         can be transparent at the moment of capture, and the first round of
         these images came back showing the page underneath rather than a
         panel. The content is the panel. */
      const navContentId = await navTrigger.getAttribute("aria-controls");
      await shot(
        "navigation-menu-open",
        page.locator(`[id="${navContentId}"]`),
      );
    }

    // 7. The table, scrolled to its far edge â€” the state that proves the
    //    container moves and the page does not.
    await page.goto("/design-system/components/table");
    await page.waitForLoadState("networkidle");
    const container = page.locator('[data-slot="table-container"]').first();
    await container.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
    });
    await shot("table-scrolled", container);

    // 8. Stat's states, side by side — the per-item stat page's "States"
    //    section.
    await page.goto("/design-system/components/stat");
    await page.waitForLoadState("networkidle");
    await shot(
      "stat-states",
      page.locator("section#states"),
    );

    // 9. The chat surfaces, each now its own per-item page.
    await page.goto("/design-system/components/message");
    await page.waitForLoadState("networkidle");
    await shot("message", page.locator('[data-slot="message-group"]').first());

    await page.goto("/design-system/components/attachment");
    await page.waitForLoadState("networkidle");
    await shot(
      "attachment-states",
      page.locator("section#states"),
    );

    await page.goto("/design-system/components/bubble");
    await page.waitForLoadState("networkidle");
    await shot("bubble", page.locator('[data-slot="bubble"]').first());

    await page.goto("/design-system/components/message-scroller");
    await page.waitForLoadState("networkidle");
    await shot(
      "message-scroller",
      page.locator('[data-slot="message-scroller"]').first(),
    );

    /* 10 and 11. Two batch-3 rows whose specimens live on OTHER batches' pages
       — `Kbd` and `UserMenu` each have their own per-item route now. Captured
       here so this batch's `visual` claim rests on an image of the component
       rather than on the four display-page shots that never show them. */
    await page.goto("/design-system/components/kbd");
    await page.waitForLoadState("networkidle");
    await shot("kbd", page.locator('[data-slot="kbd-group"]').first());

    // 12. The carousel, whose specimen is on its own `carousel` page. Captured
    //     here so this batch's `visual` claim rests on an image of the
    //     component rather than on the four page shots that never show it.
    await page.goto("/design-system/components/carousel");
    await page.waitForLoadState("networkidle");
    await shot("carousel", page.locator('[data-slot="carousel"]').first());

    await page.goto("/design-system/components/user-menu");
    await page.waitForLoadState("networkidle");
    const userMenu = page
      .getByRole("button", { name: /Ayoub Elattar/ })
      .first();
    await expect(userMenu).toBeVisible();
    await shot("user-menu", userMenu);
    // And again with its menu open, which is the state the row is about.
    await userMenu.focus();
    await page.keyboard.press("Enter");
    const accountMenu = page.getByRole("menu").first();
    await expect(accountMenu).toBeVisible();
    await shot("nav-user-open", accountMenu);
  });
});


/**
 * Defects the per-capability convergence audit found, pinned so they stay fixed.
 *
 * These are the ones that only a real, focused browser can assert. A unit test
 * can see that a class string contains `has-[[data-slot=command-input]:...]`;
 * it cannot see whether the rule the class compiles to actually paints, and the
 * first version of the command palette's focus ring was a rule that compiled
 * perfectly and matched nothing.
 */
test.describe("audit regressions", () => {
  test("the command palette's search field paints a focus ring", async ({ page }) => {
    await page.goto("/design-system/components/command");

    /*
     * `defaultOpen` was removed from this specimen for the same reason
     * `dialog`'s Preview never used it either — see
     * `components/docs/component-docs/command/palette-specimen.tsx`: a modal
     * mounted open puts `pointer-events: none` on the body and takes the
     * whole article with it. `CommandPaletteSpecimen` now opens from a real
     * "Open the palette" button (or ⌘J) instead, which is what a reader — and
     * this test — has to press first.
     */
    // Wait for hydration before pressing the opener. A click that lands
    // before React attaches the handler opens nothing, and the dialog wait
    // below then runs out the clock — three projects out of five did exactly
    // that on the retargeted page, with the component itself fine.
    await page.waitForLoadState("networkidle");
    const opener = page.getByRole("button", { name: "Open the palette" });
    await expect(opener).toBeVisible();
    // `networkidle` is not hydration. Press until the dialog is there: the
    // opener only ever opens (it does not toggle), so a repeat is harmless,
    // and the reduced-motion project still raced a single press once.
    await expect
      .poll(
        async () => {
          await opener.click();
          return page.locator('[role="dialog"]').isVisible();
        },
        { timeout: 20_000, intervals: [500, 1000] },
      )
      .toBe(true);

    // The one inside the now-open dialog, because that dialog traps focus and
    // no other field on the page can take it. Same component either way: the
    // input is `CommandPrimitive.Input` carrying `data-slot="command-input"`,
    // so `InputGroup`'s own `has-[[data-slot=input-group-control]:focus-visible]`
    // rule — the one every other field in the system relies on — can never
    // match it. A DOM node has one `data-slot`, and cmdk needs this one.
    const input = page.locator('[role="dialog"] [data-slot="command-input"]').first();

    // Typed rather than `.focus()`ed. `:focus-visible` is a heuristic, and
    // Chromium does not grant it for a programmatic focus — a `.focus()` here
    // measures the ring as absent on a page where it paints correctly.
    await input.press("a");

    const ring = await input.evaluate((el) => {
      const group = el.closest('[data-slot="input-group"]')!;
      const style = getComputedStyle(group);
      return {
        focusVisible: el.matches(":focus-visible"),
        boxShadow: style.boxShadow,
      };
    });

    expect(ring.focusVisible, "the input did not take focus").toBe(true);

    // The COMPUTED shadow, not the selector. An earlier draft of this test
    // asserted `group.matches(":has([data-slot=command-input]:focus-visible)")`
    // and passed with the fix deliberately removed — `matches()` runs the
    // selector against the DOM, and says nothing about whether any stylesheet
    // uses it. Measured without the fix, every entry here was
    // `rgba(0, 0, 0, 0) 0px 0px 0px 0px`; with it, one is a 3px ring.
    const ALL_TRANSPARENT = /^(?:rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(?:, )?)+$/;
    expect(
      ring.boxShadow,
      "the group painted no ring — every shadow was transparent and zero-sized",
    ).not.toMatch(ALL_TRANSPARENT);
  });

  test("a CommandDialog renders its contents instead of crashing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/design-system/components/command");

    // `CommandDialog` used to drop `children` straight into `DialogContent`
    // with no `Command` root, so cmdk's store was undefined and the whole page
    // returned "This page couldn't load" — a crash a green build never saw,
    // because nothing rendered the specimen outside a browser. The specimen no
    // longer opens via `defaultOpen` (see the sibling test above), so the
    // dialog has to be opened the same way before its contents can be checked.
    await expect(page.locator("h1")).toHaveText("Command");
    // Wait for hydration before pressing the opener. A click that lands
    // before React attaches the handler opens nothing, and the dialog wait
    // below then runs out the clock — three projects out of five did exactly
    // that on the retargeted page, with the component itself fine.
    await page.waitForLoadState("networkidle");
    const opener = page.getByRole("button", { name: "Open the palette" });
    await expect(opener).toBeVisible();
    // `networkidle` is not hydration. Press until the dialog is there: the
    // opener only ever opens (it does not toggle), so a repeat is harmless,
    // and the reduced-motion project still raced a single press once.
    await expect
      .poll(
        async () => {
          await opener.click();
          return page.locator('[role="dialog"]').isVisible();
        },
        { timeout: 20_000, intervals: [500, 1000] },
      )
      .toBe(true);
    await expect(
      page.locator('[role="dialog"] [data-slot="command-input"]'),
    ).toBeVisible();
    expect(errors.join("\n")).not.toContain("subscribe");
  });
});
