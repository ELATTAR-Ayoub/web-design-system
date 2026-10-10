/**
 * Authored documentation page for `item`.
 *
 * Replaces the generated baseline. Migrated from the old `base/data` category
 * page (`app/design-system/components/base/data/page.tsx`, since deleted), which held every
 * data-display component's real documentation on one page. Every specimen
 * below renders the real `Item` family from `components/ui/item.tsx` —
 * nothing here is a styled div.
 */

import { ArrowUpRight } from "lucide-react";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "item",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A structured list row: media, content, actions. Used for payment methods, shipment lines and settings rows. Wrap it in ItemGroup, which gives the list and each row their proper ARIA roles — Item never sets a listitem role itself, since asChild routinely turns it into a real <button> or <a>.",
      render: (
        <Panel label="Payment methods" flush>
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <Icon icon={ArrowUpRight} size="md" tone="subtle" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Card ···· 4242</ItemTitle>
                <ItemDescription>Expires 04/29 · Default</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="action">Default</Badge>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </Panel>
      ),
      source: `<ItemGroup>
  <Item>
    <ItemMedia variant="icon">
      <Icon icon={ArrowUpRight} size="md" tone="subtle" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Card ···· 4242</ItemTitle>
      <ItemDescription>Expires 04/29 · Default</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Badge variant="action">Default</Badge>
      <Button variant="ghost" size="sm">Manage</Button>
    </ItemActions>
  </Item>
</ItemGroup>`,
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
      code: `import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function PaymentMethodRow() {
  return (
    <ItemGroup>
      <Item>
        <ItemMedia variant="icon">{/* ... */}</ItemMedia>
        <ItemContent>
          <ItemTitle>Card ···· 4242</ItemTitle>
          <ItemDescription>Expires 04/29</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">Manage</Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "default is borderless, outline adds a visible border, and muted sits on a translucent muted fill — pick the one that matches how much the row needs to separate itself from the list around it.",
      label: "variant",
      render: (
        <div className="space-y-3">
          <Item variant="default">
            <ItemContent>
              <ItemTitle>default</ItemTitle>
              <ItemDescription>border-transparent</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>outline</ItemTitle>
              <ItemDescription>border-border</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>muted</ItemTitle>
              <ItemDescription>bg-muted/50</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ),
      source: `<Item variant="outline">
  <ItemContent>
    <ItemTitle>Row title</ItemTitle>
  </ItemContent>
</Item>`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "default and sm share the same padding and gap; xs tightens both and drops the gap between title and description — reach for it inside a dense surface such as a dropdown menu, which the base class accounts for directly (in-data-[slot=dropdown-menu-content]:p-0).",
      label: "size",
      render: (
        <div className="space-y-3">
          <Item variant="outline" size="default">
            <ItemContent>
              <ItemTitle>default</ItemTitle>
              <ItemDescription>gap-2.5 px-3 py-2.5</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" size="xs">
            <ItemContent>
              <ItemTitle>xs</ItemTitle>
              <ItemDescription>gap-2 px-2.5 py-2, no title/description gap</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ),
      source: `<Item size="xs">
  <ItemContent>
    <ItemTitle>Row title</ItemTitle>
  </ItemContent>
</Item>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A divided list of three rows, using ItemSeparator between them rather than a border on every Item — ItemSeparator passes straight through to Separator, which is decorative by default, so a list containing it stays a valid list.",
      label: "Divided list with ItemSeparator",
      render: (
        <Panel flush>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Card ···· 4242</ItemTitle>
                <ItemDescription>Expires 04/29 · Default</ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item>
              <ItemContent>
                <ItemTitle>Debit card ···· 2087</ItemTitle>
                <ItemDescription>Expires 11/27</ItemDescription>
              </ItemContent>
            </Item>
            <ItemSeparator />
            <Item>
              <ItemContent>
                <ItemTitle>USDC wallet</ItemTitle>
                <ItemDescription>0xA71c…4F2b · Arbitrum</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </Panel>
      ),
      source: `<ItemGroup>
  <Item><ItemContent><ItemTitle>Card ···· 4242</ItemTitle></ItemContent></Item>
  <ItemSeparator />
  <Item><ItemContent><ItemTitle>Debit card ···· 2087</ItemTitle></ItemContent></Item>
</ItemGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Item",
          body: (
            <Meta
              items={[
                { k: "variant", v: '"default" | "outline" | "muted". Default: "default".' },
                { k: "size", v: '"default" | "sm" | "xs". Default: "default". sm is styled identically to default; xs tightens padding and gap.' },
                { k: "asChild", v: "boolean. Default: false. Renders via Radix Slot instead of a <div> — a payment row that is itself a <button> or <a>." },
                { k: "...props", v: "Every other native <div> attribute (or the wrapped element's, under asChild), forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "ItemMedia",
          body: (
            <Meta
              items={[
                { k: "variant", v: '"default" | "icon" | "image". Default: "default". icon forces unsized child <svg>s to size-4; image sizes the media box itself (size-10, stepping down with the parent Item\'s size) and clips a child <img> to cover it.' },
              ]}
            />
          ),
        },
        {
          label: "ItemContent / ItemTitle / ItemDescription",
          body: (
            <Meta
              items={[
                { k: "ItemContent", v: "Flexes to fill remaining width. A second ItemContent in the same Item becomes flex-none rather than sharing the space." },
                { k: "ItemTitle", v: "line-clamp-1 — a title never wraps to a second line." },
                { k: "ItemDescription", v: "line-clamp-2, and renders as a <p>." },
              ]}
            />
          ),
        },
        {
          label: "ItemActions / ItemHeader / ItemFooter",
          body: (
            <Meta
              items={[
                { k: "ItemActions", v: "A trailing flex row for buttons and badges (see the Preview specimen)." },
                { k: "ItemHeader / ItemFooter", v: "Each basis-full and justify-between — for a row whose content wraps onto more than one line, with a header or footer strip that spans the full width." },
              ]}
            />
          ),
        },
        {
          label: "ItemGroup / ItemSeparator",
          body: (
            <Meta
              items={[
                { k: "ItemGroup", v: "role=\"list\", and wraps each real child in its own role=\"listitem\" div — see Accessibility below for why this lives on the group rather than on Item." },
                { k: "ItemSeparator", v: "Separator with orientation=\"horizontal\" and my-2, passed through ItemGroup's child-wrapping untouched since Separator is already decorative (role=\"none\")." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Item is a layout row, not a control — hover and focus-visible only paint when it wraps something interactive.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <Item variant="outline" className="w-full">
                  <ItemContent>
                    <ItemTitle>Row title</ItemTitle>
                  </ItemContent>
                </Item>
              </StateCell>
              <StateCell label="hover" note="asChild over a button/link">
                <Item variant="outline" asChild className="w-full">
                  <button type="button">
                    <ItemContent>
                      <ItemTitle>Row title</ItemTitle>
                    </ItemContent>
                  </button>
                </Item>
              </StateCell>
              <StateCell label="focus-visible" note="asChild — tab to it">
                <Item variant="outline" asChild className="w-full">
                  <button type="button">
                    <ItemContent>
                      <ItemTitle>Row title</ItemTitle>
                    </ItemContent>
                  </button>
                </Item>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>hover</strong> and <strong>focus-visible</strong> only
                paint when Item wraps an interactive child via{" "}
                <Code>asChild</Code> — the base class gates its hover rule on
                an <Code>[a]</Code> or <Code>[button]</Code> descendant
                selector. A plain <Code>{"<div>"}</Code> Item is not focusable
                and has nothing to hover into.
              </p>
              <p className="mt-2">
                <strong>pressed</strong>, <strong>loading</strong>,{" "}
                <strong>success</strong> and <strong>error</strong> are N/A:
                Item is a layout row with no action of its own to press,
                await, or fail at.
              </p>
              <p className="mt-2">
                <strong>disabled</strong> is N/A on Item directly — it has no
                disabled prop. Under <Code>asChild</Code> over a real{" "}
                <Code>{"<button disabled>"}</Code>, the browser&rsquo;s native
                disabled styling and behaviour applies, not anything Item
                contributes.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "ItemGroup renders role=\"list\" and wraps each child in role=\"listitem\" itself — Item never sets that role directly.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Why the group wraps, not Item",
                  v: "Item asChild is routinely a real <button> or <a>, and an explicit listitem role on Item would clobber that control's own semantics — <li><a> is the shape HTML uses for exactly this reason.",
                },
                {
                  k: "Conditional children",
                  v: "ItemGroup guards against React.Children.map running its callback for null, undefined and false as well as real elements: a {condition && <Item/>} that evaluates false is skipped rather than wrapped as an empty announced listitem.",
                },
                {
                  k: "ItemSeparator inside the list",
                  v: "Passed through without a listitem wrapper — Separator already renders role=\"none\" by default, and a list may contain non-listitem children like a visual divider.",
                },
                {
                  k: "Accessible name",
                  v: "Comes from ItemTitle's text content read in document order; there is no separate accessible-name prop on Item itself.",
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
        "Item itself places no element in the tab sequence — keyboard behaviour comes from whatever asChild wraps, or from elements placed in ItemActions.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Plain Item", v: "No keyboard interaction — nothing focusable unless ItemActions holds a control." },
                { k: "asChild over a button/link", v: "Standard Tab / Enter / Space behaviour of the wrapped element, unchanged by Item." },
                { k: "ItemActions", v: "Each action (a Button, a link) is reached in document order after the row's own content, same as any other inline control." },
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
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              Item is <Code>flex w-full flex-wrap</Code> — content wraps onto
              a second line at narrow widths rather than overflowing, and{" "}
              <Code>ItemHeader</Code> / <Code>ItemFooter</Code> (
              <Code>basis-full</Code>) are the pieces meant to carry that
              wrapped content across the row&rsquo;s full width.
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
