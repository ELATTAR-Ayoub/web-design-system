/**
 * Authored documentation page for `chart-cartesian`.
 *
 * Replaces the generated baseline. Migrated from the old `base/charts`
 * category page (`app/design-system/components/base/charts/page.tsx`, since deleted), which
 * held the whole family's documentation on one page. This item owns the
 * three cartesian (x/y-axis) plot families — Area, Bar, Line — built on the
 * shared `ChartContainer` documented on the `chart` item page. It resolves
 * through the registry as a `dependency` of `chart`, never as its own install
 * target — see Installation.
 *
 * Every specimen below is the real `AreaChart` / `BarChart` / `LineChart`
 * from `components/ds/charts/{area,bar,line}.tsx`, wrapped in `ChartStates`
 * so each one carries its real Empty · Loading · Error · Ready switch.
 */

import {
  AreaAxes,
  AreaDefault,
  AreaGradient,
  AreaIcons,
  AreaInteractive,
  AreaInteractiveControls,
  AreaLegend,
  AreaLinear,
  AreaStacked,
  AreaStackedExpand,
  AreaStep,
} from "@/components/ds/charts/area";
import {
  BarActive,
  BarDefault,
  BarHorizontal,
  BarInteractive,
  BarInteractiveControls,
  BarLabel,
  BarLabelCustom,
  BarMixed,
  BarMultiple,
  BarNegative,
  BarStacked,
} from "@/components/ds/charts/bar";
import {
  LineDefault,
  LineDots,
  LineDotsColors,
  LineDotsCustom,
  LineInteractive,
  LineInteractiveControls,
  LineLabel,
  LineLabelCustom,
  LineLinear,
  LineMultiple,
  LineStep,
} from "@/components/ds/charts/line";
import { ChartStates } from "@/components/ds/charts/state";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "chart-cartesian",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A range switch that changes the data, and the real Recharts tooltip on hover. Press the picker to redraw the plot at 7, 30 or 90 days — the same Select strip every one of this family's Interactive variants below is built on.",
      render: (
        <ChartStates
          title="Interactive area"
          note="chart-area-interactive"
          skeleton="area"
          controls={AreaInteractiveControls}
        >
          <AreaInteractive />
        </ChartStates>
      ),
      source: `import { createContext, useContext, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartMotion } from "@/components/ds/chart-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Range = "90d" | "30d" | "7d";
const RangeContext = createContext<Range>("90d");

// The picker lives OUTSIDE the swapped Loading/Empty/Error/Ready slot (see
// ChartStates' \`controls\` prop below) so choosing a range never resizes the
// panel — only the plot inside it redraws.
function RangePicker({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<Range>("90d");
  return (
    <RangeContext.Provider value={range}>
      <Select value={range} onValueChange={(v) => setRange(v as Range)}>
        <SelectTrigger aria-label="Select a range"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="90d">Last 3 months</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
        </SelectContent>
      </Select>
      {children}
    </RangeContext.Provider>
  );
}

function InteractiveArea() {
  const motion = useChartMotion();
  const range = useContext(RangeContext);
  const data = filterByRange(dailyVisits, range); // 90/30/7 days back from the fixture's reference date

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} {...motion} />
        <Area dataKey="mobile" type="natural" fill="var(--color-chart-2)" stroke="var(--color-chart-2)" {...motion} />
        <Area dataKey="desktop" type="natural" fill="var(--color-chart-1)" stroke="var(--color-chart-1)" {...motion} />
      </AreaChart>
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
      description: "A minimal bar chart, sharing the same ChartContainer contract as every other cartesian family.",
      language: "tsx",
      code: `import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
];

const config = {
  desktop: { label: "Desktop", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

<ChartContainer config={config} aria-label="Desktop visitors" className="h-64">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={4} />
  </BarChart>
</ChartContainer>`,
    },
    {
      kind: "showcase",
      id: "area",
      title: "Area",
      description:
        "A line with the region under it filled. Reach for it when the magnitude beneath the curve is part of the story — volume, holdings, cumulative spend — and for a plain trend reach for Line instead.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Default" note="one series, natural curve" skeleton="area">
            <AreaDefault />
          </ChartStates>
          <ChartStates title="Linear" note="type=linear" skeleton="area">
            <AreaLinear />
          </ChartStates>
          <ChartStates title="Step" note="type=step" skeleton="area">
            <AreaStep />
          </ChartStates>
          <ChartStates title="Stacked" note="shared stackId" skeleton="area">
            <AreaStacked />
          </ChartStates>
          <ChartStates title="Stacked, expanded" note="stackOffset=expand — shares, not totals" skeleton="area">
            <AreaStackedExpand />
          </ChartStates>
          <ChartStates title="Legend" note="ChartLegendContent" skeleton="area">
            <AreaLegend />
          </ChartStates>
          <ChartStates title="Icons" note="config icons in the legend" skeleton="area">
            <AreaIcons />
          </ChartStates>
          <ChartStates title="Gradient fill" note="a linearGradient in defs, both stops on the token" skeleton="area">
            <AreaGradient />
          </ChartStates>
          <ChartStates title="Axes" note="both axes labelled" skeleton="area">
            <AreaAxes />
          </ChartStates>
          <ChartStates title="Interactive" note="range picker, above the plot" skeleton="area" controls={AreaInteractiveControls}>
            <AreaInteractive />
          </ChartStates>
        </div>
      ),
      source: `// Ten Area compositions on the shared ChartContainer contract. Each is a
// zero-prop function that owns its own data and config — this system's
// \`components/ds/charts/area.tsx\` exports all ten as named, reusable demos:
import {
  AreaAxes,
  AreaDefault,
  AreaGradient,
  AreaIcons,
  AreaInteractive,
  AreaInteractiveControls,
  AreaLegend,
  AreaLinear,
  AreaStacked,
  AreaStackedExpand,
  AreaStep,
} from "@/components/ds/charts/area";

<AreaDefault />       {/* one series, natural curve */}
<AreaLinear />        {/* type="linear" */}
<AreaStep />          {/* type="step" */}
<AreaStacked />       {/* shared stackId */}
<AreaStackedExpand /> {/* stackOffset="expand" — shares, not totals */}
<AreaLegend />        {/* ChartLegendContent */}
<AreaIcons />         {/* config icons in the legend */}
<AreaGradient />      {/* a linearGradient in defs, both stops on the token */}
<AreaAxes />          {/* both axes labelled */}

// AreaInteractive's range Select is a second export, mounted in
// ChartStates' controls slot so it renders in every state, not only "ready":
<ChartStates title="Interactive" skeleton="area" controls={AreaInteractiveControls}>
  <AreaInteractive />
</ChartStates>

// AreaDefault itself, for the shape every variant above shares:
function AreaDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={{ desktop: { label: "Desktop", color: "var(--color-chart-1)" } }} className="h-64 w-full">
      <AreaChart accessibilityLayer data={monthsDesktop} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
        <Area dataKey="desktop" type="natural" fill="var(--color-chart-1)" fillOpacity={0.4} stroke="var(--color-chart-1)" {...motion} />
      </AreaChart>
    </ChartContainer>
  );
}`,
    },
    {
      kind: "showcase",
      id: "bar",
      title: "Bar",
      description:
        "Comparison across a small number of named things. Four arrangements, one of which is the same chart rotated — a horizontal bar chart is a BarChart with layout=vertical, which reads backwards until you have hit it once.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Default" note="one series" skeleton="bar">
            <BarDefault />
          </ChartStates>
          <ChartStates title="Horizontal" note="layout=vertical, YAxis type=category" skeleton="bar">
            <BarHorizontal />
          </ChartStates>
          <ChartStates title="Multiple" note="two Bars, no stackId" skeleton="bar">
            <BarMultiple />
          </ChartStates>
          <ChartStates title="Stacked" note="three Bars sharing a stackId" skeleton="bar">
            <BarStacked />
          </ChartStates>
          <ChartStates title="Label" note="LabelList on the bar" skeleton="bar">
            <BarLabel />
          </ChartStates>
          <ChartStates title="Custom label" note="LabelList with a render function" skeleton="bar">
            <BarLabelCustom />
          </ChartStates>
          <ChartStates title="Mixed" note="one Bar, a colour per datum" skeleton="bar">
            <BarMixed />
          </ChartStates>
          <ChartStates title="Active" note="activeIndex highlights one" skeleton="bar">
            <BarActive />
          </ChartStates>
          <ChartStates title="Negative" note="values below zero — direction by position, not by red" skeleton="bar">
            <BarNegative />
          </ChartStates>
          <ChartStates title="Interactive" note="series picker, travelling pill" skeleton="bar" controls={BarInteractiveControls}>
            <BarInteractive />
          </ChartStates>
        </div>
      ),
      source: `// Ten Bar compositions on the shared ChartContainer contract, each a
// zero-prop demo exported from components/ds/charts/bar.tsx:
import {
  BarActive,
  BarDefault,
  BarHorizontal,
  BarInteractive,
  BarInteractiveControls,
  BarLabel,
  BarLabelCustom,
  BarMixed,
  BarMultiple,
  BarNegative,
  BarStacked,
} from "@/components/ds/charts/bar";

<BarDefault />     {/* one series */}
<BarHorizontal />  {/* layout="vertical", YAxis type="category" */}
<BarMultiple />    {/* two Bars, no stackId */}
<BarStacked />     {/* three Bars sharing a stackId */}
<BarLabel />       {/* LabelList on the bar */}
<BarLabelCustom /> {/* LabelList with a render function */}
<BarMixed />       {/* one Bar, a colour per datum */}
<BarActive />      {/* activeIndex highlights one */}
<BarNegative />    {/* values below zero — direction by position, not red */}

// BarInteractive's series picker is a second export, mounted in
// ChartStates' controls slot so it renders in every state:
<ChartStates title="Interactive" skeleton="bar" controls={BarInteractiveControls}>
  <BarInteractive />
</ChartStates>

// BarDefault itself, for the shape every variant above shares:
function BarDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={{ desktop: { label: "Desktop", color: "var(--color-chart-1)" } }} className="h-64 w-full">
      <BarChart accessibilityLayer data={monthsDesktop}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        {/* radius takes a number of pixels, not a token — read live off
            --radius-sm via getComputedStyle rather than typed as a literal */}
        <Bar dataKey="desktop" fill="var(--color-chart-1)" radius={useBarRadius()} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}`,
    },
    {
      kind: "showcase",
      id: "line",
      title: "Line",
      description:
        "Trend over an ordered axis, and the default choice for more than two series — three stacked areas fight each other for the same pixels, three lines do not.",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Default" note="dot={false}" skeleton="line">
            <LineDefault />
          </ChartStates>
          <ChartStates title="Linear" note="type=linear" skeleton="line">
            <LineLinear />
          </ChartStates>
          <ChartStates title="Step" note="type=step" skeleton="line">
            <LineStep />
          </ChartStates>
          <ChartStates title="Multi-series" note="three lines, three tokens" skeleton="line">
            <LineMultiple />
          </ChartStates>
          <ChartStates title="Dots" note="a dot on every point" skeleton="line">
            <LineDots />
          </ChartStates>
          <ChartStates title="Custom dots" note="dot as a render function" skeleton="line">
            <LineDotsCustom />
          </ChartStates>
          <ChartStates title="Dot colours" note="a token per dot" skeleton="line">
            <LineDotsColors />
          </ChartStates>
          <ChartStates title="Label" note="LabelList above the line" skeleton="line">
            <LineLabel />
          </ChartStates>
          <ChartStates title="Custom label" note="LabelList with a render function" skeleton="line">
            <LineLabelCustom />
          </ChartStates>
          <ChartStates title="Interactive" note="series picker, travelling pill" skeleton="line" controls={LineInteractiveControls}>
            <LineInteractive />
          </ChartStates>
        </div>
      ),
      source: `// Ten Line compositions on the shared ChartContainer contract, each a
// zero-prop demo exported from components/ds/charts/line.tsx:
import {
  LineDefault,
  LineDots,
  LineDotsColors,
  LineDotsCustom,
  LineInteractive,
  LineInteractiveControls,
  LineLabel,
  LineLabelCustom,
  LineLinear,
  LineMultiple,
  LineStep,
} from "@/components/ds/charts/line";

<LineDefault />    {/* dot={false} */}
<LineLinear />     {/* type="linear" */}
<LineStep />       {/* type="step" */}
<LineMultiple />   {/* three lines, three tokens */}
<LineDots />       {/* a dot on every point */}
<LineDotsCustom /> {/* dot as a render function */}
<LineDotsColors /> {/* a token per dot */}
<LineLabel />      {/* LabelList above the line */}
<LineLabelCustom />{/* LabelList with a render function */}

// LineInteractive's series picker is a second export, mounted in
// ChartStates' controls slot so it renders in every state:
<ChartStates title="Interactive" skeleton="line" controls={LineInteractiveControls}>
  <LineInteractive />
</ChartStates>

// LineDefault itself, for the shape every variant above shares:
function LineDefault() {
  const motion = useChartMotion();
  return (
    <ChartContainer config={{ desktop: { label: "Desktop", color: "var(--color-chart-1)" } }} className="h-64 w-full">
      <LineChart accessibilityLayer data={monthsDesktop} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} {...motion} />
        <Line dataKey="desktop" type="natural" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} {...motion} />
      </LineChart>
    </ChartContainer>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Props specific to the three cartesian families. ChartContainer, ChartTooltipContent and ChartLegendContent are documented once, on the chart item page.",
      blocks: [
        {
          label: "Area",
          body: (
            <Meta
              items={[
                {
                  k: "type",
                  v: "natural · monotone · linear · step. natural and monotone both refuse to overshoot a data point, which linear cannot promise once the curve is smoothed. Pick step for anything that genuinely changes in jumps.",
                },
                {
                  k: "stackId",
                  v: "Any shared string stacks the areas that carry it. Order matters: the first Area is drawn at the bottom of the stack.",
                },
                {
                  k: "fillOpacity",
                  v: "Opacity is not one of the five token families, so a fade is written plainly. The colour underneath it is still the token.",
                },
                {
                  k: "Gradient",
                  v: 'A <linearGradient> inside <defs>, referenced as fill="url(#id)". Give the id a page-unique prefix; two charts sharing one id share one gradient.',
                },
              ]}
            />
          ),
        },
        {
          label: "Bar",
          body: (
            <>
              <Meta
                items={[
                  {
                    k: "layout",
                    v: "horizontal (default) or vertical. vertical is the one that draws horizontal bars: it names the axis the CATEGORIES run along, not the direction the bars point.",
                  },
                  {
                    k: "XAxis / YAxis type",
                    v: "number or category. Swapping the layout means swapping these too — the horizontal specimen sets XAxis type=number and YAxis type=category.",
                  },
                  {
                    k: "stackId",
                    v: "Same rule as Area. Without one, bars sit side by side in a group.",
                  },
                  {
                    k: "CartesianGrid",
                    v: "vertical={false} for a vertical bar chart, horizontal={false} for a rotated one — the gridlines you want are the ones crossing the bars, not running along them.",
                  },
                  {
                    k: "hide",
                    v: "On an axis, keeps the scale and drops the labels. The horizontal specimen hides its value axis because the tooltip already carries the number.",
                  },
                ]}
              />
              <Note tone="action" title="Why these bars have square corners" className="mt-4">
                Recharts takes a bar&rsquo;s corner radius as a number of
                pixels — <Code>radius</Code> is typed <Code>RectRadius</Code>,
                a number or four of them, with no string form. Writing{" "}
                <Code>radius=&#123;6&#125;</Code> restates{" "}
                <Code>--radius-sm</Code> as a literal, in a prop no guard
                reads — the same failure the Animation section on the{" "}
                <Code>chart</Code> page is about. It could be read off the
                stylesheet exactly as the duration is; that is simply a hook
                this system does not have yet. Until it exists the bars are
                square, and that is a decision rather than an omission.
              </Note>
            </>
          ),
        },
        {
          label: "Line",
          body: (
            <Meta
              items={[
                {
                  k: "dot",
                  v: "false, true, an object of SVG props, or a render function. Turn dots on when the reader is meant to read individual points; leave them off when the shape is the message and the points are noise.",
                },
                {
                  k: "activeDot",
                  v: "The dot the tooltip highlights. Left at Recharts' default here — overriding it means typing a radius in pixels.",
                },
                {
                  k: "stroke",
                  v: "The series colour. Lines have no fill, so this is the only place the token appears — and it is what the legend swatch and the tooltip indicator both read back.",
                },
                {
                  k: "connectNulls",
                  v: "Off by default, and usually right: a gap in the data should look like a gap. Turn it on only when the missing point is known to be missing rather than unknown.",
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
        "Every specimen above carries its own Empty · Loading · Error · Ready switch through ChartStates — the shared architecture is documented on the chart item page.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Coverage",
                  v: "30 variants: Area 10 · Bar 10 · Line 10 — every cartesian chart in shadcn's registry, probed rather than remembered.",
                },
                {
                  k: "Skeleton shapes",
                  v: "A sloped band for Area, bar rectangles for Bar, a polyline for Line — each drawn at the plot's real footprint (256px), so choosing a state never moves the panel.",
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
        "N/A as a separate section here. The accessible name and role, the axis-tick contrast findings and the pie-label finding all belong to the shared ChartContainer and are measured and reported once, on the chart item page, so the same figures are never restated three times.",
      blocks: [
        { body: <p className="type-small text-muted-foreground">N/A — see description above.</p> },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Two independent controls appear on these specimens: the Empty · Loading · Error · Ready switch every specimen carries, and the interactive variants' own range or series picker.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "State switch (ToggleGroup)",
                  v: "Tab moves focus to the group. Arrow Left / Right (or Up / Down) moves the selection among Empty, Loading, Error and Ready. Space / Enter activates the focused option.",
                },
                {
                  k: "Interactive range picker",
                  v: "Area and Line's interactive variants use a native Select — Enter or Space opens it, Arrow keys move the highlighted option, Enter commits, Escape closes without changing the range.",
                },
                {
                  k: "Interactive series picker",
                  v: "Bar's interactive variant uses clickable totals acting as a single-select ToggleGroup — same Arrow-key travel as the state switch.",
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
        "N/A as a separate section here. Sizing is governed by the shared ResponsiveContainer and the PLOT footprint constant, both documented once on the chart item page; the cartesian families introduce no responsive behaviour of their own.",
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
