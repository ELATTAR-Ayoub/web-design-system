/**
 * Documentation metadata for `toggle-group`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `toggle-group` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "toggle-group",
  description:
    "Toggle group — a row or column of toggles acting as one control, with a single indicator that slides to the pressed item rather than each item lighting up its own background.",
  dependencies: ["active-indicator", "source-foundation", "toggle"],
  exports: ["ToggleGroup", "ToggleGroupItem"],
  sourcePath: "components/ui/toggle-group.tsx",
};
