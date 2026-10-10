/**
 * Documentation metadata for `sheet`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `sheet` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "sheet",
  description:
    "Sheet — a dialog anchored to an edge of the screen and sliding in from it, with the same muted header and footer banding a Dialog uses, its body the only zone that scrolls so the footer's actions stay reachable.",
  dependencies: ["button", "source-foundation"],
  exports: ["Sheet", "SheetBody", "SheetClose", "SheetContent", "SheetDescription", "SheetFooter", "SheetHeader", "SheetTitle", "SheetTrigger"],
  sourcePath: "components/ui/sheet.tsx",
};
