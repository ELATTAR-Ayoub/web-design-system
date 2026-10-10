"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { BookIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";

// Vendored change: the props of what it renders — a Collapsible — so `open`, `defaultOpen` and `onOpenChange` type-check (upstream typed it as a div).
export type SourcesProps = ComponentProps<typeof Collapsible>;

// Vendored change: `text-primary` read the action ramp's fill shade (`--primary` aliases `--color-action`) directly as a foreground, which fails contrast in one theme.
export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn("not-prose mb-4 type-small text-action-ink", className)}
    {...props}
  />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    // Vendored change: a line of small text is a ~20px target; `after:` restores 44px without moving the layout.
    className={cn("relative after:absolute after:inset-x-0 after:-inset-y-3 flex items-center gap-2", className)}
    {...props}
  >
    {children ?? (
      <>
        {/* Vendored change: a <span> (a <p> is not allowed inside a button), and one source is "1 source", not "1 sources". */}
        <span className="type-nav">
          Used {count} {count === 1 ? "source" : "sources"}
        </span>
        <Icon icon={ChevronDownIcon} size="sm" tone="inherit" />
      </>
    )}
  </CollapsibleTrigger>
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

// Vendored change: dropped the hand-rolled tw-animate enter/exit/ `slide-*`/`fade-*` classes — `CollapsibleContent` already plays `anim-expand`/`anim-collapse` off Radix's measured height.
export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn("mt-3 flex w-fit flex-col gap-2 outline-none", className)}
    {...props}
  />
);

export type SourceProps = ComponentProps<"a">;

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="flex items-center gap-2"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}
  >
    {children ?? (
      <>
        <Icon icon={BookIcon} size="sm" tone="inherit" />
        <span className="block type-nav">{title}</span>
      </>
    )}
  </a>
);
