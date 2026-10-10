/**
 * Bidirectional proof that `lib/ds/nav.ts` and the routes under
 * `app/design-system/**` never drift apart.
 *
 * Two directions, both asserted:
 *  1. nav → file: every group index and every `categoryHref()` resolves to a
 *     `page.tsx` that actually exists on disk.
 *  2. file → nav: every `page.tsx` under `app/design-system/**` is reachable
 *     from `lib/ds/nav.ts` — either as a group index, a category page, or one
 *     of the small, explicitly-named hub pages that sit above a group of
 *     groups (`/design-system/components`) — and none of them is claimed by
 *     more than one nav entry.
 *
 * `app/page.tsx` (the root landing) is asserted separately: it exists, and it
 * is not part of the `lib/ds/nav.ts` tree (the design-system nav only covers
 * `/design-system/**`).
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { COMPONENT_DOCS } from "@/lib/ds/docs/catalog";
import { categoryHref, DOC_SECTIONS, DS_GROUPS, DS_ROOT } from "@/lib/ds/nav";

const ROOT = process.cwd();

/** Hub pages above a group of groups — not themselves a `DsGroup` entry. */
const EXTRA_HUB_ROUTES = [
  "/design-system/components",
  // The dynamic segment itself is a file, not a route a reader visits. The
  // routes it serves are registered individually, through the catalog-derived
  // `catalog` group in `lib/ds/nav.ts`.
  "/design-system/components/[component]",
];

/** The one file that serves every catalog item's route. */
const DYNAMIC_COMPONENT_PAGE = join(
  ROOT,
  "app/design-system/components/[component]/page.tsx",
);

const CATALOG_NAMES = new Set(COMPONENT_DOCS.map((m) => m.name));

/**
 * The file that actually renders `route`.
 *
 * A catalog item has no directory of its own: all 100-odd of them are served by
 * the `[component]` dynamic segment, which reads the catalog for its params. So
 * `/design-system/components/button` is backed by a real page even though
 * `app/design-system/components/button/page.tsx` does not exist, and asserting
 * on the literal path would fail on every one of them.
 */
function appPageFor(route: string): string {
  const item = route.match(/^\/design-system\/components\/([a-z0-9-]+)$/);
  if (item && CATALOG_NAMES.has(item[1])) return DYNAMIC_COMPONENT_PAGE;
  const rel = route === "/" ? "app/page.tsx" : `app${route}/page.tsx`;
  return join(ROOT, rel);
}

/** Every `page.tsx` under `app/design-system`, as a route string. */
function findDesignSystemRoutes(): string[] {
  const base = join(ROOT, "app", "design-system");
  const routes: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry === "page.tsx") {
        const rel = full
          .slice(ROOT.length)
          .split("\\")
          .join("/")
          .replace(/\/page\.tsx$/, "")
          .replace(/^\/app/, "");
        routes.push(rel === "" ? "/design-system" : rel);
      }
    }
  }

  walk(base);
  return routes;
}

describe("design-system navigation", () => {
  it("every group index resolves to an existing page.tsx", () => {
    for (const group of DS_GROUPS) {
      expect(existsSync(appPageFor(group.href)), `${group.href} → ${appPageFor(group.href)}`).toBe(
        true,
      );
    }
  });

  it("every category resolves to an existing page.tsx", () => {
    for (const group of DS_GROUPS) {
      for (const category of group.categories) {
        const href = categoryHref(group, category);
        expect(existsSync(appPageFor(href)), `${href} → ${appPageFor(href)}`).toBe(true);
      }
    }
  });

  it("no two nav entries resolve to the same route", () => {
    const routes: string[] = [];
    for (const group of DS_GROUPS) {
      routes.push(group.href);
      for (const category of group.categories) {
        routes.push(categoryHref(group, category));
      }
    }
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of routes) {
      if (seen.has(r)) dupes.push(r);
      seen.add(r);
    }
    expect(dupes, `duplicate nav routes: ${dupes.join(", ")}`).toEqual([]);
  });

  it("every app/design-system route is reachable from lib/ds/nav.ts, exactly once", () => {
    const navRoutes = new Set<string>([DS_ROOT, ...EXTRA_HUB_ROUTES]);
    for (const group of DS_GROUPS) {
      navRoutes.add(group.href);
      for (const category of group.categories) {
        navRoutes.add(categoryHref(group, category));
      }
    }

    const actual = findDesignSystemRoutes();
    const counts = new Map<string, number>();
    for (const r of actual) counts.set(r, (counts.get(r) ?? 0) + 1);

    const unregistered = actual.filter((r) => !navRoutes.has(r));
    expect(unregistered, `routes with no nav entry: ${unregistered.join(", ")}`).toEqual([]);

    const registeredMoreThanOnce = [...counts.entries()].filter(([, n]) => n > 1);
    expect(
      registeredMoreThanOnce,
      `routes with more than one page.tsx: ${registeredMoreThanOnce.map(([r]) => r).join(", ")}`,
    ).toEqual([]);
  });

  it("the root landing page exists, outside the design-system nav tree", () => {
    expect(existsSync(join(ROOT, "app", "page.tsx"))).toBe(true);
    const navRoutes = new Set<string>([DS_ROOT, ...EXTRA_HUB_ROUTES]);
    for (const group of DS_GROUPS) {
      navRoutes.add(group.href);
      for (const category of group.categories) navRoutes.add(categoryHref(group, category));
    }
    expect(navRoutes.has("/")).toBe(false);
  });

  it("registers a docs group carrying Introduction, Installation, Theming, Typeset, CLI, Registry, Skills, Changelog", () => {
    const docs = DS_GROUPS.find((g) => g.id === "docs");
    expect(docs, "no docs group registered in DS_GROUPS").toBeTruthy();
    const slugs = docs!.categories.map((c) => c.slug).sort();
    expect(slugs).toEqual(
      [
        "changelog",
        "cli",
        "installation",
        "introduction",
        "registry",
        "skills",
        "theming",
        "typeset",
      ].sort(),
    );
  });

  it("shows one Sections sequence with the full foundation pages, not the retired primers", () => {
    expect(DOC_SECTIONS.map(({ title }) => title)).toEqual([
      "Components", "Introduction", "Installation", "Theming", "Typeset",
      "Spacing", "Shadows", "Motion", "Icons", "CLI", "Registry",
      "Skills", "Changelog",
    ]);
    expect(DOC_SECTIONS.map(({ href }) => href)).not.toContain("/design-system/docs/theming");
    expect(DOC_SECTIONS.map(({ href }) => href)).not.toContain("/design-system/docs/typeset");
    expect(DOC_SECTIONS.find(({ title }) => title === "Theming")?.href).toBe("/design-system/colors");
    expect(DOC_SECTIONS.find(({ title }) => title === "Typeset")?.href).toBe("/design-system/typography");
  });
});
