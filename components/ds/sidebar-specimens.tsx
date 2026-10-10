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

export const HOVER = "bg-sidebar-accent text-sidebar-accent-foreground";
export const FOCUS = "ring-2 ring-sidebar-ring";

export const NAV: { label: string; icon: LucideIcon; count: string | null }[] = [
  { label: "All cards", icon: Layers, count: "1,284" },
  { label: "Favourites", icon: Star, count: "37" },
  { label: "New this week", icon: Sparkles, count: null },
  { label: "Wallet", icon: Wallet, count: null },
];

export const ACCOUNT = {
  name: "Ayoub Elattar",
  email: "ayoub@eclipsevault.example",
};

export const FOOT_NAV: { label: string; icon: LucideIcon }[] = [
  { label: "Orders", icon: Receipt },
  { label: "Alerts", icon: Bell },
  { label: "Settings", icon: Settings },
];
