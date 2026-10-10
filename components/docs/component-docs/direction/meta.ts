import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "direction",
  description:
    "DirectionProvider — sets the reading direction, ltr or rtl, that every direction-aware component beneath it reads, defaulting to ltr when none is given.",
  dependencies: ["source-foundation"],
  exports: ["DirectionProvider", "useDirection"],
  sourcePath: "components/ui/direction.tsx",
};
