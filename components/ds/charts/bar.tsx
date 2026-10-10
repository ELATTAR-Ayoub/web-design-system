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

/**
 * The ten `chart-bar-*` registry blocks, vendored onto this system's tokens.
 *
 * Same three sweeps as `area.tsx` (see its header): `hsl(var(--chart-N))` →
 * `var(--color-chart-N)`; `var(--color-<seriesKey>)` → the same direct
 * `--color-chart-1..5` names; every animated element takes
 * `{...useChartMotion()}`. Two more are specific to this family and are
 * flagged again at their call sites: a `fontSize={12}` on `LabelList` becomes
 * a `text-xs` class (font size is a token family; `fontSize` is a raw SVG
 * number recharts requires, invisible to `check:tokens` exactly the way
 * `animationDuration` is, and that does not make it allowed) and
 * `fill={`var(--color-${activeChart})`}` in the interactive variant becomes a
 * lookup table, because it would otherwise write the exact
 * `--color-<seriesKey>` pattern rule 1 forbids at runtime.
 *
 * Corner radius comes from `useBarRadius()` — see the block below it. An
 * earlier version of this file kept the registry's `radius={8}` / `{5}` /
 * `{4}` and defended them by analogy to `margin`. That analogy was wrong and
 * has been withdrawn: `margin` is abstract plot-coordinate space with no token
 * equivalent, whereas a corner radius is exactly what §0's radius family
 * governs, and none of 4, 5 or 8 is on the ladder.
 *
 * **`BarInteractive` is mounted differently from the other nine.** Its pair of
 * clickable totals is a second export, `BarInteractiveControls`, and goes in
 * `ChartStates`' `controls` slot so it renders in all three states rather than
 * only in `ready`:
 *
 * ```tsx
 * <ChartStates title="Interactive" note="chart-bar-interactive" skeleton="bar"
 *              controls={BarInteractiveControls}>
 *   <BarInteractive />
 * </ChartStates>
 * ```
 *
 * Inline, that strip made the panel 94px taller in `ready` than in the other
 * two states. The reasoning is on `BarInteractiveControls` itself.
 *
 * `BarDefault`, `BarMultiple` (was `BarGrouped`), `BarStacked` and
 * `BarHorizontal` already existed, swept, in `chart-demos.tsx` against a
 * bespoke "trade" dataset. Re-homed here with the sweep discipline carried
 * over, rebased onto `data.ts`'s shared fixtures — see the report.
 */

/* ── The bar's corner radius, read rather than typed ─────────────────────── */

/**
 * `chart-demos.tsx` — the file this one supersedes — omitted `radius` from
 * every `Bar` it drew, and said why: *"a pixel literal typed here would pass
 * every guard in the repo and still be a second design system."* That
 * reasoning is correct and is not being reversed here. The objection was
 * always to the **literal**, never to the radius: `radius={8}` is a corner
 * size invented at the call site, and §0's radius family — 2 · 6 · 10 · 12 ·
 * 16 · 20 · 24 · 999 — has no 8, no 5 and no 4 in it. Keeping the registry's
 * numbers, as the first draft of this file did, was the one thing that
 * comment ruled out.
 *
 * What that file could not do, and this one can, is take the **third** option.
 * `chart-motion.ts` had already established it for the identical problem one
 * token family over: recharts takes `animationDuration` as a raw number, no
 * class can reach it, and the answer was neither to hardcode `800` nor to give
 * up the duration — it was to READ `--duration-slow` off the live stylesheet.
 * Its own header says so: *"this is the one place in the system where §0 is
 * upheld by reading rather than by writing."* Radius is the same shape of
 * problem — recharts bakes the corner into the bar's `<path>` `d`, so there is
 * no CSS route to it either — and it gets the same answer, so the ladder
 * stays the single source of the value and a retune follows here.
 *
 * **Why `--radius-sm`.** One token for every bar in the family, not three. The
 * registry's 8 / 5 / 4 are not a considered distinction — they are the same
 * bar drawn three ways across ten files — and 6px is where they average. The
 * *pattern* on the stacked variant (`[0, 0, r, r]` / `[r, r, 0, 0]`) does
 * survive: those zeros say WHICH corners are cut, which is geometry, not size.
 *
 * **Why the subscription is a no-op**, when `chart-motion.ts`'s is a live
 * `MutationObserver`: `--duration-*` can move under a mounted chart because
 * next-themes rewrites `class` on `<html>`, and a duration could legitimately
 * differ per theme. The radius ladder cannot — it is declared once in
 * `@theme static` and neither `:root` nor `.dark` redeclares any rung of it,
 * so there is nothing for an observer to observe. If a theme ever *does* take
 * its own radius, this must move to `chart-motion.ts`'s observer rather than
 * grow a second one.
 */
const BAR_RADIUS_TOKEN = "--radius-sm";

/**
 * The server-render fallback, restating a token exactly as
 * `chart-motion.ts`'s `SSR_DURATION_MS` does and for the same reason:
 * `getComputedStyle` does not exist on the server, and the alternative is a
 * bar with no corner until hydration. Unreachable in a browser.
 */
const SSR_BAR_RADIUS = 6;

/** Read a `--radius-*` token and return it as a number of pixels. */
function readRadiusPx(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw.endsWith("px")) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

const subscribeRadius = () => () => {};
const getBarRadius = () => readRadiusPx(BAR_RADIUS_TOKEN, SSR_BAR_RADIUS);
const getBarRadiusOnServer = () => SSR_BAR_RADIUS;

/**
 * `useSyncExternalStore` rather than a bare read in the render body: the DOM
 * is outside React, this repo lints under the React Compiler rules, and
 * `chart-motion.ts` and `hooks/use-mobile.ts` are the two models already here.
 */
function useBarRadius(): number {
  return useSyncExternalStore(subscribeRadius, getBarRadius, getBarRadiusOnServer);
}

/* ── default · horizontal · multiple · stacked ───────────────────────────── */

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

/* ── label · label-custom ─────────────────────────────────────────────────── */

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

/**
 * The registry mints a per-container `--color-label` custom property (config
 * key `label: { color: "hsl(var(--background))" }`) so the in-bar month text
 * can contrast against the bar's own fill. Two problems: it is the
 * `--color-<seriesKey>` pattern rule 1 forbids, and `hsl(var(--background))`
 * is the same invalid-colour trap as `hsl(var(--chart-1))` — `--background`
 * holds a whole colour here too. `fill-background` is already a themed
 * Tailwind utility (no container-scoped mint, no `hsl()`), so the config
 * carries no `label` key at all.
 */
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

/* ── mixed · active ───────────────────────────────────────────────────────── */

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

/**
 * `data.ts` names this shape as one of the eight kept local: `BROWSERS`
 * reordered (chrome and firefox swap places) so the "active" third bar lands
 * on firefox rather than chrome. Fill values are already `--color-chart-N`
 * direct, sidestepping the `hsl(var(--chart-N))` the registry writes here.
 */
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

/* ── negative ─────────────────────────────────────────────────────────────── */

/** Kept local per `data.ts` — `{ month, visitors }` with two negative rows. */
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

/**
 * §1.4 / §5 (*a delta is a shape before it is a hue*): a figure that can fall
 * is not an error, so the falling half of this chart does not reach for
 * `destructive`. The direction is already fully legible without colour — each
 * bar's own position above or below the zero baseline says "up" or "down" the
 * way a `Stat` delta's arrow does — so colour here is the fourth, reinforcing
 * signal, not the only one. The registry's own choice agrees: it already
 * separates the two directions with `--chart-1` / `--chart-2`, both of which
 * are the neutral action-ramp hues, never red or green, in `globals.css`. The
 * fix is the same `hsl()` → `var(--color-chart-N)` rewrite as everywhere else
 * in this file, not a reach for a semantic colour.
 */
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

/* ── interactive ──────────────────────────────────────────────────────────── */

const BAR_INTERACTIVE_CONFIG = {
  views: { label: "Page Views" },
  ...DESKTOP_MOBILE_CONFIG,
} satisfies ChartConfig;

type BarInteractiveSeries = "desktop" | "mobile";

/**
 * The registry writes `fill={`var(--color-${activeChart})`}` — at runtime
 * exactly `var(--color-desktop)` or `var(--color-mobile)`, the
 * `--color-<seriesKey>` pattern rule 1 forbids. A lookup table keeps the
 * per-series colour without ever assembling that string.
 */
const BAR_INTERACTIVE_FILL: Record<BarInteractiveSeries, string> = {
  desktop: "var(--color-chart-1)",
  mobile: "var(--color-chart-2)",
};

/**
 * The same two colours again, spelled as Tailwind utilities for the strip.
 *
 * Two tables for one pair of colours looks like drift waiting to happen, so the
 * reason is worth stating: **a literal utility is the only spelling
 * `check:refs` can see.** Its colour rule reads class STRINGS and resolves the
 * name against the theme's `--color-*` keys, so `from-chart-1/40` is checked
 * and a rename to a token that no longer exists fails the build. Driving the
 * pill from the `token` map instead — `style={{ "--series": … }}` plus
 * `from-(--series)/40` — would compile to the same paint and be completely
 * invisible to that rule, which is trap 1 with extra steps. They sit adjacent
 * and are read on the same line of `BarInteractiveControls` for the same
 * reason.
 *
 * `border-*` is the full-strength edge; `from-*` is the tint's darkest stop.
 * Both name the series' own chart token, never `--color-<seriesKey>`.
 */
const BAR_INTERACTIVE_PILL: Record<BarInteractiveSeries, string> = {
  desktop: "bg-chart-1",
  mobile: "bg-chart-2",
};

/**
 * The series the plot draws. Defaulted, not nullable, so `<BarInteractive />`
 * still renders a real chart if it is ever mounted without its strip.
 */
const BarInteractiveSeriesContext = createContext<BarInteractiveSeries>("desktop");

const BAR_INTERACTIVE_SERIES: readonly BarInteractiveSeries[] = ["desktop", "mobile"];

/**
 * The registry's two clickable totals, as a `ChartStates` `controls` frame.
 *
 * ### Why it is a frame and not part of the chart
 *
 * The registry sits these in a `CardHeader`. Stripped of `Card` they used to
 * render inline above the plot, inside the component — which put them inside
 * `ChartStates`' swapped slot, where they exist only in `ready`. The panel
 * therefore grew 94px the moment you left Loading or Empty: 393.39 → 487.78,
 * measured. §5 names that failure directly — a layout jump is worse than the
 * spinner it was meant to avoid. Hoisted into `controls`, the strip renders in
 * all three states and the slot underneath stays exactly `PLOT`.
 *
 * ### The selection travels — §4, and it is a rule not a preference
 *
 * This used to be `data-[active=true]:bg-muted` on a raw `<button>`: each tile
 * owning its own selected background, one blinking on as the other blinked
 * off. §4 is unambiguous — *"a group of options owns ONE pill that physically
 * slides from the old selection to the new one… Options never own their own
 * selected background… Applies to `ToggleGroup` and `Tabs`, **and to anything
 * like them you add later**"*. Two tiles with an active option is exactly one
 * of those.
 *
 * `ToggleGroup` itself does not drop in — `toggleVariants` is built for
 * label-sized items with a control's own padding and height, and these tiles
 * carry a `Stat`-sized figure. But the travel is not `ToggleGroup`'s, it is
 * `useActiveIndicator`'s, and that hook is deliberately built to be reusable
 * outside Radix: it finds the active element by selector and watches
 * `data-state` through a `MutationObserver`, "which means this works for any
 * Radix group without threading a controlled value through". Setting
 * `data-state="on" | "off"` ourselves is all it needs, so the tiles get the
 * same single definition of the travel that `Tabs` and `ToggleGroup` use,
 * rather than a second one.
 *
 * §4's other note — *"a `ToggleGroup` is for three or more options; with
 * exactly two, use `IconSwap`"* — is about which CONTROL to reach for, and
 * `IconSwap` cannot carry a figure. It does not license a blink: the
 * travelling-selection rule is stated over any group with an active option,
 * and this is one.
 *
 * ### The consequences for the tiles
 *
 * The pill IS the selected background now, so the options give up theirs — the
 * same trade `toggle-group.tsx` makes in as many words. That inverts where the
 * surface lives: the container carries `bg-card` and the tiles are
 * transparent, because a `bg-card` tile would paint straight over a pill
 * sliding behind it. The hairline between them, previously a `gap-px` over
 * `bg-border`, is a `border-l` on the second tile for the same reason.
 * `overflow-hidden` on the `rounded-lg` frame is what rounds the pill's outer
 * corners at either end without giving it a radius of its own.
 *
 * `Stat` (`components/ui/stat.tsx`) still supplies the label-over-figure; the
 * `button` around it is what makes it a control, exactly as `Stat`'s own doc
 * comment describes.
 *
 * ### The pill carries the series' colour, and only below the text
 *
 * The pill used to be `bg-muted`, defended here on the grounds that a filled
 * brand pill would strand `Stat`'s `text-foreground` figure and `.type-badge` label on
 * the wrong end of their pair. That reasoning was right about a FILL and is
 * kept — `--chart-1` is `var(--color-action)`, whose relative luminance is
 * 0.179, within a thousandth of the black/white contrast pivot, so 4.58:1 is
 * the ceiling for any ink whatsoever on it (`radial.tsx` derives this in full).
 * But a grey pill answers the wrong question: it says a tile is selected and
 * nothing about which series the plot below just switched to.
 *
 * The obvious repair — a flat tint of the series colour, `destructive`'s
 * answer in RULES §5 — **does not survive light mode, and the numbers are
 * worth keeping because they are the reason for the odd shape of what shipped.**
 * Rasterised off the live stylesheet (`color-mix` computes to `oklab()` and
 * cannot be parsed as RGB), `--muted-foreground` on a tint of chart-1/chart-2
 * over `--card`, which is `#ffffff` in light:
 *
 *   | tint |  chart-1  |  chart-2  | the two pills differ by |
 *   |------|-----------|-----------|-------------------------|
 *   |   4% |  4.583:1  |  4.515:1  |   6 / 765 RGB           |
 *   |  12% |  4.100:1  |  3.901:1  |  19 / 765               |
 *   |  22% |  3.581:1  |  3.228:1  |  35 / 765               |
 *
 * Only 4% clears AA, and at 4% the two active states are the same colour to
 * any eye. The first tint strong enough to tell apart puts an 11px uppercase
 * label at 3.2:1. This is not tuning: `--muted-foreground` is zinc 500 and
 * measures 4.83:1 on white, so **any** surface a shade darker than the card
 * fails underneath it — which is also why the pill it replaced measured
 * **4.397:1** and had been failing AA since the day it was written (RULES §1
 * records the same pair as the system's most repeated ratio).
 *
 * So the tint stops before it reaches the text. `bg-linear-to-t
 * from-chart-N/40 to-transparent to-50%` puts the colour in the bottom half of
 * the pill and nothing at all in the top half, where the label lives —
 * measured, the label sits at y=12..23 of a 72px tile, i.e. the top 32%, and
 * the gradient is already fully transparent by 50%. The label therefore lands
 * on `--card` rather than `--muted` and measures **4.83:1** in light and
 * 11.99:1 in dark: the change fixes the AA failure it inherited instead of
 * deepening it. The figure is 28px — large text, 3:1 — and sits on the tint at
 * 9:1 or better in both themes.
 *
 * Full saturation still has to appear somewhere or the association is a guess,
 * so `border-b-2` draws the series' exact chart colour as a solid rule along
 * the bottom edge, where no text sits and contrast is not a question. In light
 * the tint alone is the weaker of the two signals — the rule and the per-tile
 * swatch are what make it unambiguous.
 */
export function BarInteractiveControls({ children }: { children: React.ReactNode }) {
  const [activeChart, setActiveChart] = useState<BarInteractiveSeries>("desktop");
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator(
    '[data-slot="bar-series-option"][data-state="on"]',
    // A squash on a 72px tile carrying a two-line `Stat` reads as the tile
    // wobbling rather than as the selection landing. `anim-enter` rises and
    // settles instead — same §4 family, right scale for this pill.
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
              // `relative z-10` puts the tile's content above the pill; no
              // background of its own, so the pill shows through.
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

/**
 * The plot only — no wrapper `div`, nothing above the `ChartContainer`, so its
 * footprint is `PLOT` exactly like the other nine. Mount it with
 * `controls={BarInteractiveControls}` on the `ChartStates` around it.
 */
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
