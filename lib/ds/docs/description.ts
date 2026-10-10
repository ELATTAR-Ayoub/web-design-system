/**
 * One description, four readers, two renderings.
 *
 * `meta.description` is the single authoritative sentence for a capability. It
 * is read by the rail's blurb, the search palette, the `<meta name="description">`
 * tag and the page's own hero — and seven of them name an identifier, which the
 * author reasonably wrote in backticks.
 *
 * Three of those four readers are PLAIN TEXT. A `<meta>` tag showing
 * `` `AreaChart` `` is a search result with punctuation in it, and a rail blurb
 * is a line of prose. Only the hero can render markup — and it was not, so the
 * chart pages printed literal backticks in 32px type. Found by looking at the
 * page on a phone, which is the only way it could have been.
 *
 * So: `plainDescription` for the three, and `descriptionParts` for the one that
 * can do better. Deliberately NOT a markdown parser — the only markup a
 * one-sentence description may carry is an inline code span, because the only
 * thing it ever needs to distinguish is an identifier from a word. Anything
 * more belongs in the page body.
 */

/** The description with its code fences removed, for plain-text readers. */
export function plainDescription(description: string): string {
  return description.replace(/`/g, "");
}

/**
 * The description split into prose and code runs, in order.
 *
 * An unmatched backtick is left as prose rather than swallowing the rest of the
 * sentence — a typo should look like a typo, not delete half the line.
 */
export function descriptionParts(
  description: string,
): { text: string; code: boolean }[] {
  const parts: { text: string; code: boolean }[] = [];
  let rest = description;

  while (rest.length > 0) {
    const open = rest.indexOf("`");
    if (open === -1) {
      parts.push({ text: rest, code: false });
      break;
    }
    const close = rest.indexOf("`", open + 1);
    if (close === -1) {
      // Unmatched. Everything left is prose, backtick included.
      parts.push({ text: rest, code: false });
      break;
    }
    if (open > 0) parts.push({ text: rest.slice(0, open), code: false });
    parts.push({ text: rest.slice(open + 1, close), code: true });
    rest = rest.slice(close + 1);
  }

  return parts.filter((part) => part.text.length > 0);
}
