import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "tabs",
  description:
    "Tabs — switchable content panels whose selected trigger is marked by one indicator that physically slides to it, a filled pill or a thin underline, rather than each trigger painting its own selected state.",
  dependencies: ["active-indicator", "source-foundation"],
  exports: ["Tabs", "TabsContent", "TabsList", "TabsTrigger", "tabsListVariants"],
  sourcePath: "components/ui/tabs.tsx",
};
