import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "separator",
  description:
    "Separator — a thin dividing line between sections, horizontal or vertical, decorative by default so it stays out of the accessibility tree unless told it carries meaning.",
  dependencies: ["source-foundation"],
  exports: ["Separator"],
  sourcePath: "components/ui/separator.tsx",
};
