/**
 * An item's public exports, rendered as a list of code chips.
 *
 * Its own file rather than a helper inside `sections.tsx` because every
 * generated baseline page imports it, and a section renderer that 102 pages
 * import is a different thing from the section renderers themselves.
 *
 * This is the export LIST, not the API reference. A real API Reference
 * documents each export's props, defaults and types; that is authored per item.
 * Showing the list meanwhile is honest — it is read from the module, so it
 * cannot claim an export that does not exist — and it is visibly not a prop
 * table, so it cannot be mistaken for one.
 */

import { Code } from "@/components/ds/kit";

export function ExportList({ exports }: { exports: readonly string[] }) {
  if (exports.length === 0) {
    return (
      <p className="type-small text-muted-foreground">
        This capability has no JavaScript surface.
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {exports.map((name) => (
        <li key={name}>
          <Code>{name}</Code>
        </li>
      ))}
    </ul>
  );
}
