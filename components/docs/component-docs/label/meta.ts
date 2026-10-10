/**
 * Documentation metadata for `label`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `label` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "label",
  description:
    "Label — the accessible caption for a form control, dimmed and inert automatically when the control it names is disabled.",
  dependencies: ["source-foundation"],
  exports: ["Label"],
  sourcePath: "components/ui/label.tsx",
};
