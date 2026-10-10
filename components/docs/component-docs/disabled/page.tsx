import { Code, Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Button } from "@/components/ui/button";
import { Disabled } from "@/components/ui/disabled";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DisabledShowcase } from "./disabled-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "disabled",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A native-disabled button, wrapped so the reason is reachable by keyboard and by touch — the small info trigger beside it, not the button itself, carries the explanation. Check the box below to satisfy the condition and watch Checkout enable for real.",
      label: "Native mode — toggle the condition",
      render: <DisabledShowcase />,
      source: `const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

<Disabled
  disabled={!hasPaymentMethod}
  reason="Add a payment method to enable checkout."
>
  <Button disabled={!hasPaymentMethod}>Checkout</Button>
</Disabled>

<Checkbox
  checked={hasPaymentMethod}
  onCheckedChange={(checked) => setHasPaymentMethod(checked === true)}
/>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <Note>
          Most disabled controls do not need this at all — plain{" "}
          <Code>disabled:opacity-50</Code>, already on every base component, is
          correct on its own. Reach for <Code>Disabled</Code> only when a real,
          actionable reason exists and is worth surfacing.
        </Note>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Native disabled stays native: Disabled never sets or clears the child's own disabled attribute. It only adds the reason surface beside it and wires aria-describedby onto the child.",
      language: "tsx",
      code: `import { Disabled } from "@/components/ui/disabled";
import { Button } from "@/components/ui/button";

<Disabled disabled={!formIsValid} reason="Fill every required field to save.">
  <Button disabled={!formIsValid}>Save</Button>
</Disabled>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "mode=\"aria\" is for a compound widget with no native disabled attribute to carry — here, a DropdownMenuItem. The child stays focusable and in the tab order; Disabled blocks its onClick and Enter/Space instead.",
      label: "aria mode — a menu item with no native disabled",
      render: (
        <Row>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Project actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <Disabled mode="aria" disabled reason="Only the project owner can archive it.">
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </Disabled>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      ),
      source: `<Disabled mode="aria" disabled reason="Only the project owner can archive it.">
  <DropdownMenuItem>Archive</DropdownMenuItem>
</Disabled>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Disabled",
          body: (
            <Meta
              items={[
                { k: "disabled", v: "boolean — required. Whether the wrapped control is currently disabled." },
                {
                  k: "reason",
                  v: "string, optional. A sentence a user can act on — \"Add a payment method to enable this\", not \"Disabled\". Omitted: the wrapper still does its cursor and DOM-stability work, but there is no reason surface to discover.",
                },
                {
                  k: "mode",
                  v: (
                    <>
                      <Code>&quot;native&quot;</Code> (default) or{" "}
                      <Code>&quot;aria&quot;</Code>. Native: the child already carries a
                      real <Code>disabled</Code> attribute. Aria: the child cannot carry
                      one at all (a menu item, a tab, a composite option) — see Examples.
                    </>
                  ),
                },
                {
                  k: "onDisabledAttempt",
                  v: "() => void, optional. Fires on a blocked activation attempt — always on the aria path; on the native path only if the reason trigger's own interaction is wired to it, since a real disabled attribute blocks the control before any handler could observe the attempt.",
                },
                { k: "children", v: "React.ReactElement — required. The single control this wraps." },
                { k: "className", v: "string, optional. Applied to the wrapping <span>." },
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
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "disabled, no reason", v: "Cursor turns not-allowed over the whole wrapper; no reason surface is rendered at all." },
                { k: "disabled, with reason", v: "The info trigger is focusable and tappable; aria-describedby is wired onto the child at all times." },
                { k: "enabled", v: "The reason trigger is present in the DOM but non-interactive (aria-hidden, tabIndex={-1}, disabled) — never unmounted, so focus is never thrown when a control flips mid-session." },
              ]}
            />
          ),
        },
        {
          body: (
            <Note tone="action" title="Why the DOM never swaps">
              The wrapper, the child, the hidden description node and the reason
              trigger are present in the same order whether <Code>disabled</Code> is
              true or false — only attributes toggle. A screen reader treats a
              replaced subtree as a brand-new element and silently loses the
              user&rsquo;s place; toggling attributes on a stable element keeps that
              place intact.
            </Note>
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
                  k: "aria-describedby",
                  v: "The reason is placed in a permanently visually-hidden node associated via aria-describedby, merged with any aria-describedby the caller already set — so a screen-reader user hears the reason as part of the control's own description without opening anything.",
                },
                {
                  k: "Discovery for sighted / touch users",
                  v: "A Popover, not a Tooltip — Popover opens on click/tap as well as Enter/Space on focus, which a hover-only Tooltip cannot reach for a touch screen or a disabled control that cannot itself receive focus.",
                },
                {
                  k: "aria mode",
                  v: "Sets aria-disabled and data-disabled on the child and keeps it focusable and in the tab order, matching how a screen reader actually encounters a disabled composite-widget item.",
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
                { k: "Tab", v: "Native mode: moves to the reason trigger when disabled and a reason is set (the child itself is unreachable, as a real disabled control should be). Aria mode: moves to the child itself, which stays in the tab order." },
                { k: "Enter / Space on the reason trigger", v: "Opens the reason Popover." },
                { k: "Enter / Space on an aria-mode child", v: "Blocked while disabled — preventDefault and stopPropagation fire, and onDisabledAttempt is called instead of the child's own handler." },
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
        "Disabled has two moving parts across a viewport: the wrapper's own width, and where the reason Popover lands once opened. Neither is hand-tuned per breakpoint — both fall out of properties already set in disabled.tsx and the shared Popover.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "The wrapper",
                  v: "min-w-0 max-w-full on the outer <span> lets it shrink inside a narrow flex or grid cell instead of forcing its row to overflow — the reason trigger stays a fixed-size icon button beside whatever the wrapped control does at that width.",
                },
                {
                  k: "The reason popover",
                  v: 'A plain PopoverContent (w-64), so it repositions using the same Radix collision detection as every other popover in the system — it flips side and clamps to the viewport rather than running off the edge of a 375px screen.',
                },
                {
                  k: "Touch target",
                  v: "The info trigger is an icon-xs Button with after:-inset-2.5 extending its hit area, so it reaches a comfortable tap size on a phone without growing the visible glyph.",
                },
                {
                  k: "RTL",
                  v: "The trigger sits after the child in source order and reads gap-1.5 from the wrapper's flex row — under an RTL DirectionProvider the row itself mirrors along with the rest of the layout; nothing in disabled.tsx hard-codes a physical left/right offset.",
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
