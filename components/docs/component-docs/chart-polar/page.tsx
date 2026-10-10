/**
 * Authored documentation page for `chart-polar`.
 *
 * Replaces the generated baseline. Migrated from the old `base/charts`
 * category page (`app/design-system/components/base/charts/page.tsx`, since deleted), which
 * held the whole family's documentation on one page. This item owns the
 * three angular plot families — Pie, Radar, Radial — built on the shared
 * `ChartContainer` documented on the `chart` item page. It resolves through
 * the registry as a `dependency` of `chart`, never as its own install target
 * — see Installation.
 *
 * Every specimen below is the real `PieChart` / `RadarChart` /
 * `RadialBarChart` from `components/ds/charts/{pie,radar,radial}.tsx`,
 * wrapped in `ChartStates` so each one carries its real
 * Empty · Loading · Error · Ready switch.
 */

import {
  PieDonut,
  PieDonutActive,
  PieDonutText,
  PieInteractive,
  PieInteractiveControls,
  PieLabel,
  PieLabelCustom,
  PieLabelList,
  PieLegend,
  PieSeparatorNone,
  PieSimple,
  PieStacked,
} from "@/components/ds/charts/pie";
import {
  RadarDefault,
  RadarDots,
  RadarGridCircle,
  RadarGridCircleFill,
  RadarGridCircleNoLines,
  RadarGridCustom,
  RadarGridFill,
  RadarGridNone,
  RadarIcons,
  RadarLabelCustom,
  RadarLegend,
  RadarLinesOnly,
  RadarMultiple,
  RadarRadius,
} from "@/components/ds/charts/radar";
import {
  RadialGrid,
  RadialLabel,
  RadialShape,
  RadialSimple,
  RadialStacked,
  RadialText,
} from "@/components/ds/charts/radial";
import { ChartStates } from "@/components/ds/charts/state";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "chart-polar",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A picker that changes the data — five months, one slice highlighted at a time — and the real Recharts tooltip on hover. Press a month.",
      render: (
        <ChartStates
          title="Interactive pie"
          note="chart-pie-interactive"
          skeleton="pie"
          controls={PieInteractiveControls}
        >
          <PieInteractive />
        </ChartStates>
      ),
      source: `import { createContext, useContext, useState } from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartMotion } from "@/components/ds/chart-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Month = "january" | "february" | "march" | "april" | "may";
const MonthContext = createContext<Month>("january");

// The picker lives OUTSIDE the swapped Loading/Empty/Error/Ready slot (see
// ChartStates' \`controls\` prop below) so choosing a month never resizes the
// panel — only activeIndex, and the slice it highlights, changes.
function MonthPicker({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<Month>("january");
  return (
    <MonthContext.Provider value={month}>
      <Select value={month} onValueChange={(v) => setMonth(v as Month)}>
        <SelectTrigger aria-label="Select a month"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="january">January</SelectItem>
          <SelectItem value="february">February</SelectItem>
          {/* … march, april, may */}
        </SelectContent>
      </Select>
      {children}
    </MonthContext.Provider>
  );
}

function InteractivePie() {
  const motion = useChartMotion();
  const month = useContext(MonthContext);
  const activeIndex = data.findIndex((item) => item.month === month);

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="month" />} />
        <Pie data={data} dataKey="visitors" nameKey="month" innerRadius="60%" activeIndex={activeIndex} {...motion} />
      </PieChart>
    </ChartContainer>
  );
}`,
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
        "A minimal pie chart. dataKey sizes each slice; nameKey names it. fill is carried per-datum, since a Pie has one dataKey and many colours.",
      language: "tsx",
      code: `import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chart-1)" },
  { browser: "safari", visitors: 200, fill: "var(--color-chart-2)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-chart-3)" },
];

const config = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--color-chart-1)" },
  safari: { label: "Safari", color: "var(--color-chart-2)" },
  firefox: { label: "Firefox", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

<ChartContainer config={config} aria-label="Browser share" className="h-64">
  <PieChart>
    <ChartTooltip content={<ChartTooltipContent nameKey="browser" />} />
    <Pie data={data} dataKey="visitors" nameKey="browser" />
  </PieChart>
</ChartContainer>`,
    },
    {
      kind: "showcase",
      id: "pie",
      title: "Pie",
      description:
        "Parts of one whole, and only when the parts genuinely sum to that whole. Five slices is already near the ceiling — past that a bar chart is easier to read and easier to label.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Simple" note="fill carried on each datum" skeleton="pie">
            <PieSimple />
          </ChartStates>
          <ChartStates title="No separator" note="paddingAngle={0}" skeleton="pie">
            <PieSeparatorNone />
          </ChartStates>
          <ChartStates title="Label" note="labels outside, with leader lines" skeleton="pie">
            <PieLabel />
          </ChartStates>
          <ChartStates title="Custom label" note="label as a render function" skeleton="pie">
            <PieLabelCustom />
          </ChartStates>
          <ChartStates title="Label list" note="on a card chip — the fill cannot clear AA" skeleton="pie">
            <PieLabelList />
          </ChartStates>
          <ChartStates title="Legend" note="ChartLegendContent, no tooltip" skeleton="pie">
            <PieLegend />
          </ChartStates>
          <ChartStates title="Donut" note="innerRadius as a percentage" skeleton="pie">
            <PieDonut />
          </ChartStates>
          <ChartStates title="Donut, active" note="activeIndex grows one slice" skeleton="pie">
            <PieDonutActive />
          </ChartStates>
          <ChartStates title="Donut with text" note="the total in the hole" skeleton="pie">
            <PieDonutText />
          </ChartStates>
          <ChartStates title="Stacked" note="two rings, one chart" skeleton="pie">
            <PieStacked />
          </ChartStates>
          <ChartStates title="Interactive" note="slice picker, travelling pill" skeleton="pie" controls={PieInteractiveControls}>
            <PieInteractive />
          </ChartStates>
        </div>
      ),
      source: `// Eleven Pie compositions on the shared ChartContainer contract, each a
// zero-prop demo exported from components/ds/charts/pie.tsx:
import {
  PieDonut,
  PieDonutActive,
  PieDonutText,
  PieInteractive,
  PieInteractiveControls,
  PieLabel,
  PieLabelCustom,
  PieLabelList,
  PieLegend,
  PieSeparatorNone,
  PieSimple,
  PieStacked,
} from "@/components/ds/charts/pie";

<PieSimple />        {/* fill carried on each datum */}
<PieSeparatorNone /> {/* paddingAngle={0} */}
<PieLabel />         {/* labels outside, with leader lines */}
<PieLabelCustom />   {/* label as a render function */}
<PieLabelList />     {/* on a card chip — the fill cannot clear AA */}
<PieLegend />        {/* ChartLegendContent, no tooltip */}
<PieDonut />         {/* innerRadius as a percentage */}
<PieDonutActive />   {/* activeIndex grows one slice */}
<PieDonutText />     {/* the total in the hole */}
<PieStacked />       {/* two rings, one chart */}

// PieInteractive's slice picker is a second export, mounted in
// ChartStates' controls slot so it renders in every state:
<ChartStates title="Interactive" skeleton="pie" controls={PieInteractiveControls}>
  <PieInteractive />
</ChartStates>

// PieSimple itself, for the shape every variant above shares:
function PieSimple() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={pieConfig} aria-label="Browser share" className="h-64 w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="browser" />} />
        <Pie data={pieData} dataKey="visitors" {...motion} />
      </PieChart>
    </ChartContainer>
  );
}`,
    },
    {
      kind: "showcase",
      id: "radar",
      title: "Radar",
      description:
        "One subject measured on several axes at once, and best when the shape is the point — comparing two profiles rather than reading any single number off the grid.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Default" note="polygon grid, radial lines on" skeleton="radar">
            <RadarDefault />
          </ChartStates>
          <ChartStates title="Dots" note="a dot at every vertex" skeleton="radar">
            <RadarDots />
          </ChartStates>
          <ChartStates title="Lines only" note="stroke, no fill" skeleton="radar">
            <RadarLinesOnly />
          </ChartStates>
          <ChartStates title="Custom label" note="PolarAngleAxis tick as a render function" skeleton="radar">
            <RadarLabelCustom />
          </ChartStates>
          <ChartStates title="Custom grid" note="PolarGrid with its own stroke" skeleton="radar">
            <RadarGridCustom />
          </ChartStates>
          <ChartStates title="No grid" note="PolarGrid omitted" skeleton="radar">
            <RadarGridNone />
          </ChartStates>
          <ChartStates title="Circle grid" note="gridType=circle" skeleton="radar">
            <RadarGridCircle />
          </ChartStates>
          <ChartStates title="Circle, no lines" note="circle grid, radialLines={false}" skeleton="radar">
            <RadarGridCircleNoLines />
          </ChartStates>
          <ChartStates title="Circle, filled" note="circle grid with a fill" skeleton="radar">
            <RadarGridCircleFill />
          </ChartStates>
          <ChartStates title="Polygon, filled" note="polygon grid with a fill" skeleton="radar">
            <RadarGridFill />
          </ChartStates>
          <ChartStates title="Multiple" note="two profiles overlaid" skeleton="radar">
            <RadarMultiple />
          </ChartStates>
          <ChartStates title="Legend" note="ChartLegendContent under the web" skeleton="radar">
            <RadarLegend />
          </ChartStates>
          <ChartStates title="Icons" note="config icons in the legend" skeleton="radar">
            <RadarIcons />
          </ChartStates>
          <ChartStates title="Radius axis" note="PolarRadiusAxis shown" skeleton="radar">
            <RadarRadius />
          </ChartStates>
        </div>
      ),
      source: `// Fourteen Radar compositions on the shared ChartContainer contract, each a
// zero-prop demo exported from components/ds/charts/radar.tsx:
import {
  RadarDefault,
  RadarDots,
  RadarGridCircle,
  RadarGridCircleFill,
  RadarGridCircleNoLines,
  RadarGridCustom,
  RadarGridFill,
  RadarGridNone,
  RadarIcons,
  RadarLabelCustom,
  RadarLegend,
  RadarLinesOnly,
  RadarMultiple,
  RadarRadius,
} from "@/components/ds/charts/radar";

<RadarDefault />          {/* polygon grid, radial lines on */}
<RadarDots />             {/* a dot at every vertex */}
<RadarLinesOnly />        {/* stroke, no fill */}
<RadarLabelCustom />      {/* PolarAngleAxis tick as a render function */}
<RadarGridCustom />       {/* PolarGrid with its own stroke */}
<RadarGridNone />         {/* PolarGrid omitted */}
<RadarGridCircle />       {/* gridType="circle" */}
<RadarGridCircleNoLines />{/* circle grid, radialLines={false} */}
<RadarGridCircleFill />   {/* circle grid with a fill */}
<RadarGridFill />         {/* polygon grid with a fill */}
<RadarMultiple />         {/* two profiles overlaid */}
<RadarLegend />           {/* ChartLegendContent under the web */}
<RadarIcons />            {/* config icons in the legend */}
<RadarRadius />           {/* PolarRadiusAxis shown */}

// RadarDefault itself, for the shape every variant above shares:
function RadarDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={radarConfig} aria-label="Skill assessment" className="h-64 w-full">
      <RadarChart data={radarData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="skill" />
        <PolarGrid />
        <Radar dataKey="score" fill="var(--color-chart-1)" fillOpacity={0.6} stroke="var(--color-chart-1)" {...motion} />
      </RadarChart>
    </ChartContainer>
  );
}`,
    },
    {
      kind: "showcase",
      id: "radial",
      title: "Radial",
      description:
        "A bar chart bent around a circle. It buys compactness and costs accuracy — the outer ring is longer than the inner one at the same value — so use it for a gauge or a rough share, never for a comparison the reader has to trust.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Simple" note="background rings, one bar per tier" skeleton="radial">
            <RadialSimple />
          </ChartStates>
          <ChartStates title="Grid" note="PolarGrid inside the ring" skeleton="radial">
            <RadialGrid />
          </ChartStates>
          <ChartStates title="Label" note="on a card chip — the arc cannot clear AA" skeleton="radial">
            <RadialLabel />
          </ChartStates>
          <ChartStates title="Text" note="the total in the hole" skeleton="radial">
            <RadialText />
          </ChartStates>
          <ChartStates title="Shape" note="a custom activeShape" skeleton="radial">
            <RadialShape />
          </ChartStates>
          <ChartStates title="Stacked half-gauge" note="startAngle 180 → endAngle 0" skeleton="radial">
            <RadialStacked />
          </ChartStates>
        </div>
      ),
      source: `// Six RadialBar compositions on the shared ChartContainer contract, each a
// zero-prop demo exported from components/ds/charts/radial.tsx:
import {
  RadialGrid,
  RadialLabel,
  RadialShape,
  RadialSimple,
  RadialStacked,
  RadialText,
} from "@/components/ds/charts/radial";

<RadialSimple /> {/* background rings, one bar per tier */}
<RadialGrid />   {/* PolarGrid inside the ring */}
<RadialLabel />  {/* on a card chip — the arc cannot clear AA */}
<RadialText />   {/* the total in the hole */}
<RadialShape />  {/* a custom activeShape */}
<RadialStacked />{/* startAngle 180 → endAngle 0 */}

// RadialSimple itself, for the shape every variant above shares:
function RadialSimple() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={radialConfig} aria-label="Storage used" className="h-64 w-full">
      <RadialBarChart data={radialData} innerRadius={30} outerRadius={110}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="tier" />} />
        <RadialBar dataKey="value" background {...motion} />
      </RadialBarChart>
    </ChartContainer>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Props specific to the three angular families. ChartContainer, ChartTooltipContent and ChartLegendContent are documented once, on the chart item page.",
      blocks: [
        {
          label: "Pie",
          body: (
            <Meta
              items={[
                {
                  k: "dataKey / nameKey",
                  v: "dataKey is the number that sizes the slice; nameKey is the string that names it. Pass nameKey to ChartTooltipContent and ChartLegendContent too, or both fall back to the value key and every row reads \"Cards\".",
                },
                {
                  k: "fill",
                  v: "Per slice, carried on the datum itself rather than on the Pie — a Pie has one dataKey and many colours, which is the one place the colour belongs to the data.",
                },
                {
                  k: "innerRadius / outerRadius",
                  v: "Percentages, never pixels. A fraction of the plot is derived from the container, so it holds at every breakpoint and never restates a spacing step.",
                },
                {
                  k: "label / labelLine",
                  v: "label renders the value outside the arc; labelLine draws the leader to it. Leave room by pulling outerRadius in, or the labels clip against the container.",
                },
              ]}
            />
          ),
        },
        {
          label: "Radar",
          body: (
            <Meta
              items={[
                {
                  k: "PolarGrid gridType",
                  v: "polygon (default) or circle. Polygon makes the vertices — the actual axes — easy to find; circle is quieter and reads better with two overlapping series.",
                },
                {
                  k: "PolarGrid radialLines",
                  v: "The spokes. Turning them off with a circle grid leaves rings only, which is the calmest of the four combinations.",
                },
                {
                  k: "PolarAngleAxis dataKey",
                  v: "The field naming each axis. Without it the axes are numbered and the chart says nothing.",
                },
                {
                  k: "PolarRadiusAxis",
                  v: 'The scale running out from the centre. Usually hidden — tick={false} axisLine={false} — because a radar is read as a shape, not as five separate readings.',
                },
                {
                  k: "fillOpacity",
                  v: "Two overlapping radars need both fills translucent or the second one erases the first.",
                },
              ]}
            />
          ),
        },
        {
          label: "Radial",
          body: (
            <>
              <Meta
                items={[
                  {
                    k: "innerRadius / outerRadius",
                    v: "On the RadialBarChart, not on the bar. Percentages again. A wide gap between them gives thick rings; a narrow one gives a dial.",
                  },
                  {
                    k: "background",
                    v: "Draws the unfilled remainder of each ring. ChartContainer already paints it --muted, so it needs no colour of its own.",
                  },
                  {
                    k: "startAngle / endAngle",
                    v: "Degrees, counter-clockwise from three o'clock. 180 → 0 is the top half. Angles are not a token family, so these are written plainly.",
                  },
                  {
                    k: "stackId",
                    v: "Stacks around the arc rather than up a column. With one datum and three keys, that is a single segmented gauge.",
                  },
                ]}
              />
              <Note tone="error" title="A stacked radial does not widen its own angle axis" className="mt-4">
                Left alone it silently drew one third of its data. The angle
                axis domain runs to the largest single series rather than to
                the stack total, so the first ring filled the whole sweep and
                the two behind it were clipped to nothing — no error, no
                warning, and a legend that still listed all three. The fix is
                an explicit{" "}
                <Code>
                  &lt;PolarAngleAxis type=&quot;number&quot; domain=&#123;[0, total]&#125; /&gt;
                </Code>
                , with the total summed from the data rather than typed, so it
                cannot fall out of step with it.
                <span className="mt-3 block">
                  The legend came off for a second reason: with one datum and
                  three series keys, <Code>ChartLegendContent</Code> renders
                  an empty row — a radial legend&rsquo;s payload is built per
                  datum, not per series. The tooltip carries the three names
                  instead.
                </span>
              </Note>
            </>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Every specimen above carries its own Empty · Loading · Error · Ready switch through ChartStates — the shared architecture is documented on the chart item page.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Coverage",
                  v: "31 variants: Pie 11 · Radar 14 · Radial 6 — every angular chart in shadcn's registry, probed rather than remembered. The registry itself serves 14 Radar and 11 Pie variants; this gallery renders all of them.",
                },
                {
                  k: "Skeleton shapes",
                  v: "A ring for Pie, a polygon for Radar, concentric arcs for Radial — each drawn at the plot's real footprint (256px), so choosing a state never moves the panel.",
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
        "N/A as a separate section here. The accessible name and role, and the measured pie-label contrast finding, belong to the shared ChartContainer and are reported once, on the chart item page, so the same figures are never restated three times.",
      blocks: [
        { body: <p className="type-small text-muted-foreground">N/A — see description above.</p> },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Two independent controls appear on these specimens: the Empty · Loading · Error · Ready switch every specimen carries, and Pie's interactive slice picker.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "State switch (ToggleGroup)",
                  v: "Tab moves focus to the group. Arrow Left / Right moves the selection among Empty, Loading, Error and Ready. Space / Enter activates the focused option.",
                },
                {
                  k: "Interactive slice picker",
                  v: "Pie's interactive variant uses a travelling-pill ToggleGroup — same Arrow-key travel as the state switch.",
                },
                {
                  k: "Error state retry",
                  v: '"Try again" is a real Button; Tab reaches it and Enter / Space returns the panel to Ready.',
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
      description:
        "N/A as a separate section here. Sizing is governed by the shared ResponsiveContainer and the PLOT footprint constant, both documented once on the chart item page; the polar families introduce no responsive behaviour of their own.",
      blocks: [
        { body: <p className="type-small text-muted-foreground">N/A — see description above.</p> },
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
