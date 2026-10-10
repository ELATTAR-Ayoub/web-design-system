"use client";

/**
 * The three sidebar specimens that need state. Everything else on the page is
 * declarative and lives in `sidebar-specimens.tsx`.
 *
 * Sidebar examples use the same `Icon` composition as every other surface;
 * shell geometry must not create a second icon source of truth.
 */

import { useState } from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAV, ShellStage } from "@/components/ds/sidebar-specimens";

/* ── Shared body ──────────────────────────────────────────────────────────── */

function DemoNav() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {NAV.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label}>
                  <Icon icon={item.icon} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function InsetHeader({ label }: { label: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
      <SidebarTrigger />
      <span className="type-badge text-muted-foreground">{label}</span>
    </header>
  );
}

/* ── Provider & state ─────────────────────────────────────────────────────── */

/** `useSidebar` has no data-slot, so this readout is the only proof it works. */
function Readout() {
  const { state, open, openMobile, isMobile, toggleSidebar } = useSidebar();
  const rows: [string, string][] = [
    ["state", state],
    ["open", String(open)],
    ["openMobile", String(openMobile)],
    ["isMobile", String(isMobile)],
  ];

  return (
    <div className="p-6">
      <dl className="grid max-w-xs grid-cols-2 gap-x-4 gap-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="type-small text-muted-foreground">{k}</dt>
            <dd className="type-number-sm text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={toggleSidebar}
      >
        <Icon icon={PanelLeft} size="sm" tone="inherit" />
        toggleSidebar()
      </Button>
      <p className="type-small mt-4 max-w-md text-muted-foreground">
        The trigger, the rail and <Kbd>⌘B</Kbd> all move
        these same four fields, and the result is written to a{" "}
        <code className="type-code">sidebar_state</code> cookie for seven days —
        so the panel comes back the way you left it.
      </p>
    </div>
  );
}

export function StateReadoutDemo() {
  return (
    <ShellStage>
      <Sidebar collapsible="icon">
        <DemoNav />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <InsetHeader label="useSidebar()" />
        <Readout />
      </SidebarInset>
    </ShellStage>
  );
}

/* ── Rail & inset ─────────────────────────────────────────────────────────── */

export function RailInsetDemo() {
  return (
    <ShellStage>
      <Sidebar collapsible="icon">
        <DemoNav />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <InsetHeader label="SidebarInset" />
        <div className="p-6">
          <p className="type-small max-w-md text-muted-foreground">
            The strip down the panel&rsquo;s edge is{" "}
            <code className="type-code">SidebarRail</code> — 16px wide, drawing
            a 2px hairline on hover. Click anywhere on it.
          </p>
          <p className="type-small mt-3 max-w-md text-muted-foreground">
            This column is <code className="type-code">SidebarInset</code>, and
            it moves because it carries the peer selectors watching the
            panel&rsquo;s <code className="type-code">data-state</code>. A bare{" "}
            <code className="type-code">div</code> here would sit still and let
            the panel slide across it.
          </p>
        </div>
      </SidebarInset>
    </ShellStage>
  );
}

/* ── Shell matrix ─────────────────────────────────────────────────────────── */

const SIDES = ["left", "right"] as const;
const VARIANTS = ["sidebar", "floating", "inset"] as const;
const COLLAPSIBLES = ["offcanvas", "icon", "none"] as const;

function Knob<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="type-badge text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Button
            key={o}
            size="sm"
            variant={value === o ? "default" : "outline"}
            onClick={() => onChange(o)}
          >
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * The one control panel on this page, and the only place one is right.
 *
 * Every part-level property is shown all at once, the way the buttons page
 * shows seven variants side by side. These three cannot be: `side`, `variant`
 * and `collapsible` change the shell's *structure*, and three structures do not
 * fit in one frame. The panel is remounted on every change via `key`, so it is
 * rebuilt with the new behaviour rather than animating between two of them.
 */
export function ShellMatrixDemo() {
  const [side, setSide] = useState<(typeof SIDES)[number]>("left");
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("sidebar");
  const [collapsible, setCollapsible] =
    useState<(typeof COLLAPSIBLES)[number]>("icon");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-x-8 gap-y-5">
        <Knob label="side" value={side} options={SIDES} onChange={setSide} />
        <Knob
          label="variant"
          value={variant}
          options={VARIANTS}
          onChange={setVariant}
        />
        <Knob
          label="collapsible"
          value={collapsible}
          options={COLLAPSIBLES}
          onChange={setCollapsible}
        />
      </div>

      <ShellStage key={`${side}-${variant}-${collapsible}`}>
        <Sidebar side={side} variant={variant} collapsible={collapsible}>
          <DemoNav />
          {collapsible !== "none" && <SidebarRail />}
        </Sidebar>
        <SidebarInset>
          <InsetHeader label={`${side} · ${variant} · ${collapsible}`} />
        </SidebarInset>
      </ShellStage>
    </div>
  );
}
