/**
 * Documentation metadata for `stat`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `stat` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "stat",
  description:
    "Stat — a labelled figure, an optional delta, an optional trailing hint.",
  dependencies: ["skeleton", "source-foundation"],
  exports: ["Stat", "StatDelta", "StatDeltaMark", "StatDirection", "StatState"],
  sourcePath: "components/ui/stat.tsx",
};
