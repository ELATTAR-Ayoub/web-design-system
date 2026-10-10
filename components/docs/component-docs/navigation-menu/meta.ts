/**
 * Documentation metadata for `navigation-menu`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `navigation-menu` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "navigation-menu",
  description:
    "NavigationMenu — a top-level site nav whose items can open a panel.",
  dependencies: ["source-foundation"],
  exports: ["NavigationMenu", "NavigationMenuContent", "NavigationMenuIndicator", "NavigationMenuItem", "NavigationMenuLink", "NavigationMenuList", "NavigationMenuTrigger", "NavigationMenuViewport", "navigationMenuTriggerStyle"],
  sourcePath: "components/ui/navigation-menu.tsx",
};
