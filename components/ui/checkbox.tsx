"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useReplayOnStateChange } from "@/components/ui/content-change"

const checkboxControlClassName =
  "relative flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-card shadow-pressed outline-none transition-[background-color,border-color,box-shadow] duration-fast ease-out"

function CheckboxMark({ indeterminate = false }: { indeterminate?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-3.5" aria-hidden>
      <path
        className="anim-change"
        d={indeterminate ? "M6 12h12" : "M5 12.5 10 17.5 19 7"}
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const ref = useReplayOnStateChange<HTMLButtonElement>()

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer",
        checkboxControlClassName,
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-btn-primary",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:shadow-btn-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <span className="group-data-[state=indeterminate]/checkbox:hidden">
          <CheckboxMark />
        </span>
        <span className="hidden group-data-[state=indeterminate]/checkbox:block">
          <CheckboxMark indeterminate />
        </span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, CheckboxMark, checkboxControlClassName }
