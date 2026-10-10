/**
 * Documentation metadata for `textarea`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `textarea` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "textarea",
  description:
    "Textarea — a multi-line text field that grows to fit its content, sharing Input's pressed shadow, focus ring and invalid state rather than defining its own.",
  dependencies: ["source-foundation"],
  exports: ["Textarea"],
  sourcePath: "components/ui/textarea.tsx",
};
