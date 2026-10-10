import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "navigation-menu",
  description:
    "NavigationMenu — a top-level site nav whose items can open a panel.",
  dependencies: ["source-foundation"],
  exports: ["NavigationMenu", "NavigationMenuContent", "NavigationMenuIndicator", "NavigationMenuItem", "NavigationMenuLink", "NavigationMenuList", "NavigationMenuTrigger", "NavigationMenuViewport", "navigationMenuTriggerStyle"],
  sourcePath: "components/ui/navigation-menu.tsx",
};
