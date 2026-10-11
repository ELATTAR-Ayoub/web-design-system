import { Heart, Share2 } from "lucide-react";

import { Code, Note, Panel, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { meta } from "./meta";

function DropdownMenuSpecimen() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ContextMenuSpecimen() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="grid h-24 w-full cursor-context-menu place-items-center rounded-lg border border-dashed border-border text-center">
          <span className="type-small text-muted-foreground">Right-click this card</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          <Icon icon={Heart} size="sm" tone="subtle" />
          Favourite
        </ContextMenuItem>
        <ContextMenuItem>
          <Icon icon={Share2} size="sm" tone="subtle" />
          Share pull
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function MenubarSpecimen() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Packs</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New pack</MenubarItem>
          <MenubarItem>Import card set</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Publish queue</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Users</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Search users</MenubarItem>
          <MenubarItem>Verification queue</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export const spec: ComponentDocSpec = {
  name: "menu",
  omitted: {
    usage: "There is no separate minimal call to show beyond DropdownMenu, ContextMenu and Menubar's own — each has a full Usage section on its own page, and the Preview above already shows all three side by side. A fourth snippet here would either repeat one of those three or invent a shape none of them actually is.",
    api: "menu exports no component of its own to table. DropdownMenu, ContextMenu and Menubar are three separately-tested exports with three different prop surfaces — Why below measures zero shared class strings between them — so a props list here would either merge three different APIs into one that does not exist, or duplicate one of the three and drift the moment it changed.",
    states: "Open/closed, hover, focus-visible and the destructive item variant are wired slightly differently per primitive — DropdownMenu's item carries a destructive-variant rule the others do not, per Why below — so a shared states table here would either flatten that difference or duplicate three separate ones already on their own pages.",
    responsive: "Positioning is entirely Radix's collision-aware Popper for DropdownMenu and ContextMenu, and the browser's own inline layout for Menubar's row of triggers — each repositions or wraps independently, and neither is something this decision page configures. See DropdownMenu, ContextMenu and Menubar's own pages for their specific reflow.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The three components this capability actually is, side by side: a trigger you place, a panel that opens at the pointer, and a row of always-visible triggers. Open each — none shares a class string with the others (see Why below).",
      label: "DropdownMenu · ContextMenu · Menubar",
      render: (
        <Row align="start" className="items-stretch">
          <Panel label="DropdownMenu" className="min-w-56 flex-1" bodyClassName="grid place-items-center">
            <DropdownMenuSpecimen />
          </Panel>
          <Panel label="ContextMenu" className="min-w-56 flex-1">
            <ContextMenuSpecimen />
          </Panel>
          <Panel label="Menubar" className="min-w-56 flex-1" bodyClassName="grid place-items-center">
            <MenubarSpecimen />
          </Panel>
        </Row>
      ),
      source: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuLabel>Project</DropdownMenuLabel>
    <DropdownMenuItem>Rename</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="cursor-context-menu">Right-click this card</div>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-48">
    <ContextMenuItem>Favourite</ContextMenuItem>
    <ContextMenuItem>Share pull</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Packs</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New pack</MenubarItem>
      <MenubarItem>Import card set</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Publish queue</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Users</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Search users</MenubarItem>
      <MenubarItem>Verification queue</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <Note>
          Install the menu you need: <Code>@elattar/dropdown-menu</Code> for a
          menu anchored to a trigger, <Code>@elattar/context-menu</Code> for one
          that opens at the pointer, or <Code>@elattar/menubar</Code> for a row
          of always-visible triggers. There is no <Code>menu</Code> item to add.
        </Note>
      ),
    },
    {
      kind: "disclosure",
      id: "which",
      title: "Which one to reach for",
      blocks: [
        {
          body: (
            <ul className="type-body list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <Code>DropdownMenu</Code> — opens against a trigger you place. The
                default choice.
              </li>
              <li>
                <Code>ContextMenu</Code> — opens at the pointer on right-click,
                with no visible trigger of its own.
              </li>
              <li>
                <Code>Menubar</Code> — a row of always-visible triggers, for a
                desktop-style command bar rather than one button&rsquo;s menu.
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why there is no shared menu module",
      blocks: [
        {
          body: (
            <div className="space-y-4">
              <p className="type-body text-muted-foreground">
                It is natural to ask for <Code>menu</Code> as the shared body of
                the menu components. The obvious move would be to hoist a common
                module out of the three components here — and the reason not to is measurable rather than
                a matter of taste.
              </p>
              <p className="type-body text-muted-foreground">
                Comparing every class string of eighty characters or more across{" "}
                <Code>dropdown-menu.tsx</Code>, <Code>context-menu.tsx</Code> and{" "}
                <Code>menubar.tsx</Code> finds <strong>none shared by all
                three</strong>, and none shared even between the closest pair.
                They are similar in shape and different in detail:
                DropdownMenu&rsquo;s item carries a destructive-variant rule the
                others do not, and each tunes its own focus and inset behaviour.
              </p>
              <p className="type-body text-muted-foreground">
                Extracting a shared body would therefore not be a refactor of
                existing duplication — it would be a behavioural change to three
                working, separately-tested components, made to satisfy a name.
                The name is documented here instead.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "The one part of this capability that genuinely is shared: all three primitives are Radix menus underneath, so the accessible name, role and dismissal model below hold for DropdownMenu, ContextMenu and Menubar alike, even though their visual API does not.",
      blocks: [
        {
          body: (
            <ul className="type-body list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <Code>role=&quot;menu&quot;</Code> on the content and{" "}
                <Code>role=&quot;menuitem&quot;</Code> (or{" "}
                <Code>menuitemcheckbox</Code>/<Code>menuitemradio</Code> for a
                checked item) on each entry — none of this system&rsquo;s three
                wrappers sets a role explicitly; all of it comes from Radix&rsquo;s
                own primitives.
              </li>
              <li>
                Accessible name comes from the trigger, not the content: a{" "}
                <Code>DropdownMenuTrigger</Code>&rsquo;s own text or{" "}
                <Code>aria-label</Code> announces the menu, a{" "}
                <Code>ContextMenu</Code> has no visible trigger so its host
                element needs a name of its own, and each{" "}
                <Code>MenubarTrigger</Code> names its own menu directly.
              </li>
              <li>
                Closing returns focus to the trigger that opened the menu —
                clicking an item, pressing <Code>Escape</Code>, or clicking
                outside all restore it, so a keyboard user never loses their
                place after acting.
              </li>
              <li>
                A destructive item (the <Code>variant=&quot;destructive&quot;</Code>{" "}
                shown on Delete in the Preview above) changes colour only —
                pair it with wording that already says what it does, since
                colour is never the sole signal per RULES §7.
              </li>
            </ul>
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
            <ul className="type-body list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                All three are built on Radix and share its menu keyboard model:
                arrow keys move between items, <Code>Enter</Code> and{" "}
                <Code>Space</Code> activate, <Code>Escape</Code> closes and
                returns focus to the trigger.
              </li>
              <li>
                Typing jumps to the first item starting with those characters.
              </li>
              <li>
                Submenus open on <Code>ArrowRight</Code> and close on{" "}
                <Code>ArrowLeft</Code>.
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        {
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
