/**
 * Documentation metadata for `direction`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `direction` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "direction",
  description:
    "DirectionProvider — sets the reading direction, ltr or rtl, that every direction-aware component beneath it reads, defaulting to ltr when none is given.",
  dependencies: ["source-foundation"],
  exports: ["DirectionProvider", "useDirection"],
  sourcePath: "components/ui/direction.tsx",
};
