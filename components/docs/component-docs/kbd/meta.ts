/**
 * Documentation metadata for `kbd`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `kbd` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "kbd",
  description:
    "Kbd — a keyboard key or shortcut rendered as a small pill, styled to also sit legibly inside a tooltip.",
  dependencies: ["source-foundation"],
  exports: ["Kbd", "KbdGroup"],
  sourcePath: "components/ui/kbd.tsx",
};
