/**
 * Authored documentation page for `marker`.
 *
 * Replaces the generated baseline. Migrated from the old `base/data` category
 * page (`app/design-system/components/base/data/page.tsx`, since deleted), which held every
 * data-display component's real documentation on one page. Every specimen
 * below renders the real `Marker` from `components/ui/marker.tsx` — nothing
 * here is a styled div.
 */

import { InfoIcon, SquareIcon } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta } from "@/components/ds/kit";

import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

import { ActivityLogShowcase } from "./marker-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "marker",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A note about a list, sitting in the list. Press \"Pause\" and a real Marker appears between the rows to say so; \"Resume\" removes it and a new row lands. Not a highlight — Marker draws no background and will not emphasise a matched substring.",
      render: <ActivityLogShowcase />,
      source: `const [paused, setPaused] = useState(false);

{paused && (
  <Marker variant="separator">
    <MarkerIcon>
      <Icon icon={SquareIcon} size="sm" tone="muted" />
    </MarkerIcon>
    <MarkerContent>Stopped by you</MarkerContent>
  </Marker>
)}

<Button variant="outline" onClick={() => setPaused((p) => !p)}>
  {paused ? "Resume" : "Pause"}
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
      language: "tsx",
      code: `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

export function StoppedMarker() {
  return (
    <Marker variant="separator">
      <MarkerIcon>{/* ... */}</MarkerIcon>
      <MarkerContent>Stopped by you</MarkerContent>
    </Marker>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Three shapes, and the choice is about what the marker is separating: default is a bare row for a container that already frames it, separator draws a rule on both sides for dividing a stream into before and after, and border underlines what follows rather than dividing it.",
      label: "variant",
      render: (
        <div className="space-y-6">
          <Marker>
            <MarkerIcon>
              <Icon icon={InfoIcon} size="sm" tone="muted" />
            </MarkerIcon>
            <MarkerContent>default — bare row, for a container that already frames it</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerContent>separator — divides before from after</MarkerContent>
          </Marker>
          <Marker variant="border">
            <MarkerContent>border — heads what follows</MarkerContent>
          </Marker>
        </div>
      ),
      source: `<Marker><MarkerContent>default</MarkerContent></Marker>
<Marker variant="separator"><MarkerContent>separator</MarkerContent></Marker>
<Marker variant="border"><MarkerContent>border</MarkerContent></Marker>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The agent workspace, where a stream was stopped mid-sentence. Without the marker this would read as a finished answer that trails off.",
      label: "In use — a stopped stream",
      render: (
        <div className="space-y-4">
          <p className="type-small text-muted-foreground">
            The assistant was mid-sentence and the user pressed stop.
          </p>
          <Marker variant="separator">
            <MarkerIcon>
              <Icon icon={SquareIcon} size="sm" tone="muted" />
            </MarkerIcon>
            <MarkerContent>Stopped by you</MarkerContent>
          </Marker>
        </div>
      ),
      source: `<p className="type-small text-muted-foreground">
  The assistant was mid-sentence and the user pressed stop.
</p>
<Marker variant="separator">
  <MarkerIcon>
    <Icon icon={SquareIcon} size="sm" tone="muted" />
  </MarkerIcon>
  <MarkerContent>Stopped by you</MarkerContent>
</Marker>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Marker",
          body: (
            <Meta
              items={[
                { k: "variant", v: '"default" | "separator" | "border". Default: "default".' },
                { k: "asChild", v: "boolean. Default: false. Renders via Radix Slot instead of a <div>." },
                { k: "...props", v: "Every other native <div> attribute, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "MarkerIcon / MarkerContent",
          body: (
            <Meta
              items={[
                { k: "MarkerIcon", v: "A <span aria-hidden=\"true\">, always hidden from assistive tech — the icon is decorative and MarkerContent's text carries the meaning." },
                { k: "MarkerContent", v: "A <span> that centres its text under the separator variant (via a group-data selector reading the parent's variant) and stays left-aligned under the other two." },
              ]}
            />
          ),
        },
        {
          label: "markerVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function <Code>Marker</Code> is
              built on, exported so a consumer can apply the identical class
              set to an element <Code>Marker</Code> itself does not render.
            </p>
          ),
        },
      ],
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
                { k: "Role", v: "None implicit — a plain <div> (or whatever asChild wraps). Marker carries no landmark or live-region role." },
                { k: "MarkerIcon", v: "Always aria-hidden=\"true\" — the glyph is decorative, and MarkerContent's text is what a screen reader announces." },
                { k: "Accessible name", v: "Its text content, read as part of the surrounding content flow — not announced as a distinct control or landmark." },
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
      description: "Marker is never independently focusable.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A. Marker places no element in the tab sequence, with or
              without <Code>asChild</Code> — the elements it is typically
              given (an icon, a short label) are not interactive.
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
        "Marker is w-full and takes the width of whatever list or stream it sits in — its own reflow is entirely inside MarkerContent and the separator rules, not in the row's overall shape.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Text wrapping",
                  v: "MarkerContent carries wrap-break-word, so a label longer than the available width wraps onto a second line rather than overflowing the row — there is no truncation.",
                },
                {
                  k: "separator variant at any width",
                  v: "The before:/after: rules are flex-1 with min-w-0, so they stretch or shrink to fill whatever space is left beside the centred label at every viewport, from a 375px column to a 1920px one.",
                },
                {
                  k: "200% zoom",
                  v: "min-h-4 is a floor, not a fixed height, so the row grows to fit zoomed text instead of clipping it.",
                },
                {
                  k: "RTL",
                  v: "text-left is a physical value — Marker does not switch to text-right under dir=\"rtl\"; the separator variant's centred label and symmetric rules are unaffected either way, but a default or border-variant Marker in an RTL layout keeps its text flush to the visual left rather than mirroring to the trailing edge.",
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
