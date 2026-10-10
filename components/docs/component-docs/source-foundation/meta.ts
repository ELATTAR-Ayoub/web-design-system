/**
 * Documentation metadata for `source-foundation`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `source-foundation` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "source-foundation",
  description:
    "The copy-first Flutter foundation: semantic colors, themes, typography, spacing, motion, shadows, surfaces, dates, and text layout.",
  dependencies: [],
  exports: [],
  sourcePath: "styles/tokens.css",
};
