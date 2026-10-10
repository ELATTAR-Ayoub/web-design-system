/**
 * Documentation metadata for `ambient-pattern`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `ambient-pattern` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ambient-pattern",
  description:
    "Ambient pattern — the `.starfield` class: two anchored clusters of sparkles that hang off a surface's right-hand corners and rock a few degrees on periods long enough that the movement is never a movement, only the fact that the arrangement is different every time you look.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
