import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "toggle-group",
  description:
    "Toggle group — a row or column of toggles acting as one control, with a single indicator that slides to the pressed item rather than each item lighting up its own background.",
  dependencies: ["active-indicator", "source-foundation", "toggle"],
  exports: ["ToggleGroup", "ToggleGroupItem"],
  sourcePath: "components/ui/toggle-group.tsx",
};
