/**
 * Documentation metadata for `field`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `field` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "field",
  description:
    "Accessible field composition with labels, descriptions, errors, orientation, grouping, and validation wiring.",
  dependencies: ["label", "separator", "source-foundation"],
  exports: ["Field", "FieldContent", "FieldDescription", "FieldError", "FieldGroup", "FieldLabel", "FieldLegend", "FieldSeparator", "FieldSet", "FieldTitle"],
  sourcePath: "components/ui/field.tsx",
};
