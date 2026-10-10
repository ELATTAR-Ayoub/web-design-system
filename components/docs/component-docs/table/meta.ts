/**
 * Documentation metadata for `table`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `table` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "table",
  description:
    "Table — a semantic HTML table wrapped in its own horizontally scrolling container, with header, body, footer, row, cell and caption pieces styled to match the rest of the system.",
  dependencies: ["source-foundation"],
  exports: ["Table", "TableBody", "TableCaption", "TableCell", "TableFooter", "TableHead", "TableHeader", "TableRow"],
  sourcePath: "components/ui/table.tsx",
};
