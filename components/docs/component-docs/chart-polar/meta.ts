import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "chart-polar",
  description:
    "The three polar families — `PieChart`, `RadarChart` and `RadialBarChart`.",
  dependencies: [],
  exports: ["ChartConfig", "ChartContainer", "ChartLegend", "ChartLegendContent", "ChartStyle", "ChartTooltip", "ChartTooltipContent"],
  sourcePath: "components/ui/chart.tsx",
};
