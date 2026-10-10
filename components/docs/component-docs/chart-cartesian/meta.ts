import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "chart-cartesian",
  description:
    "The three cartesian families — `AreaChart`, `BarChart` and `LineChart`.",
  dependencies: [],
  exports: ["ChartConfig", "ChartContainer", "ChartLegend", "ChartLegendContent", "ChartStyle", "ChartTooltip", "ChartTooltipContent"],
  sourcePath: "components/ui/chart.tsx",
};
