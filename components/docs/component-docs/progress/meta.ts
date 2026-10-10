import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "progress",
  description:
    "Progress — the same bar as the Slider's track, because it is the same object.",
  dependencies: ["source-foundation"],
  exports: ["Progress", "progressIndicatorVariants"],
  sourcePath: "components/ui/progress.tsx",
};
