/**
 * The landing-page contract, after the grouped category pages were deleted.
 *
 * THIS FILE HAS NOW GOVERNED THREE DIFFERENT ARCHITECTURES, and the history is
 * the point:
 *
 *   1. Twenty pages under `app/design-system/components/{base,agent}/*` WERE
 *      the documentation. Each carried Preview, Installation, Usage, Examples,
 *      API and Accessibility for every component in its category, so a
 *      component had no address of its own and inherited whatever eyebrow its
 *      neighbours had.
 *   2. Every capability got its own route, and those twenty became galleries —
 *      an intro plus links. The contract inverted: an Installation section on a
 *      gallery became a defect rather than a requirement.
 *   3. The galleries are gone. Twenty hand-authored card grids, each holding a
 *      copy of every blurb it linked to, is a second documentation system, and
 *      they had already drifted from the pages they pointed at.
 *
 * What is left is three landings: the complete components index, and one page
 * each for Charts and Agent. The contract below is what distinguishes a landing
 * from a component page, because the failure mode is a landing slowly growing
 * back into one.
 *
 * A LANDING INDEXES AND MAY DEMONSTRATE; IT DOES NOT RE-DOCUMENT. It must not
 * carry an install command, API table, or duplicate component-doc spec. The
 * Agent and Charts landings now render their existing live specimens so a
 * visitor can try the family before opening an item reference.
 *
 * A landing's card grid must be DERIVED. `FamilyLanding` and the Charts
 * gallery read `catalogEntriesIn`, so a card cannot promise a page that does not exist. The
 * version this replaces could, and did: a card advertising a "Chart" section
 * with nothing behind it, and a "Date Range" entry pointing at a page that had
 * never been written.
 *
 * This stays a static-source contract, not a render contract: it reads each
 * page as text and checks structure. A full render would need every runtime
 * dependency mocked — transports, Radix portals, recharts' ResizeObserver — for
 * no extra confidence about page shape, which is the thing this governs.
 *
 * The per-ITEM contract (an install section that derives rather than types its
 * command, a spec that stays plain data) lives in `scripts/validate-docs.mjs`,
 * which runs over all of them.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

/** The three pages that survived, and what each one is. */
const LANDINGS = [
  {
    route: "app/design-system/components/page.tsx",
    what: "the complete components index",
  },
  {
    route: "app/design-system/components/charts/page.tsx",
    what: "the Charts family landing",
  },
  {
    route: "app/design-system/components/agent/page.tsx",
    what: "the Agent family landing",
  },
] as const;

/**
 * The trees that were deleted, asserted gone.
 *
 * Not paranoia: the whole point of the migration is that there is ONE
 * documentation system. A category page restored by a merge, or recreated by
 * someone following an old link, would be invisible — it would render, it would
 * typecheck, and it would quietly be a second place a component is documented.
 */
const DELETED = [
  "app/design-system/components/base",
  "app/design-system/components/agent/console",
  "app/design-system/components/agent/avatar",
  "app/design-system/components/agent/composer",
  "app/design-system/components/agent/history",
  "app/design-system/components/agent/transcript",
  "app/design-system/components/agent/voice",
];

function read(route: string): string {
  return readFileSync(join(ROOT, route), "utf8");
}

describe("the grouped category pages are gone", () => {
  it.each(DELETED)("%s does not exist", (path) => {
    expect(existsSync(join(ROOT, path))).toBe(false);
  });
});

describe.each(LANDINGS)("$what", ({ route }) => {
  const source = read(route);

  it("exists and renders a card grid", () => {
    expect(source).toMatch(/IndexGrid|FamilyLanding/);
  });

  it("does not print an install command", () => {
    // The one place a command may be rendered is `InstallBlock`, from the
    // contract and the generated `commands.json`. A landing typing one is the
    // exact drift that had pages advertising `npx shadcn add <name>` for
    // dependency items, CSS capabilities and npm packages alike.
    expect(source).not.toMatch(/commandFor\(/);
    expect(source).not.toMatch(/npx shadcn/);
  });

  it("does not carry an installation, API or states section", () => {
    for (const forbidden of ['id="installation"', 'id="api"', 'id="states"']) {
      expect(source, `${route} carries ${forbidden}`).not.toContain(forbidden);
    }
    for (const forbidden of ["installation", "api", "states"]) {
      expect(source, `${route} declares id: "${forbidden}"`).not.toContain(
        `id="${forbidden}"`,
      );
    }
  });

  it("does not declare a component doc spec", () => {
    // `ComponentDocSpec` is the per-item shape. A landing holding one means a
    // capability is documented twice, at two routes, from two files.
    expect(source).not.toContain("ComponentDocSpec");
  });
});

describe("the family landings are derived, not authored", () => {
  it("Agent delegates its reference grid to FamilyLanding", () => {
    const source = read("app/design-system/components/agent/page.tsx");
    expect(source).toContain("FamilyLanding");
    expect(source).not.toContain("<IndexCard");
  });

  it("Charts derives its reference grid from the catalog", () => {
    const source = read("app/design-system/components/charts/page.tsx");
    expect(source).toContain('catalogEntriesIn("charts")');
    expect(source).toContain("docRoute(meta.name)");
    expect(source).toContain("<IndexCard");
  });

  it("FamilyLanding takes its entries from the catalog", () => {
    const source = read("components/docs/page/family-landing.tsx");
    expect(source).toContain("catalogEntriesIn");
    expect(source).toContain("docRoute");
  });
});
