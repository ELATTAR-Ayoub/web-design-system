/**
 * Documentation metadata for `drawer`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `drawer` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "drawer",
  description:
    "Drawer — a panel that slides in from an edge of the screen and can be dragged shut, built on vaul.",
  dependencies: ["source-foundation"],
  exports: ["Drawer", "DrawerBody", "DrawerClose", "DrawerContent", "DrawerDescription", "DrawerFooter", "DrawerHeader", "DrawerOverlay", "DrawerPortal", "DrawerTitle", "DrawerTrigger"],
  sourcePath: "components/ui/drawer.tsx",
};
