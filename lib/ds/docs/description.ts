export function plainDescription(description: string): string {
  return description.replace(/`/g, "");
}

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
      parts.push({ text: rest, code: false });
      break;
    }
    if (open > 0) parts.push({ text: rest.slice(0, open), code: false });
    parts.push({ text: rest.slice(open + 1, close), code: true });
    rest = rest.slice(close + 1);
  }

  return parts.filter((part) => part.text.length > 0);
}
