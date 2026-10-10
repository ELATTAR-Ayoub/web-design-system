import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "scroll-area",
  description:
    "Scroll area — a viewport with its own drawn scrollbar that stays reachable by keyboard, a tab stop in its own right so hiding the native scrollbar never leaves the content behind it unreachable.",
  dependencies: ["source-foundation"],
  exports: ["ScrollArea", "ScrollBar"],
  sourcePath: "components/ui/scroll-area.tsx",
};
