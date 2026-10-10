import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-canvas",
  description:
    "The React Flow surface that draws a graph of nodes and edges, on the system's colours, scrolled by wheel and trackpad.",
  dependencies: ["source-foundation"],
  exports: ["Canvas"],
  sourcePath: "components/ai-elements/canvas.tsx",
};
