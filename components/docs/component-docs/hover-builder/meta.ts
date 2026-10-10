/**
 * Documentation metadata for `hover-builder`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `hover-builder` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "hover-builder",
  description:
    "CSS-native hover and media-query behaviour, built with hover and group-hover pseudo-class variants and applied to a host element, instead of JavaScript-driven interaction state whenever the effect does not genuinely need it.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
