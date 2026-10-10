/**
 * The four documentation families, named once.
 *
 * `DocFamily` is a union of four lowercase keys in `lib/ds/platform-contract.ts`
 * — data, not presentation. Three separate files had grown their own map from
 * that key to something a reader sees: the rail's group heading, the article's
 * eyebrow, and the search palette's group. Three copies of a four-row table is
 * how a reader reaches Chart from the Charts group and is told the page is
 * "COMPONENTS / BASE".
 *
 * Both labels are written out rather than derived from each other. `.type-badge`
 * does not upper-case, so an eyebrow computed with `toUpperCase()` at render is
 * a presentational decision hiding in TypeScript — and the two are not always a
 * case change apart: the rail says "Effects" where the eyebrow says
 * "COMPONENTS / EFFECTS", because the rail's group is already nested under a
 * heading and the eyebrow has to carry the whole path on its own.
 */

import type { DocFamily } from "@/lib/ds/platform-contract";

/** The rail's group heading, and the search palette's group. */
export const FAMILY_LABEL: Record<DocFamily, string> = {
  components: "Components",
  effects: "Effects",
  agent: "Agent",
  charts: "Charts",
};

/** The kicker above a component page's title. */
export const FAMILY_EYEBROW: Record<DocFamily, string> = {
  components: "COMPONENTS",
  effects: "COMPONENTS / EFFECTS",
  agent: "COMPONENTS / AGENT",
  charts: "COMPONENTS / CHARTS",
};

/**
 * Rail and index order.
 *
 * Not alphabetical, and not the enum's declaration order by accident: this is
 * breadth first. Components is the family most readers arrive for, Effects is
 * the one they discover, and Agent and Charts are each deep enough to be their
 * own destination in the header.
 */
export const FAMILY_ORDER: readonly DocFamily[] = [
  "components",
  "effects",
  "agent",
  "charts",
];

/**
 * A family's own landing page, where it has one.
 *
 * Only Charts and Agent do, and that is deliberate rather than incomplete.
 * Both are deep enough to be worth arriving at directly — each has its own
 * header destination — and each carries prose that belongs to the family and
 * not to any one component in it: why the agent workspace is its own family and
 * what its four seams are; why chart motion has to be read out of the
 * stylesheet rather than written as a class.
 *
 * Components and Effects have no landing because they would have nothing to
 * say that `/design-system/components` does not already say better, and a
 * landing whose only content is a card grid the index already renders is a
 * second copy of a list.
 *
 * Read by the rail — where a landing is the first entry in its group, above
 * the components — and by `lib/ds/nav.ts`, so the route is registered exactly
 * once. Two readers, one declaration.
 */
export const FAMILY_LANDING: Partial<
  Record<DocFamily, { slug: string; title: string; blurb: string }>
> = {
  agent: {
    slug: "agent",
    title: "Agent overview",
    blurb:
      "Why the agent workspace is its own family, the four seams a caller supplies, and the rules that govern a component answering to something outside the product.",
  },
  charts: {
    slug: "charts",
    title: "Charts overview",
    blurb:
      "Every chart family on recharts, drawn with the five chart tokens, and the one place in this system where motion is resolved from tokens at runtime rather than applied as a class.",
  },
};
