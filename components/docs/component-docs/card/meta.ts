import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "card",
  description:
    "A neutral content surface with structured header, title, description, content, and footer regions.",
  dependencies: ["source-foundation"],
  exports: ["Card", "CardAction", "CardContent", "CardDescription", "CardFooter", "CardHeader", "CardTitle"],
  sourcePath: "components/ui/card.tsx",
};
