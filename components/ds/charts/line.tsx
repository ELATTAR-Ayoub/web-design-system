"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Dot, LabelList, Line, LineChart, XAxis } from "recharts";

import { useChartMotion } from "@/components/ds/chart-motion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ICON_SIZES } from "@/components/ui/icon";
import { ActiveIndicator, useActiveIndicator } from "@/components/ui/active-indicator";
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

export function LineDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={MONTHS_DESKTOP} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineLinear() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={MONTHS_DESKTOP} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Line
          dataKey="desktop"
          type="linear"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineStep() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={MONTHS_DESKTOP} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Line
          dataKey="desktop"
          type="step"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineMultiple() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} {...motion} />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={false}
          {...motion}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          dot={false}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineDots() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={{ fill: "var(--color-chart-1)" }}
          activeDot={{ r: 6 }}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineDotsCustom() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={({ cx, cy, payload }) => {
            const r = ICON_SIZES.xl;
            return (
              // allow-direct-icon: recharts needs an absolutely positioned SVG glyph.
              <GitCommitVertical
                key={payload.month}
                x={(cx ?? 0) - r / 2}
                y={(cy ?? 0) - r / 2}
                width={r}
                height={r}
                fill="var(--color-background)"
                stroke="var(--color-chart-1)"
              />
            );
          }}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineDotsColors() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={BROWSERS} margin={{ top: 24, left: 24, right: 24 }}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" nameKey="visitors" hideLabel />}
          {...motion}
        />
        <Line
          dataKey="visitors"
          type="natural"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          dot={({ payload, cx, cy }) => (
            <Dot key={payload.browser} r={5} cx={cx} cy={cy} fill={payload.fill} stroke={payload.fill} />
          )}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function LineLabel() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <LineChart
        accessibilityLayer
        data={MONTHS_DESKTOP_MOBILE}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
          {...motion}
        />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={{ fill: "var(--color-chart-1)" }}
          activeDot={{ r: 6 }}
          {...motion}
        >
          {/* The registry sets `fontSize={12}` here — a raw SVG number for a
              value the type scale already owns. `text-xs` (12px, per
              globals.css's four aliases) reaches the same size through CSS,
              matching the fix `bar.tsx`'s `BarLabel` already made. */}
          <LabelList position="top" offset={12} className="fill-foreground text-xs" />
        </Line>
      </LineChart>
    </ChartContainer>
  );
}

export function LineLabelCustom() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={BROWSERS} margin={{ top: 24, left: 24, right: 24 }}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" nameKey="visitors" hideLabel />}
          {...motion}
        />
        <Line
          dataKey="visitors"
          type="natural"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          dot={{ fill: "var(--color-chart-2)" }}
          activeDot={{ r: 6 }}
          {...motion}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground text-xs"
            dataKey="browser"
            formatter={(value) =>
              String(BROWSER_CONFIG[value as keyof typeof BROWSER_CONFIG]?.label ?? value)
            }
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
}

const LINE_INTERACTIVE_CONFIG = {
  views: { label: "Page Views" },
  ...DESKTOP_MOBILE_CONFIG,
} satisfies ChartConfig;

type LineInteractiveSeries = "desktop" | "mobile";

const LINE_INTERACTIVE_STROKE: Record<LineInteractiveSeries, string> = {
  desktop: "var(--color-chart-1)",
  mobile: "var(--color-chart-2)",
};

const LINE_INTERACTIVE_PILL: Record<LineInteractiveSeries, string> = {
  desktop: "bg-chart-1",
  mobile: "bg-chart-2",
};

const LineInteractiveSeriesContext = createContext<LineInteractiveSeries>("desktop");

const LINE_INTERACTIVE_SERIES: readonly LineInteractiveSeries[] = ["desktop", "mobile"];

export function LineInteractiveControls({ children }: { children: React.ReactNode }) {
  const [activeChart, setActiveChart] = useState<LineInteractiveSeries>("desktop");
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator(
    '[data-slot="line-series-option"][data-state="on"]',
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
    <LineInteractiveSeriesContext.Provider value={activeChart}>
      <div
        ref={containerRef}
        className="relative mb-5 grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card"
      >
        {/* The pill carries the ACTIVE SERIES' OWN COLOUR — see the block
            comment above, and `bar.tsx` for the measurements. Not the default
            `bg-primary`, and no longer `bg-muted`. No radius of its own — the
            frame's `overflow-hidden` rounds it at either end. */}
        <ActiveIndicator
          indicatorRef={indicatorRef}
          arrivalRef={arrivalRef}
          className={cn(
            "block size-full",
            LINE_INTERACTIVE_PILL[activeChart],
          )}
        />
        {LINE_INTERACTIVE_SERIES.map((key, i) => (
          <button
            key={key}
            type="button"
            data-slot="line-series-option"
            data-state={activeChart === key ? "on" : "off"}
            aria-pressed={activeChart === key}
            onClick={() => setActiveChart(key)}
            className={cn(
              "press relative z-10 px-4 py-3 text-left",
              "data-[state=on]:[&_p]:text-primary-foreground",
              i > 0 && "border-l border-border",
            )}
          >
            {/* Every tile says what colour it is, selected or not — `pie.tsx`'s
                `PieInteractiveControls` swatch, same geometry, colour off the
                same lookup the plot strokes with. `aria-hidden`: the label
                beside it and `aria-pressed` are the non-colour signals §7 and
                trap 11 ask for. */}
            <span
              aria-hidden
              className="absolute top-3 right-4 size-3 rounded-xs"
              style={{ backgroundColor: LINE_INTERACTIVE_STROKE[key] }}
            />
            <Stat
              label={String(LINE_INTERACTIVE_CONFIG[key].label)}
              value={totals[key].toLocaleString()}
            />
          </button>
        ))}
      </div>
      {children}
    </LineInteractiveSeriesContext.Provider>
  );
}

export function LineInteractive() {
  const motion = useChartMotion();
  const activeChart = useContext(LineInteractiveSeriesContext);

  return (
    <ChartContainer config={LINE_INTERACTIVE_CONFIG} className={PLOT}>
      <LineChart accessibilityLayer data={DAILY_VISITS} margin={{ left: 12, right: 12 }}>
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
              className="w-40"
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
        <Line
          dataKey={activeChart}
          type="monotone"
          stroke={LINE_INTERACTIVE_STROKE[activeChart]}
          strokeWidth={2}
          dot={false}
          {...motion}
        />
      </LineChart>
    </ChartContainer>
  );
}
