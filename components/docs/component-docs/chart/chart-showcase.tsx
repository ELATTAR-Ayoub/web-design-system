"use client";

/**
 * The `chart` item page's own scene: the reader can change what the chart
 * shows in three different ways, all of them real.
 *
 * - **Range switch** — the same 7d / 30d / 90d cut `AreaInteractive`
 *   (`components/ds/charts/area.tsx`) demonstrates, filtering the real
 *   dataset rather than swapping a picture.
 * - **Legend toggle** — a click hides a series by setting Recharts' own
 *   `hide` prop on its `Area`. `ChartLegendContent` (documented under
 *   Tooltips & legends below) is Recharts' `Legend` re-exported unchanged
 *   and carries no click handling of its own, so a legend that TOGGLES a
 *   series is composed here from the same `ChartConfig` every other
 *   specimen on this page reads — real buttons, not a decorative row.
 * - **Tooltip on hover** — `ChartTooltip`/`ChartTooltipContent`, unchanged
 *   from every other specimen in the family.
 *
 * `"use client"`, per trap 29: the range and the hidden-series set are
 * reader-driven state, and `page.tsx` is a spec module a server component
 * reads.
 */

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useChartMotion } from "@/components/ds/chart-motion";
import { DAILY_VISITS, DESKTOP_MOBILE_CONFIG, PLOT } from "@/components/ds/charts/data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Range = "90d" | "30d" | "7d";
type SeriesKey = keyof typeof DESKTOP_MOBILE_CONFIG;

const REFERENCE_DATE = new Date("2024-06-30");
const RANGE_DAYS: Record<Range, number> = { "90d": 90, "30d": 30, "7d": 7 };
const SERIES_KEYS = Object.keys(DESKTOP_MOBILE_CONFIG) as SeriesKey[];

export function ChartShowcase() {
  const motion = useChartMotion();
  const [range, setRange] = useState<Range>("90d");
  const [hidden, setHidden] = useState<ReadonlySet<SeriesKey>>(() => new Set());

  const data = useMemo(() => {
    const start = new Date(REFERENCE_DATE);
    start.setDate(start.getDate() - RANGE_DAYS[range]);
    return DAILY_VISITS.filter((item) => new Date(item.date) >= start);
  }, [range]);

  const toggle = (key: SeriesKey) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Toggle a series">
          {SERIES_KEYS.map((key) => {
            const entry = DESKTOP_MOBILE_CONFIG[key];
            const off = hidden.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                aria-pressed={!off}
                className={cn(
                  "type-small flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 transition-colors duration-normal",
                  off ? "text-muted-foreground" : "text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: off ? "var(--color-muted-foreground)" : entry.color }}
                />
                {entry.label}
              </button>
            );
          })}
        </div>
        <Select value={range} onValueChange={(value) => setRange(value as Range)}>
          <SelectTrigger className="w-36" aria-label="Select a range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={DESKTOP_MOBILE_CONFIG}
        aria-label="Desktop and mobile visitors"
        description="Toggle a series in the legend above to hide it, or switch the range to see fewer days."
        className={PLOT}
      >
        <AreaChart data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-chart-2)"
            fillOpacity={0.3}
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            hide={hidden.has("mobile")}
            {...motion}
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-chart-1)"
            fillOpacity={0.3}
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            hide={hidden.has("desktop")}
            {...motion}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
