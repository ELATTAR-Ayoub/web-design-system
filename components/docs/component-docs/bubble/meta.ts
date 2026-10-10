import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "bubble",
  description:
    "Bubble — a chat message's container, styled by variant from a plain default to a destructive warning, with an optional reactions rail whose counts stay in the accessibility tree even when the number itself is collapsed behind a hover.",
  dependencies: ["source-foundation"],
  exports: ["Bubble", "BubbleContent", "BubbleGroup", "BubbleReactions"],
  sourcePath: "components/ui/bubble.tsx",
};
