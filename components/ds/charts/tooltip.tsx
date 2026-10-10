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

/**
 * The nine `chart-tooltip-*` registry blocks, vendored onto this system's
 * tokens. Every one of them is the *same* two-series stacked bar chart —
 * `SPORT_DAYS` (`data.ts`) over six days of running/swimming — because the
 * family's whole point is that only the `ChartTooltip`/`ChartTooltipContent`
 * configuration changes. No `CartesianGrid`, no `YAxis`: the registry source
 * for all nine omits both, and there is nothing to vendor that isn't there.
 *
 * Same three sweeps as `bar.tsx` and `area.tsx` (see their headers), not
 * repeated per function: `hsl(var(--chart-N))` → `var(--color-chart-N)`;
 * `var(--color-running)` / `var(--color-swimming)` → the direct
 * `--color-chart-1` / `--color-chart-2` names `SPORT_CONFIG` already carries;
 * every animated element — `ChartTooltip` above all, since it is this
 * family's whole subject — takes `{...useChartMotion()}`.
 *
 * No `<defs>` and no DOM `id` anywhere in any of the nine registry blocks, so
 * rule 7's id-namespacing does not apply to this family — there is nothing to
 * collide.
 *
 * ### The corner radius is a local duplicate of `bar.tsx`'s hook, not an import
 *
 * `useBarRadius()` reads `--radius-sm` off the live stylesheet rather than
 * typing `radius={4}` — see `bar.tsx`'s own comment for why a corner radius is
 * a token-family value and a literal one is not a defensible exception, the
 * same way `chart-motion.ts` reads `--duration-slow` instead of typing `800`.
 * All nine tooltip variants stack the identical two bars, so all nine need it.
 *
 * It is copied here rather than imported because `bar.tsx` does not export it
 * (it is a private module function) and, at the time this file was written,
 * two other agents were live on `bar.tsx` and `data.ts` in this same worktree
 * — editing either to add an export was explicitly off-limits. Same token
 * (`--radius-sm`), same SSR fallback (6), same `useSyncExternalStore`
 * no-op-subscription reasoning; nothing here diverges from the original.
 */

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

/** `useSyncExternalStore`, not a bare render-body read — the DOM is outside
 *  React and this repo lints under the React Compiler rules; see `bar.tsx`. */
function useBarRadius(): number {
  return useSyncExternalStore(subscribeTooltipRadius, getTooltipBarRadius, getTooltipBarRadiusOnServer);
}

/**
 * Two shared corner-radius tuples, so `stackId="a"`'s cut corners are typed
 * once rather than assembled inline nine times. `running` sits at the bottom
 * of the stack (bottom corners cut), `swimming` on top (top corners cut) —
 * the pattern `bar.tsx`'s `BarStacked` already establishes; only the zeros'
 * position is geometry, the radius itself is the token above.
 */
function useStackRadii(): { bottom: [number, number, number, number]; top: [number, number, number, number] } {
  const r = useBarRadius();
  return { bottom: [0, 0, r, r], top: [r, r, 0, 0] };
}

/* ── The two icons the `icons` variant needs, routed through `Icon` ────────
 *
 * `ChartConfig["icon"]` is typed `React.ComponentType` and rendered zero-prop
 * — `ui/chart.tsx` calls `<itemConfig.icon />` directly. `area.tsx` met this
 * same wall on `chart-area-step`/`chart-area-icons` and concluded a bare
 * Lucide component had to go in that slot because "`Icon`'s props-based
 * wrapper [can]not be dropped into that slot" — true of `Icon` ITSELF, but not
 * of a zero-arg component that calls `Icon` internally. Wrapping it this way
 * keeps every icon on the system's one entry point (a size off the ladder, a
 * tone off the token palette) while still satisfying the zero-prop contract
 * `ui/chart.tsx` demands. `size="xs"` is nominal only: the tooltip row's own
 * `[&>svg]:h-2.5 [&>svg]:w-2.5` (ui/chart.tsx) overrides it visually to 10px
 * regardless of what is requested, exactly as it already overrides a bare
 * Lucide default of 24px — no regression either way, but the size and tone
 * are now real, checked values rather than an ambient CSS coincidence.
 */
function TooltipRunningIcon() {
  return <Icon icon={Footprints} size="xs" tone="muted" />;
}

function TooltipSwimmingIcon() {
  return <Icon icon={Waves} size="xs" tone="muted" />;
}

/** Shared X axis: every one of the nine formats `SPORT_DAYS`' ISO date as a
 *  short weekday name, byte-for-byte the registry's own `tickFormatter`. */
function tooltipDateTick(value: string) {
  return new Date(value).toLocaleDateString("en-US", { weekday: "short" });
}

/* ── default · indicator-line · indicator-none ───────────────────────────── */

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

/* ── label-custom · label-formatter · label-none ─────────────────────────── */

/**
 * The registry's one extra config key: a label that never comes from the
 * hovered row at all, so the tooltip header always reads "Activities" rather
 * than the day. `labelKey="activities"` below is what routes
 * `ChartTooltipContent` at it — see `ui/chart.tsx`'s `getPayloadConfigFromPayload`,
 * which falls back to `config[key]` when the key names no field on the datum.
 */
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

/* ── formatter · icons ────────────────────────────────────────────────────── */

/**
 * `min-w-[130px]` in the registry becomes `min-w-32` (128px) — the exact
 * class `ChartTooltipContent`'s own default box already opens with
 * (`min-w-32 items-start gap-1.5 …`, `ui/chart.tsx`). Supplying `formatter`
 * opts a row out of that default renderer entirely (`ui/chart.tsx`: `formatter
 * ? formatter(...) : <>…</>`), so this row is rebuilding by hand what the
 * default already does; matching its own width token rather than a bracket
 * two pixels off it is the more honest sweep, not just the more legal one.
 */
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
                <div className="flex min-w-32 items-center text-xs text-muted-foreground">
                  {SPORT_CONFIG[name as keyof typeof SPORT_CONFIG]?.label ?? name}
                  <div className="type-number-sm ml-auto flex items-baseline gap-0.5 text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">kcal</span>
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

/** Faithful to the registry's own pairing (`Footprints`/running,
 *  `Waves`/swimming) — see the header comment for how each reaches `Icon`. */
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

/* ── advanced ─────────────────────────────────────────────────────────────── */

type SportSeries = keyof typeof SPORT_CONFIG;

/**
 * The registry's swatch reads
 * `style={{ "--color-bg": \`var(--color-${name})\` }}` — at runtime exactly
 * `var(--color-running)` / `var(--color-swimming)`, the `--color-<seriesKey>`
 * pattern rule 1 forbids (and, written literally, `check:refs`' `var(--…)`
 * scan captures the token up to the `${`, finds `--color-` declared nowhere,
 * and fails the build outright — this is not merely a style preference).
 * A lookup table, exactly `bar.tsx`'s `BAR_INTERACTIVE_FILL`, resolves the
 * series to its `--color-chart-N` token without ever assembling that string.
 */
const SPORT_ADVANCED_FILL: Record<SportSeries, string> = {
  running: "var(--color-chart-1)",
  swimming: "var(--color-chart-2)",
};

/**
 * The most involved of the nine. Supplying `formatter` bypasses
 * `ChartTooltipContent`'s built-in indicator/label/value row entirely, so this
 * one rebuilds it by hand: a colour swatch, the series label, the value with
 * its `kcal` unit, and — after the second (last) row — a totalled "Total"
 * line. Two sweeps beyond the shared ones:
 *
 * 1. **The swatch** — see `SPORT_ADVANCED_FILL` above.
 * 2. **`rounded-[2px]` → `rounded-xs`** — 2px is rung one of the radius
 *    ladder (`xs` 2 · `sm` 6 · …), so the bracket form was never actually
 *    inventing a size, just spelling an existing one arbitrarily.
 * 3. **`className="w-[180px]"` → `w-44`** (176px) — the nearest rung of the
 *    same spacing scale `min-w-32` above already uses, close enough that the
 *    fixed-width Total row this variant is built to demonstrate does not
 *    reflow between the two hovered series.
 *
 * kcal is calories, not currency — RULES §1.4 ("money out is never red") does
 * not literally apply, since nothing here is money. `tabular-nums` on both
 * numeric spans is kept anyway: it is the registry's own choice, it is what
 * every other numeric figure on this page already does, and an aligned
 * numeral column is the right call whether or not the units are currency.
 */
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
                    <span className="font-normal text-muted-foreground">kcal</span>
                  </div>
                  {index === 1 && (
                    <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                      Total
                      <div className="type-number-sm ml-auto flex items-baseline gap-0.5 text-foreground">
                        {item.payload.running + item.payload.swimming}
                        <span className="font-normal text-muted-foreground">kcal</span>
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
