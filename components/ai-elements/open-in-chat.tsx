"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

// Vendored change: no built-in providers; callers pass OpenInTarget.
export type OpenInTarget = {
  id: string;
  title: string;
  icon?: ReactNode;
  createUrl: (query: string) => string;
};

const OpenInContext = createContext<{ query: string } | undefined>(undefined);

const useOpenInContext = () => {
  const context = useContext(OpenInContext);
  if (!context) {
    throw new Error("OpenIn components must be used within an OpenIn provider");
  }
  return context;
};

export type OpenInProps = ComponentProps<typeof DropdownMenu> & {
  query: string;
};

export const OpenIn = ({ query, ...props }: OpenInProps) => {
  const contextValue = useMemo(() => ({ query }), [query]);

  return (
    <OpenInContext.Provider value={contextValue}>
      <DropdownMenu {...props} />
    </OpenInContext.Provider>
  );
};

export type OpenInContentProps = ComponentProps<typeof DropdownMenuContent>;

export const OpenInContent = ({ className, ...props }: OpenInContentProps) => (
  <DropdownMenuContent
    align="start"
    className={cn("w-60", className)}
    {...props}
  />
);

export type OpenInItemProps = ComponentProps<typeof DropdownMenuItem>;

export const OpenInItem = (props: OpenInItemProps) => (
  <DropdownMenuItem {...props} />
);

export type OpenInLabelProps = ComponentProps<typeof DropdownMenuLabel>;

export const OpenInLabel = (props: OpenInLabelProps) => (
  <DropdownMenuLabel {...props} />
);

export type OpenInSeparatorProps = ComponentProps<typeof DropdownMenuSeparator>;

export const OpenInSeparator = (props: OpenInSeparatorProps) => (
  <DropdownMenuSeparator {...props} />
);

export type OpenInTriggerProps = ComponentProps<typeof DropdownMenuTrigger>;

export const OpenInTrigger = ({ children, ...props }: OpenInTriggerProps) => (
  <DropdownMenuTrigger {...props} asChild>
    {children ?? (
      <Button type="button" variant="outline">
        Open in chat
        <Icon icon={ChevronDownIcon} size="md" />
      </Button>
    )}
  </DropdownMenuTrigger>
);

export type OpenInLinkProps = Omit<
  ComponentProps<typeof DropdownMenuItem>,
  "children"
> & { target: OpenInTarget };

export const OpenInLink = ({ target, ...props }: OpenInLinkProps) => {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem asChild {...props}>
      <a
        className="flex items-center gap-2"
        href={target.createUrl(query)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="shrink-0">
          {target.icon ?? <Icon icon={MessageCircleIcon} size="md" />}
        </span>
        <span className="flex-1">{target.title}</span>
        <Icon className="shrink-0" icon={ExternalLinkIcon} size="md" />
      </a>
    </DropdownMenuItem>
  );
};
