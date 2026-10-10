/**
 * Documentation metadata for `checkbox`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `checkbox` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "checkbox",
  description:
    "Checkbox — 20px, and the tick draws itself.",
  dependencies: ["content-change", "source-foundation"],
  exports: ["Checkbox", "CheckboxMark", "checkboxControlClassName"],
  sourcePath: "components/ui/checkbox.tsx",
};
