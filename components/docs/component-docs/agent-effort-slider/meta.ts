import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "agent-effort-slider",
  description:
    "A notched slider for choosing how hard the agent thinks, from the fastest level to the smartest, with a keyboard-operable track.",
  dependencies: ["source-foundation"],
  exports: ["EffortSliderProps","isMaxEffort","EffortSlider"],
  sourcePath: "components/agent/parts/effort-slider.tsx",
};
