/**
 * Documentation metadata for `switch`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `switch` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "switch",
  description:
    "Switch — a knob sitting in a socket.",
  dependencies: ["content-change", "source-foundation"],
  exports: ["Switch"],
  sourcePath: "components/ui/switch.tsx",
};
