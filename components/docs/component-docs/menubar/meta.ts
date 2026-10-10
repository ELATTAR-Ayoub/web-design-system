/**
 * Documentation metadata for `menubar`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `menubar` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "menubar",
  description:
    "Menubar — a row of always-visible menu triggers, each opening a dropdown of items, checkboxes, radios and nested submenus, for a desktop-style command bar rather than one button's own menu.",
  dependencies: ["source-foundation"],
  exports: ["Menubar", "MenubarCheckboxItem", "MenubarContent", "MenubarGroup", "MenubarItem", "MenubarLabel", "MenubarMenu", "MenubarPortal", "MenubarRadioGroup", "MenubarRadioItem", "MenubarSeparator", "MenubarShortcut", "MenubarSub", "MenubarSubContent", "MenubarSubTrigger", "MenubarTrigger"],
  sourcePath: "components/ui/menubar.tsx",
};
