/**
 * Documentation metadata for `premium-surface`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `premium-surface` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "premium-surface",
  description:
    "Rationed value foil effect for premium and reward surfaces.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
