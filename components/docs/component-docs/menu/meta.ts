/**
 * Documentation metadata for `menu`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `menu` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "menu",
  description:
    "Menu — the shared name for this system's three menu components: DropdownMenu anchored to a trigger, ContextMenu at the pointer, and Menubar as a row of them; there is no separate menu module on the web, and the page says why.",
  dependencies: [],
  exports: [],
  sourcePath: null,
};
