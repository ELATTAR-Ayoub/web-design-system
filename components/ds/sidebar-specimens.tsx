/**
 * The stages every sidebar specimen sits on, and the fixtures they share.
 *
 * Deliberately NOT a `"use client"` module. Nothing here calls a hook — the
 * stages only compose client components, which a server component is allowed to
 * render. Marking it client would make `NAV` and `FOOT_NAV` client-reference
 * proxies rather than arrays, and the page that imports them is a server
 * component: `NAV[0]` came back `undefined` at module evaluation and the route
 * 500'd before rendering a single element.
 *
 * A sidebar is an app shell rather than a widget: `Sidebar` renders
 * `position: fixed` in every mode except `collapsible="none"`. That single fact
 * is why sidebar documentation normally links away to a full-page route to show
 * a rail or an inset. Neither stage below does, and between them they carry
 * every part of the component on one page.
 */

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Layers,
  Receipt,
  Settings,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";

import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * One part, shown on its own.
 *
 * `collapsible="none"` is the one mode upstream renders as a plain flex column
 * — the real component, carrying the real tokens, with no fixed positioning and
 * no viewport dependency. Every resting, hover, focus, active and disabled
 * specimen on the page sits in one of these.
 *
 * `SidebarProvider` is `flex min-h-svh w-full`, so without `min-h-0 w-auto` a
 * single specimen would claim the whole viewport.
 */
export function PartStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SidebarProvider className="min-h-0 w-auto">
      <Sidebar
        collapsible="none"
        className={cn(
          "rounded-lg border border-sidebar-border",
          className,
        )}
      >
        {children}
      </Sidebar>
    </SidebarProvider>
  );
}

/**
 * Context without the panel.
 *
 * `SidebarTrigger`, and anything else that calls `useSidebar`, throws outside a
 * provider — but a lone trigger shown on the sidebar's own surface would be a
 * lie about where it lives. It belongs in the inset's header, against
 * `--background`. This gives it the context and nothing else.
 */
export function ContextStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SidebarProvider className={cn("min-h-0 w-auto", className)}>
      {children}
    </SidebarProvider>
  );
}

/**
 * The whole shell, boxed.
 *
 * An ancestor carrying any `transform` other than `none` becomes the containing
 * block for its `position: fixed` descendants. So `transform-gpu` on this frame
 * traps a genuinely fixed panel inside it — rail, inset and collapse animation
 * included. That is CSS doing its documented job rather than a hack, and it is
 * the whole reason `SidebarRail` and `SidebarInset` can be documented in a
 * panel instead of behind a link.
 *
 * The panel is `h-svh`, which would still resolve against the viewport, so the
 * height is pinned here and the container told to fill the frame instead.
 *
 * Pass `defaultOpen={false}` for a collapsed specimen. That is a real collapsed
 * sidebar rather than a replica of the attributes one sets, which matters:
 * every `group-data-[collapsible=icon]` rule in the component only fires under
 * the real thing.
 */
export function ShellStage({
  children,
  defaultOpen = true,
  className,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate h-96 transform-gpu overflow-hidden rounded-lg border border-border",
        "[&_[data-slot=sidebar-container]]:h-full",
        className,
      )}
    >
      <SidebarProvider defaultOpen={defaultOpen} className="h-full min-h-0">
        {children}
      </SidebarProvider>
    </div>
  );
}

/**
 * Hover and focus cannot be photographed, so the cells that show them render
 * the real state classes directly and say so in their label. Same convention
 * the buttons page already uses — and every section that has one of these also
 * carries a live specimen you can actually hover.
 */
export const HOVER = "bg-sidebar-accent text-sidebar-accent-foreground";
export const FOCUS = "ring-2 ring-sidebar-ring";

/** One product across every specimen, so the page reads as a thing rather than a parts bin. */
export const NAV: { label: string; icon: LucideIcon; count: string | null }[] = [
  { label: "All cards", icon: Layers, count: "1,284" },
  { label: "Favourites", icon: Star, count: "37" },
  { label: "New this week", icon: Sparkles, count: null },
  { label: "Wallet", icon: Wallet, count: null },
];

/** The account the footer specimens show. Sample data, never a default. */
export const ACCOUNT = {
  name: "Ayoub Elattar",
  email: "ayoub@eclipsevault.example",
};

export const FOOT_NAV: { label: string; icon: LucideIcon }[] = [
  { label: "Orders", icon: Receipt },
  { label: "Alerts", icon: Bell },
  { label: "Settings", icon: Settings },
];
