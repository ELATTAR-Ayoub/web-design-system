/**
 * Documentation metadata for `user-menu`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `user-menu` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "user-menu",
  description:
    "User menu — the account row a sidebar footer needs: identity, a dropdown of items with destructive actions set apart below a separator, opening beside the row on desktop and below it once the layout narrows.",
  dependencies: ["avatar", "dropdown-menu", "sidebar", "source-foundation"],
  exports: ["UserMenu", "UserMenuItem"],
  sourcePath: "components/ui/user-menu.tsx",
};
