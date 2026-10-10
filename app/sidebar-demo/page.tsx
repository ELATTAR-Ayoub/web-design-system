"use client";

/**
 * The live sidebar — and the one design-system page that is not under
 * `/design-system`.
 *
 * A real `Sidebar` is `fixed inset-y-0 h-svh`, an app shell rather than a
 * widget. That rules out a `Panel`, and it also rules out any route under
 * `app/design-system/layout.tsx`: that layout supplies the docs chrome,
 * including `DsSidebar` and a 1080px reading column, and a nested route in Next
 * cannot opt out of a parent layout. Rendering there would drop a fixed sidebar
 * on top of the documentation's own one.
 *
 * So it lives at the root, where the only layout is theme + tooltips + toaster.
 * The anatomy specimen on the Layout page uses `collapsible="none"` and carries
 * the same tokens; this route is the only place the four things that genuinely
 * need a viewport can be shown — collapsing, the rail, the mobile sheet, ⌘B.
 */

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronsUpDown,
  CircleGauge,
  Funnel,
  Layers,
  Plus,
  Receipt,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarCollapsibleGroup,
  SidebarGroupAction,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Kbd } from "@/components/ui/kbd";

const NAV = [
  { label: "Overview", icon: CircleGauge, count: null },
  { label: "Funnels", icon: Funnel, count: null },
  { label: "Retention", icon: Sparkles, count: null },
  { label: "Revenue", icon: Wallet, count: "$24.8k" },
  { label: "Users", icon: Users, count: null },
];

const EXPLORE = [
  { label: "Dashboard", icon: Layers, count: null },
  { label: "Segments", icon: Star, count: null },
  { label: "Reports", icon: Receipt, count: "3" },
];

const SIDES = ["left", "right"] as const;
const VARIANTS = ["sidebar", "floating", "inset"] as const;
const COLLAPSIBLES = ["offcanvas", "icon", "none"] as const;

function ShellSetting<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="type-small text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={value === option ? "default" : "outline"}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function SidebarDemoPage() {
  const [side, setSide] = useState<(typeof SIDES)[number]>("left");
  const [variant, setVariant] =
    useState<(typeof VARIANTS)[number]>("sidebar");
  const [collapsible, setCollapsible] =
    useState<(typeof COLLAPSIBLES)[number]>("icon");
  const [active, setActive] = useState("Overview");

  return (
    <SidebarProvider
      /* Structural shell settings remount the provider so state from one
         geometry cannot leak into the next. */
      key={`${side}-${variant}-${collapsible}`}
      className="min-h-svh"
    >
      <Sidebar side={side} variant={variant} collapsible={collapsible}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Lumen workspace">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground shadow-chip">
                  <Icon icon={Sparkles} size="sm" tone="inherit" />
                </span>
                <span className="grid min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                  <span className="type-nav truncate text-foreground">Lumen</span>
                  <span className="type-small truncate text-muted-foreground">12 members</span>
                </span>
                <Icon icon={ChevronsUpDown} className="ml-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarInput
            placeholder="Search cards"
            aria-label="Search cards"
            className="group-data-[collapsible=icon]:hidden"
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarCollapsibleGroup
            label="Essentials"
            toggleLabel="Toggle Essentials group"
          >
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={active === item.label}
                      onClick={() => setActive(item.label)}
                      tooltip={item.label}
                    >
                      <Icon icon={item.icon} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.count && (
                      <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
          </SidebarCollapsibleGroup>

          <SidebarSeparator />

          <SidebarCollapsibleGroup
            label="Explore"
            toggleLabel="Toggle Explore group"
            action={
              <SidebarGroupAction aria-label="Add view">
                <Icon icon={Plus} />
              </SidebarGroupAction>
            }
          >
              <SidebarMenu>
                {EXPLORE.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={active === item.label}
                      onClick={() => setActive(item.label)}
                      tooltip={item.label}
                    >
                      <Icon icon={item.icon} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.count && (
                      <SidebarMenuBadge variant="destructive">{item.count}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
          </SidebarCollapsibleGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="What's new">
                <Icon icon={Bell} />
                <span>What&apos;s new</span>
                <SidebarMenuBadge variant="ghost">2</SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Docs">
                <Icon icon={BookOpen} />
                <span>Docs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        {collapsible !== "none" && <SidebarRail />}
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
          <SidebarTrigger />
          <span className="type-small text-muted-foreground">{active}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="type-small hidden text-muted-foreground sm:inline">
              Toggle with
            </span>
            <Kbd>⌘</Kbd>
            <Kbd>B</Kbd>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/design-system/components/sidebar">
                <Icon icon={ArrowLeft} />
                Back to Sidebar
              </Link>
            </Button>
          </div>

          <section className="mb-8 rounded-xl border border-border bg-card p-4">
            <h2 className="type-h4 text-foreground">Shell settings</h2>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-5">
              <ShellSetting
                label="side"
                value={side}
                options={SIDES}
                onChange={setSide}
              />
              <ShellSetting
                label="variant"
                value={variant}
                options={VARIANTS}
                onChange={setVariant}
              />
              <ShellSetting
                label="collapsible"
                value={collapsible}
                options={COLLAPSIBLES}
                onChange={setCollapsible}
              />
            </div>
          </section>

          <div className="max-w-2xl space-y-4">
            <h1 className="type-h2 text-foreground">The live sidebar</h1>
            <p className="type-body">
              Four things here need a viewport and cannot be shown in a boxed
              specimen.
            </p>
            <ul className="space-y-3">
              <li className="type-small flex gap-3 text-muted-foreground">
                <Badge variant="outline">1</Badge>
                <span>
                  <strong className="text-foreground">Collapsing.</strong> Hit
                  the trigger, or press ⌘B. In rail mode the panel narrows to
                  48px and every label is replaced by a tooltip; off-canvas, it
                  leaves entirely.
                </span>
              </li>
              <li className="type-small flex gap-3 text-muted-foreground">
                <Badge variant="outline">2</Badge>
                <span>
                  <strong className="text-foreground">The rail.</strong> The
                  strip down the panel&rsquo;s right edge is a hit target —
                  click anywhere on it to toggle without aiming.
                </span>
              </li>
              <li className="type-small flex gap-3 text-muted-foreground">
                <Badge variant="outline">3</Badge>
                <span>
                  <strong className="text-foreground">The mobile sheet.</strong>{" "}
                  Narrow the window past 768px and the panel stops being a
                  panel: it becomes a Sheet over a scrim, at 18rem.
                </span>
              </li>
              <li className="type-small flex gap-3 text-muted-foreground">
                <Badge variant="outline">4</Badge>
                <span>
                  <strong className="text-foreground">Persistence.</strong> The
                  open state is written to a cookie for seven days, so a reload
                  keeps it. Toggle it and refresh.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
