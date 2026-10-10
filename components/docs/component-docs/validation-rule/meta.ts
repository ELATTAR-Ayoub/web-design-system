/**
 * Documentation metadata for `validation-rule`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `validation-rule` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "validation-rule",
  description:
    "Small validation rule and issue-mode support used by composed fields and forms.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
