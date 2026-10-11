import {
  TooltipAdvanced,
  TooltipDefault,
  TooltipFormatter,
  TooltipIcons,
  TooltipIndicatorLine,
  TooltipIndicatorNone,
  TooltipLabelCustom,
  TooltipLabelFormatter,
  TooltipLabelNone,
} from "@/components/ds/charts/tooltip";
import { CodeBlock } from "@/components/ds/code-block";
import { ChartStates } from "@/components/ds/charts/state";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, DoDont, Meta, Note, Panel } from "@/components/ds/kit";

import { ChartShowcase } from "./chart-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "chart",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Three real controls over one chart: switch the range, click a series in the legend to hide it, hover the plot for the tooltip. Recharts' own <svg> carries no role and no accessible name — ChartContainer turns it into role=\"img\" the moment it is given aria-label, which is why this scene names and describes itself below.",
      render: (
        <Panel label="ChartContainer" note="range switch · legend toggle · hover">
          <ChartShowcase />
        </Panel>
      ),
      source: `import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useChartMotion } from "@/components/ds/chart-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const config = {
  desktop: { label: "Desktop", color: "var(--color-chart-1)" },
  mobile: { label: "Mobile", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

function Trend() {
  const motion = useChartMotion();
  const [range, setRange] = useState<"90d" | "30d" | "7d">("90d");
  // hidden: Set<"desktop" | "mobile">, toggled by clicking a legend button —
  // each button sets Recharts' own \`hide\` prop on the Area it names.
  const [hidden, setHidden] = useState(new Set<keyof typeof config>());

  const data = useMemo(() => filterByRange(dailyVisits, range), [range]);

  return (
    <>
      {/* Legend: real buttons reading the same ChartConfig the chart does. */}
      {Object.entries(config).map(([key, entry]) => (
        <Button key={key} variant="outline" size="sm" onClick={() => toggle(key)} aria-pressed={!hidden.has(key)}>
          <span style={{ backgroundColor: hidden.has(key) ? "var(--color-muted-foreground)" : entry.color }} />
          {entry.label}
        </Button>
      ))}
      <Select value={range} onValueChange={setRange}>
        <SelectTrigger aria-label="Select a range"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="90d">Last 3 months</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
        </SelectContent>
      </Select>

      <ChartContainer config={config} aria-label="Desktop and mobile visitors" className="h-64 w-full">
        <AreaChart data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} {...motion} />
          <Area dataKey="mobile" type="natural" fill="var(--color-chart-2)" stroke="var(--color-chart-2)" hide={hidden.has("mobile")} {...motion} />
          <Area dataKey="desktop" type="natural" fill="var(--color-chart-1)" stroke="var(--color-chart-1)" hide={hidden.has("desktop")} {...motion} />
        </AreaChart>
      </ChartContainer>
    </>
  );
}`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          The registry resolves <Code>chart</Code> alongside the foundation
          and <Code>recharts</Code>; it is not an advertised install target on
          its own because every plot family depends on it. Installing{" "}
          <Code>chart-cartesian</Code>, <Code>chart-polar</Code> or a family
          component brings it in at the right version.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "A config naming each series, and a container that gives the plot its accessible name and its reading in words.",
      language: "tsx",
      code: `import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 5100 },
];

const config = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

<ChartContainer
  config={config}
  aria-label="Monthly revenue"
  description="Revenue rose from $4,200 in January to $5,100 in March."
  className="h-64"
>
  <LineChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Line dataKey="revenue" stroke="var(--color-chart-1)" dot={false} />
  </LineChart>
</ChartContainer>`,
    },
    {
      kind: "disclosure",
      id: "tokens",
      title: "Chart tokens",
      description:
        "Declared once per theme in app/globals.css, and mirrored between them on purpose: 2 and 3 swap, and so do 4 and 5, so the reading order of a stack survives the theme flip instead of inverting with it. There is no sixth token, and adding one needs a written reason.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "--chart-1",
                  v: "Action. The primary series in both themes — the one the reader is meant to follow.",
                },
                {
                  k: "--chart-2",
                  v: "Action, one step away. Dark in light mode, bright in dark mode — mirrored so the second series stays the second-loudest on either surface.",
                },
                {
                  k: "--chart-3",
                  v: "Action, the other step. Bright in light mode, dark in dark mode.",
                },
                {
                  k: "--chart-4",
                  v: "Value. The lime ramp enters here, which is why a fourth series reads as a different kind of quantity rather than a fourth shade of the same one.",
                },
                {
                  k: "--chart-5",
                  v: "Value, one step away. Mirrored between the themes exactly as 2 and 3 are.",
                },
              ]}
            />
          ),
        },
        {
          body: (
            <p className="type-small text-muted-foreground">
              Series colours name <Code>var(--color-chart-1)</Code> …{" "}
              <Code>-5</Code> directly, in data and in a{" "}
              <Code>ChartConfig</Code> alike. shadcn&rsquo;s own{" "}
              <Code>ChartStyle</Code> mints a per-container{" "}
              <Code>--color-&lt;seriesKey&gt;</Code> so one config can carry a
              light value and a dark one; this system does not need that
              second layer, because <Code>--chart-1</Code> …{" "}
              <Code>-5</Code> are already declared once in each theme block. A
              fill naming a per-series indirection copied from a shadcn
              example reaches a custom property that exists only inside a
              runtime-injected <Code>&lt;style&gt;</Code> tag —{" "}
              <Code>check:refs</Code> reports it as undeclared, and is right
              to.
            </p>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "tooltips",
      title: "Tooltips",
      description:
        "ChartTooltip re-exports Recharts' Tooltip unchanged; pass content={<ChartTooltipContent />} or it renders Recharts' stock panel, which is on none of these tokens.",
      label: "ChartTooltipContent",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartStates title="Default" note="ChartTooltipContent, dot indicator" skeleton="tooltip">
            <TooltipDefault />
          </ChartStates>
          <ChartStates title="Line indicator" note="indicator=line" skeleton="tooltip">
            <TooltipIndicatorLine />
          </ChartStates>
          <ChartStates title="No indicator" note="hideIndicator" skeleton="tooltip">
            <TooltipIndicatorNone />
          </ChartStates>
          <ChartStates title="Custom label" note="labelKey plus a config label" skeleton="tooltip">
            <TooltipLabelCustom />
          </ChartStates>
          <ChartStates title="Label formatter" note="labelFormatter" skeleton="tooltip">
            <TooltipLabelFormatter />
          </ChartStates>
          <ChartStates title="No label" note="hideLabel" skeleton="tooltip">
            <TooltipLabelNone />
          </ChartStates>
          <ChartStates title="Formatter" note="formatter render function" skeleton="tooltip">
            <TooltipFormatter />
          </ChartStates>
          <ChartStates title="Icons" note="config icons in the rows" skeleton="tooltip">
            <TooltipIcons />
          </ChartStates>
          <ChartStates title="Advanced" note="formatter with a running total" skeleton="tooltip">
            <TooltipAdvanced />
          </ChartStates>
        </div>
      ),
      source: `import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartMotion } from "@/components/ds/chart-motion";

const data = [
  { date: "2024-06-03", running: 275, swimming: 180 },
  { date: "2024-06-04", running: 200, swimming: 220 },
  { date: "2024-06-05", running: 187, swimming: 90 },
  { date: "2024-06-06", running: 173, swimming: 250 },
  { date: "2024-06-07", running: 90, swimming: 130 },
  { date: "2024-06-08", running: 60, swimming: 200 },
];

const config = {
  running: { label: "Running", color: "var(--color-chart-1)" },
  swimming: { label: "Swimming", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const tickWeekday = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { weekday: "short" });

// Every variant shares this shape — only the ChartTooltip/ChartTooltipContent
// configuration differs. Shown here as \`ChartTooltip content={...}\`, the same
// slot every variant below plugs into.
function Activity({ children }: { children: React.ReactNode }) {
  const motion = useChartMotion();
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={tickWeekday} />
        {children}
        <Bar dataKey="running" stackId="a" fill="var(--color-chart-1)" radius={[0, 0, 6, 6]} {...motion} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} {...motion} />
      </BarChart>
    </ChartContainer>
  );
}

// Default — dot indicator
<Activity>
  <ChartTooltip content={<ChartTooltipContent />} cursor={false} defaultIndex={1} />
</Activity>

// Line indicator
<Activity>
  <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} defaultIndex={1} />
</Activity>

// No indicator
<Activity>
  <ChartTooltip content={<ChartTooltipContent hideIndicator />} cursor={false} defaultIndex={1} />
</Activity>

// Custom label — labelKey routes to a config entry the datum has no field for
<Activity>
  <ChartTooltip
    content={<ChartTooltipContent labelKey="activities" indicator="line" />}
    cursor={false}
    defaultIndex={1}
  />
</Activity>

// Label formatter
<Activity>
  <ChartTooltip
    content={
      <ChartTooltipContent
        labelFormatter={(value) =>
          new Date(value as string).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
        }
      />
    }
    cursor={false}
    defaultIndex={1}
  />
</Activity>

// No label
<Activity>
  <ChartTooltip content={<ChartTooltipContent hideIndicator hideLabel />} cursor={false} defaultIndex={1} />
</Activity>

// Formatter — bypasses the default row entirely
<Activity>
  <ChartTooltip
    content={
      <ChartTooltipContent
        hideLabel
        formatter={(value, name) => (
          <div className="flex min-w-32 items-center type-small text-muted-foreground">
            {config[name as keyof typeof config]?.label ?? name}
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
  />
</Activity>

// Icons — a config entry carrying \`icon: ComponentType\` renders it in the
// indicator slot in place of the colour swatch; ChartTooltipContent itself
// takes no icon prop
const iconConfig = {
  running: { ...config.running, icon: RunningIcon },
  swimming: { ...config.swimming, icon: SwimmingIcon },
} satisfies ChartConfig;

<ChartContainer config={iconConfig} className="h-64 w-full">
  <Activity>
    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} defaultIndex={1} />
  </Activity>
</ChartContainer>

// Advanced — formatter with a running total after the last row
<Activity>
  <ChartTooltip
    content={
      <ChartTooltipContent
        hideLabel
        className="w-44"
        formatter={(value, name, item, index) => (
          <>
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-xs"
              style={{ backgroundColor: name === "running" ? "var(--color-chart-1)" : "var(--color-chart-2)" }}
            />
            {config[name as keyof typeof config]?.label ?? name}
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
  />
</Activity>`,
    },
    {
      kind: "disclosure",
      id: "tooltips-legends-api",
      title: "Tooltips & legends",
      description:
        "The two pieces of a chart that are made of text, and therefore the two that answer to the content rules everything else does.",
      blocks: [
        {
          body: (
            <Note tone="action" title="ChartConfig is what makes a tooltip readable">
              Without it a tooltip row says the raw data key — <Code>sealed</Code>,
              say — because that is what is in the data.{" "}
              <Code>ChartConfig</Code> maps every series key to a{" "}
              <Code>label</Code> and a <Code>color</Code>, and both{" "}
              <Code>ChartTooltipContent</Code> and{" "}
              <Code>ChartLegendContent</Code> read it out of context. It is the
              one piece of a chart worth writing before the chart itself.
            </Note>
          ),
        },
        {
          label: "Props",
          body: (
            <Meta
              items={[
                {
                  k: "ChartTooltipContent indicator",
                  v: "dot (default) · line · dashed. dashed conventionally marks a projection — do not spend it on a plain second series.",
                },
                {
                  k: "hideLabel / hideIndicator",
                  v: "hideLabel drops the header row, right when the category is already on the axis under the cursor. hideIndicator drops the colour chip.",
                },
                {
                  k: "nameKey / labelKey",
                  v: "Which field to look up in the config. Pies and radial bars almost always need nameKey, because their series key is the value and their name lives on the datum.",
                },
                {
                  k: "formatter",
                  v: "Takes (value, name, item, index, payload). Use it for currency and units — a bare number in a tooltip is the most common way a chart is misread.",
                },
                {
                  k: "ChartLegend / ChartLegendContent",
                  v: "Recharts' Legend, re-exported; content={<ChartLegendContent />} or it renders unstyled. hideIcon and nameKey are its own props, plus Recharts' payload and verticalAlign. Renders nothing until Recharts supplies a payload. Live Legend specimens are on the chart-cartesian and chart-polar pages, each beside the family that demonstrates it.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "animation",
      title: "Animation",
      description:
        "Every other component in this system declares its motion as a class, which check:tokens can read. Recharts takes a duration as a number and an easing as a string, so neither is visible to that guard — this is the one place in the system where the token rule is upheld by reading the stylesheet at runtime rather than by writing a utility.",
      blocks: [
        {
          body: (
            <Note tone="action" title="The guard is the enforcement, not the rule">
              <Code>check:tokens</Code> scans classNames and CSS. A bare
              JavaScript number in a JSX prop slips past it completely. That
              does not make it allowed —{" "}
              <Code>animationDuration=&#123;800&#125;</Code> typed into a
              chart passes every guard in this repository and is still a
              violation. <Code>components/ds/chart-motion.ts</Code> exists to
              make the right thing the easy thing: call{" "}
              <Code>useChartMotion()</Code>, spread the result onto every
              animated element, and there is no number left to type.
            </Note>
          ),
        },
        {
          label: "Usage",
          body: (
            <CodeBlock
              code={`const motion = useChartMotion();
<Bar dataKey="sealed" {...motion} />
<ChartTooltip content={<ChartTooltipContent />} {...motion} />`}
              language="tsx"
              className="rounded-lg border border-border"
            />
          ),
        },
        {
          label: "What the hook resolves",
          body: (
            <Meta
              items={[
                {
                  k: "animationDuration",
                  v: "Read live from --duration-slow via getComputedStyle, through useSyncExternalStore — not --duration-normal (a control length that reads as a flicker across a 400px plot), not --duration-open (an overlay entrance, not data) and not --duration-bloom (light).",
                },
                {
                  k: "animationEasing",
                  v: 'The keyword "ease-out", not the token\'s own cubic-bezier() value. Recharts\' AnimationTiming type (node_modules/recharts/types/util/types.d.ts) is five keywords only for Area, Line, Pie, Radar, RadialBar and Tooltip; a string read back from getComputedStyle is not assignable to it. Bar alone accepts a wider EasingInput, whose only string form is a template literal that admits no spaces — --ease-enter\'s value has three. So the duration is read from the system and the curve is not; "ease-out" names the token without copying its value, and the two curves visibly differ.',
                },
                {
                  k: "isAnimationActive",
                  v: "false the instant prefers-reduced-motion is reduce, without a reload — resolved in the hook rather than left to Recharts' own auto default, because passing a boolean (as every shadcn example does) stops Recharts' own reduced-motion handling, and the hook needs the preference anyway to decide whether a duration is worth reading.",
                },
              ]}
            />
          ),
        },
        {
          body: (
            <Note tone="error" title="What animation hides, measured rather than assumed">
              Recharts animates by interpolating the geometry it draws, so a
              bar starts at zero height and arrives at its value — for the
              length of the animation the chart shows a number the data does
              not contain. Measured on this family&rsquo;s specimens in a tab
              where <Code>requestAnimationFrame</Code> never fires: with
              animation on, 0 of 84 bar rectangles had a path and every pie was
              empty; with <Code>isAnimationActive: false</Code>, all 84 were
              present at their exact data ratios on the first frame. That
              second half is the real result — the geometry is complete on the
              first frame with nothing running. The first half only proves that
              a backgrounded, hidden or throttled tab shows an empty chart for
              as long as its frames stay suspended; it is not evidence that a
              working, foregrounded screen fails.
            </Note>
          ),
        },
        {
          body: (
            <Note tone="value" title="The tooltip takes the same motion, and its default only looked right">
              Recharts&rsquo; own default for <Code>Tooltip</Code> is{" "}
              <Code>animationDuration: 400</Code> — exactly what{" "}
              <Code>--duration-slow</Code> is worth today, which is a
              coincidence rather than a guarantee. Without{" "}
              <Code>{"{...motion}"}</Code> the tooltip would keep animating at
              the right length while reading it out of{" "}
              <Code>node_modules</Code> instead of the stylesheet — nothing
              would fail the day the token moved, the tooltip would simply stop
              agreeing with the chart it belongs to.
            </Note>
          ),
        },
        {
          body: (
            <Note tone="value" title="Two SSR fallbacks restate token values, on purpose">
              <Code>chart-motion.ts</Code> carries a millisecond constant
              (400) and the easing keyword as server fallbacks. §0 would
              normally forbid restating a token, but{" "}
              <Code>getComputedStyle</Code> does not exist on the server, and
              without them a chart renders nothing at all until hydration —
              worse than a duplicated constant. They are unreachable in a
              browser: the live store getters win the moment there is a{" "}
              <Code>document</Code>.
            </Note>
          ),
        },
        {
          body: (
            <DoDont
              dos={[
                "Call useChartMotion() once per specimen and spread the whole result onto every animated element in it.",
                "Read a timing out of the stylesheet whenever a library takes it as a number rather than a class.",
                "Say on the page when a token could not be threaded through a library's types, and what was passed instead.",
              ]}
              donts={[
                "Don't type animationDuration={800}. It passes every guard in this repository and is still a violation.",
                "Don't cast the token's cubic-bezier through `as` to satisfy the type — that is a claim about a parser never tested.",
                "Don't assume the global reduced-motion rule covers a chart. It animates in JavaScript; CSS never sees it.",
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "ChartContainer",
          body: (
            <Meta
              items={[
                {
                  k: "config",
                  v: "Required. A ChartConfig — a record mapping each series key to a label and either a color or a light/dark theme pair. Read by ChartTooltipContent and ChartLegendContent.",
                },
                {
                  k: "children",
                  v: "Required. One Recharts chart element (LineChart, BarChart, AreaChart, PieChart, RadarChart, RadialBarChart …), rendered inside a ResponsiveContainer.",
                },
                {
                  k: "aria-label / aria-labelledby",
                  v: 'What the chart is. Setting either turns the container into role="img" — an unnamed chart stays a plain, unlabelled <div> on purpose.',
                },
                {
                  k: "description",
                  v: "What the chart says, in words. Rendered sr-only and wired to the container with aria-describedby; only takes effect once the chart is named.",
                },
                {
                  k: "id / initialDimension",
                  v: "id seeds the per-chart CSS scope (chart-<id>). initialDimension is the server-rendered fallback size for ResponsiveContainer, defaulting to 320×200.",
                },
                {
                  k: "...props",
                  v: "Forwarded to the root <div> (data-slot=\"chart\"), including aria-hidden for a caller-opted-in decorative sparkline.",
                },
              ]}
            />
          ),
        },
        {
          label: "Other exports",
          body: (
            <Meta
              items={[
                { k: "ChartTooltip", v: "Recharts' Tooltip, re-exported unchanged." },
                { k: "ChartTooltipContent", v: "See Tooltips & legends above." },
                { k: "ChartLegend", v: "Recharts' Legend, re-exported unchanged." },
                { k: "ChartLegendContent", v: "See Tooltips & legends above." },
                {
                  k: "ChartStyle",
                  v: "Internal. Mints a --color-<seriesKey> custom property per container from a ChartConfig's theme field. Unused by this system's own specimens, which name --color-chart-1 … -5 directly — see Chart tokens.",
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
        "Every chart specimen in this family carries its own Empty · Loading · Error · Ready switch, through ChartStates in components/ds/charts/state.tsx — a shared architecture, not a per-chart reimplementation.",
      blocks: [
        {
          body: (
            <Note tone="action" title="The skeleton is the chart, with the data taken out">
              A skeleton is drawn per family shape — a sloped band for Area,
              bars for Bar, a polyline for Line, a ring for Pie, a polygon for
              Radar, concentric arcs for Radial, a plot plus a floating frame
              for Tooltip — at the plot&rsquo;s real footprint, so the box does
              not move when the state changes. Interactive variants that carry
              their own control strip (a range picker, a series toggle) hoist
              that strip out of the swapped slot via the{" "}
              <Code>controls</Code> prop, so choosing a state never grows the
              panel.
            </Note>
          ),
        },
        {
          label: "ChartStates props",
          body: (
            <Meta
              items={[
                { k: "title / note", v: "The variant's name and a second line, rendered in the panel's label and meta slots." },
                { k: "skeleton", v: "area | bar | line | pie | radar | radial | tooltip. Picks the shape drawn during Loading." },
                {
                  k: "error",
                  v: "A real seam, not a drawn replica: the toggle puts the panel into failure, and Try again returns it to Ready — the journey a real refetch makes. Renders Alert, not Empty, because a series that failed is a different claim from a series with no rows.",
                },
                {
                  k: "controls",
                  v: "A component type wrapping the state slot, for a specimen's own control strip. Used by the interactive variants on chart-cartesian and chart-polar.",
                },
              ]}
            />
          ),
        },
        {
          body: (
            <p className="type-small text-muted-foreground">
              Family coverage — how many variants of each shape carry this
              switch — is reported on the page that owns that shape:{" "}
              <Code>chart-cartesian</Code> for Area, Bar and Line,{" "}
              <Code>chart-polar</Code> for Pie, Radar and Radial, and{" "}
              <Code>chart-geometry</Code> for Unit activity and Conversion
              funnel.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "A chart is a picture of numbers. Until it is named, it is nothing at all to anything that is not a pair of eyes.",
      blocks: [
        {
          body: (
            <Note tone="error" title="Writing aria-label on the stock container made it worse, not better">
              <p>
                Recharts&rsquo; own <Code>&lt;svg&gt;</Code> carries no role
                and no accessible name, so <Code>ChartContainer</Code>{" "}
                rendered as an unlabelled <Code>&lt;div&gt;</Code> full of
                unlabelled graphics. A caller who did the obvious thing and
                wrote <Code>aria-label</Code> on it got an axe violation
                rather than a name: <Code>aria-label</Code> on a{" "}
                <Code>&lt;div&gt;</Code> with no role is a prohibited
                attribute.
              </p>
              <p className="mt-3">
                The role now follows the name. Pass <Code>aria-label</Code>{" "}
                (or <Code>aria-labelledby</Code>) and the container becomes{" "}
                <Code>role=&quot;img&quot;</Code>, the right semantic for a
                picture, which also stops a screen reader reading axis ticks as
                a run of loose numbers. Pass <Code>description</Code> and the
                reading is rendered <Code>sr-only</Code> and wired up with{" "}
                <Code>aria-describedby</Code> — no information may exist only
                inside a drawing, the same rule that governs animation.
              </p>
              <p className="mt-3">
                An <em>unnamed</em> chart is deliberately left alone: a plain{" "}
                <Code>&lt;div&gt;</Code>, no role, no{" "}
                <Code>aria-hidden</Code>. Forcing{" "}
                <Code>role=&quot;img&quot;</Code> would make a caller&rsquo;s
                real axis text presentational without them asking, and forcing{" "}
                <Code>aria-hidden</Code> would delete it. A decorative
                sparkline says so itself.
              </p>
            </Note>
          ),
        },
        {
          body: (
            <Note tone="error" title="Two live AA failures in chart text, found by rasterising rendered pixels">
              Both were invisible to every guard in the repository, because
              Recharts writes the colour as an inline <Code>fill</Code>{" "}
              attribute on the SVG, and a rasterised <Code>color-mix()</Code>{" "}
              read as text parses as <Code>oklab()</Code>, not RGB.
              <span className="mt-3 block">
                <strong>Axis labels were not on a token at all.</strong>{" "}
                <Code>chart.tsx</Code> carries a selector for{" "}
                <Code>.recharts-cartesian-axis-tick text</Code>, and Recharts
                3.8 renders the label inside a{" "}
                <Code>.recharts-cartesian-axis-tick-label</Code> group with the
                class <Code>.recharts-cartesian-axis-tick-value</Code> on the{" "}
                <Code>&lt;text&gt;</Code>. The old selector matched nothing, so
                every axis label kept Recharts&rsquo; own default grey — 3.46:1
                in dark, 5.74:1 in light on <Code>--background</Code> — and the
                polar ticks kept a different default, 5.04:1 dark and 3.95:1
                light. Each theme failed AA on one of the two. On{" "}
                <Code>--muted-foreground</Code> they now measure{" "}
                <strong>13.46:1 dark and 4.83:1 light</strong>. A third family,
                the polar radius axis, had no selector at all and would have
                inherited 1.61:1 in light — the worst figure found — the day
                any specimen first showed its radius ticks; it is now covered
                pre-emptively by the same three-selector fix, targeting the
                class rather than Recharts&rsquo; literal colour value, so a
                future Recharts release that ships a different grey stays
                covered.
              </span>
              <span className="mt-3 block">
                <strong>Pie labels took their slice&rsquo;s colour.</strong>{" "}
                Against <Code>--background</Code> the five chart tokens measure{" "}
                <strong>4.34 · 10.75 · 1.88 · 13.19 · 3.98</strong> in dark and{" "}
                <strong>4.58 · 10.58 · 1.85 · 4.99 · 1.51</strong> in light.
                Three of five fail as text in dark, two in light. A fill is not
                text and is not held to that threshold, which is exactly why a
                chart token must not be reused as a label colour — the labelled
                Pie variant sets <Code>--foreground</Code> for its label instead
                and keeps the slice colour on the leader line only.
              </span>
            </Note>
          ),
        },
        {
          label: "Props",
          body: (
            <Meta
              items={[
                {
                  k: "aria-label",
                  v: 'What the chart is. Setting it turns the container into role="img". Every chart that carries meaning takes one.',
                },
                {
                  k: "description",
                  v: "What the chart says, in words. Rendered sr-only and pointed at with aria-describedby. Only applies once the chart is named.",
                },
                {
                  k: "aria-hidden",
                  v: "For a genuinely decorative sparkline. The caller opts in; the component never hides a chart on its own.",
                },
                {
                  k: "Axis ticks",
                  v: "--muted-foreground, through the three -value selectors above.",
                },
              ]}
            />
          ),
        },
        {
          body: (
            <DoDont
              dos={[
                "Give every chart that carries meaning an aria-label saying what it is.",
                "Add a description with the reading — the trend, the extremes, the totals.",
                "Keep the exact figures as real text somewhere on the page, not only inside the plot.",
                "Mark a purely decorative sparkline aria-hidden yourself.",
              ]}
              donts={[
                "Don't leave a chart unnamed and assume the axis labels carry it; they read as loose numbers.",
                "Don't put aria-label on a container that has no role — it is a violation, not a name.",
                "Don't describe the chart's appearance. Describe what the data does.",
                "Don't rely on colour alone to separate series; the legend names them.",
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "N/A on this page. ChartContainer renders no focusable control of its own — a plot is either a static picture or, once named, an image. Every focusable element in this family belongs to a specimen (a ToggleGroup state switch, an interactive range picker), documented on chart-cartesian and chart-polar where those specimens live.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">N/A — see description above.</p>
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
                  k: "ResponsiveContainer",
                  v: "ChartContainer always wraps its children in Recharts' ResponsiveContainer, which measures its parent and redraws on resize. There is no breakpoint prop; a chart's width comes from its layout, not from a size variant.",
                },
                {
                  k: "initialDimension",
                  v: "320×200 by default — the server-rendered fallback before ResponsiveContainer can measure the real parent on the client.",
                },
                {
                  k: "PLOT",
                  v: "This system's specimens set a shared footprint (h-64 w-full, from components/ds/charts/data.ts) on every ChartContainer so a chart, its Loading skeleton and its Empty state all occupy the identical box — see States.",
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
