/**
 * Documentation metadata for `active-indicator`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `active-indicator` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "active-indicator",
  description:
    "The travelling selection pill — `components/ui/sliding-indicator.tsx` plus",
  dependencies: ["source-foundation"],
  exports: ["ActiveIndicator", "useActiveIndicator"],
  sourcePath: "components/ui/active-indicator.tsx",
};
