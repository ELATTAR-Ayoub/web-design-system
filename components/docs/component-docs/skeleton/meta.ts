import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "skeleton",
  description:
    "Skeleton — a shimmering placeholder standing in for content that has not arrived yet, renderable inline so it can sit inside a paragraph or heading without producing invalid markup.",
  dependencies: ["source-foundation"],
  exports: ["Skeleton"],
  sourcePath: "components/ui/skeleton.tsx",
};
