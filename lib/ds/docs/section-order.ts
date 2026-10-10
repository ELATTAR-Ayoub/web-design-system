export const SECTION_ORDER = [
  "preview",
  "installation",
  "variants",
  "states",
  "sizes",
  "examples",
  "usage",
] as const;

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
  return [...sections]
    .map((section, index) => ({ section, index }))
    .sort((a, b) => rank(a.section.id) - rank(b.section.id) || a.index - b.index)
    .map(({ section }) => section);
}
