import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "hover-card",
  description:
    "HoverCard — a preview panel that opens on hover or focus of its trigger, for a peek at content that stops short of a click.",
  dependencies: ["source-foundation"],
  exports: ["HoverCard", "HoverCardContent", "HoverCardTrigger"],
  sourcePath: "components/ui/hover-card.tsx",
};
