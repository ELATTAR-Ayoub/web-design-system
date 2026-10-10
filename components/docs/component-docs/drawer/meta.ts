import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "drawer",
  description:
    "Drawer — a panel that slides in from an edge of the screen and can be dragged shut, built on vaul.",
  dependencies: ["source-foundation"],
  exports: ["Drawer", "DrawerBody", "DrawerClose", "DrawerContent", "DrawerDescription", "DrawerFooter", "DrawerHeader", "DrawerOverlay", "DrawerPortal", "DrawerTitle", "DrawerTrigger"],
  sourcePath: "components/ui/drawer.tsx",
};
