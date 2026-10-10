/**
 * The metadata half of a documentation pair.
 *
 * Every catalog item is two files in `components/docs/component-docs/<name>/`:
 * a `meta.ts` exporting one of these, and a `page.tsx` exporting a
 * `ComponentDocSpec`. Neither may exist without the other — metadata with no
 * page synthesises a route with nothing at the end of it, and a page with no
 * metadata is unreachable from navigation and search.
 *
 * WHAT IS DELIBERATELY NOT HERE: family, ownership, delivery, title, and the
 * install command. Those come from `lib/ds/platform-contract.ts` and the
 * generated `public/r/commands.json`, so a page cannot claim a classification
 * or an install path that the contract and the registry disagree with. The
 * previous documentation typed a family eyebrow on each page by hand, and
 * ninety-nine pages between them claimed eight different taxonomies.
 */

export type ComponentDocMeta = {
  /** Must match a `PLATFORM_CONTRACT` entry. Route, item and slug are all this. */
  readonly name: string;
  /**
   * One sentence. Used by navigation, search, and the page's own hero line —
   * read once, never restated, so those three cannot describe it differently.
   *
   * An empty string means nobody has written one yet. That is a real gap, and
   * `test/docs/catalog-wiring.test.ts` reports it rather than letting a page
   * ship with a blank hero.
   */
  readonly description: string;
  /** Registry dependencies, bare-named, mirroring this item's registry entry. */
  readonly dependencies: readonly string[];
  /** Public exports, as the API Reference section must document them. */
  readonly exports: readonly string[];
  /** Repository-relative source path, or `null` for a capability with no file. */
  readonly sourcePath: string | null;
  /**
   * Whether the documentation rail lists this entry under its family group.
   *
   * Routable and searchable either way — this narrows the rail only. The four
   * `chart*` entries set it `false` because the Charts landing gallery leads
   * that group and links all four from its own body; repeating them one line
   * below would be the group listing its own contents twice.
   */
  readonly showInRail?: boolean;
};
