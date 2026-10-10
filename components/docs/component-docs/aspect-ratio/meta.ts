/**
 * Documentation metadata for `aspect-ratio`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `aspect-ratio` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "aspect-ratio",
  description:
    "AspectRatio — a bare layout primitive that locks a child element to a fixed width-to-height ratio, with no styling of its own to override.",
  dependencies: ["source-foundation"],
  exports: ["AspectRatio"],
  sourcePath: "components/ui/aspect-ratio.tsx",
};
