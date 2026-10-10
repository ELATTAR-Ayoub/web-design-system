/**
 * The order every component page tells its story in, and which chapters stand
 * open.
 *
 * The owner's call: a reader meets the component (Preview), installs it, sees
 * what it comes in (Variants), what it does (States), how big it comes
 * (Sizes), what it looks like in use (Examples), how to write it (Usage) —
 * and then the reference material, which is there when needed and closed
 * until then. Pages declare sections in whatever order their author wrote
 * them; the shell sorts, so no page can drift from this.
 *
 * Anything not named here keeps its authored order after `usage` — the
 * reference sections (`api`, `accessibility`, `keyboard`, `responsive`,
 * `reduced-motion`, `source`) and the occasional page-specific one.
 */
export const SECTION_ORDER = [
  "preview",
  "installation",
  "variants",
  "states",
  "sizes",
  "examples",
  "usage",
] as const;

/** Sections that render open. Everything else is a closed `<details>`. */
export const OPEN_BY_DEFAULT: ReadonlySet<string> = new Set([
  "preview",
  "installation",
  "variants",
  "sizes",
  "examples",
  "usage",
]);

export function orderSections<T extends { id: string }>(sections: readonly T[]): T[] {
  const rank = (id: string) => {
    const i = (SECTION_ORDER as readonly string[]).indexOf(id);
    return i === -1 ? SECTION_ORDER.length : i;
  };
  // Stable: equal ranks keep authored order.
  return [...sections]
    .map((section, index) => ({ section, index }))
    .sort((a, b) => rank(a.section.id) - rank(b.section.id) || a.index - b.index)
    .map(({ section }) => section);
}
