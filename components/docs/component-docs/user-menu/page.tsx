/**
 * Authored documentation page for `user-menu`.
 *
 * Replaces the generated baseline. Migrated from
 * `app/design-system/components/base/sidebar/page.tsx`, since deleted, which documented this
 * component as part of the sidebar's "Footer" section. `user-menu` is its own
 * registry item — renamed from `nav-user` — so it gets its own page; Sidebar's
 * page links back here instead of redocumenting it.
 *
 * Every specimen renders the real `UserMenu` from `components/ui/user-menu.tsx`.
 * `UserMenu` calls `useSidebar()` internally (it renders `SidebarMenu` /
 * `SidebarMenuItem` and reads `isMobile`), so every specimen is mounted inside
 * the real `PartStage` fixture (`components/ds/sidebar-specimens.tsx`, a
 * read-only fixture this task may not edit), which wraps it in a real
 * `SidebarProvider` and `Sidebar`.
 */

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

import { Code, Meta, Panel } from "@/components/ds/kit";
import { PartStage } from "@/components/ds/sidebar-specimens";
import { Icon } from "@/components/ui/icon";
import { SidebarFooter } from "@/components/ui/sidebar";
import { UserMenu, type UserMenuItem } from "@/components/ui/user-menu";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

const USER = {
  name: "Ayoub Elattar",
  email: "ayoub@eclipsevault.example",
};

const ITEMS: UserMenuItem[] = [
  { label: "Account", icon: <Icon icon={BadgeCheck} /> },
  { label: "Billing", icon: <Icon icon={CreditCard} /> },
  { label: "Notifications", icon: <Icon icon={Bell} /> },
  { label: "Sign out", icon: <Icon icon={LogOut} />, destructive: true },
];

const NO_DESTRUCTIVE_ITEMS: UserMenuItem[] = ITEMS.filter((item) => !item.destructive);

export const spec: ComponentDocSpec = {
  name: "user-menu",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The account row a sidebar footer needs: identity, and a dropdown of actions. Click the row to open it.",
      render: (
        <PartStage className="w-72 rounded-none border-0">
          <SidebarFooter>
            <UserMenu user={USER} items={ITEMS} />
          </SidebarFooter>
        </PartStage>
      ),
      source: `<SidebarFooter>
  <UserMenu user={{ name: "Ayoub Elattar", email: "ayoub@eclipsevault.example" }} items={items} />
</SidebarFooter>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small max-w-2xl text-muted-foreground">
          Pulls in <Code>avatar</Code>, <Code>dropdown-menu</Code> and{" "}
          <Code>sidebar</Code> as registry dependencies — <Code>UserMenu</Code>{" "}
          renders <Code>SidebarMenu</Code> / <Code>SidebarMenuItem</Code> and
          calls <Code>useSidebar()</Code>, so it only ever works inside a{" "}
          <Code>SidebarProvider</Code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "items has no default — a default list would ship invented product actions (\"Upgrade to Pro\", \"Billing\") into the chassis. Every consumer supplies its own.",
      language: "tsx",
      code: `import { BadgeCheck, CreditCard, LogOut } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { SidebarFooter } from "@/components/ui/sidebar";
import { UserMenu, type UserMenuItem } from "@/components/ui/user-menu";

const items: UserMenuItem[] = [
  { label: "Account", icon: <Icon icon={BadgeCheck} />, onSelect: () => {} },
  { label: "Billing", icon: <Icon icon={CreditCard} />, onSelect: () => {} },
  { label: "Sign out", icon: <Icon icon={LogOut} />, destructive: true, onSelect: () => {} },
];

<SidebarFooter>
  <UserMenu user={{ name: "Ayoub Elattar", email: "ayoub@eclipsevault.example" }} items={items} />
</SidebarFooter>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "Identity always resolves to something visible — AvatarFallback draws initials from the name whenever no avatar prop is passed, or while one is loading, or after one fails — and the destructive group is optional.",
      label: "Compositions",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Initials fallback" note="No avatar prop" flush>
            <PartStage className="w-full rounded-none border-0">
              <SidebarFooter>
                <UserMenu user={USER} items={ITEMS} />
              </SidebarFooter>
            </PartStage>
          </Panel>
          <Panel label="No destructive group" flush>
            <PartStage className="w-full rounded-none border-0">
              <SidebarFooter>
                <UserMenu user={USER} items={NO_DESTRUCTIVE_ITEMS} />
              </SidebarFooter>
            </PartStage>
          </Panel>
        </div>
      ),
      source: `<div className="grid gap-4 lg:grid-cols-2">
  <Panel label="Initials fallback" note="No avatar prop" flush>
    <PartStage className="w-full rounded-none border-0">
      <SidebarFooter>
        <UserMenu
          user={{ name: "Ayoub Elattar", email: "ayoub@eclipsevault.example" }}
          items={items}
        />
      </SidebarFooter>
    </PartStage>
  </Panel>
  <Panel label="No destructive group" flush>
    <PartStage className="w-full rounded-none border-0">
      <SidebarFooter>
        <UserMenu
          user={{ name: "Ayoub Elattar", email: "ayoub@eclipsevault.example" }}
          items={items.filter((item) => !item.destructive)}
        />
      </SidebarFooter>
    </PartStage>
  </Panel>
</div>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "UserMenu",
          body: (
            <Meta
              items={[
                {
                  k: "user",
                  v: "{ name: string; email: string; avatar?: string } — required. avatar missing or failing to load falls back to initials drawn from name.",
                },
                {
                  k: "items",
                  v: "UserMenuItem[] — required, no default. Rendered in two groups: everything not marked destructive, then a separator, then every destructive item.",
                },
              ]}
            />
          ),
        },
        {
          label: "UserMenuItem",
          body: (
            <Meta
              items={[
                { k: "label", v: "string — required." },
                {
                  k: "icon",
                  v: 'React.ReactNode — required. A rendered element, e.g. <Icon icon={BadgeCheck} />, not a bare component reference: this module is a client component and the pages that use it are server components, and a bare LucideIcon function cannot cross that boundary.',
                },
                { k: "onSelect", v: "() => void — optional." },
                {
                  k: "destructive",
                  v: "boolean, default false. Rendered in the destructive tone, in its own group below a separator.",
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
                  k: "Trigger",
                  v: "A SidebarMenuButton (a real <button>) as a Radix DropdownMenuTrigger, via asChild. Its accessible name is the user's name, supplied as the tooltip.",
                },
                {
                  k: "Menu",
                  v: "Radix DropdownMenuContent, role=\"menu\" with role=\"menuitem\" rows, managed entirely by Radix — focus trapping, typeahead and outside-click dismissal all come from the primitive.",
                },
                {
                  k: "Destructive items",
                  v: "Rendered in DropdownMenuItem's destructive tone, separated from ordinary actions by a DropdownMenuSeparator rather than by colour alone.",
                },
                {
                  k: "Identity header",
                  v: "The name and email repeat at the top of the open menu (DropdownMenuLabel), so the menu is self-describing even if the trigger scrolled out of view.",
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
      description: "Entirely Radix DropdownMenu behaviour — nothing here is custom.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Enter / Space / ArrowDown", v: "On the focused trigger, opens the menu and moves focus to the first item." },
                { k: "ArrowUp / ArrowDown", v: "Moves focus between items while the menu is open." },
                { k: "Enter / Space", v: "Activates the focused item and closes the menu." },
                { k: "Escape", v: "Closes the menu and returns focus to the trigger." },
                { k: "Type-ahead", v: "Typing jumps focus to the next item whose label starts with the typed character." },
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
        "The dropdown's placement follows the sidebar's own width, not just a device class — measured against a defect where the menu opened off-screen.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Mobile (Sheet)",
                  v: "isMobile from useSidebar() is true; the menu opens below the trigger (side=\"bottom\") — there is no room beside a full-width drawer row.",
                },
                {
                  k: "max-width: 1023px, desktop",
                  v: 'Also opens "bottom". This is the system\'s own tablet boundary (768/1024 are the only two breakpoints), covered by a dedicated useIsNarrow() media query rather than isMobile: at exactly 768px the sidebar row is as wide as the screen even though isMobile is still false, so side="right" measured 694px wide starting 33px outside the viewport — found by photographing the open menu at 768px and being unable to explain the image.',
                },
                {
                  k: "≥ 1024px",
                  v: 'Opens beside the row (side="right", align="end"), bounded to min-w-56 max-w-72 so it reads as an extension of the row rather than a floating card.',
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
