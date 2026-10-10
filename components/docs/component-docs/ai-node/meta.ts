import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "ai-node",
  description:
    "The card that is one node of a workflow graph, built from the system's Card with optional left and right connection handles.",
  dependencies: ["source-foundation"],
  exports: ["NodeProps","Node","NodeHeaderProps","NodeHeader","NodeTitleProps","NodeTitle","NodeDescriptionProps","NodeDescription","NodeActionProps","NodeAction","NodeContentProps","NodeContent","NodeFooterProps","NodeFooter"],
  sourcePath: "components/ai-elements/node.tsx",
};
