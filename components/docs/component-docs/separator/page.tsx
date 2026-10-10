/**
 * Authored documentation page for `separator`.
 *
 * Replaces the generated baseline. Migrated from the old `base/data` category
 * page (`app/design-system/components/base/data/page.tsx`, since deleted), which held every
 * data-display component's real documentation on one page. Every specimen
 * below renders the real `Separator` from `components/ui/separator.tsx` —
 * nothing here is a styled div.
 *
 * Separator is decorative by default, so its most interesting section is
 * Accessibility rather than States — see the omissions recorded on States
 * and Keyboard below.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import { Separator } from "@/components/ui/separator";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "separator",
  omitted: {
    responsive: "A one-pixel rule has no responsive behaviour of its own: it inherits whatever the layout around it does, and there is nothing about it that reflows, zooms or mirrors differently.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A hairline. It uses the border token, so it holds up on every surface in the ladder without being restyled — doing its actual job both ways it is used: stacking rows apart, and dividing inline figures.",
      render: (
        <div className="max-w-md">
          <p className="type-small text-muted-foreground">Available balance</p>
          <Separator className="my-4" />
          <p className="type-small text-muted-foreground">Bonus balance</p>
          <div className="mt-4 flex h-5 items-center gap-3">
            <span className="type-number-sm text-muted-foreground">412 packs</span>
            <Separator orientation="vertical" />
            <span className="type-number-sm text-muted-foreground">8 sets</span>
          </div>
        </div>
      ),
      source: `<p>Available balance</p>
<Separator className="my-4" />
<p>Bonus balance</p>

<div className="mt-4 flex h-5 items-center gap-3">
  <span>412 packs</span>
  <Separator orientation="vertical" />
  <span>8 sets</span>
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
      language: "tsx",
      code: `import { Separator } from "@/components/ui/separator";

export function BalanceSplit() {
  return (
    <>
      <p>Available balance</p>
      <Separator className="my-4" />
      <p>Bonus balance</p>
    </>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Every hairline in the Preview above is decorative — the layout around it already says where one thing ends. This one is semantic: nothing but the rule itself marks the boundary between the two groups, so it opts out of role=\"none\" with decorative={false}. See Accessibility for when to choose which.",
      label: "Semantic boundary",
      render: (
        <Panel>
          <div className="max-w-md">
            <p className="type-small text-foreground">Redeemed today</p>
            <p className="type-number-sm mt-1 text-muted-foreground">3 packs</p>
            <Separator className="my-4" decorative={false} />
            <p className="type-small text-foreground">Redeemed this month</p>
            <p className="type-number-sm mt-1 text-muted-foreground">41 packs</p>
          </div>
        </Panel>
      ),
      source: `<p>Redeemed today</p>
<p>3 packs</p>
<Separator className="my-4" decorative={false} />
<p>Redeemed this month</p>
<p>41 packs</p>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Separator",
          body: (
            <Meta
              items={[
                { k: "orientation", v: '"horizontal" | "vertical". Default: "horizontal".' },
                { k: "decorative", v: "boolean. Default: true. true renders role=\"none\" and announces nothing; false switches it to role=\"separator\" with aria-orientation. See Accessibility." },
                { k: "...props", v: "Every other Radix Separator.Root prop, forwarded directly." },
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
        "The interesting section for a component that is otherwise a plain line — whether it exists in the accessibility tree at all is a real decision, made per instance.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "decorative (default true)",
                  v: 'role="none": the separator draws a line and announces nothing, because the layout on either side already says where one thing ends. This is correct for most uses — every rule in the Preview above is decorative.',
                },
                {
                  k: "decorative={false}",
                  v: "Switches to role=\"separator\", with aria-orientation carrying \"horizontal\" or \"vertical\" so assistive tech announces the boundary itself. Reach for this only when the line is the only thing marking the boundary — nothing else in the layout conveys it, as in the Examples specimen above.",
                },
                {
                  k: "When to choose which",
                  v: "If removing the Separator would leave the surrounding content still clearly grouped (a heading, a change in surface, spacing), it is decorative. If removing it would make two unrelated groups of content read as one, it is semantic.",
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
      description: "Separator is never focusable, decorative or semantic.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A. Even with <Code>decorative={"{false}"}</Code>, a{" "}
              <Code>role=&quot;separator&quot;</Code> is not part of the tab
              sequence — it is announced when a screen reader reads past it in
              document order, not reached by <kbd>Tab</kbd>.
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
