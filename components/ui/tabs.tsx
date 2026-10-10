"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import {
  ActiveIndicator,
  useActiveIndicator,
} from "@/components/ui/active-indicator"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default:
          "gap-1 rounded-pill bg-muted p-1 group-data-horizontal/tabs:h-10 group-data-vertical/tabs:w-full",
        line: "gap-2 rounded-none bg-transparent group-data-horizontal/tabs:h-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const { containerRef, indicatorRef, arrivalRef } = useActiveIndicator(
    '[data-slot="tabs-trigger"][data-state="active"]',
  )

  return (
    <TabsPrimitive.List
      ref={containerRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      <ActiveIndicator
        indicatorRef={indicatorRef}
        arrivalRef={arrivalRef}
        className={
          variant === "line"
            ? "absolute rounded-pill bg-action-ink group-data-horizontal/tabs:inset-x-0 group-data-horizontal/tabs:bottom-0 group-data-horizontal/tabs:h-0.5 group-data-vertical/tabs:inset-y-0 group-data-vertical/tabs:right-0 group-data-vertical/tabs:w-0.5"
            : undefined
        }
      />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex flex-1 items-center justify-center gap-2 rounded-pill border border-transparent px-4 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none group-data-horizontal/tabs:h-8 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-2 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "transition-colors duration-normal ease-out",
        "data-active:bg-transparent group-data-[variant=default]/tabs-list:data-active:text-primary-foreground group-data-[variant=line]/tabs-list:data-active:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
