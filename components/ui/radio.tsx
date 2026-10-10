"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useReplayOnStateChange } from "@/components/ui/content-change"
import { Disabled } from "@/components/ui/disabled"

const radioControlClassName =
  "relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full border border-input bg-card shadow-pressed outline-none transition-[background-color,border-color,box-shadow] duration-fast ease-out"

function RadioIndicator({ className }: { className?: string }) {
  return (
    <span
      data-slot="radio-group-indicator"
      className={cn("flex items-center justify-center", className)}
    >
      <span className="anim-change block size-2 rounded-full bg-primary-foreground shadow-e1" />
    </span>
  )
}

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  disabled,
  disabledReason,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  disabledReason?: string
}) {
  const ref = useReplayOnStateChange<HTMLButtonElement>()

  const item = (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-group-item"
      disabled={disabled}
      className={cn(
        "group/radio-group-item peer",
        radioControlClassName,
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:shadow-btn-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator asChild>
        <RadioIndicator />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (!disabledReason) return item

  return (
    <Disabled disabled={!!disabled} reason={disabledReason}>
      {item}
    </Disabled>
  )
}

export { RadioGroup, RadioGroupItem, RadioIndicator, radioControlClassName }
