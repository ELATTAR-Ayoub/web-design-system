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

const RING_RADIUS_TOKEN = "--radius-md";
const STACK_RADIUS_TOKEN = "--radius-sm";

// Server-render fallbacks only; in the browser the token is read.
const SSR_RING_RADIUS = 10;
const SSR_STACK_RADIUS = 6;

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

function useRingCornerRadius(): number {
  return useSyncExternalStore(subscribeRadius, getRingRadius, getRingRadiusOnServer);
}

function useStackCornerRadius(): number {
  return useSyncExternalStore(subscribeRadius, getStackRadius, getStackRadiusOnServer);
}

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

const RADIAL_LABEL_BOX = { width: 96, height: 16 };

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
  // Negated: SVG y grows downward while chart angles run counter-clockwise.
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

const RADIAL_STACKED_DATA = [{ month: "january", desktop: 1260, mobile: 570 }];

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
