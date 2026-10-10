import type { ChartConfig } from "@/components/ui/chart";

/**
 * Shared chart fixtures — shadcn's own `chartData` sets, deduped.
 *
 * shadcn's 70 registry chart blocks restate a
 * handful of datasets over and over. Counted rather than remembered, the
 * distribution is:
 *
 * | export | variants | shape |
 * |---|---|---|
 * | `MONTHS_DESKTOP_MOBILE` | 17 | `{ month, desktop, mobile }` |
 * | `BROWSERS`              | 14 | `{ browser, visitors, fill }` |
 * | `MONTHS_DESKTOP`        |  9 | `{ month, desktop }` |
 * | `SPORT_DAYS`            |  9 | `{ date, running, swimming }` |
 * | `RADAR_MONTHS`          |  5 | `{ month, desktop }`, April 273 |
 * | `DAILY_VISITS`          |  3 | `{ date, desktop, mobile }` × 91 |
 * | `RADAR_MONTHS_FILL`     |  2 | `{ month, desktop }`, Feb 285 |
 * | `PIE_MONTHS_*`          |  2 | `{ month, desktop \| mobile, fill }` |
 *
 * **The numbers are shadcn's, unchanged.** Each variant was tuned against these
 * exact values — `MONTHS_DESKTOP`'s April dip to 73 is what makes the step and
 * linear curves readable, and the radar sets differ from it by one or two
 * months precisely because a radar polygon with a 73 in it collapses. Do not
 * "tidy" them.
 *
 * ### Eight datasets are deliberately NOT here
 *
 * A shape used by exactly one variant cannot be restated by seven family files,
 * so exporting it would only put distance between a chart and its data. These
 * stay local to the family file that owns them:
 *
 * `area-stacked-expand` (adds `other`) · `bar-active` (browsers, reordered) ·
 * `bar-negative` (`{ month, visitors }` with two negatives) · `pie-donut-text`
 * (browsers, +12 firefox / +100 other) · `radar-grid-circle-no-lines` ·
 * `radar-lines-only` (`{ month, desktop, mobile }`) · `radial-shape` and
 * `radial-text` (one browser row each) · `radial-stacked`
 * (`{ month, desktop, mobile }`, one row).
 *
 * Vendor those from the registry JSON when you build the variant. Do not invent
 * a shape no variant uses.
 */

/**
 * One footprint, shared by every chart specimen and by the skeleton that stands
 * in for it.
 *
 * §5 asks a skeleton to match what replaces it — same height, same padding,
 * same radius — and the only way to be sure of that across 70 charts written by
 * six different hands is for all of them to name the same constant. Every
 * `ChartContainer` on the charts page takes `className={PLOT}`, every skeleton
 * in `skeletons.tsx` renders at `PLOT`, and the empty state in `state.tsx` does
 * too. Change it here and all three move together.
 *
 * It lives in the data file rather than in a fourth module because every family
 * file already imports from here, and a layout constant nobody imports is a
 * layout constant that gets retyped.
 */
export const PLOT = "h-64 w-full";

/**
 * ### Why the `fill` values are rewritten, and the shape of the trap
 *
 * The registry writes `fill: "var(--color-chrome)"` and
 * `color: "hsl(var(--chart-1))"`. Both are wrong here, for different reasons.
 *
 * `hsl(var(--chart-1))` is shadcn's pre-v4 spelling: `--chart-1` used to hold
 * three bare HSL components. In this system it holds a whole colour
 * (`var(--color-action)`), so wrapping it in `hsl()` yields an invalid colour
 * and the series paints nothing. It becomes `var(--color-chart-1)`.
 *
 * `var(--color-chrome)` is subtler and it is the one that fails the gate.
 * shadcn's `ChartStyle` mints a `--color-<seriesKey>` per container inside a
 * `<style>` tag injected at runtime, so the property exists in the browser and
 * exists nowhere in this repository. `check:refs` reads every `var(--*)` in the
 * source and fails the build on any that reaches no declaration — correctly,
 * because that is the same signature as the dead tokens §9 was written about.
 * The five chart tokens are already declared once per theme in `globals.css`,
 * so the indirection buys nothing and costs the build. Name `--color-chart-1`
 * … `-5` directly, in data and in config alike.
 *
 * `components/ds/chart-demos.tsx` reached the same conclusion independently and
 * its 17 demos already do this.
 */

/* ── Datasets ─────────────────────────────────────────────────────────────── */

/** 9 variants: area default/linear/step · bar default/horizontal/label · line default/linear/step. */
export const MONTHS_DESKTOP = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

/**
 * 17 variants — the most reused set in the registry: area
 * axes/gradient/icons/legend/stacked · bar label-custom/multiple/stacked · line
 * dots/dots-custom/label/multiple · radar icons/label-custom/legend/multiple/radius.
 */
export const MONTHS_DESKTOP_MOBILE = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

/**
 * 5 radar variants: default · dots · grid-circle · grid-custom · grid-none.
 *
 * Identical to `MONTHS_DESKTOP` except April, which is 273 rather than 73. That
 * is not a typo in the registry: a radar polygon whose fourth vertex sits at
 * 27% of the radius reads as a fold rather than as a shape.
 */
export const RADAR_MONTHS = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

/** 2 radar variants: grid-fill · grid-circle-fill. Flatter still, because a filled polygon shows every dent. */
export const RADAR_MONTHS_FILL = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 285 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 203 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 264 },
];

/**
 * 14 variants: every pie but donut-text/stacked/interactive · radial
 * grid/label/simple · bar-mixed.
 *
 * `fill` is read straight off the row by `Pie`, `RadialBar` and `Cell`, so it
 * has to be a colour that resolves in this repository — see the note above.
 */
export const BROWSERS = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chart-1)" },
  { browser: "safari", visitors: 200, fill: "var(--color-chart-2)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-chart-3)" },
  { browser: "edge", visitors: 173, fill: "var(--color-chart-4)" },
  { browser: "other", visitors: 90, fill: "var(--color-chart-5)" },
];

/** All 9 tooltip variants. The one dataset with a real date axis and two comparable series. */
export const SPORT_DAYS = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];

/** 2 pie variants: stacked (both rings) · interactive (the desktop ring only). */
export const PIE_MONTHS_DESKTOP = [
  { month: "january", desktop: 186, fill: "var(--color-chart-1)" },
  { month: "february", desktop: 305, fill: "var(--color-chart-2)" },
  { month: "march", desktop: 237, fill: "var(--color-chart-3)" },
  { month: "april", desktop: 173, fill: "var(--color-chart-4)" },
  { month: "may", desktop: 209, fill: "var(--color-chart-5)" },
];

/** The inner ring of `pie-stacked`. */
export const PIE_MONTHS_MOBILE = [
  { month: "january", mobile: 80, fill: "var(--color-chart-1)" },
  { month: "february", mobile: 200, fill: "var(--color-chart-2)" },
  { month: "march", mobile: 120, fill: "var(--color-chart-3)" },
  { month: "april", mobile: 190, fill: "var(--color-chart-4)" },
  { month: "may", mobile: 130, fill: "var(--color-chart-5)" },
];

/**
 * 3 variants: area-interactive · bar-interactive · line-interactive.
 *
 * 91 days, 2024-04-01 to 2024-06-30. It is long on purpose — the three
 * interactive variants exist to demonstrate a range filter, and a filter over
 * six points demonstrates nothing.
 */
export const DAILY_VISITS = [
{ date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

/* ── Configs ──────────────────────────────────────────────────────────────── */

/**
 * The four `chartConfig` objects the registry reuses. A variant that needs one
 * more key spreads rather than restates:
 *
 * ```ts
 * const config = {
 *   ...DESKTOP_MOBILE_CONFIG,
 *   other: { label: "Other", color: "var(--color-chart-3)" },
 * } satisfies ChartConfig;
 * ```
 *
 * The same spread carries the `icon` the four icon variants add.
 */

/** 16 variants. */
export const DESKTOP_CONFIG = {
  desktop: { label: "Desktop", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

/** 16 variants. */
export const DESKTOP_MOBILE_CONFIG = {
  desktop: { label: "Desktop", color: "var(--color-chart-1)" },
  mobile: { label: "Mobile", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

/**
 * 14 variants. `visitors` carries the axis label and deliberately has no
 * colour — it is the value key, not a series.
 */
export const BROWSER_CONFIG = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--color-chart-1)" },
  safari: { label: "Safari", color: "var(--color-chart-2)" },
  firefox: { label: "Firefox", color: "var(--color-chart-3)" },
  edge: { label: "Edge", color: "var(--color-chart-4)" },
  other: { label: "Other", color: "var(--color-chart-5)" },
} satisfies ChartConfig;

/** 7 of the 9 tooltip variants; the other two add an `icon` or an `activities` label. */
export const SPORT_CONFIG = {
  running: { label: "Running", color: "var(--color-chart-1)" },
  swimming: { label: "Swimming", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

/** 2 pie variants. Month keys, because the slices are months rather than series. */
export const PIE_MONTHS_CONFIG = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
  january: { label: "January", color: "var(--color-chart-1)" },
  february: { label: "February", color: "var(--color-chart-2)" },
  march: { label: "March", color: "var(--color-chart-3)" },
  april: { label: "April", color: "var(--color-chart-4)" },
  may: { label: "May", color: "var(--color-chart-5)" },
} satisfies ChartConfig;
