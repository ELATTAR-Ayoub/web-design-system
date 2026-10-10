/**
 * Documentation metadata for `scroll-area`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `scroll-area` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "scroll-area",
  description:
    "Scroll area — a viewport with its own drawn scrollbar that stays reachable by keyboard, a tab stop in its own right so hiding the native scrollbar never leaves the content behind it unreachable.",
  dependencies: ["source-foundation"],
  exports: ["ScrollArea", "ScrollBar"],
  sourcePath: "components/ui/scroll-area.tsx",
};
