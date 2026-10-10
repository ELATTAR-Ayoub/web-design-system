"use client";

import { Icon } from "@/components/ui/icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";
import { ChevronDownIcon, Code } from "lucide-react";
import type { ComponentProps } from "react";

import { getStatusBadge } from "./tool";

export type SandboxRootProps = ComponentProps<typeof Collapsible>;

export const Sandbox = ({ className, ...props }: SandboxRootProps) => (
  <Collapsible
    className={cn(
      "not-prose group mb-4 w-full overflow-hidden rounded-md border",
      className
    )}
    defaultOpen
    {...props}
  />
);

export interface SandboxHeaderProps {
  title?: string;
  state: ToolUIPart["state"];
  className?: string;
}

export const SandboxHeader = ({
  className,
  title,
  state,
  ...props
}: SandboxHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      "flex min-h-(--size-target-min) w-full items-center justify-between gap-4 p-3",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      <Icon icon={Code} size="md" tone="muted" />
      <span className="type-nav text-foreground">{title}</span>
      {getStatusBadge(state)}
    </div>
    {/* Vendored change: raw lucide chevron replaced with `<Icon>`, and the bare `transition-transform` (no duration/easing) was silently instant. */}
    <Icon
      icon={ChevronDownIcon}
      size="md"
      tone="muted"
      className="transition-transform duration-normal ease-emphasized group-data-[state=open]:rotate-180"
    />
  </CollapsibleTrigger>
);

export type SandboxContentProps = ComponentProps<typeof CollapsibleContent>;

/** Vendored change: the open/close animation is now `CollapsibleContent`'s own job — it already carries `overflow-hidden` + `data-open:anim-expand` / `data-closed:anim-collapse`. */
export const SandboxContent = ({
  className,
  ...props
}: SandboxContentProps) => (
  <CollapsibleContent className={cn("outline-none", className)} {...props} />
);

export type SandboxTabsProps = ComponentProps<typeof Tabs>;

export const SandboxTabs = ({ className, ...props }: SandboxTabsProps) => (
  <Tabs className={cn("w-full gap-0", className)} {...props} />
);

export type SandboxTabsBarProps = ComponentProps<"div">;

export const SandboxTabsBar = ({
  className,
  ...props
}: SandboxTabsBarProps) => (
  <div
    className={cn(
      "flex w-full items-center border-border border-t border-b",
      className
    )}
    {...props}
  />
);

export type SandboxTabsListProps = ComponentProps<typeof TabsList>;

/** Vendored change: passes `variant="line"` through to the base `TabsList` instead of hand-rolling `rounded-none border-0 bg-transparent`. */
export const SandboxTabsList = ({
  className,
  ...props
}: SandboxTabsListProps) => (
  <TabsList
    className={cn("h-auto w-full justify-start gap-0 p-0", className)}
    variant="line"
    {...props}
  />
);

export type SandboxTabsTriggerProps = ComponentProps<typeof TabsTrigger>;

export const SandboxTabsTrigger = ({
  className,
  ...props
}: SandboxTabsTriggerProps) => (
  <TabsTrigger
    className={cn(
      "h-auto min-h-(--size-target-min) flex-none rounded-none px-4 py-2",
      className
    )}
    {...props}
  />
);

export type SandboxTabContentProps = ComponentProps<typeof TabsContent>;

export const SandboxTabContent = ({
  className,
  ...props
}: SandboxTabContentProps) => (
  <TabsContent className={cn("mt-0", className)} {...props} />
);
