import { Check, Link as LinkIcon, Sparkle } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Code, Meta, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "badge",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Three emphasis levels together: a filled chip, a tinted semantic colour, and an unfilled outline. Every variant is flat, with no gradient or shadow. The full eleven-variant set is in Variants below.",
      render: (
        <div className="w-full max-w-md divide-y divide-border rounded-lg border border-border bg-card">
          {[
            ["Eclipse Vault", "Series I · 250 cards", <Badge key="a" variant="success">Available</Badge>],
            ["Origin Pulse", "Series II · 180 cards", <Badge key="b" variant="premium">Featured</Badge>],
            ["Nightfall", "Series I · 40 left", <Badge key="c" variant="warning">Limited</Badge>],
            ["Cobalt Run", "Retired", <Badge key="d" variant="outline">Sold out</Badge>],
          ].map(([title, sub, badge]) => (
            <div key={title as string} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="type-body truncate text-foreground">{title as string}</p>
                <p className="type-small text-muted-foreground">{sub as string}</p>
              </div>
              {badge}
            </div>
          ))}
        </div>
      ),
      source: `<Badge>Default</Badge>
<Badge variant="success">Available</Badge>
<Badge variant="outline">Limited</Badge>`,
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
      description: "The minimal import and call.",
      language: "tsx",
      code: `import { Badge } from "@/components/ui/badge";

export function StatusChip() {
  return <Badge variant="success">Available</Badge>;
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Eleven variants, all flat. Filled variants (default, secondary, destructive, action, premium, success, warning, info) carry a solid or tinted fill and nothing else — the gradient and shadow they used to wear were removed, because a label with a machined surface reads as a control that does not press. Unfilled variants (outline, ghost, link) carry no fill at all.",
      label: "Variants",
      render: (
        <StateGrid cols={4}>
          <StateCell label="default">
            <Badge>Default</Badge>
          </StateCell>
          <StateCell label="secondary">
            <Badge variant="secondary">6 Cards</Badge>
          </StateCell>
          <StateCell label="destructive">
            <Badge variant="destructive">Sold out</Badge>
          </StateCell>
          <StateCell label="outline">
            <Badge variant="outline">Limited</Badge>
          </StateCell>
          <StateCell label="ghost">
            <Badge variant="ghost">Draft</Badge>
          </StateCell>
          <StateCell label="link" note="Renders as text">
            <Badge variant="link">Forgot password?</Badge>
          </StateCell>
          <StateCell label="action" note="Interactive / selected">
            <Badge variant="action">Selected</Badge>
          </StateCell>
          <StateCell label="premium" note="Reward, worth. Lime.">
            <Badge variant="premium">Featured</Badge>
          </StateCell>
          <StateCell label="success">
            <Badge variant="success">Available</Badge>
          </StateCell>
          <StateCell label="warning">
            <Badge variant="warning">Low supply</Badge>
          </StateCell>
          <StateCell label="info">
            <Badge variant="info">New set</Badge>
          </StateCell>
        </StateGrid>
      ),
      source: `<Badge>Default</Badge>
<Badge variant="secondary">6 Cards</Badge>
<Badge variant="destructive">Sold out</Badge>
<Badge variant="outline">Limited</Badge>
<Badge variant="ghost">Draft</Badge>
<Badge variant="action">Selected</Badge>
<Badge variant="premium">Featured</Badge>
<Badge variant="success">Available</Badge>
<Badge variant="warning">Low supply</Badge>
<Badge variant="info">New set</Badge>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A leading or trailing icon, and asChild for rendering as a link — the only case where Badge's hover and press styling on an [a] child actually applies.",
      label: "Icons and asChild",
      render: (
        <Row>
          <Badge variant="premium">
            <Icon icon={Sparkle} data-icon="inline-start" />
            Featured
          </Badge>
          <Badge variant="success">
            <Icon icon={Check} data-icon="inline-start" />
            Verified
          </Badge>
          <Badge variant="secondary" asChild>
            <a href="#examples">
              <Icon icon={LinkIcon} data-icon="inline-end" />
              View source
            </a>
          </Badge>
        </Row>
      ),
      source: `<Badge variant="success">
  <Icon icon={Check} data-icon="inline-start" />
  Verified
</Badge>

<Badge variant="secondary" asChild>
  <a href="/docs">
    <Icon icon={LinkIcon} data-icon="inline-end" />
    View source
  </a>
</Badge>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Badge",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: "\"default\" · \"secondary\" · \"destructive\" · \"outline\" · \"ghost\" · \"link\" · \"action\" · \"premium\" · \"success\" · \"warning\" · \"info\". Default: \"default\".",
                },
                {
                  k: "asChild",
                  v: "boolean. Default: false. Renders the single child via Radix Slot instead of a <span> — used to make a Badge-styled element an <a> or <button>.",
                },
                {
                  k: "...props",
                  v: "Every other native <span> attribute (or the wrapped element's attributes, under asChild), forwarded directly. Badge adds no props beyond variant and asChild.",
                },
              ]}
            />
          ),
        },
        {
          label: "badgeVariants",
          body: (
            <p className="type-small text-muted-foreground">
              The class-variance-authority function Badge is built on (<Code>variant</Code>
              {" "}only — there is no size axis). Exported so a consumer can apply the
              identical class set to an element Badge itself does not render.
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
        "Badge renders a <span> by default — a label with no interaction semantics of its own.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "None (a plain <span>). It carries no implicit ARIA role and is not exposed as an interactive element to assistive tech.",
                },
                {
                  k: "Accessible name",
                  v: "Its text content, read as part of the surrounding content flow — not announced as a distinct landmark or control.",
                },
                {
                  k: "Colour is never the only signal",
                  v: "success / warning / info / destructive variants carry colour and, in this system's usage (see the Table page's transaction status column), are always paired with a written word (\"Available\", \"Low supply\") rather than colour alone — Badge itself does not enforce this; it is a content requirement on every call site.",
                },
                {
                  k: "asChild",
                  v: "When wrapping an <a> or <button>, the wrapped element supplies its own role, focusability and keyboard behaviour — Badge only contributes visual styling in that mode.",
                },
                {
                  k: "aria-invalid",
                  v: "Styles a destructive border and ring. As with Button and Input, pair it with a written message elsewhere on the page; a boolean attribute is not itself announced as an error description.",
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
      description:
        "Badge is never independently focusable — keyboard behaviour exists only when asChild wraps a real link or button.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Plain Badge", v: "No keyboard interaction — a <span> is never in the tab sequence." },
                { k: "asChild over an <a>", v: "Standard link behaviour: Tab moves focus to it, Enter activates it. See the \"View source\" specimen under Examples." },
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
        "Badge is an inline-fit chip with no breakpoint classes — its own width is always shrink-to-fit its label, and how a row of them behaves under a narrow viewport is entirely the responsibility of whatever layout the caller puts them in.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Sizing",
                  v: "inline-flex w-fit shrink-0 whitespace-nowrap — the label never wraps inside a badge at any width; a badge sized for its text stays exactly that size from 375px to 1920px.",
                },
                {
                  k: "In a flex row",
                  v: "Badge itself doesn't wrap or reflow — a row of badges (as in the Preview and Variants grids above) wraps or overflows only because the parent Row/grid uses flex-wrap, which is a decision made outside Badge.",
                },
                {
                  k: "200% zoom / RTL",
                  v: "Because the chip is shrink-to-fit rather than fixed-width, doubling the text size widens the pill rather than clipping it, and the pill's icon slots (data-icon=\"inline-start\"/\"inline-end\") are logical rather than physical, so they swap sides correctly under RTL — measured with no overflow in either case.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px — expected for an inline element with no fixed or viewport-keyed width.",
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
