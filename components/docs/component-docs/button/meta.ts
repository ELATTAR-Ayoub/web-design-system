/**
 * Documentation metadata for `button`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `button` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "button",
  description:
    "Button — a pill-shaped control with seven variants, nine sizes, loading and disabled states, and a springing focus ring: for triggering an action, never for navigating to one.",
  dependencies: ["source-foundation", "spinner"],
  exports: ["Button", "ButtonLabel", "buttonVariants"],
  sourcePath: "components/ui/button.tsx",
};
