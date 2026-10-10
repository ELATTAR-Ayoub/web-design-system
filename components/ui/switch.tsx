"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useReplayOnStateChange } from "@/components/ui/content-change"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  const ref = useReplayOnStateChange<HTMLButtonElement>()

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-pill border border-input p-0.5 outline-none",
        "transition-[background-color,box-shadow,border-color] duration-normal ease-out",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-[state=unchecked]:bg-muted data-[state=unchecked]:shadow-pressed",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:shadow-btn-primary",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-foreground shadow-btn",
          "transition-transform duration-normal ease-emphasized",
          "group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4",
          "data-[state=unchecked]:translate-x-0",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-5",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-4"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
