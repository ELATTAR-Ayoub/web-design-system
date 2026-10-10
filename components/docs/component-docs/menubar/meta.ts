import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "menubar",
  description:
    "Menubar — a row of always-visible menu triggers, each opening a dropdown of items, checkboxes, radios and nested submenus, for a desktop-style command bar rather than one button's own menu.",
  dependencies: ["source-foundation"],
  exports: ["Menubar", "MenubarCheckboxItem", "MenubarContent", "MenubarGroup", "MenubarItem", "MenubarLabel", "MenubarMenu", "MenubarPortal", "MenubarRadioGroup", "MenubarRadioItem", "MenubarSeparator", "MenubarShortcut", "MenubarSub", "MenubarSubContent", "MenubarSubTrigger", "MenubarTrigger"],
  sourcePath: "components/ui/menubar.tsx",
};
