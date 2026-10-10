import { Info } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Code, Meta, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "popover",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Non-modal, anchored to a control. Used for the odds explainer, quick filters and the notification panel. The page underneath stays usable.",
      render: (
        <Row className="justify-center">
          <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
            <div>
              <p className="type-body text-foreground">Eclipse Vault</p>
              <p className="type-small text-muted-foreground">Legendary odds 0.42% per card</p>
            </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Icon icon={Info} size="sm" tone="inherit" />
                How odds work
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <PopoverHeader>
                <PopoverTitle>Per-card odds</PopoverTitle>
                <PopoverDescription>
                  Every card in a pack is rolled independently.
                </PopoverDescription>
              </PopoverHeader>
              <dl className="mt-4 space-y-2">
                {[
                  ["Common", "68.00%"],
                  ["Uncommon", "21.00%"],
                  ["Rare", "8.00%"],
                  ["Epic", "2.58%"],
                  ["Legendary", "0.42%"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="type-small text-muted-foreground">{k}</dt>
                    <dd className="type-number-sm text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </PopoverContent>
          </Popover>
          </div>
        </Row>
      ),
      source: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">How odds work</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <PopoverHeader>
      <PopoverTitle>Per-card odds</PopoverTitle>
      <PopoverDescription>Every card in a pack is rolled independently.</PopoverDescription>
    </PopoverHeader>
    {/* content */}
  </PopoverContent>
</Popover>`,
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
        "Radix gives PopoverContent role=\"dialog\" but no Title/Description primitive of its own to name it with. This component adds PopoverTitle and PopoverDescription to fill that gap — always name a popover, either with PopoverTitle or an explicit aria-label.",
      language: "tsx",
      code: `import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function OddsExplainer() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">How odds work</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Per-card odds</PopoverTitle>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A titled explainer and an untitled action list. The second names itself with aria-label on PopoverContent instead, since a list of plain actions has no natural heading.",
      label: "Odds explainer and quick sort",
      render: (
        <Row>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Icon icon={Info} size="sm" tone="inherit" />
                How odds work
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <PopoverHeader>
                <PopoverTitle>Per-card odds</PopoverTitle>
                <PopoverDescription>
                  Every card in a pack is rolled independently.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">Quick sort</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" aria-label="Quick sort options">
              <div className="grid gap-1">
                {["Most popular", "Newest", "Price: low to high", "Volatility"].map((o) => (
                  <Button key={o} variant="ghost" className="justify-start">
                    {o}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </Row>
      ),
      source: `<PopoverContent className="w-56" aria-label="Quick sort options">
  {/* no PopoverTitle — an explicit aria-label names the panel instead */}
</PopoverContent>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Built on Radix PopoverPrimitive, plus a naming context this component adds so PopoverTitle/PopoverDescription can claim ids and PopoverContent can point aria-labelledby/aria-describedby at them once they exist.",
      blocks: [
        {
          label: "Popover / PopoverTrigger / PopoverAnchor",
          body: (
            <Meta
              items={[
                {
                  k: "Popover",
                  v: "Forwards every prop to Radix PopoverPrimitive.Root — open, onOpenChange, defaultOpen, modal — and also owns the naming context described above.",
                },
                { k: "PopoverTrigger", v: "Radix PopoverPrimitive.Trigger. Pass asChild to use an existing element as the trigger." },
                { k: "PopoverAnchor", v: "Radix PopoverPrimitive.Anchor. For anchoring the popover to an element other than its trigger." },
              ]}
            />
          ),
        },
        {
          label: "PopoverContent",
          body: (
            <Meta
              items={[
                { k: "align", v: "\"start\" · \"center\" · \"end\". Default: \"center\"." },
                { k: "sideOffset", v: "number (px). Default: 4." },
                {
                  k: "aria-labelledby / aria-describedby",
                  v: "Set automatically from a rendered PopoverTitle / PopoverDescription. Passing an explicit aria-label suppresses the generated aria-labelledby, since a name and a labelledby on the same node is ambiguous for the reader.",
                },
                {
                  k: "...props",
                  v: "Every Radix PopoverPrimitive.Content prop (side, collisionPadding, onOpenAutoFocus, etc.), forwarded directly. No explicit width is set — always give the content its own w-* class.",
                },
              ]}
            />
          ),
        },
        {
          label: "PopoverHeader / PopoverTitle / PopoverDescription",
          body: (
            <Meta
              items={[
                { k: "PopoverHeader", v: "React.ComponentProps<\"div\">. A plain flex-col wrapper for title + description; optional — PopoverTitle works without it." },
                { k: "PopoverTitle", v: "React.ComponentProps<\"h2\">. Registers itself with the naming context on mount and unregisters on unmount, claiming the generated id PopoverContent reads for aria-labelledby." },
                { k: "PopoverDescription", v: "React.ComponentProps<\"p\">. Same registration pattern, for aria-describedby." },
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
        "Non-modal: focus is not trapped, and the page behind the popover stays fully operable while it is open — the load-bearing difference from Dialog and Sheet.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "role=\"dialog\" (Radix default for Popover). Radix supplies no Title/Description primitive of its own — the previous absence of PopoverTitle/PopoverDescription meant every popover in this system was announced as an unnamed \"dialog\" until this wiring existed.",
                },
                {
                  k: "Accessible name",
                  v: "aria-labelledby, pointed at a rendered PopoverTitle's id. A PopoverContent with no PopoverTitle and no explicit aria-label emits neither — an id that names nothing fails the same accessible-name check it exists to pass — so it MUST carry aria-label directly, as in the Quick Sort example above.",
                },
                {
                  k: "Focus management",
                  v: "Non-modal: opening does not move focus automatically off the trigger the way a modal dialog does, and Tab can move past the popover into the rest of the page while it is open.",
                },
                {
                  k: "Dismissal",
                  v: "Escape, a click outside the content, and (unless collision-avoided) losing focus outside the popover all close it.",
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
                { k: "Enter / Space", v: "Activates the trigger, opening the popover." },
                { k: "Tab / Shift+Tab", v: "Moves through the popover's focusable content and, unlike a modal overlay, can continue into the rest of the page — nothing traps it." },
                { k: "Escape", v: "Closes the popover and returns focus to the trigger." },
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
        "PopoverContent has one fixed width and no breakpoint of its own; what changes with the viewport is where Radix places it, not its shape.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              <Code>w-72</Code> (288px) is a constant — the panel does not shrink at
              narrow widths the way a full-screen sheet would. On a 375px viewport that
              is most of the screen, and Radix&rsquo;s own collision avoidance (flip, shift,
              the built-in viewport padding) is what keeps it from being clipped rather
              than any responsive class in this file — the same mechanism that decides
              which <Code>data-side</Code> it slides in from. There is no separate mobile
              layout: a design that needs the popover to become a bottom sheet below{" "}
              <Code>sm</Code> has to build that itself: Popover is not it. Measured with
              no overflow at 375, 768, 1440 or 1920, no 200% zoom overflow, and no RTL
              overflow — align and side both flip correctly under RTL because they come
              from Radix&rsquo;s own logical placement logic, not a hardcoded left/right.
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
