/**
 * Documentation metadata for `background-effect`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `background-effect` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "background-effect",
  description:
    "The page atmosphere: the `body` radial gradient that reads `--page-glow` and sits fixed behind every page, so a flat fill at zinc 950 reads as a deep room rather than as black paint. It does not animate, and it is the floor everything else stands on.",
  dependencies: [],
  exports: [],
  sourcePath: "styles/tokens.css",
};
