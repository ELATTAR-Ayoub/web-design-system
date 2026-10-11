"use client";

import { useSyncExternalStore } from "react";
import { Footprints, Waves } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";

import { useChartMotion } from "@/components/ds/chart-motion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Icon } from "@/components/ui/icon";

import { PLOT, SPORT_CONFIG, SPORT_DAYS } from "./data";

const TOOLTIP_BAR_RADIUS_TOKEN = "--radius-sm";
const SSR_TOOLTIP_BAR_RADIUS = 6;

function readTooltipRadiusPx(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw.endsWith("px")) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

const subscribeTooltipRadius = () => () => {};
const getTooltipBarRadius = () => readTooltipRadiusPx(TOOLTIP_BAR_RADIUS_TOKEN, SSR_TOOLTIP_BAR_RADIUS);
const getTooltipBarRadiusOnServer = () => SSR_TOOLTIP_BAR_RADIUS;

function useBarRadius(): number {
  return useSyncExternalStore(subscribeTooltipRadius, getTooltipBarRadius, getTooltipBarRadiusOnServer);
}

function useStackRadii(): { bottom: [number, number, number, number]; top: [number, number, number, number] } {
  const r = useBarRadius();
  return { bottom: [0, 0, r, r], top: [r, r, 0, 0] };
}

function TooltipRunningIcon() {
  return <Icon icon={Footprints} size="xs" tone="muted" />;
}

function TooltipSwimmingIcon() {
  return <Icon icon={Waves} size="xs" tone="muted" />;
}

function tooltipDateTick(value: string) {
  return new Date(value).toLocaleDateString("en-US", { weekday: "short" });
}

export function TooltipDefault() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} defaultIndex={1} {...motion} />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipIndicatorLine() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" />}
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipIndicatorNone() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={<ChartTooltipContent hideIndicator />}
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

const SPORT_ACTIVITIES_CONFIG = {
  activities: { label: "Activities" },
  ...SPORT_CONFIG,
} satisfies ChartConfig;

export function TooltipLabelCustom() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_ACTIVITIES_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={<ChartTooltipContent labelKey="activities" indicator="line" />}
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipLabelFormatter() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value as string).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }
            />
          }
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipLabelNone() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={<ChartTooltipContent hideIndicator hideLabel />}
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

export function TooltipFormatter() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) => (
                <div className="flex min-w-32 items-center type-small text-muted-foreground">
                  {SPORT_CONFIG[name as keyof typeof SPORT_CONFIG]?.label ?? name}
                  <div className="type-number-sm ml-auto flex items-baseline gap-0.5 text-foreground">
                    {value}
                    <span className="type-small text-muted-foreground">kcal</span>
                  </div>
                </div>
              )}
            />
          }
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

const SPORT_ICONS_CONFIG = {
  running: { ...SPORT_CONFIG.running, icon: TooltipRunningIcon },
  swimming: { ...SPORT_CONFIG.swimming, icon: TooltipSwimmingIcon },
} satisfies ChartConfig;

export function TooltipIcons() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_ICONS_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} defaultIndex={1} {...motion} />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

type SportSeries = keyof typeof SPORT_CONFIG;

const SPORT_ADVANCED_FILL: Record<SportSeries, string> = {
  running: "var(--color-chart-1)",
  swimming: "var(--color-chart-2)",
};

export function TooltipAdvanced() {
  const motion = useChartMotion();
  const radius = useStackRadii();
  return (
    <ChartContainer config={SPORT_CONFIG} className={PLOT}>
      <BarChart accessibilityLayer data={SPORT_DAYS}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tooltipDateTick} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className="w-44"
              formatter={(value, name, item, index) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: SPORT_ADVANCED_FILL[name as SportSeries] }}
                  />
                  {SPORT_CONFIG[name as keyof typeof SPORT_CONFIG]?.label ?? name}
                  <div className="type-number-sm ml-auto flex items-baseline gap-0.5 text-foreground">
                    {value}
                    <span className="type-small text-muted-foreground">kcal</span>
                  </div>
                  {index === 1 && (
                    <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 type-nav text-foreground">
                      Total
                      <div className="type-number-sm ml-auto flex items-baseline gap-0.5 text-foreground">
                        {item.payload.running + item.payload.swimming}
                        <span className="type-small text-muted-foreground">kcal</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            />
          }
          cursor={false}
          defaultIndex={1}
          {...motion}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={radius.bottom} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={radius.top} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}
