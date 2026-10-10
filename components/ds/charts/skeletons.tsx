import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { PLOT } from "./data";

export type ChartSkeletonKind =
  | "area"
  | "bar"
  | "line"
  | "pie"
  | "radar"
  | "radial"
  | "tooltip";

const SERIES = [64, 38, 50, 22, 44, 16];

function atX(i: number, n: number): number {
  return (100 * i) / (n - 1);
}

const pct = (n: number) => `${n.toFixed(2)}%`;

function band(ys: number[]): string {
  const top = ys.map((y, i) => `${pct(atX(i, ys.length))} ${pct(y)}`);
  return `polygon(${[...top, "100% 100%", "0% 100%"].join(", ")})`;
}

function stroke(ys: number[], half: number): string {
  const n = ys.length;
  const top = ys.map((y, i) => `${pct(atX(i, n))} ${pct(y - half)}`);
  const bottom = ys
    .map((y, i) => `${pct(atX(i, n))} ${pct(y + half)}`)
    .reverse();
  return `polygon(${[...top, ...bottom].join(", ")})`;
}

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

const TOP = -90;

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

function Polar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center py-2">
      <div className="relative aspect-square h-full">{children}</div>
    </div>
  );
}

function Shape({ clip, className }: { clip: string; className?: string }) {
  return (
    <Skeleton
      className={cn("absolute inset-0 rounded-none", className)}
      style={{ clipPath: clip }}
    />
  );
}

function AreaShape() {
  return (
    <Cartesian>
      <Shape clip={band(SERIES)} />
    </Cartesian>
  );
}

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

function PieShape() {
  return (
    <Polar>
      <Shape clip={annulus(TOP, 360, 48, 46, 27)} />
    </Polar>
  );
}

function RadarShape() {
  return (
    <Polar>
      <Shape clip={annulus(TOP, 360, 6, 46, 44)} className="opacity-50" />
      <Shape clip={annulus(TOP, 360, 6, 34, 30)} />
    </Polar>
  );
}

function RadialShape() {
  return (
    <Polar>
      <Shape clip={annulus(TOP, 250, 32, 46, 37)} />
      <Shape clip={annulus(TOP, 190, 32, 34, 25)} />
      <Shape clip={annulus(TOP, 120, 32, 22, 13)} />
    </Polar>
  );
}

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
