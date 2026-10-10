import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { PLOT } from "./data";

/**
 * One skeleton per chart family, each shaped like the family it stands in for.
 *
 * ### The footprint is the requirement, not the drawing
 *
 * §5: a skeleton must match what replaces it — same height, same padding, same
 * radius — because a layout jump is worse than the spinner it was meant to
 * avoid. Every skeleton here renders at `PLOT`, the same class every
 * `ChartContainer` on the charts page takes, so the box cannot move when the
 * state changes. Nothing below sets a height; they all inherit that one.
 *
 * The *shape* is the second requirement and it is a smaller one. A grey
 * rectangle would satisfy the footprint and tell the reader nothing about what
 * is arriving, which is the difference §5 draws between a skeleton and a
 * spinner: reach for a skeleton only when you know the shape of what is coming,
 * and then draw that shape.
 *
 * ### Everything shimmers, which is why there is no `<svg>` here
 *
 * `anim-shimmer` is a `background` gradient. A background does not paint inside
 * an SVG `<path>`, so a skeleton drawn as SVG geometry would be a still
 * silhouette with the shimmer running behind it — the one thing on the page
 * that looks loaded while it is loading. Every shape below is therefore a
 * `Skeleton` div with a `clip-path`, which keeps the shimmer *inside* the
 * curve. Rings, arcs and polylines are all reachable that way; the helper is
 * `annulus` for the polar three and `band` for the cartesian two.
 *
 * ### Why the geometry is computed rather than typed
 *
 * Every coordinate here is a **percentage of the element's own box**, so it is
 * derived from the container in the same sense the chart page's polar radii
 * are, and it scales with `PLOT` rather than restating it. There is not a pixel
 * literal in the file. The vertex lists are generated from one shared series so
 * the area, line, bar and tooltip skeletons all describe the same imaginary
 * dataset — six months rising to a peak — instead of drifting into four
 * different fake shapes.
 */

export type ChartSkeletonKind =
  | "area"
  | "bar"
  | "line"
  | "pie"
  | "radar"
  | "radial"
  | "tooltip";

/* ── Geometry ─────────────────────────────────────────────────────────────── */

/**
 * The one imaginary series, as **percent down from the top of the plot**.
 *
 * CSS y-coordinates grow downward and chart values grow upward, so a small
 * number here is a tall bar. Six points, because every recurring dataset in
 * `data.ts` has six.
 */
const SERIES = [64, 38, 50, 22, 44, 16];

/** Evenly spaced x for the i-th of n points, as a percentage of the plot width. */
function atX(i: number, n: number): number {
  return (100 * i) / (n - 1);
}

const pct = (n: number) => `${n.toFixed(2)}%`;

/**
 * A filled area: along the series, then down the right edge and back along the
 * baseline. `clip-path`'s implicit closing edge draws the left edge.
 */
function band(ys: number[]): string {
  const top = ys.map((y, i) => `${pct(atX(i, ys.length))} ${pct(y)}`);
  return `polygon(${[...top, "100% 100%", "0% 100%"].join(", ")})`;
}

/**
 * A stroke of constant thickness along the series: out along the top edge of
 * the line, back along the bottom.
 */
function stroke(ys: number[], half: number): string {
  const n = ys.length;
  const top = ys.map((y, i) => `${pct(atX(i, n))} ${pct(y - half)}`);
  const bottom = ys
    .map((y, i) => `${pct(atX(i, n))} ${pct(y + half)}`)
    .reverse();
  return `polygon(${[...top, ...bottom].join(", ")})`;
}

/**
 * A ring, or a slice of one, as a single closed polygon.
 *
 * `clip-path: polygon()` has no arc primitive and its optional `evenodd`
 * fill-rule is not something to bet a skeleton on, so the hole is cut the way
 * SVG cuts one without a second subpath: walk the outer edge forward, walk the
 * inner edge back, and let the two coincident radial segments cancel. At a full
 * 360° sweep the first and last outer points land on top of each other, which
 * closes the outer loop and puts the cut at `start` where nothing can see it.
 *
 * `steps` is the smoothness: 6 draws the radar's hexagon, 48 draws a circle.
 * `outer` and `inner` are radii as a percentage of the box's half-width, so
 * they only make sense on a square element — every caller passes
 * `aspect-square`.
 */
function annulus(
  start: number,
  sweep: number,
  steps: number,
  outer: number,
  inner: number,
): string {
  const at = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${pct(50 + r * Math.cos(rad))} ${pct(50 + r * Math.sin(rad))}`;
  };
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) points.push(at(start + (sweep * i) / steps, outer));
  for (let i = steps; i >= 0; i--) points.push(at(start + (sweep * i) / steps, inner));
  return `polygon(${points.join(", ")})`;
}

/** Polar charts start at twelve o'clock, so every sweep does too. */
const TOP = -90;

/* ── Frames ───────────────────────────────────────────────────────────────── */

/**
 * The cartesian frame: plot area, axis rule, tick labels.
 *
 * The rule and the ticks are what make the box read as a chart rather than as a
 * card, and they are the parts a bar, an area and a line all share.
 */
function Cartesian({
  ticks = SERIES.length,
  children,
}: {
  ticks?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2 py-2">
      <div className="relative min-h-0 flex-1">{children}</div>
      <div className="h-px w-full bg-border" />
      <div className="flex justify-between gap-4">
        {Array.from({ length: ticks }, (_, i) => (
          <Skeleton key={i} className="h-2 w-full max-w-8" />
        ))}
      </div>
    </div>
  );
}

/** The polar frame: one centred square, as tall as the plot allows. */
function Polar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center py-2">
      <div className="relative aspect-square h-full">{children}</div>
    </div>
  );
}

/** A clipped shimmer that fills whatever frame it is dropped into. */
function Shape({ clip, className }: { clip: string; className?: string }) {
  return (
    <Skeleton
      className={cn("absolute inset-0 rounded-none", className)}
      style={{ clipPath: clip }}
    />
  );
}

/* ── The seven ────────────────────────────────────────────────────────────── */

/** A sloped band across the plot, with an axis rule. */
function AreaShape() {
  return (
    <Cartesian>
      <Shape clip={band(SERIES)} />
    </Cartesian>
  );
}

/**
 * Five bars of varied height on a baseline.
 *
 * The heights come off `SERIES` like every other shape here — `100 - y`,
 * because the series is measured downward and a bar grows upward.
 */
function BarShape() {
  const bars = SERIES.slice(0, 5);
  return (
    <Cartesian ticks={bars.length}>
      <div className="flex h-full w-full items-end justify-between gap-4">
        {bars.map((y, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-sm"
            style={{ height: pct(100 - y) }}
          />
        ))}
      </div>
    </Cartesian>
  );
}

/** A polyline with dot nodes. */
function LineShape() {
  return (
    <Cartesian>
      <Shape clip={stroke(SERIES, 2)} />
      {SERIES.map((y, i) => (
        <Skeleton
          key={i}
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-pill"
          style={{ left: pct(atX(i, SERIES.length)), top: pct(y) }}
        />
      ))}
    </Cartesian>
  );
}

/** A centred ring. */
function PieShape() {
  return (
    <Polar>
      <Shape clip={annulus(TOP, 360, 48, 46, 27)} />
    </Polar>
  );
}

/**
 * A centred polygon outline, plus the fainter grid ring behind it.
 *
 * Six sides, because every radar dataset in `data.ts` has six months.
 */
function RadarShape() {
  return (
    <Polar>
      <Shape clip={annulus(TOP, 360, 6, 46, 44)} className="opacity-50" />
      <Shape clip={annulus(TOP, 360, 6, 34, 30)} />
    </Polar>
  );
}

/** Concentric arcs, each a shorter sweep than the one outside it. */
function RadialShape() {
  return (
    <Polar>
      <Shape clip={annulus(TOP, 250, 32, 46, 37)} />
      <Shape clip={annulus(TOP, 190, 32, 34, 25)} />
      <Shape clip={annulus(TOP, 120, 32, 22, 13)} />
    </Polar>
  );
}

/**
 * A bar plot plus a floating tooltip block.
 *
 * The block mirrors `ChartTooltipContent`'s own frame — `min-w-32`, a `lg`
 * radius, a half-strength border on `bg-background` — so what arrives lands in
 * the same outline the placeholder drew. Its position is a percentage of the
 * plot rather than an offset, so it tracks the box at any width.
 */
function TooltipShape() {
  return (
    <div className="relative h-full w-full">
      <BarShape />
      <div
        className="absolute w-32 -translate-x-1/2 rounded-lg border border-border/50 bg-background p-2.5 shadow-e2"
        style={{ left: pct(50), top: pct(14) }}
      >
        <Skeleton className="h-2 w-3/5" />
        {[0, 1].map((i) => (
          <div key={i} className="mt-2 flex items-center gap-1.5">
            <Skeleton className="size-2 shrink-0 rounded-xs" />
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-2 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

const SHAPES: Record<ChartSkeletonKind, () => React.JSX.Element> = {
  area: AreaShape,
  bar: BarShape,
  line: LineShape,
  pie: PieShape,
  radar: RadarShape,
  radial: RadialShape,
  tooltip: TooltipShape,
};

/**
 * The loading placeholder for one chart.
 *
 * ```tsx
 * <ChartSkeleton kind="radar" />
 * ```
 *
 * `ChartStates` renders this for you; call it directly only if you are building
 * a surface that is not a chart specimen. It carries `role="status"` and its
 * own label, so the swap is announced once rather than read out as an empty
 * region.
 */
export function ChartSkeleton({
  kind,
  className,
}: {
  kind: ChartSkeletonKind;
  className?: string;
}) {
  const Shapes = SHAPES[kind];
  return (
    <div role="status" aria-label="Loading chart" className={cn(PLOT, className)}>
      <Shapes />
    </div>
  );
}
