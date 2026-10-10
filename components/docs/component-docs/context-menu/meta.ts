import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "context-menu",
  description:
    "ContextMenu — a menu that opens at the pointer on right-click rather than against a trigger box, with checkbox items, radio items, and nested submenus.",
  dependencies: ["source-foundation"],
  exports: ["ContextMenu", "ContextMenuCheckboxItem", "ContextMenuContent", "ContextMenuGroup", "ContextMenuItem", "ContextMenuLabel", "ContextMenuPortal", "ContextMenuRadioGroup", "ContextMenuRadioItem", "ContextMenuSeparator", "ContextMenuShortcut", "ContextMenuSub", "ContextMenuSubContent", "ContextMenuSubTrigger", "ContextMenuTrigger"],
  sourcePath: "components/ui/context-menu.tsx",
};
