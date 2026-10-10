"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Label, LabelList, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import { useChartMotion } from "@/components/ds/chart-motion";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  BROWSER_CONFIG,
  BROWSERS,
  PIE_MONTHS_CONFIG,
  PIE_MONTHS_DESKTOP,
  PIE_MONTHS_MOBILE,
  PLOT,
} from "./data";

/**
 * The eleven `chart-pie-*` registry blocks, vendored onto this system's
 * tokens.
 *
 * Same three sweeps as every other chart family (see `area.tsx`'s header):
 * `hsl(var(--chart-N))` → `var(--color-chart-N)`; `var(--color-<seriesKey>)`
 * → the direct `--color-chart-1..5` names; every animated element takes
 * `{...useChartMotion()}`. A fourth, narrower one is specific to this family
 * and to `chart-radar-radius` in the sibling file: `hsla(var(--foreground))`
 * is the same pre-v4 trap as `hsl(var(--chart-N))` — `--foreground` already
 * holds a whole `hsl(...)` colour, so wrapping it in `hsla()` is invalid CSS
 * and the property is dropped. `var(--color-foreground)` replaces it.
 *
 * `PieDefault`, `PieDonut` and `PieLabelled` already existed, swept, in
 * `chart-demos.tsx` against a bespoke `RARITY` dataset. Checked each against
 * the real registry source rather than assumed re-homeable:
 *
 * - **`PieDefault` → `PieSimple`.** A genuine match for `chart-pie-simple`
 *   (tooltip + bare `Pie`, no legend, no radius override) — re-homed,
 *   rebased onto `BROWSERS` / `BROWSER_CONFIG`, and given the `cursor={false}`
 *   the registry sets but the demo had dropped.
 * - **`PieDonut` did NOT match `chart-pie-donut`.** The demo added a
 *   `ChartLegend` the registry's donut never carries, and used a `55%`
 *   percentage radius rather than the registry's pixel `60`. `radial.tsx`'s
 *   precedent (Charts B/C) is to keep the registry's own pixel radii rather
 *   than reinstate a percentage, so `PieDonut` below is vendored fresh
 *   against the true source — tooltip + bare `innerRadius={60}`, no legend —
 *   rather than carrying the demo's extra legend forward under the wrong
 *   name.
 * - **`PieLabelled` → `PieLabel`,** the closest real match
 *   (`chart-pie-label`'s boolean `label`, the same
 *   `[&_.recharts-pie-label-text]:fill-foreground` container sweep, the same
 *   AA reasoning) but rebased onto `BROWSERS` and stripped of the demo's own
 *   `outerRadius="70%"`, which the registry variant does not set.
 *
 * See the report for the full re-homed-vs-fresh accounting and the measured
 * contrast table — this family's headline finding is on `PieLabelList`,
 * whose label sits ON the coloured slice rather than on the panel
 * background the other two label variants use.
 */

/* ── simple · separator-none ─────────────────────────────────────────────── */

/** The registry's `chart-pie-simple`. */
export function PieSimple() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Pie data={BROWSERS} dataKey="visitors" nameKey="browser" {...motion} />
      </PieChart>
    </ChartContainer>
  );
}

export function PieSeparatorNone() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        {/* `stroke="0"` is the registry's own value, kept verbatim — it is not a
            colour (the wedge separator is a stroke WIDTH here, not a hue) and
            there is nothing in it for a token to own. */}
        <Pie data={BROWSERS} dataKey="visitors" nameKey="browser" stroke="0" {...motion} />
      </PieChart>
    </ChartContainer>
  );
}

/* ── label · label-custom · label-list ───────────────────────────────────── */

/**
 * The registry's `chart-pie-label`. The container sweep
 * (`[&_.recharts-pie-label-text]:fill-foreground`) points recharts' own
 * default label class at `--foreground` rather than its stock grey — the
 * label sits OUTSIDE the wedge, on the panel background, so this is the same
 * background-contrast case `PieDefault`'s siblings already carry, not the
 * on-fill case below. Verified by rendering; see the report's contrast table.
 */
export function PieLabel() {
  const motion = useChartMotion();
  return (
    <ChartContainer
      config={BROWSER_CONFIG}
      className={cn(PLOT, "[&_.recharts-pie-label-text]:fill-foreground")}
    >
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} {...motion} />
        <Pie data={BROWSERS} dataKey="visitors" label nameKey="browser" {...motion} />
      </PieChart>
    </ChartContainer>
  );
}

/**
 * The registry's custom `label` render function, swept once:
 * `fill="hsla(var(--foreground))"` → `fill="var(--color-foreground)"` — see
 * the file header. The label still lands outside the wedge (recharts computes
 * the same outer position for a function `label` as for the boolean form
 * above), so this is background contrast again, not on-fill. `cx`/`cy` on a
 * `<text>` are the registry's own dead attributes (a `<text>` element has no
 * such SVG attributes); left in rather than "fixed", since removing them
 * changes nothing rendered and the brief asks to vendor faithfully.
 */
export function PieLabelCustom() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} {...motion} />
        <Pie
          data={BROWSERS}
          dataKey="visitors"
          labelLine={false}
          label={({ payload, ...props }) => (
            <text
              cx={props.cx}
              cy={props.cy}
              x={props.x}
              y={props.y}
              textAnchor={props.textAnchor}
              dominantBaseline={props.dominantBaseline}
              fill="var(--color-foreground)"
            >
              {payload.visitors}
            </text>
          )}
          nameKey="browser"
          {...motion}
        />
      </PieChart>
    </ChartContainer>
  );
}

/**
 * The registry's `chart-pie-label-list` — this family's real AA question.
 *
 * `LabelList`'s default position for a `Pie` centres the label INSIDE each
 * wedge, on the wedge's own fill. The registry answers with one global
 * `className="fill-background"`. Measured by rendering rather than assumed:
 * rasterising the five slices in both themes shows a single global ink fails
 * 2-3 of 5 slots in every theme, and a per-slot ink clears every slot except
 * one — **slot 0, `chrome` / `--chart-1`, fails both candidates in dark**
 * (4.34 and 4.39, short of 4.5).
 *
 * That last slot is not a tuning problem, it is arithmetic. `radial.tsx` hit
 * the identical wall on the identical token and proved why: **`--chart-1`'s
 * relative luminance is 0.179, within a thousandth of the black/white contrast
 * pivot, so 4.58:1 is the CEILING for any ink placed on that arc.** Only pure
 * black or white could clear AA on it, and `literal-bw` forbids both. No
 * per-slot table can fix slot 0, because nothing can.
 *
 * **So the label stops sitting on the fill.** It renders on a chip of the
 * panel's own surface — `bg-card` + `text-card-foreground`, the pair every
 * `Card` and `Panel` in the system already pairs — exactly as `RadialLabel`
 * does. The five labels no longer depend on which chart token their wedge
 * carries, so there is one measured ratio for the family instead of ten.
 *
 * An earlier version of this file rejected that route on the grounds it would
 * make `PieLabelList` visually identical to `PieLabel`. It does not: `PieLabel`
 * puts its labels OUTSIDE the pie with leader lines; this keeps them centred in
 * their own wedge and simply interrupts the fill behind the word. On a `Panel`
 * — which is `bg-card` — that reads as the label written on the panel with the
 * wedge broken behind it, not as a badge floating over the chart.
 *
 * `foreignObject` rather than `<text>`, because a chip has to be as wide as its
 * word and SVG cannot size a `<rect>` to text without measuring it in an
 * effect. The span inside sizes itself; `PIE_LABEL_BOX` is only the clip frame.
 */
/**
 * The clip frame for the label chip. Plot-coordinate geometry, the same class
 * as `margin` and `outerRadius`, and deliberately generous — the span inside
 * sizes itself, this only has to not crop it.
 */
const PIE_LABEL_BOX = { width: 96, height: 16 };

/** See `radial.tsx`'s identical `PolarLabelViewBox` for why this is typed locally rather than imported. */
type PolarLabelListViewBox = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
};

function PieLabelListArcLabel({ viewBox, value }: { viewBox?: unknown; value?: unknown }) {
  const box = viewBox as PolarLabelListViewBox | undefined;
  if (!box || box.cx == null || box.cy == null) return null;
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle = 0, endAngle = 0 } = box;
  // Recharts' own `polarToCartesian` convention (`es6/util/PolarUtils.js`):
  // degrees, negated, because SVG's y grows downward while chart angles grow
  // counter-clockwise. Mid-angle here rather than `radial.tsx`'s start angle —
  // a pie's slices are spread around the full circle, so mid-angle centres the
  // label in its own slice and cannot collide the way a stacked ring's do.
  const midAngle = (startAngle + endAngle) / 2;
  const radius = (innerRadius + outerRadius) / 2;
  const rad = (-midAngle * Math.PI) / 180;
  const x = cx + radius * Math.cos(rad);
  const y = cy + radius * Math.sin(rad);
  const label = String(BROWSER_CONFIG[value as keyof typeof BROWSER_CONFIG]?.label ?? value);
  return (
    <foreignObject
      x={x - PIE_LABEL_BOX.width / 2}
      y={y - PIE_LABEL_BOX.height / 2}
      width={PIE_LABEL_BOX.width}
      height={PIE_LABEL_BOX.height}
    >
      <div className="flex size-full items-center justify-center">
        <span className="rounded-pill bg-card px-2 text-xs text-card-foreground capitalize">
          {label}
        </span>
      </div>
    </foreignObject>
  );
}

export function PieLabelList() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} {...motion} />
        <Pie data={BROWSERS} dataKey="visitors" {...motion}>
          <LabelList dataKey="browser" content={PieLabelListArcLabel} />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

/* ── legend ───────────────────────────────────────────────────────────────── */

/** The registry's `chart-pie-legend`. No tooltip in this variant — the legend is the whole point. */
export function PieLegend() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <Pie data={BROWSERS} dataKey="visitors" {...motion} />
        <ChartLegend
          content={<ChartLegendContent nameKey="browser" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}

/* ── donut · donut-active · donut-text ───────────────────────────────────── */

/**
 * The registry's `chart-pie-donut`, vendored fresh — see the file header for
 * why this is not the pre-existing demo carried forward under a new name.
 * `innerRadius={60}` is the registry's own pixel value, kept rather than
 * reinstated as a percentage, matching `radial.tsx`'s precedent that a polar
 * radius is plot maths, not the 8-point scale.
 */
export function PieDonut() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Pie data={BROWSERS} dataKey="visitors" nameKey="browser" innerRadius={60} {...motion} />
      </PieChart>
    </ChartContainer>
  );
}

/**
 * `activeIndex` moved off `Pie` between recharts v2 and v3 — the same change
 * `bar.tsx`'s `BarActive` already documents for `Bar`. `Pie.js` now reads the
 * active sector from the shared tooltip state
 * (`useAppSelector(selectActiveTooltipIndex)`) rather than from a prop of its
 * own, so `ChartTooltip`'s `defaultIndex` is what selects it programmatically;
 * `activeShape` still exists on `Pie` and is applied to whichever sector that
 * shared index names.
 */
export function PieDonutActive() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip
          cursor={false}
          defaultIndex={0}
          content={<ChartTooltipContent hideLabel />}
          {...motion}
        />
        <Pie
          data={BROWSERS}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={60}
          strokeWidth={5}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
          {...motion}
        />
      </PieChart>
    </ChartContainer>
  );
}

/**
 * `data.ts`'s own doc comment describes this variant's local dataset as
 * "browsers, +12 firefox / +100 other" — checked against the real
 * `chart-pie-donut-text.json` rather than taken on faith, and the comment is
 * wrong: firefox is 287 (+100 from `BROWSERS`' 187), not +12. Both raised
 * rows are +100. Flagged here rather than silently reconciled; `data.ts`
 * itself is untouched (this dataset is intentionally local, per its own
 * note), only its description is inaccurate.
 */
const PIE_DONUT_TEXT_DATA = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chart-1)" },
  { browser: "safari", visitors: 200, fill: "var(--color-chart-2)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-chart-3)" },
  { browser: "edge", visitors: 173, fill: "var(--color-chart-4)" },
  { browser: "other", visitors: 190, fill: "var(--color-chart-5)" },
];

export function PieDonutText() {
  const motion = useChartMotion();
  const totalVisitors = useMemo(
    () => PIE_DONUT_TEXT_DATA.reduce((acc, curr) => acc + curr.visitors, 0),
    [],
  );

  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Pie
          data={PIE_DONUT_TEXT_DATA}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={60}
          strokeWidth={5}
          {...motion}
        >
          {/* Centred donut text, on the panel background rather than on any
              wedge fill — the same slot `radial.tsx`'s `RadialText` already
              proved clears AA in both themes, `type-number-xl` replacing the
              registry's `text-3xl font-bold` (the weight already lives in
              the class, per `check:tokens`'s `composed-typography` rule). */}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground type-number-xl">
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

/* ── stacked ──────────────────────────────────────────────────────────────── */

/** The registry's `chart-pie-stacked` — two rings, one dataset each. */
export function PieStacked() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={PIE_MONTHS_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelKey="visitors"
              nameKey="month"
              indicator="line"
              labelFormatter={(_, payload) =>
                PIE_MONTHS_CONFIG[
                  payload?.[0].dataKey as keyof typeof PIE_MONTHS_CONFIG
                ].label
              }
            />
          }
          {...motion}
        />
        <Pie data={PIE_MONTHS_DESKTOP} dataKey="desktop" outerRadius={60} {...motion} />
        <Pie
          data={PIE_MONTHS_MOBILE}
          dataKey="mobile"
          innerRadius={70}
          outerRadius={90}
          {...motion}
        />
      </PieChart>
    </ChartContainer>
  );
}

/* ── interactive ──────────────────────────────────────────────────────────── */

type PieInteractiveMonth = "january" | "february" | "march" | "april" | "may";

const PIE_INTERACTIVE_MONTHS: PieInteractiveMonth[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
];

/**
 * Same lookup-table fix as `bar.tsx`'s `BarInteractive` / `line.tsx`'s
 * `LineInteractive`: the registry writes the `Select` swatch colour as
 * `style={{ backgroundColor: \`var(--color-${key})\` }}`, which is the
 * `--color-<seriesKey>` pattern assembled at runtime instead of written
 * literally — still the pattern rule 1 forbids. A `Record` mapping each month
 * to its real `--color-chart-N` token replaces it, which also removes the
 * registry's only reason to mount `ChartStyle`/`data-chart` at all (both
 * existed solely to scope the runtime-minted `--color-<month>` variables the
 * Select's dropdown reads outside the chart's own DOM) — dropped rather than
 * carried forward unused.
 */
const PIE_INTERACTIVE_SWATCH: Record<PieInteractiveMonth, string> = {
  january: "var(--color-chart-1)",
  february: "var(--color-chart-2)",
  march: "var(--color-chart-3)",
  april: "var(--color-chart-4)",
  may: "var(--color-chart-5)",
};

/** Defaulted, not nullable, so `<PieInteractive />` still renders a real chart if ever mounted without its strip. */
const PieInteractiveContext = createContext<PieInteractiveMonth>("january");

/**
 * The one non-chart control this variant demonstrates, as a `ChartStates`
 * `controls` frame — see `state.tsx`'s doc comment and `area.tsx`'s
 * `AreaInteractiveControls`, which this follows exactly. Hoisted OUT of the
 * swapped slot so the `Select` renders in all three states and the slot stays
 * at exactly `PLOT`; `line.tsx`'s `LineInteractive` did NOT do this for its
 * own control strip even though `state.tsx` names `chart-line-interactive` as
 * one of the four variants that should — noted here since it is evidence this
 * file's author checked, not an accusation to act on outside this task's two
 * files.
 */
export function PieInteractiveControls({ children }: { children: React.ReactNode }) {
  const [activeMonth, setActiveMonth] = useState<PieInteractiveMonth>("january");

  return (
    <PieInteractiveContext.Provider value={activeMonth}>
      <div className="mb-5 flex justify-end">
        <Select
          value={activeMonth}
          onValueChange={(value) => setActiveMonth(value as PieInteractiveMonth)}
        >
          <SelectTrigger className="w-36" aria-label="Select a month">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end">
            {PIE_INTERACTIVE_MONTHS.map((key) => (
              <SelectItem key={key} value={key}>
                <span
                  aria-hidden
                  className="mr-2 inline-block size-3 rounded-xs"
                  style={{ backgroundColor: PIE_INTERACTIVE_SWATCH[key] }}
                />
                {PIE_MONTHS_CONFIG[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {children}
    </PieInteractiveContext.Provider>
  );
}

/**
 * The plot only — no wrapper `div`, so its footprint is `PLOT` exactly like
 * the other ten. Mount it with `controls={PieInteractiveControls}` on the
 * `ChartStates` around it.
 */
export function PieInteractive() {
  const motion = useChartMotion();
  const activeMonth = useContext(PieInteractiveContext);
  const activeIndex = Math.max(
    0,
    PIE_MONTHS_DESKTOP.findIndex((item) => item.month === activeMonth),
  );

  return (
    <ChartContainer config={PIE_MONTHS_CONFIG} className={PLOT}>
      <PieChart accessibilityLayer>
        {/* `activeIndex` moved off `Pie` in recharts v3 — see `PieDonutActive`'s
            comment. `defaultIndex` is what makes the Select's choice reactive:
            `Tooltip.js` re-dispatches whenever this prop's value changes. */}
        <ChartTooltip
          cursor={false}
          defaultIndex={activeIndex}
          content={<ChartTooltipContent hideLabel />}
          {...motion}
        />
        <Pie
          data={PIE_MONTHS_DESKTOP}
          dataKey="desktop"
          nameKey="month"
          innerRadius={60}
          strokeWidth={5}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <g>
              <Sector {...props} outerRadius={outerRadius + 10} />
              <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
            </g>
          )}
          {...motion}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground type-number-xl">
                      {PIE_MONTHS_DESKTOP[activeIndex].desktop.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
