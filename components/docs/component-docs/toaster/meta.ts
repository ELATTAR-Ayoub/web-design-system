import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "toaster",
  description:
    "Toaster — this system's capability for transient, self-dismissing status notifications, themed to the current light or dark mode and iconed by type rather than left to its underlying library's defaults.",
  dependencies: ["source-foundation"],
  exports: ["TOAST_ICONS", "ToastType", "Toaster"],
  sourcePath: "components/ui/toaster.tsx",
};
