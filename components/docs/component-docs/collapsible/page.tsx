import { ChevronRight } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "collapsible",
  omitted: {
    responsive: "Collapsible animates its measured height, never its width — the panel takes whatever width its parent gives it and reflows exactly as that content would with no Collapsible at all. There is no breakpoint-specific rule in collapsible.tsx to document separately from the surrounding layout's own.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A single independent disclosure — an advanced filter block that starts closed.",
      render: (
        <Panel label="Collapsible — advanced filters">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Advanced filters
                <Icon icon={ChevronRight} size="sm" tone="subtle" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                {["Volatility", "Print run size", "Pack type", "Card set"].map((f) => (
                  <p key={f} className="type-small text-muted-foreground">
                    {f}
                  </p>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Panel>
      ),
      source: `<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="outline">Advanced filters</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="rounded-lg border p-4">Volatility, print run size, pack type…</div>
  </CollapsibleContent>
</Collapsible>`,
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
      description: "The minimal import and call — defaultOpen for an uncontrolled initial state.",
      language: "tsx",
      code: `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export function AdvancedFilters() {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Advanced filters</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>…</CollapsibleContent>
    </Collapsible>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Collapsible",
          body: (
            <Meta
              items={[
                { k: "defaultOpen / open / onOpenChange", v: "boolean. Radix CollapsiblePrimitive.Root props for uncontrolled or controlled state." },
                { k: "disabled", v: "boolean, native Radix prop. Makes the trigger inert without removing it." },
              ]}
            />
          ),
        },
        {
          label: "CollapsibleTrigger",
          body: (
            <p className="type-small text-muted-foreground">
              No styling of its own — pass <Code>asChild</Code> with a real control
              (<Code>Button</Code> in every specimen here) so the disclosure affordance is a
              first-class interactive element, not a bare div with a click handler.
            </p>
          ),
        },
        {
          label: "CollapsibleContent",
          body: (
            <p className="type-small text-muted-foreground">
              Animates its own measured height on open/close via <Code>anim-expand</Code> /{" "}
              <Code>anim-collapse</Code>, reading Radix&rsquo;s{" "}
              <Code>--radix-collapsible-content-height</Code> through the shared{" "}
              <Code>--unfold-h</Code> indirection — the same keyframes Accordion&rsquo;s
              content uses, pointed at a differently-named Radix variable. That indirection is
              what lets both share one motion definition.
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
                { k: "Trigger", v: "aria-expanded reflects the panel's open state, and aria-controls points at the content's id — both wired by Radix onto whatever element CollapsibleTrigger wraps." },
                {
                  k: "No roving-tabindex",
                  v: "Unlike Accordion, Collapsible has no group of triggers to move focus between — it is a single independent disclosure, so there is nothing to rove across.",
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the trigger in document order — a single stop, since there is only one trigger." },
                { k: "Enter / Space", v: "Toggles the panel (native activation of whatever element the trigger wraps — Button, in every specimen here)." },
                { k: "During disabled", v: "The trigger is inert; activation has no effect." },
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
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
