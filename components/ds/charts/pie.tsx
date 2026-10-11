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

const PIE_LABEL_BOX = { width: 96, height: 16 };

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
  // Negated: SVG y grows downward while chart angles run counter-clockwise.
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
        <span className="rounded-pill bg-card px-2 type-small text-card-foreground">
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

type PieInteractiveMonth = "january" | "february" | "march" | "april" | "may";

const PIE_INTERACTIVE_MONTHS: PieInteractiveMonth[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
];

const PIE_INTERACTIVE_SWATCH: Record<PieInteractiveMonth, string> = {
  january: "var(--color-chart-1)",
  february: "var(--color-chart-2)",
  march: "var(--color-chart-3)",
  april: "var(--color-chart-4)",
  may: "var(--color-chart-5)",
};

const PieInteractiveContext = createContext<PieInteractiveMonth>("january");

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
