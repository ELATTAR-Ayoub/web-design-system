"use client";

import { useSyncExternalStore } from "react";
import {
  Label,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { useChartMotion } from "@/components/ds/chart-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

import { BROWSER_CONFIG, BROWSERS, DESKTOP_MOBILE_CONFIG, PLOT } from "./data";

/**
 * The six `chart-radial-*` registry blocks, vendored onto this system's
 * tokens.
 *
 * Same sweeps as every other chart family (see `area.tsx`'s header):
 * `hsl(var(--chart-N))` → `var(--color-chart-N)`; `var(--color-<seriesKey>)`
 * → the direct `--color-chart-1..5` names; every animated element takes
 * `{...useChartMotion()}`.
 *
 * `RadialDefault` and `RadialStacked` already existed, swept, in
 * `chart-demos.tsx` against bespoke datasets (`RARITY`, `VAULT`). Both are
 * renamed to match the registry's own variant names — `RadialDefault` is the
 * registry's `chart-radial-simple` (renamed `RadialSimple` here — see below)
 * — and rebased onto `data.ts`'s shared fixtures.
 *
 * One container rule specific to this family: the registry wraps every
 * variant in `"mx-auto aspect-square max-h-[250px]"`, an arbitrary value this
 * repo's `check:tokens` rejects outright. The pre-existing `RadialDefault` /
 * `RadialStacked` already settled this the same way every other family does
 * — `className={PLOT}`, no aspect wrapper — and recharts' own
 * `ResponsiveContainer` sizes the polar plot to fit inside it. Kept for all
 * six rather than reopened per variant.
 *
 * `cornerRadius` comes from the block below rather than from the registry's
 * raw `10` / `5`, and the in-arc labels of `RadialLabel` sit on a surface
 * rather than on the arc — both are documented at their own definitions.
 */

/* ── The arc's corner radius, read rather than typed ──────────────────────── */

/**
 * The registry writes `cornerRadius={10}` on `chart-radial-text` and
 * `cornerRadius={5}` twice on `chart-radial-stacked`. `check:tokens` cannot
 * see a number in a JSX prop, and §0 is the rule while the guard is only its
 * enforcement — a corner size invented at the call site is exactly what §3's
 * radius ladder governs, so it comes off the ladder here.
 *
 * The mechanism is `bar.tsx`'s `useBarRadius()`, which is `chart-motion.ts`'s
 * pattern one token family over: recharts bakes the corner into the sector's
 * `<path>` `d`, so no class can reach it, and the answer is neither to
 * hardcode the pixel nor to give up the corner — it is to READ the token off
 * the live stylesheet. `chart-motion.ts`'s own header: *"this is the one place
 * in the system where §0 is upheld by reading rather than by writing."*
 *
 * **Why it is duplicated here rather than promoted.** `charts-ab-fix-report.md`
 * asks for `useBarRadius` to move into `chart-motion.ts` if a second family
 * wants it. That is the right end state and it is deliberately not done in this
 * commit: `chart-motion.ts` and `bar.tsx` are outside this task's two assigned
 * files, and a third chart family was live in the same worktree while this was
 * written — the same constraint `bar.tsx` recorded when it declined to put the
 * hook there in the first place. **Whoever next owns both files should promote
 * it and delete this block**, rather than a third copy appearing.
 *
 * **Why two rungs and not one.** `bar.tsx` collapsed 8/5/4 to a single
 * `--radius-sm`, because those three were the same bar corner drawn three ways.
 * These two are not: `10` is *exactly* the `md` rung already, on a 30px-thick
 * single ring, so reading it changes the spelling and nothing else; `5` is not
 * a rung at all and moves to `sm` (6), the same rung every bar corner in this
 * system already takes, on stacked bands half that thickness.
 *
 * The subscription is a deliberate no-op for the same reason `bar.tsx` gives:
 * the ladder is declared once in `@theme static` and neither `:root` nor
 * `.dark` redeclares a rung of it, so there is nothing for an observer to
 * observe. If a theme ever does take its own radius, this moves onto
 * `chart-motion.ts`'s observer rather than growing one of its own.
 */
const RING_RADIUS_TOKEN = "--radius-md";
const STACK_RADIUS_TOKEN = "--radius-sm";

/**
 * The server-render fallbacks, restating the two rungs exactly as
 * `chart-motion.ts`'s `SSR_DURATION_MS` restates its own token and for the same
 * reason: `getComputedStyle` does not exist on the server, and the alternative
 * is a square arc until hydration. Unreachable in a browser.
 */
const SSR_RING_RADIUS = 10;
const SSR_STACK_RADIUS = 6;

/** Read a `--radius-*` token and return it as a number of pixels. */
function readRadiusPx(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw.endsWith("px")) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

const subscribeRadius = () => () => {};
const getRingRadius = () => readRadiusPx(RING_RADIUS_TOKEN, SSR_RING_RADIUS);
const getRingRadiusOnServer = () => SSR_RING_RADIUS;
const getStackRadius = () => readRadiusPx(STACK_RADIUS_TOKEN, SSR_STACK_RADIUS);
const getStackRadiusOnServer = () => SSR_STACK_RADIUS;

/**
 * `useSyncExternalStore` rather than a bare read in the render body: the DOM is
 * outside React, this repo lints under the React Compiler rules, and
 * `chart-motion.ts` and `hooks/use-mobile.ts` are the two models already here.
 */
function useRingCornerRadius(): number {
  return useSyncExternalStore(subscribeRadius, getRingRadius, getRingRadiusOnServer);
}

function useStackCornerRadius(): number {
  return useSyncExternalStore(subscribeRadius, getStackRadius, getStackRadiusOnServer);
}

/* ── simple · grid ────────────────────────────────────────────────────────── */

/** The registry's `chart-radial-simple`. */
export function RadialSimple() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <RadialBarChart data={BROWSERS} innerRadius={30} outerRadius={110}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
          {...motion}
        />
        <RadialBar dataKey="visitors" background {...motion} />
      </RadialBarChart>
    </ChartContainer>
  );
}

export function RadialGrid() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <RadialBarChart data={BROWSERS} innerRadius={30} outerRadius={100}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
          {...motion}
        />
        <PolarGrid gridType="circle" />
        <RadialBar dataKey="visitors" {...motion} />
      </RadialBarChart>
    </ChartContainer>
  );
}

/* ── label ────────────────────────────────────────────────────────────────── */

/**
 * The one true AA problem in this family, and why the label ends up on the
 * panel's own surface rather than on the arc.
 *
 * The registry paints every in-arc label the same way: `className="fill-white
 * capitalize mix-blend-luminosity"`. `fill-white` fails `check:tokens`
 * outright (`literal-bw`) — but even granting it a pass, `mix-blend-luminosity`
 * forces every label to the *lightest* legible version of whatever is behind
 * it, and two of this system's five chart tokens are already near the lightest
 * end of the ramp, so the blend has nothing to lift against and the label
 * nearly disappears into its own arc.
 *
 * The first attempt at a fix was a per-slot ink table — `fill-background` or
 * `fill-foreground`, whichever measured better against that slot's own arc.
 * Four of the five cleared 4.5:1 with room. **The `--chart-1` slot could not,
 * and no ink in this system can make it.** Rasterised (`getComputedStyle` on
 * the live `<text>` and on its own `.recharts-radial-bar-sector`, painted
 * through a 1×1 canvas, never parsed): `foreground` on `--chart-1` is
 * **4.39:1** dark / 4.34:1 light, `background` **4.34:1** dark / 4.58:1 light.
 * Only the light pairing clears, and only because light's `--background` is
 * literally `#ffffff`.
 *
 * That is not a near miss to be tuned away — it is arithmetic, and worth
 * writing down because it decides the shape of the fix. `--chart-1` is
 * `var(--color-action)`, `#1a6ef4`, and its measured relative luminance is
 * **0.179** — within a thousandth of √(1.05 × 0.05) − 0.05 = 0.1791, the
 * luminance at which black and white are EQUALLY legible and every colour is
 * at its least. Measured, not derived: pure white reads **4.58:1** on it and
 * pure black reads **4.58:1** on it. So 4.58 is the ceiling for any ink
 * whatsoever, in either theme, and only the two extremes reach it — which
 * `literal-bw` forbids writing in any case. Dark's `--foreground` (`#fafafa`)
 * and `--background` (`#09090b`) each spend that 0.08 of headroom just by not
 * being extreme.
 *
 * §10 records the same pair as known outstanding work — item 5, *"`--primary-
 * foreground` on `--primary`: 4.39:1 in both themes"* — and it is the same
 * pair, because `--chart-1` and `--primary` are both `var(--color-action)` and
 * measure identical. Inventing a sixth chart token or moving a ramp value are
 * both out of bounds, and a fifth entry under §10 was not on offer either:
 * this is new content, not an inherited failure.
 *
 * **So the label stops sitting on the arc.** It renders on a chip of the
 * panel's own surface — `bg-card` + `text-card-foreground`, the pair every
 * `Card` and `Panel` in the system already pairs — which is the same route
 * `bar.tsx`'s label variants take by putting their labels outside the bar. The
 * five labels no longer depend on which chart token their arc happens to carry,
 * so there is one measured ratio for the family instead of ten, and it is the
 * system's own surface pair: measured after the change, all five slots read
 * **16.97:1** in dark and **19.90:1** in light.
 *
 * Three consequences worth stating, because none is obvious:
 *
 * 1. **The chip is invisible on a `Panel`.** `Panel` (`components/ds/kit.tsx`)
 *    is `bg-card`, so what you see is the label written on the panel with the
 *    arc interrupted behind it, not a badge floating over the chart. On a
 *    surface that is not `--card` it degrades to a visible card-coloured chip —
 *    still legible, since the pair travels with it.
 * 2. **The labels move back to the registry's `insideStart`.** The per-slot ink
 *    table placed them at each arc's mid-angle, and mid-angle is wherever the
 *    data puts it: `safari`, `firefox` and `edge` came out 19.9px and 22.6px
 *    apart (measured centres) for labels 48 and 54px wide, so they overlapped
 *    each other. At the start angle they stack in one column at the ring pitch
 *    — measured 16.0px apart for chips 16.0px tall, adjacent and never
 *    overlapping — which is both the registry's own position and the only
 *    placement where five labels cannot collide whatever the values are.
 * 3. **`foreignObject` rather than `<text>`**, because a chip has to be as wide
 *    as its word and SVG cannot size a `<rect>` to text without measuring it in
 *    an effect. The HTML span inside sizes itself, and `RADIAL_LABEL_BOX` is
 *    only the clip frame around it — plot-coordinate geometry, in the same
 *    class as `margin` and `outerRadius`, deliberately generous.
 *
 * This does not reproduce the registry's curved text-on-a-path
 * (`renderRadialLabel`, a private helper not exported from the package).
 */
const RADIAL_LABEL_BOX = { width: 96, height: 16 };

/**
 * Recharts does not re-export its polar view-box type from the package root
 * (`PolarViewBox` lives in `util/types.ts` unexported; only the cartesian one
 * makes it into `index.d.ts`), so this names the same shape locally rather
 * than reaching into an internal path.
 *
 * `LabelList`'s real `content` signature types `viewBox` as `ViewBox`, a
 * union that ALSO includes the cartesian box (`{x,y,width,height}`, no `cx`)
 * — a plain object type sharing zero property names with that variant trips
 * TypeScript's weak-type check (excess/mismatch on every field). Typing the
 * field `unknown` here and narrowing it ourselves sidesteps that; the runtime
 * guard below is doing the real work either way.
 */
type PolarLabelViewBox = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
};

function RadialArcLabel({ viewBox, value }: { viewBox?: unknown; value?: unknown }) {
  const box = viewBox as PolarLabelViewBox | undefined;
  if (!box || box.cx == null || box.cy == null) return null;
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle = 0 } = box;
  // Same convention recharts' own `polarToCartesian` uses
  // (`recharts/es6/util/PolarUtils.js`): degrees, negated, because SVG's y
  // grows downward while chart angles grow counter-clockwise. The START angle,
  // not the mid-angle — see the block above for why.
  const radius = (innerRadius + outerRadius) / 2;
  const rad = (-startAngle * Math.PI) / 180;
  const x = cx + radius * Math.cos(rad);
  const y = cy + radius * Math.sin(rad);
  return (
    <foreignObject
      x={x - RADIAL_LABEL_BOX.width / 2}
      y={y - RADIAL_LABEL_BOX.height / 2}
      width={RADIAL_LABEL_BOX.width}
      height={RADIAL_LABEL_BOX.height}
    >
      <div className="flex size-full items-center justify-center">
        <span className="rounded-pill bg-card px-2 text-xs text-card-foreground capitalize">
          {String(value)}
        </span>
      </div>
    </foreignObject>
  );
}

export function RadialLabel() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={BROWSER_CONFIG} className={PLOT}>
      <RadialBarChart data={BROWSERS} startAngle={-90} endAngle={380} innerRadius={30} outerRadius={110}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
          {...motion}
        />
        <RadialBar dataKey="visitors" background {...motion}>
          <LabelList dataKey="browser" content={RadialArcLabel} />
        </RadialBar>
      </RadialBarChart>
    </ChartContainer>
  );
}

/* ── text · shape ─────────────────────────────────────────────────────────── */

/**
 * `data.ts` deliberately keeps this shape local — a single browser row, used
 * by nothing else. Values and colour match the registry's `chart-radial-text`
 * exactly (`safari`, 200, `--chart-2`).
 */
const RADIAL_TEXT_DATA = [{ browser: "safari", visitors: 200, fill: "var(--color-chart-2)" }];

const RADIAL_TEXT_CONFIG = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

export function RadialText() {
  const motion = useChartMotion();
  const cornerRadius = useRingCornerRadius();
  return (
    <ChartContainer config={RADIAL_TEXT_CONFIG} className={PLOT}>
      <RadialBarChart
        data={RADIAL_TEXT_DATA}
        startAngle={0}
        endAngle={250}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="visitors" background cornerRadius={cornerRadius} {...motion} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground type-number-xl">
                      {RADIAL_TEXT_DATA[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

/**
 * `data.ts` keeps this local too, and its own value (1260) differs from
 * `chart-radial-text`'s (200) — that is the registry's own choice, not a typo;
 * a value near the top of `outerRadius`'s sweep reads better against this
 * variant's wider ring.
 *
 * The brief's "watch for" note describes this variant as using a custom
 * `activeShape`. The shadcn
 * source for this variant (`chart-radial-shape`) has no
 * `activeShape`, no `Sector` override and no second colour anywhere — it is
 * structurally identical to `chart-radial-text`, just a different sweep and a
 * different centred number. Vendored from the real file rather than from the
 * brief's description of it, per the brief's own overriding rule; flagged in
 * the report rather than silently reconciled.
 */
const RADIAL_SHAPE_DATA = [{ browser: "safari", visitors: 1260, fill: "var(--color-chart-2)" }];

const RADIAL_SHAPE_CONFIG = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

export function RadialShape() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={RADIAL_SHAPE_CONFIG} className={PLOT}>
      <RadialBarChart data={RADIAL_SHAPE_DATA} endAngle={100} innerRadius={80} outerRadius={140}>
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="visitors" background {...motion} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground type-number-xl">
                      {RADIAL_SHAPE_DATA[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

/* ── stacked ──────────────────────────────────────────────────────────────── */

/**
 * Local per `data.ts` — a single `{ month, desktop, mobile }` row. The
 * registry names the row `"january"`; kept, it plays no visual role here
 * (there is no category axis rendering it).
 */
const RADIAL_STACKED_DATA = [{ month: "january", desktop: 1260, mobile: 570 }];

/**
 * The vendored registry source has no `PolarAngleAxis` at all — and rendering
 * it that way silently drops the second ring. Measured on this exact chart in
 * the scratch route: `recharts-radial-bar-sectors` for `mobile` mounts with
 * zero children — no `<path>`, nothing — while `desktop`'s sector paints
 * fine. The un-widened angle-axis domain runs to the largest SINGLE series
 * (`desktop`, 1260) rather than to the stack total (1830), so `mobile`'s
 * portion of the stack (1260–1830) falls outside the domain entirely.
 *
 * This is the same failure `chart-demos.tsx`'s pre-existing `RadialStacked`
 * already found and fixed for a 3-series dataset (`VAULT`) — its own comment
 * names it exactly: "A stacked RadialBarChart does not widen its own angle
 * axis." Confirmed here that a 2-series stack hits the identical bug, so the
 * same fix applies: an explicit `PolarAngleAxis` with `domain={[0, total]}`,
 * derived from the data rather than typed, so it cannot fall out of step with
 * it. Re-measured after adding it — both sectors now render (see the report).
 */
export function RadialStacked() {
  const motion = useChartMotion();
  const cornerRadius = useStackCornerRadius();
  const totalVisitors = RADIAL_STACKED_DATA[0].desktop + RADIAL_STACKED_DATA[0].mobile;

  return (
    <ChartContainer config={DESKTOP_MOBILE_CONFIG} className={PLOT}>
      <RadialBarChart data={RADIAL_STACKED_DATA} endAngle={180} innerRadius={80} outerRadius={130}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <PolarAngleAxis type="number" domain={[0, totalVisitors]} tick={false} axisLine={false} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 16}
                      className="fill-foreground type-number-lg"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 4} className="fill-muted-foreground">
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="desktop"
          stackId="a"
          cornerRadius={cornerRadius}
          fill="var(--color-chart-1)"
          className="stroke-transparent stroke-2"
          {...motion}
        />
        <RadialBar
          dataKey="mobile"
          stackId="a"
          cornerRadius={cornerRadius}
          fill="var(--color-chart-2)"
          className="stroke-transparent stroke-2"
          {...motion}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
