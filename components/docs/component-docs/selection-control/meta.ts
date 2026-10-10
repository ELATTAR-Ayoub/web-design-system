/**
 * Documentation metadata for `selection-control`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `selection-control` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "selection-control",
  description:
    "Selection control — the shared name for a selection row, which on the web is Field composed with a Checkbox, Radio or Switch rather than a component of its own.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
