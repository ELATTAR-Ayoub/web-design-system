import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "alert-dialog",
  description:
    "Confirmation dialog support component for consequential actions, composed with the dialog, button, and tooltip contracts.",
  dependencies: ["button", "source-foundation", "spinner", "tooltip"],
  exports: ["AlertDialog", "AlertDialogAction", "AlertDialogCancel", "AlertDialogContent", "AlertDialogDescription", "AlertDialogFooter", "AlertDialogHeader", "AlertDialogMedia", "AlertDialogOverlay", "AlertDialogPortal", "AlertDialogTitle", "AlertDialogTrigger"],
  sourcePath: "components/ui/alert-dialog.tsx",
};
