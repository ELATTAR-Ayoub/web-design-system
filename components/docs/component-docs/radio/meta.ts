/**
 * Documentation metadata for `radio`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `radio` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "radio",
  description:
    "Radio — 20px to match Checkbox, squashes on selection, and the dot pops in on the spring curve rather than appearing. Radix only mounts the indicator when the item becomes checked, so the pop fires on every real selection.",
  dependencies: ["content-change", "source-foundation"],
  exports: ["RadioGroup", "RadioGroupItem", "RadioIndicator", "radioControlClassName"],
  sourcePath: "components/ui/radio.tsx",
};
