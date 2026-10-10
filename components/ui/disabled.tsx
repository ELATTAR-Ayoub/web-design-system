"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type DisabledMode = "native" | "aria"

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(" ").trim()
  return merged.length > 0 ? merged : undefined
}

export interface DisabledProps {
  disabled: boolean
  reason?: string
  mode?: DisabledMode
  onDisabledAttempt?: () => void
  children: React.ReactElement
  className?: string
}

function Disabled({
  disabled,
  reason,
  mode = "native",
  onDisabledAttempt,
  children,
  className,
}: DisabledProps) {
  const reasonId = React.useId()
  const hasReason = Boolean(reason)

  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & {
      "aria-describedby"?: string
      "aria-disabled"?: boolean
      "data-disabled"?: boolean
    }
  >
  const childProps = child.props

  const describedBy = hasReason
    ? mergeIds(childProps["aria-describedby"], reasonId)
    : childProps["aria-describedby"]

  const ariaModeProps =
    mode === "aria"
      ? {
          "aria-disabled": disabled || undefined,
          "data-disabled": disabled || undefined,
          onClick: (event: React.MouseEvent<HTMLElement>) => {
            if (disabled) {
              event.preventDefault()
              event.stopPropagation()
              onDisabledAttempt?.()
              return
            }
            childProps.onClick?.(event)
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
            if (disabled && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault()
              event.stopPropagation()
              onDisabledAttempt?.()
              return
            }
            childProps.onKeyDown?.(event)
          },
        }
      : undefined

  const clonedChild = React.cloneElement(child, {
    "aria-describedby": describedBy,
    ...ariaModeProps,
  })

  return (
    <span
      data-slot="disabled"
      data-disabled={disabled || undefined}
      className={cn(
        "group/disabled relative inline-flex min-w-0 max-w-full items-center gap-1.5",
        disabled && "cursor-not-allowed",
        className
      )}
    >
      {clonedChild}
      {hasReason ? (
        <>
          <span id={reasonId} className="sr-only">
            {reason}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                // Always mounted; only visibility toggles, so the layout stays stable.
                disabled={!disabled}
                aria-hidden={!disabled}
                tabIndex={disabled ? 0 : -1}
                className={cn(
                  "relative shrink-0 rounded-full text-muted-foreground",
                  "after:absolute after:-inset-2.5",
                  !disabled && "invisible"
                )}
                // Keep the press from closing a host listbox.
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                // No focus change on press: a combobox input losing focus closes its list.
                onPointerDown={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  onDisabledAttempt?.()
                }}
              >
                <Icon icon={Info} size="sm" label="Why is this disabled" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64"
              aria-label="Why this is disabled"
              // Leave focus with the host listbox.
              onOpenAutoFocus={
                mode === "aria" ? (event) => event.preventDefault() : undefined
              }
              onCloseAutoFocus={
                mode === "aria" ? (event) => event.preventDefault() : undefined
              }
            >
              <p className="type-small text-popover-foreground">{reason}</p>
            </PopoverContent>
          </Popover>
        </>
      ) : null}
    </span>
  )
}

export { Disabled }
