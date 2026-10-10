/**
 * Documentation metadata for `context-menu`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `context-menu` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "context-menu",
  description:
    "ContextMenu — a menu that opens at the pointer on right-click rather than against a trigger box, with checkbox items, radio items, and nested submenus.",
  dependencies: ["source-foundation"],
  exports: ["ContextMenu", "ContextMenuCheckboxItem", "ContextMenuContent", "ContextMenuGroup", "ContextMenuItem", "ContextMenuLabel", "ContextMenuPortal", "ContextMenuRadioGroup", "ContextMenuRadioItem", "ContextMenuSeparator", "ContextMenuShortcut", "ContextMenuSub", "ContextMenuSubContent", "ContextMenuSubTrigger", "ContextMenuTrigger"],
  sourcePath: "components/ui/context-menu.tsx",
};
