import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Meta, Note, Panel } from "@/components/ds/kit";

import { ToggleGroupSortSpecimen } from "./toggle-group-sort-specimen";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "toggle-group",
  omitted: {
    responsive:
      "ToggleGroup lays its items out with a plain flex row (or column, via orientation) and w-fit — there is no overflow-x-auto or wrap built into toggle-group.tsx, so a group with more items than a narrow container can hold simply overflows rather than reflowing. A caller with a long, viewport-sensitive group is responsible for wrapping it in its own scroll container; the component itself has no breakpoint logic.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A row of toggles acting as one control, with a single indicator that slides to the pressed item rather than each item lighting up its own background — pick a key and the Stash below actually re-orders.",
      label: "Sort the Stash",
      render: <ToggleGroupSortSpecimen />,
      source: `"use client";

import { useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const CARDS = [
  { name: "Voidwing Ascendant", pulledAgo: "2h ago", pulledAt: 2, price: 248 },
  { name: "Tidecaller", pulledAgo: "1d ago", pulledAt: 24, price: 12 },
  { name: "Emberlash Prime", pulledAgo: "5d ago", pulledAt: 120, price: 64 },
  { name: "Stonewarden", pulledAgo: "3w ago", pulledAt: 504, price: 4 },
];

const SORTERS = {
  newest: (a, b) => a.pulledAt - b.pulledAt,
  price: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function StashSort() {
  const [sort, setSort] = useState("newest");
  const sorted = useMemo(() => [...CARDS].sort(SORTERS[sort]), [sort]);

  return (
    <div>
      <ToggleGroup type="single" variant="outline" value={sort} onValueChange={(v) => v && setSort(v)}>
        <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
        <ToggleGroupItem value="price">Price</ToggleGroupItem>
        <ToggleGroupItem value="name">Name</ToggleGroupItem>
      </ToggleGroup>
      <ul>
        {sorted.map((card) => (
          <li key={card.name}>{card.name} — \${card.price.toFixed(2)}</li>
        ))}
      </ul>
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
      description:
        "type=\"single\" for a three-or-more mutually exclusive choice. With exactly two states, use IconSwap on a single Button instead — a segmented control for a binary choice wastes space and reads as weaker than it is.",
      language: "tsx",
      code: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function SortGroup() {
  return (
    <ToggleGroup type="single" defaultValue="newest">
      <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
      <ToggleGroupItem value="price">Price</ToggleGroupItem>
      <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "variant and orientation both flow down from the group to every item through context — set them once on ToggleGroup rather than on each ToggleGroupItem.",
      label: "Variant and orientation",
      render: (
        <div className="space-y-6">
          <div>
            <p className="type-badge mb-3 text-muted-foreground">variant=&quot;outline&quot;</p>
            <ToggleGroup type="single" variant="outline" defaultValue="newest">
              <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
              <ToggleGroupItem value="price">Price</ToggleGroupItem>
              <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <p className="type-badge mb-3 text-muted-foreground">orientation=&quot;vertical&quot;</p>
            <ToggleGroup type="single" orientation="vertical" defaultValue="newest">
              <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
              <ToggleGroupItem value="price">Price</ToggleGroupItem>
              <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      ),
      source: `<ToggleGroup type="single" variant="outline" defaultValue="newest">…</ToggleGroup>
<ToggleGroup type="single" orientation="vertical" defaultValue="newest">…</ToggleGroup>`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "Set once on ToggleGroup and inherited by every item, same as variant — sm and default for toolbar use, lg to stand alone. See the Toggle page for the size floor reasoning.",
      label: "Sizes",
      render: (
        <div className="space-y-4">
          <ToggleGroup type="single" size="sm" defaultValue="newest">
            <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
            <ToggleGroupItem value="price">Price</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" defaultValue="newest">
            <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
            <ToggleGroupItem value="price">Price</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size="lg" defaultValue="newest">
            <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
            <ToggleGroupItem value="price">Price</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ),
      source: `<ToggleGroup type="single" size="sm" defaultValue="newest">…</ToggleGroup>
<ToggleGroup type="single" defaultValue="newest">…</ToggleGroup>
<ToggleGroup type="single" size="lg" defaultValue="newest">…</ToggleGroup>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "type=\"multiple\" allows more than one item pressed at once, for a filter row rather than a single choice.",
      label: "Multiple selection",
      render: (
        <Panel label="type=&quot;multiple&quot;">
          <ToggleGroup type="multiple" defaultValue={["newest"]}>
            <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
            <ToggleGroupItem value="onSale">On sale</ToggleGroupItem>
            <ToggleGroupItem value="rare">Rare</ToggleGroupItem>
          </ToggleGroup>
        </Panel>
      ),
      source: `<ToggleGroup type="multiple" defaultValue={["newest"]}>
  <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
  <ToggleGroupItem value="onSale">On sale</ToggleGroupItem>
  <ToggleGroupItem value="rare">Rare</ToggleGroupItem>
</ToggleGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "ToggleGroup and ToggleGroupItem.",
      blocks: [
        {
          label: "ToggleGroup",
          body: (
            <Meta
              items={[
                {
                  k: "type",
                  v: "\"single\" · \"multiple\", from Radix ToggleGroup.Root. Required — decides one-of vs. many-of selection.",
                },
                {
                  k: "value / defaultValue",
                  v: "string (single) or string[] (multiple), from Radix ToggleGroup.Root. Controlled / uncontrolled selection.",
                },
                {
                  k: "onValueChange",
                  v: "(value) => void, from Radix ToggleGroup.Root.",
                },
                {
                  k: "variant",
                  v: "\"default\" · \"outline\". Default: \"default\". Flows to every ToggleGroupItem through context.",
                },
                {
                  k: "size",
                  v: "\"sm\" · \"default\" · \"lg\". Default: \"default\". Flows to every ToggleGroupItem through context.",
                },
                {
                  k: "spacing",
                  v: "number. Default: 2. Gap between items, in the spacing scale's step unit. spacing={0} joins the items edge-to-edge, matching each item's corner radii and outline borders at the seam the same way ButtonGroup does.",
                },
                {
                  k: "orientation",
                  v: "\"horizontal\" · \"vertical\". Default: \"horizontal\".",
                },
              ]}
            />
          ),
        },
        {
          label: "ToggleGroupItem",
          body: (
            <Meta
              items={[
                {
                  k: "value",
                  v: "string, from Radix ToggleGroup.Item. Required — identifies this item within the group's value.",
                },
                {
                  k: "variant / size",
                  v: "Same options as Toggle. Only take effect when the item is used outside a ToggleGroup — inside one, the group's own variant and size (via context) override whatever is passed here.",
                },
                {
                  k: "...props",
                  v: "Every other prop Radix ToggleGroup.Item accepts, forwarded directly.",
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
        "Per-item rest, hover, focus, pressed and disabled match Toggle's own States section exactly — the group's own addition is the travelling indicator.",
      blocks: [
        {
          body: (
            <Note tone="action" title="The travelling indicator">
              <p>
                One pill (<code className="type-code">ActiveIndicator</code>) slides between
                options rather than each option painting its own selected background — the
                selected item hands its background to the indicator
                (<code className="type-code">data-[state=on]:bg-transparent</code>) so the
                slide reads as one element moving, not two states crossfading.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Built on Radix ToggleGroup, which models the group as a roving-tabindex composite rather than a row of independent buttons.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "type=\"single\" renders role=\"radiogroup\" with each item role=\"radio\" and aria-checked. type=\"multiple\" renders a group of toggle buttons, each with aria-pressed.",
                },
                {
                  k: "Focus order",
                  v: "Roving tabindex: only the selected (or first) item is a tab stop; Tab moves focus to and past the group as one stop, not once per item.",
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the group as a whole (roving tabindex)." },
                {
                  k: "Arrow Right / Arrow Down",
                  v: "Moves selection to the next item (Radix ToggleGroup roving behaviour). Right in a horizontal group, Down in a vertical one.",
                },
                {
                  k: "Arrow Left / Arrow Up",
                  v: "Moves selection to the previous item.",
                },
                { k: "Home / End", v: "Jumps to the first / last item." },
                { k: "Space / Enter", v: "Toggles the focused item's pressed state." },
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
