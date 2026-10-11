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

function RadarLabelCustomTick({ x, y, textAnchor, index }: BaseTickContentProps) {
  const row = MONTHS_DESKTOP_MOBILE[index];
  if (!row) return null;
  return (
    <text
      x={x}
      y={index === 0 ? Number(y) - 10 : y}
      textAnchor={textAnchor}
      className="fill-foreground type-small"
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

const RADAR_ICONS_CONFIG = {
  desktop: { ...DESKTOP_MOBILE_CONFIG.desktop, icon: ArrowDownFromLine },
  mobile: { ...DESKTOP_MOBILE_CONFIG.mobile, icon: ArrowUpFromLine },
} satisfies ChartConfig;

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
