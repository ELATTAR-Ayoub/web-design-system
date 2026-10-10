"use client";

import { createContext, useContext, useState } from "react";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DAILY_VISITS,
  DESKTOP_CONFIG,
  DESKTOP_MOBILE_CONFIG,
  MONTHS_DESKTOP,
  MONTHS_DESKTOP_MOBILE,
  PLOT,
} from "./data";

export function AreaDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <AreaChart
        accessibilityLayer
        data={MONTHS_DESKTOP}
        margin={{ left: 12, right: 12 }}
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
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function AreaLinear() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP} margin={{ left: 12, right: 12 }}>
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
          content={<ChartTooltipContent indicator="dot" hideLabel />}
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="linear"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const AREA_STEP_CONFIG = {
  desktop: { ...DESKTOP_CONFIG.desktop, icon: Activity },
} satisfies ChartConfig;

export function AreaStep() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={AREA_STEP_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Area
          dataKey="desktop"
          type="step"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function AreaStacked() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
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
          content={<ChartTooltipContent indicator="dot" />}
          {...motion}
        />
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="var(--color-chart-2)"
          fillOpacity={0.4}
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const AREA_STACKED_EXPAND_DATA = [
  { month: "January", desktop: 186, mobile: 80, other: 45 },
  { month: "February", desktop: 305, mobile: 200, other: 100 },
  { month: "March", desktop: 237, mobile: 120, other: 150 },
  { month: "April", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "June", desktop: 214, mobile: 140, other: 160 },
];

const AREA_STACKED_EXPAND_CONFIG = {
  ...DESKTOP_MOBILE_CONFIG,
  other: { label: "Other", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

export function AreaStackedExpand() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={AREA_STACKED_EXPAND_CONFIG} className={PLOT}>
      <AreaChart
        accessibilityLayer
        data={AREA_STACKED_EXPAND_DATA}
        margin={{ left: 12, right: 12, top: 12 }}
        stackOffset="expand"
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
        <Area
          dataKey="other"
          type="natural"
          stackId="a"
          fill="var(--color-chart-3)"
          fillOpacity={0.1}
          stroke="var(--color-chart-3)"
          {...motion}
        />
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="var(--color-chart-2)"
          fillOpacity={0.4}
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function AreaLegend() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
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
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="var(--color-chart-2)"
          fillOpacity={0.4}
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

const AREA_ICONS_CONFIG = {
  desktop: { ...DESKTOP_MOBILE_CONFIG.desktop, icon: TrendingDown },
  mobile: { ...DESKTOP_MOBILE_CONFIG.mobile, icon: TrendingUp },
} satisfies ChartConfig;

export function AreaIcons() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={AREA_ICONS_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
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
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="var(--color-chart-2)"
          fillOpacity={0.4}
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

export function AreaGradient() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: 12, right: 12 }}>
        <defs>
          {/* Ids are namespaced per variant. `AreaInteractive` below defines a
              `desktop`/`mobile` gradient pair too, and every one of these
              charts renders on the page at once — a duplicate SVG id resolves
              `url(#…)` to whichever element the browser saw first, silently
              painting the wrong (or right-by-luck) gradient on the other
              chart. Not a token issue; a plain HTML-id collision the registry
              doesn't have to think about because its docs render one demo at
              a time. */}
          <linearGradient id="ds-area-gradient-desktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="ds-area-gradient-mobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} {...motion} />
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="url(#ds-area-gradient-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="url(#ds-area-gradient-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function AreaAxes() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <AreaChart accessibilityLayer data={MONTHS_DESKTOP_MOBILE} margin={{ left: -20, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} {...motion} />
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="var(--color-chart-2)"
          fillOpacity={0.4}
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="var(--color-chart-1)"
          fillOpacity={0.4}
          stroke="var(--color-chart-1)"
          {...motion}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const AREA_INTERACTIVE_CONFIG = {
  visitors: { label: "Visitors" },
  ...DESKTOP_MOBILE_CONFIG,
} satisfies ChartConfig;

const AREA_INTERACTIVE_REFERENCE_DATE = new Date("2024-06-30");

type AreaInteractiveRange = "90d" | "30d" | "7d";

const AreaInteractiveRangeContext = createContext<AreaInteractiveRange>("90d");

export function AreaInteractiveControls({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<AreaInteractiveRange>("90d");

  return (
    <AreaInteractiveRangeContext.Provider value={range}>
      <div className="mb-5 flex justify-end">
        <Select value={range} onValueChange={(value) => setRange(value as AreaInteractiveRange)}>
          <SelectTrigger className="w-40" aria-label="Select a range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {children}
    </AreaInteractiveRangeContext.Provider>
  );
}

export function AreaInteractive() {
  const motion = useChartMotion();
  const range = useContext(AreaInteractiveRangeContext);

  const daysToSubtract = range === "30d" ? 30 : range === "7d" ? 7 : 90;
  const startDate = new Date(AREA_INTERACTIVE_REFERENCE_DATE);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  const filtered = DAILY_VISITS.filter((item) => new Date(item.date) >= startDate);

  return (
    <ChartContainer config={AREA_INTERACTIVE_CONFIG} className={PLOT}>
      <AreaChart data={filtered}>
        <defs>
          <linearGradient id="ds-area-interactive-desktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="ds-area-interactive-mobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
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
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value as string).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              indicator="dot"
            />
          }
          {...motion}
        />
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="url(#ds-area-interactive-mobile)"
          stroke="var(--color-chart-2)"
          {...motion}
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="url(#ds-area-interactive-desktop)"
          stroke="var(--color-chart-1)"
          {...motion}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
