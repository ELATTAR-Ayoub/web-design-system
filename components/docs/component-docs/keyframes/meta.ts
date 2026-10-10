/**
 * Documentation metadata for `keyframes`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `keyframes` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "keyframes",
  description:
    "Every named animation timeline defined in the motion stylesheet, referenced by name from the system's own animation utility classes rather than applied directly to an element.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
