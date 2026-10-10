/**
 * Documentation metadata for `icon-swap`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `icon-swap` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "icon-swap",
  description:
    "Every icon in a set rendered as one physical strip in the same grid cell, with only the active one visible: advancing rolls the strip up and going back rolls it down, so a play/pause or a sort-direction toggle reads as one control changing rather than two icons swapping.",
  dependencies: [],
  exports: ["IconSwap"],
  sourcePath: "components/ui/icon-swap.tsx",
};
