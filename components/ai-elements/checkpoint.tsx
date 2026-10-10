"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

export type CheckpointProps = HTMLAttributes<HTMLDivElement>;

export const Checkpoint = ({
  className,
  children,
  ...props
}: CheckpointProps) => (
  <div
    className={cn(
      "flex items-center gap-0.5 overflow-hidden text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
    <Separator />
  </div>
);

// Vendored change: raw `LucideProps` is replaced by `Icon`'s props — tone/size
// come from the ladder (size is an `IconSize` word, not a pixel number), and
// every other SVG prop (e.g. strokeWidth) still forwards through `Icon`.
export type CheckpointIconProps = Omit<ComponentProps<typeof Icon>, "icon"> & {
  children?: ReactNode;
};

export const CheckpointIcon = ({
  className,
  children,
  tone = "muted",
  size = "md",
  ...props
}: CheckpointIconProps) =>
  children ?? (
    <Icon
      className={cn("shrink-0", className)}
      icon={BookmarkIcon}
      size={size}
      tone={tone}
      {...props}
    />
  );

export type CheckpointTriggerProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export const CheckpointTrigger = ({
  children,
  variant = "ghost",
  size = "sm",
  tooltip,
  className,
  ...props
}: CheckpointTriggerProps) =>
  tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className={className} size={size} type="button" variant={variant} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start" side="bottom">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button className={className} size={size} type="button" variant={variant} {...props}>
      {children}
    </Button>
  );
