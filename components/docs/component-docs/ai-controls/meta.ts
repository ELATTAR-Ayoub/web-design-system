import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-controls",
  description:
    "The zoom in, zoom out, fit view and lock buttons for a graph, as a bordered card with 44px targets.",
  dependencies: ["source-foundation"],
  exports: ["ControlsProps","Controls"],
  sourcePath: "components/ai-elements/controls.tsx",
};
