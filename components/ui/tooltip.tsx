"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const TooltipOpenContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function Tooltip({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  )
  const isControlled = open !== undefined
  const resolvedOpen = isControlled ? open : uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <TooltipOpenContext.Provider value={{ open: resolvedOpen, setOpen }}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={resolvedOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </TooltipOpenContext.Provider>
  )
}

type TooltipTriggerElement = React.ComponentRef<typeof TooltipPrimitive.Trigger>

function TooltipTrigger({
  onPointerDown,
  onPointerUp,
  ref,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const ctx = React.useContext(TooltipOpenContext)
  const lastPointerTypeRef = React.useRef<string | null>(null)
  // Captured at pointerdown: the trigger closes before pointerup reads it.
  const wasOpenRef = React.useRef(false)
  const nodeRef = React.useRef<TooltipTriggerElement | null>(null)

  const setRef = React.useCallback(
    (node: TooltipTriggerElement | null) => {
      nodeRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.RefObject<TooltipTriggerElement | null>).current = node
    },
    [ref]
  )

  React.useEffect(() => {
    if (!ctx?.open) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Element | null
      if (!target) return
      if (nodeRef.current?.contains(target)) return
      if (target.closest('[data-slot="tooltip-content"]')) return
      ctx?.setOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown, true)
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true)
  }, [ctx, ctx?.open])

  return (
    <TooltipPrimitive.Trigger
      ref={setRef}
      data-slot="tooltip-trigger"
      onPointerDown={(event) => {
        lastPointerTypeRef.current = event.pointerType
        wasOpenRef.current = ctx?.open ?? false
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        if (ctx && lastPointerTypeRef.current === "touch") {
          event.preventDefault()
          ctx.setOpen(!wasOpenRef.current)
        }
        onPointerUp?.(event)
      }}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:anim-open data-open:anim-open data-closed:anim-close",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
