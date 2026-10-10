import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "button",
  description:
    "Button — a pill-shaped control with seven variants, nine sizes, loading and disabled states, and a springing focus ring: for triggering an action, never for navigating to one.",
  dependencies: ["source-foundation", "spinner"],
  exports: ["Button", "ButtonLabel", "buttonVariants"],
  sourcePath: "components/ui/button.tsx",
};
