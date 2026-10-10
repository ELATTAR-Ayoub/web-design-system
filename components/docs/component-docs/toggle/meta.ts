/**
 * Documentation metadata for `toggle`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `toggle` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "toggle",
  description:
    "Toggle — a single two-state button that stays visibly pressed once activated, for a setting the user switches on or off rather than an action that fires once.",
  dependencies: ["source-foundation"],
  exports: ["Toggle", "toggleVariants"],
  sourcePath: "components/ui/toggle.tsx",
};
