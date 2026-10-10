import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "dropdown-menu",
  description:
    "DropdownMenu — a menu anchored to its trigger rather than the pointer, with checkbox items, radio items, and nested submenus.",
  dependencies: ["source-foundation"],
  exports: ["DropdownMenu", "DropdownMenuCheckboxItem", "DropdownMenuContent", "DropdownMenuGroup", "DropdownMenuItem", "DropdownMenuLabel", "DropdownMenuPortal", "DropdownMenuRadioGroup", "DropdownMenuRadioItem", "DropdownMenuSeparator", "DropdownMenuShortcut", "DropdownMenuSub", "DropdownMenuSubContent", "DropdownMenuSubTrigger", "DropdownMenuTrigger"],
  sourcePath: "components/ui/dropdown-menu.tsx",
};
