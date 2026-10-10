/**
 * Documentation metadata for `reveal-bloom`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `reveal-bloom` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "reveal-bloom",
  description:
    "Two radial brand glows — `bloom-action` and `bloom-value` — for a reveal stage or an opening moment: a static ellipse of the action or value ramp mixed toward transparent, sitting behind a surface. Web-only; Flutter has no counterpart.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
