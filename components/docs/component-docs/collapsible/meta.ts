import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "collapsible",
  description:
    "Collapsible — a single trigger-and-panel pair that expands and collapses on its own measured height, the bare primitive Accordion composes into a list of them.",
  dependencies: ["source-foundation"],
  exports: ["Collapsible", "CollapsibleContent", "CollapsibleTrigger"],
  sourcePath: "components/ui/collapsible.tsx",
};
