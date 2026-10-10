/**
 * Documentation metadata for `button-group`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `button-group` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "button-group",
  description:
    "ButtonGroup — fuses adjacent buttons, inputs, and selects into one visually continuous control, horizontal or vertical, joining their borders and corner radii at the seam.",
  dependencies: ["separator", "source-foundation"],
  exports: ["ButtonGroup", "ButtonGroupSeparator", "ButtonGroupText", "buttonGroupVariants"],
  sourcePath: "components/ui/button-group.tsx",
};
