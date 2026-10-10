import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "accordion",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "type=\"single\" collapsible — an FAQ, where only one answer should be open at a time.",
      render: (
        <Panel label="Accordion — FAQ">
          <Accordion type="single" collapsible defaultValue="odds">
            <AccordionItem value="odds">
              <AccordionTrigger>How are the odds decided?</AccordionTrigger>
              <AccordionContent>
                Every card in a pack is rolled independently against the published rarity
                table. The table is shown on each pack&rsquo;s detail page before you buy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sell">
              <AccordionTrigger>Can I sell a card back?</AccordionTrigger>
              <AccordionContent>
                Yes. Sell-back is offered at the card&rsquo;s current listed value, and the
                amount is credited to your available balance immediately.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ship">
              <AccordionTrigger>How does shipping work?</AccordionTrigger>
              <AccordionContent>
                Request a shipment from your Stash. Cards are pulled from the vault, graded,
                and dispatched together.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Panel>
      ),
      source: `<Accordion type="single" collapsible defaultValue="odds">
  <AccordionItem value="odds">
    <AccordionTrigger>How are the odds decided?</AccordionTrigger>
    <AccordionContent>
      Every card is rolled independently against the published rarity table.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
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
      code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <Accordion type="single" collapsible defaultValue="odds">
      <AccordionItem value="odds">
        <AccordionTrigger>How are the odds decided?</AccordionTrigger>
        <AccordionContent>…</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "single closes the open item when another opens; multiple keeps every open panel open independently. collapsible (single only) lets the last open item close instead of always keeping one open.",
      label: "type=\"single\" vs type=\"multiple\"",
      render: (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel label="single, collapsible">
            <Accordion type="single" collapsible>
              <AccordionItem value="a">
                <AccordionTrigger>Grading turnaround</AccordionTrigger>
                <AccordionContent>
                  Eight working days from the vault receiving the card.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>Return policy</AccordionTrigger>
                <AccordionContent>Sealed packs only, within 14 days of purchase.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>
          <Panel label="multiple" note="several open at once">
            <Accordion type="multiple" defaultValue={["fees", "limits"]}>
              <AccordionItem value="fees">
                <AccordionTrigger>What are the selling fees?</AccordionTrigger>
                <AccordionContent>
                  Five per cent of the sale price, taken at settlement. Nothing is charged on
                  a listing that does not sell.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="limits">
                <AccordionTrigger>Is there a withdrawal limit?</AccordionTrigger>
                <AccordionContent>
                  Two thousand pounds a day while an account is new, lifted after the first
                  settled month.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>
        </div>
      ),
      source: `<Accordion type="single" collapsible>{/* one open at a time, or none */}</Accordion>
<Accordion type="multiple" defaultValue={["fees", "limits"]}>{/* several open at once */}</Accordion>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "A disabled item stays on the page, present and legible, rather than being removed while its content is not yet available.",
      label: "A disabled item",
      render: (
        <Panel label="Accordion — a disabled item" note="present, inert, and legible">
          <Accordion type="single" collapsible>
            <AccordionItem value="open">
              <AccordionTrigger>Grading turnaround</AccordionTrigger>
              <AccordionContent>Eight working days from the vault receiving the card.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="closed" disabled>
              <AccordionTrigger>Insurance claims &mdash; opens Monday</AccordionTrigger>
              <AccordionContent>Not available yet.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Panel>
      ),
      source: `<AccordionItem value="closed" disabled>
  <AccordionTrigger>Insurance claims — opens Monday</AccordionTrigger>
  <AccordionContent>Not available yet.</AccordionContent>
</AccordionItem>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Accordion",
          body: (
            <Meta
              items={[
                { k: "type", v: '"single" | "multiple", required. single closes the open item when another opens; multiple keeps every open panel open independently.' },
                { k: "collapsible", v: 'boolean, single only. Lets the open item close by clicking it again, leaving none open. Without it, one item is always open.' },
                { k: "defaultValue / value / onValueChange", v: "string (single) or string[] (multiple). Radix AccordionPrimitive.Root props for uncontrolled or controlled selection." },
              ]}
            />
          ),
        },
        {
          label: "AccordionItem",
          body: (
            <Meta
              items={[
                { k: "value", v: "string, required. Identifies the item within its Accordion's selection." },
                { k: "disabled", v: "boolean. Keeps the row on the page and makes its trigger inert. Prefer it to removing an item that is coming back." },
              ]}
            />
          ),
        },
        {
          label: "AccordionTrigger / AccordionContent",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>AccordionTrigger</Code> renders inside an{" "}
              <Code>AccordionPrimitive.Header</Code> (an h3-equivalent) with the chevron built
              in — pass only the trigger text as children. <Code>AccordionContent</Code>{" "}
              animates its own measured height (see Keyboard/States sources) rather than a
              canned keyframe.
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
                { k: "Trigger", v: "A real <button>, wrapped in an h3-equivalent AccordionPrimitive.Header, with aria-expanded reflecting open state." },
                { k: "Content", v: "The panel's region is associated with its trigger via Radix's own id wiring." },
                { k: "Disabled item", v: "The trigger stays in the tree but is inert — removed from the interactive path without disappearing from the accessibility tree." },
                { k: "Chevron", v: "Decorative — the muted tone, not the trigger's own ink, since a disclosure's words should outweigh its arrow." },
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
                { k: "Tab / Shift+Tab", v: "Moves focus to and from the accordion's triggers in document order." },
                { k: "↑ / ↓", v: "Moves focus between triggers, wrapping at the ends." },
                { k: "Home / End", v: "Jumps focus to the first / last trigger." },
                { k: "Enter / Space", v: "Toggles the focused trigger's panel." },
                { k: "Disabled items", v: "AccordionTrigger renders a real <button disabled>, so it is removed from the Tab sequence by the platform itself and Enter/Space has no effect — the same native behaviour as any other disabled button in this system." },
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
        "An accordion has no width or breakpoint logic of its own — it is a full-width block that follows whatever column it is placed in, and its only size axis is the height each panel measures itself to.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Width",
                  v: "w-full with no max-width and no breakpoint classes in accordion.tsx — the trigger row and the panel both stretch to fill their container at every width measured (375, 768, 1440, 1920), rather than capping or centering themselves.",
                },
                {
                  k: "200% text zoom",
                  v: "The trigger's chevron is a fixed-size icon beside wrapping text, not a fixed-width column, so a doubled label wraps to a second line rather than clipping or pushing the chevron off the edge — measured with no overflow at 200% zoom.",
                },
                {
                  k: "RTL",
                  v: "The chevron flips with the logical direction (it is positioned and rotated off logical, not physical, edges), and the disclosure measured with no overflow under a right-to-left document.",
                },
                {
                  k: "Overflow",
                  v: "AccordionContent clips to its own measured height via overflow-hidden (see the States note above on why that height tracks the panel's real content); nothing about the row escapes its own box at any width in the ledger.",
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
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
