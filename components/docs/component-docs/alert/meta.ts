import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "alert",
  description:
    "Alert — one surface, five meanings.",
  dependencies: ["source-foundation"],
  exports: ["Alert", "AlertAction", "AlertDescription", "AlertTitle"],
  sourcePath: "components/ui/alert.tsx",
};
