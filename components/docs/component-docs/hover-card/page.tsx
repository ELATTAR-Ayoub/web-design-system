import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Code, Meta, Note, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "hover-card",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A richer preview on hover, for pointer users only. Used to preview a card from a live-pull row without leaving the feed. Never put an action inside one.",
      render: (
        <Row>
          {/* The feed row the hover card previews from: the card name is the
              trigger, the rest is the context a reader would actually see. */}
          <p className="type-body text-muted-foreground">
            <span className="text-value-ink">Legendary pull</span> ·{" "}
          <HoverCard defaultOpen>
            <HoverCardTrigger asChild>
              <Button variant="link" className="px-0">Voidwing Ascendant</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="mb-3 h-32 rounded-md border border-value/30 bg-value/12" />
              <p className="type-h4 text-foreground">Voidwing Ascendant</p>
              <p className="type-small mt-1 text-muted-foreground">
                Eclipse Vault · #044 of 250
              </p>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="type-small text-value-ink">Legendary</span>
                <span className="type-number-md text-value-ink">$1,240.00</span>
              </div>
            </HoverCardContent>
          </HoverCard>
            {" "}· 2 min ago
          </p>
        </Row>
      ),
      source: `<HoverCard defaultOpen>
  <HoverCardTrigger asChild>
    <Button variant="link">Voidwing Ascendant</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="mb-3 h-32 rounded-md border border-value/30 bg-value/12" />
    <p className="type-h4 text-foreground">Voidwing Ascendant</p>
    <p className="type-small mt-1 text-muted-foreground">
      Eclipse Vault · #044 of 250
    </p>
    <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
      <span className="type-small text-value-ink">Legendary</span>
      <span className="type-number-md text-value-ink">$1,240.00</span>
    </div>
  </HoverCardContent>
</HoverCard>`,
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
        "Because hover does not exist on touch, anything inside a hover card must also be reachable another way — here, by opening the card's own inspection modal from the feed row directly.",
      language: "tsx",
      code: `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export function CardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Voidwing Ascendant</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <p className="type-h4 text-foreground">Voidwing Ascendant</p>
      </HoverCardContent>
    </HoverCard>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "HoverCard / HoverCardTrigger",
          body: (
            <Meta
              items={[
                {
                  k: "HoverCard",
                  v: "Forwards every prop to Radix HoverCardPrimitive.Root — open, onOpenChange, defaultOpen, openDelay, closeDelay.",
                },
                {
                  k: "HoverCardTrigger",
                  v: "Radix HoverCardPrimitive.Trigger. Pass asChild to use an existing element (a link, a button) as the trigger.",
                },
              ]}
            />
          ),
        },
        {
          label: "HoverCardContent",
          body: (
            <Meta
              items={[
                { k: "align", v: "\"start\" · \"center\" · \"end\". Default: \"center\"." },
                { k: "sideOffset", v: "number (px). Default: 4." },
                {
                  k: "...props",
                  v: "Every Radix HoverCardPrimitive.Content prop (side, collisionPadding, forceMount, etc.), forwarded directly. Default width is w-64; override per instance as needed.",
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
        "role=\"dialog\", non-modal — focus is not trapped, and the page behind the card stays fully operable while it is open.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "role=\"dialog\" (Radix default for HoverCard)." },
                {
                  k: "Accessible name",
                  v: "Not wired automatically the way Popover's is in this system — a HoverCard has no HoverCardTitle. If content needs a name beyond its own visible text, supply aria-label on HoverCardContent directly.",
                },
                {
                  k: "Keyboard equivalence",
                  v: "Opens on keyboard focus of the trigger as well as pointer hover — never hover-only. This is the reason RULES requires anything inside a hover card be reachable another way for touch users, who have neither hover nor a meaningful \"focus without activating\" gesture.",
                },
                {
                  k: "Dismissal",
                  v: "Closes when the pointer leaves both the trigger and the content (after Radix's close delay), when the trigger loses focus, or on Escape.",
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
                { k: "Tab / Shift+Tab", v: "Moving focus onto the trigger opens the card; moving focus away closes it." },
                { k: "Escape", v: "Closes the card and keeps focus on the trigger." },
              ]}
            />
          ),
        },
        {
          body: (
            <Note tone="error" title="Never the only way to reach something">
              A <Code>HoverCardContent</Code> is not part of the normal tab
              sequence beyond its trigger — nothing inside it should be the
              sole path to information or an action a keyboard-only or
              touch-only user needs, because a user who never focuses the
              trigger in a hover-triggering way never sees it.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "HoverCardContent has no layout of its own that reflows — width is fixed by the className the caller supplies (w-64 by default, overridden to w-72 in the Preview specimen above), and the content inside it stacks or scrolls exactly however that content is authored.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Positioning",
                  v: "Radix's Popper collision detection flips the card to whichever side keeps it inside the viewport, rather than resizing or stacking it — the card repositions, it never reflows.",
                },
                {
                  k: "Narrow widths",
                  v: "A caller-set width wider than the viewport (unusual, but possible at 375px) overflows the card itself; there is no built-in clamp, so a narrow-viewport specimen should size its content deliberately.",
                },
                {
                  k: "200% zoom",
                  v: "Content scales with the page's own zoom like any other popover; Radix keeps it collision-aware so it stays on-screen rather than clipping.",
                },
                {
                  k: "RTL",
                  v: "align and side are logical, not literal — under dir=\"rtl\" the card mirrors to the opposite edge automatically, the same as every other Radix Popper primitive in this system.",
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
