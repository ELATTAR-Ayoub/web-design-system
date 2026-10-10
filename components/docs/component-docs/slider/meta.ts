/**
 * Documentation metadata for `slider`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `slider` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "slider",
  description:
    "Slider — taller, and built from the same raised/recessed pair as the switch.",
  dependencies: ["source-foundation"],
  exports: ["Slider"],
  sourcePath: "components/ui/slider.tsx",
};
