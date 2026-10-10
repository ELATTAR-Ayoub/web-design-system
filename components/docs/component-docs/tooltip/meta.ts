/**
 * Documentation metadata for `tooltip`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `tooltip` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "tooltip",
  description:
    "Accessible hover and focus explanation surface with semantic side and transition behavior.",
  dependencies: ["source-foundation"],
  exports: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
  sourcePath: "components/ui/tooltip.tsx",
};
