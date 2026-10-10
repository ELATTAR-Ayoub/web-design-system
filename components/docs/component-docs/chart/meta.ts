/**
 * Documentation metadata for `chart`.
 *
 * Paired with `page.tsx` in this directory: `lib/ds/docs/catalog.ts` imports
 * this file, and `test/docs/catalog-wiring.test.ts` fails if either half of the
 * pair is missing. Family, ownership and delivery are NOT repeated here — they
 * come from `lib/ds/platform-contract.ts`, so this file and the contract cannot
 * disagree about what `chart` is.
 */

import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "chart",
  description:
    "The accessible wrapper around Recharts, giving its otherwise unlabelled SVG a real role and name, plus legend and tooltip parts styled from chart tokens instead of the library defaults.",
  dependencies: ["source-foundation"],
  exports: ["ChartConfig", "ChartContainer", "ChartLegend", "ChartLegendContent", "ChartStyle", "ChartTooltip", "ChartTooltipContent"],
  sourcePath: "components/ui/chart.tsx",
};
