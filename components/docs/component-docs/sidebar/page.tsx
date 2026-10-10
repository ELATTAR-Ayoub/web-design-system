/**
 * Authored documentation page for `sidebar`.
 *
 * Replaces the generated baseline. Migrated from
 * `app/design-system/components/base/sidebar/page.tsx`, since deleted, which held the whole
 * sidebar system's real documentation on one category page. `sidebar` is one
 * registry item with ~23 exports (Sidebar itself, SidebarProvider, every
 * `Sidebar*` region and row part, and `useSidebar`) — they are documented here
 * as one component's API surface and composition, not as parts with pages of
 * their own. `user-menu` and `active-indicator` are separate registry items
 * and have their own pages; this page composes them (the footer specimens use
 * the real `UserMenu`, and `SidebarMenu` uses `active-indicator` internally
 * for its travelling pill) without redocumenting them.
 *
 * Every specimen renders the real components from `components/ui/sidebar.tsx`.
 * The interactive specimens (`ShellMatrixDemo`, `StateReadoutDemo`,
 * `RailInsetDemo`, the three header patterns) are pre-existing client
 * components under `components/ds/sidebar-demos.tsx` and
 * `components/ds/sidebar-headers.tsx` — read-only fixtures this task may not
 * edit, composed here rather than duplicated. `PartStage`, `NAV`, `ACCOUNT`
 * and `FOOT_NAV` are the same read-only fixtures the category page used.
 *
 * Prop rows in API Reference come straight from `components/ui/sidebar.tsx`;
 * nothing is invented.
 */

import { BadgeCheck, Bell, CreditCard, LogOut, Plus } from "lucide-react";

import {
  Code,
  Meta,
  Note,
  Panel,
  StateCell,
  StateGrid,
} from "@/components/ds/kit";
import {
  RailInsetDemo,
  ShellMatrixDemo,
  StateReadoutDemo,
} from "@/components/ds/sidebar-demos";
import {
  SearchFormHeader,
  TeamSwitcherHeader,
  VersionSwitcherHeader,
} from "@/components/ds/sidebar-headers";
import {
  ACCOUNT,
  FOOT_NAV,
  NAV,
  PartStage,
} from "@/components/ds/sidebar-specimens";
import { Icon } from "@/components/ui/icon";
import { UserMenu, type UserMenuItem } from "@/components/ui/user-menu";
import {
  Sidebar,
  SidebarCollapsibleGroup,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

const FirstIcon = NAV[0].icon;

const ACCOUNT_ITEMS: UserMenuItem[] = [
  { label: "Account", icon: <Icon icon={BadgeCheck} /> },
  { label: "Billing", icon: <Icon icon={CreditCard} /> },
  { label: "Notifications", icon: <Icon icon={Bell} /> },
  { label: "Sign out", icon: <Icon icon={LogOut} />, destructive: true },
];

const BUTTON_VARIANTS = [
  "ghost",
  "default",
  "premium",
  "secondary",
  "outline",
  "destructive",
  "link",
] as const;

/* ── Shared fixtures, local to this page ──────────────────────────────────
 *
 * No hooks are called directly here — every function below only composes
 * client components this module imports, which a server component (this
 * spec module) is free to do.
 */

function FixtureHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="Eclipse Vault workspace">
            <span className="type-number-sm flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground shadow-chip">
              EV
            </span>
            <span className="grid min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
              <span className="type-nav truncate text-foreground">Eclipse Vault</span>
              <span className="type-small truncate text-muted-foreground">12 members</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarInput placeholder="Search cards" aria-label="Search cards" />
    </SidebarHeader>
  );
}

function FixtureMenu({
  items = NAV,
  activeLabel = NAV[0].label,
  badges = true,
}: {
  items?: typeof NAV;
  activeLabel?: string | null;
  badges?: boolean;
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton isActive={item.label === activeLabel} tooltip={item.label}>
            <Icon icon={item.icon} />
            <span>{item.label}</span>
          </SidebarMenuButton>
          {badges && item.count && <SidebarMenuBadge>{item.count}</SidebarMenuBadge>}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function FixtureContent() {
  return (
    <SidebarContent>
      <SidebarCollapsibleGroup
        label="Collection"
        toggleLabel="Toggle Collection group"
        action={
          <SidebarGroupAction aria-label="Add collection">
            <Icon icon={Plus} />
          </SidebarGroupAction>
        }
      >
        <FixtureMenu />
      </SidebarCollapsibleGroup>
      <SidebarSeparator />
      <SidebarCollapsibleGroup label="Activity" toggleLabel="Toggle Activity group">
        <SidebarMenu>
          {FOOT_NAV.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton tooltip={item.label}>
                <Icon icon={item.icon} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarCollapsibleGroup>
    </SidebarContent>
  );
}

function FixtureFooter() {
  return (
    <SidebarFooter>
      <UserMenu user={ACCOUNT} items={ACCOUNT_ITEMS} />
    </SidebarFooter>
  );
}

function CompleteFixture() {
  return (
    <>
      <FixtureHeader />
      <FixtureContent />
      <FixtureFooter />
    </>
  );
}

export const spec: ComponentDocSpec = {
  name: "sidebar",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A real SidebarProvider > Sidebar > SidebarInset shell — a workspace header, two collapsible groups sharing one menu fixture, a footer pinned by UserMenu, and an inset with its own trigger. Press the trigger, or ⌘B / Ctrl+B, to actually collapse it to an icon rail. Every other specimen on this page reuses FixtureHeader, FixtureMenu, FixtureContent or FixtureFooter rather than redrawing the sidebar.",
      flush: true,
      render: (
        <div className="grid lg:grid-cols-[1fr_20rem]">
          <div className="relative isolate h-160 transform-gpu overflow-hidden border-b border-border lg:border-r lg:border-b-0 [&_[data-slot=sidebar-container]]:h-full">
            <SidebarProvider className="h-full min-h-0">
              <Sidebar collapsible="icon">
                <CompleteFixture />
              </Sidebar>
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
                  <SidebarTrigger />
                  <span className="type-badge text-muted-foreground">Eclipse Vault</span>
                </header>
                <div className="p-6">
                  <p className="type-small max-w-sm text-muted-foreground">
                    This is SidebarInset — the &lt;main&gt; region beside the
                    panel. It moves and narrows as the panel collapses.
                  </p>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
          <div className="p-6">
            <Meta
              items={[
                { k: "Header", v: "One workspace button and one SidebarInput." },
                { k: "Content", v: "The only scrolling region; it owns the shared groups." },
                { k: "Menu", v: "One FixtureMenu supplies active state, counts and tooltips." },
                { k: "Footer", v: "One UserMenu composition, pinned by SidebarFooter." },
                { k: "Spacing", v: "p-3 regions and groups, gap-1 menus, equal X/Y row padding." },
              ]}
            />
          </div>
        </div>
      ),
      source: `<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="Eclipse Vault workspace">
            <span>EV</span>
            <span className="grid min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
              <span>Eclipse Vault</span>
              <span>12 members</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarInput placeholder="Search cards" aria-label="Search cards" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarCollapsibleGroup label="Collection" toggleLabel="Toggle Collection group">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="All cards">
              <Icon icon={Layers} />
              <span>All cards</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>1,284</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarCollapsibleGroup>
    </SidebarContent>
    <SidebarFooter>
      <UserMenu user={account} items={accountItems} />
    </SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <header className="flex h-16 items-center gap-3 border-b border-border px-6">
      <SidebarTrigger />
    </header>
    {children}
  </SidebarInset>
</SidebarProvider>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small max-w-2xl text-muted-foreground">
          Pulls in <Code>active-indicator</Code>, <Code>badge</Code>,{" "}
          <Code>button</Code>, <Code>collapsible</Code>, <Code>input</Code>,{" "}
          <Code>separator</Code>, <Code>sheet</Code>, <Code>skeleton</Code>,{" "}
          <Code>tooltip</Code> and <Code>use-mobile</Code> as registry
          dependencies. <Code>user-menu</Code> is a separate item — install it
          too for the footer composition shown above.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "A minimal SidebarProvider > Sidebar > SidebarContent > SidebarMenuButton composition. SidebarTrigger toggles it from anywhere inside the provider — including from beside SidebarInset, as here.",
      language: "tsx",
      code: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="All cards">
                    All cards
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b border-border px-6">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "Sidebar's own structural variants — side, variant and collapsible — shown on one interactive shell, plus the row's Button variants applied through SidebarMenuButton.",
      label: "Shell matrix",
      render: (
        <div className="space-y-6">
          <ShellMatrixDemo />
          <div>
            <p className="type-small mb-3 text-muted-foreground">
              Menu button variant — every Button variant is available on a
              row; the default is ghost, not Button&rsquo;s own default, so a
              column of rows is not a wall of primary blue.
            </p>
            <StateGrid cols={4}>
              {BUTTON_VARIANTS.map((variant) => (
                <StateCell key={variant} label={variant}>
                  <PartStage className="w-full rounded-none border-0">
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton variant={variant}>
                              <Icon icon={FirstIcon} />
                              <span>All cards</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </PartStage>
                </StateCell>
              ))}
            </StateGrid>
          </div>
        </div>
      ),
      source: `<Sidebar side="right" variant="floating" collapsible="icon">…</Sidebar>

<SidebarMenuButton variant="destructive">
  <Icon icon={Trash} />
  <span>Delete collection</span>
</SidebarMenuButton>`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "SidebarMenuButton's three row heights — 24 / 32 / 48 — mapped onto Button's own xs / sm / lg ladder. SidebarMenuAction and SidebarMenuBadge centre themselves against these same three heights.",
      label: "Row height",
      render: (
        <StateGrid cols={3}>
          {(["sm", "default", "lg"] as const).map((size) => (
            <StateCell key={size} label={size}>
              <PartStage className="w-full rounded-none border-0">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton size={size} isActive={size === "default"}>
                          <Icon icon={FirstIcon} />
                          <span>All cards</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </PartStage>
            </StateCell>
          ))}
        </StateGrid>
      ),
      source: `<SidebarMenuButton size="lg">…</SidebarMenuButton>`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The parts that make a sidebar a product: header patterns, group shapes, row extras, a submenu, a footer, and the full interactive shell with the rail and inset.",
      label: "Compositions",
      render: (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel label="Team switcher" note="sidebar-07" flush>
              <PartStage className="w-full rounded-none border-0"><TeamSwitcherHeader /></PartStage>
            </Panel>
            <Panel label="Version switcher" note="sidebar-01" flush>
              <PartStage className="w-full rounded-none border-0"><VersionSwitcherHeader /></PartStage>
            </Panel>
            <Panel label="Search form" note="sidebar-05" flush>
              <PartStage className="w-full rounded-none border-0"><SearchFormHeader /></PartStage>
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel label="Labelled group" flush>
              <PartStage className="w-full rounded-none border-0">
                <SidebarCollapsibleGroup label="Collection" toggleLabel="Toggle Collection group">
                  <FixtureMenu />
                </SidebarCollapsibleGroup>
              </PartStage>
            </Panel>
            <Panel label="Group + action" flush>
              <PartStage className="w-full rounded-none border-0">
                <SidebarCollapsibleGroup
                  label="Collection"
                  toggleLabel="Toggle Collection group"
                  action={<SidebarGroupAction aria-label="Add collection"><Icon icon={Plus} /></SidebarGroupAction>}
                >
                  <FixtureMenu />
                </SidebarCollapsibleGroup>
              </PartStage>
            </Panel>
            <Panel label="Unlabelled group" flush>
              <PartStage className="w-full rounded-none border-0">
                <SidebarGroup><SidebarGroupContent><FixtureMenu /></SidebarGroupContent></SidebarGroup>
              </PartStage>
            </Panel>
          </div>

          <Panel label="Row action and menu badge" flush>
            <PartStage className="w-full rounded-none border-0">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton><Icon icon={FirstIcon} /><span>All cards</span></SidebarMenuButton>
                      <SidebarMenuAction aria-label="Add card"><Icon icon={Plus} /></SidebarMenuAction>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton><Icon icon={FirstIcon} /><span>Reports</span></SidebarMenuButton>
                      <SidebarMenuBadge>3</SidebarMenuBadge>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </PartStage>
          </Panel>

          <Panel label="Submenu — nested rows under the shared active row" flush>
            <PartStage className="w-full rounded-none border-0">
              <SidebarGroup><SidebarGroupContent><SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive><Icon icon={FirstIcon} /><span>All cards</span></SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem><SidebarMenuSubButton isActive href="#">Open</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton href="#">Settled</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton href="#">Archived</SidebarMenuSubButton></SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu></SidebarGroupContent></SidebarGroup>
            </PartStage>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel label="Footer pinned below empty content" flush>
              <PartStage className="h-80 w-full rounded-none border-0">
                <FixtureHeader />
                <SidebarContent />
                <FixtureFooter />
              </PartStage>
            </Panel>
            <Panel label="Footer pinned below real content" flush>
              <PartStage className="h-80 w-full rounded-none border-0">
                <FixtureContent />
                <FixtureFooter />
              </PartStage>
            </Panel>
          </div>

          <Panel label="Rail and inset, in a bounded shell" flush>
            <RailInsetDemo />
          </Panel>

          <Panel label="useSidebar() readout" flush>
            <StateReadoutDemo />
          </Panel>
        </div>
      ),
      source: `<div className="grid gap-4 lg:grid-cols-3">
  <Panel label="Team switcher" note="sidebar-07" flush>
    <TeamSwitcherHeader />
  </Panel>
  <Panel label="Version switcher" note="sidebar-01" flush>
    <VersionSwitcherHeader />
  </Panel>
  <Panel label="Search form" note="sidebar-05" flush>
    <SearchFormHeader />
  </Panel>
</div>

<div className="grid gap-4 lg:grid-cols-3">
  <Panel label="Labelled group" flush>
    <SidebarCollapsibleGroup label="Collection" toggleLabel="Toggle Collection group">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive tooltip="All cards">
            <Icon icon={Layers} />
            <span>All cards</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>1,284</SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarCollapsibleGroup>
  </Panel>
  <Panel label="Group + action" flush>
    <SidebarCollapsibleGroup
      label="Collection"
      toggleLabel="Toggle Collection group"
      action={
        <SidebarGroupAction aria-label="Add collection">
          <Icon icon={Plus} />
        </SidebarGroupAction>
      }
    >
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive tooltip="All cards">
            <Icon icon={Layers} />
            <span>All cards</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>1,284</SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarCollapsibleGroup>
  </Panel>
  <Panel label="Unlabelled group" flush>
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="All cards">
              <Icon icon={Layers} />
              <span>All cards</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>1,284</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </Panel>
</div>

<Panel label="Row action and menu badge" flush>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Icon icon={Layers} />
            <span>All cards</span>
          </SidebarMenuButton>
          <SidebarMenuAction aria-label="Add card">
            <Icon icon={Plus} />
          </SidebarMenuAction>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Icon icon={Layers} />
            <span>Reports</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>3</SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</Panel>

<Panel label="Submenu — nested rows under the shared active row" flush>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive>
            <Icon icon={Layers} />
            <span>All cards</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton isActive href="#">Open</SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton href="#">Settled</SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton href="#">Archived</SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</Panel>

<div className="grid gap-4 lg:grid-cols-2">
  <Panel label="Footer pinned below empty content" flush>
    <SidebarHeader>…</SidebarHeader>
    <SidebarContent />
    <SidebarFooter>
      <UserMenu user={account} items={accountItems} />
    </SidebarFooter>
  </Panel>
  <Panel label="Footer pinned below real content" flush>
    <SidebarContent>…</SidebarContent>
    <SidebarFooter>
      <UserMenu user={account} items={accountItems} />
    </SidebarFooter>
  </Panel>
</div>

<Panel label="Rail and inset, in a bounded shell" flush>
  <RailInsetDemo />
</Panel>

<Panel label="useSidebar() readout" flush>
  <StateReadoutDemo />
</Panel>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Every part Sidebar ships. UserMenu and ActiveIndicator are documented on their own pages — Sidebar composes them, it does not own their API.",
      blocks: [
        {
          label: "SidebarProvider & Sidebar",
          body: (
            <Meta
              items={[
                {
                  k: "SidebarProvider",
                  v: "defaultOpen (default true), open, onOpenChange — controls desktop expand/collapse. No required props; wrap the whole shell in exactly one. Also mounts its own TooltipProvider (see Accessibility).",
                },
                {
                  k: "Sidebar",
                  v: 'side ("left" | "right", default left) · variant ("sidebar" | "floating" | "inset", default sidebar) · collapsible ("offcanvas" | "icon" | "none", default offcanvas). No required props.',
                },
                {
                  k: "SidebarTrigger",
                  v: 'Toggles the panel. Directional accessible name ("Collapse sidebar" / "Expand sidebar"), no required props.',
                },
                {
                  k: "SidebarRail",
                  v: "A 16px drag strip that does the same job as the trigger, aria-hidden from the tab sequence (tabindex=-1). No required props.",
                },
                {
                  k: "SidebarInset",
                  v: "The <main> region beside an inset-variant sidebar. Carries min-w-0 so a wide descendant scrolls inside itself instead of widening the whole page. No required props.",
                },
                {
                  k: "useSidebar",
                  v: "Hook returning { state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }. Throws outside SidebarProvider.",
                },
              ]}
            />
          ),
        },
        {
          label: "Structure",
          body: (
            <Meta
              items={[
                { k: "SidebarHeader / SidebarFooter / SidebarContent", v: 'Plain div regions (React.ComponentProps<"div">). SidebarContent is the only scrolling region. No required props.' },
                { k: "SidebarInput", v: "A styled Input (React.ComponentProps<typeof Input>). No required props beyond what Input itself needs." },
                { k: "SidebarSeparator", v: "A styled Separator. No required props." },
                { k: "SidebarGroup", v: "Plain div wrapper. No required props." },
                { k: "SidebarGroupLabel", v: "asChild?: boolean. No required props." },
                { k: "SidebarGroupAction", v: "A Button rendered as an icon action pinned to a group's top-right corner. Requires an aria-label (it renders icon-only)." },
                { k: "SidebarCollapsibleGroup", v: "label (ReactNode, required), toggleLabel (string, required — names the disclosure toggle), action?, defaultOpen (default true). Wraps Collapsible + SidebarGroup + SidebarGroupContent." },
              ]}
            />
          ),
        },
        {
          label: "Menu",
          body: (
            <Meta
              items={[
                { k: "SidebarMenu / SidebarMenuItem", v: "Plain ul / li wrappers. SidebarMenu also mounts the travelling active-indicator pill (see Preview and RULES §4)." },
                { k: "SidebarMenuButton", v: 'isActive? (default false) · variant (any Button variant, default "ghost") · size ("sm" | "default" | "lg", default "default", maps to Button\'s xs/sm/lg) · tooltip?: string | TooltipContent props, plus React.ComponentProps<"button">. isActive writes aria-current="page" unless overridden.' },
                { k: "SidebarMenuAction", v: "An icon-only Button pinned to a row's right edge. showOnHover? (default false) hides it until the row is hovered or focused. Requires an aria-label." },
                { k: "SidebarMenuBadge", v: 'A styled Badge (React.ComponentProps<typeof Badge>), default variant "secondary". No required props.' },
                { k: "SidebarMenuSkeleton", v: "Loading placeholder row. showIcon? (default false). Its width varies per instance, derived from useId() so server and client agree." },
                { k: "SidebarMenuSub / SidebarMenuSubItem", v: "Plain ul / li wrappers for nested rows. No required props." },
                { k: "SidebarMenuSubButton", v: 'asChild? · size ("sm" | "md", default "md") · isActive? · variant?, plus React.ComponentProps<"a">. Stays an <a> — its size branches in TypeScript rather than through a data-[…]: class.' },
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
        "Interaction states apply to SidebarMenuButton, the part a person actually presses. isActive is a value carried by the shared travelling pill, not a per-row paint — see Accessibility.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent><SidebarMenu><SidebarMenuItem>
                    <SidebarMenuButton><Icon icon={FirstIcon} /><span>All cards</span></SidebarMenuButton>
                  </SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
              <StateCell label="hover" note="Real hover class">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent><SidebarMenu><SidebarMenuItem>
                    <SidebarMenuButton className="bg-sidebar-accent text-sidebar-accent-foreground"><Icon icon={FirstIcon} /><span>All cards</span></SidebarMenuButton>
                  </SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
              <StateCell label="focus-visible" note="Tab to it">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent><SidebarMenu><SidebarMenuItem>
                    <SidebarMenuButton className="ring-2 ring-sidebar-ring"><Icon icon={FirstIcon} /><span>All cards</span></SidebarMenuButton>
                  </SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
              <StateCell label="active" note="Pill travels here">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent><FixtureMenu items={NAV.slice(0, 1)} /></SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
              <StateCell label="disabled">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent><SidebarMenu><SidebarMenuItem>
                    <SidebarMenuButton disabled><Icon icon={FirstIcon} /><span>All cards</span></SidebarMenuButton>
                  </SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
              <StateCell label="loading" note="SidebarMenuSkeleton">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent><SidebarMenu>
                    {[0, 1, 2].map((i) => (
                      <SidebarMenuItem key={i}>
                        <SidebarMenuSkeleton showIcon />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu></SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
              <StateCell label="empty" note="A group, not a row">
                <PartStage className="w-full rounded-none border-0">
                  <SidebarGroup><SidebarGroupContent>
                    <p className="type-small text-muted-foreground">No cards yet.</p>
                  </SidebarGroupContent></SidebarGroup>
                </PartStage>
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Reading the N/A rows">
              <p>
                <strong>pressed</strong> and <strong>error</strong> are N/A: a
                nav row navigates rather than submits, so it has no held-down
                visual distinct from hover and no validation state of its own —
                a row that fails to do its job is a broken link, not a form
                field.
              </p>
              <p className="mt-2">
                <strong>success</strong> is N/A for the same reason
                Checkbox&rsquo;s is: the row&rsquo;s action is instant
                navigation or selection, with no async completion of its own
                to draw.
              </p>
              <p className="mt-2">
                <strong>loading</strong> above is the real{" "}
                <Code>SidebarMenuSkeleton</Code>: it derives its randomised
                row width from <Code>useId()</Code> rather than{" "}
                <Code>Math.random()</Code>, so server and client render the
                same value and no hydration mismatch is logged.
              </p>
              <p className="mt-2">
                <strong>empty</strong> belongs to the group, not the row: a
                <Code>SidebarGroup</Code> with nothing in it, not a row with
                nothing in it.
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
        "Three corrections made against upstream shadcn, kept here because the sidebar is the component most likely to be regenerated from it.",
      blocks: [
        {
          body: (
            <Note tone="error" title="The provider is part of the component, not part of the app">
              <p>
                <Code>SidebarMenuButton tooltip</Code> renders a Radix{" "}
                <Code>Tooltip</Code>, and Radix throws —{" "}
                <Code>`Tooltip` must be used within `TooltipProvider`</Code> —
                on first render with no provider above it. A consumer who
                installs <Code>sidebar</Code> from the registry and follows
                the documented composition without an app-level provider got
                a runtime crash on first paint. <Code>SidebarProvider</Code>{" "}
                now supplies its own; nesting is safe because Radix&rsquo;s
                provider is plain context, so the innermost one wins.
              </p>
            </Note>
          ),
        },
        {
          body: (
            <Note title="An active row says so, and the trigger says which way it goes">
              <p>
                <Code>isActive</Code> used to write only <Code>data-active</Code>,
                which reaches CSS and nothing else — the selected row was
                carried by the travelling pill and a colour, both invisible to
                a screen reader. Rows and sub-rows now carry{" "}
                <Code>aria-current=&quot;page&quot;</Code> by default; pass
                your own when a row is not a destination.
              </p>
              <p className="mt-3">
                <Code>SidebarTrigger</Code> used to read &ldquo;Toggle
                Sidebar&rdquo; in both directions, so the glyph alone reported
                state. Its accessible name is now directional —
                &ldquo;Collapse sidebar&rdquo; becomes &ldquo;Expand
                sidebar&rdquo; when pressed. It deliberately carries no{" "}
                <Code>aria-expanded</Code>: Button&rsquo;s ghost variant paints{" "}
                <Code>aria-expanded:bg-secondary</Code> for popover triggers,
                which would leave the trigger permanently painted for the
                whole session the sidebar is open.
              </p>
            </Note>
          ),
        },
        {
          body: (
            <Meta
              items={[
                {
                  k: "SidebarProvider",
                  v: "Supplies its own TooltipProvider. Mount it once around the shell; an app-level provider above it is harmless.",
                },
                {
                  k: "SidebarMenuButton isActive",
                  v: 'Paints nothing itself — the menu\'s one pill travels — and writes aria-current="page".',
                },
                {
                  k: "SidebarTrigger",
                  v: "Directional accessible name, and an IconSwap that rolls rather than blinks. No aria-expanded, on purpose.",
                },
                {
                  k: "SidebarRail",
                  v: 'aria-label="Toggle Sidebar", tabindex=-1. A 16px invisible drag strip, deliberately not a tab stop and deliberately not named like the trigger.',
                },
                {
                  k: "SidebarMenuSubButton",
                  v: "Stays an <a>. Its size branches in TypeScript, because a .type-* class cannot be reached through a data-[…]: variant.",
                },
                {
                  k: "Mobile close focus",
                  v: "Escape or an outside click closes the off-canvas Sheet and restores focus to whatever opened it (the trigger, or whatever had focus when the keyboard shortcut fired) — Radix's own Dialog.Content restore targets a Dialog.Trigger, which the sidebar's Sheet has none of, so it is remembered and restored explicitly.",
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
        "The panel is reachable without ever touching the trigger, and every row is an ordinary Tab stop.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "⌘B / Ctrl+B",
                  v: "Toggles the sidebar open or closed from anywhere in the document — SidebarProvider listens on window, not on a focused element.",
                },
                { k: "Tab / Shift+Tab", v: "Moves focus row to row, and to the trigger and rail, in document order. A disabled row is removed from the sequence." },
                { k: "Enter / Space", v: "Activates the focused row or the trigger, matching a native <button> or <a>." },
                { k: "Escape", v: "On the mobile off-canvas Sheet, closes the drawer and returns focus to whatever opened it." },
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
        "One breakpoint governs the whole shell: below 768px the panel stops being an inline column and becomes a modal drawer.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Breakpoint",
                  v: "max-width: 767px, read from useIsMobile() (hooks/use-mobile.ts) — the same 768px step the rest of the system treats as the mobile/tablet boundary.",
                },
                {
                  k: "≥ 768px",
                  v: 'Sidebar renders inline, sliding under collapsible="offcanvas" or narrowing to an icon rail under collapsible="icon". SidebarRail and SidebarInset only exist in this mode.',
                },
                {
                  k: "< 768px",
                  v: "Sidebar renders as a Radix Sheet — a modal off-canvas drawer at --width-sidebar-mobile, driven by openMobile / setOpenMobile from useSidebar() instead of open / setOpen.",
                },
                {
                  k: "State persistence",
                  v: "The desktop open/closed state is written to a sidebar_state cookie for 7 days, so the panel returns the way it was left. The mobile drawer's open state is not persisted — it always starts closed.",
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
