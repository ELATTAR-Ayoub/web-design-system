/**
 * Documentation metadata for `prose`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `prose` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "prose",
  description:
    "Prose — a thin, deliberately unstyled owner for long-form authored content, its headings sharing one definition with the type scale rather than repeating it under a second selector.",
  dependencies: ["source-foundation"],
  exports: ["Prose"],
  sourcePath: "components/ui/prose.tsx",
};
