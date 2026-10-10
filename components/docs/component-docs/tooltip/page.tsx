/**
 * Authored documentation page for `tooltip`.
 *
 * Replaces the generated baseline. Migrated from the old `base/dialogs`
 * category page (`app/design-system/components/base/dialogs/page.tsx`, since deleted).
 * Every specimen below renders the real `Tooltip` from
 * `components/ui/tooltip.tsx` — nothing here is a styled div.
 */

import { PackageOpen, SlidersHorizontal } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code, Meta, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "tooltip",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A short label for a control whose purpose is not obvious. It is not a place for content, and it is never the only way to learn something.",
      render: (
        <Row>
          {/* Open at rest, so the stage shows the thing it documents rather
              than an unlabelled icon a reader has to hover to understand.
              Hover and focus still drive it; this only sets the first frame. */}
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open this pack">
                <Icon icon={PackageOpen} size="md" tone="inherit" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open this pack</TooltipContent>
          </Tooltip>
        </Row>
      ),
      source: `<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Open this pack">
      <Icon icon={PackageOpen} size="md" tone="inherit" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Open this pack</TooltipContent>
</Tooltip>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          TooltipProvider lives once, in <Code>app/layout.tsx</Code>, with{" "}
          <Code>delayDuration</Code> left at its default of 0. The specimens on
          this page rely on that root provider rather than wrapping
          themselves — a page-level TooltipProvider would give this page its
          own open delay, different from the one every other screen shares.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Keep the label to a few words and put the real explanation in a Popover instead — a tooltip is a label, not a place for prose or a form.",
      language: "tsx",
      code: `import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function FilterButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Filters">
          {/* icon */}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Filter and sort</TooltipContent>
    </Tooltip>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "An icon-only trigger, and inline text acting as a trigger for supplementary information — cursor-help plus a dashed underline signal there is more to read without a visible icon.",
      label: "Icon buttons and inline text",
      render: (
        <Row>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Filters">
                <Icon icon={SlidersHorizontal} size="md" tone="inherit" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filter and sort</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="type-number-sm cursor-help border-b border-dashed border-input text-muted-foreground">
                412 / 2,000
              </span>
            </TooltipTrigger>
            <TooltipContent>412 packs remaining of a 2,000 print run</TooltipContent>
          </Tooltip>
        </Row>
      ),
      source: `<Tooltip>
  <TooltipTrigger asChild>
    <span className="cursor-help border-b border-dashed border-input text-muted-foreground">
      412 / 2,000
    </span>
  </TooltipTrigger>
  <TooltipContent>412 packs remaining of a 2,000 print run</TooltipContent>
</Tooltip>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "TooltipProvider",
          body: (
            <Meta
              items={[
                {
                  k: "delayDuration",
                  v: "number (ms). Default: 0 on the raw Radix primitive, but this component's own default is overridden by the provider mounted once in app/layout.tsx at 200ms — see the note on the Preview and Installation sections.",
                },
              ]}
            />
          ),
        },
        {
          label: "Tooltip / TooltipTrigger",
          body: (
            <Meta
              items={[
                { k: "Tooltip", v: "Forwards every prop to Radix TooltipPrimitive.Root — open, onOpenChange, defaultOpen, delayDuration (overrides the provider's for this one instance)." },
                { k: "TooltipTrigger", v: "Radix TooltipPrimitive.Trigger. Pass asChild to use an existing element — a Button, or plain text — as the trigger." },
              ]}
            />
          ),
        },
        {
          label: "TooltipContent",
          body: (
            <Meta
              items={[
                { k: "sideOffset", v: "number (px). Default: 0 (this component's own default, not Radix's)." },
                {
                  k: "...props",
                  v: "Every Radix TooltipPrimitive.Content prop (side, align, collisionPadding, etc.), forwarded directly. Renders its own arrow (TooltipPrimitive.Arrow) automatically — content is capped at max-w-xs, matching the \"short label\" contract.",
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
        "role=\"tooltip\", shown on hover and on keyboard focus — never hover-only — with a shared open delay set once on the provider so timing cannot vary between screens.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "role=\"tooltip\" (Radix default)." },
                {
                  k: "Accessible description",
                  v: "Radix wires the trigger's aria-describedby to the tooltip content automatically, so the label is announced as a description of the trigger rather than requiring the trigger's own accessible name to carry it.",
                },
                {
                  k: "Keyboard equivalence",
                  v: "Opens on keyboard focus of the trigger, not only pointer hover — the property RULES relies on to allow a tooltip as the delivery mechanism for a clipped label (see alert-dialog).",
                },
                {
                  k: "Touch equivalence",
                  v: "Radix's TooltipPrimitive is otherwise pointer/hover-driven only, which left a touch user with no way to reach an icon-only trigger's label at all. TooltipTrigger now toggles the tooltip open on a touch tap (preventing the trigger's own click so the label is read first), and closes it on a second tap or a tap outside — mirroring Flutter's own \"USER-ORDERED MOBILE ADAPTATION\" touch path rather than leaving the web behind it.",
                },
                {
                  k: "Never the only source",
                  v: "A tooltip must never be the sole place information lives; anything a tooltip says should also be discoverable another way (visible text, a Popover, an aria-label) for a user who never triggers it.",
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
                { k: "Tab / Shift+Tab", v: "Moving focus onto the trigger opens the tooltip immediately; moving away closes it." },
                { k: "Escape", v: "Closes an open tooltip without moving focus. Where a tooltip and a modal overlay are both open (see alert-dialog's clipped-label tooltip), the topmost layer takes the key — the tooltip closes first." },
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
        "The one part of this component that is genuinely viewport-aware: TooltipContent is built on Radix's Popper positioning, which measures the trigger against the viewport on every open rather than pinning to a fixed side.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Collision-aware flipping",
                  v: 'avoidCollisions defaults to true on Radix\'s Content: a trigger near the edge of a narrow (375px) viewport opens its tooltip on whichever side actually has room, and data-side on the rendered element reflects the side that was chosen, not the one requested.',
                },
                {
                  k: "collisionPadding",
                  v: "Not set by this component (Radix default: 0), so the content can sit flush with the viewport edge before it flips — a caller documenting a product surface with a fixed header or rail should pass collisionPadding to keep tooltips clear of it.",
                },
                {
                  k: "200% text zoom",
                  v: "TooltipContent's own text is capped at max-w-xs and wraps rather than growing wider, so zoom increases its height, not its width — the flip logic above still applies at the larger footprint.",
                },
                {
                  k: "RTL",
                  v: "align=\"start\" / \"end\" are logical, not physical — Radix resolves them against the ambient dir, so a tooltip anchored to \"start\" opens from the same edge as a left-to-right reader's leading edge would expect once the page is mirrored.",
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
