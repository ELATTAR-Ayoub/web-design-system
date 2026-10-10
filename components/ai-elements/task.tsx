"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";

export type TaskItemFileProps = ComponentProps<"div">;

export const TaskItemFile = ({
  children,
  className,
  ...props
}: TaskItemFileProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 type-identifier text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type TaskItemProps = ComponentProps<"div">;

export const TaskItem = ({ children, className, ...props }: TaskItemProps) => (
  <div className={cn("type-small text-muted-foreground", className)} {...props}>
    {children}
  </div>
);

export type TaskProps = ComponentProps<typeof Collapsible>;

export const Task = ({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) => (
  <Collapsible className={cn(className)} defaultOpen={defaultOpen} {...props} />
);

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  title: string;
};

export const TaskTrigger = ({
  children,
  className,
  title,
  ...props
}: TaskTriggerProps) => (
  <CollapsibleTrigger asChild className={cn("group", className)} {...props}>
    {children ?? (
      // Vendored change: the trigger is a button, not a div, so the keyboard can reach it; `after:` restores a 44px target.
      <button
        className="relative after:absolute after:inset-x-0 after:-inset-y-3 flex w-full cursor-pointer items-center gap-2 text-left type-small text-muted-foreground transition-colors hover:text-foreground"
        type="button"
      >
        <Icon icon={SearchIcon} size="sm" tone="inherit" />
        <span className="type-small">{title}</span>
        <Icon
          className="transition-transform group-data-[state=open]:rotate-180"
          icon={ChevronDownIcon}
          size="sm"
          tone="inherit"
        />
      </button>
    )}
  </CollapsibleTrigger>
);

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>;

// Vendored change: dropped the hand-rolled tw-animate enter/exit classes; `CollapsibleContent` plays its own.
export const TaskContent = ({
  children,
  className,
  ...props
}: TaskContentProps) => (
  <CollapsibleContent
    className={cn("text-popover-foreground outline-none", className)}
    {...props}
  >
    <div className="mt-4 space-y-2 border-muted border-l-2 pl-4">
      {children}
    </div>
  </CollapsibleContent>
);
