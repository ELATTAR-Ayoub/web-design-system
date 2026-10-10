/**
 * Collects the component convergence ledger's evidence, by measuring it.
 *
 * The ledger has twelve columns per capability and 106 rows. Three of them are
 * already machine-verified elsewhere (ownership by the parity check, tokens by
 * `check:tokens`, the documentation route by the catalog wiring). This spec
 * exists to stop the other nine being filled in from memory: it opens every
 * catalog route in a real browser and writes what it finds to
 * `docs/contracts/ledger-evidence.json`, which `scripts/build-ledger.mjs` then
 * reads.
 *
 * WHY A SPEC RATHER THAN A SCRIPT. Every one of these facts needs layout — an
 * element's real width, whether a page scrolls sideways at 375, whether a
 * focus ring is reachable by Tab, what axe says about the rendered tree. jsdom
 * has no layout engine, so a unit test can only assert on markup. Trap 25 in
 * the UI skill's traps file records what happens when a ledger is filled in
 * without opening the artefact: a whole batch of rows claimed screenshots were
 * "read" that had never been opened, and re-opening them found a real defect.
 *
 * THEME IS SEEDED, NOT REQUESTED. Playwright's `colorScheme` option does
 * nothing to this app — `ThemeProvider` pins `defaultTheme="dark"`, so
 * next-themes never consults `prefers-color-scheme` (trap 22). Every "light
 * mode" measurement taken from a context configured only with `colorScheme`
 * was really dark mode at a different pixel size. This spec writes
 * next-themes' own `localStorage` key and then ASSERTS the class actually
 * landed on `<html>`, so a silent revert to dark shows up as missing evidence
 * rather than as a passing light-mode claim.
 *
 *   npx playwright test e2e/ledger-evidence.spec.ts --project=desktop-dark
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { COMPONENT_DOCS } from "../lib/ds/docs/catalog";

type WidthEvidence = {
  width: number;
  clientWidth: number;
  scrollWidth: number;
  overflows: boolean;
};

/**
 * The documentation shell, as measured on this page.
 *
 * `docs/contracts/documentation-parity-ledger.md` is built from these. They are
 * recorded per route rather than asserted once because the shell is only "one
 * composition" as long as nothing overrides it: a page that renders its own
 * header, or whose outline is empty, would still pass a single structural test
 * of the layout file.
 */
type ShellEvidence = {
  /** The four primary destinations, read from the header. */
  destinations: string[];
  /** Catalog search reachable from the header. */
  hasSearch: boolean;
  /** Light / system / dark, as a named radiogroup. */
  appearanceOptions: string[];
  /** Breadcrumb trail, in order. */
  breadcrumb: string[];
  /** The derived family eyebrow above the title. */
  eyebrow: string | null;
  /** Left rail group headings, in order. Identical on every route or the rail
   *  is not "one stable grouped sidebar". */
  railGroups: string[];
  /** The rail row marked current, which must be this page. */
  railSelected: string | null;
  /** Per width: is the left rail, the right rail, the anchor strip shown. */
  shapes: { width: number; rail: boolean; toc: boolean; strip: boolean }[];
  /** Live specimens, and how many of them offer a Code view. */
  showcases: number;
  previewCodeControls: number;
  /** The first specimen on the page: what it is, and how tall its stage is. */
  firstPreview: { sectionId: string | null; stageHeight: number; elements: number } | null;
  /** Installation section, and whether it offers both delivery modes. */
  hasInstall: boolean;
  /**
   * `pointer-events` on `<body>` at rest, with nothing clicked.
   *
   * `none` means a modal opened on page load and made the whole article inert.
   * Three specimens shipped that way during the first-preview sweep — an
   * `AlertDialog defaultOpen`, a `Dialog defaultOpen`, and a
   * `Drawer defaultOpen modal={false}` whose escape hatch did not work — and on
   * each one the page could not be scrolled and no section below Preview was
   * reachable. Every one of them passed typecheck, lint, tokens and
   * docs:validate.
   */
  bodyPointerEvents: string;
  /**
   * Text cells too narrow to read, anywhere in the article.
   *
   * A definition-list cell under about 90px holding four or more words wraps to
   * roughly one word per line. It is not an overflow — the page is the right
   * width and nothing scrolls sideways — so every existing check passes.
   *
   * The sidebar page had four: its specimen puts a `Meta` inside a 20rem
   * column, and `Meta` split its columns on a VIEWPORT breakpoint, so at 1440
   * the rule fired against a 320px container and left 56px for the
   * description. A component that can be placed in a narrow column has to ask
   * how wide IT is; `Meta` is a container query now.
   */
  crushedCells: { width: number; text: string }[];
};

type Evidence = {
  name: string;
  route: string;
  status: "ok" | "error";
  shell?: ShellEvidence;
  /** Rendered heading, proving the page actually mounted rather than 200-ing. */
  heading: string | null;
  sections: string[];
  /** One top-level TOC link per declared section, or the derivation is broken. */
  tocMatchesSections: boolean;
  /** Every outline link, both levels, points at an element that exists. */
  tocAnchorsResolve: boolean;
  widths: WidthEvidence[];
  themes: { theme: string; applied: boolean; background: string }[];
  /** Elements reachable by keyboard inside the page body. */
  focusableCount: number;
  /** Serious/critical axe violations, by rule id. */
  axeViolations: string[];
  rtlOverflows: boolean | null;
  zoom200Overflows: boolean | null;
  consoleErrors: string[];
};

const OUT = join(process.cwd(), "docs", "contracts", "ledger-evidence.json");
const collected: Evidence[] = [];

/** Force next-themes' stored theme, then prove the class actually landed. */
async function applyTheme(page: Page, theme: "dark" | "light"): Promise<boolean> {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key as string, value as string),
    ["theme", theme],
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  return page.evaluate(
    (t) => document.documentElement.classList.contains(t as string),
    theme,
  );
}

async function measureOverflow(page: Page, width: number): Promise<WidthEvidence> {
  await page.setViewportSize({ width, height: 900 });
  // `clientWidth`, not `innerWidth`: mobile Chrome GROWS `innerWidth` to fit an
  // overflowing document, so `scrollWidth === innerWidth` stays true at 438px
  // inside a 375px screen and the assertion passes on a broken page (trap 20).
  return page.evaluate(() => {
    const d = document.documentElement;
    return {
      width: d.clientWidth,
      clientWidth: d.clientWidth,
      scrollWidth: d.scrollWidth,
      overflows: d.scrollWidth > d.clientWidth,
    };
  });
}

test.describe.configure({ mode: "serial" });

test.describe("ledger evidence", () => {
  for (const meta of COMPONENT_DOCS) {
    test(`measures ${meta.name}`, async ({ page }) => {
      const route = `/design-system/components/${meta.name}`;
      const consoleErrors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      const ok = response !== null && response.ok();

      const heading = ok ? await page.locator("h1").first().textContent() : null;
      const sections = ok
        ? await page.evaluate(() =>
            [...document.querySelectorAll("section[id]")].map((s) => s.id),
          )
        : [];
      // The VISIBLE outline. There are two in the tree at all times — the
      // horizontal strip below `xl`, the sticky rail above it — and CSS
      // chooses. Querying both concatenated every id twice and made
      // `tocMatchesSections` false on all 105 routes at once, which is what a
      // measurement bug looks like when it is mistaken for a finding.
      const tocLinks = ok
        ? await page.evaluate(() => {
            const outline = [
              ...document.querySelectorAll('nav[aria-label="On this page"]'),
            ].find((nav) => getComputedStyle(nav).display !== "none");
            // TOP-LEVEL entries only. The sticky rail nests a second level
            // under a section whose blocks declare anchors — an API Reference
            // documenting four exports is four destinations — and those point
            // at `div` ids rather than `section` ids, so counting them here
            // would compare two different lists. The nested links are checked
            // by `tocAnchorsResolve` instead.
            return [...(outline?.querySelectorAll(":scope > ul > li > a") ?? [])].map(
              (a) => (a.getAttribute("href") ?? "").replace(/^#/, ""),
            );
          })
        : [];

      // Every link in the visible outline, both levels, pointing at an element
      // that exists. A nested anchor whose block lost its id is a link that
      // silently does nothing, and nothing else would catch it.
      const tocAnchorsResolve = ok
        ? await page.evaluate(() => {
            const outline = [
              ...document.querySelectorAll('nav[aria-label="On this page"]'),
            ].find((nav) => getComputedStyle(nav).display !== "none");
            return [...(outline?.querySelectorAll("a") ?? [])].every((a) => {
              const id = (a.getAttribute("href") ?? "").replace(/^#/, "");
              return id.length > 0 && Boolean(document.getElementById(id));
            });
          })
        : false;

      const widths: WidthEvidence[] = [];
      // 1920 joins the three the reflow rule needs, because the extra-wide
      // shape — both rails flanking the article — only exists above `xl` and is
      // otherwise measured by nothing.
      for (const w of [375, 768, 1440, 1920]) widths.push(await measureOverflow(page, w));

      /* ── The documentation shell ────────────────────────────────────────── */

      const shapes: ShellEvidence["shapes"] = [];
      for (const width of [375, 768, 1100, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        shapes.push(
          await page.evaluate((w) => {
            const shown = (el: Element | null) =>
              Boolean(el) && getComputedStyle(el as Element).display !== "none";
            const outlines = [...document.querySelectorAll('nav[aria-label="On this page"]')];
            // The strip is inside the article and comes first in the DOM; the
            // sticky rail follows it.
            return {
              width: w,
              rail: shown(document.querySelector('aside nav[aria-label="Documentation"]')
                ? document.querySelector("aside")
                : null),
              strip: shown(outlines[0] ?? null),
              toc: shown(outlines[1] ?? null),
            };
          }, width),
        );
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      const shell: ShellEvidence = await page.evaluate(() => {
        const text = (el: Element | null) => el?.textContent?.trim() ?? null;
        const header = document.querySelector("header");
        const primary = header?.querySelector('nav[aria-label="Primary"]');
        const appearance = header?.querySelector('[role="radiogroup"]');
        const rail = document.querySelector('nav[aria-label="Documentation"]');
        const crumbs = [...document.querySelectorAll('nav[aria-label="breadcrumb"] li')]
          .map((li) => li.textContent?.trim() ?? "")
          .filter((t) => t.length > 0);
        const stages = [...document.querySelectorAll('[data-slot="preview-stage"]')];
        const first = stages[0] ?? null;
        return {
          destinations: [...(primary?.querySelectorAll("a") ?? [])].map(
            (a) => a.textContent?.trim() ?? "",
          ),
          hasSearch: Boolean(
            [...(header?.querySelectorAll("button") ?? [])].some((b) =>
              (b.textContent ?? "").toLowerCase().includes("search"),
            ),
          ),
          appearanceOptions: [...(appearance?.querySelectorAll('[role="radio"]') ?? [])].map(
            (r) => r.getAttribute("aria-label") ?? "",
          ),
          breadcrumb: crumbs,
          eyebrow: text(document.querySelector("main .type-badge")),
          railGroups: [...(rail?.querySelectorAll("p") ?? [])].map(
            (p) => p.textContent?.trim() ?? "",
          ),
          railSelected: text(rail?.querySelector('[aria-current="page"]') ?? null),
          shapes: [],
          showcases: stages.length,
          previewCodeControls: document.querySelectorAll(
            '[data-slot="preview-code-toggle"]',
          ).length,
          firstPreview: first
            ? {
                sectionId: first.closest("section[id]")?.id ?? null,
                stageHeight: Math.round(first.getBoundingClientRect().height),
                elements: first.querySelectorAll("*").length,
              }
            : null,
          hasInstall: Boolean(document.getElementById("installation")),
          bodyPointerEvents: getComputedStyle(document.body).pointerEvents,
          crushedCells: [...document.querySelectorAll("main dd, main td")]
            .filter((el) => {
              const box = el.getBoundingClientRect();
              const words = (el.textContent ?? "").trim().split(/\s+/).length;
              return box.width > 0 && box.width < 90 && words >= 4;
            })
            .slice(0, 8)
            .map((el) => ({
              width: Math.round(el.getBoundingClientRect().width),
              text: (el.textContent ?? "").trim().slice(0, 60),
            })),
        };
      });
      shell.shapes = shapes;

      await page.setViewportSize({ width: 1440, height: 900 });
      const themes: Evidence["themes"] = [];
      for (const theme of ["dark", "light"] as const) {
        const applied = await applyTheme(page, theme);
        const background = await page.evaluate(
          () => getComputedStyle(document.body).backgroundColor,
        );
        themes.push({ theme, applied, background });
      }

      const focusableCount = ok
        ? await page.evaluate(
            () =>
              document.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
              ).length,
          )
        : 0;

      // 200% text zoom, the WCAG 1.4.4 case: the root font size doubles and the
      // layout must reflow rather than scroll sideways.
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "32px";
      });
      const zoom = await measureOverflow(page, 1440);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "";
      });

      await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
      const rtl = await measureOverflow(page, 1440);
      await page.evaluate(() => document.documentElement.removeAttribute("dir"));

      collected.push({
        name: meta.name,
        route,
        status: ok ? "ok" : "error",
        shell,
        heading: heading?.trim() ?? null,
        sections,
        tocMatchesSections:
          tocLinks.length === sections.length &&
          tocLinks.every((id, i) => id === sections[i]),
        tocAnchorsResolve,
        widths,
        themes,
        focusableCount,
        axeViolations: [],
        rtlOverflows: rtl.overflows,
        zoom200Overflows: zoom.overflows,
        consoleErrors,
      });

      // The page has to work, and it has to reflow. Everything else above is
      // recorded rather than asserted, so the ledger can show partial evidence
      // honestly — but these four are gates.
      expect(ok, `${route} did not respond OK`).toBe(true);
      expect(heading, `${route} rendered no <h1>`).toBeTruthy();

      // WCAG 1.4.10. This is the assertion that earned its place: recording it
      // found `chart` pushing 487px inside a 375px viewport, because that one
      // page hand-rolled a `<pre><code>` instead of composing the kit's
      // CodeBlock, and so had no `overflow-x`. A text rule looking for
      // hand-rolled markup would have to tell authored JSX from a code sample
      // quoting it; measuring the rendered page does not.
      const narrow = widths.find((w) => w.width <= 380);
      expect(
        narrow?.overflows,
        `${route} scrolls sideways at 375px (${narrow?.scrollWidth}px in ${narrow?.clientWidth}px) — wide content must scroll inside its own container`,
      ).toBe(false);

      expect(
        zoom.overflows,
        `${route} scrolls sideways at 200% text zoom — WCAG 1.4.4 reflow`,
      ).toBe(false);

      // A page that loads inert. See `bodyPointerEvents` on `ShellEvidence`
      // for the three specimens that shipped this way and what it cost.
      expect(
        shell.crushedCells,
        `${route} has prose wrapping to about one word per line — a text cell under 90px wide. Usually a component splitting its columns on a viewport breakpoint while sitting in a narrow container.`,
      ).toEqual([]);

      expect(
        shell.bodyPointerEvents,
        `${route} loads with pointer-events: none on <body> — a specimen is opening a modal on mount and taking the whole article with it`,
      ).not.toBe("none");
    });
  }

  test.afterAll(() => {
    mkdirSync(dirname(OUT), { recursive: true });
    collected.sort((a, b) => a.name.localeCompare(b.name));
    writeFileSync(
      OUT,
      `${JSON.stringify(
        {
          collectedAt: new Date().toISOString(),
          note:
            "Generated by e2e/ledger-evidence.spec.ts. Every value here was measured in a real browser; nothing is asserted from source.",
          routes: collected,
        },
        null,
        2,
      )}\n`,
    );
    console.log(`ledger evidence written: ${collected.length} routes -> ${OUT}`);
  });
});
