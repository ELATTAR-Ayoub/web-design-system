import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-edge",
  description:
    "The two custom edge types for a workflow graph: a travelling-dot edge for work in flight and a dashed edge for a path not taken.",
  dependencies: ["source-foundation"],
  exports: ["Edge"],
  sourcePath: "components/ai-elements/edge.tsx",
};
