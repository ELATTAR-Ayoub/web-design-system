/**
 * Documentation metadata for `use-reduced-motion`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `use-reduced-motion` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "use-reduced-motion",
  description:
    "Hook that reads the user's prefers-reduced-motion setting reactively.",
  dependencies: ["source-foundation"],
  exports: ["usePrefersReducedMotion"],
  sourcePath: "hooks/use-reduced-motion.ts",
};
