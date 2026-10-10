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

/**
 * The ten `chart-area-*` registry blocks, vendored onto this system's tokens.
 *
 * Every function here renders the bare chart only — no `Card`, no `Panel`, no
 * title, no "Trending up by 5.2%" footer. `ChartStates` (state.tsx) supplies
 * the frame; the page task mounts these inside it.
 *
 * Three sweeps apply to all ten and are not repeated per-function:
 *
 * 1. **`hsl(var(--chart-N))` → `var(--color-chart-N)`.** The registry's
 *    pre-v4 spelling. `--chart-N` here holds a whole colour, so `hsl()`
 *    around it is invalid and the series paints nothing.
 * 2. **`var(--color-desktop)` / `var(--color-mobile)` / … → `var(--color-
 *    chart-1..5)` directly.** shadcn's `ChartStyle` mints `--color-<seriesKey>`
 *    into a `<style>` tag at runtime; the property exists in the browser and
 *    nowhere in source, so `check:refs` fails it. The chart tokens are already
 *    declared once per theme in `globals.css`.
 * 3. **Every animated element takes `{...useChartMotion()}`.** Never a raw
 *    `animationDuration` / `animationEasing`.
 *
 * `AreaDefault`, `AreaStacked` and `AreaGradient` already existed, swept, in
 * `chart-demos.tsx`, built against a bespoke "trade" dataset. They are
 * re-homed here with the *sweep discipline* carried over (no `Card`, the same
 * token names, the same motion wiring) but rebased onto `data.ts`'s shared
 * `MONTHS_DESKTOP` / `MONTHS_DESKTOP_MOBILE` fixtures rather than that
 * bespoke data — `data.ts` is explicit that variants must use its fixtures
 * rather than restate an array, and it pre-allocates these three names against
 * its own dataset counts. See the report for the full reasoning.
 *
 * **`AreaInteractive` is mounted differently from the other nine.** Its range
 * `Select` is a second export, `AreaInteractiveControls`, and goes in
 * `ChartStates`' `controls` slot so it renders in all three states rather than
 * only in `ready`:
 *
 * ```tsx
 * <ChartStates title="Interactive" note="chart-area-interactive" skeleton="area"
 *              controls={AreaInteractiveControls}>
 *   <AreaInteractive />
 * </ChartStates>
 * ```
 *
 * Inline, the strip made the panel 60px taller in `ready` than in the other
 * two states. The reasoning is on `AreaInteractiveControls` itself.
 */

/* ── default · linear · step ─────────────────────────────────────────────── */

export function AreaDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <AreaChart
        accessibilityLayer
        data={MONTHS_DESKTOP}
        // Plot maths, not the 8-point scale — recharts' own margin box.
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

/**
 * The registry's `chartConfig.desktop.icon` is `Activity`, unused by this
 * variant's own JSX but read by `ChartTooltipContent` (`components/ui/chart.tsx`
 * renders `<itemConfig.icon />` in the indicator slot whenever a config entry
 * carries one). That render happens inside a foundation file this task does
 * not own, so it bypasses `Icon` (`components/ui/icon.tsx`) — the config's
 * `icon` field is typed `React.ComponentType`, a bare Lucide component, not
 * something `Icon`'s props-based wrapper can be dropped into that slot. Kept
 * faithful to the registry rather than worked around.
 */
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

/* ── stacked · stacked-expand · legend · icons ───────────────────────────── */

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

/**
 * `data.ts` deliberately does not carry this shape — `MONTHS_DESKTOP_MOBILE`
 * plus an `other` series exists for exactly one variant, so it stays local
 * rather than becoming a ninth shared export. Values are the registry's,
 * unchanged.
 */
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

/**
 * `TrendingDown` on `desktop` and `TrendingUp` on `mobile` is the registry's
 * own pairing, not a claim these charts render onto that shape — see the note
 * on `AreaStep` for why the icon renders through `ui/chart.tsx` directly
 * rather than through `Icon`.
 */
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

/* ── gradient · axes ──────────────────────────────────────────────────────── */

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

/* ── interactive ──────────────────────────────────────────────────────────── */

const AREA_INTERACTIVE_CONFIG = {
  visitors: { label: "Visitors" },
  ...DESKTOP_MOBILE_CONFIG,
} satisfies ChartConfig;

const AREA_INTERACTIVE_REFERENCE_DATE = new Date("2024-06-30");

type AreaInteractiveRange = "90d" | "30d" | "7d";

/**
 * The range the plot draws. Defaulted, not nullable, so `<AreaInteractive />`
 * still renders a real 90-day chart if it is ever mounted without its strip.
 */
const AreaInteractiveRangeContext = createContext<AreaInteractiveRange>("90d");

/**
 * The one non-chart control this variant is built to demonstrate, as a
 * `ChartStates` `controls` frame.
 *
 * The registry sits this `Select` in a `CardHeader`. Stripped of `Card` it
 * used to render inline above the plot, inside the component — which put it
 * inside `ChartStates`' swapped slot, where it exists only in `ready`. The
 * panel therefore grew 60px the moment you left Loading or Empty: 393.39 →
 * 453.39, measured. §5 calls that out by name — a layout jump is worse than
 * the spinner it was meant to avoid.
 *
 * Hoisting the strip into `controls` renders it in all three states and
 * leaves the slot at exactly `PLOT`, so the box cannot move. The state has to
 * come with it (the strip and the plot must agree on the range), and a
 * context is how it reaches back down through the keyed slot.
 *
 * `useState` here is user-driven — the click sets it directly — not a
 * mount-flag mirroring something external, so `react-hooks/set-state-in-
 * effect` has nothing to flag.
 */
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

/**
 * The plot only — no wrapper `div`, nothing above the `ChartContainer`, so its
 * footprint is `PLOT` exactly like the other nine. Mount it with
 * `controls={AreaInteractiveControls}` on the `ChartStates` around it.
 */
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
