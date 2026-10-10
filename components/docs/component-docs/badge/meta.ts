/**
 * Documentation metadata for `badge`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `badge` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "badge",
  description:
    "A flat chip for a status, a count or a category — eleven variants over one type role, sentence case unless the call site uppercases, and no gradient or shadow since Flutter 0.0.3 ruled them out of badges.",
  dependencies: ["source-foundation"],
  exports: ["Badge", "badgeVariants"],
  sourcePath: "components/ui/badge.tsx",
};
