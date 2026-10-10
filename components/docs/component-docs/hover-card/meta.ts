/**
 * Documentation metadata for `hover-card`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `hover-card` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "hover-card",
  description:
    "HoverCard — a preview panel that opens on hover or focus of its trigger, for a peek at content that stops short of a click.",
  dependencies: ["source-foundation"],
  exports: ["HoverCard", "HoverCardContent", "HoverCardTrigger"],
  sourcePath: "components/ui/hover-card.tsx",
};
