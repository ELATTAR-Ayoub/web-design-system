import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "stat",
  description:
    "Stat — a labelled figure, an optional delta, an optional trailing hint.",
  dependencies: ["skeleton", "source-foundation"],
  exports: ["Stat", "StatDelta", "StatDeltaMark", "StatDirection", "StatState"],
  sourcePath: "components/ui/stat.tsx",
};
