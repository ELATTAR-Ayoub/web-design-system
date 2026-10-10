/**
 * Documentation metadata for `select`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `select` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "select",
  description:
    "Generic typed select with grouped options, separators, labels, keyboard-friendly menu behavior, sizes, and scroll controls.",
  dependencies: ["source-foundation"],
  exports: ["Select", "SelectContent", "SelectGroup", "SelectItem", "SelectLabel", "SelectScrollDownButton", "SelectScrollUpButton", "SelectSeparator", "SelectTrigger", "SelectValue"],
  sourcePath: "components/ui/select.tsx",
};
