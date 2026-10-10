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

/**
 * The ten `chart-line-*` registry blocks, vendored onto this system's tokens.
 *
 * Same three sweeps as `area.tsx` and `bar.tsx` (see either header): `hsl(var(
 * --chart-N))` → `var(--color-chart-N)`; `var(--color-<seriesKey>)` → the same
 * direct `--color-chart-1..5` names; every animated element takes
 * `{...useChartMotion()}`.
 *
 * Two more are specific to this family:
 *
 * - **`GitCommitVertical` (`LineDotsCustom`) renders directly, not through
 *   `Icon`.** It is passed to `Line`'s `dot` prop, which recharts calls with
 *   `cx`/`cy`/`width`/`height` computed from the plot's own scale and expects
 *   an SVG element positioned in that coordinate space back. `Icon`
 *   (`components/ui/icon.tsx`) renders a sized glyph in normal flow via
 *   Tailwind classes; it has no prop for "paint at this absolute SVG
 *   position", so there is nothing to route through it, the same gap
 *   `AreaStep` / `AreaIcons` documented for `ChartConfig.icon`.
 * - **`LineDotsColors` needs a colour per dot, and `data.ts`'s `BROWSERS` is
 *   already exactly five rows of `chart-1..5`.** No cycling and no sixth
 *   colour — see the note at its call site.
 *
 * **`LineInteractive` is mounted differently from the other nine.** Its pair of
 * clickable totals is a second export, `LineInteractiveControls`, and goes in
 * `ChartStates`' `controls` slot so it renders in all three states rather than
 * only in `ready`:
 *
 * ```tsx
 * <ChartStates title="Interactive" note="chart-line-interactive" skeleton="line"
 *              controls={LineInteractiveControls}>
 *   <LineInteractive />
 * </ChartStates>
 * ```
 *
 * Inline, that strip made the panel 94px taller in `ready` than in the other
 * two states — measured 393.39 → 487.78, the same break `area.tsx` and
 * `bar.tsx` were fixed for. The reasoning is on `LineInteractiveControls`
 * itself.
 *
 * `LineDefault`, `LineMultiple` and `LineDots` already existed, swept, in
 * `chart-demos.tsx` against a bespoke "trade" dataset. Re-homed here with the
 * sweep discipline carried over, rebased onto `data.ts`'s shared fixtures —
 * see the report.
 */

/* ── default · linear · step ─────────────────────────────────────────────── */

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

/* ── multiple ─────────────────────────────────────────────────────────────── */

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

/* ── dots · dots-custom · dots-colors ────────────────────────────────────── */

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
            // The glyph cannot route through `Icon` (see the header), but its
            // SIZE still comes off the icon ladder rather than being typed:
            // `ICON_SIZES` is the same table `Icon` itself reads, so `xl` is
            // 24 in one place only. The registry hardcodes 24 here.
            const r = ICON_SIZES.xl;
            return (
              // allow-direct-icon: recharts requires an absolutely positioned
              // SVG glyph with cx/cy-derived coordinates; Icon renders in flow.
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

/**
 * The registry draws one line through five categorical points (`BROWSERS`)
 * and colours each dot from its own row rather than from a series palette —
 * `data.ts`'s `BROWSERS` already carries `fill: var(--color-chart-1..5)`
 * per row, so the custom dot renderer below reads that directly. Five rows,
 * five tokens, no cycling and no sixth colour needed.
 *
 * The connecting line itself is not a `--color-<seriesKey>` case: the
 * registry names it `var(--color-visitors)`, but `visitors` is the value key
 * (`BROWSER_CONFIG.visitors` deliberately carries no colour — see `data.ts`),
 * so the stroke is written as the plain `--color-chart-2` the registry's own
 * `chartConfig.visitors.color` resolves to, not through the config at all.
 */
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

/* ── label · label-custom ─────────────────────────────────────────────────── */

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

/**
 * `LabelList`'s `formatter` is typed to return `RenderableText` (`string |
 * number | boolean | null | undefined` — see `recharts/types/component/
 * Text.d.ts`), not `ReactNode`. `ChartConfig.label` is typed `React.ReactNode`,
 * so `chartConfig[value]?.label` fails that signature the same way
 * `bar.tsx`'s `tickFormatter`s did — `String(...)` closes the gap the same
 * way, with the raw value kept as a fallback.
 */
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

/* ── interactive ──────────────────────────────────────────────────────────── */

const LINE_INTERACTIVE_CONFIG = {
  views: { label: "Page Views" },
  ...DESKTOP_MOBILE_CONFIG,
} satisfies ChartConfig;

type LineInteractiveSeries = "desktop" | "mobile";

/**
 * Same lookup-table fix as `bar.tsx`'s `BarInteractive`: the registry writes
 * `stroke={`var(--color-${activeChart})`}`, which at runtime is exactly
 * `var(--color-desktop)` / `var(--color-mobile)` — the `--color-<seriesKey>`
 * pattern rule 1 forbids, just assembled instead of written literally.
 */
const LINE_INTERACTIVE_STROKE: Record<LineInteractiveSeries, string> = {
  desktop: "var(--color-chart-1)",
  mobile: "var(--color-chart-2)",
};

/**
 * The same two colours as Tailwind utilities, for the strip — `bar.tsx`'s
 * `BAR_INTERACTIVE_PILL` and its reasoning, one file over: a literal utility is
 * the only spelling `check:refs`' colour rule can resolve, so `from-chart-1/40`
 * is guarded and `from-(--series)/40` fed by a style object would not be.
 *
 * `border-*` is the full-strength edge; `from-*` is the tint's darkest stop.
 */
const LINE_INTERACTIVE_PILL: Record<LineInteractiveSeries, string> = {
  desktop: "bg-chart-1",
  mobile: "bg-chart-2",
};

/**
 * The series the plot draws. Defaulted, not nullable, so `<LineInteractive />`
 * still renders a real chart if it is ever mounted without its strip.
 */
const LineInteractiveSeriesContext = createContext<LineInteractiveSeries>("desktop");

const LINE_INTERACTIVE_SERIES: readonly LineInteractiveSeries[] = ["desktop", "mobile"];

/**
 * The registry's two clickable totals, as a `ChartStates` `controls` frame.
 *
 * ### Why it is a frame and not part of the chart
 *
 * The registry sits these in a `CardHeader`. Stripped of `Card` they used to
 * render inline above the plot, inside this component — which put them inside
 * `ChartStates`' swapped slot, where they exist only in `ready`. The panel
 * therefore grew 94px the moment you left Loading or Empty: 393.39 → 487.78,
 * measured on this exact specimen. §5 names that failure directly — a layout
 * jump is worse than the spinner it was meant to avoid. Hoisted into
 * `controls`, the strip renders in all three states and the slot underneath
 * stays exactly `PLOT`.
 *
 * The state has to come with it, because the strip and the plot must agree on
 * which series is drawn, and a context is how it reaches back DOWN through the
 * keyed slot. `useState` here is user-driven — the click sets it directly — so
 * `react-hooks/set-state-in-effect` has nothing to flag.
 *
 * ### The selection travels — §4, and it is a rule not a preference
 *
 * This used to be `data-[active=true]:bg-muted` on a raw `<button>`: each tile
 * owning its own selected background, one blinking on as the other blinked
 * off. §4 is unambiguous — *"a group of options owns ONE pill that physically
 * slides from the old selection to the new one… Options never own their own
 * selected background… Applies to `ToggleGroup` and `Tabs`, **and to anything
 * like them you add later**"*.
 *
 * `ToggleGroup` itself does not drop in — `toggleVariants` is built for
 * label-sized items with a control's own padding and height, and these tiles
 * carry a `Stat`-sized figure. But the travel is not `ToggleGroup`'s, it is
 * `useActiveIndicator`'s, and that hook is deliberately built to be reusable
 * outside Radix: it finds the active element by selector and watches
 * `data-state` through a `MutationObserver`, "which means this works for any
 * Radix group without threading a controlled value through". Setting
 * `data-state="on" | "off"` ourselves is all it needs, so the tiles get the
 * same single definition of the travel that `Tabs` and `ToggleGroup` use.
 *
 * This is `bar.tsx`'s `BarInteractiveControls` deliberately duplicated rather
 * than shared: the two strips read different totals into different contexts and
 * drive different plots, and the only common part — the travel — already lives
 * in one place, in `useActiveIndicator`.
 *
 * ### The consequences for the tiles
 *
 * The pill IS the selected background now, so the options give up theirs. That
 * inverts where the surface lives: the container carries `bg-card` and the
 * tiles are transparent, because a `bg-card` tile would paint straight over a
 * pill sliding behind it. The hairline between them, previously a `gap-px` over
 * `bg-border`, is a `border-l` on the second tile for the same reason.
 * `overflow-hidden` on the `rounded-lg` frame is what rounds the pill's outer
 * corners at either end without giving it a radius of its own.
 *
 * ### The pill carries the series' colour, and only below the text
 *
 * `bar.tsx`'s `BarInteractiveControls` carries the full derivation and the
 * measured table; this is the same strip driving the same two chart tokens, so
 * it takes the same treatment rather than a second answer. In one paragraph:
 * a grey pill says a tile is selected and nothing about WHICH series the plot
 * switched to, but a flat tint of the series colour cannot fix that in light
 * mode — `--muted-foreground` measures 4.83:1 on `--card`, so the only tint
 * that keeps the 14px `.type-badge` label above AA is 4%, and at 4% the two active
 * states are the same colour. The tint therefore stops before it reaches the
 * text: the bottom half of the pill carries it, the top half — where the label
 * sits, measured at the top 32% of a 72px tile — carries none, and a
 * `border-b-2` of the exact chart colour puts full saturation somewhere no text
 * has to survive. The label lands on `--card` instead of `--muted` and gains
 * contrast: 4.83:1 light, 11.99:1 dark, against the 4.397:1 the `bg-muted`
 * pill had been failing AA with.
 */
export function LineInteractiveControls({ children }: { children: React.ReactNode }) {
  const [activeChart, setActiveChart] = useState<LineInteractiveSeries>("desktop");
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator(
    '[data-slot="line-series-option"][data-state="on"]',
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
              // `relative z-10` puts the tile's content above the pill; no
              // background of its own, so the pill shows through.
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

/**
 * The plot only — no wrapper `div`, nothing above the `ChartContainer`, so its
 * footprint is `PLOT` exactly like the other nine. Mount it with
 * `controls={LineInteractiveControls}` on the `ChartStates` around it.
 */
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
