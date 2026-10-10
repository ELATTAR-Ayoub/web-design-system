/**
 * Authored documentation page for `chart-geometry`.
 *
 * RESOLVED naming collision (`docs/contracts/audit/chart-geometry.json`,
 * `lib/ds/platform-contract.ts`). Flutter's `chart_geometry.dart` is a
 * pure-maths library — nice-tick calculation, band/point/linear scales, bar
 * layout, `d3-shape` curve interpolation, and polar sector/arc geometry —
 * shared by every cartesian and polar chart, because Flutter has no charting
 * package to lean on. On the web that same maths is not ours: it is
 * `recharts`' own (`XAxis`/`YAxis` `scale`, `tickCount`, `domain`; `Line`/
 * `Area` `type="monotone"`; `PolarGrid`/`PolarAngleAxis`), reached through
 * `ChartContainer`. The contract row is `delivery: "package-native"` — there
 * is no module of ours that computes a scale or a curve, so this page
 * documents the recharts primitives that own each piece of geometry rather
 * than pointing at a file that only contains the container.
 *
 * An earlier version of this page pointed `sourcePath` at
 * `components/ui/chart.tsx` and showed `UnitActivityChart` and
 * `ConversionFunnelChart` — two hand-drawn, non-recharts specimens from
 * `components/ds/charts/` — as if they WERE the capability. Neither claim
 * survives the audit: `chart.tsx` is the container, not the maths engine,
 * and those two components exist for the opposite reason `chart_geometry.dart`
 * does — they draw a percentage or a level comparison directly as CSS
 * geometry precisely because no scale function fits their shape. They are
 * kept below, honestly framed as documentation specimens of "when the
 * geometry is the component", not as this item's capability.
 */

import { AreaAxes } from "@/components/ds/charts/area";
import { LineMultiple } from "@/components/ds/charts/line";
import { RadialStacked } from "@/components/ds/charts/radial";
import { RadarLegend } from "@/components/ds/charts/radar";
import { UnitActivityChart } from "@/components/ds/charts/unit-activity";
import { ConversionFunnelChart } from "@/components/ds/charts/conversion-funnel";
import { ChartStates } from "@/components/ds/charts/state";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "chart-geometry",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Four real charts, each with the geometry left visible rather than tucked behind a smooth line: nice-tick axis labels driven by tickCount, an explicit numeric domain, a monotone curve, and a polar plot built from PolarGrid and PolarAngleAxis. Every panel's legend and tooltip are the real ChartLegend/ChartTooltip, wired.",
      render: (
        <div className="grid gap-4 sm:grid-cols-2">
          <ChartStates title="Nice ticks" note="YAxis tickCount=3 — both axes labelled" skeleton="area">
            <AreaAxes />
          </ChartStates>
          <ChartStates title="Monotone curve" note="Line type=monotone, two series" skeleton="line">
            <LineMultiple />
          </ChartStates>
          <ChartStates title="Explicit domain" note="PolarAngleAxis domain={[0, total]}" skeleton="radial">
            <RadialStacked />
          </ChartStates>
          <ChartStates title="Polar grid" note="PolarGrid + PolarAngleAxis, legend wired" skeleton="radar">
            <RadarLegend />
          </ChartStates>
        </div>
      ),
      source: `import { AreaAxes } from "@/components/ds/charts/area";
import { LineMultiple } from "@/components/ds/charts/line";
import { RadialStacked } from "@/components/ds/charts/radial";
import { RadarLegend } from "@/components/ds/charts/radar";

<div className="grid gap-4 sm:grid-cols-2">
  <AreaAxes />      {/* YAxis tickCount={3} — recharts' own nice-tick algorithm */}
  <LineMultiple />  {/* Line type="monotone" — d3-shape's monotoneX curve */}
  <RadialStacked /> {/* PolarAngleAxis domain={[0, total]} — explicit numeric domain */}
  <RadarLegend />   {/* PolarGrid + PolarAngleAxis, ChartLegend + ChartTooltip wired */}
</div>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "There is no chart-geometry import. A caller reaches this maths by setting the same recharts props documented below on an XAxis/YAxis, a Line/Area's type, or a PolarGrid/PolarAngleAxis — inside the ChartContainer the chart item page documents.",
      language: "tsx",
      code: `import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = {
  desktop: { label: "Desktop", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

<ChartContainer config={config} className="h-64 w-full">
  <LineChart data={data} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    {/* tickCount + domain are the two props that reach chartNiceTicks/
        chartNiceDomain's web equivalent — recharts' own getNiceTickValues */}
    <YAxis tickCount={3} domain={[0, "auto"]} tickLine={false} axisLine={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    {/* type selects the curve interpolator — d3-shape's curveMonotoneX here */}
    <Line dataKey="desktop" type="monotone" stroke="var(--color-chart-1)" dot={false} />
  </LineChart>
</ChartContainer>`,
    },
    {
      kind: "disclosure",
      id: "maths",
      title: "The maths, mapped",
      description:
        "Every function chart_geometry.dart computes by hand, paired with the recharts prop that owns the same job on the web. Prop names read from node_modules/recharts' own type definitions, not invented.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "chartNiceTicks / chartNiceDomain",
                  v: (
                    <>
                      recharts&rsquo; own <Code>getNiceTickValues</Code>, run internally
                      whenever an axis renders. A caller reaches it through{" "}
                      <Code>tickCount</Code> (how many ticks to aim for) and{" "}
                      <Code>domain</Code> (the interval to nice — <Code>[0,
                      &quot;auto&quot;]</Code> is the default on a value axis) on{" "}
                      <Code>XAxis</Code>, <Code>YAxis</Code>,{" "}
                      <Code>PolarAngleAxis</Code> or <Code>PolarRadiusAxis</Code>.
                      Demonstrated above: <Code>AreaAxes</Code>&rsquo;s{" "}
                      <Code>YAxis tickCount=3</Code>.
                    </>
                  ),
                },
                {
                  k: "BandScale / PointScale",
                  v: (
                    <>
                      A categorical axis&rsquo; own scale, chosen by recharts from{" "}
                      <Code>type=&quot;category&quot;</Code> and the chart family —
                      band spacing for <Code>Bar</Code>, point spacing (first and
                      last category on the plot edges) for <Code>Line</Code>/
                      <Code>Area</Code>. Not a prop a caller sets directly; the
                      family picks it, matching recharts&rsquo; own{" "}
                      <Code>scale</Code> default of &quot;auto&quot;.
                    </>
                  ),
                },
                {
                  k: "LinearScale",
                  v: (
                    <>
                      A numeric axis, mapped over the niced domain. Reached through{" "}
                      <Code>domain</Code> and the explicit <Code>scale</Code> prop
                      (default &quot;auto&quot;, or a d3-scale name/definition).
                      Demonstrated above: <Code>RadialStacked</Code>&rsquo;s{" "}
                      <Code>PolarAngleAxis type=&quot;number&quot; domain={"{[0, total]}"}</Code>.
                    </>
                  ),
                },
                {
                  k: "barSlots",
                  v: (
                    <>
                      <Code>BarChart</Code>&rsquo;s <Code>barCategoryGap</Code> and{" "}
                      <Code>barGap</Code>, plus <Code>Bar</Code>&rsquo;s own{" "}
                      <Code>barSize</Code> — the offset and width of each bar
                      inside its band. Documented with the cartesian family on
                      the <Code>chart-cartesian</Code> page.
                    </>
                  ),
                },
                {
                  k: "barRRect",
                  v: (
                    <>
                      <Code>Bar</Code>&rsquo;s <Code>radius</Code> prop (a number
                      or four corner numbers, pixels only — see{" "}
                      <Code>chart-cartesian</Code>&rsquo;s API Reference for why
                      this system&rsquo;s bars ship square) and{" "}
                      <Code>Pie</Code>/<Code>RadialBar</Code>&rsquo;s{" "}
                      <Code>cornerRadius</Code> for the polar case.
                    </>
                  ),
                },
                {
                  k: "curvePath / areaPath (CurveType)",
                  v: (
                    <>
                      <Code>Line</Code>/<Code>Area</Code>&rsquo;s <Code>type</Code>{" "}
                      prop: <Code>linear</Code>, <Code>natural</Code>,{" "}
                      <Code>monotone</Code>, <Code>step</Code> all exist under
                      that exact spelling in recharts&rsquo; own{" "}
                      <Code>CurveType</Code> union — the same four{" "}
                      <Code>chart_geometry.dart</Code> ports from d3-shape.
                      Demonstrated above: <Code>LineMultiple</Code>&rsquo;s{" "}
                      <Code>type=&quot;monotone&quot;</Code>.
                    </>
                  ),
                },
                {
                  k: "polarToCartesian / polarMaxRadius",
                  v: (
                    <>
                      Computed internally by every polar chart from its own{" "}
                      <Code>cx</Code>/<Code>cy</Code>/<Code>innerRadius</Code>/
                      <Code>outerRadius</Code> — there is no exposed conversion
                      function, only the radii a caller sets on{" "}
                      <Code>Pie</Code>, <Code>Radar</Code>&rsquo;s implicit plot
                      circle, or <Code>RadialBar</Code>.
                    </>
                  ),
                },
                {
                  k: "sectorPath / sectorWithCornerPath",
                  v: (
                    <>
                      <Code>Pie</Code>&rsquo;s and <Code>RadialBar</Code>&rsquo;s{" "}
                      own sector rendering, corner-rounded through the same{" "}
                      <Code>cornerRadius</Code> named above.
                    </>
                  ),
                },
                {
                  k: "polarPolygonPath",
                  v: (
                    <>
                      <Code>PolarGrid</Code>&rsquo;s <Code>gridType</Code>{" "}
                      (&quot;polygon&quot;, the default, or &quot;circle&quot;),{" "}
                      <Code>radialLines</Code>, <Code>polarAngles</Code> and{" "}
                      <Code>polarRadius</Code> — the rings and spokes a{" "}
                      <Code>Radar</Code> series is drawn against. Demonstrated
                      above: <Code>RadarLegend</Code>&rsquo;s{" "}
                      <Code>PolarGrid</Code> + <Code>PolarAngleAxis</Code> pair.
                    </>
                  ),
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples — when the geometry is the component",
      description:
        "Two documentation specimens from components/ds/charts, kept here because they share this item's registry slot in the Flutter catalogue — not because they are this capability. Neither imports recharts, neither takes a scale, a tickCount or a domain: UnitActivityChart lights up twelve fixed rows by comparing a level constant to the datum, and ConversionFunnelChart sizes flexGrow/flexBasis strip segments directly from a percentage. They draw geometry by hand because no scale function fits a twelve-row activity grid or a proportional funnel strip — the opposite of the recharts maths documented above, and not shipped as chart-geometry's own capability.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Unit activity" note="hand-drawn — no scale function" skeleton="bar">
            <UnitActivityChart />
          </ChartStates>
          <ChartStates title="Conversion funnel" note="hand-drawn — no scale function" skeleton="bar">
            <ConversionFunnelChart />
          </ChartStates>
        </div>
      ),
      source: `import { UnitActivityChart } from "@/components/ds/charts/unit-activity";
import { ConversionFunnelChart } from "@/components/ds/charts/conversion-funnel";

<UnitActivityChart
  title="Active users"
  value={24_815}
  comparison="5.6k fewer in the last 7 days"
/>

<ConversionFunnelChart
  title="Conversions"
  total={24_815}
  stages={[
    { label: "Signed up", value: 9_420, tone: "chart-1" },
    { label: "Created a project", value: 6_180, tone: "chart-2" },
    { label: "Invited a teammate", value: 3_940, tone: "chart-3" },
    { label: "Activated", value: 3_190, tone: "chart-4" },
  ]}
/>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "The recharts geometry props a caller actually sets, reached through this system's ChartContainer and the family wrappers in components/ds/charts. Not an exhaustive recharts reference — only the props that carry the maths chart_geometry.dart ports on Flutter.",
      blocks: [
        {
          label: "Axis geometry — XAxis, YAxis, PolarAngleAxis, PolarRadiusAxis",
          body: (
            <Meta
              items={[
                {
                  k: "tickCount",
                  v: "number. How many ticks the nice-tick algorithm aims for — not a guarantee, since niceing can add or drop one to keep the interval round.",
                },
                {
                  k: "domain",
                  v: 'AxisDomain. [min, max], each a number, "auto", "dataMin"/"dataMax" (optionally offset, e.g. "dataMax + 100"), or a function of the data extent. Undefined lets recharts derive it from the data.',
                },
                {
                  k: "scale",
                  v: 'ScaleType | CustomScaleDefinition. "auto" (default) picks band/point/linear from the axis type and chart family; a d3-scale name or object overrides it.',
                },
                {
                  k: "type",
                  v: '"number" | "category" | "auto". Numeric values place points by magnitude; category values place them at even band/point positions regardless of numeric difference.',
                },
              ]}
            />
          ),
        },
        {
          label: "Curve — Line, Area",
          body: (
            <Meta
              items={[
                {
                  k: "type",
                  v: '"linear" | "natural" | "monotone" | "step" (recharts\' CurveType also accepts "monotoneX"/"monotoneY" and several basis/bump variants not used on this page). natural and monotone both refuse to overshoot a data point; linear cannot promise that once more than two points are joined.',
                },
              ]}
            />
          ),
        },
        {
          label: "Polar grid — PolarGrid, PolarAngleAxis",
          body: (
            <Meta
              items={[
                {
                  k: "gridType",
                  v: '"polygon" (default) | "circle" — the connecting shape between rings.',
                },
                {
                  k: "radialLines",
                  v: "boolean, default true. The spokes from centre to each angle tick.",
                },
                {
                  k: "polarAngles / polarRadius",
                  v: "number[]. Explicit angle or radius stops, overriding what the axis would otherwise compute.",
                },
              ]}
            />
          ),
        },
        {
          label: "Bar layout and corners — BarChart, Bar, Pie, RadialBar",
          body: (
            <Meta
              items={[
                {
                  k: "barCategoryGap / barGap",
                  v: "On BarChart: the gap around a category's group of bars, and between bars within one group.",
                },
                {
                  k: "radius (Bar) / cornerRadius (Pie, RadialBar)",
                  v: "Pixels only, no token spelling — see chart-cartesian's API Reference for why this system's Cartesian bars ship square rather than typing a literal that check:tokens cannot see.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "The four preview specimens and the two hand-drawn examples all carry the same Empty · Loading · Error · Ready switch through ChartStates as every other chart family — the shared architecture is documented once, on the chart item page.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Coverage",
                  v: "6 variants on this page: Area (ticks) · Line (monotone) · Radial (domain) · Radar (polar grid) · Unit activity · Conversion funnel.",
                },
                {
                  k: "Skeleton shapes",
                  v: 'area, line, radial and radar for the four recharts specimens; both hand-drawn examples use "bar" — the closest of the seven ChartSkeletonKind shapes to a cell matrix and a segmented strip.',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "The recharts specimens' accessible name, role and axis-tick contrast are measured once on the chart item page and not restated here. The two hand-drawn examples are a genuinely different pattern, worth documenting on its own.",
      blocks: [
        {
          body: (
            <Note tone="action" title="UnitActivityChart / ConversionFunnelChart build their own name">
              <p>
                Neither renders through <Code>ChartContainer</Code>, so neither
                gets the container&rsquo;s <Code>aria-label</Code>/
                <Code>aria-labelledby</Code> contract. Both render a native{" "}
                <Code>&lt;figure&gt;</Code> with an <Code>aria-label</Code>{" "}
                assembled from the same props that drive the drawing — title,
                value and comparison for <Code>UnitActivityChart</Code>; title,
                total and the derived conversion rate for{" "}
                <Code>ConversionFunnelChart</Code>. The grid of cells and the
                strip of segments are both <Code>aria-hidden</Code>;{" "}
                <Code>ConversionFunnelChart</Code> keeps its exact per-stage
                values as real, unhidden text underneath the strip.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Every specimen on this page carries the shared Empty · Loading · Error · Ready ToggleGroup; none of the six adds a focusable element of its own beyond it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "State switch (ToggleGroup)",
                  v: "Tab moves focus to the group. Arrow Left/Right moves the selection among Empty, Loading, Error and Ready. Space/Enter activates the focused option.",
                },
                {
                  k: "Error state retry",
                  v: '"Try again" is a real Button; Tab reaches it and Enter/Space returns the panel to Ready.',
                },
                {
                  k: "UnitActivityChart / ConversionFunnelChart",
                  v: "N/A beyond the state switch — both are read-only figures with no focusable element of their own.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Recharts specimens",
                  v: "Sized by the shared ResponsiveContainer and the PLOT footprint constant, documented once on the chart item page — this item introduces no responsive behaviour of its own.",
                },
                {
                  k: "UnitActivityChart",
                  v: "Its row track sets min-w-xl and overflows horizontally inside a clipped flex row rather than reflowing.",
                },
                {
                  k: "ConversionFunnelChart",
                  v: "The strip and the percentage row use flexGrow/flexBasis: 0, so every stage's width is a live proportion of the container.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
