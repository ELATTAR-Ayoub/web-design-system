/**
 * Documentation metadata for `spinner`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `spinner` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "spinner",
  description:
    "Spinner — \"something is happening, and I cannot tell you how far through\".",
  dependencies: ["source-foundation"],
  exports: ["Spinner"],
  sourcePath: "components/ui/spinner.tsx",
};
