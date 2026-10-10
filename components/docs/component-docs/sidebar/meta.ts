/**
 * Documentation metadata for `sidebar`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `sidebar` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "sidebar",
  description:
    "Sidebar — the app's collapsible navigation shell: groups, menu items, submenus, a mobile drawer and a narrow icon rail, collapsing by icon or off-canvas and toggled from the keyboard as well as its own trigger.",
  dependencies: ["active-indicator", "badge", "button", "collapsible", "input", "separator", "sheet", "skeleton", "source-foundation", "tooltip", "use-mobile"],
  exports: ["Sidebar", "SidebarCollapsibleGroup", "SidebarContent", "SidebarFooter", "SidebarGroup", "SidebarGroupAction", "SidebarGroupContent", "SidebarGroupLabel", "SidebarHeader", "SidebarInput", "SidebarInset", "SidebarMenu", "SidebarMenuAction", "SidebarMenuBadge", "SidebarMenuButton", "SidebarMenuItem", "SidebarMenuSkeleton", "SidebarMenuSub", "SidebarMenuSubButton", "SidebarMenuSubItem", "SidebarProvider", "SidebarRail", "SidebarSeparator", "SidebarTrigger", "useSidebar"],
  sourcePath: "components/ui/sidebar.tsx",
};
