import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "resizable",
  description:
    "Resizable — a panel group split by a draggable handle, for panes the user resizes themselves rather than a layout fixed by the page, in either horizontal or vertical orientation.",
  dependencies: ["source-foundation"],
  exports: ["ResizableHandle", "ResizablePanel", "ResizablePanelGroup"],
  sourcePath: "components/ui/resizable.tsx",
};
