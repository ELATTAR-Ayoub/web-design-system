import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "kbd",
  description:
    "Kbd — a keyboard key or shortcut rendered as a small pill, styled to also sit legibly inside a tooltip.",
  dependencies: ["source-foundation"],
  exports: ["Kbd", "KbdGroup"],
  sourcePath: "components/ui/kbd.tsx",
};
