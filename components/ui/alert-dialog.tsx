"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button, ButtonLabel } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function useLabelIsTruncated() {
  const ref = React.useRef<HTMLButtonElement | null>(null)
  const [truncated, setTruncated] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    const label = node?.querySelector<HTMLElement>('[data-slot="button-label"]')
    if (!label) return
    const measure = () => setTruncated(label.scrollWidth > label.clientWidth + 1)
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(label)
    return () => observer.disconnect()
  }, [])

  return [ref, truncated] as const
}

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-background/15 supports-backdrop-filter:backdrop-blur-xs data-open:anim-enter data-closed:anim-exit [--enter-y:0px] [--enter-scale:1]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:anim-open data-closed:anim-close",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex min-w-0 flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end [&>[data-slot=tooltip]]:min-w-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "type-h5 sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "type-small text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "destructive",
  size = "default",
  tooltip,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size"> & {
    tooltip?: React.ReactNode
    loading?: boolean
  }) {
  const fullLabel = tooltip ?? (typeof children === "string" ? children : null)
  const [ref, truncated] = useLabelIsTruncated()
  const [tipOpen, setTipOpen] = React.useState(false)
  // Tooltip only when the label is clipped; otherwise it would take the first Escape.
  const mayOpen = tooltip != null || truncated
  const action = (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        ref={ref}
        data-slot="alert-dialog-action"
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn("min-w-0 shrink!", className)}
        {...props}
      >
        {loading && <Spinner aria-hidden />}
        <ButtonLabel>{children}</ButtonLabel>
      </AlertDialogPrimitive.Action>
    </Button>
  )

  if (!fullLabel) return action

  return (
    <Tooltip open={mayOpen && tipOpen} onOpenChange={setTipOpen}>
      <TooltipTrigger asChild>{action}</TooltipTrigger>
      <TooltipContent>{fullLabel}</TooltipContent>
    </Tooltip>
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  tooltip,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size"> & {
    tooltip?: React.ReactNode
  }) {
  const fullLabel = tooltip ?? (typeof children === "string" ? children : null)
  const [ref, truncated] = useLabelIsTruncated()
  const [tipOpen, setTipOpen] = React.useState(false)
  // Tooltip only when the label is clipped; otherwise it would take the first Escape.
  const mayOpen = tooltip != null || truncated
  const cancel = (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        ref={ref}
        data-slot="alert-dialog-cancel"
        className={cn("min-w-0 shrink!", className)}
        {...props}
      >
        <ButtonLabel>{children}</ButtonLabel>
      </AlertDialogPrimitive.Cancel>
    </Button>
  )

  if (!fullLabel) return cancel

  return (
    <Tooltip open={mayOpen && tipOpen} onOpenChange={setTipOpen}>
      <TooltipTrigger asChild>{cancel}</TooltipTrigger>
      <TooltipContent>{fullLabel}</TooltipContent>
    </Tooltip>
  )
}

function AlertDialogConfirm({
  title,
  description,
  action = "Delete",
  cancel = "Cancel",
  onConfirm,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Root>, "children"> & {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  cancel?: React.ReactNode
  onConfirm: () => void
  children?: React.ReactNode
}) {
  return (
    <AlertDialog {...props}>
      {children ? <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <TooltipProvider>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>{action}</AlertDialogAction>
          </AlertDialogFooter>
        </TooltipProvider>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogConfirm,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
