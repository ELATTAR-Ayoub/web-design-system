/**
 * Documentation metadata for `native-select`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `native-select` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "native-select",
  description:
    "Native select — a styled wrapper around the browser's own select element, kept for pickers that should behave like a native form control rather than opening a custom listbox.",
  dependencies: ["source-foundation"],
  exports: ["NativeSelect", "NativeSelectOptGroup", "NativeSelectOption"],
  sourcePath: "components/ui/native-select.tsx",
};
