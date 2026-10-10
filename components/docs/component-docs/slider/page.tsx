/**
 * Authored documentation page for `slider`.
 *
 * Replaces the generated baseline. Migrated from the old `base/selection`
 * category page. "Range Slider" is not a separate registry item or
 * component — it is Slider configured with a two-entry value array — so it
 * appears here as the Examples specimen rather than its own page, per the
 * category page it came from (`value as an array. Two entries makes it a
 * range.`). Every specimen renders the real `Slider` from
 * `components/ui/slider.tsx`. Prop rows come from that file's own signature
 * (including its non-Radix `thumbLabels` prop) plus the underlying Radix
 * `SliderPrimitive.Root` it forwards props to.
 *
 * Specimens below are uncontrolled (`defaultValue`), matching every other
 * authored spec in this directory — the `ComponentDocPage` shell that renders
 * `spec` is a server component, and a spec module stays plain data rather than
 * becoming its own client boundary. The readout beside each track is real
 * markup, not a live binding, and says so.
 */

import { Slider } from "@/components/ui/slider";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, StateCell, StateGrid } from "@/components/ds/kit";

import { AutoSellSpecimen } from "./slider-auto-sell-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "slider",
  omitted: {
    responsive:
      "Slider has no breakpoint-specific rule in slider.tsx — the track is w-full and reads its length from whatever container it sits in, horizontal or the data-vertical column, at every viewport. The one real cross-device difference is touch-none plus Radix's own pointer handling, which is a pointer-model concern rather than a layout one, and is unaffected by width.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Ranges where the exact number matters less than the feel. Drag the floor — the readout is always money, not a bare percentage, and a badge names which rarity band it currently covers.",
      label: "Auto-sell floor",
      render: <AutoSellSpecimen />,
      source: `"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const BANDS = [
  { max: 20, label: "Common only", variant: "outline" },
  { max: 60, label: "Rare and below", variant: "secondary" },
  { max: 90, label: "Epic and below", variant: "action" },
  { max: 100, label: "Everything", variant: "premium" },
];
const MAX_VALUE = 500;

export function AutoSellSpecimen() {
  const [floor, setFloor] = useState([35]);
  const pct = floor[0];
  const band = useMemo(() => BANDS.find((b) => pct <= b.max) ?? BANDS.at(-1), [pct]);

  return (
    <div>
      <div>
        <span>Auto-sell below</span>
        <span>\${((pct / 100) * MAX_VALUE).toFixed(0)}</span>
      </div>
      <Slider value={floor} onValueChange={setFloor} max={100} step={1} aria-label="Auto-sell floor" />
      <Badge variant={band.variant}>{band.label}</Badge>
    </div>
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
      description: "value is always an array, even for a single handle — render its own readout beside the track.",
      language: "tsx",
      code: `import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function OddsThreshold() {
  const [odds, setOdds] = useState([25]);
  return (
    <div>
      <span>{odds[0]}%</span>
      <Slider
        value={odds}
        onValueChange={setOdds}
        max={100}
        step={1}
        aria-label="Auto-sell threshold"
      />
    </div>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A range slider is a Slider configuration, not a separate component — value with two entries makes it a range, and both ends need their own accessible name via thumbLabels.",
      label: "Price range filter (Range Slider)",
      render: (
        <div className="max-w-md">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="type-small text-muted-foreground">Price range</span>
            <span className="type-number-base text-foreground">$10 – $240</span>
          </div>
          <Slider
            defaultValue={[10, 240]}
            min={0}
            max={500}
            step={5}
            aria-label="Price range"
            thumbLabels={["Minimum price", "Maximum price"]}
          />
          <div className="mt-3 flex justify-between">
            <span className="type-number-sm text-muted-foreground">$0</span>
            <span className="type-number-sm text-muted-foreground">$500</span>
          </div>
        </div>
      ),
      source: `const [price, setPrice] = useState([10, 240]);

<span>\${price[0]} – \${price[1]}</span>
<Slider
  value={price}
  onValueChange={setPrice}
  min={0}
  max={500}
  step={5}
  aria-label="Price range"
  thumbLabels={["Minimum price", "Maximum price"]}
/>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Slider wraps Radix's SliderPrimitive.Root and adds one prop of its own — thumbLabels — that Radix does not define.",
      blocks: [
        {
          label: "Slider",
          body: (
            <Meta
              items={[
                {
                  k: "thumbLabels",
                  v: "string[]. Not a Radix prop — added by this wrapper. One accessible name per thumb, in order. Overrides the derived name described in Accessibility below.",
                },
                { k: "value", v: "number[]. Controlled. One entry for a single handle, two for a range." },
                { k: "defaultValue", v: "number[]. Uncontrolled initial value(s)." },
                { k: "onValueChange", v: "(value: number[]) => void. Fires continuously while dragging." },
                { k: "onValueCommit", v: "(value: number[]) => void. Fires once when the drag ends." },
                { k: "min", v: "number. Default: 0." },
                { k: "max", v: "number. Default: 100." },
                { k: "step", v: "number." },
                { k: "minStepsBetweenThumbs", v: "number — the minimum gap between two thumbs in a range, expressed in steps." },
                { k: "disabled", v: "boolean." },
                { k: "orientation", v: "\"horizontal\" | \"vertical\", via aria-orientation." },
                { k: "inverted", v: "boolean — visually reverses the direction of the track." },
                { k: "name", v: "string — for a bubbled native <input> inside a <form>." },
                { k: "dir", v: "\"ltr\" | \"rtl\"." },
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
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest / default">
                <Slider defaultValue={[40]} className="w-32" aria-label="Default" />
              </StateCell>
              <StateCell label="range" note="Two thumbs">
                <Slider
                  defaultValue={[20, 70]}
                  className="w-32"
                  aria-label="Range"
                  thumbLabels={["Range start", "Range end"]}
                />
              </StateCell>
              <StateCell label="focus-visible" note="Tab to a thumb">
                <Slider defaultValue={[40]} className="w-32" aria-label="Focus" />
              </StateCell>
              <StateCell label="disabled">
                <Slider defaultValue={[40]} disabled className="w-32" aria-label="Disabled" />
              </StateCell>
              <StateCell label="pressed" note="Drag a thumb">
                <Slider defaultValue={[40]} className="w-32" aria-label="Pressed" />
              </StateCell>
            </StateGrid>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "role=\"slider\" lives on each thumb, not on the root — Slider destructures aria-label / aria-labelledby off the root and forwards a derived name to each thumb instead.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "slider, one per thumb (via Radix). The root itself is a plain <span> with no role, so a name written there labels nothing — Slider forwards it down for you.",
                },
                {
                  k: "Accessible name",
                  v: "An explicit thumbLabels entry wins per thumb. Otherwise: a single-thumb slider inherits the root's aria-label outright; a multi-thumb slider without thumbLabels numbers them (\"Price range 1\", \"Price range 2\") rather than giving every end the identical name.",
                },
                {
                  k: "Range slider naming",
                  v: "Always supply thumbLabels for a two-handle range (e.g. [\"Minimum price\", \"Maximum price\"]) — two ends both named \"Price range\" is no more useful than no name at all.",
                },
                {
                  k: "Value readout",
                  v: "Not automatic. The current value must be rendered as visible text beside the track (see Preview and Examples) — a slider without a readout is guesswork for every user, not only assistive-tech ones.",
                },
                {
                  k: "Target size",
                  v: "The thumb is drawn at 20px and reclaims the 44px floor (--size-target-min) with after:-inset-3, per RULES §7. A slider owns its own row, so this 44px target cannot collide with a neighbouring control the way a stacked checkbox row's would.",
                },
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
      description: "Keyboard behaviour is per focused thumb — Tab moves between thumbs in a range rather than skipping the control as one stop.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus between thumbs (each thumb is its own stop) and in and out of the slider." },
                { k: "Arrow Right / Arrow Up", v: "Increases the focused thumb's value by one step." },
                { k: "Arrow Left / Arrow Down", v: "Decreases the focused thumb's value by one step." },
                { k: "Page Up / Page Down", v: "Increases / decreases by a larger increment (Radix default: 10 steps)." },
                { k: "Home / End", v: "Jumps the focused thumb to min / max." },
                { k: "minStepsBetweenThumbs", v: "When set, prevents an arrow key from moving one thumb past the other by less than the configured gap." },
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
