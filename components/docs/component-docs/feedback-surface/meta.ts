/**
 * Documentation metadata for `feedback-surface`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `feedback-surface` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "feedback-surface",
  description:
    "The two-layer iridescent bloom class applied to a toast or alert host — screened as light on dark surfaces, painted straight and masked to the corner on light ones — with a drifting sparkle overlay layered on top.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
