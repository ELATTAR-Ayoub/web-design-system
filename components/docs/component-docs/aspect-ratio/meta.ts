import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "aspect-ratio",
  description:
    "AspectRatio — a bare layout primitive that locks a child element to a fixed width-to-height ratio, with no styling of its own to override.",
  dependencies: ["source-foundation"],
  exports: ["AspectRatio"],
  sourcePath: "components/ui/aspect-ratio.tsx",
};
