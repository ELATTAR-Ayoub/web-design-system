"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Rectangle, XAxis, YAxis } from "recharts";

import { useChartMotion } from "@/components/ds/chart-motion";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ActiveIndicator,
  useActiveIndicator,
} from "@/components/ui/active-indicator";
import { Stat } from "@/components/ui/stat";
import { cn } from "@/lib/utils";

import {
  BROWSER_CONFIG,
  BROWSERS,
  DAILY_VISITS,
  DESKTOP_CONFIG,
  DESKTOP_MOBILE_CONFIG,
  MONTHS_DESKTOP,
  MONTHS_DESKTOP_MOBILE,
  PLOT,
} from "./data";

const BAR_RADIUS_TOKEN = "--radius-sm";

const SSR_BAR_RADIUS = 6;

function readRadiusPx(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw.endsWith("px")) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

const subscribeRadius = () => () => {};
const getBarRadius = () => readRadiusPx(BAR_RADIUS_TOKEN, SSR_BAR_RADIUS);
const getBarRadiusOnServer = () => SSR_BAR_RADIUS;

function useBarRadius(): number {
  return useSyncExternalStore(subscribeRadius, getBarRadius, getBarRadiusOnServer);
}

export function BarDefault() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={MONTHS_DESKTOP}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={radius} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function BarHorizontal() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={MONTHS_DESKTOP} layout="vertical" margin={{ left: -20 }}>
        <XAxis type="number" dataKey="desktop" hide />
        <YAxis
          dataKey="month"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={radius} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function BarMultiple() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
          {...motion}
        />
        <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={radius} {...motion} />
        <Bar dataKey="mobile" fill="var(--color-chart-2)" radius={radius} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function BarStacked() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} {...motion} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          stackId="a"
          fill="var(--color-chart-1)"
          radius={[0, 0, radius, radius]}
          {...motion}
        />
        <Bar
          dataKey="mobile"
          stackId="a"
          fill="var(--color-chart-2)"
          radius={[radius, radius, 0, 0]}
          {...motion}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function BarLabel() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={MONTHS_DESKTOP} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={radius} {...motion}>
          {/* The registry sets `fontSize={12}` here — a raw SVG number for a
              value the type scale already owns. `text-xs` (12px, per
              globals.css's four aliases) reaches the same size through CSS,
              which `<text>` honours, so nothing is typed by hand. */}
          <LabelList position="top" offset={12} className="fill-foreground text-xs" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function BarLabelCustom() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <BarChart
        accessibilityLayer
        data={MONTHS_DESKTOP}
        layout="vertical"
        margin={{ right: 16 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="month" type="category" tickLine={false} axisLine={false} hide />
        <XAxis dataKey="desktop" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
          {...motion}
        />
        {/* `layout` is not repeated here — recharts 3.x's `Bar` no longer types
            it as its own prop; the chart's own `layout="vertical"` above
            already governs every child. The registry sets it redundantly on
            both. */}
        <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={radius} {...motion}>
          <LabelList
            dataKey="month"
            position="insideLeft"
            offset={8}
            className="fill-background text-xs"
          />
          <LabelList
            dataKey="desktop"
            position="right"
            offset={8}
            className="fill-foreground text-xs"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function BarMixed() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={BROWSERS} layout="vertical" margin={{ left: 0 }}>
        <YAxis
          dataKey="browser"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) =>
            String(BROWSER_CONFIG[value as keyof typeof BROWSER_CONFIG]?.label ?? value)
          }
        />
        <XAxis dataKey="visitors" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        {/* No `fill` on `Bar` — each row in `BROWSERS` already carries its own
            `fill: var(--color-chart-N)` (data.ts), which recharts reads per
            datum the same way the registry's own version relies on. `layout`
            is likewise not repeated here — see the note on `BarLabelCustom`. */}
        <Bar dataKey="visitors" radius={radius} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

const BAR_ACTIVE_DATA = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chart-1)" },
  { browser: "safari", visitors: 200, fill: "var(--color-chart-2)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-chart-3)" },
  { browser: "edge", visitors: 173, fill: "var(--color-chart-4)" },
  { browser: "other", visitors: 90, fill: "var(--color-chart-5)" },
];

export function BarActive() {
  const motion = useChartMotion();
  const radius = useBarRadius();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={BAR_ACTIVE_DATA}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="browser"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) =>
            String(BROWSER_CONFIG[value as keyof typeof BROWSER_CONFIG]?.label ?? value)
          }
        />
        {/* `activeIndex` moved off `Bar` between recharts v2 and v3 — it is now
            `Tooltip`'s `defaultIndex`. See the recharts migration guide linked
            from `Tooltip.d.ts`. */}
        <ChartTooltip
          cursor={false}
          defaultIndex={2}
          content={<ChartTooltipContent hideLabel />}
          {...motion}
        />
        <Bar
          dataKey="visitors"
          strokeWidth={2}
          radius={radius}
          activeBar={({ ...props }) => (
            <Rectangle
              {...props}
              fillOpacity={0.8}
              stroke={props.payload.fill}
              strokeDasharray={4}
              strokeDashoffset={4}
            />
          )}
          {...motion}
        />
      </BarChart>
    </ChartContainer>
  );
}

const BAR_NEGATIVE_DATA = [
  { month: "January", visitors: 186 },
  { month: "February", visitors: 205 },
  { month: "March", visitors: -207 },
  { month: "April", visitors: 173 },
  { month: "May", visitors: -209 },
  { month: "June", visitors: 214 },
];

const BAR_NEGATIVE_CONFIG = {
  visitors: { label: "Visitors" },
} satisfies ChartConfig;

export function BarNegative() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BAR_NEGATIVE_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={BAR_NEGATIVE_DATA}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator />}
          {...motion}
        />
        <Bar dataKey="visitors" {...motion}>
          {/* No explicit `fill` on this LabelList and no per-row `fill` on
              `BAR_NEGATIVE_DATA` (unlike `BROWSERS`) means recharts' own
              default paints the month labels — an untokenised grey the
              `ui/chart.tsx` header comment already measured failing AA in one
              theme for the exact same reason. `fill-foreground` closes it. */}
          <LabelList position="top" dataKey="month" fillOpacity={1} className="fill-foreground" />
          {BAR_NEGATIVE_DATA.map((item) => (
            <Cell
              key={item.month}
              fill={item.visitors > 0 ? "var(--color-chart-1)" : "var(--color-chart-2)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

const BAR_INTERACTIVE_CONFIG = {
  views: { label: "Page Views" },
  ...DESKTOP_MOBILE_CONFIG,
} satisfies ChartConfig;

type BarInteractiveSeries = "desktop" | "mobile";

const BAR_INTERACTIVE_FILL: Record<BarInteractiveSeries, string> = {
  desktop: "var(--color-chart-1)",
  mobile: "var(--color-chart-2)",
};

const BAR_INTERACTIVE_PILL: Record<BarInteractiveSeries, string> = {
  desktop: "bg-chart-1",
  mobile: "bg-chart-2",
};

const BarInteractiveSeriesContext = createContext<BarInteractiveSeries>("desktop");

const BAR_INTERACTIVE_SERIES: readonly BarInteractiveSeries[] = ["desktop", "mobile"];

export function BarInteractiveControls({ children }: { children: React.ReactNode }) {
  const [activeChart, setActiveChart] = useState<BarInteractiveSeries>("desktop");
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator(
    '[data-slot="bar-series-option"][data-state="on"]',
    "anim-enter",
  );

  const totals = useMemo(
    () => ({
      desktop: DAILY_VISITS.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: DAILY_VISITS.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [],
  );

  return (
    <BarInteractiveSeriesContext.Provider value={activeChart}>
      <div
        ref={containerRef}
        className="relative mb-5 grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card"
      >
        {/* The pill carries the ACTIVE SERIES' OWN COLOUR — see the block
            comment above for the arithmetic that decides its shape. Not the
            default `bg-primary`, and no longer `bg-muted`: a grey pill says
            that a tile is selected and nothing about which series the plot
            below is now drawing. No radius of its own — the frame's
            `overflow-hidden` rounds it at either end. */}
        <ActiveIndicator
          indicatorRef={indicatorRef}
          arrivalRef={arrivalRef}
          className={cn(
            "block size-full",
            BAR_INTERACTIVE_PILL[activeChart],
          )}
        />
        {BAR_INTERACTIVE_SERIES.map((key, i) => (
          <button
            key={key}
            type="button"
            data-slot="bar-series-option"
            data-state={activeChart === key ? "on" : "off"}
            aria-pressed={activeChart === key}
            onClick={() => setActiveChart(key)}
            className={cn(
              "press relative z-10 px-4 py-3 text-left",
              "data-[state=on]:[&_p]:text-primary-foreground",
              i > 0 && "border-l border-border",
            )}
          >
            {/* Every tile says what colour it is, selected or not — otherwise
                the strip cannot be read until you have clicked both. Exactly
                `pie.tsx`'s `PieInteractiveControls` swatch (`size-3
                rounded-xs`, colour off the same lookup the plot paints with),
                so the two interactive pickers share one idiom rather than
                inventing a second. `aria-hidden`: it is a restatement of the
                label beside it, and §7 / trap 11 are satisfied by the label
                and `aria-pressed`, never by the hue. */}
            <span
              aria-hidden
              className="absolute top-3 right-4 size-3 rounded-xs"
              style={{ backgroundColor: BAR_INTERACTIVE_FILL[key] }}
            />
            <Stat
              label={String(BAR_INTERACTIVE_CONFIG[key].label)}
              value={totals[key].toLocaleString()}
            />
          </button>
        ))}
      </div>
      {children}
    </BarInteractiveSeriesContext.Provider>
  );
}

export function BarInteractive() {
  const motion = useChartMotion();
  const activeChart = useContext(BarInteractiveSeriesContext);

  return (
    <ChartContainer config={BAR_INTERACTIVE_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={DAILY_VISITS} margin={{ left: 12, right: 12 }}>
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="views"
              labelFormatter={(value) =>
                new Date(value as string).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
          }
          {...motion}
        />
        <Bar dataKey={activeChart} fill={BAR_INTERACTIVE_FILL[activeChart]} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}
