/**
 * Single source of truth for the design-system tree.
 *
 * The sidebar, every index page and every page header read from this file, so a
 * category can never appear in the nav without a page, or drift out of sync with
 * the components it claims to hold.
 *
 * THE COMPONENT ENTRIES ARE DERIVED, NOT TYPED. The `catalog` group below is
 * built from `lib/ds/docs/catalog.ts` — the same list the per-item routes,
 * search and the family views read. Component names used to be typed here a
 * second time, in each category's `contents`, and a second hand-maintained copy
 * of a list is the failure this file's own header has warned about since it was
 * written. Foundations and the documentation pages stay authored: they are
 * pages with prose, not catalog items.
 */

import { catalogEntries } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { FAMILY_LANDING, FAMILY_ORDER } from "@/lib/ds/families";
import type { DocFamily } from "@/lib/ds/platform-contract";

export type DsCategory = {
  /**
   * Which of the four documentation families this entry belongs to.
   *
   * Only catalog-derived entries carry one; the authored foundation and docs
   * categories leave it undefined. `components/ds/ds-nav.tsx` reads it to break
   * the catalog into the same four groups Flutter's rail uses — without it the
   * rail is one flat list of a hundred-odd links, which measured 5264px tall in
   * a 900px viewport and is not navigation, it is a directory listing.
   */
  family?: DocFamily;
  /** Final URL segment. */
  slug: string;
  title: string;
  /** One line describing what the page is for. */
  blurb: string;
  /** The component sets shown on that page, in display order. */
  contents: string[];
};

export type DsGroup = {
  id: "foundations" | "catalog" | "docs";
  title: string;
  /** Index route for the group. */
  href: string;
  blurb: string;
  categories: DsCategory[];
};

export const DS_ROOT = "/design-system";

/* ── Foundations ──────────────────────────────────────────────────────────── */

const foundations: DsCategory[] = [
  {
    slug: "colors",
    title: "Theming",
    blurb:
      "Zinc for everything structural, the action and value ramps, four state hues and the text-safe end of each — with every contrast ratio measured live in whichever theme you are in, rather than claimed.",
    // These are the page's own sections, in order. The list drifted while the
    // page was rewritten — it named "Text", "Borders" and a balance section
    // that no longer exist and missed the state inks entirely — which is the
    // quiet half of a documentation site: a table of contents nothing checks.
    contents: [
      "Monochrome",
      "Action ramp",
      "Value ramp",
      "State",
      "State ink",
      "Code",
      "What is not a token",
    ],
  },
  {
    slug: "typography",
    title: "Typeset",
    // A blurb that names the wrong typeface is the same class of drift as a
    // rules file restating a token value. This one has been stale twice — it
    // said Geist for words, then Space Grotesk. `--font-sans` is Inter.
    blurb:
      "Two faces only: Inter for every word, Geist Mono for code, identifiers and figures. Seventeen roles, live at the size they render, plus the prose block that reaches the same scale without a class.",
    contents: [
      "Faces",
      "The seventeen roles",
      // The one entry that is not a `.type-*` class. `.prose` is the same
      // scale reached a second way — for content nobody writes the elements
      // of — so it is documented beside the classes it shares its declaration
      // blocks with rather than on a page of its own.
      "Prose",
      "Rules",
    ],
  },
  {
    slug: "spacing",
    title: "Spacing",
    blurb:
      "The 8-point spacing scale, radius ladder, elevation set, hit-target floor, 12-column grid and responsive breakpoints.",
    contents: [
      "Spacing scale",
      "Radius",
      "Elevation",
      "Grid",
      "Breakpoints",
      "Hit-target floor",
    ],
  },
  {
    slug: "shadows",
    title: "Shadows",
    blurb:
      "Two families: ambient depth, and machine surfaces that look like they can be physically pressed.",
    contents: [
      "Ambient e1–e4",
      "Machine keys",
      "Sunken sockets",
      "Control depth",
      "Rationed glow",
      "Glass",
    ],
  },
  {
    slug: "motion",
    title: "Motion",
    blurb:
      "Durations, easing curves and the named animations — each one running live so timing can be judged, not guessed.",
    contents: [
      "Durations",
      "Easing",
      "Named animations",
      "Reveal choreography",
      "Reduced motion",
    ],
  },
  {
    slug: "icons",
    title: "Icons",
    blurb:
      "The Icon component wrapping Lucide: fixed sizes, stroke rules, and the curated icon set, grouped by domain.",
    contents: [
      "Icon component",
      "Sizes",
      "Tones",
      "Navigation set",
      "Action set",
      "Domain set",
    ],
  },
];

/* ── Site pages ───────────────────────────────────────────────────────────────
 *
 * The fourth family, for the pages a product has to have and nobody designs:
 * FAQ, about, contact, help, terms, privacy. Base is a chassis of controls;
 * this is a chassis of *pages* — a measure, a rhythm, a surface, a reading
 * column — composing base rather than adding to it.
 *
 * It grows one category at a time, and that is not caution. `contents` renders
 * as a page's chip list and the sidebar renders a link per category, so an
 * entry here is a promise that the route exists; the `data` page carried a
 * "Chart" chip for months with no specimen behind it. Registering the whole
 * plan up front would ship five links to nothing.
 */


/* ── Docs ─────────────────────────────────────────────────────────────────
 *
 * The fifth family: concise, shadcn-style entry documents rather than
 * component specimens. What it is, how to use it, exact commands, platform
 * differences, necessary caveats — no history, no debugging narrative. That
 * belongs in `docs/references/rules-rationale.md`, not a public route.
 */

const docs: DsCategory[] = [
  {
    slug: "introduction",
    title: "Introduction",
    blurb: "What this system is, what it is built on, and where the three families live.",
    contents: ["What it is", "The three ideas", "Where things live"],
  },
  {
    slug: "installation",
    title: "Installation",
    blurb: "Installing the foundation and a first component with the shadcn CLI.",
    contents: ["Requirements", "Init", "The foundation item", "A first component"],
  },
  {
    slug: "theming",
    title: "Theming",
    blurb: "Rebranding the two named ramps, and what changing a token actually touches.",
    contents: ["The two ramps", "Ink, not ends", "Light and dark", "Rebranding"],
  },
  {
    slug: "typeset",
    title: "Typeset",
    blurb: "The 17 public roles, continuous first, then grouped by Words, Code and Numerics.",
    contents: ["The continuous preview", "Words", "Code", "Numerics"],
  },
  {
    slug: "cli",
    title: "CLI",
    blurb: "The commands this repository's registry actually supports, read from the registry itself.",
    contents: ["init", "add", "diff", "search"],
  },
  {
    slug: "registry",
    title: "Registry",
    blurb: "What ships as a registry item, the namespaces, and the exact install command per item.",
    contents: ["Namespaces", "Foundation", "UI items", "Blocks"],
  },
  {
    slug: "skills",
    title: "Skills",
    blurb: "The AI-facing workflow skill this repository ships, and what it enforces.",
    contents: ["elattar-building-ui", "What it checks"],
  },
  {
    slug: "changelog",
    title: "Changelog",
    blurb: "What changed, most recent first.",
    contents: ["0.2.0"],
  },
];

/**
 * One entry per documented capability, at its own route.
 *
 * Ordered by title, the same order `/design-system/components` lists them in,
 * because the rail and the index read this one list. The `base` and `agent`
 * groups above are still real: their pages survive as INDEXES and galleries
 * over these items, which is why a component appears in both a category index
 * and here without either being the other's duplicate — the index links, this
 * owns the route.
 */
const catalog: DsCategory[] = [
  // The two family landings, registered here so exactly one file knows the
  // route exists. `test/docs/docs-navigation.test.ts` fails on a route under
  // `app/design-system/` with no nav entry, which is what caught these when
  // they replaced the deleted `base/**` and `agent/**` category galleries.
  ...FAMILY_ORDER.flatMap((family) => {
    const landing = FAMILY_LANDING[family];
    return landing
      ? [{ family, slug: landing.slug, title: landing.title, blurb: landing.blurb, contents: [] }]
      : [];
  }),
  ...catalogEntries()
  .filter(({ meta }) => meta.showInRail !== false)
  .map(({ meta, contract }) => ({
  slug: meta.name,
  title: contract.title,
  family: contract.family,
  // Plain text: a rail row and an index card are prose, and the seven
  // descriptions that name an identifier carry backticks the hero renders as
  // code spans. Only the hero can.
  blurb: plainDescription(meta.description),
  // The page's own sections are its table of contents, derived from its spec by
  // `tocFor`. Repeating them here would be the second anchor list this system
  // deleted.
  contents: [],
  })),
  // The workspace explainer: an authored route, not a catalog item — it has
  // no component of its own, just a card per component the workspace already
  // uses. `slug` carries the extra segment rather than living in its own
  // `DsGroup`, because `categoryHref` already builds `group.href + "/" +
  // slug` and a second group for one page would be the thing this file's own
  // header warns against — a second place a route could be registered.
  {
    family: "agent",
    slug: "agent-workspace/why",
    title: "Why these components",
    blurb:
      "One card per workspace component: what it is, where it sits, why it beats the part beside it, and what changed from its source — plus what was left out.",
    contents: [],
  },
  // The full-screen live workspace — an authored route, same reasoning as
  // "Why these components" above: it has no component of its own, just the
  // same conversation picker and AgentWorkspace the "Preview" section already
  // renders, at the full viewport instead of the article's own width.
  {
    family: "agent",
    slug: "agent-workspace/live",
    title: "AgentWorkspace — full screen",
    blurb: "The live conversation picker and workspace, full viewport, no docs chrome — for trying every layout at real desktop width.",
    contents: [],
  },
];

export const DS_GROUPS: DsGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    href: DS_ROOT,
    blurb: "The decisions everything else inherits.",
    categories: foundations,
  },
  {
    id: "catalog",
    title: "Components",
    href: `${DS_ROOT}/components`,
    blurb:
      "Every capability the system publishes, each at its own route: what it is, how it is delivered, its API, states, accessibility and keyboard behaviour.",
    categories: catalog,
  },
  {
    id: "docs",
    title: "Documentation",
    href: `${DS_ROOT}/docs`,
    blurb:
      "Concise, shadcn-style entry documents: what a piece is, how to install and use it, and the platform differences that matter — no history, no debugging narrative.",
    categories: docs,
  },
];

/**
 * The documentation shell has one Sections run. Foundation pages keep their
 * established URLs, but no longer sit in a second rail group beside duplicate
 * Theming and Typeset primers. The old primer routes remain as redirects.
 */
export const DOC_SECTIONS = [
  { title: "Components", href: `${DS_ROOT}/components`, blurb: "Browse every component and effect." },
  ...docs.flatMap((category) => {
    if (category.slug === "theming") {
      return foundations.map((foundation) => ({
        title: foundation.title,
        href: `${DS_ROOT}/${foundation.slug}`,
        blurb: foundation.blurb,
      }));
    }
    if (category.slug === "typeset") return [];
    return [{
      title: category.title,
      href: `${DS_ROOT}/docs/${category.slug}`,
      blurb: category.blurb,
    }];
  }),
];

/** Absolute href for a category page. */
export function categoryHref(group: DsGroup, category: DsCategory): string {
  return group.id === "foundations"
    ? `${DS_ROOT}/${category.slug}`
    : `${group.href}/${category.slug}`;
}

/** Look up a group + category from a group id and slug. Used by page headers. */
export function findCategory(
  groupId: DsGroup["id"],
  slug: string,
): { group: DsGroup; category: DsCategory } {
  const group = DS_GROUPS.find((g) => g.id === groupId);
  if (!group) throw new Error(`Unknown design-system group: ${groupId}`);
  const category = group.categories.find((c) => c.slug === slug);
  if (!category)
    throw new Error(`Unknown ${groupId} category: ${slug}`);
  return { group, category };
}

/** Previous / next category within a group, for page-foot navigation. */
export function siblings(groupId: DsGroup["id"], slug: string) {
  const group = DS_GROUPS.find((g) => g.id === groupId);
  if (!group) return { prev: null, next: null };
  const i = group.categories.findIndex((c) => c.slug === slug);
  const at = (n: number) => {
    const c = group.categories[n];
    return c ? { title: c.title, href: categoryHref(group, c) } : null;
  };
  return { prev: i > 0 ? at(i - 1) : null, next: at(i + 1) };
}
