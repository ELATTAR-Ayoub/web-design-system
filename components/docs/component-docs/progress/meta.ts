/**
 * Documentation metadata for `progress`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `progress` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "progress",
  description:
    "Progress — the same bar as the Slider's track, because it is the same object.",
  dependencies: ["source-foundation"],
  exports: ["Progress", "progressIndicatorVariants"],
  sourcePath: "components/ui/progress.tsx",
};
