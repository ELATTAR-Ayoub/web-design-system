import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "button-group",
  description:
    "ButtonGroup — fuses adjacent buttons, inputs, and selects into one visually continuous control, horizontal or vertical, joining their borders and corner radii at the seam.",
  dependencies: ["separator", "source-foundation"],
  exports: ["ButtonGroup", "ButtonGroupSeparator", "ButtonGroupText", "buttonGroupVariants"],
  sourcePath: "components/ui/button-group.tsx",
};
