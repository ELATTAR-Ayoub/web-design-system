"use client";

import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  type BaseTickContentProps,
} from "recharts";

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
  DESKTOP_CONFIG,
  DESKTOP_MOBILE_CONFIG,
  MONTHS_DESKTOP_MOBILE,
  RADAR_MONTHS,
  RADAR_MONTHS_FILL,
  PLOT,
} from "./data";

/**
 * The fourteen `chart-radar-*` registry blocks, vendored onto this system's
 * tokens.
 *
 * Same sweeps as every other chart family (see `area.tsx`'s header):
 * `hsl(var(--chart-N))` → `var(--color-chart-N)`; `var(--color-<seriesKey>)`
 * → the direct `--color-chart-1..5` names; every animated element takes
 * `{...useChartMotion()}`. `chart-radar-radius` carries the one sweep unique
 * to this pair of files — see `RadarRadius` below and `pie.tsx`'s header.
 *
 * `RadarDefault` and `RadarGridCircle` already existed, swept, in
 * `chart-demos.tsx` against a bespoke `SET_PROFILE` dataset. Checked each
 * against the real registry source rather than assumed re-homeable:
 *
 * - **`RadarDefault` genuinely matches `chart-radar-default`** — one
 *   `PolarAngleAxis`, one `PolarGrid`, one `Radar`, in that order. Re-homed,
 *   rebased onto `RADAR_MONTHS` / `DESKTOP_CONFIG`, and given the
 *   `cursor={false}` the registry sets on its tooltip that the demo had
 *   dropped.
 * - **`RadarGridCircle` did NOT match `chart-radar-grid-circle`.** The demo
 *   is two series (`eclipse`/`nightfall`) with `radialLines={false}`, a
 *   `PolarRadiusAxis`, and a `ChartLegend`; the registry variant is ONE
 *   series with a `dot`, default `radialLines` (true — the grid keeps its
 *   spokes), no legend and no radius axis. Checked the other thirteen too:
 *   none of them match the demo's composition either — it is a bespoke
 *   showcase, not a vendored copy of any one of the fourteen. `RadarGridCircle`
 *   below is vendored fresh against the true source rather than carrying the
 *   demo forward under the wrong name; the demo's own combination (two
 *   series, circle grid with no spokes, a legend) simply is not one of the
 *   fourteen shapes shadcn ships.
 */

/* ── default · dots · lines-only ─────────────────────────────────────────── */

/** The registry's `chart-radar-default`. */
export function RadarDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}

export function RadarDots() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar
          dataKey="desktop"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
          {...motion}
        />
      </RadarChart>
    </ChartContainer>
  );
}

/**
 * `data.ts` deliberately keeps this shape local (its own doc comment lists
 * `radar-lines-only` among the eight datasets no shared export should carry)
 * — a six-row `{ month, desktop, mobile }` set with its own values, close to
 * but not `MONTHS_DESKTOP_MOBILE` (every row differs). Values are the
 * registry's, unchanged.
 */
const RADAR_LINES_ONLY_DATA = [
  { month: "January", desktop: 186, mobile: 160 },
  { month: "February", desktop: 185, mobile: 170 },
  { month: "March", desktop: 207, mobile: 180 },
  { month: "April", desktop: 173, mobile: 160 },
  { month: "May", desktop: 160, mobile: 190 },
  { month: "June", desktop: 174, mobile: 204 },
];

export function RadarLinesOnly() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_LINES_ONLY_DATA}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid radialLines={false} />
        <Radar
          dataKey="desktop"
          fill="var(--color-chart-1)"
          fillOpacity={0}
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          {...motion}
        />
        <Radar
          dataKey="mobile"
          fill="var(--color-chart-2)"
          fillOpacity={0}
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          {...motion}
        />
      </RadarChart>
    </ChartContainer>
  );
}

/* ── label-custom ─────────────────────────────────────────────────────────── */

/**
 * `PolarAngleAxis`'s custom `tick` reads `chartData[index]` directly and
 * never uses the tick's own formatted `value` — the registry destructures it
 * anyway, but `BaseTickContentProps` (this recharts version) has no top-level
 * `value` field, only `payload.value`, so that destructure would not
 * typecheck here and is dropped along with the `...props` spread (its
 * remaining fields — `payload`, `tickFormatter`, `visibleTicksCount`,
 * `verticalAnchor` — are internal recharts bookkeeping, not valid attributes
 * for the literal `<text>` this returns).
 *
 * `fontSize={13}` / `fontWeight={500}` on the numbers and the bare default
 * (12, 400) on the month caption are raw SVG props for a value — text size —
 * that §0 already owns as a token family; both are invisible to
 * `check:tokens` the same way a hand-typed `animationDuration` is, so both are
 * replaced with `text-xs` on the outer `<text>` (every `<tspan>` inherits
 * it), which is the one alias close enough to the registry's 13px that this
 * system exposes without inventing a new token for a one-pixel difference.
 * `fill-foreground` anchors the numbers; `fill-muted-foreground` marks the
 * separator and the month name as the quieter parts, the same split the
 * registry draws with its own bare-default/`fill-muted-foreground` pairing.
 */
function RadarLabelCustomTick({ x, y, textAnchor, index }: BaseTickContentProps) {
  const row = MONTHS_DESKTOP_MOBILE[index];
  if (!row) return null;
  return (
    <text
      x={x}
      y={index === 0 ? Number(y) - 10 : y}
      textAnchor={textAnchor}
      className="fill-foreground text-xs"
    >
      <tspan>{row.desktop}</tspan>
      <tspan className="fill-muted-foreground">/</tspan>
      <tspan>{row.mobile}</tspan>
      <tspan x={x} dy="1rem" className="fill-muted-foreground">
        {row.month}
      </tspan>
    </text>
  );
}

export function RadarLabelCustom() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <RadarChart data={MONTHS_DESKTOP_MOBILE} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
        <PolarAngleAxis dataKey="month" tick={RadarLabelCustomTick} />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
        <Radar dataKey="mobile" fill="var(--color-chart-2)" {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}

/* ── grid-custom · grid-none · grid-circle · grid-circle-no-lines · grid-circle-fill · grid-fill ── */

export function RadarGridCustom() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        {/* `polarRadius`/`strokeWidth` are plot maths (the grid ring's own
            radius and line weight), not the 8-point scale — kept as the
            registry's raw numbers, same allowance `margin={{ top: 20 }}`
            gets elsewhere. */}
        <PolarGrid radialLines={false} polarRadius={[90]} strokeWidth={1} />
        <PolarAngleAxis dataKey="month" />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}

/** The registry's `chart-radar-grid-none` — no `PolarGrid` at all, not even a hidden one. */
export function RadarGridNone() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <Radar
          dataKey="desktop"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
          {...motion}
        />
      </RadarChart>
    </ChartContainer>
  );
}

/**
 * The registry's `chart-radar-grid-circle` — vendored fresh; see the file
 * header for why this is not the pre-existing demo carried forward under a
 * new name. `radialLines` is left at its default (true), unlike the
 * `-no-lines` sibling below.
 */
export function RadarGridCircle() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <PolarGrid gridType="circle" />
        <PolarAngleAxis dataKey="month" />
        <Radar
          dataKey="desktop"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
          {...motion}
        />
      </RadarChart>
    </ChartContainer>
  );
}

/**
 * `data.ts` keeps this dataset local — its own note lists
 * `radar-grid-circle-no-lines` among the eight. It is not `RADAR_MONTHS_FILL`
 * either: only April moves (273 → 203), Feb and June stay at `RADAR_MONTHS`'
 * values, so it is a third variant of the six-month series, not a re-export
 * of one already shared.
 */
const RADAR_GRID_CIRCLE_NO_LINES_DATA = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 203 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export function RadarGridCircleNoLines() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_GRID_CIRCLE_NO_LINES_DATA}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <PolarGrid gridType="circle" radialLines={false} />
        <PolarAngleAxis dataKey="month" />
        <Radar
          dataKey="desktop"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
          {...motion}
        />
      </RadarChart>
    </ChartContainer>
  );
}

/**
 * `className="fill-[--color-desktop] opacity-20"` in the registry is the
 * `--color-<seriesKey>` pattern wearing Tailwind's arbitrary-property
 * shorthand instead of a `var()` call — same trap, different spelling, and a
 * second one underneath it that only rendering caught.
 *
 * The direct swap, `fill-[--color-chart-1]` (bare custom property, no
 * `var()`), passes `check:tokens` and `check:refs` — neither scans for it —
 * but resolves to nothing: rasterised on the live element,
 * `getComputedStyle(...).fill` came back `"none"`, recharts' own inline
 * attribute, completely untouched. A minimal reproduction confirmed why:
 * Tailwind's JIT never generated a rule for that exact class at all (the
 * sibling `opacity-20` on the same element DID compile, proving the scanner
 * saw this file — the bare `--foo` bracket form specifically is not valid
 * arbitrary-value syntax for `fill` in this project's Tailwind setup). This
 * is the family's own version of "a chart painting nothing, and it is
 * silent" — a decorative fill rather than a series, so nothing looked empty,
 * it just quietly kept recharts' `none`.
 *
 * `fill-[var(--color-chart-1)]` — the same bracket syntax with the `var()`
 * call written out — is what actually compiles and resolves, confirmed by
 * rendering both this variant and `RadarGridFill` below: `fill: rgb(26, 110,
 * 244)`, `--chart-1`'s real colour, in both themes. This is a decorative grid
 * fill, not text, so it is not part of this file's AA table — checked only
 * for rendering (a resolved `fill`, not `none` or invalid).
 */
export function RadarGridCircleFill() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS_FILL}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} {...motion} />
        <PolarGrid className="fill-[var(--color-chart-1)] opacity-20" gridType="circle" />
        <PolarAngleAxis dataKey="month" />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.5} {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}

export function RadarGridFill() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_CONFIG} className={PLOT}>
      <RadarChart data={RADAR_MONTHS_FILL}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <PolarGrid className="fill-[var(--color-chart-1)] opacity-20" />
        <PolarAngleAxis dataKey="month" />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.5} {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}

/* ── multiple · legend · icons ────────────────────────────────────────────── */

/**
 * The registry gives `mobile` no `fillOpacity` at all (only `desktop` gets
 * `0.6`), so the second polygon paints fully opaque and sits on top of the
 * first wherever the two overlap. Kept faithful — this is the registry's own
 * choice, repeated identically in `RadarLabelCustom` above and `RadarLegend` /
 * `RadarIcons` / `RadarRadius` below, not an accident this sweep should fix.
 */
export function RadarMultiple() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <RadarChart data={MONTHS_DESKTOP_MOBILE}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
        <Radar dataKey="mobile" fill="var(--color-chart-2)" {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}

export function RadarLegend() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <RadarChart data={MONTHS_DESKTOP_MOBILE} margin={{ top: -40, bottom: -10 }}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
        <Radar dataKey="mobile" fill="var(--color-chart-2)" {...motion} />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}

/**
 * `ChartLegendContent` (`components/ui/chart.tsx`) renders `<itemConfig.icon
 * />` directly whenever a config entry carries one — the same gap
 * `area.tsx`'s `AreaStep` / `AreaIcons` already documented. `ChartConfig.icon`
 * is typed `React.ComponentType`, a bare Lucide component, not something
 * `Icon`'s props-based wrapper (`components/ui/icon.tsx`) can be dropped into
 * that slot, so this renders through the foundation file's own mechanism
 * rather than working around it.
 */
const RADAR_ICONS_CONFIG = {
  desktop: { ...DESKTOP_MOBILE_CONFIG.desktop, icon: ArrowDownFromLine },
  mobile: { ...DESKTOP_MOBILE_CONFIG.mobile, icon: ArrowUpFromLine },
} satisfies ChartConfig;

/** Structurally identical to `RadarLegend` — the registry's own `chart-radar-icons` differs only in `chartConfig`. */
export function RadarIcons() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={RADAR_ICONS_CONFIG} className={PLOT}>
      <RadarChart data={MONTHS_DESKTOP_MOBILE} margin={{ top: -40, bottom: -10 }}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
        <Radar dataKey="mobile" fill="var(--color-chart-2)" {...motion} />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}

/* ── radius ───────────────────────────────────────────────────────────────── */

/**
 * `stroke="hsla(var(--foreground))"` in the registry is the same trap as
 * `hsl(var(--chart-N))` — `--foreground` already holds a whole `hsl(...)`
 * colour (`app/globals.css`), so wrapping it in `hsla()` is invalid CSS and
 * the axis line is silently dropped. `var(--color-foreground)` replaces it —
 * the Tailwind-facing alias `globals.css` already points at `--foreground`,
 * matching the convention `line.tsx`'s `LineDotsCustom` set for raw SVG
 * colour props (`var(--color-background)` there, same family here).
 *
 * A first draft of this comment claimed `PolarRadiusAxis` renders no tick
 * text here — wrong, and caught only by rendering, exactly the trap this
 * whole task is about. Neither this component nor the true registry source
 * sets `tick={false}` on it (unlike `RadialText` / `RadialShape` in the
 * sibling file, which do); the registry even imports `PolarAngleAxis` for
 * this variant and never renders it, which is the real reason there is no
 * category axis — the radius axis's own default numeric ticks are what is
 * actually on screen. Rendered: five real `<text>` nodes reading `0 80 160
 * 240 320`. This is the first chart in the whole 70-chart effort to exercise
 * `ui/chart.tsx`'s pre-emptive defence for exactly this axis family
 * (`[&_.recharts-polar-radius-axis-tick-value]:fill-muted-foreground`, added
 * because recharts' own default here is `#ccc`, measured elsewhere at
 * 1.61:1). Rasterised: `fill: rgb(212, 212, 216)` (`--muted-foreground`) in
 * both themes, **13.46:1 dark, 4.83:1 light** against the panel background —
 * the defence holds on first real contact. No tick text is unmeasured on
 * this axis; there is exactly one slot, and it clears AA with margin in both
 * themes.
 */
export function RadarRadius() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <RadarChart data={MONTHS_DESKTOP_MOBILE}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" labelKey="month" />}
          {...motion}
        />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-chart-1)" fillOpacity={0.6} {...motion} />
        <Radar dataKey="mobile" fill="var(--color-chart-2)" {...motion} />
        <PolarRadiusAxis
          angle={60}
          stroke="var(--color-foreground)"
          orientation="middle"
          axisLine={false}
        />
      </RadarChart>
    </ChartContainer>
  );
}
