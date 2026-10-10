/**
 * Documentation metadata for `accordion`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `accordion` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "accordion",
  description:
    "Accordion — a vertical stack of disclosures, each header opening its own panel below it to reveal detail without leaving the page, its expand and collapse animated off the panel's measured height rather than a canned keyframe.",
  dependencies: ["source-foundation"],
  exports: ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"],
  sourcePath: "components/ui/accordion.tsx",
};
