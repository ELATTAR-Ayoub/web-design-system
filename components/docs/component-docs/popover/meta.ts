/**
 * Documentation metadata for `popover`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `popover` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "popover",
  description:
    "Anchored overlay surface with semantic placement, barrier, alignment, and token-backed transition behavior.",
  dependencies: ["source-foundation"],
  exports: ["Popover", "PopoverAnchor", "PopoverContent", "PopoverDescription", "PopoverHeader", "PopoverTitle", "PopoverTrigger"],
  sourcePath: "components/ui/popover.tsx",
};
