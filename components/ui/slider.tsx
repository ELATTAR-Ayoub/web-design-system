"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  "aria-label": rootLabel,
  "aria-labelledby": labelledBy,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabels?: string[]
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const thumbName = (index: number) =>
    thumbLabels?.[index] ??
    (rootLabel
      ? _values.length > 1
        ? `${rootLabel} ${index + 1}`
        : rootLabel
      : undefined)

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-pill border border-input bg-muted shadow-pressed data-horizontal:h-2.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-2.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-action-ink shadow-btn-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbName(index)}
          aria-labelledby={thumbName(index) ? undefined : labelledBy}
          className={cn(
            "relative block size-5 shrink-0 rounded-full border border-input bg-foreground shadow-btn ring-ring/50 select-none",
            "transition-[transform,box-shadow] duration-fast ease-emphasized",
            "after:absolute after:-inset-3",
            "hover:scale-110 hover:ring-3",
            "focus-visible:ring-3 focus-visible:outline-hidden",
            "active:scale-125 active:ring-3",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
