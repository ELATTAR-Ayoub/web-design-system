import { expect, test } from "@playwright/test";

import { categoryHref, DS_GROUPS, DS_ROOT } from "@/lib/ds/nav";

// Known, explicitly-acknowledged third-party console noise to skip rather
// than blanket-ignoring all console errors. Empty today; add an entry only
// with a comment naming the source and why it cannot be fixed here.
const IGNORED_CONSOLE_ERROR_PATTERNS: RegExp[] = [];

function collectConsoleErrors(page: import("@playwright/test").Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  return {
    assertClean() {
      const unexpected = consoleErrors.filter(
        (text) => !IGNORED_CONSOLE_ERROR_PATTERNS.some((pattern) => pattern.test(text)),
      );
      expect(unexpected, unexpected.join("\n")).toEqual([]);
      expect(pageErrors, pageErrors.join("\n")).toEqual([]);
    },
  };
}

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  // `window.innerWidth` grows to fit an overflowing document on a
  // mobile-shaped viewport, which makes `scrollWidth === innerWidth` true no
  // matter how far the page overflows. `document.documentElement.clientWidth`
  // is the layout viewport and does not move — see traps.md #2.13.
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
}

test("design system landing renders cleanly", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto("/design-system");

  await expect(page.locator("h1")).toHaveCount(1);
  await assertNoHorizontalOverflow(page);
  errors.assertClean();
});

test("root (/) is the design-system landing page", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto("/");

  await expect(page.locator("h1")).toHaveCount(1);

  await assertNoHorizontalOverflow(page);
  errors.assertClean();
});

/** Every docs route registered in `lib/ds/nav.ts`'s `docs` group. */
function docsRoutes(): { slug: string; href: string }[] {
  const docs = DS_GROUPS.find((g) => g.id === "docs");
  if (!docs) return [];
  return docs.categories.map((category) => ({
    slug: category.slug,
    href: categoryHref(docs, category),
  }));
}

for (const { slug, href } of docsRoutes()) {
  test.describe(`docs route: ${slug}`, () => {
    test("one h1, no overflow at 375px, zero console errors", async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await page.setViewportSize({ width: 375, height: 900 });
      await page.goto(href);

      await expect(page.locator("h1")).toHaveCount(1);
      await assertNoHorizontalOverflow(page);
      errors.assertClean();
    });

    test("keyboard reaches the sidebar and prev/next nav", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(href);

      // Tab from the top of the document until focus lands on a sidebar link
      // (the DS sidebar nav) — proves the sidebar is keyboard-reachable
      // without a mouse.
      let reachedSidebar = false;
      for (let i = 0; i < 40; i += 1) {
        await page.keyboard.press("Tab");
        const inSidebar = await page.evaluate(() => {
          const active = document.activeElement;
          return !!active?.closest('[data-slot="sidebar"], nav[aria-label]');
        });
        if (inSidebar) {
          reachedSidebar = true;
          break;
        }
      }
      expect(reachedSidebar, "keyboard focus never reached a sidebar/nav landmark").toBe(true);

      // Prev/next foot nav — present unless this route has neither neighbour.
      const footNav = page.locator('nav:has-text("Previous"), nav:has-text("Next")');
      const count = await footNav.count();
      if (count > 0) {
        await expect(footNav.first()).toBeVisible();
      }
    });

    test("200% text has no overflow and no clipped heading", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(href);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });

      await assertNoHorizontalOverflow(page);

      const clipped = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        if (!h1) return true;
        const style = getComputedStyle(h1);
        return style.overflow === "hidden" && h1.scrollHeight > h1.clientHeight;
      });
      expect(clipped, "the page h1 is clipped at 200% text").toBe(false);
    });
  });
}

test(`docs group registers all ${docsRoutes().length} routes`, () => {
  expect(docsRoutes().length).toBeGreaterThan(0);
});

/* ── Step 8: component specimen pages ─────────────────────────────────────
 *
 * Every route under the `base` and `agent` groups (the component specimen
 * pages Step 6 gave a page contract to) — generated from `DS_GROUPS` rather
 * than hardcoded, so a category added or removed there is covered
 * automatically. Group index pages (`components/page.tsx`, `base/page.tsx`,
 * etc.) are plain nav pages already covered by the docs route checks' shape
 * and are not re-tested per-component here.
 */

/**
 * The app pins `defaultTheme="dark"` in `ThemeProvider`, so Playwright's
 * `colorScheme` project option alone does not flip it — next-themes only
 * consults `prefers-color-scheme` when the stored theme is "system". Seed
 * next-themes' own storage key per project, same as
 * `e2e/component-interactions.spec.ts`, so "both themes" is a real claim.
 */
test.beforeEach(async ({ page }, testInfo) => {
  const theme = testInfo.project.name === "desktop-light" ? "light" : "dark";
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);
});

/**
 * The pages that replaced the grouped category indexes.
 *
 * This used to enumerate `base/*` and `agent/*` — fourteen and six
 * hand-authored galleries. Those are gone: every capability they grouped has
 * its own catalog-backed route now, and re-pointing this at all 105 of those
 * would duplicate the per-route specs, which already open every one and assert
 * the heading and the 375px reflow.
 *
 * What is NOT covered there, and is covered here, is the shell: the skip link
 * being the first focusable element, activating it landing focus inside
 * `<main>`, and the first interactive thing in the article being reachable by
 * keyboard from there. So this runs against the three landings — the complete
 * index and the two family pages — which are the shell's own shapes.
 */
function componentRoutes(): { id: string; slug: string; href: string }[] {
  return [
    { id: "components", slug: "index", href: `${DS_ROOT}/components` },
    { id: "components", slug: "charts", href: `${DS_ROOT}/components/charts` },
    { id: "components", slug: "agent", href: `${DS_ROOT}/components/agent` },
  ];
}

for (const { id, slug, href } of componentRoutes()) {
  test.describe(`component page: ${id}/${slug}`, () => {
    test("one h1, no overflow at 375px, zero console errors", async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await page.setViewportSize({ width: 375, height: 900 });
      await page.goto(href);

      await expect(page.locator("h1")).toHaveCount(1);
      await assertNoHorizontalOverflow(page);
      errors.assertClean();
    });

    test("keyboard reaches the first interactive specimen and prev/next", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(href);

      // The docs shell's `SkipLink` (components/docs/chrome/skip-link.tsx)
      // must be the first focusable element in the document — checked
      // structurally rather than by simulating a Tab press from page load.
      // A live Tab is not reliable here: some specimen pages (e.g.
      // base/selects, which documents an always-open Calendar/Popover
      // state) legitimately steal initial focus into that open control —
      // Radix's `FocusScope` trapping into an open dialog on mount is
      // correct accessibility behaviour, not a bug, so "the first Tab is
      // the skip link" does not hold universally.
      const skipLink = page.locator('[data-slot="skip-link"]');
      await expect(skipLink).toHaveAttribute("href", "#main");
      const skipLinkIsFirstFocusable = await page.evaluate(() => {
        const isVisible = (el: HTMLElement) =>
          el.offsetParent !== null || el.matches('[data-slot="skip-link"]');
        const first = Array.from(
          document.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).find(isVisible);
        return first?.dataset.slot === "skip-link";
      });
      expect(skipLinkIsFirstFocusable, "the skip link is not the first focusable element").toBe(
        true,
      );

      // Reach <main>. One Tab from page load lands either on the skip link
      // (the normal case — activating it jumps focus into <main>, which
      // carries `tabIndex={-1}` in `components/docs/chrome/docs-shell.tsx` for
      // exactly this) or, for the open-demo pages above, directly inside
      // <main> already.
      await page.keyboard.press("Tab");
      const afterFirstTab = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          looksLikeSkipLink: !!active && (active.textContent ?? "").toLowerCase().includes("skip"),
          inMain: !!active && active !== document.body && !!active.closest("main"),
        };
      });
      let reachedSpecimen = false;
      if (afterFirstTab.looksLikeSkipLink) {
        await page.keyboard.press("Enter");
        const landedInMain = await page.evaluate(() => !!document.activeElement?.closest("main"));
        expect(landedInMain, "activating the skip link did not move focus into <main>").toBe(
          true,
        );
      } else {
        expect(
          afterFirstTab.inMain,
          "the first Tab landed neither on the skip link nor inside <main>",
        ).toBe(true);
        reachedSpecimen = true;
      }

      // From there, the first interactive specimen must be reachable within
      // a bounded number of tabs, checked after every press so this exits
      // as soon as it succeeds — a blind "press N times, then check once"
      // can overshoot: a page with few focusable elements in <main> wraps
      // tab order back to the header before the bound is reached. Previously
      // this bound was 60 with no early exit at all, which times out on a
      // loaded machine running the full suite — see task-6-notes.md, "Fix:
      // keyboard reach test".
      const MAX_TABS_TO_SPECIMEN = 10;
      for (let i = 0; i < MAX_TABS_TO_SPECIMEN && !reachedSpecimen; i += 1) {
        await page.keyboard.press("Tab");
        reachedSpecimen = await page.evaluate(() => {
          const active = document.activeElement;
          return !!active && active !== document.body && !!active.closest("main");
        });
      }
      expect(
        reachedSpecimen,
        `keyboard focus did not reach an interactive specimen inside <main> within ${MAX_TABS_TO_SPECIMEN} tabs`,
      ).toBe(true);

      // Prev/next foot nav — present unless this route has neither neighbour.
      const footNav = page.locator('nav:has-text("Previous"), nav:has-text("Next")');
      const count = await footNav.count();
      if (count > 0) {
        await expect(footNav.first()).toBeVisible();
        // Focus the link directly via the DOM rather than Playwright's
        // `locator.focus()`, which also waits for the element to be
        // "stable" (no ongoing layout/animation) — on a chart-heavy page
        // that check can hang on decorative motion that never settles.
        // `toBeVisible()` above already proves it is on-screen; focusing it
        // in-page only needs the element to exist.
        const focusedTag = await page.evaluate(() => {
          const navs = Array.from(document.querySelectorAll("nav"));
          const nav = navs.find((n) => /previous|next/i.test(n.textContent ?? ""));
          const link = nav?.querySelector("a");
          link?.focus();
          return document.activeElement?.tagName ?? null;
        });
        expect(focusedTag, "prev/next foot nav link did not receive focus").toBe("A");
      }
    });

    test("200% text has no overflow and no clipped heading", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(href);
      await page.evaluate(async () => {
        // Settle web fonts and any running animations (chart entrance/reveal
        // motion in particular) before reflowing at 200% text, so the
        // measurement below reads a stable layout instead of racing a
        // mid-animation frame under load.
        await document.fonts.ready;
        document.getAnimations().forEach((animation) => {
          // An infinitely-repeating animation (a loading spinner, an
          // ambient pulse) throws InvalidStateError on `finish()` — only
          // finite-duration animations can be fast-forwarded to their end.
          try {
            animation.finish();
          } catch {
            // Infinite target effect end — leave it running.
          }
        });
        document.documentElement.style.fontSize = "200%";
      });

      await assertNoHorizontalOverflow(page);

      const clipped = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        if (!h1) return true;
        const style = getComputedStyle(h1);
        return style.overflow === "hidden" && h1.scrollHeight > h1.clientHeight;
      });
      expect(clipped, "the page h1 is clipped at 200% text").toBe(false);
    });
  });
}

test(`component groups register all ${componentRoutes().length} specimen routes`, () => {
  expect(componentRoutes().length).toBeGreaterThan(0);
});
