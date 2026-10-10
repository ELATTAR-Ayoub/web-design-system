/**
 * Documentation metadata for `use-mobile`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `use-mobile` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "use-mobile",
  description:
    "Media-query hook that reports whether the viewport is at the mobile breakpoint.",
  dependencies: ["source-foundation"],
  exports: ["useIsMobile"],
  sourcePath: "hooks/use-mobile.ts",
};
