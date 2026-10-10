import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "popover",
  description:
    "Anchored overlay surface with semantic placement, barrier, alignment, and token-backed transition behavior.",
  dependencies: ["source-foundation"],
  exports: ["Popover", "PopoverAnchor", "PopoverContent", "PopoverDescription", "PopoverHeader", "PopoverTitle", "PopoverTrigger"],
  sourcePath: "components/ui/popover.tsx",
};
