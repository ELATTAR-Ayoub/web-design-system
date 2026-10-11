"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-transform duration-normal ease-enter",
  {
    variants: {
      tone: {
        default: "bg-action-ink shadow-btn-primary",
        value: "bg-value-ink shadow-btn-value",
        success: "bg-success-ink shadow-btn",
        warning: "bg-warning-ink shadow-btn",
        destructive: "bg-destructive-ink shadow-btn",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

function Progress({
  className,
  value,
  tone = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressIndicatorVariants>) {
  const indeterminate = value === null || value === undefined

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-tone={tone}
      value={value}
      className={cn(
        "relative flex h-2.5 w-full items-center overflow-hidden rounded-pill border border-input bg-muted shadow-pressed",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          progressIndicatorVariants({ tone }),
          indeterminate &&
            "anim-progress-indeterminate w-1/3 flex-none transition-none",
        )}
        style={
          indeterminate
            ? undefined
            : { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressIndicatorVariants }
