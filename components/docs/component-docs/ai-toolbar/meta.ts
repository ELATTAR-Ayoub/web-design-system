import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-toolbar",
  description:
    "A row of actions that floats beside a graph node and shows when that node is selected.",
  dependencies: ["source-foundation"],
  exports: ["Toolbar"],
  sourcePath: "components/ai-elements/toolbar.tsx",
};
