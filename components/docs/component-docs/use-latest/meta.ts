/**
 * Documentation metadata for `use-latest`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `use-latest` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "use-latest",
  description:
    "Ref hook that always holds the latest value of a prop or callback across renders.",
  dependencies: ["source-foundation"],
  exports: ["useLatest"],
  sourcePath: "hooks/use-latest.ts",
};
