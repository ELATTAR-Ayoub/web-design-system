import { catalogEntries } from "@/lib/ds/docs/catalog";
import { plainDescription } from "@/lib/ds/docs/description";
import { FAMILY_LANDING, FAMILY_ORDER } from "@/lib/ds/families";
import type { DocFamily } from "@/lib/ds/platform-contract";

export type DsCategory = {
  family?: DocFamily;
  slug: string;
  title: string;
  blurb: string;
  contents: string[];
};

export type DsGroup = {
  id: "foundations" | "catalog" | "docs";
  title: string;
  href: string;
  blurb: string;
  categories: DsCategory[];
};

export const DS_ROOT = "/design-system";

const foundations: DsCategory[] = [
  {
    slug: "colors",
    title: "Theming",
    blurb:
      "Zinc for everything structural, the action and value ramps, four state hues and the text-safe end of each — with every contrast ratio measured live in whichever theme you are in, rather than claimed.",
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
    blurb:
      "Two faces only: Inter for every word, Geist Mono for code, identifiers and figures. Seventeen roles, live at the size they render, plus the prose block that reaches the same scale without a class.",
    contents: [
      "Faces",
      "The seventeen roles",
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

const catalog: DsCategory[] = [
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
  blurb: plainDescription(meta.description),
  contents: [],
  })),
  {
    family: "agent",
    slug: "agent-workspace/why",
    title: "Why these components",
    blurb:
      "One card per workspace component: what it is, where it sits, why it beats the part beside it, and what changed from its source — plus what was left out.",
    contents: [],
  },
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

export function categoryHref(group: DsGroup, category: DsCategory): string {
  return group.id === "foundations"
    ? `${DS_ROOT}/${category.slug}`
    : `${group.href}/${category.slug}`;
}

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
