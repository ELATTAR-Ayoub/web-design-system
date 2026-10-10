/**
 * Documentation metadata for `marker`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `marker` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "marker",
  description:
    "A note about a list, sitting in the list — a quiet row for something that happened between the other rows, with no background and no emphasis on a matched substring.",
  dependencies: ["source-foundation"],
  exports: ["Marker", "MarkerContent", "MarkerIcon", "markerVariants"],
  sourcePath: "components/ui/marker.tsx",
};
