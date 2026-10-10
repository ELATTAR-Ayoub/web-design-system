"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { Icon } from "@/components/ui/icon"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-background/15 supports-backdrop-filter:backdrop-blur-xs data-open:anim-enter data-closed:anim-exit [--enter-y:0px] [--enter-scale:1]",
        className
      )}
      {...props}
    />
  )
}

function keepOpenForToasts(
  handler: React.ComponentProps<typeof DialogPrimitive.Content>["onInteractOutside"]
): React.ComponentProps<typeof DialogPrimitive.Content>["onInteractOutside"] {
  return (event) => {
    const target = event.target
    if (target instanceof Element && target.closest("[data-sonner-toaster]")) event.preventDefault()
    handler?.(event)
  }
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  variant = "default",
  onInteractOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  variant?: "default" | "media"
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-close-button={showCloseButton || undefined}
        data-variant={variant}
        className={cn(
          "group/dialog-content fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none sm:max-w-sm data-open:anim-open data-closed:anim-close",
          variant === "media" && "gap-0 overflow-hidden p-0 sm:max-w-md",
          className
        )}
        {...props}
        onInteractOutside={keepOpenForToasts(onInteractOutside)}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className={cn(
                // overflow-visible: Button's overflow-hidden would clip the ::after hit area.
                "absolute top-3 right-3 overflow-visible after:absolute after:-inset-1.5",
                variant === "media" && "bg-popover/80 supports-backdrop-filter:backdrop-blur-xs"
              )}
              size="icon-sm"
            >
              <Icon icon={XIcon}
              />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-media"
      className={cn("relative aspect-video overflow-hidden bg-muted", className)}
      {...props}
    />
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "-mx-4 -mt-4 flex flex-col gap-2 rounded-t-xl border-b bg-muted/50 p-4 group-data-[close-button]/dialog-content:pr-12",
        "group-data-[variant=media]/dialog-content:mx-0 group-data-[variant=media]/dialog-content:mt-0 group-data-[variant=media]/dialog-content:rounded-none group-data-[variant=media]/dialog-content:border-0 group-data-[variant=media]/dialog-content:bg-transparent group-data-[variant=media]/dialog-content:p-4 group-data-[variant=media]/dialog-content:pb-2",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        "group-data-[variant=media]/dialog-content:mx-0 group-data-[variant=media]/dialog-content:mb-0 group-data-[variant=media]/dialog-content:rounded-none group-data-[variant=media]/dialog-content:border-0 group-data-[variant=media]/dialog-content:bg-transparent group-data-[variant=media]/dialog-content:pt-2",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-sans text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMedia,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
