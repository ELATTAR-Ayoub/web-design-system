/**
 * Documentation metadata for `skeleton`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `skeleton` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "skeleton",
  description:
    "Skeleton — a shimmering placeholder standing in for content that has not arrived yet, renderable inline so it can sit inside a paragraph or heading without producing invalid markup.",
  dependencies: ["source-foundation"],
  exports: ["Skeleton"],
  sourcePath: "components/ui/skeleton.tsx",
};
