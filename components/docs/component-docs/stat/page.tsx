import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Stat, StatDeltaMark } from "@/components/ui/stat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RevenueSimulator } from "./stat-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "stat",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Press \"Simulate a sale\" and watch a real figure move: the exact loading → ready cycle the Usage snippet below documents, run live. A labelled figure, an optional delta against a previous period, and an optional trailing hint — it draws no container of its own, so it composes into a Card, a Panel, a table cell or a page header without a second surface appearing inside the first.",
      render: <RevenueSimulator />,
      source: `const [revenue, setRevenue] = useState(12480);
const [deltaPct, setDeltaPct] = useState(8.2);
const [state, setState] = useState<StatState>("ready");

function simulateSale() {
  setState("loading");
  setTimeout(() => {
    const sale = 20 + Math.floor(Math.random() * 180);
    setRevenue((r) => r + sale);
    setDeltaPct((d) => d + sale / 400);
    setState("ready");
  }, 550);
}

<Stat
  label="Revenue"
  value={money.format(revenue)}
  delta={{ value: \`\${deltaPct.toFixed(1)}%\`, direction: "up" }}
  hint="vs last month"
  state={state}
/>
<Button onClick={simulateSale} disabled={state === "loading"}>
  {state === "loading" ? "Selling…" : "Simulate a sale"}
</Button>`,
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
        "The live pattern: a stat that refetches on demand. state comes from wherever the figure lives (a query hook, local state) — Stat itself is a pure render of whatever state you hand it, uncontrolled by nothing more than its own props.",
      language: "tsx",
      code: `"use client";

import { useState } from "react";
import { Stat, type StatState } from "@/components/ui/stat";
import { Button } from "@/components/ui/button";

export function RevenueCard() {
  const [state, setState] = useState<StatState>("ready");

  function reload() {
    setState("loading");
    fetchRevenue().then(() => setState("ready"));
  }

  return (
    <>
      <Stat
        label="Revenue"
        value="$12,480"
        delta={{ value: "8.2%", direction: "up" }}
        hint="vs last month"
        state={state}
      />
      <Button onClick={reload} disabled={state === "loading"}>
        Reload
      </Button>
    </>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Direction survives colour blindness because it is carried three ways before colour is considered: the glyph's shape, the sign written onto the number, and a visually hidden word. Colour is the fourth signal, and it is deliberately not a red/green pair — the favourable direction is success-ink, the unfavourable one is plain text-foreground, exactly as RULES §1.4 renders money leaving a wallet. A dip is not an error, so it is never destructive red.",
      label: "Direction survives colour blindness",
      render: (
        <div className="space-y-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <Stat
              label="Revenue"
              value="$12,480"
              delta={{ value: "8.2%", direction: "up" }}
              hint="vs last month"
            />
            <Stat
              label="Withdrawals"
              value="$3,120"
              delta={{ value: "4.1%", direction: "down" }}
              hint="vs last month"
            />
            <Stat
              label="Packs opened"
              value="412"
              delta={{ value: "0.0%", direction: "flat" }}
              hint="vs last month"
            />
          </div>
          <Separator />
          <div className="grayscale">
            <div className="grid gap-8 sm:grid-cols-3">
              <Stat
                label="Revenue"
                value="$12,480"
                delta={{ value: "8.2%", direction: "up" }}
                hint="vs last month"
              />
              <Stat
                label="Withdrawals"
                value="$3,120"
                delta={{ value: "4.1%", direction: "down" }}
                hint="vs last month"
              />
              <Stat
                label="Packs opened"
                value="412"
                delta={{ value: "0.0%", direction: "flat" }}
                hint="vs last month"
              />
            </div>
          </div>
          <Note tone="action" title="A coloured arrow is one signal">
            The lower row is the same markup with every hue removed (
            <Code>grayscale</Code>), and it still reads. Direction is carried
            by the glyph&rsquo;s shape, by the sign the component writes onto
            the number, and by a visually hidden word for assistive tech.
            Colour is the fourth signal, not the first.
          </Note>
        </div>
      ),
      source: `<div className="grid gap-8 sm:grid-cols-3">
  <Stat
    label="Revenue"
    value="$12,480"
    delta={{ value: "8.2%", direction: "up" }}
    hint="vs last month"
  />
  <Stat
    label="Withdrawals"
    value="$3,120"
    delta={{ value: "4.1%", direction: "down" }}
    hint="vs last month"
  />
  <Stat
    label="Packs opened"
    value="412"
    delta={{ value: "0.0%", direction: "flat" }}
    hint="vs last month"
  />
</div>

<Separator />

{/* Same markup again, wrapped in grayscale — direction still reads with every hue removed. */}
<div className="grayscale">
  <div className="grid gap-8 sm:grid-cols-3">
    <Stat
      label="Revenue"
      value="$12,480"
      delta={{ value: "8.2%", direction: "up" }}
      hint="vs last month"
    />
    <Stat
      label="Withdrawals"
      value="$3,120"
      delta={{ value: "4.1%", direction: "down" }}
      hint="vs last month"
    />
    <Stat
      label="Packs opened"
      value="412"
      delta={{ value: "0.0%", direction: "flat" }}
      hint="vs last month"
    />
  </div>
</div>`,
    },
    {
      kind: "showcase",
      id: "delta-in-a-table",
      title: "The delta alone, in a table cell",
      description:
        "A table gives its columns headers, so a whole Stat in a revenue cell would print \"Revenue\" once per row under a heading that already says it. StatDeltaMark is exported so the cell composes the exact same mark instead of redrawing an arrow and a sign by hand. betterWhen is required rather than defaulted on the bare mark — a caller reaching past Stat for it is already thinking about direction.",
      label: "StatDeltaMark in a Table",
      render: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Refund rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Stir in strength</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="type-number-sm text-foreground">$12,180</span>
                  <StatDeltaMark delta={{ value: "16%", direction: "up" }} betterWhen="up" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="type-number-sm text-foreground">1.4%</span>
                  <StatDeltaMark delta={{ value: "0.3%", direction: "up" }} betterWhen="down" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      source: `<StatDeltaMark delta={{ value: "16%", direction: "up" }} betterWhen="up" />`,
    },
    {
      kind: "showcase",
      id: "when-a-stat-navigates",
      title: "When a Stat navigates",
      description:
        "A Stat is not a control and carries no hover, focus or pressed state of its own — applying one would promise an affordance that is not there. When a figure navigates, the wrapper is the control: it takes the surface change on hover, the global focus ring, and press for the press. The container is still a real Card, so the composition this teaches — a Stat inside a Card — is not repainted by hand.",
      label: "Stat inside a navigating wrapper",
      render: (
        <button type="button" className="group press rounded-xl text-left">
          <Card className="group-hover:bg-accent group-hover:ring-action/45 transition-colors duration-fast ease-out">
            <CardContent>
              <Stat
                label="Revenue"
                value="$12,480"
                delta={{ value: "8.2%", direction: "up" }}
                hint="vs last month"
              />
            </CardContent>
          </Card>
        </button>
      ),
      source: `<button type="button" className="group press rounded-xl text-left">
  <Card className="group-hover:bg-accent group-hover:ring-action/45 transition-colors duration-fast ease-out">
    <CardContent>
      <Stat label="Revenue" value="$12,480" delta={{ value: "8.2%", direction: "up" }} hint="vs last month" />
    </CardContent>
  </Card>
</button>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Stat",
          body: (
            <Meta
              items={[
                { k: "label", v: "string. Required." },
                { k: "value", v: "ReactNode. Required." },
                { k: "delta", v: '{ value: string; direction: "up" | "down" | "flat" }. Optional. value is unsigned — the component writes the sign. Pass it while loading too, since its presence is what reserves the delta line and keeps the footprint stable.' },
                { k: "betterWhen", v: '"up" | "down". Default: "up". Which direction earns the favourable colour — set "down" for churn, refunds and latency.' },
                { k: "hint", v: 'string. The trailing comparison, e.g. "vs last month". Replaced by message in the error and empty states.' },
                { k: "state", v: '"ready" | "loading" | "error" | "empty". Default: "ready".' },
                { k: "message", v: "string. What failed, or why there is nothing yet — shown in place of hint when state is \"error\" or \"empty\"." },
                { k: "disabled", v: "boolean. Default: false. Applies opacity-45 and sets aria-disabled / data-disabled." },
                { k: "className", v: "Merged onto the root." },
              ]}
            />
          ),
        },
        {
          label: "StatDeltaMark",
          body: (
            <Meta
              items={[
                { k: "delta", v: "StatDelta. Required." },
                { k: "betterWhen", v: '"up" | "down". Required (unlike Stat\'s own prop, which defaults) — a caller reaching past Stat for the bare mark is already thinking about direction and should say which one it means.' },
              ]}
            />
          ),
        },
        {
          label: "Exported types",
          body: (
            <Meta
              items={[
                { k: "StatDirection", v: '"up" | "down" | "flat".' },
                { k: "StatDelta", v: "{ value: string; direction: StatDirection }." },
                { k: "StatState", v: '"ready" | "loading" | "error" | "empty".' },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "states",
      title: "States",
      description:
        "Only the figure and the delta are skeletons while loading — the label and hint are chrome you already know before the request returns, so they stay real text, which is also what makes the footprint provably identical between states rather than approximately so. The swap into a landed value is one anim-enter event on the arriving content, never a fade out followed by a fade in.",
      label: "state",
      render: (
        <StateGrid cols={5}>
          <StateCell label="rest" note="the figure has landed">
            <Stat
              label="Revenue"
              value="$12,480"
              delta={{ value: "8.2%", direction: "up" }}
              hint="vs last month"
            />
          </StateCell>
          <StateCell label="loading" note="skeleton, same footprint">
            <Stat
              label="Revenue"
              value="$12,480"
              delta={{ value: "8.2%", direction: "up" }}
              hint="vs last month"
              state="loading"
            />
          </StateCell>
          <StateCell label="error" note="what failed">
            <Stat
              label="Revenue"
              value="$12,480"
              delta={{ value: "8.2%", direction: "up" }}
              state="error"
              message="Could not load"
            />
          </StateCell>
          <StateCell label="empty" note="why there is nothing">
            <Stat
              label="Revenue"
              value="$12,480"
              delta={{ value: "8.2%", direction: "up" }}
              state="empty"
              message="No sales this period"
            />
          </StateCell>
          <StateCell label="disabled" note="opacity-45, aria-disabled">
            <Stat
              label="Revenue"
              value="$12,480"
              delta={{ value: "8.2%", direction: "up" }}
              hint="vs last month"
              disabled
            />
          </StateCell>
        </StateGrid>
      ),
      source: `<Stat label="Revenue" value="$12,480" state="loading" delta={{ value: "8.2%", direction: "up" }} hint="vs last month" />
<Stat label="Revenue" value="$12,480" state="error" message="Could not load" delta={{ value: "8.2%", direction: "up" }} />
<Stat label="Revenue" value="$12,480" state="empty" message="No sales this period" delta={{ value: "8.2%", direction: "up" }} />`,
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Direction", v: "StatDeltaMark carries the direction three ways before colour: the glyph's shape (up/down/flat), the sign written onto the number, and a visually-hidden word (sr-only \"Up,\" / \"Down,\" / \"No change,\") for assistive tech." },
                { k: "Blank states", v: "In error and empty, the figure renders an em dash marked aria-hidden, paired with a visually hidden \"No value\" — so assistive tech never reads a bare dash as the number." },
                { k: "disabled", v: "Sets both aria-disabled and data-disabled; opacity-45 is the only visual change, and is contrast-exempt per WCAG 2.1 SC 1.4.3 — disabled content only has to read as unavailable." },
                { k: "Role", v: "None implicit — Stat renders plain <div> and <p> elements. It carries no landmark or live-region role, so a loading→ready transition is not announced on its own; compose one where that matters." },
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
        "Stat is not a control and places no element in the tab sequence.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A. See &ldquo;When a Stat navigates&rdquo; above — a
              navigating figure is a real <Code>{"<button>"}</Code> or link
              wrapped around a Stat, and that wrapper owns Tab / Enter / Space
              behaviour. Stat itself contributes none.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "Stat has no responsive behaviour of its own — it is a fixed-size block of type. The grid arrangement around it (how many columns per row at each breakpoint) is a layout decision made by the page composing it, not by Stat.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A on the component itself. See the Preview specimen&rsquo;s{" "}
              <Code>sm:grid-cols-3</Code> for the caller-owned pattern.
            </p>
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
