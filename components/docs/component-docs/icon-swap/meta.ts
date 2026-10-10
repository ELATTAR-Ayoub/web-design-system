import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "icon-swap",
  description:
    "Every icon in a set rendered as one physical strip in the same grid cell, with only the active one visible: advancing rolls the strip up and going back rolls it down, so a play/pause or a sort-direction toggle reads as one control changing rather than two icons swapping.",
  dependencies: [],
  exports: ["IconSwap"],
  sourcePath: "components/ui/icon-swap.tsx",
};
