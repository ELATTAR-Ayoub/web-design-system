import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Row } from "@/components/ds/kit";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { DropdownMenuShowcase } from "./dropdown-menu-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "dropdown-menu",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The account menu, live: check \"Notify on price drops\" on or off, open Preferences and pick an appearance, and read why Transfer funds is disabled. Destructive items sit last, below a separator, so a mis-click cannot reach them.",
      render: (
        <Row className="justify-center">
          <DropdownMenuShowcase />
        </Row>
      ),
      source: `"use client";
const [notifyOnDrops, setNotifyOnDrops] = useState(true);
const [appearance, setAppearance] = useState("system");

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="gap-2.5 px-2">
      <Avatar className="size-7">
        <AvatarFallback className="type-number-sm">VW</AvatarFallback>
      </Avatar>
      <span className="type-small text-foreground">voidwing</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-64">
    <DropdownMenuLabel>
      <span className="block text-foreground">voidwing</span>
      <span className="type-small mt-1 flex items-center gap-1.5 text-muted-foreground">
        <Icon icon={ShieldCheck} size="xs" tone="success" />
        Verified · Rank 24
      </span>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Icon icon={Wallet} size="sm" tone="subtle" />
      Wallet
      <DropdownMenuShortcut><Kbd>⌘W</Kbd></DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem disabled disabledReason="Settle your balance first.">
      Transfer funds
    </DropdownMenuItem>
    <DropdownMenuCheckboxItem checked={notifyOnDrops} onCheckedChange={setNotifyOnDrops}>
      <Icon icon={Bell} size="sm" tone="subtle" />
      Notify on price drops
    </DropdownMenuCheckboxItem>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Icon icon={Settings} size="sm" tone="subtle" />
        Preferences
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={appearance} onValueChange={setAppearance}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Icon icon={LogOut} size="sm" tone="inherit" />
      Sign out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
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
        "A minimal account menu — trigger, a couple of items, a destructive item set apart by a separator.",
      language: "tsx",
      code: `import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Wallet</DropdownMenuItem>
        <DropdownMenuItem>Favourites</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Checkbox items for independent toggles, radio items for one-of-many — the same rule as the selection controls, in menu form.",
      label: "Checkbox and radio items",
      render: (
        <Row>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Rarity</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Value</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Condition</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Acquired</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel>Sort cards by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="value">
                <DropdownMenuRadioItem value="value">Highest value</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rarity">Rarity</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="recent">Recently acquired</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      ),
      source: `<DropdownMenuCheckboxItem checked>Rarity</DropdownMenuCheckboxItem>

<DropdownMenuRadioGroup value="value">
  <DropdownMenuRadioItem value="value">Highest value</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="rarity">Rarity</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every part forwards to its Radix DropdownMenuPrimitive counterpart beyond the className merge documented below.",
      blocks: [
        {
          label: "DropdownMenuItem",
          body: (
            <Meta
              items={[
                {
                  k: "variant",
                  v: '"default" | "destructive". Default: "default". Destructive items go last, after a separator.',
                },
                { k: "inset", v: "boolean. Adds left padding to align with items that carry a checkbox/radio indicator." },
                { k: "disabledReason", v: "Why a disabled item can't be chosen, surfaced via components/ui/disabled.tsx (aria mode — the row is a Radix role=\"menuitem\" div, not a native-disableable element): an always-on aria-describedby plus a click/tap-reachable popover beside the row, without disturbing arrow-key navigation. Kept in parity with ContextMenuItem and MenubarItem." },
                { k: "...props", v: "Every Radix DropdownMenuPrimitive.Item prop (onSelect, disabled, etc.), forwarded directly." },
              ]}
            />
          ),
        },
        {
          label: "DropdownMenuCheckboxItem / DropdownMenuRadioItem",
          body: (
            <Meta
              items={[
                { k: "checked", v: "boolean, for DropdownMenuCheckboxItem — controlled." },
                { k: "value", v: "string, for DropdownMenuRadioItem — its value within the enclosing DropdownMenuRadioGroup." },
                { k: "inset", v: "boolean. Same alignment role as on DropdownMenuItem." },
                { k: "disabledReason", v: "Same reason surface as DropdownMenuItem." },
              ]}
            />
          ),
        },
        {
          label: "DropdownMenuShortcut",
          body: (
            <p className="type-small text-muted-foreground">
              Right-aligned slot. Used for keyboard hints — the account menu preview
              above wraps a real <Code>Kbd</Code> in it for Wallet&rsquo;s{" "}
              <Code>⌘W</Code> — and for live figures like a balance, not decoration.
            </p>
          ),
        },
        {
          label: "DropdownMenuSub",
          body: (
            <p className="type-small text-muted-foreground">
              <Code>DropdownMenuSub</Code> + <Code>DropdownMenuSubTrigger</Code> +{" "}
              <Code>DropdownMenuSubContent</Code>. One nesting level only — a deeper
              hierarchy belongs in a dialog.
            </p>
          ),
        },
        {
          label: "DropdownMenuContent",
          body: (
            <Meta
              items={[
                { k: "align", v: '"start" | "center" | "end". Default: "start".' },
                { k: "sideOffset", v: "number, px. Default: 4." },
                { k: "...props", v: "Every Radix DropdownMenuPrimitive.Content prop, forwarded directly." },
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
        "Built directly on Radix DropdownMenuPrimitive — the roles and relationships below are the primitive's, unmodified by this system's wrapper.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Trigger", v: 'Carries aria-haspopup and aria-expanded, reflecting the open/closed state.' },
                { k: "Content role", v: 'menu. Items are role="menuitem", role="menuitemcheckbox" or role="menuitemradio" to match the item kind.' },
                {
                  k: "Disabled items",
                  v: "A disabled DropdownMenuItem is announced but not actionable and is skipped by arrow-key navigation.",
                },
                {
                  k: "Focus on open",
                  v: "Opening the menu moves focus to the first item (or the checked item, for a radio/checkbox group).",
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
      description: "Radix's own menu keyboard model — a roving-tabindex list, not reimplemented here.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Enter / Space / ↓", v: "Opens the trigger and moves focus to the first item." },
                { k: "↑ / ↓", v: "Moves focus between items in the open menu, wrapping at the ends." },
                { k: "→", v: "Opens a DropdownMenuSub and moves focus into it." },
                { k: "←", v: "Closes an open DropdownMenuSub and returns focus to its trigger item." },
                { k: "Enter / Space", v: "Activates the focused item, or toggles a checkbox/radio item, and closes the menu." },
                { k: "Esc", v: "Closes the menu and returns focus to the trigger." },
                { k: "Typeahead", v: "Typing jumps to the next item whose label starts with the typed character." },
                { k: "Disabled items", v: "Skipped entirely by arrow-key traversal." },
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
        "DropdownMenuContent's own sizing is anchored to its trigger, not to the viewport — the panel is only ever as constrained as the space around wherever the trigger sits.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Width",
                  v: "w-(--radix-dropdown-menu-trigger-width) with a min-w-40 floor — the account menu preview matches its avatar-and-name trigger's width rather than an arbitrary fixed panel width.",
                },
                {
                  k: "Collision-aware height",
                  v: "max-h-(--radix-dropdown-menu-content-available-height), recalculated on open, plus overflow-y-auto — a long list (many columns to toggle, a long sort list) scrolls inside that cap instead of running past the bottom of a 375px screen.",
                },
                {
                  k: "Side flip",
                  v: "The data-[side=*] slide-in classes cover all four sides — Radix repositions the panel to whichever side of the trigger has room, which matters most near the top or bottom edge of a short viewport.",
                },
                {
                  k: "RTL",
                  v: "align=\"start\" resolves relative to reading direction through Radix's DirectionProvider integration — under an RTL DirectionProvider the account menu in the Preview above opens toward the opposite physical edge, not a hard-coded left.",
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
