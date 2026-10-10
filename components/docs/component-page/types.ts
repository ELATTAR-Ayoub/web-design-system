/**
 * The closed section vocabulary every component documentation page is built
 * from.
 *
 * Five variants and no sixth. That is the point: the table of contents is
 * DERIVED from a page's declared sections rather than hand-listed beside them,
 * so a section cannot exist without a rail entry and a rail entry cannot point
 * at nothing. The previous documentation kept anchors in `lib/ds/nav.ts`'s
 * `contents` array, typed by hand, and that array drifted — the colours page
 * listed three sections it did not have and missed one it did.
 *
 * A page is DATA here, not markup: `ComponentDocSpec` is a value, and
 * `ComponentDocPage` renders it. That is what lets `scripts/validate-docs.mjs`
 * and the tests under `test/docs/` check a page's shape — required sections,
 * anchor uniqueness, install honesty — without rendering React.
 *
 * @see components/docs/component-page/sections.tsx — the renderers
 * @see lib/ds/docs/catalog.ts — the metadata half of the pair
 */

import { orderSections } from "@/lib/ds/docs/section-order";
import type { ReactNode } from "react";

/** Fields every section shares. `id` is its anchor and its TOC target. */
type SectionBase = {
  /** Kebab-case, unique within the page. Becomes `#id` and the TOC link. */
  readonly id: string;
  /** The heading, and the TOC label. One string, used twice, never retyped. */
  readonly title: string;
  readonly description?: string;
};

/**
 * A live specimen of the component itself, plus the source that produced it.
 *
 * Use for anything a reader places: a Button, a Dialog, a Table. The specimen
 * must be the REAL component — a picture of one, or a div styled to look like
 * one, is the failure this section type exists to make awkward.
 */
export type ShowcaseSection = SectionBase & {
  readonly kind: "showcase";
  readonly render: ReactNode;
  /** Source for the specimen above. Omitted when the specimen IS the snippet. */
  readonly source?: string;
  /** Panel label, e.g. "Variants". Defaults to the section title. */
  readonly label?: string;
  /**
   * Remove the stage's padding, for a specimen that should reach the frame
   * edge — a sidebar, a full-bleed chart, an app shell.
   *
   * The stage supplies its own padding by default because most specimens are
   * loose controls that would otherwise sit against a border. A specimen that
   * draws its own frame gets two.
   */
  readonly flush?: boolean;
  /**
   * Only meaningful on the `"preview"` section. An ordinary preview stage
   * centres its specimen and caps it at `max-w-3xl` (768px) — right for a
   * button or a card, but it starves a CONTAINER-QUERY component (one that
   * lays out by its own rendered width, e.g. `agent-workspace`) of the width
   * it needs to ever reach its own wider layouts, no matter how wide the
   * reader's viewport actually is. `wide: true` drops that cap so the stage
   * fills the article's own width instead — still inside the shell's
   * `--width-content` measure (`app/design-system/layout.tsx`), never past
   * it; that is what `/agent-workspace/live` is for.
   */
  readonly wide?: boolean;
};

/**
 * A capability APPLIED to a host element, rather than a component placed on a
 * page.
 *
 * The Effects family is mostly CSS: `glass`, `press`, `premium-surface`,
 * `media-scrim`. There is no `<Glass>` to render, so the specimen is some
 * neutral host wearing the class, and the source shows the class on the host.
 * Rendering these as if they were components is how a system ends up with a
 * `.tsx` file that forwards `className` and `children` and nothing else.
 */
export type EffectSection = SectionBase & {
  readonly kind: "effect";
  readonly render: ReactNode;
  readonly source?: string;
  /**
   * Panel label, e.g. "On a card". Defaults to the section title.
   *
   * Added because five Effects pages, written independently, all reached for it
   * — `ShowcaseSection` has one and this did not, and nothing about an effect
   * makes its panel less in need of a label than a specimen's. Five identical
   * "mistakes" in a row is a missing affordance, not five authors being wrong.
   */
  readonly label?: string;
  /** The canonical class or token the effect is delivered as. */
  readonly appliedAs?: string;
};

/**
 * How this item actually reaches a consumer.
 *
 * DELIBERATELY HAS NO `command` FIELD. The command is derived from the item's
 * ownership in `lib/ds/platform-contract.ts` and read from the generated
 * `public/r/commands.json`; a page cannot type one. That is the whole reason
 * this is a section type rather than prose: a dependency item, a CSS
 * capability and an npm package each have a different true answer, and the
 * previous pages printed `npx shadcn add …` for all of them.
 */
export type InstallSection = SectionBase & {
  readonly kind: "install";
  /** Extra prose beneath the derived delivery block. */
  readonly notes?: ReactNode;
};

/** A focused usage snippet. Code only — no live render. */
export type SnippetSection = SectionBase & {
  readonly kind: "snippet";
  readonly code: string;
  readonly language?: "tsx" | "ts" | "css" | "bash" | "json";
};

/** One labelled block inside a disclosure — a prop table, a state list, prose. */
export type DisclosureBlock = {
  readonly label?: string;
  readonly body: ReactNode;
  /**
   * Opt this block into the rail as a nested anchor under its section.
   *
   * Kebab-case and unique within the page; it becomes the block's element id
   * and a second-level entry in "ON THIS PAGE". Most blocks should NOT have
   * one — see the type below for why — but an API Reference that documents
   * four separate exports is genuinely four destinations, and a reader hunting
   * `ChartTooltipContent` should not have to scroll a section to find it.
   */
  readonly anchor?: string;
};

/**
 * Prose and tables: API Reference, States, Accessibility, Keyboard,
 * Responsive, Source.
 *
 * Blocks carry their own labels and, by default, NOT their own anchors. Six
 * nested prop tables under API Reference used to own six TOP-LEVEL rail links
 * each, which made the rail longer than the page.
 *
 * A block may opt back in with `anchor`, and the difference from the version
 * that failed is that it nests: a block anchor is a second-level entry under
 * its section rather than a peer of it, so the rail still reads as a page
 * outline. Use it where the blocks are genuinely separate destinations — one
 * per exported component in an API Reference — and not to give every paragraph
 * a link.
 */
export type DisclosureSection = SectionBase & {
  readonly kind: "disclosure";
  readonly blocks: readonly DisclosureBlock[];
};

export type DocSection =
  | ShowcaseSection
  | EffectSection
  | InstallSection
  | SnippetSection
  | DisclosureSection;

/**
 * One documentation page, as data.
 *
 * `name` must match a `PLATFORM_CONTRACT` entry — the route, the metadata and
 * the registry item are all keyed on it. There is no `title` or `description`
 * here on purpose: those live in the item's `meta.ts` and are read once, so a
 * page and its navigation entry cannot describe the same component
 * differently.
 */
export type ComponentDocSpec = {
  readonly name: string;
  readonly sections: readonly DocSection[];
  /**
   * Required sections this capability genuinely does not have, and why.
   *
   * The migration plan asks every page for ten sections "where applicable", and
   * that qualifier is load-bearing: a CSS utility has no API Reference, a
   * `Separator` has no keyboard behaviour, and a hook has no preview in the
   * sense the word usually means. An empty section written to satisfy a
   * checklist is worse than an absent one — it is a page telling a reader
   * something when it has nothing to say.
   *
   * But "absent" and "absent on purpose" look identical from outside, which is
   * how a hundred pages end up quietly missing the same section. So an omission
   * is DECLARED, with a sentence a reader could disagree with, and
   * `docs/contracts/documentation-parity-ledger.md` prints the reason rather
   * than a dash.
   *
   * Keyed by section id — `usage`, `api`, `states`, `accessibility`,
   * `keyboard`, `responsive`. Declaring one for a section the page DOES have is
   * a contradiction, and `scripts/validate-docs.mjs` fails on it.
   */
  readonly omitted?: Readonly<Record<string, string>>;
  /**
   * The page gives its article the whole content width.
   *
   * On extra-wide screens a component page splits into the article and a 15rem
   * table-of-contents rail, which leaves the article about 790px. That is plenty
   * for prose and for almost every specimen, and not enough for a component that
   * lays out by its own width and has a genuinely wide layout of its own — the
   * agent workspace needs 64rem before its third column exists at all. `wide`
   * drops the rail and keeps the horizontal anchor strip at every width instead,
   * so the page still has its table of contents.
   */
  readonly wide?: boolean;
};

/**
 * One rail entry. Derived from a section; never authored.
 *
 * `children` is exactly one level deep and always will be. A table of contents
 * that recurses is a second copy of the page, and the reader who needed it
 * would have been better served by a shorter page.
 */
export type TocEntry = {
  readonly id: string;
  readonly title: string;
  readonly children?: readonly TocEntry[];
};

/**
 * The table of contents for a page: one entry per declared section, in
 * declaration order, plus any blocks that opted into an anchor nested under
 * their section.
 */
export function tocFor(spec: ComponentDocSpec): TocEntry[] {
  return orderSections(spec.sections).map((section) => {
    const children =
      section.kind === "disclosure"
        ? section.blocks
            .filter((block) => block.anchor && block.label)
            .map((block) => ({ id: block.anchor!, title: block.label! }))
        : [];
    return children.length
      ? { id: section.id, title: section.title, children }
      : { id: section.id, title: section.title };
  });
}

/**
 * Every anchor a page declares, flattened — both levels, in reading order.
 *
 * Two callers, one list. The scroll-spy observes it, so a nested API entry
 * highlights when the reader reaches it rather than leaving its parent section
 * lit for the whole scroll; and the structural tests assert it is unique,
 * because two elements sharing an id means one of the outline's links silently
 * goes to the wrong place.
 *
 * It used to return section ids only. That was correct while blocks could not
 * carry anchors, and would have quietly stopped checking the moment they
 * could — a uniqueness test that does not see half the ids passes for the
 * wrong reason.
 */
export function anchorsFor(spec: ComponentDocSpec): string[] {
  return tocFor(spec).flatMap((entry) => [
    entry.id,
    ...(entry.children ?? []).map((child) => child.id),
  ]);
}
