/**
 * Documentation metadata for `separator`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `separator` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "separator",
  description:
    "Separator — a thin dividing line between sections, horizontal or vertical, decorative by default so it stays out of the accessibility tree unless told it carries meaning.",
  dependencies: ["source-foundation"],
  exports: ["Separator"],
  sourcePath: "components/ui/separator.tsx",
};
