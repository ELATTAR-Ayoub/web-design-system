import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "dialog",
  description:
    "Accessible modal composition with portal, overlay, jelly transition, compact sizing, media content, header, description, and footer regions.",
  dependencies: ["button", "source-foundation"],
  exports: ["Dialog", "DialogClose", "DialogContent", "DialogDescription", "DialogFooter", "DialogHeader", "DialogMedia", "DialogOverlay", "DialogPortal", "DialogTitle", "DialogTrigger"],
  sourcePath: "components/ui/dialog.tsx",
};
