/**
 * Authored documentation page for `context-menu`.
 *
 * Replaces the generated baseline. Migrated from the old `base/menus` category
 * page (`app/design-system/components/base/menus/page.tsx`, since deleted). Every specimen
 * renders the real `ContextMenu` composition from
 * `components/ui/context-menu.tsx` — nothing here is a styled div.
 *
 * See `components/docs/component-docs/menu/page.tsx` for why there is no
 * shared "menu" module between this, DropdownMenu and Menubar.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Panel } from "@/components/ds/kit";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { ContextMenuShowcase } from "./context-menu-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "context-menu",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "Right-click the card. Toggle \"Track price\", or open Shipping and pick a real speed — both are live state. A context menu is always a shortcut to actions that exist elsewhere too — never the only route to something, since a touch user cannot right-click.",
      render: (
        <Panel label="Right-click the card">
          <ContextMenuShowcase />
        </Panel>
      ),
      source: `"use client";
const [trackPrice, setTrackPrice] = useState(false);
const [shipping, setShipping] = useState("standard");

<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="grid h-40 place-items-center rounded-lg border">Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-60">
    <ContextMenuItem>
      Favourite
      <ContextMenuShortcut><Kbd>F</Kbd></ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuCheckboxItem checked={trackPrice} onCheckedChange={setTrackPrice}>
      Track price
    </ContextMenuCheckboxItem>
    <ContextMenuItem>Share pull</ContextMenuItem>
    <ContextMenuItem disabled disabledReason="Sign in to list this card for trade.">
      List for trade
    </ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Shipping</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuLabel>Speed</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={shipping} onValueChange={setShipping}>
          <ContextMenuRadioItem value="standard">Standard — 5 days</ContextMenuRadioItem>
          <ContextMenuRadioItem value="expedited">Expedited — 2 days</ContextMenuRadioItem>
          <ContextMenuRadioItem value="overnight">Overnight</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Sell for $1,240.00</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function CardContextMenu({ children }: { children: React.ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Favourite</ContextMenuItem>
        <ContextMenuItem>Share pull</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The same four item kinds DropdownMenu offers, because the two components are one vocabulary reached by two gestures. A label names a group; a group keeps related items together for the screen reader as well as the eye.",
      label: "Groups, labels and stateful items",
      render: (
        <Panel label="Right-click the Stash background">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="grid h-40 max-w-xs cursor-context-menu place-items-center rounded-lg border border-border bg-card">
                <p className="type-small text-muted-foreground">Right-click the background</p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-60">
              <ContextMenuLabel>Show</ContextMenuLabel>
              <ContextMenuGroup>
                <ContextMenuCheckboxItem checked>Sold cards</ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem>Shipped cards</ContextMenuCheckboxItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuLabel>Sort by</ContextMenuLabel>
              <ContextMenuRadioGroup value="value">
                <ContextMenuRadioItem value="value">Highest value</ContextMenuRadioItem>
                <ContextMenuRadioItem value="recent">Recently acquired</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuContent>
          </ContextMenu>
        </Panel>
      ),
      source: `<ContextMenuLabel>Show</ContextMenuLabel>
<ContextMenuGroup>
  <ContextMenuCheckboxItem checked>Sold cards</ContextMenuCheckboxItem>
  <ContextMenuCheckboxItem>Shipped cards</ContextMenuCheckboxItem>
</ContextMenuGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every part forwards to its Radix ContextMenuPrimitive counterpart beyond the className merge documented below.",
      blocks: [
        {
          label: "ContextMenuContent",
          body: (
            <Meta
              items={[
                {
                  k: "collisionPadding",
                  v: 'number. Default: 8. A context menu opens at the pointer rather than against a trigger box, so at a narrow viewport an uncapped panel can run past the screen edge — collisionPadding is the primitive\'s own answer to that, not a re-implementation.',
                },
                { k: "...props", v: "Every Radix ContextMenuPrimitive.Content prop, forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "ContextMenuItem",
          body: (
            <Meta
              items={[
                { k: "variant", v: '"default" | "destructive". Default: "default". Destructive items go last, after a separator.' },
                { k: "inset", v: "boolean. Adds left padding to align with items that carry an indicator." },
                { k: "disabledReason", v: "Why a disabled item can't be chosen, surfaced via components/ui/disabled.tsx (aria mode — the row is a Radix role=\"menuitem\" div, not a native-disableable element): an always-on aria-describedby plus a click/tap-reachable popover beside the row, without disturbing arrow-key navigation." },
              ]}
            />
          ),
        },
        {
          label: "ContextMenuCheckboxItem / ContextMenuRadioItem",
          body: (
            <Meta
              items={[
                { k: "checked", v: "boolean, for ContextMenuCheckboxItem — controlled." },
                { k: "value", v: "string, for ContextMenuRadioItem — its value within the enclosing ContextMenuRadioGroup." },
                { k: "disabledReason", v: "Same reason surface as ContextMenuItem." },
              ]}
            />
          ),
        },
        {
          label: "ContextMenuSub",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>ContextMenuSub</Code> + <Code>ContextMenuSubTrigger</Code> +{" "}
              <Code>ContextMenuSubContent</Code>. One nesting level only — a deeper
              hierarchy belongs in a dialog.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "Built directly on Radix ContextMenuPrimitive.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Content role", v: 'menu. Items are role="menuitem", role="menuitemcheckbox" or role="menuitemradio" to match the item kind.' },
                {
                  k: "Trigger",
                  v: "Opens on right-click or the keyboard menu key, in addition to the pointer gesture — never the only route to an action, since a touch user cannot reach a right-click.",
                },
                { k: "Disabled items", v: "Announced but not actionable, and skipped by arrow-key navigation." },
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
      description: "Radix's own menu keyboard model — a roving-tabindex list, shared in shape with DropdownMenu and Menubar.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Shift+F10 / Menu key", v: "Opens the menu at the host element's focus position, for a keyboard user who cannot right-click." },
                { k: "↑ / ↓", v: "Moves focus between items, wrapping at the ends." },
                { k: "→", v: "Opens a ContextMenuSub and moves focus into it." },
                { k: "←", v: "Closes an open ContextMenuSub and returns focus to its trigger item." },
                { k: "Enter / Space", v: "Activates the focused item, or toggles a checkbox/radio item, and closes the menu." },
                { k: "Esc", v: "Closes the menu and returns focus to the host element." },
                { k: "Typeahead", v: "Typing jumps to the next item whose label starts with the typed character." },
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
        "A context menu opens at the pointer rather than against a trigger box, so the panel that keeps it on-screen has to react to where the click landed, not just to the viewport width.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Collision-aware sizing",
                  v: "ContentContent's max-h and max-w read Radix's own --radix-context-menu-content-available-height/-width, recalculated against collisionPadding (8px) on open — a right-click near the edge of a 375px screen gets a panel clamped to what is actually left, not one that runs off it.",
                },
                {
                  k: "Side flip",
                  v: "data-[side=*] slide-in classes cover all four sides, because Radix can flip the panel to whichever side of the pointer has room — bottom is only the common case, not the only one.",
                },
                {
                  k: "Internal scroll",
                  v: "overflow-y-auto on Content means a long list scrolls inside the fixed max-height rather than growing the page — measured with no document overflow at 375, 768, 1440 and 1920.",
                },
                {
                  k: "No right-click on touch",
                  v: "The panel's own sizing is not the touch story — see Accessibility and Keyboard above for the keyboard-menu-key fallback a touch or keyboard user reaches for instead of a right-click.",
                },
                {
                  k: "RTL",
                  v: "min-w-36 and the side/align logic are directional-aware through Radix's own DirectionProvider integration — collision detection flips sides relative to reading direction, not a hard-coded left/right.",
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
