import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note } from "@/components/ds/kit";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PackCardShowcase } from "./card-showcase";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "card",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A pack card the reader can open. \"Open pack\" pulls a real card from the pool — the badge flips from Sealed to Opened, and the body swaps to what landed. A product builds its own richer cards on top of this one rather than forking it, so a token change still reaches them.",
      render: <PackCardShowcase />,
      source: `const [pull, setPull] = useState<Pull | null>(null);

function open() {
  setPull(POOL[Math.floor(Math.random() * POOL.length)]);
}

<Card className="max-w-sm">
  <CardHeader>
    <CardTitle asChild>
      <h4>Eclipse Vault</h4>
    </CardTitle>
    <CardDescription>Series I · 6 cards per pack</CardDescription>
    <CardAction>
      <Badge variant={pull ? "success" : "premium"}>{pull ? "Opened" : "Sealed"}</Badge>
    </CardAction>
  </CardHeader>
  <CardContent>
    {pull ? (
      <div className="flex items-center justify-between">
        <div>
          <p className="type-small text-muted-foreground">You pulled</p>
          <p className="type-body text-foreground">{pull.name}</p>
        </div>
        <span className="type-number-md text-value-ink">{pull.value}</span>
      </div>
    ) : (
      <div className="flex items-baseline justify-between">
        <span className="type-small text-muted-foreground">Contents</span>
        <span className="type-small text-muted-foreground">Hidden until opened</span>
      </div>
    )}
  </CardContent>
  <CardFooter>
    <Button className="w-full" onClick={open}>
      {pull ? "Open another" : "Open pack"}
    </Button>
  </CardFooter>
</Card>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <Note tone="action" title="Card is a dependency, not a direct install target">
          The registry resolves <Code>card</Code>, but it is pulled in
          by whatever owns it rather than offered as an install target of its
          own — it arrives already resolved
          with the item that needs it, at the right version.
        </Note>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description: "CardTitle asChild renders the title as whatever heading level the page needs — a card is a surface, not a heading level.",
      language: "tsx",
      code: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CompetitionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle asChild>
          <h4>Weekly competition</h4>
        </CardTitle>
        <CardDescription>Ends in 2 days, 14 hours.</CardDescription>
      </CardHeader>
      <CardContent>{/* ... */}</CardContent>
    </Card>
  );
}`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "The size prop switches the --card-spacing custom property that every region's padding and gap read from — default (16px) or sm (12px). There is no third size and no variant axis; a card is one visual chassis.",
      label: "size",
      render: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default</CardTitle>
              <CardDescription>16px spacing.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="type-small text-muted-foreground">size=&quot;default&quot;</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Compact</CardTitle>
              <CardDescription>12px spacing, smaller title.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="type-small text-muted-foreground">size=&quot;sm&quot;</p>
            </CardContent>
          </Card>
        </div>
      ),
      source: `<Card size="sm">
  <CardHeader>
    <CardTitle>Compact</CardTitle>
  </CardHeader>
</Card>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A card of figures, laid out with CardContent's own grid rather than a second Stat inside every cell — the figures here are simple key/value pairs, not the full delta-carrying Stat component.",
      label: "Card of figures",
      render: (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Your collection</CardTitle>
            <CardDescription>Across 8 card sets.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-5">
            {[
              ["Total value", "$12,480.65"],
              ["Cards owned", "1,284"],
              ["Packs opened", "412"],
              ["Best pull", "$4,900.00"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="type-small text-muted-foreground">{k}</p>
                <p className="type-number-md mt-1.5 text-foreground">{v}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ),
      source: `<Card>
  <CardHeader>
    <CardTitle>Your collection</CardTitle>
    <CardDescription>Across 8 card sets.</CardDescription>
  </CardHeader>
  <CardContent className="grid grid-cols-2 gap-5">
    <div>
      <p className="type-small text-muted-foreground">Total value</p>
      <p className="type-number-md mt-1.5 text-foreground">$12,480.65</p>
    </div>
  </CardContent>
</Card>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Every region forwards its remaining props to a plain <div>, except CardTitle, which can render as any element via asChild.",
      blocks: [
        {
          label: "Card",
          body: (
            <Meta
              items={[
                { k: "size", v: '"default" | "sm". Default: "default". Drives the shared --card-spacing custom property every child region reads its padding and gap from.' },
                { k: "...props", v: "Every native <div> attribute, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "CardHeader / CardContent / CardFooter",
          body: (
            <Meta
              items={[
                { k: "CardHeader", v: "A @container grid that reflows to two columns automatically when a CardAction is present, and reserves a second row when a CardDescription is present." },
                { k: "CardContent", v: "Horizontal padding only, matching --card-spacing." },
                { k: "CardFooter", v: "A bordered, muted strip — border-t bg-muted/50 — for the card's primary action." },
              ]}
            />
          ),
        },
        {
          label: "CardTitle",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>asChild</Code>: boolean, default <Code>false</Code>. Card
              is a surface, not a heading level — which heading (
              <Code>h2</Code> through <Code>h6</Code>, or none at all) depends
              on where the card sits on the page, so <Code>CardTitle</Code>{" "}
              renders a plain <Code>{"<div>"}</Code> unless{" "}
              <Code>asChild</Code> is passed a real heading element, as in the
              Preview specimen above. Without it, a page built from cards has
              no outline at all.
            </p>
          ),
        },
        {
          label: "CardDescription / CardAction",
          body: (
            <Meta
              items={[
                { k: "CardDescription", v: "Muted, small text beneath the title." },
                { k: "CardAction", v: "Grid-positioned to the header's top-right (col-start-2 row-span-2) — for a badge, a menu trigger, or a close control that sits beside the title rather than below it." },
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
                { k: "Role", v: "None implicit — every region is a plain <div>. Card contributes no landmark or heading structure on its own." },
                { k: "Heading outline", v: "CardTitle asChild is what gives a card a real place in the page's heading outline — see API Reference above. A page of cards whose titles are all <div>s has nothing to navigate by." },
                { k: "Interactive cards", v: "When a card acts as a link or button, wrap it — Card itself never becomes one. The wrapper is then responsible for its own role, focusability and accessible name." },
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
      description: "Card places no element in the tab sequence on its own.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A on Card directly. Keyboard behaviour belongs to whatever
              interactive elements a caller places inside it (a{" "}
              <Code>Button</Code> in the footer, as in the Preview specimen)
              or wraps around it (a navigating card).
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
        "Card has no breakpoint classes at all — it is a fluid block that stretches to whatever width its container gives it, and the one layout change it makes (a second header column for CardAction) is driven by content, not viewport.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Width",
                  v: "No max-width and no w-* class in card.tsx itself — a Card is exactly as wide as its container at every width measured; the Preview specimen's max-w-sm and the figures example's grid-cols-2 are call-site classes, not something Card imposes.",
                },
                {
                  k: "CardHeader's @container",
                  v: "@container/card-header is declared on the header, but the grid switch it drives (has-data-[slot=card-action]:grid-cols-[1fr_auto]) fires on the PRESENCE of a CardAction, not on a container-query breakpoint — no @sm:/@md: rule is defined against it in this file, so the container context exists but is not yet load-bearing for a size-based reflow.",
                },
                {
                  k: "200% zoom",
                  v: "CardTitle and CardDescription both wrap rather than truncate, so doubled text grows the card's height instead of clipping — measured with no overflow.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL.",
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
