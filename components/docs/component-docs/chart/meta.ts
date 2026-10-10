import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "chart",
  description:
    "The accessible wrapper around Recharts, giving its otherwise unlabelled SVG a real role and name, plus legend and tooltip parts styled from chart tokens instead of the library defaults.",
  dependencies: ["source-foundation"],
  exports: ["ChartConfig", "ChartContainer", "ChartLegend", "ChartLegendContent", "ChartStyle", "ChartTooltip", "ChartTooltipContent"],
  sourcePath: "components/ui/chart.tsx",
};
