import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Meta, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "kbd",
  omitted: {
    states: "Kbd is pointer-events-none and select-none by construction — a display-only label with one fixed appearance and no hover, focus, pressed, loading or disabled state to show.",
    keyboard: "Kbd documents a key, it does not respond to one: pointer-events-none and the absence of tabindex keep it out of the tab sequence entirely, so there is no keys-and-actions table to write.",
    responsive: "Kbd is inline-flex w-fit with a min-w-5 floor sized to its own text — it carries no breakpoint or container query, and nothing about its size, wrapping or direction changes across the widths, zoom or RTL this system measures.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A keyboard key or shortcut, rendered as a small pill. The product is fully keyboard navigable, so shortcuts are surfaced rather than hidden.",
      render: (
        <div className="w-full max-w-sm divide-y divide-border rounded-lg border border-border bg-card">
          {[
            ["Search the catalogue", ["Ctrl", "K"]],
            ["Send the message", ["⌘", "Enter"]],
            ["Close the palette", ["Esc"]],
            ["Move the selection", ["↑", "↓"]],
          ].map(([label, keys]) => (
            <div key={label as string} className="flex items-center justify-between px-4 py-3">
              <span className="type-small text-muted-foreground">{label as string}</span>
              <KbdGroup>
                {(keys as string[]).map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </KbdGroup>
            </div>
          ))}
        </div>
      ),
      source: `<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>`,
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
      code: `import { Kbd, KbdGroup } from "@/components/ui/kbd";

export function SearchShortcut() {
  return (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A multi-key combination, a single key, and Kbd sitting legibly inside a Tooltip — its styling flips to a translucent background when it detects a tooltip ancestor via data-[slot=tooltip-content].",
      label: "Shortcut hints",
      render: (
        <div className="space-y-4">
          <Row>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            <span className="type-small text-muted-foreground">Open search</span>
          </Row>
          <Row>
            <Kbd>Space</Kbd>
            <span className="type-small text-muted-foreground">Reveal next card</span>
          </Row>
          <Row>
            <Kbd>Esc</Kbd>
            <span className="type-small text-muted-foreground">Skip the opening sequence</span>
          </Row>
          <Row>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for shortcut</Button>
              </TooltipTrigger>
              <TooltipContent>
                Open search <Kbd>Ctrl K</Kbd>
              </TooltipContent>
            </Tooltip>
          </Row>
        </div>
      ),
      source: `<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover for shortcut</Button>
  </TooltipTrigger>
  <TooltipContent>
    Open search <Kbd>Ctrl K</Kbd>
  </TooltipContent>
</Tooltip>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Kbd and KbdGroup. Neither carries a variant or size prop — Kbd is a single fixed treatment.",
      blocks: [
        {
          label: "Kbd",
          body: (
            <Meta
              items={[
                {
                  k: "(all)",
                  v: "React.ComponentProps<\"kbd\">. Renders a native <kbd> element with data-slot=\"kbd\". No variant, size or state props — this is a display-only label with one fixed appearance.",
                },
              ]}
            />
          ),
        },
        {
          label: "KbdGroup",
          body: (
            <Meta
              items={[
                {
                  k: "(all)",
                  v: "React.ComponentProps<\"div\">, though the rendered element is itself a <kbd> with data-slot=\"kbd-group\" — a group of keys read together, e.g. Ctrl+K, rather than a generic wrapper div.",
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Element",
                  v: "The native <kbd> element, which browsers and assistive tech already recognise as \"keyboard input\" — no role attribute needed.",
                },
                {
                  k: "Not a control",
                  v: "select-none and pointer-events-none keep it out of both the tab sequence and text selection: Kbd documents a shortcut, it does not trigger one. The action it hints at needs its own accessible name elsewhere (an aria-label or aria-keyshortcuts on the actual trigger).",
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
