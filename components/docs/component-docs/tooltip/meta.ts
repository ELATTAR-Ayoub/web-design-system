import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "tooltip",
  description:
    "Accessible hover and focus explanation surface with semantic side and transition behavior.",
  dependencies: ["source-foundation"],
  exports: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
  sourcePath: "components/ui/tooltip.tsx",
};
