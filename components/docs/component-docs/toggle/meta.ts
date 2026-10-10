import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "toggle",
  description:
    "Toggle — a single two-state button that stays visibly pressed once activated, for a setting the user switches on or off rather than an action that fires once.",
  dependencies: ["source-foundation"],
  exports: ["Toggle", "toggleVariants"],
  sourcePath: "components/ui/toggle.tsx",
};
