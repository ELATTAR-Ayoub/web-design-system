/**
 * Documentation metadata for `collapsible`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `collapsible` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "collapsible",
  description:
    "Collapsible — a single trigger-and-panel pair that expands and collapses on its own measured height, the bare primitive Accordion composes into a list of them.",
  dependencies: ["source-foundation"],
  exports: ["Collapsible", "CollapsibleContent", "CollapsibleTrigger"],
  sourcePath: "components/ui/collapsible.tsx",
};
